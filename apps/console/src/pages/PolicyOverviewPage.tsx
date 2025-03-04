import { Suspense, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            Active
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            Draft
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-1">{policy.name}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                to={`/organizations/${organizationId}/policies/${policy.id}/update`}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Policy
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Policy Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </h4>
                  <div>{getStatusBadge(policy.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Created
                  </h4>
                  <p>{formatDate(policy.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Last Updated
                  </h4>
                  <p>{formatDate(policy.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Policy Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                <div
                  className="policy-content"
                  dangerouslySetInnerHTML={{ __html: policy.content || "" }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PolicyOverviewPageFallback() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
              </div>
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
