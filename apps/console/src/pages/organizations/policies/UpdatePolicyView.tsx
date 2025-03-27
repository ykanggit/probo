import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
  PreloadedQuery,
} from "react-relay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Calendar, User } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Suspense } from "react";
import PolicyEditor from "@/components/PolicyEditor";
import PeopleSelector from "@/components/PeopleSelector";
import type { UpdatePolicyViewQuery as UpdatePolicyViewQueryType } from "./__generated__/UpdatePolicyViewQuery.graphql";
import type { UpdatePolicyViewMutation as UpdatePolicyViewMutationType } from "./__generated__/UpdatePolicyViewMutation.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { UpdatePolicyViewSkeleton } from "./UpdatePolicyPage";

const UpdatePolicyViewQuery = graphql`
  query UpdatePolicyViewQuery($policyId: ID!, $organizationId: ID!) {
    policy: node(id: $policyId) {
      id
      ... on Policy {
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
    organization: node(id: $organizationId) {
      ...PeopleSelector_organization
    }
  }
`;

const UpdatePolicyMutation = graphql`
  mutation UpdatePolicyViewMutation($input: UpdatePolicyInput!) {
    updatePolicy(input: $input) {
      policy {
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
`;

function UpdatePolicyViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<UpdatePolicyViewQueryType>;
}) {
  const navigate = useNavigate();
  const { organizationId, policyId } = useParams();
  const data = usePreloadedQuery<UpdatePolicyViewQueryType>(
    UpdatePolicyViewQuery,
    queryRef
  );

  console.log("UpdatePolicyView data:", data.policy);

  const [name, setName] = useState(data.policy.name);
  const [content, setContent] = useState(data.policy.content || "");
  const [status, setStatus] = useState(data.policy.status);
  const [reviewDate, setReviewDate] = useState(data.policy.reviewDate || "");
  const [ownerId, setOwnerId] = useState<string | null>(
    data.policy.owner?.id || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(
    "UpdatePolicyView state - content:",
    content
      ? content.substring(0, 50) + (content.length > 50 ? "..." : "")
      : "empty"
  );

  const [commitMutation] =
    useMutation<UpdatePolicyViewMutationType>(UpdatePolicyMutation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert reviewDate string to ISO format for the API
    let reviewDateValue = null;
    if (reviewDate) {
      reviewDateValue = new Date(reviewDate).toISOString();
    }

    commitMutation({
      variables: {
        input: {
          id: data.policy.id,
          name,
          content,
          status,
          reviewDate: reviewDateValue,
          ownerId,
        },
      },
      onCompleted: (response, errors) => {
        setIsSubmitting(false);
        if (errors) {
          console.error("Error updating policy:", errors);
          toast({
            title: "Error",
            description: "Failed to update policy. Please try again.",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Policy updated successfully.",
        });

        navigate(`/organizations/${organizationId}/policies/${policyId}`);
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error("Error updating policy:", error);
        toast({
          title: "Error",
          description: "Failed to update policy. Please try again.",
        });
      },
    });
  };

  return (
    <PageTemplate title="Update Policy" description="Update an existing policy">
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
                  onValueChange={(value) =>
                    setStatus(value as "DRAFT" | "ACTIVE")
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
                navigate(
                  `/organizations/${organizationId}/policies/${policyId}`
                )
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Policy"}
            </Button>
          </div>
        </div>
      </form>
    </PageTemplate>
  );
}

export default function UpdatePolicyView() {
  const { organizationId, policyId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<UpdatePolicyViewQueryType>(
    UpdatePolicyViewQuery
  );

  useEffect(() => {
    if (organizationId && policyId) {
      loadQuery({ organizationId, policyId });
    }
  }, [organizationId, policyId, loadQuery]);

  if (!queryRef) {
    return <UpdatePolicyViewSkeleton />;
  }

  return (
    <Suspense fallback={<UpdatePolicyViewSkeleton />}>
      {queryRef && <UpdatePolicyViewContent queryRef={queryRef} />}
    </Suspense>
  );
}
