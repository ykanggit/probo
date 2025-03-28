import { graphql, useFragment } from "react-relay";
import { ControlList_List$key } from "./__generated__/ControlList_List.graphql";
import { NavLink, useParams } from "react-router";
import { cn } from "@/lib/utils";

export const controlListFragment = graphql`
  fragment ControlList_List on Framework {
    controls(first: 100, orderBy: { field: CREATED_AT, direction: ASC })
      @connection(key: "FrameworkView_controls") {
      edges {
        node {
          id
          referenceId
          name
        }
      }
    }
  }
`;

interface ControlListProps {
  fragmentKey: ControlList_List$key;
}

export function ControlList(props: ControlListProps) {
  const { organizationId, frameworkId, controlId } = useParams<{
    organizationId: string;
    frameworkId: string;
    controlId?: string;
  }>();
  const { fragmentKey } = props;
  const { controls } = useFragment<ControlList_List$key>(
    controlListFragment,
    fragmentKey
  );

  if (controls.edges.length === 0) {
    return "No controls available for this framework";
  }

  return (
    <aside className="shrink-0 w-70 border-r border-gray-100 h-full overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-xs">
      {controls.edges.map(({ node: control }, i) => (
        <NavLink
          key={control.id}
          to={`/organizations/${organizationId}/frameworks/${frameworkId}/controls/${control.id}`}
          className={({ isActive }) =>
            cn(
              "block pl-8 pr-4 py-4 hover:bg-gray-50 border-b border-gray-100",
              (isActive || (i === 0 && !controlId)) && "bg-gray-50"
            )
          }
        >
          {({ isActive }) => {
            return (
              <>
                <div
                  className={cn(
                    "inline-block font-mono text-sm px-1 py-0.25 rounded-sm bg-lime-2 border border-lime-4 text-lime-9 font-semibold",
                    isActive && "font-bold bg-lime-3 border-lime-6 text-lime-11"
                  )}
                >
                  {control.referenceId}
                </div>
                <div
                  className={cn(
                    "text-sm leading-none break-words mt-2",
                    isActive && "font-medium"
                  )}
                >
                  {control.name}
                </div>
              </>
            );
          }}
        </NavLink>
      ))}
    </aside>
  );
}
