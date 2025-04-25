import { Suspense, useEffect, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  ConnectionHandler,
} from "react-relay";
import { Link, useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { PolicyListViewQuery as PolicyListViewQueryType } from "./__generated__/PolicyListViewQuery.graphql";
import type { PolicyListViewDeleteMutation } from "./__generated__/PolicyListViewDeleteMutation.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { PolicyListViewSkeleton } from "./PolicyListPage";

const PolicyListViewQuery = graphql`
  query PolicyListViewQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      ... on Organization {
        policies(first: 100) @connection(key: "PolicyListView_policies") {
          edges {
            node {
              id
              name
              content
              createdAt
              updatedAt
              status
            }
          }
        }
      }
    }
  }
`;

const DeletePolicyMutation = graphql`
  mutation PolicyListViewDeleteMutation(
    $input: DeletePolicyInput!
    $connections: [ID!]!
  ) {
    deletePolicy(input: $input) {
      deletedPolicyId @deleteEdge(connections: $connections)
    }
  }
`;

function PolicyTableRow({
  policy,
  organizationId,
}: {
  policy: {
    id: string;
    name: string;
    content?: string;
    status?: string;
    updatedAt: string;
  };
  organizationId: string;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [commitDeleteMutation] = useMutation<PolicyListViewDeleteMutation>(DeletePolicyMutation);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this policy? This action cannot be undone.")) {
      setIsDeleting(true);
      commitDeleteMutation({
        variables: {
          input: {
            policyId: policy.id,
          },
          connections: [
            ConnectionHandler.getConnectionID(
              organizationId,
              "PolicyListView_policies"
            ),
          ],
        },
        onCompleted: (_, errors) => {
          setIsDeleting(false);
          if (errors) {
            console.error("Error deleting policy:", errors);
            toast({
              title: "Error",
              description: "Failed to delete policy. Please try again.",
              variant: "destructive",
            });
            return;
          }
          toast({
            title: "Success",
            description: "Policy deleted successfully.",
          });
        },
        onError: (error) => {
          setIsDeleting(false);
          console.error("Error deleting policy:", error);
          toast({
            title: "Error",
            description: "Failed to delete policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/organizations/${organizationId}/policies/${policy.id}`);
  };

  return (
    <tr 
      className="border-t border-[#ECEFEC] hover:bg-[rgba(5,77,5,0.01)] cursor-pointer"
      onClick={() => {
        navigate(`/organizations/${organizationId}/policies/${policy.id}`);
      }}
    >
      <td className="py-4 px-6">
        <div className="flex flex-col">
          <span className="font-medium text-[#141E12]">{policy.name}</span>
          <span className="text-sm text-[#818780]">
            Description
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-sm text-[#141E12]">Mon, 8 Mar. 2025</span>
      </td>
      <td className="py-4 px-6">
        <Badge
          className="bg-[rgba(5,77,5,0.03)] text-[#6B716A] font-medium border-0 py-0 px-[6px] h-5 text-xs rounded-md"
        >
          Draft
        </Badge>
      </td>
      <td className="py-4 px-6 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function PolicyListViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<PolicyListViewQueryType>;
}) {
  const data = usePreloadedQuery<PolicyListViewQueryType>(
    PolicyListViewQuery,
    queryRef
  );
  const { organizationId } = useParams();
  const policies =
    data.organization.policies?.edges.map((edge) => edge?.node) ?? [];

  return (
    <PageTemplate
      title="Policies"
      actions={
        <Button asChild>
          <Link to={`/organizations/${organizationId}/policies/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Create policy
          </Link>
        </Button>
      }
    >
      {/* Policy table */}
      <div className="rounded-lg border border-[#ECEFEC] overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-white text-left">
              <th className="py-3 px-6 text-xs font-medium text-[#818780] border-b border-[rgba(2,42,2,0.08)]">
                <div className="flex items-center gap-1">
                  Vendor
                  <ChevronDown className="h-3 w-3 text-[#C3C8C2]" />
                </div>
              </th>
              <th className="py-3 px-6 text-xs font-medium text-[#818780] border-b border-[rgba(2,42,2,0.08)]">
                <div className="flex items-center gap-1">
                  Last update
                  <ChevronDown className="h-3 w-3 text-[#C3C8C2]" />
                </div>
              </th>
              <th className="py-3 px-6 text-xs font-medium text-[#818780] border-b border-[rgba(2,42,2,0.08)]">
                <div className="flex items-center gap-1">
                  Status
                  <ChevronDown className="h-3 w-3 text-[#C3C8C2]" />
                </div>
              </th>
              <th className="py-3 px-6 text-right text-xs font-medium text-[#818780] border-b border-[rgba(2,42,2,0.08)]"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {policies.length > 0 ? (
              policies.map((policy) => (
                <PolicyTableRow
                  key={policy.id}
                  policy={policy}
                  organizationId={organizationId!}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="text-lg font-medium">No policies found</h3>
                    <p className="text-[#818780]">
                      Create your first policy to get started
                    </p>
                    <Button asChild>
                      <Link to={`/organizations/${organizationId}/policies/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create policy
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </PageTemplate>
  );
}

export default function PolicyListView() {
  const [queryRef, loadQuery] =
    useQueryLoader<PolicyListViewQueryType>(PolicyListViewQuery);

  const { organizationId } = useParams();

  useEffect(() => {
    loadQuery({ organizationId: organizationId! });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <PolicyListViewSkeleton />;
  }

  return (
    <Suspense fallback={<PolicyListViewSkeleton />}>
      {<PolicyListViewContent queryRef={queryRef} />}
    </Suspense>
  );
}
