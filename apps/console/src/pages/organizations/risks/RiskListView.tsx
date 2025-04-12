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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { Plus, Trash2, Edit } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
          inherentLikelihood
          inherentImpact
          residualLikelihood
          residualImpact
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

// Helper function to convert float values to percentage
const floatToPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

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

// Define colors for risk matrix cells
const riskMatrixColors = {
  lowest: "bg-green-500 text-white",
  low: "bg-lime-300 text-black",
  medium: "bg-yellow-300 text-black",
  high: "bg-amber-400 text-white",
  highest: "bg-red-500 text-white",
};

// Empty cell variants (lighter colors)
const emptyRiskMatrixColors = {
  lowest: "bg-green-50 text-black",
  low: "bg-lime-50 text-black",
  medium: "bg-yellow-50 text-black",
  high: "bg-amber-50 text-black",
  highest: "bg-red-50 text-black",
};

// Risk Matrix Component
function RiskMatrix({
  risks,
  isResidual = false,
}: {
  risks: Array<{
    id: string;
    name: string;
    inherentLikelihood: number;
    inherentImpact: number;
    residualLikelihood?: number;
    residualImpact?: number;
  }>;
  isResidual?: boolean;
}): JSX.Element {
  // Define likelihood and impact ranges for the 5x5 matrix
  const likelihoodRanges: [number, number][] = [
    [0.8, 1], // Highest likelihood
    [0.6, 0.8], // High likelihood
    [0.4, 0.6], // Medium likelihood
    [0.2, 0.4], // Low likelihood
    [0, 0.2], // Lowest likelihood
  ];

  const impactRanges: [number, number][] = [
    [0, 0.2], // Lowest impact
    [0.2, 0.4], // Low impact
    [0.4, 0.6], // Medium impact
    [0.6, 0.8], // High impact
    [0.8, 1], // Highest impact
  ];

  const likelihoodLabels = ["Very High", "High", "Medium", "Low", "Very Low"];

  const impactLabels = ["Very Low", "Low", "Medium", "High", "Very High"];

  // Function to get cell content with risks that fall in this cell
  const getCellContent = (
    likelihoodRange: [number, number],
    impactRange: [number, number]
  ) => {
    return risks.filter((risk) => {
      const likelihood = isResidual
        ? risk.residualLikelihood ?? risk.inherentLikelihood
        : risk.inherentLikelihood;
      const impact = isResidual
        ? risk.residualImpact ?? risk.inherentImpact
        : risk.inherentImpact;

      return (
        likelihood > likelihoodRange[0] &&
        likelihood <= likelihoodRange[1] &&
        impact > impactRange[0] &&
        impact <= impactRange[1]
      );
    });
  };

  // Helper to determine cell color based on position in matrix
  // New matrix has rows indexed from top to bottom (0 = highest likelihood, 4 = lowest likelihood)
  // and columns indexed from left to right (0 = lowest impact, 4 = highest impact)
  const getCellColor = (row: number, col: number, isEmpty: boolean): string => {
    const colorSet = isEmpty ? emptyRiskMatrixColors : riskMatrixColors;

    // Top row (highest likelihood)
    if (row === 0) {
      if (col === 0) return colorSet.lowest;
      if (col === 1) return colorSet.high;
      return colorSet.highest;
    }

    // Second row
    if (row === 1) {
      if (col === 0) return colorSet.lowest;
      if (col === 1) return colorSet.medium;
      if (col === 2) return colorSet.high;
      return colorSet.highest;
    }

    // Middle row
    if (row === 2) {
      if (col === 0) return colorSet.lowest;
      if (col === 1) return colorSet.low;
      if (col === 2) return colorSet.medium;
      if (col === 3) return colorSet.high;
      return colorSet.highest;
    }

    // Fourth row
    if (row === 3) {
      if (col === 0) return colorSet.lowest;
      if (col === 1) return colorSet.low;
      if (col === 2 || col === 3) return colorSet.medium;
      return colorSet.high;
    }

    // Bottom row (lowest likelihood)
    if (row === 4) {
      if (col <= 1) return colorSet.lowest;
      if (col <= 3) return colorSet.low;
      return colorSet.medium;
    }

    return "bg-gray-100";
  };

  // Instead of using refs and tippy, we'll use a component with popover
  const RiskCell = ({
    rowIndex,
    colIndex,
    likelihoodRange,
    impactRange,
  }: {
    rowIndex: number;
    colIndex: number;
    likelihoodRange: [number, number];
    impactRange: [number, number];
  }) => {
    const cellRisks = getCellContent(likelihoodRange, impactRange);
    const isEmpty = cellRisks.length === 0;
    const cellColor = getCellColor(rowIndex, colIndex, isEmpty);

    if (isEmpty) {
      return (
        <td
          className={`border aspect-square w-14 h-14 text-center ${cellColor}`}
          data-risks={0}
        >
          <div className="text-sm font-bold flex items-center justify-center h-full"></div>
        </td>
      );
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <td
            className={`border aspect-square w-14 h-14 text-center ${cellColor} cursor-pointer hover:opacity-90`}
            data-risks={cellRisks.length}
          >
            <div className="text-sm font-bold flex items-center justify-center h-full">
              {cellRisks.length}
            </div>
          </td>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="center">
          <div className="font-medium mb-2">
            {cellRisks.length} Risk{cellRisks.length > 1 ? "s" : ""}:
          </div>
          <ul className="list-disc pl-4 space-y-1">
            {cellRisks.map((risk) => (
              <li key={risk.id} className="text-sm">
                {risk.name}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col">
        <div className="text-xs font-medium text-center mb-1">CONSEQUENCE</div>
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="p-1 text-center border w-14"></th>
              {impactLabels.map((label, index) => (
                <th
                  key={index}
                  className="p-1 text-xs text-center border font-medium w-14"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {likelihoodRanges.map((likelihoodRange, rowIndex) => (
              <tr key={rowIndex}>
                <th className="p-1 text-xs text-center border font-medium w-14 h-14">
                  {likelihoodLabels[rowIndex]}
                </th>
                {impactRanges.map((impactRange, colIndex) => (
                  <RiskCell
                    key={colIndex}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    likelihoodRange={likelihoodRange}
                    impactRange={impactRange}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs font-medium ml-2 mt-1">LIKELIHOOD</div>
      </div>
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

  // State for toggling between initial and residual risk matrix
  const [showResidualRisk, setShowResidualRisk] = useState(false);

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

        {/* Combined Risk Matrix with Toggle */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              {showResidualRisk
                ? "Residual Risk Matrix"
                : "Initial Risk Matrix"}
            </CardTitle>
            <div className="flex items-center space-x-4 border-2 border-gray-300 rounded-lg p-3 bg-gray-50 shadow-md">
              <Label
                htmlFor="risk-toggle"
                className={`text-sm font-semibold cursor-pointer ${
                  !showResidualRisk ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Initial
              </Label>
              <div className="relative">
                <Switch
                  id="risk-toggle"
                  checked={showResidualRisk}
                  onCheckedChange={setShowResidualRisk}
                  className="border-2 border-gray-400 data-[state=checked]:border-primary"
                />
              </div>
              <Label
                htmlFor="risk-toggle"
                className={`text-sm font-semibold cursor-pointer ${
                  showResidualRisk ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Residual
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <RiskMatrix risks={risks} isResidual={showResidualRisk} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-h-subtle-bg data-[state=selected]:bg-subtle-bg">
                    <th className="h-12 px-4 text-left align-middle font-medium text-tertiary w-1/2">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-tertiary w-1/4">
                      Inherent Severity
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-tertiary w-1/4">
                      Residual Severity
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-tertiary w-[120px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {risks.length === 0 ? (
                    <tr className="border-b transition-colors hover:bg-h-subtle-bg data-[state=selected]:bg-subtle-bg">
                      <td
                        colSpan={4}
                        className="text-center p-4 align-middle text-tertiary"
                      >
                        No risks found. Create a new risk to get started.
                      </td>
                    </tr>
                  ) : (
                    risks.map((risk) => (
                      <tr
                        key={risk.id}
                        className="border-b transition-colors hover:bg-h-subtle-bg data-[state=selected]:bg-subtle-bg cursor-pointer"
                      >
                        <td className="p-0 align-middle font-medium w-1/2">
                          <Link
                            to={`/organizations/${organizationId}/risks/${risk.id}`}
                            className="block p-4 h-full w-full"
                          >
                            {risk.name}
                          </Link>
                        </td>
                        <td className="p-0 align-middle w-1/4 whitespace-nowrap">
                          <Link
                            to={`/organizations/${organizationId}/risks/${risk.id}`}
                            className="block p-4 h-full w-full"
                          >
                            {floatToPercentage(
                              risk.inherentLikelihood * risk.inherentImpact
                            )}
                          </Link>
                        </td>
                        <td className="p-0 align-middle w-1/4 whitespace-nowrap">
                          <Link
                            to={`/organizations/${organizationId}/risks/${risk.id}`}
                            className="block p-4 h-full w-full"
                          >
                            {risk.residualLikelihood && risk.residualImpact
                              ? floatToPercentage(
                                  risk.residualLikelihood * risk.residualImpact
                                )
                              : "Not set"}
                          </Link>
                        </td>
                        <td className="p-4 align-middle w-[120px]">
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="mr-1"
                            >
                              <Link
                                to={`/organizations/${organizationId}/risks/${risk.id}/edit`}
                              >
                                <Edit className="h-4 w-4 text-tertiary" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setRiskToDelete({
                                  id: risk.id,
                                  name: risk.name,
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-danger" />
                            </Button>
                          </div>
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
