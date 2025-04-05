import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  fetchQuery,
  useRelayEnvironment,
} from "react-relay";
import type { ShowRiskViewQuery } from "./__generated__/ShowRiskViewQuery.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { ShowRiskViewSkeleton } from "./ShowRiskPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShowRiskViewOrganizationMitigationsQuery,
  ShowRiskViewOrganizationMitigationsQuery$data,
} from "./__generated__/ShowRiskViewOrganizationMitigationsQuery.graphql";

const showRiskViewQuery = graphql`
  query ShowRiskViewQuery($riskId: ID!) {
    node(id: $riskId) {
      id
      ... on Risk {
        name
        description
        probability
        impact
        createdAt
        updatedAt
        mitigations(first: 100) @connection(key: "Risk__mitigations") {
          edges {
            node {
              id
              name
              description
              category
              importance
              createdAt
              state
            }
          }
        }
      }
    }
  }
`;

// Add query to fetch all mitigations for the organization
const organizationMitigationsQuery = graphql`
  query ShowRiskViewOrganizationMitigationsQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        mitigations(first: 100) @connection(key: "Organization__mitigations") {
          edges {
            node {
              id
              name
              description
              category
              importance
              state
            }
          }
        }
      }
    }
  }
`;

// Add mutation to create risk-mitigation mapping
const createRiskMappingMutation = graphql`
  mutation ShowRiskViewCreateRiskMappingMutation(
    $input: CreateRiskMappingInput!
  ) {
    createRiskMapping(input: $input) {
      success
    }
  }
`;

// Add mutation to delete risk-mitigation mapping
const deleteRiskMappingMutation = graphql`
  mutation ShowRiskViewDeleteRiskMappingMutation(
    $input: DeleteRiskMappingInput!
  ) {
    deleteRiskMapping(input: $input) {
      success
    }
  }
`;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRiskSeverity(probability: number, impact: number) {
  const score = probability * impact;
  if (score >= 0.75) return { level: "High", class: "bg-red-100 text-red-800" };
  if (score >= 0.4)
    return { level: "Medium", class: "bg-yellow-100 text-yellow-800" };
  return { level: "Low", class: "bg-green-100 text-green-800" };
}

