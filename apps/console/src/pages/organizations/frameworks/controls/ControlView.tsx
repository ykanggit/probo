import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { ControlViewSkeleton } from "./ControlPage";
import { Suspense, useEffect } from "react";
import {
  ControlViewQuery,
  ControlViewQuery$data,
} from "./__generated__/ControlViewQuery.graphql";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { Plus } from "lucide-react";

const controlViewQuery = graphql`
  query ControlViewQuery($controlId: ID!) {
    node(id: $controlId) {
      id
      ... on Control {
        description
        name
        referenceId
      }
    }
  }
`;

export function Control({
  control,
}: {
  control: ControlViewQuery$data["node"];
}) {
  const { organizationId, frameworkId } = useParams<{
    organizationId: string;
    frameworkId: string;
  }>();

  return (
    <div className="w-auto p-5 flex items-start gap-5">
      <div className="font-mono text-lg px-1 py-0.25 rounded-sm bg-lime-3 border border-lime-6 text-lime-11 font-bold">
        {control.referenceId}
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-medium">{control.name}</h2>
        <h3 className="text-xl font-medium text-gray-600 mt-8">
          Security measures
        </h3>
        <p className="mt-4">
          Security measures will be displayed here once connected to this
          control
        </p>
        <div className="mt-2">
          <Button asChild>
            <Link
              to={`/organizations/${organizationId}/frameworks/${frameworkId}/mitigations/create`}
            >
              <Plus className="h-3 w-3 mr-1" />
              Link Security Measures
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ControlViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<ControlViewQuery>;
}) {
  const { node: control } = usePreloadedQuery<ControlViewQuery>(
    controlViewQuery,
    queryRef
  );

  return <Control control={control} />;
}

export default function ControlView({ controlId }: { controlId?: string }) {
  const { controlId: controlIdParam } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<ControlViewQuery>(controlViewQuery);

  useEffect(() => {
    loadQuery({ controlId: (controlId ?? controlIdParam)! });
  }, [loadQuery, controlId, controlIdParam]);

  if (!queryRef) return <ControlViewSkeleton />;

  return (
    <Suspense>
      <ControlViewContent queryRef={queryRef} />
    </Suspense>
  );
}
