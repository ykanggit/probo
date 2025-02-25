import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import type { FrameworkListPageQuery as FrameworkListPageQueryType } from "./__generated__/FrameworkListPageQuery.graphql";
import { Helmet } from "react-helmet-async";

const FrameworkListPageQuery = graphql`
  query FrameworkListPageQuery {
    viewer {
      id
      organization {
        frameworks {
          edges {
            node {
              id
              name
              description
              controls {
                edges {
                  node {
                    id
                    state
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

function FrameworkCard({
  title,
  description,
  icon,
  status,
  progress,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  progress?: string;
}) {
  return (
    <Card className="relative overflow-hidden border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="size-16">{icon}</div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            {status && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                {status}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {progress && (
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-yellow-400" />
            {progress}
          </div>
        )}
      </div>
    </Card>
  );
}

function FrameworkListPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkListPageQueryType>;
}) {
  const data = usePreloadedQuery(FrameworkListPageQuery, queryRef);
  const frameworks =
    data.viewer.organization.frameworks?.edges.map((edge) => edge?.node) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Framework</h2>
        <p className="text-muted-foreground">
          Track and manage your compliance frameworks and their controls.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {frameworks.map((framework) => {
          const validatedControls = framework.controls.edges.filter(
            (edge) => edge?.node?.state === "IMPLEMENTED"
          ).length;
          const totalControls = framework.controls.edges.length;

          return (
            <Link key={framework.id} to={`/frameworks/${framework.id}`}>
              <FrameworkCard
                title={framework.name}
                description={framework.description}
                icon={
                  <div className="flex size-full items-center justify-center rounded-full bg-blue-100">
                    <span className="text-lg font-semibold text-blue-900">
                      {framework.name.split(" ")[0]}
                    </span>
                  </div>
                }
                status={
                  validatedControls === totalControls ? "Compliant" : undefined
                }
                progress={
                  validatedControls === totalControls
                    ? "All controls validated"
                    : `${validatedControls}/${totalControls} Controls validated`
                }
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkListPageFallback() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded mt-1" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
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

export default function FrameworkListPage() {
  const [queryRef, loadQuery] = useQueryLoader<FrameworkListPageQueryType>(
    FrameworkListPageQuery
  );

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  return (
    <>
      <Helmet>
        <title>Frameworks - Probo Console</title>
      </Helmet>
      <Suspense fallback={<FrameworkListPageFallback />}>
        {queryRef && <FrameworkListPageContent queryRef={queryRef} />}
      </Suspense>
    </>
  );
}
