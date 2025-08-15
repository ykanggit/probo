import {
  ActionDropdown,
  Avatar,
  Badge,
  Button,
  Card,
  DropdownItem,
  Field,
  FileButton,
  IconTrashCan,
  Label,
  PageHeader,
  Spinner,
  useConfirm,
  useToast,
} from "@probo/ui";
import { useTranslate } from "@probo/i18n";
import type { PreloadedQuery } from "react-relay";
import type { OrganizationGraph_ViewQuery } from "/hooks/graph/__generated__/OrganizationGraph_ViewQuery.graphql";
import { useFragment, useMutation, usePreloadedQuery } from "react-relay";
import { organizationViewQuery } from "/hooks/graph/OrganizationGraph";
import { useDebounceCallback } from "usehooks-ts";
import { graphql } from "relay-runtime";
import type {
  SettingsPageFragment$data,
  SettingsPageFragment$key,
} from "./__generated__/SettingsPageFragment.graphql";
import { useState, type ChangeEventHandler } from "react";
import { sprintf } from "@probo/helpers";
import type { NodeOf } from "/types";
import clsx from "clsx";
import { useMutationWithToasts } from "/hooks/useMutationWithToasts";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { InviteUserDialog } from "/components/organizations/InviteUserDialog";
import { useDeleteOrganizationMutation } from "/hooks/graph/OrganizationGraph";
import { useNavigate } from "react-router";
import { DeleteOrganizationDialog } from "/components/organizations/DeleteOrganizationDialog";

type Props = {
  queryRef: PreloadedQuery<OrganizationGraph_ViewQuery>;
};

const organizationFragment = graphql`
  fragment SettingsPageFragment on Organization {
    id
    name
    logoUrl
    mailingAddress
    telephoneNumber
    websiteUrl
    securityComplianceEmail
    companyDescription
    companyLegalName
    users(first: 100) {
      edges {
        node {
          id
          fullName
          email
          createdAt
        }
      }
    }
    connectors(first: 100) {
      edges {
        node {
          id
          name
          type
          createdAt
        }
      }
    }
  }
`;

const updateOrganizationMutation = graphql`
  mutation SettingsPage_UpdateMutation($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      organization {
        id
        name
        logoUrl
        mailingAddress
        telephoneNumber
        websiteUrl
        securityComplianceEmail
        companyDescription
        companyLegalName
      }
    }
  }
`;



