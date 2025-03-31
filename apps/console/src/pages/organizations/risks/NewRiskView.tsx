import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ConnectionHandler, graphql, useMutation } from "react-relay";
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

// Risk template library - static definitions of common risks
const riskTemplates = [
  {
    id: "data-breach",
    name: "Data Breach",
    description:
      "Unauthorized access to sensitive data resulting in data disclosure, theft, or corruption.",
    probability: "HIGH",
    impact: "HIGH",
  },
  {
    id: "service-outage",
    name: "Service Outage",
    description:
      "System downtime or degradation affecting availability of services to customers.",
    probability: "MEDIUM",
    impact: "HIGH",
  },
  {
    id: "compliance-violation",
    name: "Compliance Violation",
    description:
      "Failure to meet regulatory requirements resulting in penalties or legal action.",
    probability: "MEDIUM",
    impact: "VERY_HIGH",
  },
  {
    id: "insider-threat",
    name: "Insider Threat",
    description:
      "Malicious actions by employees or contractors with privileged access to systems or data.",
    probability: "LOW",
    impact: "HIGH",
  },
  {
    id: "third-party-risk",
    name: "Third-Party Risk",
    description:
      "Vulnerabilities introduced through vendors, suppliers, or partners with access to systems or data.",
    probability: "MEDIUM",
    impact: "MEDIUM",
  },
  {
    id: "ransomware",
    name: "Ransomware Attack",
    description:
      "Malware that encrypts data and demands payment for decryption keys.",
    probability: "MEDIUM",
    impact: "VERY_HIGH",
  },
  {
    id: "ddos",
    name: "DDoS Attack",
    description:
      "Distributed denial of service attack overwhelming systems and preventing legitimate access.",
    probability: "MEDIUM",
    impact: "HIGH",
  },
  {
    id: "credential-compromise",
    name: "Credential Compromise",
    description:
      "Unauthorized access to accounts due to weak, stolen, or improperly secured credentials.",
    probability: "HIGH",
    impact: "HIGH",
  },
];

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
          probability
          impact
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export default function NewRiskView() {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [probability, setProbability] = useState<string>("MEDIUM");
  const [impact, setImpact] = useState<string>("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const { toast } = useToast();

  const [commitMutation, isInFlight] = useMutation(createRiskMutation);

  // Map string values to float values
  const probabilityToFloat = (value: string): number => {
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

  // Handle template selection and prefill form
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);

    if (templateId === "none") {
      // Clear form if "Select a template" is chosen
      setName("");
      setDescription("");
      setProbability("MEDIUM");
      setImpact("MEDIUM");
      return;
    }

    const template = riskTemplates.find((t) => t.id === templateId);
    if (template) {
      setName(template.name);
      setDescription(template.description);
      setProbability(template.probability);
      setImpact(template.impact);
    }
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
      probability: probabilityToFloat(probability),
      impact: impactToFloat(impact),
    };

    commitMutation({
      variables: {
        input,
        connections: [
          ConnectionHandler.getConnectionID(
            organizationId!,
            "RiskListView_risks"
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
                <SelectContent>
                  <SelectItem value="none">Select a template</SelectItem>
                  {riskTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="probability">Probability</Label>
                <Select value={probability} onValueChange={setProbability}>
                  <SelectTrigger id="probability">
                    <SelectValue placeholder="Select probability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VERY_LOW">Very Low</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="VERY_HIGH">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="impact">Impact</Label>
                <Select value={impact} onValueChange={setImpact}>
                  <SelectTrigger id="impact">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VERY_LOW">Very Low</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="VERY_HIGH">Very High</SelectItem>
                  </SelectContent>
                </Select>
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
