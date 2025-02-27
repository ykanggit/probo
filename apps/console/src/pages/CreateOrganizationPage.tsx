import { useState } from "react";
import { useNavigate } from "react-router";
import {
  graphql,
  ConnectionHandler,
  useMutation,
  useLazyLoadQuery,
} from "react-relay";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle } from "lucide-react";
import { CreateOrganizationPageCreateOrganizationMutation } from "./__generated__/CreateOrganizationPageCreateOrganizationMutation.graphql";
import { CreateOrganizationPageViewerQuery } from "./__generated__/CreateOrganizationPageViewerQuery.graphql";

const createOrganizationMutation = graphql`
  mutation CreateOrganizationPageCreateOrganizationMutation(
    $input: CreateOrganizationInput!
    $connections: [ID!]!
  ) {
    createOrganization(input: $input) {
      organizationEdge @appendEdge(connections: $connections) {
        node {
          id
          name
          logoUrl
        }
      }
    }
  }
`;

const viewerQuery = graphql`
  query CreateOrganizationPageViewerQuery {
    viewer {
      id
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  helpText?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-gray-400" />
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="space-y-2">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      </div>
    </div>
  );
}

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const data = useLazyLoadQuery<CreateOrganizationPageViewerQuery>(
    viewerQuery,
    {},
  );
  const [createOrganization] =
    useMutation<CreateOrganizationPageCreateOrganizationMutation>(
      createOrganizationMutation,
    );
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createOrganization({
      variables: {
        input: {
          name: formData.name,
        },
        connections: [
          ConnectionHandler.getConnectionID(
            data.viewer.id,
            "OrganizationSwitcher_organizations",
          ),
        ],
      },
      onCompleted: (response) => {
        const newOrg = response.createOrganization.organizationEdge.node;
        toast({
          title: "Success",
          description: "Organization created successfully",
          variant: "default",
        });
        navigate(`/organizations/${newOrg.id}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create organization",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Create Organization - Probo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Organization
          </h1>
          <p className="text-muted-foreground">
            Create a new organization to manage your compliance and security
            needs.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Enter the basic information about your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EditableField
                label="Organization Name"
                value={formData.name}
                onChange={(value) => handleFieldChange("name", value)}
                helpText="The name of your organization as it will appear throughout the platform."
                required
              />

              <Button type="submit" className="w-full">
                Create Organization
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
}