export default function SettingsPage({ queryRef }: Props) {
  const { __ } = useTranslate();
  const navigate = useNavigate();
  const organizationKey = usePreloadedQuery(
    organizationViewQuery,
    queryRef
  ).node;
  const { toast } = useToast();
  const organization = useFragment<SettingsPageFragment$key>(
    organizationFragment,
    organizationKey
  );
  const [updateOrganization, isUpdating] = useMutation(
    updateOrganizationMutation
  );
  const [deleteOrganization, isDeleting] = useDeleteOrganizationMutation();
  const users = organization.users.edges.map((edge) => edge.node);

  const updateOrganizationName = useDebounceCallback((name: string) => {
    if (!name) {
      return "";
    }
    updateOrganization({
      variables: {
        input: {
          organizationId: organization.id,
          name,
        },
      },
    });
  }, 500);

  const updateOrganizationField = useDebounceCallback((field: string, value: string) => {
    if (!value) {
      return "";
    }
    const input: any = {
      organizationId: organization.id,
    };
    input[field] = value;
    updateOrganization({
      variables: {
        input,
      },
    });
  }, 500);

  const updateOrganizationLogo: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    updateOrganization({
      variables: {
        input: {
          organizationId: organization.id,
          logo: null,
        },
      },
      uploadables: {
        "input.logo": file,
      },
      onError(error) {
        toast({
          title: __("Failed to update organization logo"),
          description: error.message || __("Please try again."),
          variant: "error",
        });
      },
    });
  };

  const handleDeleteOrganization = () => {
    return deleteOrganization({
      variables: {
        input: {
          organizationId: organization.id,
        },
        connections: [],
      },
      onSuccess: () => {
        navigate("/", { replace: true });
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title={__("Settings")} />

      {/* Organization settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">
            {__("Organization details")}
          </h2>
          {isUpdating && <Spinner />}
        </div>
        <Card padded className="space-y-4">
          <div>
            <Label>{__("Organization logo")}</Label>
            <div className="flex w-max items-center gap-4">
              <Avatar
                src={organization.logoUrl}
                name={organization.name}
                size="xl"
              />
              <FileButton
                disabled={isUpdating}
                onChange={updateOrganizationLogo}
                variant="secondary"
                className="ml-auto"
              >
                {__("Change logo")}
              </FileButton>
            </div>
          </div>
          <Field
            readOnly={isUpdating}
            name="name"
            type="text"
            defaultValue={organization.name}
            label={__("Organization name")}
            placeholder={__("Organization name")}
            onChange={(e) => updateOrganizationName(e.currentTarget.value)}
          />
          <Field
            readOnly={isUpdating}
            name="companyLegalName"
            type="text"
            defaultValue={organization.companyLegalName || ""}
            label={__("Company legal name")}
            placeholder={__("Enter company legal name")}
            onChange={(e) => updateOrganizationField("companyLegalName", e.currentTarget.value)}
          />
          <Field
            readOnly={isUpdating}
            name="mailingAddress"
            type="textarea"
            defaultValue={organization.mailingAddress || ""}
            label={__("Mailing address")}
            placeholder={__("Enter mailing address")}
            onChange={(e) => updateOrganizationField("mailingAddress", e.currentTarget.value)}
          />
          <Field
            readOnly={isUpdating}
            name="telephoneNumber"
            type="text"
            defaultValue={organization.telephoneNumber || ""}
            label={__("Telephone number")}
            placeholder={__("Enter telephone number")}
            onChange={(e) => updateOrganizationField("telephoneNumber", e.currentTarget.value)}
          />
          <Field
            readOnly={isUpdating}
            name="websiteUrl"
            type="text"
            defaultValue={organization.websiteUrl || ""}
            label={__("Website URL")}
            placeholder={__("Enter website URL")}
            onChange={(e) => updateOrganizationField("websiteUrl", e.currentTarget.value)}
          />
          <Field
            readOnly={isUpdating}
            name="securityComplianceEmail"
            type="email"
            defaultValue={organization.securityComplianceEmail || ""}
            label={__("Security/Compliance email")}
            placeholder={__("Enter security/compliance email")}
            onChange={(e) => updateOrganizationField("securityComplianceEmail", e.currentTarget.value)}
          />
          <Field
            readOnly={isUpdating}
            name="companyDescription"
            type="textarea"
            defaultValue={organization.companyDescription || ""}
            label={__("Company/Product description")}
            placeholder={__("Enter company or product description")}
            onChange={(e) => updateOrganizationField("companyDescription", e.currentTarget.value)}
          />
        </Card>
      </div>

      {/* Integrations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">{__("Workspace members")}</h2>
          <InviteUserDialog>
            <Button variant="secondary">{__("Invite member")}</Button>
          </InviteUserDialog>
        </div>
        <Card className="divide-y divide-border-solid">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </Card>
      </div>

      {/* Integrations */}
      <div className="space-y-4">
        <h2 className="text-base font-medium">{__("Integrations")}</h2>
        <Card padded>
          <Connectors
            organizationId={organization.id}
            connectors={organization.connectors.edges.map((edge) => edge.node)}
          />
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-medium text-red-600">{__("Danger Zone")}</h2>
        <Card padded className="border-red-200 flex items-center gap-3">
          <div className="mr-auto">
            <h3 className="text-base font-semibold text-red-700">
              {__("Delete Organization")}
            </h3>
            <p className="text-sm text-txt-tertiary">
              {__("Permanently delete this organization and all its data.")}{" "}
              <span className="text-sm text-red-600 font-medium">
                {__("This action cannot be undone.")}
              </span>
            </p>
          </div>
          <DeleteOrganizationDialog
            organizationName={organization.name}
            onConfirm={handleDeleteOrganization}
            isDeleting={isDeleting}
          >
            <Button
              variant="danger"
              icon={IconTrashCan}
              disabled={isDeleting}
            >
              {isDeleting ? __("Deleting...") : __("Delete Organization")}
            </Button>
          </DeleteOrganizationDialog>
        </Card>
      </div>
    </div>
  );
}

function Connectors(props: {
  organizationId: string;
  connectors: NodeOf<SettingsPageFragment$data["connectors"]>[];
}) {
  const { __, dateTimeFormat } = useTranslate();
  const fakeconnectors = [
    {
      id: "github",
      name: "GitHub",
      type: "oauth2",
      createdAt: new Date(),
    },
  ] satisfies typeof props.connectors;
  const connectors = [
    {
      id: "github",
      name: "GitHub",
      type: "oauth2",
      description: __("Connect to GitHub repositories and issues"),
      ...fakeconnectors.find((connector) => connector.id === "github"),
    },
    {
      id: "slack",
      name: "Slack",
      type: "oauth2",
      description: __("Connect to Slack workspace and channels"),
      ...fakeconnectors.find((connector) => connector.id === "slack"),
    },
  ];

  const getUrl = (connectorId: string) => {
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const url = new URL("/api/console/v1/connectors/initiate", baseUrl);
    url.searchParams.append("organization_id", props.organizationId);
    url.searchParams.append("connector_id", connectorId);
    url.searchParams.append("continue", window.location.href);
    return url.toString();
  };

  return (
    <div className="space-y-2">
      {connectors.map((connector) => (
        <Card key={connector.id} padded className="flex items-center gap-3">
          <div>
            <img src={`/${connector.id}.png`} alt="" />
          </div>
          <div className="mr-auto">
            <h3 className="text-base font-semibold">{connector.name}</h3>
            <p className="text-sm text-txt-tertiary">
              {connector.createdAt
                ? sprintf(
                    __("Connected on %s"),
                    dateTimeFormat(connector.createdAt)
                  )
                : connector.description}
            </p>
          </div>
          {connector.createdAt ? (
            <div>
              <Badge variant="success" size="md">
                {__("Connected")}
              </Badge>
            </div>
          ) : (
            <Button variant="secondary" asChild>
              <a href={getUrl(connector.id)}>{__("Connect")}</a>
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}

const removeUserMutation = graphql`
  mutation SettingsPage_RemoveUserMutation($input: RemoveUserInput!) {
    removeUser(input: $input) {
      success
    }
  }
`;

function UserRow(props: { user: NodeOf<SettingsPageFragment$data["users"]> }) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();
  const [removeUser, isRemoving] = useMutationWithToasts(removeUserMutation, {
    successMessage: sprintf(
      __("User %s removed successfully"),
      props.user.fullName
    ),
    errorMessage: sprintf(__("Failed to remove user %s"), props.user.fullName),
  });
  const confirm = useConfirm();
  const [isRemoved, setIsRemoved] = useState(false);

  if (isRemoved) {
    return null;
  }

  const onRemove = async () => {
    confirm(
      () => {
        return removeUser({
          variables: {
            input: {
              userId: props.user.id,
              organizationId: organizationId,
            },
          },
          onSuccess: () => {
            setIsRemoved(true);
          },
        });
      },
      {
        message: sprintf(
          __("Are you sure you want to remove %s?"),
          props.user.fullName
        ),
      }
    );
  };

  return (
    <div
      className={clsx(
        "flex justify-between items-center py-4 px-4",
        isRemoving && "opacity-60 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar name={props.user.fullName} size="l" />
        <div>
          <h3 className="text-base font-semibold">{props.user.fullName}</h3>
          <p className="text-sm text-txt-tertiary">{props.user.email}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Badge>{__("Owner")}</Badge>
        {isRemoving ? (
          <Spinner size={16} />
        ) : (
          <ActionDropdown>
            <DropdownItem
              variant="danger"
              icon={IconTrashCan}
              onClick={onRemove}
            >
              {__("Remove")}
            </DropdownItem>
          </ActionDropdown>
        )}
      </div>
    </div>
  );
}
