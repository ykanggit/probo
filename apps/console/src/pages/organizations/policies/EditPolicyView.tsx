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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Suspense } from "react";
import PeopleSelector from "@/components/PeopleSelector";
import type { EditPolicyViewQuery } from "./__generated__/EditPolicyViewQuery.graphql";
import type { EditPolicyViewMutation as EditPolicyViewMutationType } from "./__generated__/EditPolicyViewMutation.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { EditPolicyViewSkeleton } from "./EditPolicyPage";
import { User } from "lucide-react";

const editPolicyViewQuery = graphql`
  query EditPolicyViewQuery($policyId: ID!, $organizationId: ID!, $policyVersionId: ID!) {
    policyVersion: node(id: $policyVersionId) {
      id
      ... on PolicyVersion {
        content
      }
    }

    policy: node(id: $policyId) {
      id
      ... on Policy {
        title
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
  mutation EditPolicyViewMutation($input: UpdatePolicyVersionInput!) {
    updatePolicyVersion(input: $input) {
      policyVersion {
        id
        content
      }
    }
  }
`;

function EditPolicyViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<EditPolicyViewQuery>;
}) {
  const navigate = useNavigate();
  const { organizationId, policyId, versionId } = useParams();
  const data = usePreloadedQuery<EditPolicyViewQuery>(
    editPolicyViewQuery,
    queryRef
  );

  const [content, setContent] = useState(data.policyVersion.content || "");

  const [updatePolicy, isSubmitting] =
    useMutation<EditPolicyViewMutationType>(UpdatePolicyMutation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updatePolicy({
      variables: {
        input: {
          policyVersionId: data.policyVersion.id,
          content,
        },
      },
      onCompleted: (_, errors) => {
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
                <Label htmlFor="content">Policy Content</Label>
                <div className="min-h-[500px]">
                  <Textarea
                    id="content"
                    placeholder="Enter policy description"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={20}
                    className="min-h-[500px] resize-y"
                  />
                </div>
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

export default function EditPolicyView() {
  const { organizationId, policyId, versionId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<EditPolicyViewQuery>(editPolicyViewQuery);

  useEffect(() => {
    loadQuery({
      organizationId: organizationId!,
      policyId: policyId!,
      policyVersionId: versionId!,
    });
  }, [organizationId, policyId, versionId]);

  if (!queryRef) {
    return <EditPolicyViewSkeleton />;
  }

  return (
    <Suspense fallback={<EditPolicyViewSkeleton />}>
      <EditPolicyViewContent queryRef={queryRef}/>
    </Suspense>
  );
}
