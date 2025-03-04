import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
  PreloadedQuery,
} from "react-relay";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Suspense } from "react";
import PolicyEditor from "@/components/PolicyEditor";
import type { UpdatePolicyPageQuery as UpdatePolicyPageQueryType } from "./__generated__/UpdatePolicyPageQuery.graphql";
import type { UpdatePolicyPageMutation as UpdatePolicyPageMutationType } from "./__generated__/UpdatePolicyPageMutation.graphql";

const UpdatePolicyPageQuery = graphql`
  query UpdatePolicyPageQuery($policyId: ID!) {
    node(id: $policyId) {
      id
      ... on Policy {
        name
        content
        status
        version
      }
    }
  }
`;

const UpdatePolicyMutation = graphql`
  mutation UpdatePolicyPageMutation($input: UpdatePolicyInput!) {
    updatePolicy(input: $input) {
      policy {
        id
        name
        content
        status
      }
    }
  }
`;

function UpdatePolicyPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<UpdatePolicyPageQueryType>;
}) {
  const navigate = useNavigate();
  const { organizationId, policyId } = useParams();
  const data = usePreloadedQuery<UpdatePolicyPageQueryType>(
    UpdatePolicyPageQuery,
    queryRef
  );

  console.log("UpdatePolicyPage data:", data.node);

  const [name, setName] = useState(data.node.name);
  const [content, setContent] = useState(data.node.content || "");
  const [status, setStatus] = useState(data.node.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(
    "UpdatePolicyPage state - content:",
    content
      ? content.substring(0, 50) + (content.length > 50 ? "..." : "")
      : "empty"
  );

  const [commitMutation] =
    useMutation<UpdatePolicyPageMutationType>(UpdatePolicyMutation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    commitMutation({
      variables: {
        input: {
          id: data.node.id,
          name,
          content,
          status,
          expectedVersion: data.node.version!,
        },
      },
      onCompleted: (response, errors) => {
        setIsSubmitting(false);
        if (errors) {
          console.error("Error updating policy:", errors);
          toast({
            title: "Error",
            description: "Failed to update policy. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Policy updated successfully!",
        });

        navigate(
          `/organizations/${organizationId}/policies/${response.updatePolicy.policy.id}`
        );
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error("Error updating policy:", error);
        toast({
          title: "Error",
          description: "Failed to update policy. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Update Policy - Probo Console</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <div className="mr-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Update Policy</h1>
            <p className="text-muted-foreground">Update an existing policy</p>
          </div>
        </div>

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
      </div>
    </>
  );
}

function UpdatePolicyPageFallback() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <div className="mr-4">
          <div className="h-12 w-12 bg-muted animate-pulse rounded-lg" />
        </div>
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UpdatePolicyPage() {
  const [queryRef, loadQuery] = useQueryLoader<UpdatePolicyPageQueryType>(
    UpdatePolicyPageQuery
  );
  const { policyId } = useParams();

  useEffect(() => {
    loadQuery({ policyId: policyId! });
  }, [loadQuery, policyId]);

  if (!queryRef) {
    return <UpdatePolicyPageFallback />;
  }

  return (
    <>
      <Helmet>
        <title>Update Policy - Probo Console</title>
      </Helmet>
      <Suspense fallback={<UpdatePolicyPageFallback />}>
        <UpdatePolicyPageContent queryRef={queryRef} />
      </Suspense>
    </>
  );
}
