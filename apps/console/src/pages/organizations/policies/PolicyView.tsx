import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { Edit, Download, Shield, User, FileText, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PolicyViewQuery as PolicyViewQueryType } from "./__generated__/PolicyViewQuery.graphql";
import type { PolicyViewDeleteMutation } from "./__generated__/PolicyViewDeleteMutation.graphql";
import { useToast } from "@/hooks/use-toast";
import { PageTemplate } from "@/components/PageTemplate";
import { PolicyViewSkeleton } from "./PolicyPage";

const PolicyViewQuery = graphql`
  query PolicyViewQuery($policyId: ID!) {
    node(id: $policyId) {
      id
      ... on Policy {
        name
        content
        createdAt
        updatedAt
        reviewDate
        status
        owner {
          id
          fullName
          primaryEmailAddress
        }
      }
    }
  }
`;

const DeletePolicyMutation = graphql`
  mutation PolicyViewDeleteMutation(
    $input: DeletePolicyInput!
    $connections: [ID!]!
  ) {
    deletePolicy(input: $input) {
      deletedPolicyId @deleteEdge(connections: $connections)
    }
  }
`;

function PolicyViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<PolicyViewQueryType>;
}) {
  const data = usePreloadedQuery(PolicyViewQuery, queryRef);
  const policy = data.node;
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("content");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const [commitDeleteMutation] =
    useMutation<PolicyViewDeleteMutation>(DeletePolicyMutation);

  const handleDeletePolicy = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to delete this policy? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);

      commitDeleteMutation({
        variables: {
          input: {
            policyId: policy.id,
          },
          connections: [
            ConnectionHandler.getConnectionID(
              organizationId!,
              "PolicyListPage_policies"
            ),
          ],
        },
        onCompleted: (_, errors) => {
          setIsDeleting(false);
          if (errors) {
            console.error("Error deleting policy:", errors);
            toast({
              title: "Error",
              description: "Failed to delete policy. Please try again.",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Success",
            description: "Policy deleted successfully.",
          });

          navigate(`/organizations/${organizationId}/policies`);
        },
        onError: (error) => {
          setIsDeleting(false);
          console.error("Error deleting policy:", error);
          toast({
            title: "Error",
            description: "Failed to delete policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  }, [policy.id, organizationId, commitDeleteMutation, navigate]);

  // Extract a short description from the content
  const getDescription = (content: string | undefined) => {
    if (!content) return "No description available";

    // Remove HTML tags
    const withoutTags = content.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    const decoded = withoutTags
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ");

    // Get first paragraph or first 150 characters
    const firstParagraph = decoded.split("\n\n")[0].trim();
    return firstParagraph.length > 150
      ? firstParagraph.substring(0, 150) + "..."
      : firstParagraph;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  return (
    <PageTemplate
      title={policy.name ?? ""}
      description={
        <div className="flex items-center gap-2 text-muted-foreground">
          <Badge variant={policy.status === "ACTIVE" ? "default" : "outline"}>
            {policy.status === "ACTIVE" ? "Active" : "Draft"}
          </Badge>
          {policy.owner && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <Link
                to={`/organizations/${organizationId}/people/${policy.owner.id}`}
                className="hover:underline"
              >
                {policy.owner.fullName}
              </Link>
            </div>
          )}
          {policy.reviewDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Review: {formatDate(policy.reviewDate)}</span>
            </div>
          )}
        </div>
      }
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              to={`/organizations/${organizationId}/policies/${policy.id}/edit`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Logic to download policy content as PDF or text
              const element = document.createElement("a");
              const file = new Blob([policy.content || ""], {
                type: "text/plain",
              });
              element.href = URL.createObjectURL(file);
              element.download = `${policy.name}.txt`;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-slate-100">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex gap-2">
                  {policy.status && (
                    <Badge
                      className={`px-3 py-1 rounded-md font-medium ${
                        policy.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : policy.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {policy.status === "ACTIVE"
                        ? "Active"
                        : policy.status === "DRAFT"
                        ? "Draft"
                        : policy.status}
                    </Badge>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-3">{policy.name}</h1>

              <p className="text-muted-foreground mb-6">
                {getDescription(policy.content)}
              </p>

              <Tabs
                defaultValue="content"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-6"
              >
                <TabsList className="border-b w-full rounded-none bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="content"
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 font-medium ${
                      activeTab === "content"
                        ? "border-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Policy Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 font-medium ${
                      activeTab === "history"
                        ? "border-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Version History
                  </TabsTrigger>
                  <TabsTrigger
                    value="approvals"
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 font-medium ${
                      activeTab === "approvals"
                        ? "border-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Approvals
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="pt-6">
                  <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                    <div
                      className="policy-content"
                      dangerouslySetInnerHTML={{
                        __html: policy.content || "",
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Version history will be available soon.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="approvals" className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Approval workflow will be available soon.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border shadow-sm mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Policy Details</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Last Updated</span>
                  </div>
                  <p className="font-medium">{formatDate(policy.updatedAt)}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Review Due</span>
                  </div>
                  <p className="font-medium">
                    {policy.reviewDate
                      ? formatDate(policy.reviewDate)
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Owner</span>
                  </div>
                  <Link
                    to={`/organizations/${organizationId}/people/${policy.owner?.id}`}
                    className="hover:underline"
                  >
                    <p className="font-medium">
                      {policy.owner ? policy.owner.fullName : "Not assigned"}
                    </p>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button asChild className="w-full">
            <Link
              to={`/organizations/${organizationId}/policies/${policy.id}/edit`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Policy
            </Link>
          </Button>

          <Card className="border shadow-sm mt-6 bg-red-50">
            <CardContent className="p-6">
              <h3 className="text-red-500 font-semibold mb-3">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete this policy and all of its data. This action
                cannot be undone.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeletePolicy}
                disabled={isDeleting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                {isDeleting ? "Deleting..." : "Delete Policy"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
}

export default function PolicyView() {
  const [queryRef, loadQuery] =
    useQueryLoader<PolicyViewQueryType>(PolicyViewQuery);

  const { policyId } = useParams();

  useEffect(() => {
    loadQuery({ policyId: policyId! });
  }, [loadQuery, policyId]);

  if (!queryRef) {
    return <PolicyViewSkeleton />;
  }

  return (
    <Suspense fallback={<PolicyViewSkeleton />}>
      {queryRef && <PolicyViewContent queryRef={queryRef} />}
    </Suspense>
  );
}
