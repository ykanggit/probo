import { Button, Card, Dialog, DialogContent, DialogFooter, Field, Input, Spinner, Table, Tbody, Td, Th, Thead, Tr, useDialogRef, useToast, IconTrashCan } from "@probo/ui";
import { useTranslate } from "@probo/i18n";
import { useOutletContext } from "react-router";
import { useState, useCallback } from "react";
import {
  useTrustCenterAccesses,
  createTrustCenterAccessMutation,
  deleteTrustCenterAccessMutation
} from "/hooks/graph/TrustCenterAccessGraph";
import { useMutation } from "react-relay";

type ContextType = {
  organization: {
    id: string;
    trustCenter?: {
      id: string;
    };
  };
};

export default function TrustCenterAccessTab() {
  const { __ } = useTranslate();
  const { toast } = useToast();
  const { organization } = useOutletContext<ContextType>();

  const [createInvitation, isCreating] = useMutation(createTrustCenterAccessMutation);
  const [deleteInvitation, isDeleting] = useMutation(deleteTrustCenterAccessMutation);

  const dialogRef = useDialogRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  type AccessType = {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    };

  const trustCenterData = useTrustCenterAccesses(organization.trustCenter?.id || "");

  const accesses: AccessType[] = trustCenterData?.node?.accesses?.edges?.map(edge => ({
    id: edge.node.id,
    email: edge.node.email,
    name: edge.node.name,
    createdAt: new Date(edge.node.createdAt)
  })) ?? [];

  const handleInvite = useCallback(async () => {
    if (!organization.trustCenter?.id) {
      toast({
        title: __("Error"),
        description: __("Trust center not found"),
        variant: "error",
      });
      return;
    }

    if (!email.trim() || !name.trim()) {
      toast({
        title: __("Error"),
        description: __("Email and name are required"),
        variant: "error",
      });
      return;
    }

    const connectionId = trustCenterData?.node?.accesses?.__id;

    try {
      createInvitation({
        variables: {
          input: {
            trustCenterId: organization.trustCenter.id,
            email: email.trim(),
            name: name.trim(),
          },
          connections: connectionId ? [connectionId] : [],
        },
        onCompleted: (_, errors) => {
          if (errors && errors.length > 0) {
            toast({
              title: __("Error"),
              description: errors[0]?.message || __("Failed to send invitation"),
              variant: "error",
            });
            return;
          }

          if (dialogRef.current) {
            dialogRef.current.close();
          }
          setEmail("");
          setName("");

          toast({
            title: __("Success"),
            description: __("Access invitation sent successfully"),
            variant: "success",
          });
        },
        onError: (error) => {
          toast({
            title: __("Error"),
            description: error.message || __("Failed to send invitation. Please try again."),
            variant: "error",
          });
        },
      });
    } catch (error) {
      toast({
        title: __("Error"),
        description: __("An unexpected error occurred. Please try again."),
        variant: "error",
      });
    }
  }, [organization.trustCenter?.id, email, name, trustCenterData, createInvitation, toast, __, dialogRef]);

  const handleDelete = useCallback(async (accessId: string) => {
    const connectionId = trustCenterData?.node?.accesses?.__id;

    deleteInvitation({
      variables: {
        input: {
          accessId,
        },
        connections: connectionId ? [connectionId] : [],
      },
      onCompleted: () => {
        toast({
          title: __("Success"),
          description: __("Access deleted successfully"),
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: __("Error"),
          description: error.message,
          variant: "error",
        });
      },
    });
  }, [deleteInvitation, toast, __, trustCenterData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">{__("External Access")}</h3>
          <p className="text-sm text-txt-tertiary">
            {__("Manage who can access your trust center with time-limited tokens")}
          </p>
        </div>
        {organization.trustCenter?.id && (
          <Button onClick={() => dialogRef.current?.open()}>
            {__("Invite")}
          </Button>
        )}
      </div>

      <Card padded>
        {!organization.trustCenter?.id ? (
          <div className="text-center text-txt-tertiary py-8">
            <Spinner />
          </div>
        ) : accesses.length === 0 ? (
          <div className="text-center text-txt-tertiary py-8">
            {__("No external access granted yet")}
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>{__("Name")}</Th>
                <Th>{__("Email")}</Th>
                <Th>{__("Date")}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {accesses.map((access) => (
                <Tr key={access.id}>
                  <Td className="font-medium">{access.name}</Td>
                  <Td>{access.email}</Td>
                  <Td>
                    {access.createdAt.toLocaleDateString()}
                  </Td>
                  <Td noLink width={120} className="text-end">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(access.id)}
                        disabled={isDeleting}
                        icon={IconTrashCan}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      <Dialog
        ref={dialogRef}
        title={__("Invite External Access")}
      >
        <DialogContent padded className="space-y-4">
          <p className="text-txt-secondary text-sm">
            {__("Send a 7-day access token to an external person to view your trust center")}
          </p>

          <Field label={__("Full Name")} required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={__("John Doe")}
            />
          </Field>

          <Field label={__("Email Address")} required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={__("john@example.com")}
            />
          </Field>
        </DialogContent>

        <DialogFooter>
          <Button onClick={handleInvite} disabled={isCreating}>
            {isCreating && <Spinner />}
            {__("Send Invitation")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
