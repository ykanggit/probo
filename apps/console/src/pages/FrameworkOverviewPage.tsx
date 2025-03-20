import { Suspense, useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Shield, MoveUpRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FrameworkOverviewPageQuery as FrameworkOverviewPageQueryType } from "./__generated__/FrameworkOverviewPageQuery.graphql";
import { Helmet } from "react-helmet-async";
import { PageHeader } from "./PageHeader";

const FrameworkOverviewPageQuery = graphql`
  query FrameworkOverviewPageQuery($frameworkId: ID!) {
    node(id: $frameworkId) {
      id
      ... on Framework {
        name
        description
        controls(first: 100)
          @connection(key: "FrameworkOverviewPage_controls") {
          edges {
            node {
              id
              name
              description
              state
              category
              importance
            }
          }
        }
      }
    }
  }
`;

function ControlSquare({
  control,
  onClick,
}: {
  control: {
    id?: string;
    name?: string;
    description?: string;
    state?: string;
    category?: string;
    importance?: string;
  };
  onClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const squareRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const truncateDescription = (text?: string, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Calculate tooltip position when it becomes visible
  useEffect(() => {
    if (showTooltip && squareRef.current && tooltipRef.current) {
      const squareRect = squareRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Position tooltip above the square
      const top = squareRect.top - tooltipRect.height - 10;
      const left =
        squareRect.left + squareRect.width / 2 - tooltipRect.width / 2;

      // Adjust if tooltip would go off screen
      const adjustedLeft = Math.max(
        10,
        Math.min(left, window.innerWidth - tooltipRect.width - 10)
      );

      tooltipRef.current.style.top = `${top}px`;
      tooltipRef.current.style.left = `${adjustedLeft}px`;
    }
  }, [showTooltip]);

  return (
    <div className="relative">
      <div
        ref={squareRef}
        className={`h-4 w-4 ${
          control?.state === "IMPLEMENTED" ? "bg-[#D1FA84]" : "bg-[#E5E7EB]"
        } rounded-md hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
      />

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-[#1C1C1C] text-white p-4 rounded-xl shadow-lg space-y-2"
          style={{ visibility: "visible", maxWidth: "300px" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#A3E635] text-[#1C1C1C] px-2 py-1 rounded-full text-xs">
                30 min
              </div>
              <div className="bg-[#2A2A2A] text-white px-2 py-1 rounded-full text-xs">
                {control?.importance}
              </div>
            </div>
            <MoveUpRight className="w-4 h-4 cursor-pointer hover:text-[#A3E635] transition-colors" />
          </div>
          <div className="text-sm font-medium mb-2">{control?.name}</div>
          <div className="text-sm text-gray-400 mb-4">
            {truncateDescription(control?.description)}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#A3E635]" />
            </div>
            <span className="text-sm text-gray-400">
              {control?.state === "IMPLEMENTED" ? "Validated" : "Not validated"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function FrameworkOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery(FrameworkOverviewPageQuery, queryRef);
  const framework = data.node;
  const controls = framework.controls?.edges.map((edge) => edge?.node) ?? [];
  const navigate = useNavigate();
  const { organizationId } = useParams();

  const controlsByCategory = controls.reduce((acc, control) => {
    if (!control?.category) return acc;
    if (!acc[control.category]) {
      acc[control.category] = [];
    }
    acc[control.category].push(control);
    return acc;
  }, {} as Record<string, typeof controls>);

  const controlCards = Object.entries(controlsByCategory)
    .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB))
    .map(([category, controls]) => ({
      title: category,
      controls,
      completed: controls.filter((c) => c?.state === "IMPLEMENTED").length,
      total: controls.length,
    }));

  const totalImplemented = controls.filter(
    (c) => c?.state === "IMPLEMENTED"
  ).length;

  return (
    <div className="container space-y-6">
      <PageHeader
        className="mb-17"
        title={framework.name ?? ""}
        description={framework.description ?? ""}
        actions={
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link
                to={`/organizations/${organizationId}/frameworks/${framework.id}/update`}
              >
                Edit Framework
              </Link>
            </Button>
            <Button asChild>
              <Link
                to={`/organizations/${organizationId}/frameworks/${framework.id}/controls/create`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Control
              </Link>
            </Button>
          </div>
        }
      />

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
            className="rounded-xl border border-gray-200 relative"
          >
            <div className="p-4 rounded-xl h-full flex flex-col">
              <div className="flex items-center h-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{card.title}</span>
                </div>
              </div>
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div className="min-h-[40px]">
                  <div className="flex flex-wrap gap-1">
                    {Array(card.total)
                      .fill(0)
                      .map((_, i) => {
                        const control = card.controls[i];
                        return (
                          <ControlSquare
                            key={i}
                            control={control}
                            onClick={() => {
                              if (control?.id) {
                                navigate(
                                  `/organizations/${organizationId}/frameworks/${framework.id}/controls/${control.id}`
                                );
                              }
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">
                    {card.completed}/{card.total} Controls validated
                  </span>
                </div>
              </div>
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
    FrameworkOverviewPageQuery
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
