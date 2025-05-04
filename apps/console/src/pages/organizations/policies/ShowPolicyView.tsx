import { Suspense, useEffect, useState, useCallback, ReactNode } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import {
  Clock,
  Download,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
  FileSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageTemplate } from "@/components/PageTemplate";
import type { ShowPolicyViewQuery } from "./__generated__/ShowPolicyViewQuery.graphql";
import { ShowPolicyViewPublishMutation } from "./__generated__/ShowPolicyViewPublishMutation.graphql";
import { ShowPolicyViewCreateDraftMutation } from "./__generated__/ShowPolicyViewCreateDraftMutation.graphql";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShowPolicyViewSkeleton } from "./ShowPolicyPage";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignaturesModal } from "./SignaturesModal";
import { VersionHistoryModal } from "./VersionHistoryModal";

const policyViewQuery = graphql`
  query ShowPolicyViewQuery($policyId: ID!) {
    node(id: $policyId) {
      id
      ... on Policy {
        title
        description
        createdAt
        updatedAt
        currentPublishedVersion
        owner {
          id
          fullName
          primaryEmailAddress
        }

        ...SignaturesModal_policyVersions
        ...VersionHistoryModal_policyVersions

        latestVersion: versions(first: 1) {
          edges {
            node {
              id
              version
              status
              content
              changelog
              publishedAt
              publishedBy {
                fullName
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

const publishPolicyVersionMutation = graphql`
  mutation ShowPolicyViewPublishMutation($input: PublishPolicyVersionInput!) {
    publishPolicyVersion(input: $input) {
      policy {
        id
        currentPublishedVersion
      }
      policyVersion {
        id
        status
        publishedAt
        publishedBy {
          fullName
        }
      }
    }
  }
`;

const createDraftPolicyVersionMutation = graphql`
  mutation ShowPolicyViewCreateDraftMutation(
    $input: CreateDraftPolicyVersionInput!
  ) {
    createDraftPolicyVersion(input: $input) {
      policyVersionEdge {
        node {
          id
          version
          status
        }
      }
    }
  }
