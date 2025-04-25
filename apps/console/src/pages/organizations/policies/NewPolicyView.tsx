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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, User } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PolicyEditor from "@/components/PolicyEditor";
import PeopleSelector from "@/components/PeopleSelector";
import { Suspense } from "react";
import type { NewPolicyViewMutation } from "./__generated__/NewPolicyViewMutation.graphql";
import type { NewPolicyViewQuery } from "./__generated__/NewPolicyViewQuery.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { NewPolicyViewSkeleton } from "./NewPolicyPage";

const newPolicyQuery = graphql`
  query NewPolicyViewQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ...PeopleSelector_organization
    }
  }
`;

const CreatePolicyMutation = graphql`
  mutation NewPolicyViewMutation(
    $input: CreatePolicyInput!
    $connections: [ID!]!
  ) {
    createPolicy(input: $input) {
      policyEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          content
          status
          reviewDate
          owner {
            id
            fullName
          }
        }
      }
    }
  }
`;

function CreatePolicyForm({
  queryRef,
}: {
  queryRef: PreloadedQuery<NewPolicyViewQuery>;
}) {
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const data = usePreloadedQuery<NewPolicyViewQuery>(newPolicyQuery, queryRef);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");
  const [reviewDate, setReviewDate] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  console.log(
    "NewPolicyView state - content:",
    content
      ? content.substring(0, 50) + (content.length > 50 ? "..." : "")
      : "empty"
  );

  const [createPolicy] =
    useMutation<NewPolicyViewMutation>(CreatePolicyMutation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerId) {
      toast({
        title: "Error",
        description: "Please select an owner for the policy.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Convert reviewDate string to ISO format for the API
    let reviewDateValue = null;
    if (reviewDate) {
      reviewDateValue = new Date(reviewDate).toISOString();
    }

    const input = {
      organizationId: organizationId!,
      name,
      content,
      status,
      reviewDate: reviewDateValue,
      ownerId,
    };

    createPolicy({
      variables: {
        input,
        connections: [
          ConnectionHandler.getConnectionID(
            organizationId!,
            "PolicyListView_policies"
          ),
        ],
      },
      onCompleted: (response, errors) => {
        setIsSubmitting(false);
        if (errors) {
          console.error("Error creating policy:", errors);
          toast({
            title: "Error",
            description: "Failed to create policy. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Policy created successfully!",
        });

        navigate(
          `/organizations/${organizationId}/policies/${response.createPolicy.policyEdge.node.id}`
        );
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error("Error creating policy:", error);
        toast({
          title: "Error",
          description: "Failed to create policy. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Create Policy"
      description="Create a new policy for your organization"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Policy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Policy Name</Label>
                <Input
                  id="name"
                  placeholder="Enter policy name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Policy Content</Label>
                <div className="min-h-[300px]">
                  <PolicyEditor
                    initialContent={content}
                    onChange={(html) => setContent(html)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <RadioGroup
                  value={status}
                  onValueChange={(value: "DRAFT" | "ACTIVE") =>
                    setStatus(value)
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DRAFT" id="draft" />
                    <Label htmlFor="draft" className="cursor-pointer">
                      Draft
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ACTIVE" id="active" />
                    <Label htmlFor="active" className="cursor-pointer">
                      Active
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Policy Owner
                </Label>
                <PeopleSelector
                  organizationRef={data.organization}
                  selectedPersonId={ownerId}
                  onSelect={setOwnerId}
                  placeholder="Select policy owner"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Review Date
                </Label>
                <Input
                  id="reviewDate"
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/organizations/${organizationId}/policies`)
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Policy"}
            </Button>
          </div>
        </div>
      </form>
    </PageTemplate>
  );
}

export default function NewPolicyView() {
  const { organizationId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<NewPolicyViewQuery>(newPolicyQuery);

  useEffect(() => {
    if (organizationId) {
      loadQuery({ organizationId });
    }
  }, [organizationId, loadQuery]);

  if (!queryRef) {
    return <NewPolicyViewSkeleton />;
  }

  return (
    <Suspense fallback={<NewPolicyViewSkeleton />}>
      {<CreatePolicyForm queryRef={queryRef} />}
    </Suspense>
  );
}
