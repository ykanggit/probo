import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  fetchQuery,
  useRelayEnvironment,
} from "react-relay";
import { ControlViewSkeleton } from "./ControlPage";
import { Suspense, useEffect, useState, useCallback } from "react";
import {
  ControlViewQuery,
  ControlViewQuery$data,
} from "./__generated__/ControlViewQuery.graphql";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { LinkIcon, X, Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ControlViewLinkedMitigationsQuery,
  ControlViewLinkedMitigationsQuery$data,
} from "./__generated__/ControlViewLinkedMitigationsQuery.graphql";
import {
  ControlViewOrganizationMitigationsQuery,
  ControlViewOrganizationMitigationsQuery$data,
} from "./__generated__/ControlViewOrganizationMitigationsQuery.graphql";

const controlViewQuery = graphql`
  query ControlViewQuery($controlId: ID!) {
    node(id: $controlId) {
      id
      ... on Control {
        description
        name
        referenceId
      }
    }
  }
`;

// New query to fetch linked mitigations
const linkedMitigationsQuery = graphql`
  query ControlViewLinkedMitigationsQuery($controlId: ID!) {
    control: node(id: $controlId) {
      id
      ... on Control {
        mitigations(first: 100) @connection(key: "Control__mitigations") {
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

// Query to fetch all mitigations for the organization
const organizationMitigationsQuery = graphql`
  query ControlViewOrganizationMitigationsQuery($organizationId: ID!) {
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

// Mutation to create a mapping between a control and a mitigation
const createMitigationMappingMutation = graphql`
  mutation ControlViewCreateMitigationMappingMutation(
    $input: CreateControlMappingInput!
  ) {
    createControlMapping(input: $input) {
      success
    }
  }
`;

// Mutation to delete a mapping between a control and a mitigation
const deleteMitigationMappingMutation = graphql`
  mutation ControlViewDeleteMitigationMappingMutation(
    $input: DeleteControlMappingInput!
  ) {
    deleteControlMapping(input: $input) {
      success
    }
  }
`;

export function Control({
  control,
}: {
  control: ControlViewQuery$data["node"];
}) {
  const { organizationId /* frameworkId */ } = useParams<{
    organizationId: string;
    frameworkId: string;
  }>();
  const { toast } = useToast();
  const environment = useRelayEnvironment();

  // State for mitigation mapping
  const [isMitigationMappingDialogOpen, setIsMitigationMappingDialogOpen] =
    useState(false);
  const [linkedMitigationsData, setLinkedMitigationsData] =
    useState<ControlViewLinkedMitigationsQuery$data | null>(null);
  const [organizationMitigationsData, setOrganizationMitigationsData] =
    useState<ControlViewOrganizationMitigationsQuery$data | null>(null);
  const [mitigationSearchQuery, setMitigationSearchQuery] = useState("");
  const [isLoadingMitigations, setIsLoadingMitigations] = useState(false);
  const [isLinkingMitigation, setIsLinkingMitigation] = useState(false);
  const [isUnlinkingMitigation, setIsUnlinkingMitigation] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Create mutation hooks
  const [commitCreateMitigationMapping] = useMutation(
    createMitigationMappingMutation
  );
  const [commitDeleteMitigationMapping] = useMutation(
    deleteMitigationMappingMutation
  );

  // Load initial linked mitigations data
  useEffect(() => {
    if (control.id) {
      setIsLoadingMitigations(true);
      fetchQuery<ControlViewLinkedMitigationsQuery>(
        environment,
        linkedMitigationsQuery,
        {
          controlId: control.id,
        }
      ).subscribe({
        next: (data) => {
          setLinkedMitigationsData(data);
          setIsLoadingMitigations(false);
        },
        error: (error: Error) => {
          console.error("Error loading initial mitigations:", error);
          setIsLoadingMitigations(false);
        },
      });
    }
  }, [control.id, environment]);

  // Load mitigations data
  const loadMitigationsData = useCallback(() => {
    if (!organizationId || !control.id) return;

    setIsLoadingMitigations(true);

    // Fetch all mitigations for the organization
    fetchQuery<ControlViewOrganizationMitigationsQuery>(
      environment,
      organizationMitigationsQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationMitigationsData(data);
      },
      complete: () => {
        // Fetch linked mitigations for this control
        fetchQuery<ControlViewLinkedMitigationsQuery>(
          environment,
          linkedMitigationsQuery,
          {
            controlId: control.id,
          }
        ).subscribe({
          next: (data) => {
            setLinkedMitigationsData(data);
            setIsLoadingMitigations(false);
          },
          error: (error: Error) => {
            console.error("Error fetching linked mitigations:", error);
            setIsLoadingMitigations(false);
            toast({
              title: "Error",
              description: "Failed to load linked mitigations.",
              variant: "destructive",
            });
          },
        });
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
  }, [control.id, environment, organizationId, toast]);

  // Helper functions
  const getMitigations = useCallback(() => {
    if (!organizationMitigationsData?.organization?.mitigations?.edges)
      return [];
    return organizationMitigationsData.organization.mitigations.edges.map(
      (edge) => edge.node
    );
  }, [organizationMitigationsData]);

  const getLinkedMitigations = useCallback(() => {
    if (!linkedMitigationsData?.control?.mitigations?.edges) return [];
    return linkedMitigationsData.control.mitigations.edges.map(
      (edge) => edge.node
    );
  }, [linkedMitigationsData]);

  const isMitigationLinked = useCallback(
    (mitigationId: string) => {
      const linkedMitigations = getLinkedMitigations();
      return linkedMitigations.some(
        (mitigation) => mitigation.id === mitigationId
      );
    },
    [getLinkedMitigations]
  );

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
  }, [categoryFilter, getMitigations, mitigationSearchQuery]);

  // Handle link/unlink functions
  const handleLinkMitigation = useCallback(
    (mitigationId: string) => {
      if (!control.id) return;

      setIsLinkingMitigation(true);

      commitCreateMitigationMapping({
        variables: {
          input: {
            controlId: control.id,
            mitigationId: mitigationId,
          },
        },
        onCompleted: (_, errors) => {
          setIsLinkingMitigation(false);

          if (errors) {
            console.error("Error linking mitigation:", errors);
            toast({
              title: "Error",
              description: "Failed to link mitigation. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked mitigations data
          fetchQuery<ControlViewLinkedMitigationsQuery>(
            environment,
            linkedMitigationsQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedMitigationsData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked mitigations:", error);
            },
          });

          toast({
            title: "Success",
            description: "Mitigation successfully linked to control.",
          });
        },
        onError: (error) => {
          setIsLinkingMitigation(false);
          console.error("Error linking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to link mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitCreateMitigationMapping, control.id, environment, toast]
  );

  const handleUnlinkMitigation = useCallback(
    (mitigationId: string) => {
      if (!control.id) return;

      setIsUnlinkingMitigation(true);

      commitDeleteMitigationMapping({
        variables: {
          input: {
            controlId: control.id,
            mitigationId: mitigationId,
          },
        },
        onCompleted: (_, errors) => {
          setIsUnlinkingMitigation(false);

          if (errors) {
            console.error("Error unlinking mitigation:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink mitigation. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked mitigations data
          fetchQuery<ControlViewLinkedMitigationsQuery>(
            environment,
            linkedMitigationsQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedMitigationsData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked mitigations:", error);
            },
          });

          toast({
            title: "Success",
            description: "Mitigation successfully unlinked from control.",
          });
        },
        onError: (error) => {
          setIsUnlinkingMitigation(false);
          console.error("Error unlinking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to unlink mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitDeleteMitigationMapping, control.id, environment, toast]
  );

  const handleOpenMitigationMappingDialog = useCallback(() => {
    loadMitigationsData();
    setIsMitigationMappingDialogOpen(true);
  }, [loadMitigationsData]);

  // UI helper functions
  const formatImportance = (importance: string | undefined): string => {
    if (!importance) return "Unknown";

    switch (importance) {
      case "LOW":
        return "Low";
      case "MEDIUM":
        return "Medium";
      case "HIGH":
        return "High";
      case "CRITICAL":
        return "Critical";
      default:
        return importance;
    }
  };

  const formatState = (state: string | undefined): string => {
    if (!state) return "Unknown";

    switch (state) {
      case "NOT_STARTED":
        return "Not Started";
      case "IN_PROGRESS":
        return "In Progress";
      case "IMPLEMENTED":
        return "Implemented";
      case "NOT_APPLICABLE":
        return "Not Applicable";
      default:
        return state;
    }
  };

  const getImportanceColor = (importance: string | undefined): string => {
    if (!importance) return "bg-gray-100 text-gray-800";

    switch (importance) {
      case "LOW":
        return "bg-blue-100 text-blue-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStateColor = (state: string | undefined): string => {
    if (!state) return "bg-gray-100 text-gray-800";

    switch (state) {
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "IMPLEMENTED":
        return "bg-green-100 text-green-800";
      case "NOT_APPLICABLE":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-auto p-5 flex items-start gap-5">
      <div className="font-mono text-lg px-1 py-0.25 rounded-sm bg-lime-3 border border-lime-6 text-lime-11 font-bold">
        {control.referenceId}
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-medium">{control.name}</h2>

        {/* Control Description */}
        {control.description && (
          <div className="mt-4 text-gray-600">{control.description}</div>
        )}

        {/* Security Measures Section */}
        <div className="mt-8">
          {/* Mitigation Mapping Dialog */}
          <Dialog
            open={isMitigationMappingDialogOpen}
            onOpenChange={setIsMitigationMappingDialogOpen}
          >
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Link Security Measures to Control</DialogTitle>
                <DialogDescription>
                  Search and select security measures to link to this control.
                  This helps track which security measures address this control.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search security measures by name or description..."
                      value={mitigationSearchQuery}
                      onChange={(e) => setMitigationSearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                </div>
                <div className="w-[200px]">
                  <Select
                    value={categoryFilter || "all"}
                    onValueChange={(value) =>
                      setCategoryFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {getMitigationCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {isLoadingMitigations ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-2">Loading security measures...</span>
                  </div>
                ) : (
                  <div className="max-h-[50vh] overflow-y-auto pr-2">
                    {filteredMitigations().length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No security measures found. Try adjusting your search or
                        select a different category.
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-left text-sm text-gray-500 bg-gray-50">
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">
                              Importance
                            </th>
                            <th className="py-3 px-4 font-medium">State</th>
                            <th className="py-3 px-4 font-medium text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMitigations().map((mitigation) => {
                            const isLinked = isMitigationLinked(mitigation.id);
                            return (
                              <tr
                                key={mitigation.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium">
                                    {mitigation.name}
                                  </div>
                                  {mitigation.description && (
                                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                      {mitigation.description}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs ${getImportanceColor(
                                      mitigation.importance
                                    )} inline-block`}
                                  >
                                    {formatImportance(mitigation.importance)}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs ${getStateColor(
                                      mitigation.state
                                    )} inline-block`}
                                  >
                                    {formatState(mitigation.state)}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {isLinked ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUnlinkMitigation(mitigation.id)
                                      }
                                      disabled={isUnlinkingMitigation}
                                      className="text-xs h-7 text-red-500 border-red-200 hover:bg-red-50"
                                    >
                                      {isUnlinkingMitigation ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Unlink</span>
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleLinkMitigation(mitigation.id)
                                      }
                                      disabled={isLinkingMitigation}
                                      className="text-xs h-7 text-blue-500 border-blue-200 hover:bg-blue-50"
                                    >
                                      {isLinkingMitigation ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <LinkIcon className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Link</span>
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button onClick={() => setIsMitigationMappingDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Linked Mitigations List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-600">
                Security measures
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenMitigationMappingDialog}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link Security Measures</span>
              </Button>
            </div>

            {isLoadingMitigations ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2">Loading security measures...</span>
              </div>
            ) : linkedMitigationsData?.control?.mitigations?.edges &&
              linkedMitigationsData.control.mitigations.edges.length > 0 ? (
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500 bg-gray-50">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Importance</th>
                      <th className="py-3 px-4 font-medium">State</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getLinkedMitigations().map((mitigation) => (
                      <tr
                        key={mitigation.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{mitigation.name}</div>
                          {mitigation.description && (
                            <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {mitigation.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${getImportanceColor(
                              mitigation.importance
                            )} inline-block`}
                          >
                            {formatImportance(mitigation.importance)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${getStateColor(
                              mitigation.state
                            )} inline-block`}
                          >
                            {formatState(mitigation.state)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-xs h-7"
                            >
                              <Link
                                to={`/organizations/${organizationId}/mitigations/${mitigation.id}`}
                              >
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUnlinkMitigation(mitigation.id)
                              }
                              disabled={isUnlinkingMitigation}
                              className="text-xs h-7 text-red-500 border-red-200 hover:bg-red-50"
                            >
                              Unlink
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-md">
                No security measures linked to this control yet. Click
                &quot;Link Security Measures&quot; to connect some.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<ControlViewQuery>;
}) {
  const { node: control } = usePreloadedQuery<ControlViewQuery>(
    controlViewQuery,
    queryRef
  );

  return <Control control={control} />;
}

export default function ControlView({ controlId }: { controlId?: string }) {
  const { controlId: controlIdParam } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<ControlViewQuery>(controlViewQuery);

  useEffect(() => {
    loadQuery({ controlId: (controlId ?? controlIdParam)! });
  }, [loadQuery, controlId, controlIdParam]);

  if (!queryRef) return <ControlViewSkeleton />;

  return (
    <Suspense>
      <ControlViewContent queryRef={queryRef} />
    </Suspense>
  );
}