function ShowRiskViewContent({
  queryRef,
  loadQuery,
}: {
  queryRef: PreloadedQuery<ShowRiskViewQuery>;
  loadQuery: (variables: { riskId: string }) => void;
}) {
  const data = usePreloadedQuery<ShowRiskViewQuery>(
    showRiskViewQuery,
    queryRef
  );
  const { toast } = useToast();
  const environment = useRelayEnvironment();
  const { organizationId } = useParams<{ organizationId: string }>();

  // Cast the node to Risk type
  const risk = data.node;
  const severity = getRiskSeverity(risk.probability!, risk.impact!);

  // Add state for mitigation mapping dialog
  const [isMitigationDialogOpen, setIsMitigationDialogOpen] = useState(false);
  const [organizationMitigationsData, setOrganizationMitigationsData] =
    useState<ShowRiskViewOrganizationMitigationsQuery$data | null>(null);
  const [mitigationSearchQuery, setMitigationSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isLoadingMitigations, setIsLoadingMitigations] = useState(false);
  const [isLinkingMitigation, setIsLinkingMitigation] = useState(false);
  const [isUnlinkingMitigation, setIsUnlinkingMitigation] = useState(false);
  const [currentMitigationId, setCurrentMitigationId] = useState<string | null>(
    null
  );

  // Setup mutation hooks
  const [commitCreateRiskMapping] = useMutation(createRiskMappingMutation);
  const [commitDeleteRiskMapping] = useMutation(deleteRiskMappingMutation);

  // Clear filters when dialog closes
  useEffect(() => {
    if (!isMitigationDialogOpen) {
      setMitigationSearchQuery("");
      setCategoryFilter(null);
    }
  }, [isMitigationDialogOpen]);

  // Load mitigations data when needed
  const loadMitigationsData = useCallback(() => {
    if (!organizationId || !risk.id) return;

    setIsLoadingMitigations(true);

    // Fetch all mitigations for the organization
    fetchQuery<ShowRiskViewOrganizationMitigationsQuery>(
      environment,
      organizationMitigationsQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationMitigationsData(data);
        setIsLoadingMitigations(false);
      },
      error: (error: Error) => {
        console.error("Error fetching organization mitigations:", error);
        setIsLoadingMitigations(false);
        toast({
          title: "Error",
          description: "Failed to load mitigations.",
          variant: "destructive",
        });
      },
    });
  }, [risk.id, environment, organizationId, toast]);

  // Helper functions
  const getMitigations = useCallback(() => {
    if (!organizationMitigationsData?.organization?.mitigations?.edges)
      return [];
    return organizationMitigationsData.organization.mitigations.edges.map(
      (edge) => edge.node
    );
  }, [organizationMitigationsData]);

  const getMitigationCategories = useCallback(() => {
    const mitigations = getMitigations();
    const categories = new Set<string>();

    mitigations.forEach((mitigation) => {
      if (mitigation.category) {
        categories.add(mitigation.category);
      }
    });

    return Array.from(categories).sort();
  }, [getMitigations]);

  const filteredMitigations = useCallback(() => {
    const mitigations = getMitigations();
    if (!mitigationSearchQuery && !categoryFilter) return mitigations;

    return mitigations.filter((mitigation) => {
      // Filter by search query
      const matchesSearch =
        !mitigationSearchQuery ||
        mitigation.name
          .toLowerCase()
          .includes(mitigationSearchQuery.toLowerCase()) ||
        (mitigation.description &&
          mitigation.description
            .toLowerCase()
            .includes(mitigationSearchQuery.toLowerCase()));

      // Filter by category
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        mitigation.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [getMitigations, mitigationSearchQuery, categoryFilter]);

  // Handle linking a mitigation to this risk
  const handleLinkMitigation = useCallback(
    (
      mitigation: NonNullable<
        NonNullable<
          ShowRiskViewOrganizationMitigationsQuery$data["organization"]
        >["mitigations"]
      >["edges"][0]["node"]
    ) => {
      if (!risk.id) return;

      setIsLinkingMitigation(true);
      setCurrentMitigationId(mitigation.id);

      commitCreateRiskMapping({
        variables: {
          input: {
            riskId: risk.id,
            mitigationId: mitigation.id,
            probability: risk.probability,
            impact: risk.impact,
          },
        },
        onCompleted: (_, errors) => {
          setIsLinkingMitigation(false);
          setCurrentMitigationId(null);

          if (errors && errors.length > 0) {
            console.error("Error linking mitigation:", errors);
            toast({
              title: "Error",
              description: "Failed to link mitigation. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh main query data using the exact same pattern as in ControlView.tsx
          fetchQuery(environment, showRiskViewQuery, {
            riskId: risk.id,
          }).subscribe({
            next: () => {
              // Force reload the view data to reflect changes
              loadQuery({ riskId: risk.id });
            },
            error: (error: Error) => {
              console.error("Error refreshing risk data:", error);
            },
          });

          toast({
            title: "Success",
            description: `Linked mitigation "${mitigation.name}" to this risk.`,
          });
        },
        onError: (error) => {
          setIsLinkingMitigation(false);
          setCurrentMitigationId(null);
          console.error("Error linking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to link mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [
      risk.id,
      risk.probability,
      risk.impact,
      commitCreateRiskMapping,
      toast,
      environment,
      loadQuery,
    ]
  );

  // Handle unlinking a mitigation from this risk
  const handleUnlinkMitigation = useCallback(
    (
      mitigation: NonNullable<
        NonNullable<
          ShowRiskViewOrganizationMitigationsQuery$data["organization"]
        >["mitigations"]
      >["edges"][0]["node"]
    ) => {
      if (!risk.id) return;

      setIsUnlinkingMitigation(true);
      setCurrentMitigationId(mitigation.id);

      commitDeleteRiskMapping({
        variables: {
          input: {
            riskId: risk.id,
            mitigationId: mitigation.id,
          },
        },
        onCompleted: (_, errors) => {
          setIsUnlinkingMitigation(false);
          setCurrentMitigationId(null);

          if (errors && errors.length > 0) {
            console.error("Error unlinking mitigation:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink mitigation. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh main query data using the exact same pattern as in ControlView.tsx
          fetchQuery(environment, showRiskViewQuery, {
            riskId: risk.id,
          }).subscribe({
            next: () => {
              // Force reload the view data to reflect changes
              loadQuery({ riskId: risk.id });
            },
            error: (error: Error) => {
              console.error("Error refreshing risk data:", error);
            },
          });

          toast({
            title: "Success",
            description: `Unlinked mitigation "${mitigation.name}" from this risk.`,
          });
        },
        onError: (error) => {
          setIsUnlinkingMitigation(false);
          setCurrentMitigationId(null);
          console.error("Error unlinking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to unlink mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [risk.id, commitDeleteRiskMapping, toast, environment, loadQuery]
  );

  return (
    <PageTemplate title={risk.name ?? ""} description={risk.description || ""}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-secondary">
                  Probability
                </h3>
                <p className="mt-1 text-lg">
                  {(risk.probability! * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary">Impact</h3>
                <p className="mt-1 text-lg">
                  {(risk.impact! * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary">Severity</h3>
                <p className="mt-1">
                  <Badge className={severity.class}>{severity.level}</Badge>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary">Created</h3>
                <p className="mt-1 text-sm">{formatDate(risk.createdAt!)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mitigations" className="w-full">
          <TabsList>
            <TabsTrigger value="mitigations">Mitigations</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="mitigations" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Risk Mitigations</h2>
              <Button
                onClick={() => {
                  setIsMitigationDialogOpen(true);
                  loadMitigationsData();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Link Mitigation
              </Button>
            </div>
            {risk.mitigations?.edges?.length &&
            risk.mitigations?.edges?.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-full">Mitigation</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risk.mitigations?.edges.map(({ node: mitigation }) => (
                      <TableRow key={mitigation.id}>
                        <TableCell>
                          <Link
                            to={`/organizations/${organizationId}/mitigations/${mitigation.id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {mitigation.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUnlinkMitigation(mitigation)}
                            disabled={isUnlinkingMitigation}
                            title="Unlink mitigation"
                          >
                            <Trash2 className="h-4 w-4 text-danger" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-secondary">
                <p>No mitigations associated with this risk.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-secondary">
                      Full Description
                    </h3>
                    <p className="mt-1">{risk.description}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-secondary">
                      Last Updated
                    </h3>
                    <p className="mt-1">{formatDate(risk.updatedAt!)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog for linking mitigations */}
        <Dialog
          open={isMitigationDialogOpen}
          onOpenChange={setIsMitigationDialogOpen}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle>Link Mitigation to Risk</DialogTitle>
                  <DialogDescription>
                    Select a mitigation to link to this risk.
                  </DialogDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // Force a reload of the risk data to ensure latest mitigation links
                    loadQuery({ riskId: risk.id });
                    // Then load the organization mitigations
                    loadMitigationsData();
                  }}
                  title="Refresh data"
                  disabled={isLoadingMitigations}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${isLoadingMitigations ? "animate-spin" : ""}`}
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                </Button>
              </div>
            </DialogHeader>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-tertiary" />
                    <Input
                      placeholder="Search mitigations..."
                      className="pl-8"
                      value={mitigationSearchQuery}
                      onChange={(e) => setMitigationSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select
                  value={categoryFilter || "all"}
                  onValueChange={(value) =>
                    setCategoryFilter(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {getMitigationCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md max-h-96 overflow-y-auto">
                {isLoadingMitigations ? (
                  <div className="p-4 text-center">Loading mitigations...</div>
                ) : filteredMitigations().length === 0 ? (
                  <div className="p-4 text-center">No mitigations found.</div>
                ) : (
                  <div className="divide-y">
                    {filteredMitigations().map((mitigation) => {
                      // For each render, recalculate linked status directly against the current risk data
                      const isLinked = risk.mitigations?.edges?.some(
                        (edge) => edge.node.id === mitigation.id
                      );

                      const isProcessing =
                        (isLinkingMitigation &&
                          currentMitigationId === mitigation.id) ||
                        (isUnlinkingMitigation &&
                          currentMitigationId === mitigation.id);

                      return (
                        <div
                          key={mitigation.id}
                          className="p-4 hover:bg-invert-bg"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{mitigation.name}</h3>
                            </div>
                            <Button
                              variant={isLinked ? "destructive" : "default"}
                              size="sm"
                              disabled={isProcessing}
                              onClick={() =>
                                isLinked
                                  ? handleUnlinkMitigation(mitigation)
                                  : handleLinkMitigation(mitigation)
                              }
                            >
                              {isUnlinkingMitigation &&
                              currentMitigationId === mitigation.id
                                ? "Unlinking..."
                                : isLinkingMitigation &&
                                  currentMitigationId === mitigation.id
                                ? "Linking..."
                                : isLinked
                                ? "Unlink"
                                : "Link"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsMitigationDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
}

export default function ShowRiskView() {
  const { riskId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<ShowRiskViewQuery>(showRiskViewQuery);

  useEffect(() => {
    loadQuery({ riskId: riskId! });
  }, [loadQuery, riskId]);

  if (!queryRef) {
    return <ShowRiskViewSkeleton />;
  }

  return (
    <Suspense fallback={<ShowRiskViewSkeleton />}>
      <ShowRiskViewContent queryRef={queryRef} loadQuery={loadQuery} />
    </Suspense>
  );
}
