import { Suspense, useEffect, useRef, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router";
import type { FrameworkListPageQuery as FrameworkListPageQueryType } from "./__generated__/FrameworkListPageQuery.graphql";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FrameworkListPageImportFrameworkMutation as FrameworkListPageImportFrameworkMutationType } from "./__generated__/FrameworkListPageImportFrameworkMutation.graphql";
import { PageTemplate, PageTemplateSkeleton } from "@/components/PageTemplate";

const FrameworkListPageQuery = graphql`
  query FrameworkListPageQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ... on Organization {
        frameworks(first: 100)
          @connection(key: "FrameworkListPage_frameworks") {
          edges {
            node {
              id
              name
              description
              controls(first: 100) {
                edges {
                  node {
                    id
                    state
                  }
                }
              }
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
`;

const FrameworkListPageImportFrameworkMutation = graphql`
  mutation FrameworkListPageImportFrameworkMutation(
    $input: ImportFrameworkInput!
    $connections: [ID!]!
  ) {
    importFramework(input: $input) {
      frameworkEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          description
          controls(first: 100) {
            edges {
              node {
                id
                state
              }
            }
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;

function FrameworkCard({
  title,
  description,
  icon,
  status,
  progress,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  progress?: string;
}) {
  return (
    <Card className="relative overflow-hidden border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="size-16">{icon}</div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            {status && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                {status}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {progress && (
          <div className="flex items-center gap-2 text-sm">
            <span className="size-2 rounded-full bg-yellow-400" />
            {progress}
          </div>
        )}
      </div>
    </Card>
  );
}

function FrameworkListPageContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkListPageQueryType>;
}) {
  const data = usePreloadedQuery<FrameworkListPageQueryType>(
    FrameworkListPageQuery,
    queryRef
  );
  const { organizationId } = useParams();
  const frameworks =
    data.organization.frameworks?.edges.map((edge) => edge?.node) ?? [];

  const [importFramework] =
    useMutation<FrameworkListPageImportFrameworkMutationType>(
      FrameworkListPageImportFrameworkMutation
    );
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    importFramework({
      variables: {
        connections: [
          ConnectionHandler.getConnectionID(
            organizationId!,
            "FrameworkListPage_frameworks"
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
        setIsUploading(false);
        setIsImportDialogOpen(false);
        toast({
          title: "Framework imported",
          description: "Framework has been imported successfully.",
          variant: "default",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        setIsUploading(false);
        toast({
          title: "Error importing framework",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Frameworks"
      description="Manage your compliance frameworks"
      actions={
        <div className="flex gap-4">
          <Dialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Framework
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Framework</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="framework-file">Upload Framework File</Label>
                  <Input
                    id="framework-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    accept=".json"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a JSON file containing your framework definition.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild>
            <Link to={`/organizations/${organizationId}/frameworks/create`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Framework
            </Link>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {frameworks.map((framework) => {
            const validatedControls = framework.controls.edges.filter(
              (edge) => edge?.node?.state === "IMPLEMENTED"
            ).length;
            const totalControls = framework.controls.edges.length;

            return (
              <Link
                key={framework.id}
                to={`/organizations/${organizationId}/frameworks/${framework.id}`}
              >
                <FrameworkCard
                  title={framework.name}
                  description={framework.description}
                  icon={
                    <div className="flex size-full items-center justify-center rounded-full bg-blue-100">
                      <span className="text-lg font-semibold text-blue-900">
                        {framework.name.split(" ")[0]}
                      </span>
                    </div>
                  }
                  status={
                    validatedControls === totalControls
                      ? "Compliant"
                      : undefined
                  }
                  progress={
                    validatedControls === totalControls
                      ? "All controls validated"
                      : `${validatedControls}/${totalControls} Controls validated`
                  }
                />
              </Link>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}

export function FrameworkListPageSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Frameworks"
      description="Manage your compliance frameworks"
      actions={
        <div className="flex gap-4 w-1/3">
          <div className="bg-muted animate-pulse h-9 w-1/2 rounded-lg" />
          <div className="bg-muted animate-pulse h-9 w-1/2 rounded-lg" />
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-card/50">
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
    </PageTemplateSkeleton>
  );
}

export default function FrameworkListPage() {
  const [queryRef, loadQuery] = useQueryLoader<FrameworkListPageQueryType>(
    FrameworkListPageQuery
  );

  const { organizationId } = useParams();

  useEffect(() => {
    loadQuery({ organizationId: organizationId! });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <FrameworkListPageSkeleton />;
  }

  return (
    <Suspense fallback={<FrameworkListPageSkeleton />}>
      {queryRef && <FrameworkListPageContent queryRef={queryRef} />}
    </Suspense>
  );
}
