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
import { Plus, Trash2, Search, Tag, Edit, ShieldCheck } from "lucide-react";
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
import { ShowRiskViewCreateRiskMitigationMappingMutation } from "./__generated__/ShowRiskViewCreateRiskMitigationMappingMutation.graphql";
import { ShowRiskViewDeleteRiskMitigationMappingMutation } from "./__generated__/ShowRiskViewDeleteRiskMitigationMappingMutation.graphql";
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
        inherentLikelihood
        inherentImpact
        residualLikelihood
        residualImpact
        createdAt
        updatedAt
        mitigations(first: 100) @connection(key: "Risk__mitigations") {
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

// Add mutation to create risk-mitigation mapping
const createRiskMitigationMappingMutation = graphql`
  mutation ShowRiskViewCreateRiskMitigationMappingMutation(
    $input: CreateRiskMitigationMappingInput!
  ) {
    createRiskMitigationMapping(input: $input) {
      success
    }
  }
`;

// Add mutation to delete risk-mitigation mapping
const deleteRiskMitigationMappingMutation = graphql`
  mutation ShowRiskViewDeleteRiskMitigationMappingMutation(
    $input: DeleteRiskMitigationMappingInput!
  ) {
    deleteRiskMitigationMapping(input: $input) {
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

  // Cast the node to Risk type without using any
  const risk = data.node;
  const severity = getRiskSeverity(
    risk.inherentLikelihood!,
    risk.inherentImpact!
  );

  // Fix typing for mitigations
  const mitigations = risk.mitigations?.edges?.map((edge) => edge.node) || [];
  const residualSeverity = getRiskSeverity(
    risk.residualLikelihood!,
    risk.residualImpact!
  );

  // Fix typing for policies
  const policies = risk.policies?.edges?.map((edge) => edge.node) || [];

  // Fix typing for controls
  const controls = risk.controls?.edges?.map((edge) => edge.node) || [];

  // Add state for mitigation mapping dialog
  const [isMitigationDialogOpen, setIsMitigationDialogOpen] = useState(false);
  const [organizationMitigationsData, setOrganizationMitigationsData] =
    useState<ShowRiskViewOrganizationMitigationsQuery$data | null>(null);
  const [mitigationSearchQuery, setMitigationSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isLoadingMitigations, setIsLoadingMitigations] = useState(false);
  const [linkingMitigations, setLinkingMitigations] = useState<
    Record<string, boolean>
  >({});
  const [unlinkingMitigations, setUnlinkingMitigations] = useState<
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
  const [createRiskMitigationMapping] =
    useMutation<ShowRiskViewCreateRiskMitigationMappingMutation>(
      createRiskMitigationMappingMutation
    );
  const [deleteRiskMitigationMapping] =
    useMutation<ShowRiskViewDeleteRiskMitigationMappingMutation>(
      deleteRiskMitigationMappingMutation
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
    if (!isMitigationDialogOpen) {
      setMitigationSearchQuery("");
      setCategoryFilter(null);
      setLinkingMitigations({});
      setUnlinkingMitigations({});
    }
  }, [isMitigationDialogOpen]);

  // Clear filters when policy dialog closes
  useEffect(() => {
    if (!isPolicyDialogOpen) {
      setPolicySearchQuery("");
      setLinkingPolicies({});
      setUnlinkingPolicies({});
    }
  }, [isPolicyDialogOpen]);

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

      // Track this specific mitigation as linking
      setLinkingMitigations((prev) => ({ ...prev, [mitigation.id]: true }));

      createRiskMitigationMapping({
        variables: {
          input: {
            riskId: risk.id,
            mitigationId: mitigation.id,
          },
        },
        onCompleted: (_, errors) => {
          setLinkingMitigations((prev) => ({
            ...prev,
            [mitigation.id]: false,
          }));

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
          setLinkingMitigations((prev) => ({
            ...prev,
            [mitigation.id]: false,
          }));
          console.error("Error linking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to link mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [risk.id, createRiskMitigationMapping, toast, environment, loadQuery]
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

      // Track this specific mitigation as unlinking
      setUnlinkingMitigations((prev) => ({ ...prev, [mitigation.id]: true }));

      deleteRiskMitigationMapping({
        variables: {
          input: {
            riskId: risk.id,
            mitigationId: mitigation.id,
          },
        },
        onCompleted: (_, errors) => {
          setUnlinkingMitigations((prev) => ({
            ...prev,
            [mitigation.id]: false,
          }));

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
          setUnlinkingMitigations((prev) => ({
            ...prev,
            [mitigation.id]: false,
          }));
          console.error("Error unlinking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to unlink mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [risk.id, deleteRiskMitigationMapping, toast, environment, loadQuery]
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
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-secondary">
                  Likelihood
                </h3>
                <p className="mt-1 text-lg">
                  {(risk.inherentLikelihood! * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary">Impact</h3>
                <p className="mt-1 text-lg">
                  {(risk.inherentImpact! * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-secondary">Severity</h3>
                <p className="mt-1">
                  <Badge className={severity.class}>{severity.level}</Badge>
                </p>
              </div>
            </div>

            {/* Residual risk section */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-md font-semibold mb-3">Residual Risk</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-secondary">
                    Residual Likelihood
                  </h3>
                  <p className="mt-1 text-lg">
                    {(risk.residualLikelihood! * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    {risk.residualLikelihood !== risk.inherentLikelihood
                      ? `Reduced by ${(
                          (risk.inherentLikelihood! -
                            risk.residualLikelihood!) *
                          100
                        ).toFixed(0)}%`
                      : "No reduction"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary">
                    Residual Impact
                  </h3>
                  <p className="mt-1 text-lg">
                    {(risk.residualImpact! * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    {risk.residualImpact !== risk.inherentImpact
                      ? `Reduced by ${(
                          (risk.inherentImpact! - risk.residualImpact!) *
                          100
                        ).toFixed(0)}%`
                      : "No reduction"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-secondary">
                    Residual Severity
                  </h3>
                  <p className="mt-1">
                    <Badge className={residualSeverity.class}>
                      {residualSeverity.level}
                    </Badge>
                  </p>
                  <p className="text-xs text-secondary mt-1">
                    {mitigations.length} mitigation
                    {mitigations.length !== 1 ? "s" : ""} applied
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="mitigations" className="w-full">
          <TabsList>
            <TabsTrigger value="mitigations">Mitigations</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
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
                            disabled={
                              unlinkingMitigations[mitigation.id] || false
                            }
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

        {/* Dialog for linking mitigations */}
        <Dialog
          open={isMitigationDialogOpen}
          onOpenChange={setIsMitigationDialogOpen}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle>Manage Risk Mitigations</DialogTitle>
                  <DialogDescription>
                    Link or unlink mitigations to manage this risk.
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
                      const isLinking =
                        linkingMitigations[mitigation.id] || false;
                      const isUnlinking =
                        unlinkingMitigations[mitigation.id] || false;

                      return (
                        <div
                          key={mitigation.id}
                          className="relative p-4 hover:bg-blue-50 transition-colors duration-150"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{mitigation.name}</h3>
                              {mitigation.category && (
                                <Badge
                                  variant="outline"
                                  className="text-xs font-normal"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {mitigation.category}
                                </Badge>
                              )}
                            </div>
                            {isLinked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isUnlinking}
                                onClick={() =>
                                  handleUnlinkMitigation(mitigation)
                                }
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                {isUnlinking ? "Unlinking..." : "Unlink"}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                disabled={isLinking}
                                onClick={() => handleLinkMitigation(mitigation)}
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
                onClick={() => setIsMitigationDialogOpen(false)}
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
