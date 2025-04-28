import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Search, Loader2, X, LinkIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  fetchQuery,
  graphql,
  useFragment,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { useParams, Link } from "react-router";
import {
  ControlLinkedMesuresQuery$data,
  ControlLinkedMesuresQuery,
} from "./__generated__/ControlLinkedMesuresQuery.graphql";
import {
  ControlOrganizationMesuresQuery$data,
  ControlOrganizationMesuresQuery,
} from "./__generated__/ControlOrganizationMesuresQuery.graphql";
import { ControlFragment_Control$key } from "./__generated__/ControlFragment_Control.graphql";
import {
  ControlLinkedPoliciesQuery$data,
  ControlLinkedPoliciesQuery,
} from "./__generated__/ControlLinkedPoliciesQuery.graphql";
import {
  ControlOrganizationPoliciesQuery$data,
  ControlOrganizationPoliciesQuery,
} from "./__generated__/ControlOrganizationPoliciesQuery.graphql";

const controlFragment = graphql`
  fragment ControlFragment_Control on Control {
    id
    description
    name
    referenceId
  }
`;

// New query to fetch linked mesures
const linkedMesuresQuery = graphql`
  query ControlLinkedMesuresQuery($controlId: ID!) {
    control: node(id: $controlId) {
      id
      ... on Control {
        mesures(first: 100) @connection(key: "Control__mesures") {
          edges {
            node {
              id
              name
              description
              category
              state
            }
          }
        }
      }
    }
  }
`;

// Query to fetch all mesures for the organization
const organizationMesuresQuery = graphql`
  query ControlOrganizationMesuresQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        mesures(first: 100) @connection(key: "Organization__mesures") {
          edges {
            node {
              id
              name
              description
              category
              state
            }
          }
        }
      }
    }
  }
`;

// Query to fetch linked policies
const linkedPoliciesQuery = graphql`
  query ControlLinkedPoliciesQuery($controlId: ID!) {
    control: node(id: $controlId) {
      id
      ... on Control {
        policies(first: 100) @connection(key: "Control__policies") {
          edges {
            node {
              id
              name
              content
              status
              reviewDate
            }
          }
        }
      }
    }
  }
`;

// Query to fetch all policies for the organization
const organizationPoliciesQuery = graphql`
  query ControlOrganizationPoliciesQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        policies(first: 100) @connection(key: "Organization__policies") {
          edges {
            node {
              id
              name
              content
              status
              reviewDate
            }
          }
        }
      }
    }
  }
`;

// Mutation to create a mapping between a control and a mesure
const createMesureMappingMutation = graphql`
  mutation ControlCreateMesureMappingMutation(
    $input: CreateControlMesureMappingInput!
  ) {
    createControlMesureMapping(input: $input) {
      success
    }
  }
`;

// Mutation to delete a mapping between a control and a mesure
const deleteMesureMappingMutation = graphql`
  mutation ControlDeleteMesureMappingMutation(
    $input: DeleteControlMesureMappingInput!
  ) {
    deleteControlMesureMapping(input: $input) {
      success
    }
  }
`;

// Mutation to create a mapping between a control and a policy
const createPolicyMappingMutation = graphql`
  mutation ControlCreatePolicyMappingMutation(
    $input: CreateControlPolicyMappingInput!
  ) {
    createControlPolicyMapping(input: $input) {
      success
    }
  }
`;

// Mutation to delete a mapping between a control and a policy
const deletePolicyMappingMutation = graphql`
  mutation ControlDeletePolicyMappingMutation(
    $input: DeleteControlPolicyMappingInput!
  ) {
    deleteControlPolicyMapping(input: $input) {
      success
    }
  }
`;

