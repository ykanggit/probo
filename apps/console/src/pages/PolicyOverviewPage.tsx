import { Suspense, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Edit, Download, Shield, User, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PolicyOverviewPageQuery as PolicyOverviewPageQueryType } from "./__generated__/PolicyOverviewPageQuery.graphql";
import { Helmet } from "react-helmet-async";
import "../styles/policy-content.css";

const PolicyOverviewPageQuery = graphql`
  query PolicyOverviewPageQuery($policyId: ID!) {
    node(id: $policyId) {
      id
      ... on Policy {
        name
        content
        createdAt
        updatedAt
        reviewDate
        status
      }
    }
  }
`;

function PolicyOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<PolicyOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery(PolicyOverviewPageQuery, queryRef);
  const policy = data.node;
  const { organizationId } = useParams();
  const [activeTab, setActiveTab] = useState("content");

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
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-slate-100">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-black text-white hover:bg-black/90 px-3 py-1 rounded-md font-medium"
                  >
                    SOC2
                  </Badge>
                  <Badge className="px-3 py-1 rounded-md font-medium">
                    Security
                  </Badge>
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
                <div className="ml-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
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
                      dangerouslySetInnerHTML={{ __html: policy.content || "" }}
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
                  <p className="font-medium">Jane Smith, CISO</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button asChild className="w-full">
            <Link
              to={`/organizations/${organizationId}/policies/${policy.id}/update`}
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
              <Button variant="destructive" className="w-full">
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
                Delete Policy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PolicyOverviewPageFallback() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-slate-100/50 h-10 w-10 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-md" />
                  <div className="h-6 w-20 bg-muted animate-pulse rounded-md" />
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-md" />
                </div>
                <div className="ml-auto">
                  <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
                </div>
              </div>

              <div className="h-8 w-3/4 bg-muted animate-pulse rounded mb-3" />

              <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              </div>

              <div className="flex border-b mb-6">
                <div className="px-4 py-2 h-8 w-28 bg-muted animate-pulse rounded" />
                <div className="px-4 py-2 h-8 w-28 bg-muted animate-pulse rounded opacity-50" />
                <div className="px-4 py-2 h-8 w-28 bg-muted animate-pulse rounded opacity-50" />
              </div>

              <div className="space-y-4">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-6" />

              <div className="space-y-6">
                <div>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                </div>

                <div>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                </div>

                <div>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-5 w-36 bg-muted animate-pulse rounded" />
                </div>

                <hr className="my-4" />

                <div>
                  <div className="h-5 w-32 bg-muted animate-pulse rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="h-10 w-full bg-muted animate-pulse rounded mb-6" />

          <Card className="border shadow-sm bg-red-50/30">
            <CardContent className="p-6">
              <div className="h-5 w-28 bg-muted animate-pulse rounded mb-3" />
              <div className="h-16 w-full bg-muted animate-pulse rounded mb-4" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PolicyOverviewPage() {
  const [queryRef, loadQuery] = useQueryLoader<PolicyOverviewPageQueryType>(
    PolicyOverviewPageQuery
  );

  const { policyId } = useParams();

  useEffect(() => {
    loadQuery({ policyId: policyId! });
  }, [loadQuery, policyId]);

  return (
    <>
      <Helmet>
        <title>Policy Details - Probo Console</title>
      </Helmet>
      <Suspense fallback={<PolicyOverviewPageFallback />}>
        {queryRef && <PolicyOverviewPageContent queryRef={queryRef} />}
      </Suspense>
    </>
  );
}