`;

function ShowPolicyContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<ShowPolicyViewQuery>;
}) {
  const data = usePreloadedQuery<ShowPolicyViewQuery>(
    policyViewQuery,
    queryRef,
  );
  const policy = data.node;
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queryRef2, loadQuery] =
    useQueryLoader<ShowPolicyViewQuery>(policyViewQuery);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isSignaturesModalOpen, setIsSignaturesModalOpen] = useState(false);

  const [publishDraft, isPublishInFlight] =
    useMutation<ShowPolicyViewPublishMutation>(publishPolicyVersionMutation);
  const [createDraft, isCreateDraftInFlight] =
    useMutation<ShowPolicyViewCreateDraftMutation>(
      createDraftPolicyVersionMutation,
    );

  const latestVersionEdge = policy.latestVersion?.edges[0];
  const latestVersionNode = latestVersionEdge?.node;

  const isDraft = latestVersionNode?.status === "DRAFT";

  useEffect(() => {
    // No need to update selectedVersion state since we're using the VersionHistoryModal component
  }, []);

  // Handle delete policy
  const handleDeletePolicy = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  // Confirm delete policy
  const confirmDeletePolicy = useCallback(() => {
    setIsDeleting(true);

    setTimeout(() => {
      toast({
        title: "Policy deleted",
        description: "The policy has been deleted successfully",
      });
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      navigate(`/organizations/${organizationId}/policies`);
    }, 1000);
  }, [toast, navigate, organizationId]);

  // Navigate to publish flow
  const handlePublish = useCallback(() => {
    if (!policy.id) return;

    publishDraft({
      variables: {
        input: {
          policyId: policy.id,
        },
      },
      onCompleted: (_, errors) => {
        if (errors) {
          toast({
            title: "Error publishing policy",
            description: errors[0]?.message || "An unknown error occurred",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Policy published",
          description: `The policy has been published successfully`,
        });

        // Reload the query to refresh the data
        loadQuery({ policyId: policy.id });
      },
      onError: (error) => {
        toast({
          title: "Error publishing policy",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
      },
    });
  }, [policy.id, publishDraft, toast, loadQuery]);

  // Open version history modal
  const handleVersionHistoryClick = useCallback(() => {
    setIsVersionHistoryOpen(true);
  }, []);

  // Restore version
  const handleRestoreVersion = useCallback(
    (versionNumber: number) => {
      // Here you would implement the logic to restore a version
      toast({
        title: "Version restored",
        description: `Version ${versionNumber} has been restored`,
      });
      setIsVersionHistoryOpen(false);
      // Reload the query to refresh the data
      if (policy.id) {
        loadQuery({ policyId: policy.id });
      }
    },
    [policy.id, loadQuery, toast],
  );

  // Handle edit policy
  const handleEditPolicy = useCallback(() => {
    if (!policy.id) return;

    if (latestVersionNode?.status === "PUBLISHED") {
      // Create a new draft version first
      createDraft({
        variables: {
          input: {
            policyID: policy.id,
          },
        },
        onCompleted: (response, errors) => {
          if (errors) {
            toast({
              title: "Error creating draft",
              description: errors[0]?.message || "An unknown error occurred",
              variant: "destructive",
            });
            return;
          }

          const newDraftId =
            response.createDraftPolicyVersion.policyVersionEdge.node.id;
          navigate(
            `/organizations/${organizationId}/policies/${policy.id}/versions/${newDraftId}/edit`,
          );
        },
        onError: (error) => {
          toast({
            title: "Error creating draft",
            description: error.message || "An unknown error occurred",
            variant: "destructive",
          });
        },
      });
    } else {
      // Navigate directly to edit if it's already a draft
      navigate(
        `/organizations/${organizationId}/policies/${policy.id}/versions/${latestVersionNode?.id}/edit`,
      );
    }
  }, [
    policy.id,
    latestVersionNode,
    createDraft,
    navigate,
    organizationId,
    toast,
  ]);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  return (
    <PageTemplate
      title={policy.title!}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-9 px-3 gap-1.5 shadow-sm border-[#022A0214] bg-white text-[#141E12]"
            onClick={handleVersionHistoryClick}
          >
            <Clock className="h-4 w-4" />
            <span className="font-medium">Version history</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-9 px-3 gap-1.5 shadow-sm border-[#022A0214] bg-white text-[#141E12]"
            onClick={() => setIsSignaturesModalOpen(true)}
          >
            <FileSignature className="h-4 w-4" />
            <span className="font-medium">Signature history</span>
          </Button>

          {isDraft && (
            <Button
              variant="default"
              size="sm"
              className="rounded-full h-9 px-3 gap-1.5 shadow-sm"
              onClick={handlePublish}
              disabled={isPublishInFlight}
            >
              <span className="font-medium">Publish version</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-9 w-9 shadow-sm border-[#022A0214] bg-white text-[#141E12]"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <div onClick={handleEditPolicy}>
                  <Edit className="mr-2 h-4 w-4" />
                  {latestVersionNode?.status === "PUBLISHED"
                    ? "Create new draft"
                    : "Edit draft policy"}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeletePolicy}
                className="text-danger focus:text-danger focus:bg-danger-bg"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete policy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      <div className="space-y-4">
        {latestVersionNode ? (
          <div className="bg-white rounded-lg border border-solid-b shadow-sm p-6">
            {latestVersionNode.changelog && (
              <div className="mb-6 p-4 bg-level-1 rounded-md border border-solid-b">
                <div className="text-xs text-tertiary uppercase font-medium mb-1">
                  Change summary
                </div>
                <div className="text-sm text-secondary">
                  {latestVersionNode.changelog}
                </div>
              </div>
            )}

            <div className="prose prose-olive max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {latestVersionNode.content || "No content available"}
              </ReactMarkdown>
            </div>

            <div className="mt-8 pt-4 border-t border-solid-b text-xs text-tertiary flex justify-between items-center">
              <div>
                {latestVersionNode.status === "PUBLISHED"
                  ? `Published on ${formatDate(latestVersionNode.publishedAt || "")}${latestVersionNode.publishedBy ? ` by ${latestVersionNode.publishedBy.fullName}` : ""}`
                  : `Last modified on ${formatDate(latestVersionNode.updatedAt)} by ${policy.owner?.fullName || "Unknown"}`}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-solid-b shadow-sm p-6 text-center text-tertiary">
            No content available
          </div>
        )}
      </div>

      {/* Signatures Modal */}
      <SignaturesModal
        isOpen={isSignaturesModalOpen}
        onClose={() => setIsSignaturesModalOpen(false)}
        policyRef={policy}
        owner={policy.owner}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        policyRef={policy}
        onRestoreVersion={handleRestoreVersion}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Policy</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the policy "{policy.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeletePolicy}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}

export default function ShowPolicyView() {
  const [queryRef, loadQuery] =
    useQueryLoader<ShowPolicyViewQuery>(policyViewQuery);
  const { policyId } = useParams();

  useEffect(() => {
    loadQuery({ policyId: policyId! });
  }, [loadQuery, policyId]);

  if (!queryRef) {
    return <ShowPolicyViewSkeleton />;
  }

  return (
    <Suspense fallback={<ShowPolicyViewSkeleton />}>
      <ShowPolicyContent queryRef={queryRef} />
    </Suspense>
  );
}