export function Control({
  controlKey,
}: {
  controlKey: ControlFragment_Control$key;
}) {
  const { organizationId /* frameworkId */ } = useParams<{
    organizationId: string;
    frameworkId: string;
  }>();
  const control = useFragment(controlFragment, controlKey);
  const { toast } = useToast();
  const environment = useRelayEnvironment();

  // State for mesure mapping
  const [isMesureMappingDialogOpen, setIsMesureMappingDialogOpen] =
    useState(false);
  const [linkedMesuresData, setLinkedMesuresData] =
    useState<ControlLinkedMesuresQuery$data | null>(null);
  const [organizationMesuresData, setOrganizationMesuresData] =
    useState<ControlOrganizationMesuresQuery$data | null>(null);
  const [mesureSearchQuery, setMesureSearchQuery] = useState("");
  const [isLoadingMesures, setIsLoadingMesures] = useState(false);
  const [isLinkingMesure, setIsLinkingMesure] = useState(false);
  const [isUnlinkingMesure, setIsUnlinkingMesure] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Policy state
  const [isPolicyMappingDialogOpen, setIsPolicyMappingDialogOpen] =
    useState(false);
  const [linkedPoliciesData, setLinkedPoliciesData] =
    useState<ControlLinkedPoliciesQuery$data | null>(null);
  const [organizationPoliciesData, setOrganizationPoliciesData] =
    useState<ControlOrganizationPoliciesQuery$data | null>(null);
  const [policySearchQuery, setPolicySearchQuery] = useState("");
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [isLinkingPolicy, setIsLinkingPolicy] = useState(false);
  const [isUnlinkingPolicy, setIsUnlinkingPolicy] = useState(false);

  // Create mutation hooks
  const [commitCreateMesureMapping] = useMutation(createMesureMappingMutation);
  const [commitDeleteMesureMapping] = useMutation(deleteMesureMappingMutation);
  const [commitCreatePolicyMapping] = useMutation(createPolicyMappingMutation);
  const [commitDeletePolicyMapping] = useMutation(deletePolicyMappingMutation);

  // Load initial linked mesures data
  useEffect(() => {
    if (control.id) {
      setIsLoadingMesures(true);
      fetchQuery<ControlLinkedMesuresQuery>(environment, linkedMesuresQuery, {
        controlId: control.id,
      }).subscribe({
        next: (data) => {
          setLinkedMesuresData(data);
          setIsLoadingMesures(false);
        },
        error: (error: Error) => {
          console.error("Error loading initial mesures:", error);
          setIsLoadingMesures(false);
        },
      });
    }
  }, [control.id, environment]);

  // Load mesures data
  const loadMesuresData = useCallback(() => {
    if (!organizationId || !control.id) return;

    setIsLoadingMesures(true);

    // Fetch all mesures for the organization
    fetchQuery<ControlOrganizationMesuresQuery>(
      environment,
      organizationMesuresQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationMesuresData(data);
      },
      complete: () => {
        // Fetch linked mesures for this control
        fetchQuery<ControlLinkedMesuresQuery>(environment, linkedMesuresQuery, {
          controlId: control.id,
        }).subscribe({
          next: (data) => {
            setLinkedMesuresData(data);
            setIsLoadingMesures(false);
          },
          error: (error: Error) => {
            console.error("Error fetching linked mesures:", error);
            setIsLoadingMesures(false);
            toast({
              title: "Error",
              description: "Failed to load linked mesures.",
              variant: "destructive",
            });
          },
        });
      },
      error: (error: Error) => {
        console.error("Error fetching organization mesures:", error);
        setIsLoadingMesures(false);
        toast({
          title: "Error",
          description: "Failed to load mesures.",
          variant: "destructive",
        });
      },
    });
  }, [control.id, environment, organizationId, toast]);

  // Helper functions
  const getMesures = useCallback(() => {
    if (!organizationMesuresData?.organization?.mesures?.edges) return [];
    return organizationMesuresData.organization.mesures.edges.map(
      (edge) => edge.node
    );
  }, [organizationMesuresData]);

  const getLinkedMesures = useCallback(() => {
    if (!linkedMesuresData?.control?.mesures?.edges) return [];
    return linkedMesuresData.control.mesures.edges.map((edge) => edge.node);
  }, [linkedMesuresData]);

  const isMesureLinked = useCallback(
    (mesureId: string) => {
      const linkedMesures = getLinkedMesures();
      return linkedMesures.some((mesure) => mesure.id === mesureId);
    },
    [getLinkedMesures]
  );

  const getMesureCategories = useCallback(() => {
    const mesures = getMesures();
    const categories = new Set<string>();

    mesures.forEach((mesure) => {
      if (mesure.category) {
        categories.add(mesure.category);
      }
    });

    return Array.from(categories).sort();
  }, [getMesures]);

  const filteredMesures = useCallback(() => {
    const mesures = getMesures();
    if (!mesureSearchQuery && !categoryFilter) return mesures;

    return mesures.filter((mesure) => {
      // Filter by search query
      const matchesSearch =
        !mesureSearchQuery ||
        mesure.name.toLowerCase().includes(mesureSearchQuery.toLowerCase()) ||
        (mesure.description &&
          mesure.description
            .toLowerCase()
            .includes(mesureSearchQuery.toLowerCase()));

      // Filter by category
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        mesure.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, getMesures, mesureSearchQuery]);

  // Handle link/unlink functions
  const handleLinkMesure = useCallback(
    (mesureId: string) => {
      if (!control.id) return;

      setIsLinkingMesure(true);

      commitCreateMesureMapping({
        variables: {
          input: {
            controlId: control.id,
            mesureId: mesureId,
          },
        },
        onCompleted: (_, errors) => {
          setIsLinkingMesure(false);

          if (errors) {
            console.error("Error linking mesure:", errors);
            toast({
              title: "Error",
              description: "Failed to link mesure. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked mesures data
          fetchQuery<ControlLinkedMesuresQuery>(
            environment,
            linkedMesuresQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedMesuresData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked mesures:", error);
            },
          });

          toast({
            title: "Success",
            description: "Mesure successfully linked to control.",
          });
        },
        onError: (error) => {
          setIsLinkingMesure(false);
          console.error("Error linking mesure:", error);
          toast({
            title: "Error",
            description: "Failed to link mesure. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitCreateMesureMapping, control.id, environment, toast]
  );

  const handleUnlinkMesure = useCallback(
    (mesureId: string) => {
      if (!control.id) return;

      setIsUnlinkingMesure(true);

      commitDeleteMesureMapping({
        variables: {
          input: {
            controlId: control.id,
            mesureId: mesureId,
          },
        },
        onCompleted: (_, errors) => {
          setIsUnlinkingMesure(false);

          if (errors) {
            console.error("Error unlinking mesure:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink mesure. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked mesures data
          fetchQuery<ControlLinkedMesuresQuery>(
            environment,
            linkedMesuresQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedMesuresData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked mesures:", error);
            },
          });

          toast({
            title: "Success",
            description: "Mesure successfully unlinked from control.",
          });
        },
        onError: (error) => {
          setIsUnlinkingMesure(false);
          console.error("Error unlinking mesure:", error);
          toast({
            title: "Error",
            description: "Failed to unlink mesure. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitDeleteMesureMapping, control.id, environment, toast]
  );

  const handleOpenMesureMappingDialog = useCallback(() => {
    loadMesuresData();
    setIsMesureMappingDialogOpen(true);
  }, [loadMesuresData]);

  // Load initial linked policies data
  useEffect(() => {
    if (control.id) {
      setIsLoadingPolicies(true);
      fetchQuery<ControlLinkedPoliciesQuery>(environment, linkedPoliciesQuery, {
        controlId: control.id,
      }).subscribe({
        next: (data) => {
          setLinkedPoliciesData(data);
          setIsLoadingPolicies(false);
        },
        error: (error: Error) => {
          console.error("Error loading initial policies:", error);
          setIsLoadingPolicies(false);
        },
      });
    }
  }, [control.id, environment]);

  // Load policies data
  const loadPoliciesData = useCallback(() => {
    if (!organizationId || !control.id) return;

    setIsLoadingPolicies(true);

    // Fetch all policies for the organization
    fetchQuery<ControlOrganizationPoliciesQuery>(
      environment,
      organizationPoliciesQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationPoliciesData(data);
      },
      complete: () => {
        // Fetch linked policies for this control
        fetchQuery<ControlLinkedPoliciesQuery>(
          environment,
          linkedPoliciesQuery,
          {
            controlId: control.id,
          }
        ).subscribe({
          next: (data) => {
            setLinkedPoliciesData(data);
            setIsLoadingPolicies(false);
          },
          error: (error: Error) => {
            console.error("Error fetching linked policies:", error);
            setIsLoadingPolicies(false);
            toast({
              title: "Error",
              description: "Failed to load linked policies.",
              variant: "destructive",
            });
          },
        });
      },
      error: (error: Error) => {
        console.error("Error fetching organization policies:", error);
        setIsLoadingPolicies(false);
        toast({
          title: "Error",
          description: "Failed to load policies.",
          variant: "destructive",
        });
      },
    });
  }, [control.id, environment, organizationId, toast]);

  // Policy helper functions
  const getPolicies = useCallback(() => {
    if (!organizationPoliciesData?.organization?.policies?.edges) return [];
    return organizationPoliciesData.organization.policies.edges.map(
      (edge) => edge.node
    );
  }, [organizationPoliciesData]);

  const getLinkedPolicies = useCallback(() => {
    if (!linkedPoliciesData?.control?.policies?.edges) return [];
    return linkedPoliciesData.control.policies.edges.map((edge) => edge.node);
  }, [linkedPoliciesData]);

  const isPolicyLinked = useCallback(
    (policyId: string) => {
      const linkedPolicies = getLinkedPolicies();
      return linkedPolicies.some((policy) => policy.id === policyId);
    },
    [getLinkedPolicies]
  );

  const filteredPolicies = useCallback(() => {
    const policies = getPolicies();
    if (!policySearchQuery) return policies;

    return policies.filter((policy) => {
      return (
        !policySearchQuery ||
        policy.name.toLowerCase().includes(policySearchQuery.toLowerCase()) ||
        (policy.content &&
          policy.content
            .toLowerCase()
            .includes(policySearchQuery.toLowerCase()))
      );
    });
  }, [getPolicies, policySearchQuery]);

  // Policy link/unlink handlers
  const handleLinkPolicy = useCallback(
    (policyId: string) => {
      if (!control.id) return;

      setIsLinkingPolicy(true);

      commitCreatePolicyMapping({
        variables: {
          input: {
            controlId: control.id,
            policyId: policyId,
          },
        },
        onCompleted: (_, errors) => {
          setIsLinkingPolicy(false);

          if (errors) {
            console.error("Error linking policy:", errors);
            toast({
              title: "Error",
              description: "Failed to link policy. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked policies data
          fetchQuery<ControlLinkedPoliciesQuery>(
            environment,
            linkedPoliciesQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedPoliciesData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked policies:", error);
            },
          });

          toast({
            title: "Success",
            description: "Policy successfully linked to control.",
          });
        },
        onError: (error) => {
          setIsLinkingPolicy(false);
          console.error("Error linking policy:", error);
          toast({
            title: "Error",
            description: "Failed to link policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitCreatePolicyMapping, control.id, environment, toast]
  );

  const handleUnlinkPolicy = useCallback(
    (policyId: string) => {
      if (!control.id) return;

      setIsUnlinkingPolicy(true);

      commitDeletePolicyMapping({
        variables: {
          input: {
            controlId: control.id,
            policyId: policyId,
          },
        },
        onCompleted: (_, errors) => {
          setIsUnlinkingPolicy(false);

          if (errors) {
            console.error("Error unlinking policy:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink policy. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked policies data
          fetchQuery<ControlLinkedPoliciesQuery>(
            environment,
            linkedPoliciesQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedPoliciesData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked policies:", error);
            },
          });

          toast({
            title: "Success",
            description: "Policy successfully unlinked from control.",
          });
        },
        onError: (error) => {
          setIsUnlinkingPolicy(false);
          console.error("Error unlinking policy:", error);
          toast({
            title: "Error",
            description: "Failed to unlink policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitDeletePolicyMapping, control.id, environment, toast]
  );

  const handleOpenPolicyMappingDialog = useCallback(() => {
    loadPoliciesData();
    setIsPolicyMappingDialogOpen(true);
  }, [loadPoliciesData]);

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

  const getStateColor = (state: string | undefined): string => {
    if (!state) return "bg-secondary-bg text-secondary";

    switch (state) {
      case "NOT_STARTED":
        return "bg-secondary-bg text-secondary";
      case "IN_PROGRESS":
        return "bg-info-bg text-info";
      case "IMPLEMENTED":
        return "bg-success-bg text-success";
      case "NOT_APPLICABLE":
        return "bg-warning-bg text-warning";
      default:
        return "bg-secondary-bg text-secondary";
    }
  };

  return (
    <div className="w-auto p-5 flex items-start gap-5">
      <div className="font-mono text-lg px-1 py-0.25 rounded-sm bg-active-bg border-mid-b border font-bold">
        {control.referenceId}
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-medium">{control.name}</h2>

        {/* Control Description */}
        {control.description && (
          <div className="mt-4 text-tertiary">{control.description}</div>
        )}

        {/* Security Measures Section */}
        <div className="mt-8">
          {/* Mesure Mapping Dialog */}
          <Dialog
            open={isMesureMappingDialogOpen}
            onOpenChange={setIsMesureMappingDialogOpen}
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                    <Input
                      placeholder="Search security measures by name or description..."
                      value={mesureSearchQuery}
                      onChange={(e) => setMesureSearchQuery(e.target.value)}
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
                      {getMesureCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {isLoadingMesures ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-info" />
                    <span className="ml-2">Loading security measures...</span>
                  </div>
                ) : (
                  <div className="max-h-[50vh] overflow-y-auto pr-2">
                    {filteredMesures().length === 0 ? (
                      <div className="text-center py-8 text-secondary">
                        No security measures found. Try adjusting your search or
                        select a different category.
                      </div>
                    ) : (
                      <table className="w-full bg-level-1">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">State</th>
                            <th className="py-3 px-4 font-medium text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMesures().map((mesure) => {
                            const isLinked = isMesureLinked(mesure.id);
                            return (
                              <tr
                                key={mesure.id}
                                className="border-b hover:bg-invert-bg"
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium">
                                    {mesure.name}
                                  </div>
                                  {mesure.description && (
                                    <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                                      {mesure.description}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs ${getStateColor(
                                      mesure.state
                                    )} inline-block`}
                                  >
                                    {formatState(mesure.state)}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {isLinked ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUnlinkMesure(mesure.id)
                                      }
                                      disabled={isUnlinkingMesure}
                                      className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
                                    >
                                      {isUnlinkingMesure ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Unlink</span>
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        handleLinkMesure(mesure.id)
                                      }
                                      disabled={isLinkingMesure}
                                      className="text-xs h-7  text-info border-info-b hover:bg-h-info-bg"
                                    >
                                      {isLinkingMesure ? (
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
                <Button onClick={() => setIsMesureMappingDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Linked Mesures List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-secondary">
                Security measures
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenMesureMappingDialog}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link Security Measures</span>
              </Button>
            </div>

            {isLoadingMesures ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="w-6 h-6 animate-spin text-info" />
                <span className="ml-2">Loading security measures...</span>
              </div>
            ) : linkedMesuresData?.control?.mesures?.edges &&
              linkedMesuresData.control.mesures.edges.length > 0 ? (
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">State</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getLinkedMesures().map((mesure) => (
                      <tr
                        key={mesure.id}
                        className="border-b hover:bg-invert-bg"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{mesure.name}</div>
                          {mesure.description && (
                            <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                              {mesure.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${getStateColor(
                              mesure.state
                            )} inline-block`}
                          >
                            {formatState(mesure.state)}
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
                                to={`/organizations/${organizationId}/mesures/${mesure.id}`}
                              >
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnlinkMesure(mesure.id)}
                              disabled={isUnlinkingMesure}
                              className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
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
              <div className="text-center py-8 text-secondary border rounded-md">
                No security measures linked to this control yet. Click
                &quot;Link Security Measures&quot; to connect some.
              </div>
            )}
          </div>
        </div>

        {/* Policies Section */}
        <div className="mt-8">
          {/* Policy Mapping Dialog */}
          <Dialog
            open={isPolicyMappingDialogOpen}
            onOpenChange={setIsPolicyMappingDialogOpen}
          >
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Link Policies to Control</DialogTitle>
                <DialogDescription>
                  Search and select policies to link to this control. This helps
                  track which policies address this control.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                    <Input
                      placeholder="Search policies by name or content..."
                      value={policySearchQuery}
                      onChange={(e) => setPolicySearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {isLoadingPolicies ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-info" />
                    <span className="ml-2">Loading policies...</span>
                  </div>
                ) : (
                  <div className="max-h-[50vh] overflow-y-auto pr-2">
                    {filteredPolicies().length === 0 ? (
                      <div className="text-center py-8 text-secondary">
                        No policies found. Try adjusting your search.
                      </div>
                    ) : (
                      <table className="w-full bg-level-1">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">
                              Review Date
                            </th>
                            <th className="py-3 px-4 font-medium text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPolicies().map((policy) => {
                            const isLinked = isPolicyLinked(policy.id);
                            return (
                              <tr
                                key={policy.id}
                                className="border-b hover:bg-invert-bg"
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium">
                                    {policy.name}
                                  </div>
                                  {policy.content && (
                                    <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                                      {policy.content}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                      policy.status === "ACTIVE"
                                        ? "bg-success-bg text-success"
                                        : "bg-secondary-bg text-secondary"
                                    } inline-block`}
                                  >
                                    {policy.status}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {policy.reviewDate
                                    ? new Date(
                                        policy.reviewDate
                                      ).toLocaleDateString()
                                    : "Not set"}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {isLinked ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUnlinkPolicy(policy.id)
                                      }
                                      disabled={isUnlinkingPolicy}
                                      className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
                                    >
                                      {isUnlinkingPolicy ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Unlink</span>
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        handleLinkPolicy(policy.id)
                                      }
                                      disabled={isLinkingPolicy}
                                      className="text-xs h-7 text-info border-info-b hover:bg-h-info-bg"
                                    >
                                      {isLinkingPolicy ? (
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
                <Button onClick={() => setIsPolicyMappingDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Linked Policies List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-secondary">Policies</h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenPolicyMappingDialog}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link Policies</span>
              </Button>
            </div>

            {isLoadingPolicies ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="w-6 h-6 animate-spin text-info" />
                <span className="ml-2">Loading policies...</span>
              </div>
            ) : linkedPoliciesData?.control?.policies?.edges &&
              linkedPoliciesData.control.policies.edges.length > 0 ? (
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Review Date</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getLinkedPolicies().map((policy) => (
                      <tr
                        key={policy.id}
                        className="border-b hover:bg-invert-bg"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{policy.name}</div>
                          {policy.content && (
                            <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                              {policy.content}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              policy.status === "ACTIVE"
                                ? "bg-success-bg text-success"
                                : "bg-secondary-bg text-secondary"
                            } inline-block`}
                          >
                            {policy.status}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {policy.reviewDate
                            ? new Date(policy.reviewDate).toLocaleDateString()
                            : "Not set"}
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
                                to={`/organizations/${organizationId}/policies/${policy.id}`}
                              >
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnlinkPolicy(policy.id)}
                              disabled={isUnlinkingPolicy}
                              className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
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
              <div className="text-center py-8 text-secondary border rounded-md">
                No policies linked to this control yet. Click &quot;Link
                Policies&quot; to connect some.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
