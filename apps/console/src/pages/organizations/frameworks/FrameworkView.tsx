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
import type { FrameworkViewQuery as FrameworkViewQueryType } from "./__generated__/FrameworkViewQuery.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { FrameworkViewSkeleton } from "./FrameworkPage";

const FrameworkViewQuery = graphql`
  query FrameworkViewQuery($frameworkId: ID!) {
    node(id: $frameworkId) {
      id
      ... on Framework {
        name
        description
        controls(first: 100) @connection(key: "FrameworkView_controls") {
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
  doneCount: number;
  totalCount: number;
}

function FrameworkViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkViewQueryType>;
}) {
  const data = usePreloadedQuery(FrameworkViewQuery, queryRef);
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

  const processedControls = controls.map((control) => ({
    ...control,
    status: mapStateToStatus(control.state),
  }));

  // Calculate global progress
  const implementedCount = processedControls.filter(
    (control) => control.status === "complete"
  ).length;
  const notApplicableCount = processedControls.filter(
    (control) => control.status === "not-applicable"
  ).length;
  const totalControls = processedControls.length;

  // Include not-applicable as effectively "complete" for progress percentage
  const effectiveCompletedCount = implementedCount + notApplicableCount;
  const globalProgress = totalControls
    ? Math.round((effectiveCompletedCount / totalControls) * 100)
    : 0;

  // Get global status counts
  const globalStatusCounts = processedControls.reduce((acc, control) => {
    if (control.status) {
      acc[control.status] = (acc[control.status] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Group controls by category
  const controlsByCategory = processedControls.reduce((acc, control) => {
    if (!control?.category) return acc;
    if (!acc[control.category]) {
      acc[control.category] = [];
    }
    acc[control.category].push(control);
    return acc;
  }, {} as Record<string, Control[]>);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const categories: Category[] = Object.entries(controlsByCategory)
    .map(([categoryName, categoryControls]) => {
      const catImplementedCount = categoryControls.filter(
        (control) => control.status === "complete"
      ).length;
      const catNotApplicableCount = categoryControls.filter(
        (control) => control.status === "not-applicable"
      ).length;
      // Consider both "complete" and "not-applicable" as done for category progress
      const catDoneCount = catImplementedCount + catNotApplicableCount;
      const catTotalCount = categoryControls.length;
      const progress = catTotalCount
        ? Math.round((catDoneCount / catTotalCount) * 100)
        : 0;

      return {
        id: categoryName,
        name: categoryName,
        description: `Controls related to ${categoryName.toLowerCase()}`,
        progress: progress,
        controls: categoryControls.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        ),
        doneCount: catDoneCount,
        totalCount: catTotalCount,
      };
    })
    .filter((category) => category.controls.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "not-started":
        return <AlertCircle className="h-5 w-5 text-gray-200" />;
      case "incomplete":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "not-applicable":
        return <ShieldCheck className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <PageTemplate
      title={framework.name ?? ""}
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
    >
      {/* Global Progress Summary */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-medium">Framework Implementation</h3>
          <span className="text-sm text-muted-foreground">
            {globalProgress}% complete
          </span>
        </div>

        {/* Progress bar container */}
        <div className="w-full h-5 rounded-full overflow-hidden bg-muted mb-2">
          {/* Segmented progress bar */}
          <div className="flex h-full">
            {/* Complete segment */}
            {globalStatusCounts.complete > 0 && (
              <div
                className="bg-green-500 h-full"
                style={{
                  width: `${
                    (globalStatusCounts.complete / totalControls) * 100
                  }%`,
                }}
              />
            )}
            {/* In-progress segment */}
            {globalStatusCounts["in-progress"] > 0 && (
              <div
                className="bg-blue-500 h-full"
                style={{
                  width: `${
                    (globalStatusCounts["in-progress"] / totalControls) * 100
                  }%`,
                }}
              />
            )}
            {/* Incomplete segment */}
            {globalStatusCounts.incomplete > 0 && (
              <div
                className="bg-red-500 h-full"
                style={{
                  width: `${
                    (globalStatusCounts.incomplete / totalControls) * 100
                  }%`,
                }}
              />
            )}
            {/* Not applicable segment */}
            {globalStatusCounts["not-applicable"] > 0 && (
              <div
                className="bg-gray-600 h-full"
                style={{
                  width: `${
                    (globalStatusCounts["not-applicable"] / totalControls) * 100
                  }%`,
                }}
              />
            )}
            {/* Not started segment */}
            {globalStatusCounts["not-started"] > 0 && (
              <div
                className="bg-gray-200 h-full"
                style={{
                  width: `${
                    (globalStatusCounts["not-started"] / totalControls) * 100
                  }%`,
                }}
              />
            )}
          </div>
        </div>

        {/* Status legend - reorder to match progress bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {globalStatusCounts.complete > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Complete ({globalStatusCounts.complete})</span>
            </div>
          )}
          {globalStatusCounts["in-progress"] > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>In Progress ({globalStatusCounts["in-progress"]})</span>
            </div>
          )}
          {globalStatusCounts.incomplete > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Incomplete ({globalStatusCounts.incomplete})</span>
            </div>
          )}
          {globalStatusCounts["not-applicable"] > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <span>
                Not Applicable ({globalStatusCounts["not-applicable"]})
              </span>
            </div>
          )}
          {globalStatusCounts["not-started"] > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span>Not Started ({globalStatusCounts["not-started"]})</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <div
              key={category.id}
              className="border rounded-lg overflow-hidden"
            >
              <Card className="border-0 shadow-none">
                <CardHeader
                  className="bg-muted/50 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {category.doneCount} / {category.totalCount}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
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
    </PageTemplate>
  );
}

export default function FrameworkView() {
  const { frameworkId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<FrameworkViewQueryType>(FrameworkViewQuery);

  useEffect(() => {
    loadQuery({ frameworkId: frameworkId! });
  }, [loadQuery, frameworkId]);

  if (!queryRef) {
    return <FrameworkViewSkeleton />;
  }

  return (
    <Suspense fallback={<FrameworkViewSkeleton />}>
      {queryRef && <FrameworkViewContent queryRef={queryRef} />}
    </Suspense>
  );
}
