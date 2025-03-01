import {
  Suspense,
  useEffect,
  useState,
  useRef,
  DragEvent,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  fetchQuery,
  useRelayEnvironment,
} from "react-relay";
import {
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  FileIcon,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  File as FileGeneric,
  FileText,
  Image,
  X,
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
import type { ControlOverviewPageDeleteEvidenceMutation as ControlOverviewPageDeleteEvidenceMutationType } from "./__generated__/ControlOverviewPageDeleteEvidenceMutation.graphql";

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
              evidences(first: 50)
                @connection(key: "ControlOverviewPage_evidences") {
                __id
                edges {
                  node {
                    id
                    mimeType
                    filename
                    size
                    state
                    createdAt
                  }
                }
              }
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

const deleteEvidenceMutation = graphql`
  mutation ControlOverviewPageDeleteEvidenceMutation(
    $input: DeleteEvidenceInput!
    $connections: [ID!]!
  ) {
    deleteEvidence(input: $input) {
      deletedEvidenceId @deleteEdge(connections: $connections)
    }
  }
`;

// Add a GraphQL query to fetch the fileUrl for an evidence item
const getEvidenceFileUrlQuery = graphql`
  query ControlOverviewPageGetEvidenceFileUrlQuery($evidenceId: ID!) {
    node(id: $evidenceId) {
      ... on Evidence {
        id
        fileUrl
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
  const environment = useRelayEnvironment();
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
  const [deleteEvidence] =
    useMutation<ControlOverviewPageDeleteEvidenceMutationType>(
      deleteEvidenceMutation
    );

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

  // State to track which task's evidence list is expanded
  const [expandedEvidenceTaskId, setExpandedEvidenceTaskId] = useState<
    string | null
  >(null);

  // Add state for the preview modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewEvidence, setPreviewEvidence] = useState<{
    id: string;
    filename: string;
    mimeType: string;
    fileUrl?: string;
  } | null>(null);
  const [isLoadingFileUrl, setIsLoadingFileUrl] = useState(false);

  const [isDeleteEvidenceOpen, setIsDeleteEvidenceOpen] = useState(false);
  const [evidenceToDelete, setEvidenceToDelete] = useState<{
    id: string;
    filename: string;
    taskId: string;
  } | null>(null);

  const tasks = data.control.tasks?.edges.map((edge) => edge.node) || [];

  const getEvidenceConnectionId = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task?.evidences?.__id) {
        return task.evidences.__id;
      }
      return null;
    },
    [tasks]
  );

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

  const handleCreateTask = () => {
    if (!newTaskName.trim()) {
      toast({
        title: "Error creating task",
        description: "Task name is required",
        variant: "destructive",
      });
      return;
    }

    if (!data.control.id) {
      toast({
        title: "Error creating task",
        description: "Control ID is missing",
        variant: "destructive",
      });
      return;
    }

    createTask({
      variables: {
        connections: [`${data.control.tasks?.__id}`],
        input: {
          controlId: data.control.id,
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
        connections: [`${data.control.tasks?.__id}`],
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

    // Get the evidence connection ID for this task
    const evidenceConnectionId = getEvidenceConnectionId(taskForEvidence.id);

    uploadEvidence({
      variables: {
        input: {
          taskId: taskForEvidence.id,
          name: evidenceName || file.name,
          file: null,
        },
        connections: evidenceConnectionId ? [evidenceConnectionId] : [],
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

    // Get the evidence connection ID for this task
    const evidenceConnectionId = getEvidenceConnectionId(taskId);

    uploadEvidence({
      variables: {
        input: {
          taskId: taskId,
          name: file.name,
          file: null,
        },
        connections: evidenceConnectionId ? [evidenceConnectionId] : [],
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

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to toggle evidence list expansion
  const toggleEvidenceList = (taskId: string) => {
    if (expandedEvidenceTaskId === taskId) {
      setExpandedEvidenceTaskId(null);
    } else {
      setExpandedEvidenceTaskId(taskId);
    }
  };

  // Function to get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (mimeType.includes("pdf")) {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      return <FileText className="w-4 h-4 text-green-600" />;
    } else {
      return <FileGeneric className="w-4 h-4 text-gray-500" />;
    }
  };

  // Simplified preview handler that opens the modal and sets the evidence
  const handlePreviewEvidence = (evidence: {
    id: string;
    filename: string;
    mimeType: string;
  }) => {
    setPreviewEvidence({
      id: evidence.id,
      filename: evidence.filename,
      mimeType: evidence.mimeType,
    });
    setIsPreviewModalOpen(true);
    setIsLoadingFileUrl(true);
    fetchQuery(environment, getEvidenceFileUrlQuery, {
      evidenceId: evidence.id,
    })
      .toPromise()
      .then((response) => {
        const data = response as { node?: { id: string; fileUrl?: string } };

        if (data?.node?.fileUrl) {
          setPreviewEvidence((prev) => {
            if (!prev) return null;
            return { ...prev, fileUrl: data.node!.fileUrl };
          });
        } else {
          throw new Error("File URL not available in response");
        }
      })
      .catch((error) => {
        console.error("Error fetching file URL:", error);
        toast({
          title: "Error fetching file URL",
          description: error.message || "Could not load the file preview",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingFileUrl(false);
      });
  };

  const handleDeleteEvidence = (
    evidenceId: string,
    filename: string,
    taskId: string
  ) => {
    setEvidenceToDelete({ id: evidenceId, filename, taskId });
    setIsDeleteEvidenceOpen(true);
  };

  const confirmDeleteEvidence = () => {
    if (!evidenceToDelete) return;

    const evidenceConnectionId = getEvidenceConnectionId(
      evidenceToDelete.taskId
    );

    deleteEvidence({
      variables: {
        input: {
          evidenceId: evidenceToDelete.id,
        },
        connections: evidenceConnectionId ? [evidenceConnectionId] : [],
      },
      onCompleted: () => {
        toast({
          title: "Evidence deleted",
          description: "Evidence has been deleted successfully.",
        });
        setIsDeleteEvidenceOpen(false);
        setEvidenceToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Error deleting evidence",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>{data.control.name || "Control"} - Probo</title>
      </Helmet>
      <div className="min-h-screen bg-white p-6 space-y-6">
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{data.control.name}</h1>
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
          <p className="text-gray-600 max-w-3xl">{data.control.description}</p>
        </div>

        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-4 h-4 rounded-full bg-white flex items-center justify-center border border-gray-200`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    data.control.state === "IMPLEMENTED"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-700">
                {data.control.state === "IMPLEMENTED"
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
                className="rounded-md overflow-hidden border border-gray-200"
              >
                <div
                  className={`flex items-center gap-3 py-4 px-2 hover:bg-gray-50 group relative transition-all duration-200 ${
                    isDraggingFile && draggedOverTaskId !== task?.id
                      ? "border-dashed border-blue-300 bg-blue-50 bg-opacity-30"
                      : ""
                  } ${
                    draggedOverTaskId === task?.id
                      ? "bg-blue-50 border-2 border-blue-400 shadow-md"
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

                {/* Evidence section */}
                {task?.evidences?.edges && task.evidences.edges.length > 0 && (
                  <>
                    <div
                      className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                      onClick={() => task.id && toggleEvidenceList(task.id)}
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">
                          {task.evidences.edges.length}{" "}
                          {task.evidences.edges.length === 1
                            ? "Evidence"
                            : "Evidences"}
                        </span>
                      </div>
                      {expandedEvidenceTaskId === task.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    {expandedEvidenceTaskId === task.id && (
                      <div className="bg-white border-t border-gray-200 p-3 space-y-2">
                        {task.evidences.edges.map((edge) => {
                          if (!edge) return null;
                          const evidence = edge.node;
                          if (!evidence) return null;

                          return (
                            <div
                              key={evidence.id}
                              className="flex items-center justify-between p-2 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {getFileIcon(evidence.mimeType)}
                                <div>
                                  <div className="text-sm font-medium text-gray-700">
                                    {evidence.filename}
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <span>{formatFileSize(evidence.size)}</span>
                                    <span>•</span>
                                    <span>
                                      {formatDate(evidence.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {evidence.mimeType.startsWith("image/") ? (
                                  <button
                                    onClick={() =>
                                      handlePreviewEvidence(evidence)
                                    }
                                    className="p-1 rounded-full hover:bg-gray-100"
                                    title="Preview Image"
                                  >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handlePreviewEvidence(evidence);
                                    }}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                    title="View File"
                                  >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePreviewEvidence(evidence);
                                  }}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteEvidence(
                                      evidence.id,
                                      evidence.filename,
                                      task.id
                                    );
                                  }}
                                  className="p-1 rounded-full hover:bg-gray-100 hover:bg-red-50 hover:text-red-600"
                                  title="Delete Evidence"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
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

        {/* Add the Preview Modal */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{previewEvidence?.filename}</span>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </DialogTitle>
              <DialogDescription>
                Preview of the evidence file. You can view or download the file
                from here.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-md p-4">
              {isLoadingFileUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-gray-500">Loading preview...</p>
                </div>
              ) : previewEvidence?.fileUrl ? (
                previewEvidence.mimeType.startsWith("image/") ? (
                  <img
                    src={previewEvidence.fileUrl}
                    alt={previewEvidence.filename}
                    className="max-h-[70vh] object-contain"
                  />
                ) : previewEvidence.mimeType.includes("pdf") ? (
                  <iframe
                    src={previewEvidence.fileUrl}
                    className="w-full h-[70vh]"
                    title={previewEvidence.filename}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <FileGeneric className="w-16 h-16 text-gray-400" />
                    <p className="text-gray-600">
                      Preview not available for this file type
                    </p>
                    <Button
                      onClick={() => {
                        if (previewEvidence?.fileUrl) {
                          window.open(previewEvidence.fileUrl, "_blank");
                        }
                      }}
                    >
                      Download File
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileGeneric className="w-12 h-12 text-gray-400" />
                  <p className="text-gray-500">Failed to load preview</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPreviewModalOpen(false)}
              >
                Close
              </Button>
              {previewEvidence?.fileUrl && (
                <Button
                  onClick={() => {
                    if (previewEvidence?.fileUrl) {
                      window.open(previewEvidence.fileUrl, "_blank");
                    }
                  }}
                >
                  Download
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Delete Evidence Confirmation Dialog */}
        <Dialog
          open={isDeleteEvidenceOpen}
          onOpenChange={setIsDeleteEvidenceOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Evidence</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the evidence &quot;
                {evidenceToDelete?.filename}&quot;? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteEvidenceOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteEvidence}>
                Delete
              </Button>
            </DialogFooter>
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
