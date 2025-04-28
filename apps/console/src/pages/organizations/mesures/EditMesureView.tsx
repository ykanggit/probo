import { Suspense, useEffect, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { useParams, useNavigate } from "react-router";
import { PageTemplate } from "@/components/PageTemplate";
import { useToast } from "@/hooks/use-toast";
import { EditMesureViewUpdateMesureMutation } from "./__generated__/EditMesureViewUpdateMesureMutation.graphql";
import { EditableField } from "@/components/EditableField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EditMesureViewSkeleton } from "./EditMesurePage";
import { EditMesureViewQuery } from "./__generated__/EditMesureViewQuery.graphql";

const editMesureQuery = graphql`
  query EditMesureViewQuery($mesureId: ID!) {
    node(id: $mesureId) {
      ... on Mesure {
        id
        name
        description
        category
      }
    }
  }
`;

const updateMesureMutation = graphql`
  mutation EditMesureViewUpdateMesureMutation($input: UpdateMesureInput!) {
    updateMesure(input: $input) {
      mesure {
        id
        name
        description
      }
    }
  }
`;

function EditMesureViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<EditMesureViewQuery>;
}) {
  const { organizationId } = useParams<{
    organizationId: string;
  }>();
  const { mesureId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { node: mesure } = usePreloadedQuery(editMesureQuery, queryRef);
  const [formData, setFormData] = useState({
    name: mesure.name ?? "",
    description: mesure.description ?? "",
    category: mesure.category ?? ""
  });

  const [commit, isInFlight] =
    useMutation<EditMesureViewUpdateMesureMutation>(updateMesureMutation);

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

    commit({
      variables: {
        input: {
          id: mesureId!,
          name: formData.name,
          description: formData.description,
          category: formData.category
        },
      },
      onCompleted(data, errors) {
        if (errors) {
          toast({
            title: "Error",
            description: errors[0]?.message || "Failed to update mesure",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Mesure updated successfully",
        });

        navigate(`/organizations/${organizationId}/mesures/${mesureId}`);
      },
      onError(error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update framework",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Edit Mesure"
      description="Edit a mesure. You will be able to link it to control and risks"
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

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/organizations/${organizationId}/mesures/${mesureId}`)
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isInFlight}>
              {isInFlight ? "Updating..." : "Update Mesure"}
            </Button>
          </div>
        </form>
      </Card>
    </PageTemplate>
  );
}

export default function EditMesureView() {
  const { mesureId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<EditMesureViewQuery>(editMesureQuery);

  useEffect(() => {
    if (mesureId) {
      loadQuery({ mesureId });
    }
  }, [mesureId, loadQuery]);

  if (!queryRef) {
    return <EditMesureViewSkeleton />;
  }

  return (
    <Suspense fallback={<EditMesureViewSkeleton />}>
      <EditMesureViewContent queryRef={queryRef} />
    </Suspense>
  );
}
