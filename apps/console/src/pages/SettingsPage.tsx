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

interface Member {
  id: string;
  fullName: string;
  primaryEmailAddress: string;
  role: string;
}

function SettingsPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<SettingsPageQueryType>;
}) {
  const data = usePreloadedQuery(settingsPageQuery, queryRef);
  const organization = data.organization;
  const members: Member[] = [];
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
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
          <CardHeader>
            <CardTitle>Workspace members</CardTitle>
            <CardDescription>
              Manage who has privileged access to your workspace and their
              permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {member.fullName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {member.primaryEmailAddress}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {member.role}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Remove member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
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
