import { Suspense, useEffect } from "react";
import { useParams } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Shield, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FrameworkOverviewPageQuery as FrameworkOverviewPageQueryType } from "./__generated__/FrameworkOverviewPageQuery.graphql";
import { Helmet } from "react-helmet-async";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

const FrameworkOverviewPageQuery = graphql`
  query FrameworkOverviewPageQuery($frameworkId: ID!) {
    node(id: $frameworkId) {
      id
      ... on Framework {
        name
        description
        controls {
          edges {
            node {
              id
              name
              description
              state
              category
            }
          }
        }
      }
    }
  }
`;

function FrameworkOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery(FrameworkOverviewPageQuery, queryRef);
  const { setBreadcrumbSegment } = useBreadcrumb();
  const framework = data.node;
  const controls = framework.controls?.edges.map((edge) => edge?.node) ?? [];

  useEffect(() => {
    if (framework?.name) {
      setBreadcrumbSegment("frameworks/:id", framework.name);
    }
  }, [framework?.name, setBreadcrumbSegment]);

  // Group controls by their category
  const controlsByCategory = controls.reduce(
    (acc, control) => {
      if (!control?.category) return acc;
      if (!acc[control.category]) {
        acc[control.category] = [];
      }
      acc[control.category].push(control);
      return acc;
    },
    {} as Record<string, typeof controls>,
  );

  const controlCards = Object.entries(controlsByCategory).map(
    ([category, controls]) => ({
      title: category,
      controls,
      completed: controls.filter((c) => c?.state === "IMPLEMENTED").length,
      total: controls.length,
    }),
  );

  const totalImplemented = controls.filter(
    (c) => c?.state === "IMPLEMENTED",
  ).length;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-2xl font-semibold">{framework.name}</h1>
        <p className="text-muted-foreground max-w-3xl">
          {framework.description}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Timeline</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] text-[#A3E635] text-sm">
            <Clock className="w-4 h-4" />
            <span>12 hours left</span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-medium mb-4">Preparation phase</h3>
          <div className="relative">
            <div className="flex w-full">
              <div className="w-[20%]">
                <div className="h-2 rounded-md bg-gradient-to-r from-blue-400 via-green-300 to-yellow-300" />
              </div>
              <div className="w-[8px] bg-transparent z-10" />
              <div className="w-[45%]">
                <div className="h-2 rounded-md bg-muted" />
              </div>
              <div className="w-[8px] bg-transparent z-10" />
              <div className="w-[15%]">
                <div className="h-2 rounded-md bg-muted" />
              </div>
              <div className="w-[8px] bg-transparent z-10" />
              <div className="w-[20%]">
                <div className="h-2 rounded-md bg-muted" />
              </div>
            </div>
            <div className="mt-2 flex w-full text-sm text-muted-foreground">
              <div className="w-[20%]">
                <span>Preparation</span>
              </div>
              <div className="w-[45%]">
                <span>Observation period: 3 month</span>
              </div>
              <div className="w-[15%]">
                <span>Audit: 6-9 days</span>
              </div>
              <div className="w-[20%]">
                <span>Report: 10-14 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Controls</h2>
        <div className="text-primary">
          {totalImplemented} out of {controls.length} validated
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {controlCards.map((card, index) => (
          <div
            key={index}
            className="block p-4 rounded-lg border bg-card text-card-foreground"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{card.title}</span>
              </div>
              <Avatar className="h-6 w-6">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex gap-1">
                {Array(card.total)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 w-4 ${
                        i < card.completed ? "bg-[#D1FA84] rounded" : "bg-muted rounded"
                      }`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {card.completed}/{card.total} Controls validated
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FrameworkOverviewPageFallback() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
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

export default function FrameworkOverviewPage() {
  const { frameworkId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<FrameworkOverviewPageQueryType>(
    FrameworkOverviewPageQuery,
  );

  useEffect(() => {
    loadQuery({ frameworkId: frameworkId! });
  }, [loadQuery, frameworkId]);

  return (
    <>
      <Helmet>
        <title>Framework Overview - Probo Console</title>
      </Helmet>
      <Suspense fallback={<FrameworkOverviewPageFallback />}>
        {queryRef && <FrameworkOverviewPageContent queryRef={queryRef} />}
      </Suspense>
    </>
  );
}
