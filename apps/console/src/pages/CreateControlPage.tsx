import { Suspense, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { graphql, useMutation, ConnectionHandler } from "react-relay";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateControlPageCreateControlMutation,
  ControlImportance,
} from "./__generated__/CreateControlPageCreateControlMutation.graphql";
import { PageHeader } from "@/components/PageHeader";

const createControlMutation = graphql`
  mutation CreateControlPageCreateControlMutation(
    $input: CreateControlInput!
    $connections: [ID!]!
  ) {
    createControl(input: $input) {
      controlEdge @prependEdge(connections: $connections) {
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
`;

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  helpText,
  required,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  helpText?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={label} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        {helpText && (
          <div className="relative flex items-center">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">{helpText}</span>
          </div>
        )}
      </div>
      {multiline ? (
        <Textarea
          id={label}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          className={cn(
            "w-full resize-none",
            required && !value && "border-red-500"
          )}
          placeholder={`Enter ${label.toLowerCase()}`}
          rows={4}
        />
      ) : (
        <Input
          id={label}
          type={type}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className={cn("w-full", required && !value && "border-red-500")}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

function CreateControlPageContent() {
  const { organizationId, frameworkId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    importance: "MANDATORY" as ControlImportance,
  });

  const [commit, isInFlight] =
    useMutation<CreateControlPageCreateControlMutation>(createControlMutation);

  const handleFieldChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const connectionId = ConnectionHandler.getConnectionID(
      frameworkId!,
      "FrameworkOverviewPage_controls"
    );

    commit({
      variables: {
        input: {
          frameworkId: frameworkId!,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          importance: formData.importance,
        },
        connections: [connectionId],
      },
      onCompleted(data, errors) {
        if (errors) {
          toast({
            title: "Error",
            description: errors[0]?.message || "Failed to create control",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Control created successfully",
        });

        navigate(
          `/organizations/${organizationId}/frameworks/${frameworkId}/controls/${data.createControl.controlEdge.node.id}`
        );
      },
      onError(error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create control",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Create Control - Probo</title>
      </Helmet>
      <div className="container">
        <PageHeader
          className="mb-17"
          title="Create Control"
          description="Create a new control for your framework"
        />

        <Card className="max-w-2xl">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <EditableField
              label="Name"
              value={formData.name}
              onChange={(value) => handleFieldChange("name", value)}
              required
            />

            <EditableField
              label="Category"
              value={formData.category}
              onChange={(value) => handleFieldChange("category", value)}
              required
              helpText="The category this control belongs to"
            />

            <EditableField
              label="Description"
              value={formData.description}
              onChange={(value) => handleFieldChange("description", value)}
              required
              multiline
              helpText="Provide a detailed description of the control"
            />

            <div className="space-y-2">
              <Label htmlFor="importance" className="text-sm font-medium">
                Importance
              </Label>
              <Select
                value={formData.importance}
                onValueChange={(value) =>
                  handleFieldChange("importance", value as ControlImportance)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANDATORY">Mandatory</SelectItem>
                  <SelectItem value="PREFERRED">Preferred</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    `/organizations/${organizationId}/frameworks/${frameworkId}`
                  )
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isInFlight}>
                {isInFlight ? "Creating..." : "Create Control"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default function CreateControlPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateControlPageContent />
    </Suspense>
  );
}
