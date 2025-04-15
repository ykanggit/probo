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
import {
  Plus,
  Trash2,
  Search,
  Tag,
  Edit,
  ShieldCheck,
  Shield,
  Handshake,
  Ban,
  User,
} from "lucide-react";
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
  ShowRiskViewOrganizationMesuresQuery,
  ShowRiskViewOrganizationMesuresQuery$data,
} from "./__generated__/ShowRiskViewOrganizationMesuresQuery.graphql";
import { ShowRiskViewCreateRiskMesureMappingMutation } from "./__generated__/ShowRiskViewCreateRiskMesureMappingMutation.graphql";
import { ShowRiskViewDeleteRiskMesureMappingMutation } from "./__generated__/ShowRiskViewDeleteRiskMesureMappingMutation.graphql";
import {
  ShowRiskViewOrganizationPoliciesQuery,
  ShowRiskViewOrganizationPoliciesQuery$data,
} from "./__generated__/ShowRiskViewOrganizationPoliciesQuery.graphql";
import { ShowRiskViewCreateRiskPolicyMappingMutation } from "./__generated__/ShowRiskViewCreateRiskPolicyMappingMutation.graphql";
import { ShowRiskViewDeleteRiskPolicyMappingMutation } from "./__generated__/ShowRiskViewDeleteRiskPolicyMappingMutation.graphql";

const showRiskViewQuery = graphql`
  query ShowRiskViewQuery($riskId: ID!) {
    node(id: $riskId) {
      id
      ... on Risk {
        name
        description
        treatment
        owner {
          id
          fullName
        }
        inherentLikelihood
        inherentImpact
        residualLikelihood
        residualImpact
        createdAt
        updatedAt
        mesures(first: 100) @connection(key: "Risk__mesures") {
          edges {
            node {
              id
              name
              description
              category
              createdAt
              state
            }
          }
        }
        policies(first: 100) @connection(key: "Risk__policies") {
          edges {
            node {
              id
              name
              status
              createdAt
            }
          }
        }
        controls(first: 100) @connection(key: "Risk__controls") {
          edges {
            node {
              id
              referenceId
              name
              description
              createdAt
            }
          }
        }
      }
    }
  }
`;

// Add query to fetch all mesures for the organization
const organizationMesuresQuery = graphql`
  query ShowRiskViewOrganizationMesuresQuery($organizationId: ID!) {
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

// Add query to fetch all policies for the organization
const organizationPoliciesQuery = graphql`
  query ShowRiskViewOrganizationPoliciesQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        policies(first: 100) @connection(key: "Organization__policies") {
          edges {
            node {
              id
              name
              status
            }
          }
        }
      }
    }
  }
`;

// Add mutation to create risk-mesure mapping
const createRiskMesureMappingMutation = graphql`
  mutation ShowRiskViewCreateRiskMesureMappingMutation(
    $input: CreateRiskMesureMappingInput!
  ) {
    createRiskMesureMapping(input: $input) {
      success
    }
  }
`;

// Add mutation to delete risk-mesure mapping
const deleteRiskMesureMappingMutation = graphql`
  mutation ShowRiskViewDeleteRiskMesureMappingMutation(
    $input: DeleteRiskMesureMappingInput!
  ) {
    deleteRiskMesureMapping(input: $input) {
      success
    }
  }
`;

// Add mutation to create risk-policy mapping
const createRiskPolicyMappingMutation = graphql`
  mutation ShowRiskViewCreateRiskPolicyMappingMutation(
    $input: CreateRiskPolicyMappingInput!
  ) {
    createRiskPolicyMapping(input: $input) {
      success
    }
  }
`;

// Add mutation to delete risk-policy mapping
const deleteRiskPolicyMappingMutation = graphql`
  mutation ShowRiskViewDeleteRiskPolicyMappingMutation(
    $input: DeleteRiskPolicyMappingInput!
  ) {
    deleteRiskPolicyMapping(input: $input) {
      success
    }
  }
