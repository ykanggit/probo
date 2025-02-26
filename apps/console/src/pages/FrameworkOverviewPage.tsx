import { Suspense, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Shield, MoveUpRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { FrameworkOverviewPageQuery as FrameworkOverviewPageQueryType } from "./__generated__/FrameworkOverviewPageQuery.graphql";
import { Helmet } from "react-helmet-async";
import { createPortal } from "react-dom";

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
  const framework = data.node;
  const controls = framework.controls?.edges.map((edge) => edge?.node) ?? [];
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredControl, setHoveredControl] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
    width: number;
  } | null>(null);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const navigate = useNavigate();
  const { organizationId } = useParams();

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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F4F6] text-[#059669] text-sm">
            <Clock className="w-4 h-4" />
            <span>12 hours left</span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-card">
          <div className="p-6">
            <h3 className="font-medium mb-4">Preparation phase</h3>
            <div className="relative">
              <div className="flex w-full">
                <div className="w-[10%]">
                  <div className="h-2 rounded-sm bg-[#D1FA84]" />
                </div>
                <div className="w-[8px] bg-transparent z-10" />
                <div className="w-[70%]">
                  <div className="h-2 rounded-sm bg-muted" />
                </div>
                <div className="w-[8px] bg-transparent z-10" />
                <div className="w-[10%]">
                  <div className="h-2 rounded-sm bg-muted" />
                </div>
                <div className="w-[8px] bg-transparent z-10" />
                <div className="w-[10%]">
                  <div className="h-2 rounded-sm bg-muted" />
                </div>
              </div>
              <div className="mt-2 flex w-full text-sm text-muted-foreground">
                <div className="w-[10%]">
                  <span>Preparation</span>
                </div>
                <div className="w-[70%]">
                  <span>Observation period: 3 month</span>
                </div>
                <div className="w-[10%]">
                  <span>Audit: 6-9 days</span>
                </div>
                <div className="w-[10%]">
                  <span>Report: 10-14 days</span>
                </div>
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
            className="rounded-xl border border-gray-200 relative"
          >
            <div className="p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{card.title}</span>
                </div>
                <Avatar className="h-6 w-6 rounded-full">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex gap-1">
                  {Array(card.total)
                    .fill(0)
                    .map((_, i) => {
                      const control = card.controls[i];
                      return (
                        <div
                          key={i}
                          className={`h-4 w-4 ${
                            control?.state === "IMPLEMENTED"
                              ? "bg-[#D1FA84]"
                              : "bg-[#E5E7EB]"
                          } rounded-md hover:scale-110 hover:shadow-md transition-all duration-200 cursor-pointer`}
                          onMouseEnter={(e) => {
                            setHoveredCard(index);
                            setHoveredControl(i);
                            const rect =
                              e.currentTarget.getBoundingClientRect();

                            setTooltipPosition({
                              x: rect.left,
                              y: rect.top - 10,
                              width: 400,
                            });
                          }}
                          onClick={() => {
                            if (control?.id) {
                              navigate(
                                `/organizations/${organizationId}/frameworks/${framework.id}/controls/${control.id}`,
                              );
                            }
                          }}
                          onMouseLeave={() => {
                            setTimeout(() => {
                              if (!isTooltipHovered) {
                                setHoveredCard(null);
                                setHoveredControl(null);
                                setTooltipPosition(null);
                              }
                            }, 500);
                          }}
                          title={control?.name}
                        />
                      );
                    })}
                </div>
                <span className="text-sm text-muted-foreground">
                  {card.completed}/{card.total} Controls validated
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hoveredCard !== null &&
        hoveredControl !== null &&
        tooltipPosition &&
        createPortal(
          <div
            className="fixed z-50"
            onMouseEnter={() => setIsTooltipHovered(true)}
            onMouseLeave={() => {
              setIsTooltipHovered(false);
              setHoveredCard(null);
              setHoveredControl(null);
              setTooltipPosition(null);
            }}
            style={{
              left: tooltipPosition.x,
              transform: `translate(-50%, -100%)`,
              top: tooltipPosition.y - 20,
              width: tooltipPosition.width + "px",
            }}
          >
            <div className="bg-[#1C1C1C] text-white p-4 rounded-xl shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-[#A3E635] text-[#1C1C1C] px-2 py-1 rounded-full text-xs">
                    30 min
                  </div>
                  <div className="bg-[#2A2A2A] text-white px-2 py-1 rounded-full text-xs">
                    Mandatory
                  </div>
                  <div className="bg-[#2A2A2A] text-white px-2 py-1 rounded-full text-xs">
                    Assigned to you
                  </div>
                </div>
                <MoveUpRight className="w-4 h-4 cursor-pointer hover:text-[#A3E635] transition-colors" />
              </div>
              <div className="text-sm font-medium mb-2">
                {controlCards[hoveredCard]?.controls[hoveredControl]?.name}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                {
                  controlCards[hoveredCard]?.controls[hoveredControl]
                    ?.description
                }
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#A3E635]" />
                </div>
                <span className="text-sm text-gray-400">
                  {controlCards[hoveredCard]?.controls[hoveredControl]
                    ?.state === "IMPLEMENTED"
                    ? "Validated"
                    : "Not validated"}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
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
