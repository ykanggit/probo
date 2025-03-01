import {
  Suspense,
  useEffect,
  useState,
  useRef,
  DragEvent,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
} from "react-relay";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  FileIcon,
  Loader2,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";

import { Helmet } from "react-helmet-async";
import type { ControlOverviewPageQuery as ControlOverviewPageQueryType } from "./__generated__/ControlOverviewPageQuery.graphql";
import type { ControlOverviewPageUpdateTaskStateMutation as ControlOverviewPageUpdateTaskStateMutationType } from "./__generated__/ControlOverviewPageUpdateTaskStateMutation.graphql";
import type { ControlOverviewPageCreateTaskMutation as ControlOverviewPageCreateTaskMutationType } from "./__generated__/ControlOverviewPageCreateTaskMutation.graphql";
import type { ControlOverviewPageDeleteTaskMutation as ControlOverviewPageDeleteTaskMutationType } from "./__generated__/ControlOverviewPageDeleteTaskMutation.graphql";
import type { ControlOverviewPageUploadEvidenceMutation as ControlOverviewPageUploadEvidenceMutationType } from "./__generated__/ControlOverviewPageUploadEvidenceMutation.graphql";

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

const deleteTaskMutation = graphql`
  mutation ControlOverviewPageDeleteTaskMutation(
    $input: DeleteTaskInput!
    $connections: [ID!]!
  ) {
    deleteTask(input: $input) {
      deletedTaskId @deleteEdge(connections: $connections)
    }
  }
`;

