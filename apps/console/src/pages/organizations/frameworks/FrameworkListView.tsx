import { Suspense, useEffect, useRef, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { Card } from "@/components/ui/card";
import { Link, useParams } from "react-router";
import type { FrameworkListViewQuery as FrameworkListViewQueryType } from "./__generated__/FrameworkListViewQuery.graphql";
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
import { FrameworkListViewImportFrameworkMutation as FrameworkListViewImportFrameworkMutationType } from "./__generated__/FrameworkListViewImportFrameworkMutation.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { FrameworkListViewSkeleton } from "./FrameworkListPage";

const FrameworkListViewQuery = graphql`
  query FrameworkListViewQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ... on Organization {
        frameworks(first: 100)
          @connection(key: "FrameworkListView_frameworks") {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const FrameworkListViewImportFrameworkMutation = graphql`
  mutation FrameworkListViewImportFrameworkMutation(
    $input: ImportFrameworkInput!
    $connections: [ID!]!
  ) {
    importFramework(input: $input) {
      frameworkEdge @prependEdge(connections: $connections) {
        node {
          id
          name
        }
      }
    }
  }
`;

function FrameworkListViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<FrameworkListViewQueryType>;
}) {
  const data = usePreloadedQuery<FrameworkListViewQueryType>(
    FrameworkListViewQuery,
    queryRef
  );
  const { organizationId } = useParams();
  const frameworks =
    data.organization.frameworks?.edges.map((edge) => edge?.node) ?? [];

  const [importFramework] =
    useMutation<FrameworkListViewImportFrameworkMutationType>(
      FrameworkListViewImportFrameworkMutation
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
            "FrameworkListView_frameworks"
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
        <Card>
          <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <tbody className="[&_tr:last-child]:border-0">
                {frameworks.length === 0 ? (
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td
                      colSpan={4}
                      className="text-center p-4 align-middle text-muted-foreground"
                    >
                      No frameworks found. Create or import one to get started.
                    </td>
                  </tr>
                ) : (
                  frameworks.map((framework) => (
                    <tr
                      key={framework.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                    >
                      <td className="p-4 align-middle">
                        <Link
                          to={`/organizations/${organizationId}/frameworks/${framework.id}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {framework.name}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageTemplate>
  );
}

export default function FrameworkListView() {
  const [queryRef, loadQuery] = useQueryLoader<FrameworkListViewQueryType>(
    FrameworkListViewQuery
  );

  const { organizationId } = useParams();

  useEffect(() => {
    loadQuery({ organizationId: organizationId! });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <FrameworkListViewSkeleton />;
  }

  return (
    <Suspense fallback={<FrameworkListViewSkeleton />}>
      {queryRef && <FrameworkListViewContent queryRef={queryRef} />}
    </Suspense>
  );
}
