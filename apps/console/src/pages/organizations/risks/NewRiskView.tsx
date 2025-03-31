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
            Enter the details of the risk you want to add to your organization.
          </CardDescription>
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