`;

function getRiskSeverity(likelihood: number, impact: number) {
  const score = likelihood * impact;
  if (score >= 20)
    return {
      level: "Catastrophic",
      score: score,
      style: {
        backgroundColor: "#ef4444",
        color: "white",
      },
    };
  if (score >= 12)
    return {
      level: "Critical",
      score: score,
      style: {
        backgroundColor: "#f59e0b",
        color: "white",
      },
    };
  if (score >= 5)
    return {
      level: "Marginal",
      score: score,
      style: {
        backgroundColor: "#10b981",
        color: "inherit",
      },
    };
  return {
    level: "Negligible",
    score: score,
    style: {
      backgroundColor: "#94a3b8",
      color: "inherit",
    },
  };
}

// Add helper functions to convert numerical values to labels
function getLikelihoodLabel(likelihood: number): {
  label: string;
  style: React.CSSProperties;
} {
  if (likelihood === 5)
    return {
      label: "Frequent (5)",
      style: { backgroundColor: "#ef4444", color: "white" },
    };
  if (likelihood === 4)
    return {
      label: "Probable (4)",
      style: { backgroundColor: "#f59e0b", color: "white" },
    };
  if (likelihood === 3)
    return {
      label: "Occasional (3)",
      style: { backgroundColor: "#eab308", color: "black" },
    };
  if (likelihood === 2)
    return {
      label: "Remote (2)",
      style: { backgroundColor: "#10b981", color: "black" },
    };
  return {
    label: "Improbable (1)",
    style: { backgroundColor: "#94a3b8", color: "black" },
  };
}

function getImpactLabel(impact: number): {
  label: string;
  style: React.CSSProperties;
} {
  if (impact === 5)
    return {
      label: "Catastrophic (5)",
      style: { backgroundColor: "#ef4444", color: "white" },
    };
  if (impact === 4)
    return {
      label: "Significant (4)",
      style: { backgroundColor: "#f59e0b", color: "white" },
    };
  if (impact === 3)
    return {
      label: "Moderate (3)",
      style: { backgroundColor: "#eab308", color: "black" },
    };
  if (impact === 2)
    return {
      label: "Low (2)",
      style: { backgroundColor: "#10b981", color: "black" },
    };
  return {
    label: "Negligible (1)",
    style: { backgroundColor: "#94a3b8", color: "black" },
  };
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

  // Cast the node to Risk type without using any
  const risk = data.node;
  const severity = getRiskSeverity(
    risk.inherentLikelihood!,
    risk.inherentImpact!
  );

  // Fix typing for mesures
  const mesures = risk.mesures?.edges?.map((edge) => edge.node) || [];
  const residualSeverity = getRiskSeverity(
    risk.residualLikelihood!,
    risk.residualImpact!
  );

  // Fix typing for policies
  const policies = risk.policies?.edges?.map((edge) => edge.node) || [];

  // Fix typing for controls
  const controls = risk.controls?.edges?.map((edge) => edge.node) || [];

  // Add state for mesure mapping dialog
  const [isMesureDialogOpen, setIsMesureDialogOpen] = useState(false);
  const [organizationMesuresData, setOrganizationMesuresData] =
    useState<ShowRiskViewOrganizationMesuresQuery$data | null>(null);
  const [mesureSearchQuery, setMesureSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isLoadingMesures, setIsLoadingMesures] = useState(false);
  const [linkingMesures, setLinkingMesures] = useState<Record<string, boolean>>(
    {}
  );
  const [unlinkingMesures, setUnlinkingMesures] = useState<
    Record<string, boolean>
  >({});

  // Add state for policy mapping dialog
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [organizationPoliciesData, setOrganizationPoliciesData] =
    useState<ShowRiskViewOrganizationPoliciesQuery$data | null>(null);
  const [policySearchQuery, setPolicySearchQuery] = useState("");
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [linkingPolicies, setLinkingPolicies] = useState<
    Record<string, boolean>
  >({});
  const [unlinkingPolicies, setUnlinkingPolicies] = useState<
    Record<string, boolean>
  >({});

  // Setup mutation hooks
  const [createRiskMesureMapping] =
    useMutation<ShowRiskViewCreateRiskMesureMappingMutation>(
      createRiskMesureMappingMutation
    );
  const [deleteRiskMesureMapping] =
    useMutation<ShowRiskViewDeleteRiskMesureMappingMutation>(
      deleteRiskMesureMappingMutation
    );

  // Setup policy mutation hooks
  const [createRiskPolicyMapping] =
    useMutation<ShowRiskViewCreateRiskPolicyMappingMutation>(
      createRiskPolicyMappingMutation
    );
  const [deleteRiskPolicyMapping] =
    useMutation<ShowRiskViewDeleteRiskPolicyMappingMutation>(
      deleteRiskPolicyMappingMutation
    );

  // Clear filters when dialog closes
  useEffect(() => {
    if (!isMesureDialogOpen) {
      setMesureSearchQuery("");
      setCategoryFilter(null);
      setLinkingMesures({});
      setUnlinkingMesures({});
    }
  }, [isMesureDialogOpen]);

  // Clear filters when policy dialog closes
  useEffect(() => {
    if (!isPolicyDialogOpen) {
      setPolicySearchQuery("");
      setLinkingPolicies({});
      setUnlinkingPolicies({});
    }
  }, [isPolicyDialogOpen]);

  // Load mesures data when needed
  const loadMesuresData = useCallback(() => {
    if (!organizationId || !risk.id) return;

    setIsLoadingMesures(true);

    // Fetch all mesures for the organization
    fetchQuery<ShowRiskViewOrganizationMesuresQuery>(
      environment,
      organizationMesuresQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationMesuresData(data);
        setIsLoadingMesures(false);
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
  }, [risk.id, environment, organizationId, toast]);

  // Load policies data when needed
  const loadPoliciesData = useCallback(() => {
    if (!organizationId || !risk.id) return;

    setIsLoadingPolicies(true);

    // Fetch all policies for the organization
    fetchQuery<ShowRiskViewOrganizationPoliciesQuery>(
      environment,
      organizationPoliciesQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationPoliciesData(data);
        setIsLoadingPolicies(false);
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
  }, [risk.id, environment, organizationId, toast]);

  // Helper functions
  const getMesures = useCallback(() => {
    if (!organizationMesuresData?.organization?.mesures?.edges) return [];
    return organizationMesuresData.organization.mesures.edges.map(
      (edge) => edge.node
    );
  }, [organizationMesuresData]);

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
  }, [getMesures, mesureSearchQuery, categoryFilter]);

  // Helper functions for policies
  const getPolicies = useCallback(() => {
    if (!organizationPoliciesData?.organization?.policies?.edges) return [];
    return organizationPoliciesData.organization.policies.edges.map(
      (edge) => edge.node
    );
  }, [organizationPoliciesData]);

  const filteredPolicies = useCallback(() => {
    const policies = getPolicies();
    if (!policySearchQuery) return policies;

    return policies.filter((policy) => {
      return (
        !policySearchQuery ||
        policy.name.toLowerCase().includes(policySearchQuery.toLowerCase())
      );
    });
  }, [getPolicies, policySearchQuery]);

  // Handle linking a mesure to this risk
  const handleLinkMesure = useCallback(
    (
      mesure: NonNullable<
        NonNullable<
          ShowRiskViewOrganizationMesuresQuery$data["organization"]
        >["mesures"]
      >["edges"][0]["node"]
    ) => {
      if (!risk.id) return;

      // Track this specific mesure as linking
      setLinkingMesures((prev) => ({ ...prev, [mesure.id]: true }));

      createRiskMesureMapping({
        variables: {
          input: {
            riskId: risk.id,
            mesureId: mesure.id,
          },
        },
        onCompleted: (_, errors) => {
          setLinkingMesures((prev) => ({
            ...prev,
            [mesure.id]: false,
          }));

          if (errors && errors.length > 0) {
            console.error("Error linking mesure:", errors);
            toast({
              title: "Error",
              description: "Failed to link mesure. Please try again.",
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
            description: `Linked mesure "${mesure.name}" to this risk.`,
          });
        },
        onError: (error) => {
          setLinkingMesures((prev) => ({
            ...prev,
            [mesure.id]: false,
          }));
          console.error("Error linking mesure:", error);
          toast({
            title: "Error",
            description: "Failed to link mesure. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [risk.id, createRiskMesureMapping, toast, environment, loadQuery]
  );

  // Handle unlinking a mesure from this risk
  const handleUnlinkMesure = useCallback(
    (
      mesure: NonNullable<
        NonNullable<
          ShowRiskViewOrganizationMesuresQuery$data["organization"]
        >["mesures"]
      >["edges"][0]["node"]
    ) => {
      if (!risk.id) return;

      // Track this specific mesure as unlinking
      setUnlinkingMesures((prev) => ({ ...prev, [mesure.id]: true }));

      deleteRiskMesureMapping({
        variables: {
          input: {
            riskId: risk.id,
            mesureId: mesure.id,
          },
        },
        onCompleted: (_, errors) => {
          setUnlinkingMesures((prev) => ({
            ...prev,
            [mesure.id]: false,
          }));

          if (errors && errors.length > 0) {
            console.error("Error unlinking mesure:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink mesure. Please try again.",
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
            description: `Unlinked mesure "${mesure.name}" from this risk.`,
          });
        },
        onError: (error) => {
          setUnlinkingMesures((prev) => ({
            ...prev,
            [mesure.id]: false,
          }));
          console.error("Error unlinking mesure:", error);
          toast({
            title: "Error",
            description: "Failed to unlink mesure. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [risk.id, deleteRiskMesureMapping, toast, environment, loadQuery]
  );

  // Handle linking a policy to this risk
  const handleLinkPolicy = useCallback(
    (
      policy: NonNullable<
        NonNullable<
          ShowRiskViewOrganizationPoliciesQuery$data["organization"]
        >["policies"]
      >["edges"][0]["node"]
    ) => {
      if (!risk.id) return;

      // Track this specific policy as linking
      setLinkingPolicies((prev) => ({ ...prev, [policy.id]: true }));

      createRiskPolicyMapping({
        variables: {
          input: {
            riskId: risk.id,
            policyId: policy.id,
          },
        },
        onCompleted: (_, errors) => {
          setLinkingPolicies((prev) => ({
            ...prev,
            [policy.id]: false,
          }));

          if (errors && errors.length > 0) {
            console.error("Error linking policy:", errors);
            toast({
              title: "Error",
              description: "Failed to link policy. Please try again.",
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
            description: `Linked policy "${policy.name}" to this risk.`,
          });
        },
        onError: (error) => {
          setLinkingPolicies((prev) => ({
            ...prev,
            [policy.id]: false,
          }));
          console.error("Error linking policy:", error);
          toast({
            title: "Error",
            description: "Failed to link policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [risk.id, createRiskPolicyMapping, toast, environment, loadQuery]
  );

  // Handle unlinking a policy from this risk
  const handleUnlinkPolicy = useCallback(
    (
      policy: NonNullable<
        NonNullable<
          ShowRiskViewOrganizationPoliciesQuery$data["organization"]
        >["policies"]
      >["edges"][0]["node"]
    ) => {
      if (!risk.id) return;

      // Track this specific policy as unlinking
      setUnlinkingPolicies((prev) => ({ ...prev, [policy.id]: true }));

      deleteRiskPolicyMapping({
        variables: {
          input: {
            riskId: risk.id,
            policyId: policy.id,
          },
        },
        onCompleted: (_, errors) => {
          setUnlinkingPolicies((prev) => ({
            ...prev,
            [policy.id]: false,
          }));

          if (errors && errors.length > 0) {
            console.error("Error unlinking policy:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink policy. Please try again.",
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
            description: `Unlinked policy "${policy.name}" from this risk.`,
          });
        },
        onError: (error) => {
          setUnlinkingPolicies((prev) => ({
            ...prev,
            [policy.id]: false,
          }));
          console.error("Error unlinking policy:", error);
          toast({
            title: "Error",
            description: "Failed to unlink policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [risk.id, deleteRiskPolicyMapping, toast, environment, loadQuery]
  );

  return (
    <PageTemplate
      title={risk.name ?? ""}
      description={risk.description || ""}
      actions={
        <Button variant="outline" asChild>
          <Link to={`/organizations/${organizationId}/risks/${risk.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Risk
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Risk Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Risk Management Overview */}
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex items-center">
                  {risk.treatment === "MITIGATED" && (
                    <Shield className="h-6 w-6 mr-3 text-blue-500" />
                  )}
                  {risk.treatment === "TRANSFERRED" && (
                    <Handshake className="h-6 w-6 mr-3 text-purple-500" />
                  )}
                  {risk.treatment === "AVOIDED" && (
                    <Ban className="h-6 w-6 mr-3 text-red-500" />
                  )}
                  {risk.treatment === "ACCEPTED" && (
                    <ShieldCheck className="h-6 w-6 mr-3 text-green-500" />
                  )}
                  <div>
                    <p className="text-xs text-slate-500 uppercase">
                      Treatment
                    </p>
                    <p className="text-base font-medium capitalize mt-1">
                      {risk.treatment ? risk.treatment.toLowerCase() : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="h-6 w-6 mr-3 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">
                      Risk Owner
                    </p>
                    <p className="text-base font-medium mt-1 truncate">
                      {risk.owner ? (
                        <Link
                          to={`/organizations/${organizationId}/people/${risk.owner.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {risk.owner.fullName}
                        </Link>
                      ) : (
                        "Unassigned"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <h3 className="text-sm font-medium mb-6">Risk Assessment</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Initial Assessment */}
                  <div>
                    <h4 className="text-sm font-medium mb-5 flex items-center">
                      <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                      Initial Assessment
                    </h4>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">
                          Likelihood
                        </p>
                        <div
                          className="px-5 py-2 rounded-md font-medium text-sm flex justify-center items-center whitespace-nowrap"
                          style={
                            getLikelihoodLabel(risk.inherentLikelihood!).style
                          }
                        >
                          {getLikelihoodLabel(risk.inherentLikelihood!).label}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Impact</p>
                        <div
                          className="px-5 py-2 rounded-md font-medium text-sm flex justify-center items-center whitespace-nowrap"
                          style={getImpactLabel(risk.inherentImpact!).style}
                        >
                          {getImpactLabel(risk.inherentImpact!).label}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Severity</p>
                        <div
                          className="px-5 py-2 rounded-md font-medium text-sm flex justify-center items-center whitespace-nowrap"
                          style={severity.style}
                        >
                          {severity.level} (
                          {risk.inherentLikelihood! * risk.inherentImpact!})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Residual Assessment */}
                  <div>
                    <h4 className="text-sm font-medium mb-5 flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      After Treatment
                    </h4>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">
                          Likelihood
                        </p>
                        <div
                          className="px-5 py-2 rounded-md font-medium text-sm flex justify-center items-center whitespace-nowrap"
                          style={
                            getLikelihoodLabel(risk.residualLikelihood!).style
                          }
                        >
                          {getLikelihoodLabel(risk.residualLikelihood!).label}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Impact</p>
                        <div
                          className="px-5 py-2 rounded-md font-medium text-sm flex justify-center items-center whitespace-nowrap"
                          style={getImpactLabel(risk.residualImpact!).style}
                        >
                          {getImpactLabel(risk.residualImpact!).label}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-2">Severity</p>
                        <div
                          className="px-5 py-2 rounded-md font-medium text-sm flex justify-center items-center whitespace-nowrap"
                          style={residualSeverity.style}
                        >
                          {residualSeverity.level} (
                          {risk.residualLikelihood! * risk.residualImpact!})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Reduction Summary */}
                {(risk.inherentLikelihood !== risk.residualLikelihood ||
                  risk.inherentImpact !== risk.residualImpact) && (
                  <div className="mt-6 text-center pt-4 border-t">
                    <p className="text-sm text-slate-600">
                      Risk severity reduced from{" "}
                      <span className="font-semibold">
                        {severity.level} (
                        {risk.inherentLikelihood! * risk.inherentImpact!})
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold">
                        {residualSeverity.level} (
                        {risk.residualLikelihood! * risk.residualImpact!})
                      </span>
                      {risk.treatment === "MITIGATED" &&
                        risk.mesures?.edges &&
                        risk.mesures.edges.length > 0 &&
                        ` with ${risk.mesures.edges.length} ${
                          risk.mesures.edges.length === 1
                            ? "measure"
                            : "measures"
                        }`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mesures" className="w-full">
          <TabsList>
            <TabsTrigger value="mesures">Mesures</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="mesures" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Risk Mesures</h2>
              <Button
                onClick={() => {
                  setIsMesureDialogOpen(true);
                  loadMesuresData();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Link Mesure
              </Button>
            </div>
            {risk.mesures?.edges && risk.mesures.edges.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-full">Mesure</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risk.mesures?.edges.map(({ node: mesure }) => (
                      <TableRow key={mesure.id}>
                        <TableCell>
                          <Link
                            to={`/organizations/${organizationId}/mesures/${mesure.id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {mesure.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUnlinkMesure(mesure)}
                            disabled={unlinkingMesures[mesure.id] || false}
                            title="Unlink mesure"
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
                <p>No mesures associated with this risk.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Risk Policies</h2>
              <Button
                onClick={() => {
                  setIsPolicyDialogOpen(true);
                  loadPoliciesData();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Link Policy
              </Button>
            </div>
            {policies.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-full">Policy</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell>
                          <Link
                            to={`/organizations/${organizationId}/policies/${policy.id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {policy.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUnlinkPolicy(policy)}
                            disabled={unlinkingPolicies[policy.id] || false}
                            title="Unlink policy"
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
                <p>No policies associated with this risk.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Related Controls</h2>
            </div>
            {controls.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-full">Control</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {controls.map((control) => (
                      <TableRow key={control.id}>
                        <TableCell>
                          <Link
                            to={`/organizations/${organizationId}/controls/${control.id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {control.referenceId} - {control.name}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-secondary">
                <ShieldCheck className="mx-auto h-10 w-10 mb-2 opacity-30" />
                <p>No controls associated with this risk.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog for linking mesures */}
        <Dialog open={isMesureDialogOpen} onOpenChange={setIsMesureDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle>Manage Risk Mesures</DialogTitle>
                  <DialogDescription>
                    Link or unlink mesures to manage this risk.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-tertiary" />
                    <Input
                      placeholder="Search mesures..."
                      className="pl-8"
                      value={mesureSearchQuery}
                      onChange={(e) => setMesureSearchQuery(e.target.value)}
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
                    {getMesureCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md max-h-96 overflow-y-auto">
                {isLoadingMesures ? (
                  <div className="p-4 text-center">Loading mesures...</div>
                ) : filteredMesures().length === 0 ? (
                  <div className="p-4 text-center">No mesures found.</div>
                ) : (
                  <div className="divide-y">
                    {filteredMesures().map((mesure) => {
                      // For each render, recalculate linked status directly against the current risk data
                      const isLinked = risk.mesures?.edges?.some(
                        (edge) => edge.node.id === mesure.id
                      );
                      const isLinking = linkingMesures[mesure.id] || false;
                      const isUnlinking = unlinkingMesures[mesure.id] || false;

                      return (
                        <div
                          key={mesure.id}
                          className="relative p-4 hover:bg-blue-50 transition-colors duration-150"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{mesure.name}</h3>
                              {mesure.category && (
                                <Badge
                                  variant="outline"
                                  className="text-xs font-normal"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {mesure.category}
                                </Badge>
                              )}
                            </div>
                            {isLinked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUnlinking}
                                onClick={() => handleUnlinkMesure(mesure)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                {isUnlinking ? "Unlinking..." : "Unlink"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                disabled={isLinking}
                                onClick={() => handleLinkMesure(mesure)}
                              >
                                {isLinking ? "Linking..." : "Link"}
                              </Button>
                            )}
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
                onClick={() => setIsMesureDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for linking policies */}
        <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle>Manage Risk Policies</DialogTitle>
                  <DialogDescription>
                    Link or unlink policies to manage this risk.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-tertiary" />
                    <Input
                      placeholder="Search policies..."
                      className="pl-8"
                      value={policySearchQuery}
                      onChange={(e) => setPolicySearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-md max-h-96 overflow-y-auto">
                {isLoadingPolicies ? (
                  <div className="p-4 text-center">Loading policies...</div>
                ) : filteredPolicies().length === 0 ? (
                  <div className="p-4 text-center">No policies found.</div>
                ) : (
                  <div className="divide-y">
                    {filteredPolicies().map((policy) => {
                      // For each render, recalculate linked status directly against the current risk data
                      const isLinked = policies.some(
                        (riskPolicy) => riskPolicy.id === policy.id
                      );
                      const isLinking = linkingPolicies[policy.id] || false;
                      const isUnlinking = unlinkingPolicies[policy.id] || false;

                      return (
                        <div
                          key={policy.id}
                          className="relative p-4 hover:bg-blue-50 transition-colors duration-150"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{policy.name}</h3>
                            </div>
                            {isLinked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUnlinking}
                                onClick={() => handleUnlinkPolicy(policy)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                {isUnlinking ? "Unlinking..." : "Unlink"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                disabled={isLinking}
                                onClick={() => handleLinkPolicy(policy)}
                              >
                                {isLinking ? "Linking..." : "Link"}
                              </Button>
                            )}
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
                onClick={() => setIsPolicyDialogOpen(false)}
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
