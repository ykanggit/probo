import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import type { PolicyListPageQuery as PolicyListPageQueryType } from "./__generated__/PolicyListPageQuery.graphql";

const PolicyListPageQuery = graphql`
  query PolicyListPageQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ... on Organization {
        policies(first: 25) @connection(key: "PolicyListPage_policies") {
          edges {
            node {
              id
              name
              createdAt
              updatedAt
              status
            }
          }
        }
      }
    }
  }
`;

function PolicyCard({
  title,
  icon,
  status,
}: {
  title: string;
  icon: React.ReactNode;
  status?: string;
}) {
  return (
    <Card className="relative overflow-hidden border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="size-16">{icon}</div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            {status && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : status === "DRAFT"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {status === "ACTIVE"
                  ? "Active"
                  : status === "DRAFT"
                  ? "Draft"
                  : status}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function PolicyListPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<PolicyListPageQueryType>;
}) {
  const data = usePreloadedQuery<PolicyListPageQueryType>(
    PolicyListPageQuery,
    queryRef
  );
  const { organizationId } = useParams();
  const policies =
    data.organization.policies?.edges.map((edge) => edge?.node) ?? [];

  return (
    <>
      <Helmet>
        <title>Policies - Probo</title>
      </Helmet>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Policies</h1>
            <p className="text-muted-foreground">
              Manage your organization{"'"}s policies
            </p>
          </div>
          <Button asChild>
            <Link to={`/organizations/${organizationId}/policies/create`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Link>
          </Button>
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => (
              <Link
                key={policy.id}
                to={`/organizations/${organizationId}/policies/${policy.id}`}
              >
                <PolicyCard
                  title={policy.name}
                  icon={
                    <div className="flex size-full items-center justify-center rounded-full bg-blue-100">
                      <FileText className="h-8 w-8 text-blue-900" />
                    </div>
                  }
                  status={policy.status}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PolicyListPageFallback() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded mt-1" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card/50">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <div className="bg-muted w-24 h-24 rounded-full animate-pulse mb-4" />
                <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
                <div className="h-20 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PolicyListPage() {
  const [queryRef, loadQuery] =
    useQueryLoader<PolicyListPageQueryType>(PolicyListPageQuery);

  const { organizationId } = useParams();

  useEffect(() => {
    loadQuery({ organizationId: organizationId! });
  }, [loadQuery, organizationId]);

  return (
    <>
      <Helmet>
        <title>Policies - Probo Console</title>
      </Helmet>
      <Suspense fallback={<PolicyListPageFallback />}>
        {queryRef && <PolicyListPageContent queryRef={queryRef} />}
      </Suspense>
    </>
  );
}
