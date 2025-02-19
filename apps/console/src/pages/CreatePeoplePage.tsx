import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  useRelayEnvironment,
  ConnectionHandler,
} from "react-relay";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreatePeoplePageQuery as CreatePeoplePageQueryType } from "./__generated__/CreatePeoplePageQuery.graphql";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreatePeoplePageCreatePeopleMutation } from "./__generated__/CreatePeoplePageCreatePeopleMutation.graphql";

const createPeoplePageQuery = graphql`
  query CreatePeoplePageQuery {
    currentOrganization: node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        name
      }
    }
  }
`;

const createPeopleMutation = graphql`
  mutation CreatePeoplePageCreatePeopleMutation($input: CreatePeopleInput!, $connections: [ID!]!) {
    createPeople(input: $input) {
      peopleEdge @prependEdge(connections: $connections) {
        node {
          id
          fullName
          primaryEmailAddress
          additionalEmailAddresses
          kind
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

function CreatePeoplePageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<CreatePeoplePageQueryType>;
}) {
  const navigate = useNavigate();
  const environment = useRelayEnvironment();
  const data = usePreloadedQuery(createPeoplePageQuery, queryRef);
  const [createPeople] = useMutation<CreatePeoplePageCreatePeopleMutation>(createPeopleMutation);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    primaryEmailAddress: '',
    additionalEmailAddresses: [] as string[],
    kind: 'EMPLOYEE' as 'EMPLOYEE' | 'CONTRACTOR',
  });

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const peopleConnectionId = ConnectionHandler.getConnectionID(data.currentOrganization.id, "PeopleListPageQuery_peoples");

    createPeople({
      variables: {
        connections: [peopleConnectionId],
        input: {
          organizationId: data.currentOrganization.id,
          fullName: formData.fullName,
          primaryEmailAddress: formData.primaryEmailAddress,
          additionalEmailAddresses: formData.additionalEmailAddresses,
          kind: formData.kind,
        },
      },
      onCompleted: (response) => {
        toast({
          title: "Success",
          description: "Person created successfully",
          variant: "default",
        });
        navigate(`/peoples/${response.createPeople.peopleEdge.node.id}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create person",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Create Person - Probo Console</title>
      </Helmet>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <EditableField
              label="Full Name"
              value={formData.fullName}
              onChange={(value) => handleFieldChange('fullName', value)}
              required
            />

            <EditableField
              label="Primary Email"
              value={formData.primaryEmailAddress}
              type="email"
              onChange={(value) => handleFieldChange('primaryEmailAddress', value)}
              required
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <Label className="text-sm">Additional Email Addresses</Label>
              </div>
              <div className="space-y-2">
                {formData.additionalEmailAddresses.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...formData.additionalEmailAddresses];
                        newEmails[index] = e.target.value;
                        handleFieldChange('additionalEmailAddresses', newEmails);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newEmails = formData.additionalEmailAddresses.filter((_, i) => i !== index);
                        handleFieldChange('additionalEmailAddresses', newEmails);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleFieldChange('additionalEmailAddresses', [...formData.additionalEmailAddresses, '']);
                  }}
                >
                  Add Email
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium">Additional Information</h2>
                  <p className="text-sm text-gray-500">
                    Additional details about the person
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                      <Label className="text-sm">Kind</Label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleFieldChange('kind', 'EMPLOYEE')}
                        className={cn(
                          "rounded-full px-4 py-1 text-sm transition-colors",
                          formData.kind === 'EMPLOYEE'
                            ? "bg-blue-100 text-blue-900 ring-2 ring-blue-600 ring-offset-2"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        )}
                      >
                        Employee
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange('kind', 'CONTRACTOR')}
                        className={cn(
                          "rounded-full px-4 py-1 text-sm transition-colors",
                          formData.kind === 'CONTRACTOR'
                            ? "bg-purple-100 text-purple-900 ring-2 ring-purple-600 ring-offset-2"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        )}
                      >
                        Contractor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Person
          </Button>
        </div>
      </form>
    </>
  );
}

export default function CreatePeoplePage() {
  const [queryRef, loadQuery] = useQueryLoader<CreatePeoplePageQueryType>(
    createPeoplePageQuery,
  );

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  if (!queryRef) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <CreatePeoplePageContent queryRef={queryRef} />
    </Suspense>
  );
}
