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
import type { ListRiskViewQuery } from "./__generated__/ListRiskViewQuery.graphql";
import { useParams, useSearchParams } from "react-router";
import { PageTemplate } from "@/components/PageTemplate";
import { RiskViewSkeleton } from "./ListRiskPage";
import { ListRiskViewPaginationQuery } from "./__generated__/ListRiskViewPaginationQuery.graphql";
import { ListRiskView_risks$key } from "./__generated__/ListRiskView_risks.graphql";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ListRiskViewDeleteMutation } from "./__generated__/ListRiskViewDeleteMutation.graphql";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const defaultPageSize = 25;

const listRiskViewQuery = graphql`
  query ListRiskViewQuery(
    $organizationId: ID!
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    organization: node(id: $organizationId) {
      id

      ...ListRiskView_risks
        @arguments(first: $first, after: $after, last: $last, before: $before)
    }
  }
`;

const listRiskViewFragment = graphql`
  fragment ListRiskView_risks on Organization
  @refetchable(queryName: "ListRiskViewPaginationQuery")
  @argumentDefinitions(
    first: { type: "Int" }
    after: { type: "CursorKey" }
    last: { type: "Int" }
    before: { type: "CursorKey" }
  ) {
    risks(first: $first, after: $after, last: $last, before: $before)
      @connection(key: "ListRiskView_risks") {
      __id
      edges {
        node {
          id
          name
          inherentLikelihood
          inherentImpact
          residualLikelihood
          residualImpact
          treatment
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
  mutation ListRiskViewDeleteMutation(
    $input: DeleteRiskInput!
    $connections: [ID!]!
  ) {
    deleteRisk(input: $input) {
      deletedRiskId @deleteEdge(connections: $connections)
    }
  }
`;

// Helper function to convert float values to percentage
// This is kept for potential future use, like tooltips
const floatToPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

// Helper function to convert risk score to severity label
const riskScoreToSeverity = (score: number): string => {
  if (score >= 0.75) return "Catastrophic";
  if (score >= 0.5) return "Critical";
  if (score >= 0.25) return "Marginal";
  return "Negligible";
};

// Helper function to format treatment value
const formatTreatment = (treatment: string): string => {
  const treatmentMap: Record<string, string> = {
    MITIGATED: "Mitigate",
    ACCEPTED: "Accept",
    AVOIDED: "Avoid",
    TRANSFERRED: "Transfer",
  };

  return treatmentMap[treatment] || treatment;
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
  low: "bg-green-500 text-white",
  medium: "bg-yellow-300 text-black",
  high: "bg-red-500 text-white",
};

