import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const FrameworkViewQuery = graphql`
  query FrameworkViewQuery($frameworkId: ID!) {
    node(id: $frameworkId) {
      id
      ... on Framework {
        name
        description
        controls(first: 100, orderBy: { field: CREATED_AT, direction: ASC })
          @connection(key: "FrameworkView_controls") {
          edges {
            node {
              id
              referenceId
              name
              description
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
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract controls from the GraphQL response
  const controls = framework?.controls?.edges?.map((edge) => edge.node) || [];

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
      <div className="grid gap-6">
        {controls.length > 0 ? (
          controls.map((control) => (
            <Card key={control.id} className="overflow-hidden">
              <CardHeader className="bg-muted/20">
                <div
                  className="font-medium cursor-pointer flex items-center"
                  onClick={() => {
                    navigate(
                      `/organizations/${organizationId}/frameworks/${framework.id}/controls/${control.id}`
                    );
                  }}
                >
                  <span className="font-mono text-sm mr-3">
                    {control.referenceId}
                  </span>
                  <CardTitle>{control.name}</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {control.description}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold mb-3">Mitigations</h4>
                <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
                  <p>
                    Mitigations will be displayed here once connected to this
                    control
                  </p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to={`/organizations/${organizationId}/frameworks/${framework.id}/mitigations/create`}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Link Mitigation
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
            No controls available for this framework
          </div>
        )}
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
      {queryRef && <FrameworkViewContent queryRef={queryRef} />}
    </Suspense>
  );
}