const uploadEvidenceMutation = graphql`
  mutation ControlOverviewPageUploadEvidenceMutation(
    $input: UploadEvidenceInput!
    $connections: [ID!]!
  ) {
    uploadEvidence(input: $input) {
      evidenceEdge @appendEdge(connections: $connections) {
        node {
          id
          fileUrl
          mimeType
          size
          state
          createdAt
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
  const { organizationId, frameworkId, controlId } = useParams();
  const navigate = useNavigate();
  const [updateTaskState] =
    useMutation<ControlOverviewPageUpdateTaskStateMutationType>(
      updateTaskStateMutation
    );
  const [createTask] =
    useMutation<ControlOverviewPageCreateTaskMutationType>(createTaskMutation);
  const [deleteTask] =
    useMutation<ControlOverviewPageDeleteTaskMutationType>(deleteTaskMutation);
  const [uploadEvidence] =
    useMutation<ControlOverviewPageUploadEvidenceMutationType>(
      uploadEvidenceMutation
    );
  const control = data.control;
  const tasks = control?.tasks?.edges.map((edge) => edge?.node) ?? [];

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [isUploadEvidenceOpen, setIsUploadEvidenceOpen] = useState(false);
  const [taskForEvidence, setTaskForEvidence] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [evidenceName, setEvidenceName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draggedOverTaskId, setDraggedOverTaskId] = useState<string | null>(
    null
  );
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Get the connection ID for Relay
  const connectionId = useMemo(() => {
    // The connection key is defined in the GraphQL query as "ControlOverviewPage_tasks"
    return control?.id ? `client:${control.id}:tasks{"first":100}` : null;
  }, [control?.id]);

  // Add global drag event handlers to detect when a file is being dragged
  useEffect(() => {
    const handleDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      // Only set to false if we're leaving the window
      if (!e.relatedTarget || (e.relatedTarget as Node).nodeName === "HTML") {
        setIsDraggingFile(false);
      }
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
      setIsDraggingFile(false);
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

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
        connections: [],
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

  const handleDeleteTask = (taskId: string, taskName: string) => {
    setTaskToDelete({ id: taskId, name: taskName });
    setIsDeleteTaskOpen(true);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;

    deleteTask({
      variables: {
        connections: connectionId ? [connectionId] : [],
        input: {
          taskId: taskToDelete.id,
        },
      },
      onCompleted: () => {
        toast({
          title: "Task deleted",
          description: "Task has been deleted successfully.",
        });
        setIsDeleteTaskOpen(false);
        setTaskToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Error deleting task",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleEditControl = () => {
    navigate(
      `/organizations/${organizationId}/frameworks/${frameworkId}/controls/${controlId}/update`
    );
  };

  const handleUploadEvidence = (taskId: string, taskName: string) => {
    setTaskForEvidence({ id: taskId, name: taskName });
    setIsUploadEvidenceOpen(true);
  };

  const confirmUploadEvidence = (event: React.FormEvent) => {
    event.preventDefault();

    if (!taskForEvidence || !fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];

    uploadEvidence({
      variables: {
        input: {
          taskId: taskForEvidence.id,
          name: evidenceName || file.name,
          file: null,
        },
        connections: connectionId ? [connectionId] : [],
      },
      uploadables: {
        "input.file": file,
      },
      onCompleted: () => {
        toast({
          title: "Evidence uploaded",
          description: "Evidence has been uploaded successfully.",
        });
        setIsUploadEvidenceOpen(false);
        setTaskForEvidence(null);
        setEvidenceName("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        toast({
          title: "Error uploading evidence",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedOverTaskId !== taskId) {
      setDraggedOverTaskId(taskId);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverTaskId(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverTaskId(null);
    setIsDraggingFile(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    setUploadingTaskId(taskId);

    // Show toast for upload started
    toast({
      title: "Upload started",
      description: `Uploading ${file.name}...`,
    });

    uploadEvidence({
      variables: {
        input: {
          taskId: taskId,
          name: file.name,
          file: null,
        },
        connections: connectionId ? [connectionId] : [],
      },
      uploadables: {
        "input.file": file,
      },
      onCompleted: () => {
        setUploadingTaskId(null);
        toast({
          title: "Evidence uploaded",
          description: "Evidence has been uploaded successfully.",
        });
      },
      onError: (error) => {
        setUploadingTaskId(null);
        toast({
          title: "Error uploading evidence",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{control?.name || "Control"} - Probo</title>
      </Helmet>
      <div className="min-h-screen bg-white p-6 space-y-6">
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{control?.name}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEditControl}>
                Edit Control
              </Button>
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
              <div
                className={`w-4 h-4 rounded-full bg-white flex items-center justify-center border border-gray-200`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    control?.state === "IMPLEMENTED"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-700">
                {control?.state === "IMPLEMENTED"
                  ? "Validated"
                  : "Not validated"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 flex items-center">
                <FileIcon className="w-4 h-4 mr-1 text-gray-400" />
                <span>Drag & drop files onto tasks to upload evidence</span>
              </div>
              <Dialog
                open={isCreateTaskOpen}
                onOpenChange={setIsCreateTaskOpen}
              >
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
                      Add a new task to this control. Click save when
                      you&apos;re done.
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
                      <label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
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
          </div>
          <div className={`space-y-2 ${isDraggingFile ? "space-y-4" : ""}`}>
            {tasks.map((task) => (
              <div
                key={task?.id}
                className={`flex items-center gap-3 py-4 px-2 hover:bg-gray-50 group relative transition-all duration-200 ${
                  isDraggingFile && draggedOverTaskId !== task?.id
                    ? "border border-dashed border-blue-300 rounded-md bg-blue-50 bg-opacity-30"
                    : ""
                } ${
                  draggedOverTaskId === task?.id
                    ? "bg-blue-50 border-2 border-blue-400 shadow-md rounded-md"
                    : ""
                }`}
                onDragOver={(e) => task?.id && handleDragOver(e, task.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => task?.id && handleDrop(e, task.id)}
              >
                {isDraggingFile && draggedOverTaskId !== task?.id && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md z-10">
                    <div className="flex items-center gap-2 text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                      <FileIcon className="w-4 h-4" />
                      <p className="text-sm font-medium">Drop file here</p>
                    </div>
                  </div>
                )}

                {draggedOverTaskId === task?.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-80 rounded-md z-10 backdrop-blur-[1px]">
                    <div className="flex flex-col items-center gap-2 text-blue-600 bg-white p-4 rounded-lg shadow-sm">
                      <FileIcon className="w-12 h-12" />
                      <p className="font-medium">
                        Drop file to upload evidence
                      </p>
                    </div>
                  </div>
                )}

                {uploadingTaskId === task?.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-md z-10">
                    <div className="flex flex-col items-center gap-2 text-blue-600">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="font-medium">Uploading evidence...</p>
                    </div>
                  </div>
                )}

                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                    task?.state === "DONE"
                      ? "border-gray-400 bg-gray-100"
                      : "border-gray-300"
                  } ${isDraggingFile ? "opacity-50" : ""}`}
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
                  className={`flex-1 flex items-center justify-between cursor-pointer ${
                    isDraggingFile ? "opacity-50" : ""
                  }`}
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
                    <button
                      className="text-gray-400 hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task?.id && task?.name) {
                          handleUploadEvidence(task.id, task.name);
                        }
                      }}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task?.id && task?.name) {
                          handleDeleteTask(task.id, task.name);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
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

        {/* Delete Task Confirmation Dialog */}
        <Dialog open={isDeleteTaskOpen} onOpenChange={setIsDeleteTaskOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the task &quot;
                {taskToDelete?.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteTaskOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteTask}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Evidence Dialog */}
        <Dialog
          open={isUploadEvidenceOpen}
          onOpenChange={setIsUploadEvidenceOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Evidence</DialogTitle>
              <DialogDescription>
                Upload evidence for the task &quot;{taskForEvidence?.name}
                &quot;.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={confirmUploadEvidence}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="evidence-name">
                    Evidence Name (Optional)
                  </Label>
                  <Input
                    id="evidence-name"
                    placeholder="Enter a name for this evidence"
                    value={evidenceName}
                    onChange={(e) => setEvidenceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidence-file">File</Label>
                  <Input
                    id="evidence-file"
                    type="file"
                    ref={fileInputRef}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsUploadEvidenceOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
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
    if (controlId) {
      loadQuery({ controlId });
    }
  }, [controlId, loadQuery]);

  if (!queryRef) {
    return <ControlOverviewPageFallback />;
  }

  return (
    <Suspense fallback={<ControlOverviewPageFallback />}>
      <ControlOverviewPageContent queryRef={queryRef} />
    </Suspense>
  );
}
