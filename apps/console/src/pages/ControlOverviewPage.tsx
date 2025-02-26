import { Suspense, useEffect } from "react";
import { useParams } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { Helmet } from "react-helmet-async";
import type { ControlOverviewPageQuery as ControlOverviewPageQueryType } from "./__generated__/ControlOverviewPageQuery.graphql";
import type { ControlOverviewPageUpdateTaskStateMutation as ControlOverviewPageUpdateTaskStateMutationType } from "./__generated__/ControlOverviewPageUpdateTaskStateMutation.graphql";

const controlOverviewPageQuery = graphql`
  query ControlOverviewPageQuery($controlId: ID!) {
    control: node(id: $controlId) {
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

const updateTaskStateMutation = graphql`
  mutation ControlOverviewPageUpdateTaskStateMutation(
    $input: UpdateTaskStateInput!
  ) {
    updateTaskState(input: $input) {
      taskEdge {
        node {
          id
          state
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
    queryRef
  );
  const { toast } = useToast();
  const [updateTaskState] =
    useMutation<ControlOverviewPageUpdateTaskStateMutationType>(
      updateTaskStateMutation
    );
  const control = data.control;
  const tasks = control?.tasks?.edges.map((edge) => edge?.node) ?? [];

  const handleTaskClick = (taskId: string, currentState: string) => {
    const newState = currentState === "DONE" ? "TODO" : "DONE";

    updateTaskState({
      variables: {
        input: {
          taskId,
          state: newState,
        },
      },
      optimisticResponse: {
        updateTaskState: {
          task: {
            id: taskId,
            state: newState,
          },
        },
      },
      onCompleted: () => {
        toast({
          title: "Task updated",
          description: `Task has been ${
            newState === "DONE" ? "completed" : "reopened"
          }.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{control?.name}</h1>
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
        <p className="text-gray-600 max-w-3xl">{control?.description}</p>
      </div>

      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center border border-gray-200">
              <div
                className={`w-2 h-2 rounded-full ${
                  control?.state === "IMPLEMENTED"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            </div>
            <span className="text-sm text-gray-700">
              {control?.state === "IMPLEMENTED" ? "Validated" : "Not validated"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-6">Tasks</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task?.id}
              className="flex items-center gap-3 py-4 px-2 hover:bg-gray-50 group"
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                  task?.state === "DONE"
                    ? "border-gray-400 bg-gray-100"
                    : "border-gray-300"
                }`}
                onClick={() =>
                  task?.id &&
                  task?.state &&
                  handleTaskClick(task.id, task.state)
                }
              >
                {task?.state === "DONE" && (
                  <CheckCircle2 className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div
                className="flex-1 flex items-center justify-between cursor-pointer"
                onClick={() =>
                  task?.id &&
                  task?.state &&
                  handleTaskClick(task.id, task.state)
                }
              >
                <div>
                  <h3
                    className={`text-sm ${
                      task?.state === "DONE"
                        ? "text-gray-500 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {task?.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-gray-400 text-sm">06.00 - 07.30</div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12h.01M12 6h.01M12 18h.01"
                      />
                    </svg>
                  </button>
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
    controlOverviewPageQuery
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
