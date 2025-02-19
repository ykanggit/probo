import { Suspense, useEffect } from "react";
import { useParams } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Helmet } from "react-helmet-async";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import type { ControlOverviewPageQuery as ControlOverviewPageQueryType } from "./__generated__/ControlOverviewPageQuery.graphql";
const controlOverviewPageQuery = graphql`
  query ControlOverviewPageQuery($controlId: ID!) {
    node(id: $controlId) {
      id
      ... on Control {
        name
        description
        state
        category
        tasks {
          edges {
            node {
              id
              name
              description
              state
            }
          }
        }
      }
    }
  }
`;

function ControlOverviewPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<ControlOverviewPageQueryType>;
}) {
  const data = usePreloadedQuery<ControlOverviewPageQueryType>(
    controlOverviewPageQuery,
    queryRef,
  );
  const { setBreadcrumbSegment } = useBreadcrumb();
  const control = data.node;
  const tasks = control.tasks?.edges.map((edge) => edge?.node) ?? [];

  useEffect(() => {
    if (control?.name) {
      setBreadcrumbSegment("frameworks/:frameworkId/:controlId", control.name);
    }
  }, [control?.name, setBreadcrumbSegment]);

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{control.name}</h1>
          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              30 min
            </div>
            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Mandatory
            </div>
            <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Assigned to you
            </div>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl">{control.description}</p>
      </div>

      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center border border-gray-200">
              <div
                className={`w-2 h-2 rounded-full ${control.state === "IMPLEMENTED" ? "bg-green-500" : "bg-gray-300"}`}
              />
            </div>
            <span className="text-sm text-gray-700">
              {control.state === "IMPLEMENTED" ? "Validated" : "Not validated"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task?.id}
              className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${task?.state === "DONE" ? "border-green-500 bg-green-50" : "border-gray-300"}`}
              >
                {task?.state === "DONE" && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className={`text-sm font-medium ${task?.state === "DONE" ? "text-gray-500 line-through" : "text-gray-900"}`}
                    >
                      {task?.name}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${task?.state === "DONE" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {task?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${task?.state === "DONE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {task?.state.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlOverviewPageFallback() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="h-4 w-96 bg-gray-100 animate-pulse rounded mt-2" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-6 w-48 bg-gray-100 animate-pulse rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ControlOverviewPage() {
  const { controlId } = useParams();
  const [queryRef, loadQuery] = useQueryLoader<ControlOverviewPageQueryType>(
    controlOverviewPageQuery,
  );

  useEffect(() => {
    loadQuery({ controlId: controlId! });
  }, [loadQuery, controlId]);

  return (
    <>
      <Helmet>
        <title>Control Overview - Probo Console</title>
      </Helmet>
      <Suspense fallback={<ControlOverviewPageFallback />}>
        {queryRef && <ControlOverviewPageContent queryRef={queryRef} />}
      </Suspense>
    </>
  );
}
