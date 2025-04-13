import { useState } from "react";
import { ConnectionHandler, graphql, useMutation } from "react-relay";
import { useParams, useNavigate } from "react-router";
import { PageTemplate } from "@/components/PageTemplate";
import { useToast } from "@/hooks/use-toast";
import { NewMesureViewCreateMesureMutation } from "./__generated__/NewMesureViewCreateMesureMutation.graphql";
import { EditableField } from "@/components/EditableField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const createMesureMutation = graphql`
  mutation NewMesureViewCreateMesureMutation(
    $input: CreateMesureInput!
    $connections: [ID!]!
  ) {
    createMesure(input: $input) {
      mesureEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          description
        }
      }
    }
  }
`;

export default function NewMesureView() {
  const { organizationId } = useParams<{
    organizationId: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    importance: "MADATORY" as "MANDATORY" | "PREFERRED" | "ADVANCED",
  });

  const [commit, isInFlight] =
    useMutation<NewMesureViewCreateMesureMutation>(createMesureMutation);

  const handleFieldChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const connectionId = ConnectionHandler.getConnectionID(
      organizationId!,
      "MesureListView_mesures"
    );

    commit({
      variables: {
        input: {
          organizationId: organizationId!,
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
            description: errors[0]?.message || "Failed to create mesure",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Mesure created successfully",
        });

        navigate(
          `/organizations/${organizationId}/mesures/${data.createMesure.mesureEdge.node.id}`
        );
      },
      onError(error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create mesure",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="New Mesure"
      description="Add a new mesure. You will be able to link it to control and risks"
    >
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <EditableField
            label="Name"
            value={formData.name}
            onChange={(value) => handleFieldChange("name", value)}
            required
          />

          <EditableField
            label="Description"
            value={formData.description}
            onChange={(value) => handleFieldChange("description", value)}
            required
            multiline
            helpText="Provide a detailed description of the mesure"
          />

          <EditableField
            label="Category"
            value={formData.category}
            onChange={(value) => handleFieldChange("category", value)}
            required
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Importance</Label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFieldChange("importance", "MANDATORY")}
                  className={cn(
                    "rounded-full cursor-pointer px-4 py-1 text-sm transition-colors",
                    formData.importance === "MANDATORY"
                      ? "bg-red-100 text-red-900 ring-2 ring-red-600 ring-offset-2"
                      : "bg-secondary-bg text-primary hover:bg-h-secondary-bg"
                  )}
                >
                  Mandatory
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange("importance", "PREFERRED")}
                  className={cn(
                    "rounded-full cursor-pointer px-4 py-1 text-sm transition-colors",
                    formData.importance === "PREFERRED"
                      ? "bg-yellow-100 text-yellow-900 ring-2 ring-yellow-600 ring-offset-2"
                      : "bg-secondary-bg text-primary hover:bg-h-secondary-bg"
                  )}
                >
                  Preferred
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange("importance", "ADVANCED")}
                  className={cn(
                    "rounded-full cursor-pointer px-4 py-1 text-sm transition-colors",
                    formData.importance === "ADVANCED"
                      ? "bg-blue-100 text-blue-900 ring-2 ring-blue-600 ring-offset-2"
                      : "bg-secondary-bg text-primary hover:bg-h-secondary-bg"
                  )}
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/organizations/${organizationId}/mesures`)
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isInFlight}>
              {isInFlight ? "Creating..." : "Create Mesure"}
            </Button>
          </div>
        </form>
      </Card>
    </PageTemplate>
  );
}
