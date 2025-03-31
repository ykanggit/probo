import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link, Outlet } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { FrameworkViewQuery as FrameworkViewQueryType } from "./__generated__/FrameworkViewQuery.graphql";
import type { FrameworkViewDeleteMutation } from "./__generated__/FrameworkViewDeleteMutation.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { FrameworkViewSkeleton } from "./FrameworkPage";
import { ControlList } from "./FrameworkView/ControlList";
import ControlView from "./controls/ControlView";

const FrameworkViewQuery = graphql`
  query FrameworkViewQuery($frameworkId: ID!) {
    node(id: $frameworkId) {
      id
      ... on Framework {
        name
        description
        ...ControlList_List
        firstControl: controls(
          first: 1
          orderBy: { field: CREATED_AT, direction: ASC }
        ) @connection(key: "FrameworkView_firstControl") {
          edges {
            node {
              id
              referenceId
              name
            }
          }
        }
      }
    }
  }
`;

const DeleteFrameworkMutation = graphql`
  mutation FrameworkViewDeleteMutation(
    $input: DeleteFrameworkInput!
    $connections: [ID!]!
  ) {
    deleteFramework(input: $input) {
      deletedFrameworkId @deleteEdge(connections: $connections)
    }
  }
`;

function FrameworkViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkViewQueryType>;
}) {
  const data = usePreloadedQuery(FrameworkViewQuery, queryRef);
  const framework = data.node;
  const control = data.node.firstControl?.edges[0];
  const navigate = useNavigate();
  const { organizationId, controlId } = useParams();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Setup delete mutation
  const [commitDeleteMutation] = useMutation<FrameworkViewDeleteMutation>(
    DeleteFrameworkMutation
  );

  const handleDeleteFramework = useCallback(() => {
    setIsDeleting(true);

    const connectionId = ConnectionHandler.getConnectionID(
      organizationId!,
      "FrameworkListView_frameworks"
    );

    commitDeleteMutation({
      variables: {
        input: {
          frameworkId: framework.id,
        },
        connections: [connectionId],
      },
      onCompleted: (_, errors) => {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);

        if (errors) {
          console.error("Error deleting framework:", errors);
          toast({
            title: "Error",
            description: "Failed to delete framework. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Framework deleted successfully.",
        });

        navigate(`/organizations/${organizationId}/frameworks`);
      },
      onError: (error) => {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        console.error("Error deleting framework:", error);
        toast({
          title: "Error",
          description: "Failed to delete framework. Please try again.",
          variant: "destructive",
        });
      },
    });
  }, [framework.id, organizationId, commitDeleteMutation, navigate, toast]);

  return (
    <PageTemplate
      title={framework.name ?? ""}
      description={framework.description || ""}
      actions={
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link
              to={`/organizations/${organizationId}/frameworks/${framework.id}/update`}
            >
              Edit Framework
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Framework
          </Button>
        </div>
      }
    >
      <div className="flex flex-row items-start justify-start w-full h-[calc(100vh-216px)] overflow-hidden -ml-8">
        <ControlList fragmentKey={framework} />
        {controlId && <ControlView controlId={control?.node.id} />}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Framework</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the framework &quot;
              {framework.name}&quot;? This action cannot be undone.
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
              onClick={handleDeleteFramework}
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

export default function FrameworkView() {
  const { frameworkId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<FrameworkViewQueryType>(FrameworkViewQuery);

  useEffect(() => {
    loadQuery({ frameworkId: frameworkId! });
  }, [loadQuery, frameworkId]);

  if (!queryRef) {
    return <FrameworkViewSkeleton />;
  }

  return (
    <Suspense fallback={<FrameworkViewSkeleton />}>
      <FrameworkViewContent queryRef={queryRef} />
    </Suspense>
  );
}
