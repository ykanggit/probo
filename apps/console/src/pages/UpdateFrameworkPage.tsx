import { Suspense, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  PreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpdateFrameworkPageUpdateFrameworkMutation } from "./__generated__/UpdateFrameworkPageUpdateFrameworkMutation.graphql";
import { UpdateFrameworkPageQuery as UpdateFrameworkPageQueryType } from "./__generated__/UpdateFrameworkPageQuery.graphql";

const updateFrameworkMutation = graphql`
  mutation UpdateFrameworkPageUpdateFrameworkMutation(
    $input: UpdateFrameworkInput!
  ) {
    updateFramework(input: $input) {
      framework {
        id
        name
        description
        version
      }
    }
  }
`;

const updateFrameworkQuery = graphql`
  query UpdateFrameworkPageQuery($frameworkId: ID!) {
    node(id: $frameworkId) {
      ... on Framework {
        id
        name
        description
        version
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

function UpdateFrameworkPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<UpdateFrameworkPageQueryType>;
}) {
  const { organizationId, frameworkId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const data = usePreloadedQuery(updateFrameworkQuery, queryRef);
  const [, setEditedFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (data.node) {
      setFormData({
        name: data.node.name || "",
        description: data.node.description || "",
      });
    }
  }, [data.node]);

  const [commit, isInFlight] =
    useMutation<UpdateFrameworkPageUpdateFrameworkMutation>(
      updateFrameworkMutation
    );

  const handleFieldChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setEditedFields((prev) => new Set(prev).add(field));
  };

  const handleCancel = () => {
    navigate(`/organizations/${organizationId}/frameworks/${frameworkId}`);
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
          id: frameworkId!,
          expectedVersion: data.node.version,
          name: formData.name,
          description: formData.description,
        },
      },
      onCompleted(data, errors) {
        if (errors) {
          toast({
            title: "Error",
            description: errors[0]?.message || "Failed to update framework",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Framework updated successfully",
        });

        navigate(`/organizations/${organizationId}/frameworks/${frameworkId}`);
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
    <>
      <Helmet>
        <title>Update Framework - Probo</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Update Framework</h1>
          <p className="text-muted-foreground">Update the framework details</p>
        </div>

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
              helpText="Provide a detailed description of the framework"
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isInFlight}>
                {isInFlight ? "Updating..." : "Update Framework"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

function UpdateFrameworkPageFallback() {
  return <div>Loading...</div>;
}

export default function UpdateFrameworkPage() {
  const { frameworkId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<UpdateFrameworkPageQueryType>(updateFrameworkQuery);

  useEffect(() => {
    if (frameworkId) {
      loadQuery({ frameworkId });
    }
  }, [frameworkId, loadQuery]);

  if (!queryRef) {
    return <UpdateFrameworkPageFallback />;
  }

  return (
    <Suspense fallback={<UpdateFrameworkPageFallback />}>
      <UpdateFrameworkPageContent queryRef={queryRef} />
    </Suspense>
  );
}
