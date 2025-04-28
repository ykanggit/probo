import { Suspense, useEffect, useState, useRef } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { useParams, Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { PageTemplate } from "@/components/PageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MesureListViewQuery as MesureListViewQueryType } from "./__generated__/MesureListViewQuery.graphql";
import { MesureListViewSkeleton } from "./MesureListPage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MesureListViewImportMesureMutation as MesureListViewImportMesureMutationType } from "./__generated__/MesureListViewImportMesureMutation.graphql";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mesureListViewQuery = graphql`
  query MesureListViewQuery($organizationId: ID!, $first: Int) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        mesures(first: $first) @connection(key: "MesureListView_mesures") {
          edges {
            node {
              id
              name
              description
              category
              state
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

const importMesureMutation = graphql`
  mutation MesureListViewImportMesureMutation(
    $input: ImportMesureInput!
    $connections: [ID!]!
  ) {
    importMesure(input: $input) {
      mesureEdges @appendEdge(connections: $connections) {
        node {
          id
          name
          description
          category
          state
          createdAt
          updatedAt
        }
      }
    }
  }
`;

interface Mesure {
  id?: string;
  name?: string;
  description?: string;
  state?: string;
  category?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  progress: number;
  mesures: Mesure[];
  doneCount: number;
  totalCount: number;
}

interface OrganizationData {
  organization: {
    id: string;
    mesures?: {
      edges: Array<{
        node: Mesure;
      }>;
    };
  };
}

function MesureListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<MesureListViewQueryType>;
}) {
  const data = usePreloadedQuery<MesureListViewQueryType>(
    mesureListViewQuery,
    queryRef
  ) as unknown as OrganizationData;

  const { organizationId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const [importMesure] =
    useMutation<MesureListViewImportMesureMutationType>(importMesureMutation);

  // Monitor URL hash for changes and update state accordingly
  const [initialHashCategory] = useState(() =>
    window.location.hash.substring(1)
      ? decodeURIComponent(window.location.hash.substring(1))
      : ""
  );

  // Keep track of manually expanded categories
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
    return initialHashCategory ? [initialHashCategory] : [];
  });

  // Scroll to expanded category when page loads with a category in the fragment
  useEffect(() => {
    if (initialHashCategory) {
      // Small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        const element = document.getElementById(initialHashCategory);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [initialHashCategory]);

  // Listen for hash changes (like when using back button)
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.substring(1)
        ? decodeURIComponent(window.location.hash.substring(1))
        : "";
      if (newHash && !expandedCategories.includes(newHash)) {
        setExpandedCategories((prev) => [...prev, newHash]);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [expandedCategories]);

  const mesures =
    data.organization.mesures?.edges.map((edge) => edge.node) ?? [];

  // Map mesure state to status for the new design
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

  const processedMesures = mesures.map((mesure: Mesure) => ({
    ...mesure,
    status: mapStateToStatus(mesure.state),
  }));

  // Calculate global progress
  const implementedCount = processedMesures.filter(
    (mesure: Mesure) => mesure.status === "complete"
  ).length;
  const notApplicableCount = processedMesures.filter(
    (mesure: Mesure) => mesure.status === "not-applicable"
  ).length;
  const totalMesures = processedMesures.length;

  // Include not-applicable as effectively "complete" for progress percentage
  const effectiveCompletedCount = implementedCount + notApplicableCount;
  const globalProgress = totalMesures
    ? Math.round((effectiveCompletedCount / totalMesures) * 100)
    : 0;

  // Get global status counts
  const globalStatusCounts = processedMesures.reduce(
    (acc: Record<string, number>, mesure: Mesure) => {
      if (mesure.status) {
        acc[mesure.status] = (acc[mesure.status] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Group mesures by category
  const mesuresByCategory = processedMesures.reduce(
    (acc: Record<string, Mesure[]>, mesure: Mesure) => {
      if (!mesure?.category) return acc;
      if (!acc[mesure.category]) {
        acc[mesure.category] = [];
      }
      acc[mesure.category].push(mesure);
      return acc;
    },
    {} as Record<string, Mesure[]>
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

  const categories: Category[] = Object.entries(mesuresByCategory)
    .map(([categoryName, categoryMesures]: [string, Mesure[]]) => {
      const catImplementedCount = categoryMesures.filter(
        (mesure) => mesure.status === "complete"
      ).length;
      const catNotApplicableCount = categoryMesures.filter(
        (mesure) => mesure.status === "not-applicable"
      ).length;
      // Consider both "complete" and "not-applicable" as done for category progress
      const catDoneCount = catImplementedCount + catNotApplicableCount;
      const catTotalCount = categoryMesures.length;
      const progress = catTotalCount
        ? Math.round((catDoneCount / catTotalCount) * 100)
        : 0;

      return {
        id: categoryName,
        name: categoryName,
        description: `Mesures related to ${categoryName.toLowerCase()}`,
        progress: progress,
        mesures: categoryMesures.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        ),
        doneCount: catDoneCount,
        totalCount: catTotalCount,
      };
    })
    .filter((category) => category.mesures.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-info" />;
      case "not-started":
        return <AlertCircle className="h-5 w-5 text-disabled" />;
      case "incomplete":
        return <AlertCircle className="h-5 w-5 text-danger" />;
      case "not-applicable":
        return <X className="h-5 w-5 text-quaternary" />;
      default:
        return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    importMesure({
      variables: {
        connections: [
          ConnectionHandler.getConnectionID(
            data.organization.id,
            "MesureListView_mesures"
          ),
        ],
        input: {
          organizationId: organizationId!,
          file: null,
        },
      },
      uploadables: {
        "input.file": file,
      },
      onCompleted: () => {
        setIsImporting(false);
        toast({
          title: "Mesures imported",
          description: "Mesures have been imported successfully.",
          variant: "default",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        setIsImporting(false);
        toast({
          title: "Error importing mesures",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Mesures"
      description="Mesures are actions taken to reduce the risk. Add them to track their implementation status."
      actions={
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
          >
            {isImporting ? "Importing..." : "Import Mesures"}
          </Button>
          <Button asChild>
            <Link to={`/organizations/${organizationId}/mesures/new`}>
              New Mesure
            </Link>
          </Button>
        </div>
      }
    >
      {/* Hidden file input for mesure import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".json"
      />

      {/* Global Progress Summary */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-medium">Mesure Implementation</h3>
          <span className="text-sm text-tertiary">
            {globalProgress}% complete
          </span>
        </div>

        {/* Progress bar container */}
        <div className="w-full h-5 rounded-full overflow-hidden bg-subtle-bg mb-2">
          {/* Segmented progress bar */}
          <div className="flex h-full">
            {/* Complete segment */}
            {globalStatusCounts.complete > 0 && (
              <div
                className="bg-green-500 h-full"
                style={{
                  width: `${
                    (globalStatusCounts.complete / totalMesures) * 100
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
                    (globalStatusCounts["in-progress"] / totalMesures) * 100
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
                    (globalStatusCounts.incomplete / totalMesures) * 100
                  }%`,
                }}
              />
            )}
            {/* Not applicable segment */}
            {globalStatusCounts["not-applicable"] > 0 && (
              <div
                className="bg-primary-bg h-full"
                style={{
                  width: `${
                    (globalStatusCounts["not-applicable"] / totalMesures) * 100
                  }%`,
                }}
              />
            )}
            {/* Not started segment */}
            {globalStatusCounts["not-started"] > 0 && (
              <div
                className="bg-secondary h-full"
                style={{
                  width: `${
                    (globalStatusCounts["not-started"] / totalMesures) * 100
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
            <div className="flex items-center gap-1.5 text-tertiary">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>
                Not Applicable ({globalStatusCounts["not-applicable"]})
              </span>
            </div>
          )}
          {globalStatusCounts["not-started"] > 0 && (
            <div className="flex items-center gap-1.5 text-tertiary">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
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
              id={category.id}
              className="border rounded-lg overflow-hidden"
            >
              <Card className="border-0 shadow-none">
                <CardHeader
                  className="bg-subtle-bg/50 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-tertiary">
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
                    {category.mesures.length > 0 ? (
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-subtle-bg/30 text-sm font-medium text-tertiary">
                              <th className="w-24 px-4 py-2 text-left">
                                Status
                              </th>
                              <th className="px-4 py-2 text-left">Mesure</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {category.mesures.map((mesure) => (
                              <tr
                                key={mesure.id || Math.random().toString()}
                                className="hover:bg-h-subtle-bg cursor-pointer"
                              >
                                <td className="w-24 px-4 py-3 align-middle">
                                  <div className="flex items-center justify-center">
                                    {mesure.status
                                      ? getStatusIcon(mesure.status)
                                      : null}
                                  </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                  <div className="flex items-center gap-3">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Link
                                            to={`/organizations/${organizationId}/mesures/${mesure.id}`}
                                            className="font-medium group flex items-center relative"
                                          >
                                            <span className="mr-1">
                                              {mesure.name}
                                            </span>
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-bg scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                                          </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          <p className="text-xs">
                                            Click to view details
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    {/* Enhanced popover for description info */}
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="p-0 h-6 w-6 rounded-full hover:bg-primary-bg"
                                          aria-label="Learn more about this mesure"
                                        >
                                          <HelpCircle className="h-5 w-5 text-primary hover:text-primary" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-80 p-4 shadow-md"
                                        align="start"
                                        sideOffset={5}
                                      >
                                        <div className="space-y-3">
                                          <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-md">
                                              {mesure.name}
                                            </h4>
                                          </div>

                                          {mesure.description && (
                                            <div className="text-sm">
                                              <p className="font-semibold mb-1">
                                                Why is this important:
                                              </p>
                                              <p>
                                                {mesure.description.startsWith(
                                                  "##"
                                                )
                                                  ? mesure.description
                                                      .split("\n")
                                                      .find((line) =>
                                                        line.startsWith(
                                                          "## Why"
                                                        )
                                                      )
                                                      ?.replace("## Why?", "")
                                                      ?.replace("## Why", "")
                                                      ?.trim() ||
                                                    mesure.description.split(
                                                      "\n"
                                                    )[1] ||
                                                    ""
                                                  : mesure.description.substring(
                                                      0,
                                                      180
                                                    ) +
                                                    (mesure.description.length >
                                                    180
                                                      ? "..."
                                                      : "")}
                                              </p>
                                            </div>
                                          )}

                                          <div className="pt-2 flex justify-end">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-xs gap-1"
                                              asChild
                                            >
                                              <Link
                                                to={`/organizations/${organizationId}/mesures/${mesure.id}`}
                                              >
                                                <span>
                                                  Implementation guide
                                                </span>
                                                <ExternalLink className="h-3 w-3" />
                                              </Link>
                                            </Button>
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6 text-center text-tertiary">
                        No mesures in this category
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

export default function MesureListView() {
  const [queryRef, loadQuery] =
    useQueryLoader<MesureListViewQueryType>(mesureListViewQuery);

  const { organizationId } = useParams();

  useEffect(() => {
    loadQuery({
      organizationId: organizationId!,
      first: 250,
    });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <MesureListViewSkeleton />;
  }

  return (
    <Suspense fallback={<MesureListViewSkeleton />}>
      <MesureListContent queryRef={queryRef} />
    </Suspense>
  );
}
