import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
  useRelayEnvironment,
} from "react-relay";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreatePeoplePageQuery as CreatePeoplePageQueryType } from "./__generated__/CreatePeoplePageQuery.graphql";

const createPeoplePageQuery = graphql`
  query CreatePeoplePageQuery {
    node(id: "AZSfP_xAcAC5IAAAAAAltA") {
      id
      ... on Organization {
        name
      }
    }
  }
`;

const createPeopleMutation = graphql`
  mutation CreatePeoplePageCreatePeopleMutation($input: CreatePeopleInput!) {
    createPeople(input: $input) {
      id
      fullName
      primaryEmailAddress
      kind
    }
  }
`;

function CreatePeoplePageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<CreatePeoplePageQueryType>;
}) {
  const navigate = useNavigate();
  const environment = useRelayEnvironment();
  const data = usePreloadedQuery(createPeoplePageQuery, queryRef);
  const [createPeople, isCreatingPeople] = useMutation(createPeopleMutation);
  const [kind, setKind] = useState<'EMPLOYEE' | 'CONTRACTOR' | 'VENDOR'>('EMPLOYEE');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createPeople({
      variables: {
        input: {
          organizationId: data.node.id,
          fullName: formData.get('fullName') as string,
          primaryEmailAddress: formData.get('primaryEmailAddress') as string,
          kind,
        },
      },
      onCompleted() {
        // Invalidate the peoples list query
        environment.commitUpdate((store) => {
          const organization = store.get(data.node.id);
          if (organization) {
            organization.invalidateRecord();
          }
        });
        
        navigate('/peoples');
      },
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Helmet>
        <title>Create People - Probo Console</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create People</h1>
          <p className="text-sm text-muted-foreground">
            Add a new person to your organization.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>People Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kind">Kind</Label>
                <Select
                  value={kind}
                  onValueChange={(value) => setKind(value as typeof kind)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="CONTRACTOR">Contractor</SelectItem>
                    <SelectItem value="VENDOR">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryEmailAddress">Email Address</Label>
                <Input
                  id="primaryEmailAddress"
                  name="primaryEmailAddress"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/peoples')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingPeople}>
                  {isCreatingPeople ? "Creating..." : "Create People"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CreatePeoplePage() {
  const [queryRef, loadQuery] = useQueryLoader<CreatePeoplePageQueryType>(createPeoplePageQuery);

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