// Empty cell variants (lighter colors)
const emptyRiskMatrixColors = {
  low: "bg-green-50 text-black",
  medium: "bg-yellow-50 text-black",
  high: "bg-red-50 text-black",
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
  // Define impact ranges for the vertical axis (rows)
  const impactRanges: [number, number][] = [
    [0.8, 1], // Highest impact - top row
    [0.6, 0.8], // High impact
    [0.4, 0.6], // Medium impact
    [0.2, 0.4], // Low impact
    [0, 0.2], // Lowest impact - bottom row
  ];

  // Define likelihood ranges for the horizontal axis (columns)
  const likelihoodRanges: [number, number][] = [
    [0, 0.2], // Lowest likelihood - leftmost column
    [0.2, 0.4], // Low likelihood
    [0.4, 0.6], // Medium likelihood
    [0.6, 0.8], // High likelihood
    [0.8, 1], // Highest likelihood - rightmost column
  ];

  const impactLabels = [
    "Catastrophic",
    "Significant",
    "Moderate",
    "Low",
    "Negligible",
  ];

  const likelihoodLabels = [
    "Improbable",
    "Remote",
    "Occasional",
    "Probable",
    "Frequent",
  ];

  // Function to get cell content with risks that fall in this cell
  const getCellContent = (
    impactRange: [number, number],
    likelihoodRange: [number, number]
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
  // Matrix has rows indexed from top to bottom (0 = highest impact, 4 = lowest impact)
  // and columns indexed from left to right (0 = lowest likelihood, 4 = highest likelihood)
  const getCellColor = (row: number, col: number, isEmpty: boolean): string => {
    const colorSet = isEmpty ? emptyRiskMatrixColors : riskMatrixColors;

    // Top row (highest impact - Catastrophic)
    if (row === 0) {
      if (col <= 1) return colorSet.medium; // Yellow for first two cells
      return colorSet.high; // Red for the rest
    }

    // Second row (Significant impact)
    if (row === 1) {
      if (col === 0) return colorSet.low; // Green for first cell
      if (col <= 2) return colorSet.medium; // Yellow for next two
      return colorSet.high; // Red for the rest
    }

    // Middle row (Moderate impact)
    if (row === 2) {
      if (col === 0) return colorSet.low; // Green for first cell
      if (col <= 3) return colorSet.medium; // Yellow for next three
      return colorSet.high; // Red for last cell
    }

    // Fourth row (Low impact)
    if (row === 3) {
      if (col <= 1) return colorSet.low; // Green for first two
      return colorSet.medium; // Yellow for the rest
    }

    // Bottom row (lowest impact - Negligible)
    if (row === 4) {
      if (col <= 3) return colorSet.low; // Green for first four
      return colorSet.medium; // Yellow for last cell
    }

    return "bg-gray-100";
  };

  // Instead of using refs and tippy, we'll use a component with popover
  const RiskCell = ({
    rowIndex,
    colIndex,
    impactRange,
    likelihoodRange,
  }: {
    rowIndex: number;
    colIndex: number;
    impactRange: [number, number];
    likelihoodRange: [number, number];
  }) => {
    const cellRisks = getCellContent(impactRange, likelihoodRange);
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
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="flex">
            <div
              className="text-xs font-semibold flex items-center justify-center mr-2"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                alignSelf: "center",
              }}
            >
              Impact
            </div>
            <table className="w-full border-collapse table-fixed">
              <tbody>
                {impactRanges.map((impactRange, rowIndex) => (
                  <tr key={rowIndex}>
                    <th className="p-1 text-xs text-center border-0 font-medium w-14 h-14">
                      {impactLabels[rowIndex]}
                    </th>
                    {likelihoodRanges.map((likelihoodRange, colIndex) => (
                      <RiskCell
                        key={colIndex}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        impactRange={impactRange}
                        likelihoodRange={likelihoodRange}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th className="p-1 text-center border-0 w-14"></th>
                  {likelihoodLabels.map((label, index) => (
                    <th
                      key={index}
                      className="p-1 text-xs text-center border-t font-medium w-14"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex">
            <div style={{ width: "3.5rem" }}></div>
            <div className="text-center text-xs font-semibold mt-2 flex-1">
              Likelihood
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListRiskViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<ListRiskViewQuery>;
}) {
  const data = usePreloadedQuery(listRiskViewQuery, queryRef);
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
    useMutation<ListRiskViewDeleteMutation>(deleteRiskMutation);

  const {
    data: risksConnection,
    loadNext,
    loadPrevious,
    hasNext,
    hasPrevious,
    isLoadingNext,
    isLoadingPrevious,
  } = usePaginationFragment<
    ListRiskViewPaginationQuery,
    ListRiskView_risks$key
  >(listRiskViewFragment, data.organization);

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
          <CardContent className="pt-6">
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold">
                  {showResidualRisk ? "Residual risk" : "Current risk"}
                </h3>
                <div className="flex items-center space-x-4">
                  <Label
                    htmlFor="risk-toggle"
                    className={`text-sm font-semibold cursor-pointer ${
                      !showResidualRisk
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Initial
                  </Label>
                  <Switch
                    id="risk-toggle"
                    checked={showResidualRisk}
                    onCheckedChange={setShowResidualRisk}
                    className="bg-white border-2 border-gray-300 data-[state=checked]:bg-white data-[state=checked]:border-gray-300 [&_span]:bg-gray-300"
                  />
                  <Label
                    htmlFor="risk-toggle"
                    className={`text-sm font-semibold cursor-pointer ${
                      showResidualRisk
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Residual
                  </Label>
                </div>
              </div>
              <RiskMatrix risks={risks} isResidual={showResidualRisk} />
            </div>
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
                    <th className="h-12 px-4 text-left align-middle font-medium text-tertiary w-1/6">
                      Treatment
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-tertiary w-1/6">
                      Inherent Severity
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-tertiary w-1/6">
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
                        colSpan={5}
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
                        <td className="p-0 align-middle w-1/6 whitespace-nowrap">
                          <Link
                            to={`/organizations/${organizationId}/risks/${risk.id}`}
                            className="block p-4 h-full w-full"
                          >
                            {formatTreatment(risk.treatment)}
                          </Link>
                        </td>
                        <td className="p-0 align-middle w-1/6 whitespace-nowrap">
                          <Link
                            to={`/organizations/${organizationId}/risks/${risk.id}`}
                            className="block p-4 h-full w-full"
                          >
                            {riskScoreToSeverity(
                              risk.inherentLikelihood * risk.inherentImpact
                            )}
                          </Link>
                        </td>
                        <td className="p-0 align-middle w-1/6 whitespace-nowrap">
                          <Link
                            to={`/organizations/${organizationId}/risks/${risk.id}`}
                            className="block p-4 h-full w-full"
                          >
                            {risk.residualLikelihood && risk.residualImpact
                              ? riskScoreToSeverity(
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
      </div>
    </PageTemplate>
  );
}

export default function ListRiskView() {
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] =
    useQueryLoader<ListRiskViewQuery>(listRiskViewQuery);

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
  }, [loadQuery, organizationId, searchParams]);

  if (!queryRef) {
    return <RiskViewSkeleton />;
  }

  return (
    <Suspense fallback={<RiskViewSkeleton />}>
      <ListRiskViewContent queryRef={queryRef} />
    </Suspense>
  );
}
