"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
  PreloadedQuery,
} from "react-relay";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageTemplate } from "@/components/PageTemplate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { EditRiskViewSkeleton } from "./EditRiskPage";
import type { EditRiskViewQuery } from "./__generated__/EditRiskViewQuery.graphql";
import type { EditRiskViewUpdateRiskMutation } from "./__generated__/EditRiskViewUpdateRiskMutation.graphql";

// Query to get risk details
const editRiskViewQuery = graphql`
  query EditRiskViewQuery($riskId: ID!) {
    risk: node(id: $riskId) {
      ... on Risk {
        id
        name
        description
        inherentLikelihood
        inherentImpact
        residualLikelihood
        residualImpact
      }
    }
  }
`;

// Mutation to update risk
const updateRiskMutation = graphql`
  mutation EditRiskViewUpdateRiskMutation($input: UpdateRiskInput!) {
    updateRisk(input: $input) {
      risk {
        id
        name
        description
        inherentLikelihood
        inherentImpact
        residualLikelihood
        residualImpact
        updatedAt
      }
    }
  }
`;

// Component to handle the actual editing once data is loaded
function EditRiskViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<EditRiskViewQuery>;
}) {
  const navigate = useNavigate();
  const { organizationId, riskId } = useParams<{
    organizationId: string;
    riskId: string;
  }>();
  const { toast } = useToast();

  const data = usePreloadedQuery(editRiskViewQuery, queryRef);
  const risk = data.risk;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inherentLikelihood, setInherentLikelihood] =
    useState<string>("MEDIUM");
  const [inherentImpact, setInherentImpact] = useState<string>("MEDIUM");
  const [residualLikelihood, setResidualLikelihood] =
    useState<string>("MEDIUM");
  const [residualImpact, setResidualImpact] = useState<string>("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateRisk, isInFlight] =
    useMutation<EditRiskViewUpdateRiskMutation>(updateRiskMutation);

  // Helper function to convert float to likelihood string
  const floatToLikelihood = (value: number): string => {
    if (value <= 0.2) return "VERY_LOW";
    if (value <= 0.4) return "LOW";
    if (value <= 0.6) return "MEDIUM";
    if (value <= 0.8) return "HIGH";
    return "VERY_HIGH";
  };

  // Helper function to convert float to impact string
  const floatToImpact = (value: number): string => {
    if (value <= 0.2) return "VERY_LOW";
    if (value <= 0.4) return "LOW";
    if (value <= 0.6) return "MEDIUM";
    if (value <= 0.8) return "HIGH";
    return "VERY_HIGH";
  };

  // Map string values to float values
  const likelihoodToFloat = (value: string): number => {
    switch (value) {
      case "VERY_LOW":
        return 0.1;
      case "LOW":
        return 0.3;
      case "MEDIUM":
        return 0.5;
      case "HIGH":
        return 0.7;
      case "VERY_HIGH":
        return 0.9;
      default:
        return 0.5;
    }
  };

  const impactToFloat = (value: string): number => {
    switch (value) {
      case "VERY_LOW":
        return 0.1;
      case "LOW":
        return 0.3;
      case "MEDIUM":
        return 0.5;
      case "HIGH":
        return 0.7;
      case "VERY_HIGH":
        return 0.9;
      default:
        return 0.5;
    }
  };

  // Initialize form with risk data
  useEffect(() => {
    if (risk) {
      setName(risk.name || "");
      setDescription(risk.description || "");
      setInherentLikelihood(floatToLikelihood(risk.inherentLikelihood || 0.5));
      setInherentImpact(floatToImpact(risk.inherentImpact || 0.5));
      setResidualLikelihood(floatToLikelihood(risk.residualLikelihood || 0.5));
      setResidualImpact(floatToImpact(risk.residualImpact || 0.5));
    }
  }, [risk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the risk.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const input = {
      id: riskId!,
      name,
      description,
      inherentLikelihood: likelihoodToFloat(inherentLikelihood),
      inherentImpact: impactToFloat(inherentImpact),
      residualLikelihood: likelihoodToFloat(residualLikelihood),
      residualImpact: impactToFloat(residualImpact),
    };

    updateRisk({
      variables: {
        input,
      },
      onCompleted: (response, errors) => {
        setIsSubmitting(false);
        if (errors) {
          console.error("Error updating risk:", errors);
          toast({
            title: "Error",
            description: "Failed to update risk. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Risk updated successfully!",
        });

        navigate(`/organizations/${organizationId}/risks/${riskId}`);
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error("Error updating risk:", error);
        toast({
          title: "Error",
          description: "Failed to update risk. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Edit Risk"
      description="Update the details of this risk"
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Risk Details</CardTitle>
          <CardDescription>Update the details of this risk</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Risk name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the risk in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">
                Initial Risk Assessment
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inherentLikelihood">
                    Inherent Likelihood
                  </Label>
                  <Select
                    value={inherentLikelihood}
                    onValueChange={setInherentLikelihood}
                  >
                    <SelectTrigger id="inherentLikelihood">
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="VERY_LOW">Very Low</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="VERY_HIGH">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inherentImpact">Inherent Impact</Label>
                  <Select
                    value={inherentImpact}
                    onValueChange={setInherentImpact}
                  >
                    <SelectTrigger id="inherentImpact">
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="VERY_LOW">Very Low</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="VERY_HIGH">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Residual Risk</h3>
              <p className="text-sm text-tertiary mb-4">
                Estimate the risk after treatment measures have been applied
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="residualLikelihood">
                    Residual Likelihood
                  </Label>
                  <Select
                    value={residualLikelihood}
                    onValueChange={setResidualLikelihood}
                  >
                    <SelectTrigger id="residualLikelihood">
                      <SelectValue placeholder="Select residual likelihood" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="VERY_LOW">Very Low</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="VERY_HIGH">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residualImpact">Residual Impact</Label>
                  <Select
                    value={residualImpact}
                    onValueChange={setResidualImpact}
                  >
                    <SelectTrigger id="residualImpact">
                      <SelectValue placeholder="Select residual impact" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="VERY_LOW">Very Low</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="VERY_HIGH">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(`/organizations/${organizationId}/risks/${riskId}`)
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isInFlight || isSubmitting}>
                {isInFlight || isSubmitting ? "Updating..." : "Update Risk"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}

// Main component that loads the query
export function EditRiskView() {
  const { riskId } = useParams<{ riskId: string }>();
  const [queryRef, loadQuery] =
    useQueryLoader<EditRiskViewQuery>(editRiskViewQuery);

  useEffect(() => {
    if (riskId) {
      loadQuery({ riskId });
    }
  }, [loadQuery, riskId]);

  if (!queryRef) {
    return <EditRiskViewSkeleton />;
  }

  return (
    <Suspense fallback={<EditRiskViewSkeleton />}>
      <EditRiskViewContent queryRef={queryRef} />
    </Suspense>
  );
}

export default EditRiskView;
