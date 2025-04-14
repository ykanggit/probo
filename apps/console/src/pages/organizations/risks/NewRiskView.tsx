import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ConnectionHandler,
  graphql,
  useMutation,
  useQueryLoader,
  usePreloadedQuery,
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
import PeopleSelector from "@/components/PeopleSelector";
import { User } from "lucide-react";
import { Suspense } from "react";
import type { NewRiskViewQuery } from "./__generated__/NewRiskViewQuery.graphql";

interface RiskTemplate {
  name: string;
  description: string;
  variations: {
    context: string;
    impact: number;
    likelihood: number;
    recommendedTreatment: string;
  }[];
}

const newRiskQuery = graphql`
  query NewRiskViewQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ...PeopleSelector_organization
    }
  }
`;

const createRiskMutation = graphql`
  mutation NewRiskViewCreateRiskMutation(
    $input: CreateRiskInput!
    $connections: [ID!]!
  ) {
    createRisk(input: $input) {
      riskEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          description
          inherentLikelihood
          inherentImpact
          residualLikelihood
          residualImpact
          treatment
          createdAt
          updatedAt
        }
      }
    }
  }
`;

function NewRiskForm({
  queryRef,
}: {
  queryRef: PreloadedQuery<NewRiskViewQuery>;
}) {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const data = usePreloadedQuery<NewRiskViewQuery>(newRiskQuery, queryRef);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inherentLikelihood, setinherentLikelihood] =
    useState<string>("OCCASIONAL");
  const [inherentImpact, setinherentImpact] = useState<string>("MODERATE");
  const [residualLikelihood, setResidualLikelihood] =
    useState<string>("OCCASIONAL");
  const [residualImpact, setResidualImpact] = useState<string>("MODERATE");
  const [treatment, setTreatment] = useState<string>("MITIGATED");
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [riskTemplates, setRiskTemplates] = useState<RiskTemplate[]>([]);
  const { toast } = useToast();

  const [createRisk, isInFlight] = useMutation(createRiskMutation);

  useEffect(() => {
    const loadRiskTemplates = async () => {
      try {
        const response = await fetch("/data/risks/risks.json");
        const data = await response.json();
        setRiskTemplates(data);
      } catch (error) {
        console.error("Error loading risk templates:", error);
        toast({
          title: "Error",
          description: "Failed to load risk templates. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadRiskTemplates();
  }, [toast]);

  // Map string values to float values
  const likelihoodToFloat = (value: string): number => {
    switch (value) {
      case "IMPROBABLE":
        return 0.1;
      case "REMOTE":
        return 0.3;
      case "OCCASIONAL":
        return 0.5;
      case "PROBABLE":
        return 0.7;
      case "FREQUENT":
        return 0.9;
      default:
        return 0.5;
    }
  };

  const impactToFloat = (value: string): number => {
    switch (value) {
      case "NEGLIGIBLE":
        return 0.1;
      case "LOW":
        return 0.3;
      case "MODERATE":
        return 0.5;
      case "SIGNIFICANT":
        return 0.7;
      case "CATASTROPHIC":
        return 0.9;
      default:
        return 0.5;
    }
  };

  // Handle template selection and prefill form
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);

    if (templateId === "none") {
      // Clear form if "Select a template" is chosen
      setName("");
      setDescription("");
      setinherentLikelihood("OCCASIONAL");
      setinherentImpact("MODERATE");
      setResidualLikelihood("OCCASIONAL");
      setResidualImpact("MODERATE");
      setTreatment("MITIGATED");
      return;
    }

    const template = riskTemplates[parseInt(templateId)];
    if (template) {
      setName(template.name);
      setDescription(template.description);
      // Convert numeric values to string values for the select components
      const likelihoodValue = floatTolikelihood(
        template.variations[0].likelihood
      );
      const impactValue = floatToImpact(template.variations[0].impact);
      setinherentLikelihood(likelihoodValue);
      setinherentImpact(impactValue);
      // Set residual values to be the same as initial values by default
      setResidualLikelihood(likelihoodValue);
      setResidualImpact(impactValue);

      // Set recommended treatment if available
      if (template.variations[0].recommendedTreatment) {
        setTreatment(template.variations[0].recommendedTreatment.toUpperCase());
      }
    }
  };

  // Helper function to convert float likelihood to string
  const floatTolikelihood = (value: number): string => {
    if (value <= 0.2) return "IMPROBABLE";
    if (value <= 0.4) return "REMOTE";
    if (value <= 0.6) return "OCCASIONAL";
    if (value <= 0.8) return "PROBABLE";
    return "FREQUENT";
  };

  // Helper function to convert float impact to string
  const floatToImpact = (value: number): string => {
    if (value <= 0.2) return "NEGLIGIBLE";
    if (value <= 0.4) return "LOW";
    if (value <= 0.6) return "MODERATE";
    if (value <= 0.8) return "SIGNIFICANT";
    return "CATASTROPHIC";
  };

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
      organizationId: organizationId!,
      name,
      description,
      inherentLikelihood: likelihoodToFloat(inherentLikelihood),
      inherentImpact: impactToFloat(inherentImpact),
      residualLikelihood: likelihoodToFloat(residualLikelihood),
      residualImpact: impactToFloat(residualImpact),
      treatment,
      ownerId: ownerId || undefined,
    };

    createRisk({
      variables: {
        input,
        connections: [
          ConnectionHandler.getConnectionID(
            organizationId!,
            "ListRiskView_risks"
          ),
        ],
      },
      onCompleted: (response, errors) => {
        setIsSubmitting(false);
        if (errors) {
          console.error("Error creating risk:", errors);
          toast({
            title: "Error",
            description: "Failed to create risk. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Risk created successfully!",
        });

        navigate(`/organizations/${organizationId}/risks`);
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error("Error creating risk:", error);
        toast({
          title: "Error",
          description: "Failed to create risk. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Create Risk"
      description="Add a new risk to your organization"
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Risk Details</CardTitle>
          <CardDescription>
            Enter the details of the risk you want to add to your organization
            or select from a template.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="template">Risk Template</Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a risk template" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectItem value="none">Select a template</SelectItem>
                  {riskTemplates.map((template, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-tertiary">
                Select a template to prefill the form or create a custom risk.
              </p>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="owner" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Risk Owner
              </Label>
              <PeopleSelector
                organizationRef={data.organization}
                selectedPersonId={ownerId}
                onSelect={setOwnerId}
                placeholder="Select risk owner (optional)"
                required={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inherentLikelihood">Initial Likelihood</Label>
                <Select
                  value={inherentLikelihood}
                  onValueChange={setinherentLikelihood}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select likelihood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMPROBABLE">Improbable</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="OCCASIONAL">Occasional</SelectItem>
                    <SelectItem value="PROBABLE">Probable</SelectItem>
                    <SelectItem value="FREQUENT">Frequent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inherentImpact">Initial Impact</Label>
                <Select
                  value={inherentImpact}
                  onValueChange={setinherentImpact}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEGLIGIBLE">Negligible</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="SIGNIFICANT">Significant</SelectItem>
                    <SelectItem value="CATASTROPHIC">Catastrophic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Strategy</Label>
              <Select value={treatment} onValueChange={setTreatment}>
                <SelectTrigger id="treatment">
                  <SelectValue placeholder="Select a treatment strategy" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectItem value="AVOIDED">Avoid</SelectItem>
                  <SelectItem value="MITIGATED">Mitigate</SelectItem>
                  <SelectItem value="TRANSFERRED">Transfer</SelectItem>
                  <SelectItem value="ACCEPTED">Accept</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-tertiary">
                Choose how you plan to address this risk
              </p>
            </div>

            <Separator className="my-4" />

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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMPROBABLE">Improbable</SelectItem>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                      <SelectItem value="OCCASIONAL">Occasional</SelectItem>
                      <SelectItem value="PROBABLE">Probable</SelectItem>
                      <SelectItem value="FREQUENT">Frequent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residualImpact">Residual Impact</Label>
                  <Select
                    value={residualImpact}
                    onValueChange={setResidualImpact}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEGLIGIBLE">Negligible</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MODERATE">Moderate</SelectItem>
                      <SelectItem value="SIGNIFICANT">Significant</SelectItem>
                      <SelectItem value="CATASTROPHIC">Catastrophic</SelectItem>
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
                  navigate(`/organizations/${organizationId}/risks`)
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isInFlight || isSubmitting}>
                {isInFlight || isSubmitting ? "Creating..." : "Create Risk"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}

export default function NewRiskView() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [queryRef, loadQuery] = useQueryLoader<NewRiskViewQuery>(newRiskQuery);

  useEffect(() => {
    if (organizationId) {
      loadQuery({ organizationId });
    }
  }, [organizationId, loadQuery]);

  if (!queryRef) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewRiskForm queryRef={queryRef} />
    </Suspense>
  );
}
