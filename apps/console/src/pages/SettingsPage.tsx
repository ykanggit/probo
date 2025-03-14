import { Building2, Upload, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Helmet } from "react-helmet-async";
import { Suspense, useEffect, useState, useRef } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import { useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SettingsPageQuery as SettingsPageQueryType } from "./__generated__/SettingsPageQuery.graphql";
import type { SettingsPageUpdateOrganizationMutation as SettingsPageUpdateOrganizationMutationType } from "./__generated__/SettingsPageUpdateOrganizationMutation.graphql";

const settingsPageQuery = graphql`
  query SettingsPageQuery($organizationID: ID!) {
    organization: node(id: $organizationID) {
      id
      ... on Organization {
        name
        logoUrl
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
      }
    }
  }
`;

const updateOrganizationMutation = graphql`
  mutation SettingsPageUpdateOrganizationMutation(
    $input: UpdateOrganizationInput!
  ) {
    updateOrganization(input: $input) {
      organization {
        id
        name
        logoUrl
      }
    }
  }
`;

function SettingsPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<SettingsPageQueryType>;
}) {
  const data = usePreloadedQuery(settingsPageQuery, queryRef);
  const organization = data.organization;
  const users = organization.users?.edges.map((edge) => edge.node) || [];
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [organizationName, setOrganizationName] = useState(
    organization.name || ""
  );
  const [isUploading, setIsUploading] = useState(false);

  const [updateOrganization] =
    useMutation<SettingsPageUpdateOrganizationMutationType>(
      updateOrganizationMutation
    );

  const handleUpdateName = () => {
    updateOrganization({
      variables: {
        input: {
          organizationId: organization.id,
          name: organizationName,
        },
      },
      onCompleted: () => {
        toast({
          title: "Organization updated",
          description: "Organization name has been updated successfully.",
          variant: "default",
        });
        setIsEditNameOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error updating organization",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a FileReader to read the file as a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setIsUploading(true);

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
        onCompleted: () => {
          setIsUploading(false);
          toast({
            title: "Logo updated",
            description: "Organization logo has been updated successfully.",
            variant: "default",
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: (error) => {
          setIsUploading(false);
          toast({
            title: "Error updating logo",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleInviteMember = () => {
    // This is a placeholder for the actual invite functionality
    // In a real implementation, we would use a GraphQL mutation to invite the user
    // For now, we just show a toast message and close the dialog
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
      variant: "default",
    });
    setIsInviteOpen(false);
    setInviteEmail("");
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-medium tracking-tight">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your details and personal preferences here.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization information</CardTitle>
            <CardDescription>Manage your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization logo</label>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-xs">
                <div className="flex items-center gap-3">
                  {organization.logoUrl ? (
                    <img
                      src={organization.logoUrl}
                      alt="Logo"
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-muted-foreground">
                    Upload a logo to be displayed at the top of your trust page
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Change image"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Organization name</label>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Set the name of the organization
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{organization.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOrganizationName(organization.name || "");
                      setIsEditNameOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Workspace members</CardTitle>
              <CardDescription>
                Manage who has privileged access to your workspace and their
                permissions.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInviteOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Invite member
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No members found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven&apos;t added any members to your workspace yet.
                  </p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.fullName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Owner
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600">
                            Remove member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Organization Name</DialogTitle>
            <DialogDescription>
              Update the name of your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="organization-name">Organization Name</Label>
              <Input
                id="organization-name"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Enter organization name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateName}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SettingsPageFallback() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [queryRef, loadQuery] =
    useQueryLoader<SettingsPageQueryType>(settingsPageQuery);

  const { organizationId } = useParams();

  useEffect(() => {
    loadQuery({ organizationID: organizationId! });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <SettingsPageFallback />;
  }

  return (
    <>
      <Helmet>
        <title>Settings - Probo Console</title>
      </Helmet>
      <Suspense fallback={<SettingsPageFallback />}>
        <SettingsPageContent queryRef={queryRef} />
      </Suspense>
    </>
  );
}
