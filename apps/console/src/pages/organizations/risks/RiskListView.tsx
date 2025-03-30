"use client";

import {
  graphql,
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import type { RiskListViewQuery } from "./__generated__/RiskListViewQuery.graphql";
import { useParams, useSearchParams } from "react-router";
import { PageTemplate } from "@/components/PageTemplate";
import { RiskViewSkeleton } from "./RiskListPage";
import { RiskListViewPaginationQuery } from "./__generated__/RiskListViewPaginationQuery.graphql";
import { RiskListView_risks$key } from "./__generated__/RiskListView_risks.graphql";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RiskListViewDeleteMutation } from "./__generated__/RiskListViewDeleteMutation.graphql";

const defaultPageSize = 25;

const riskListViewQuery = graphql`
  query RiskListViewQuery(
    $organizationId: ID!
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    organization: node(id: $organizationId) {
      id

      ...RiskListView_risks
        @arguments(first: $first, after: $after, last: $last, before: $before)
    }
  }
`;

const riskListFragment = graphql`
  fragment RiskListView_risks on Organization
  @refetchable(queryName: "RiskListViewPaginationQuery")
  @argumentDefinitions(
    first: { type: "Int" }
    after: { type: "CursorKey" }
    last: { type: "Int" }
    before: { type: "CursorKey" }
  ) {
    risks(first: $first, after: $after, last: $last, before: $before)
      @connection(key: "RiskListView_risks") {
      __id
      edges {
        node {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const deleteRiskMutation = graphql`
  mutation RiskListViewDeleteMutation(
    $input: DeleteRiskInput!
    $connections: [ID!]!
  ) {
    deleteRisk(input: $input) {
      deletedRiskId @deleteEdge(connections: $connections)
    }
  }
`;

function LoadAboveButton({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex justify-center mb-6">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Load above"}
      </Button>
    </div>
  );
}

function LoadBelowButton({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading || !hasMore}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Load below"}
      </Button>
    </div>
  );
}

function RiskListViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<RiskListViewQuery>;
}) {
  const data = usePreloadedQuery(riskListViewQuery, queryRef);
  const [, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();
  const { organizationId } = useParams<{ organizationId: string }>();
  const { toast } = useToast();

  // State for delete confirmation dialog
  const [riskToDelete, setRiskToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Setup delete mutation
  const [commitDeleteMutation] =
    useMutation<RiskListViewDeleteMutation>(deleteRiskMutation);

  const {
    data: risksConnection,
    loadNext,
    loadPrevious,
    hasNext,
    hasPrevious,
    isLoadingNext,
    isLoadingPrevious,
  } = usePaginationFragment<
    RiskListViewPaginationQuery,
    RiskListView_risks$key
  >(riskListFragment, data.organization);

  const risks = risksConnection?.risks?.edges?.map((edge) => edge.node) || [];
  const pageInfo = risksConnection?.risks?.pageInfo;
  const connectionId = risksConnection?.risks?.__id;

  // Handle delete risk
  const handleDeleteRisk = useCallback(() => {
    if (!riskToDelete || !connectionId) return;

    setIsDeleting(true);

    commitDeleteMutation({
      variables: {
        input: {
          riskId: riskToDelete.id,
        },
        connections: [connectionId],
      },
      onCompleted: (_, errors) => {
        setIsDeleting(false);
        setRiskToDelete(null);

        if (errors) {
          console.error("Error deleting risk:", errors);
          toast({
            title: "Error",
            description: "Failed to delete risk. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Risk deleted successfully.",
        });
      },
      onError: (error) => {
        setIsDeleting(false);
        setRiskToDelete(null);
        console.error("Error deleting risk:", error);
        toast({
          title: "Error",
          description: "Failed to delete risk. Please try again.",
          variant: "destructive",
        });
      },
    });
  }, [riskToDelete, connectionId, commitDeleteMutation, toast]);

  return (
    <PageTemplate
      title="Risks"
      actions={
        <Button asChild>
          <Link to={`/organizations/${organizationId}/risks/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Risk
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <LoadAboveButton
          isLoading={isLoadingPrevious}
          hasMore={hasPrevious}
          onLoadMore={() => {
            startTransition(() => {
              setSearchParams((prev) => {
                prev.set("before", pageInfo?.startCursor || "");
                prev.delete("after");
                return prev;
              });
              loadPrevious(defaultPageSize);
            });
          }}
        />

        <Card>
          <CardContent className="p-0">
            <div className="w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {risks.length === 0 ? (
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td
                        colSpan={3}
                        className="text-center p-4 align-middle text-muted-foreground"
                      >
                        No risks found. Create a new risk to get started.
                      </td>
                    </tr>
                  ) : (
                    risks.map((risk) => (
                      <tr
                        key={risk.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                      >
                        <td className="p-4 align-middle font-medium">
                          {risk.name}
                        </td>
                        <td className="p-4 align-middle">{risk.description}</td>
                        <td className="p-4 align-middle">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRiskToDelete({ id: risk.id, name: risk.name });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <LoadBelowButton
          isLoading={isLoadingNext}
          hasMore={hasNext}
          onLoadMore={() => {
            startTransition(() => {
              setSearchParams((prev) => {
                prev.set("after", pageInfo?.endCursor || "");
                prev.delete("before");
                return prev;
              });
              loadNext(defaultPageSize);
            });
          }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!riskToDelete}
          onOpenChange={(open) => !open && setRiskToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the risk &quot;{riskToDelete?.name}
                &quot;. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRiskToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteRisk}
                disabled={isDeleting}
                variant="destructive"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
}

export default function RiskListView() {
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] =
    useQueryLoader<RiskListViewQuery>(riskListViewQuery);

  const { organizationId } = useParams();

  useEffect(() => {
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    loadQuery({
      organizationId: organizationId!,
      first: before ? undefined : defaultPageSize,
      after: after || undefined,
      last: before ? defaultPageSize : undefined,
      before: before || undefined,
    });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <RiskViewSkeleton />;
  }

  return (
    <Suspense fallback={<RiskViewSkeleton />}>
      <RiskListViewContent queryRef={queryRef} />
    </Suspense>
  );
}
