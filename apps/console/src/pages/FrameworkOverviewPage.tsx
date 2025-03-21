import { Suspense, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { FrameworkOverviewPageQuery as FrameworkOverviewPageQueryType } from "./__generated__/FrameworkOverviewPageQuery.graphql";
import { Helmet } from "react-helmet-async";
import { PageHeader } from "@/components/PageHeader";

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

// Define control type for better type safety
interface Control {
  id?: string;
  name?: string;
  description?: string;
  state?: string;
  category?: string;
  importance?: string;
  status?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  progress: number;
  controls: Control[];
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

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Map control state to status for the new design
  const mapStateToStatus = (state?: string): string => {
    if (!state) return "incomplete";
    switch (state) {
      case "IMPLEMENTED":
        return "complete";
      case "NOT_APPLICABLE":
        return "not-applicable";
      case "NOT_STARTED":
        return "not-started";
      default:
        return "in-progress";
    }
  };

  // Group controls by category
  const controlsByCategory = controls.reduce((acc, control) => {
    if (!control?.category) return acc;
    if (!acc[control.category]) {
      acc[control.category] = [];
    }
    acc[control.category].push({
      ...control,
      status: mapStateToStatus(control.state),
    });
    return acc;
  }, {} as Record<string, Control[]>);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Process categories with their controls
  const categories: Category[] = Object.entries(controlsByCategory)
    .map(([categoryName, categoryControls]) => {
      // Calculate progress
      const implementedCount = categoryControls.filter(
        (control) => control.status === "complete"
      ).length;
      const applicableCount = categoryControls.filter(
        (control) => control.status !== "not-applicable"
      ).length;
      const progress = applicableCount
        ? Math.round((implementedCount / applicableCount) * 100)
        : 0;

      return {
        id: categoryName,
        name: categoryName,
        description: `Controls related to ${categoryName.toLowerCase()}`,
        progress: progress,
        controls: categoryControls,
      };
    })
    .filter((category) => category.controls.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "not-started":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "incomplete":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "not-applicable":
        return <ShieldCheck className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusCounts = (controls: Control[]) => {
    return controls.reduce((acc, control) => {
      if (control.status) {
        acc[control.status] = (acc[control.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  return (
    <div className="container space-y-6">
      <PageHeader
        className="mb-10"
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

      <div className="grid gap-6">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          const statusCounts = getStatusCounts(category.controls);

          return (
            <div
              key={category.id}
              className="border rounded-lg overflow-hidden"
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500"
                      >
                        {statusCounts.complete || 0} Complete
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-500"
                      >
                        {statusCounts["in-progress"] || 0} In Progress
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-red-500/10 text-red-500"
                      >
                        {statusCounts.incomplete || 0} Incomplete
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Implementation progress</span>
                      <span className="font-medium">{category.progress}%</span>
                    </div>
                    <Progress value={category.progress} className="h-2" />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full flex items-center justify-center gap-2"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Hide Controls
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-4 w-4" />
                        View Controls ({category.controls.length})
                      </>
                    )}
                  </Button>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-0">
                    {category.controls.length > 0 ? (
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/30 text-sm font-medium text-muted-foreground">
                              <th className="w-24 px-4 py-2 text-left">
                                Importance
                              </th>
                              <th className="w-24 px-4 py-2 text-left">
                                Status
                              </th>
                              <th className="px-4 py-2 text-left">Control</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {category.controls.map((control) => (
                              <tr
                                key={control.id || Math.random().toString()}
                                className="hover:bg-muted/50 cursor-pointer"
                                onClick={() => {
                                  if (control?.id) {
                                    navigate(
                                      `/organizations/${organizationId}/frameworks/${framework.id}/controls/${control.id}`
                                    );
                                  }
                                }}
                              >
                                <td className="w-24 px-4 py-3 align-middle">
                                  <Badge variant="outline" className="text-xs">
                                    {control.importance}
                                  </Badge>
                                </td>
                                <td className="w-24 px-4 py-3 align-middle">
                                  <div className="flex items-center justify-center">
                                    {control.status
                                      ? getStatusIcon(control.status)
                                      : null}
                                  </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                  <div className="font-medium">
                                    {control.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {control.description}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
                        No controls in this category
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </div>
          );
        })}
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
