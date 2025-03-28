import { Suspense, useEffect, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { useParams, useNavigate, Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { PageTemplate } from "@/components/PageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MitigationListViewQuery as MitigationListViewQueryType } from "./__generated__/MitigationListViewQuery.graphql";
import { MitigationListViewSkeleton } from "./MitigationListPage";
import { Button } from "@/components/ui/button";

const mitigationListViewQuery = graphql`
  query MitigationListViewQuery($organizationId: ID!, $first: Int) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        mitigations(
          first: $first
          orderBy: { direction: ASC, field: CREATED_AT }
        ) @connection(key: "MitigationListView_mitigations") {
          edges {
            node {
              id
              name
              description
              category
              state
              importance
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

interface Mitigation {
  id?: string;
  name?: string;
  description?: string;
  state?: string;
  category?: string;
  importance?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  progress: number;
  mitigations: Mitigation[];
  doneCount: number;
  totalCount: number;
}

interface OrganizationData {
  organization: {
    id: string;
    mitigations?: {
      edges: Array<{
        node: Mitigation;
      }>;
    };
  };
}

function MitigationListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<MitigationListViewQueryType>;
}) {
  const data = usePreloadedQuery<MitigationListViewQueryType>(
    mitigationListViewQuery,
    queryRef
  ) as unknown as OrganizationData;

  const navigate = useNavigate();
  const { organizationId } = useParams();

  // Monitor URL hash for changes and update state accordingly
  const [hashValue, setHashValue] = useState(window.location.hash);

  // Get the active category from the hash
  const hashCategory = hashValue.substring(1)
    ? decodeURIComponent(hashValue.substring(1))
    : "";

  // Keep track of manually expanded categories
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    return hashCategory ? [hashCategory] : [];
  });

  // When hash changes, update expanded categories to include the hash category
  useEffect(() => {
    if (hashCategory && !expandedCategories.includes(hashCategory)) {
      setExpandedCategories((prev) => [...prev, hashCategory]);
    }
  }, [hashCategory, expandedCategories]);

  // Listen for hash changes (like when using back button)
  useEffect(() => {
    const handleHashChange = () => {
      setHashValue(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const mitigations =
    data.organization.mitigations?.edges.map((edge) => edge.node) ?? [];

  // Map mitigation state to status for the new design
  const mapStateToStatus = (state?: string): string => {
    if (!state) return "incomplete";
    switch (state) {
      case "IMPLEMENTED":
        return "complete";
      case "NOT_APPLICABLE":
        return "not-applicable";
      case "NOT_STARTED":
        return "not-started";
      case "IN_PROGRESS":
        return "in-progress";
      default:
        return "incomplete";
    }
  };

  const processedMitigations = mitigations.map((mitigation: Mitigation) => ({
    ...mitigation,
    status: mapStateToStatus(mitigation.state),
  }));

  // Calculate global progress
  const implementedCount = processedMitigations.filter(
    (mitigation: Mitigation) => mitigation.status === "complete"
  ).length;
  const notApplicableCount = processedMitigations.filter(
    (mitigation: Mitigation) => mitigation.status === "not-applicable"
  ).length;
  const totalMitigations = processedMitigations.length;

  // Include not-applicable as effectively "complete" for progress percentage
  const effectiveCompletedCount = implementedCount + notApplicableCount;
  const globalProgress = totalMitigations
    ? Math.round((effectiveCompletedCount / totalMitigations) * 100)
    : 0;

  // Get global status counts
  const globalStatusCounts = processedMitigations.reduce(
    (acc: Record<string, number>, mitigation: Mitigation) => {
      if (mitigation.status) {
        acc[mitigation.status] = (acc[mitigation.status] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Group mitigations by category
  const mitigationsByCategory = processedMitigations.reduce(
    (acc: Record<string, Mitigation[]>, mitigation: Mitigation) => {
      if (!mitigation?.category) return acc;
      if (!acc[mitigation.category]) {
        acc[mitigation.category] = [];
      }
      acc[mitigation.category].push(mitigation);
      return acc;
    },
    {} as Record<string, Mitigation[]>
  );

  // Function to toggle a category's expanded state
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const categories: Category[] = Object.entries(mitigationsByCategory)
    .map(([categoryName, categoryMitigations]: [string, Mitigation[]]) => {
      const catImplementedCount = categoryMitigations.filter(
        (mitigation) => mitigation.status === "complete"
      ).length;
      const catNotApplicableCount = categoryMitigations.filter(
        (mitigation) => mitigation.status === "not-applicable"
      ).length;
      // Consider both "complete" and "not-applicable" as done for category progress
      const catDoneCount = catImplementedCount + catNotApplicableCount;
      const catTotalCount = categoryMitigations.length;
      const progress = catTotalCount
        ? Math.round((catDoneCount / catTotalCount) * 100)
        : 0;

      return {
        id: categoryName,
        name: categoryName,
        description: `Mitigations related to ${categoryName.toLowerCase()}`,
        progress: progress,
        mitigations: categoryMitigations.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        ),
        doneCount: catDoneCount,
        totalCount: catTotalCount,
      };
    })
    .filter((category) => category.mitigations.length > 0)
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
        return <X className="h-5 w-5 text-gray-300" />;
      default:
        return null;
    }
  };

  return (
    <PageTemplate
      title="Mitigations"
      description="Mitigations are actions taken to reduce the risk. Add them to track their implementation status."
      actions={
        <Button asChild>
          <Link to={`/organizations/${organizationId}/mitigations/new`}>
            New Mitigation
          </Link>
        </Button>
      }
    >
      {/* Global Progress Summary */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-medium">Mitigation Implementation</h3>
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
                    (globalStatusCounts.complete / totalMitigations) * 100
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
                    (globalStatusCounts["in-progress"] / totalMitigations) * 100
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
                    (globalStatusCounts.incomplete / totalMitigations) * 100
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
                    (globalStatusCounts["not-applicable"] / totalMitigations) *
                    100
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
                    (globalStatusCounts["not-started"] / totalMitigations) * 100
                  }%`,
                }}
              />
            )}
          </div>
        </div>

        {/* Status legend */}
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

      {/* Category groups */}
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
                    {category.mitigations.length > 0 ? (
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
                              <th className="px-4 py-2 text-left">
                                Mitigation
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {category.mitigations.map((mitigation) => (
                              <tr
                                key={mitigation.id || Math.random().toString()}
                                className="hover:bg-muted/50 cursor-pointer"
                                onClick={() => {
                                  if (mitigation?.id) {
                                    // Store this category in the hash
                                    const encoded = encodeURIComponent(
                                      category.id
                                    );
                                    window.location.hash = encoded;
                                    setHashValue("#" + encoded);

                                    // Make sure this category is expanded in the local state
                                    if (
                                      !expandedCategories.includes(category.id)
                                    ) {
                                      setExpandedCategories((prev) => [
                                        ...prev,
                                        category.id,
                                      ]);
                                    }

                                    // Use a small timeout to ensure the hash change is processed
                                    setTimeout(() => {
                                      navigate(
                                        `/organizations/${organizationId}/mitigations/${mitigation.id}`
                                      );
                                    }, 100);
                                  }
                                }}
                              >
                                <td className="w-24 px-4 py-3 align-middle">
                                  <Badge variant="outline" className="text-xs">
                                    {mitigation.importance}
                                  </Badge>
                                </td>
                                <td className="w-24 px-4 py-3 align-middle">
                                  <div className="flex items-center justify-center">
                                    {mitigation.status
                                      ? getStatusIcon(mitigation.status)
                                      : null}
                                  </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                  <div className="font-medium">
                                    {mitigation.name}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
                        No mitigations in this category
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

export default function MitigationListView() {
  const [queryRef, loadQuery] = useQueryLoader<MitigationListViewQueryType>(
    mitigationListViewQuery
  );

  const { organizationId } = useParams();

  useEffect(() => {
    loadQuery({
      organizationId: organizationId!,
      first: 250,
    });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <MitigationListViewSkeleton />;
  }

  return (
    <Suspense fallback={<MitigationListViewSkeleton />}>
      <MitigationListContent queryRef={queryRef} />
    </Suspense>
  );
}
