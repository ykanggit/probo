import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import { CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Helmet } from "react-helmet-async";
import type { ControlOverviewPageQuery as ControlOverviewPageQueryType } from "./__generated__/ControlOverviewPageQuery.graphql";
import type { ControlOverviewPageUpdateTaskStateMutation as ControlOverviewPageUpdateTaskStateMutationType } from "./__generated__/ControlOverviewPageUpdateTaskStateMutation.graphql";
import type { ControlOverviewPageCreateTaskMutation as ControlOverviewPageCreateTaskMutationType } from "./__generated__/ControlOverviewPageCreateTaskMutation.graphql";

const controlOverviewPageQuery = graphql`
  query ControlOverviewPageQuery($controlId: ID!) {
    control: node(id: $controlId) {
      id
      ... on Control {
        name
        description
        state
        category
        tasks(first: 100) @connection(key: "ControlOverviewPage_tasks") {
          __id
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
      task {
        id
        state
      }
    }
  }
`;

const createTaskMutation = graphql`
  mutation ControlOverviewPageCreateTaskMutation(
    $input: CreateTaskInput!
    $connections: [ID!]!
  ) {
    createTask(input: $input) {
      taskEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          description
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
  const [createTask] =
    useMutation<ControlOverviewPageCreateTaskMutationType>(createTaskMutation);
  const control = data.control;
  const tasks = control?.tasks?.edges.map((edge) => edge?.node) ?? [];

  // State for the create task dialog
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

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
          taskEdge: {
            node: {
              id: taskId,
              state: newState,
            },
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

  const handleCreateTask = () => {
    if (!newTaskName.trim()) {
      toast({
        title: "Error creating task",
        description: "Task name is required",
        variant: "destructive",
      });
      return;
    }

    if (!control?.id) {
      toast({
        title: "Error creating task",
        description: "Control ID is missing",
        variant: "destructive",
      });
      return;
    }

    createTask({
      variables: {
        connections: [`${data.control?.tasks?.__id}`],
        input: {
          controlId: control.id,
          name: newTaskName,
          description: newTaskDescription,
        },
      },
      onCompleted: () => {
        toast({
          title: "Task created",
          description: "New task has been created successfully.",
        });
        setNewTaskName("");
        setNewTaskDescription("");
        setIsCreateTaskOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error creating task",
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to this control. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Task Name
                  </label>
                  <Input
                    id="name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Enter task name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Input
                    id="description"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Enter task description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateTaskOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                  {task?.description && (
                    <p
                      className={`text-xs mt-1 ${
                        task?.state === "DONE"
                          ? "text-gray-400 line-through"
                          : "text-gray-500"
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
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

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks yet. Click &quot;Add Task&quot; to create one.</p>
            </div>
          )}
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
