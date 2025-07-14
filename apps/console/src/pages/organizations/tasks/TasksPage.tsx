import { Button, IconPlusLarge, PageHeader } from "@probo/ui";
import {
  usePreloadedQuery,
  usePaginationFragment,
  type PreloadedQuery,
} from "react-relay";
import { graphql } from "relay-runtime";
import type { TaskGraphQuery } from "/hooks/graph/__generated__/TaskGraphQuery.graphql";
import { useTranslate } from "@probo/i18n";
import type { TasksPageFragment$key } from "./__generated__/TasksPageFragment.graphql";
import { tasksQuery } from "/hooks/graph/TaskGraph";
import { usePageTitle } from "@probo/hooks";
import TasksCard from "/components/tasks/TasksCard";
import TaskFormDialog from "/components/tasks/TaskFormDialog";

const tasksFragment = graphql`
  fragment TasksPageFragment on Organization
  @refetchable(queryName: "TasksPageFragment_query")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 50 }
    order: { type: "TaskOrder", defaultValue: null }
    after: { type: "CursorKey", defaultValue: null }
    before: { type: "CursorKey", defaultValue: null }
    last: { type: "Int", defaultValue: null }
  ) {
    tasks(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $order
    ) @connection(key: "TasksPageFragment_tasks") {
      __id
      totalCount
      todoCount
      doneCount
      edges {
        node {
          id
          name
          state
          description
          ...TaskFormDialogFragment
          measure {
            id
            name
          }
          assignedTo {
            id
            fullName
          }
        }
      }
    }
  }
`;

interface Props {
  queryRef: PreloadedQuery<TaskGraphQuery>;
}

export default function TasksPage({ queryRef }: Props) {
  const { __ } = useTranslate();
  const query = usePreloadedQuery(tasksQuery, queryRef);
  const pagination = usePaginationFragment(
    tasksFragment,
    query.organization as TasksPageFragment$key
  );
  const tasks = pagination.data.tasks?.edges.map((edge) => edge.node);
  const connectionId = pagination.data.tasks.__id;
  const totalCount = pagination.data.tasks?.totalCount ?? 0;
  const todoCount = pagination.data.tasks?.todoCount ?? 0;
  const doneCount = pagination.data.tasks?.doneCount ?? 0;

  usePageTitle(__("Tasks"));

  return (
    <div className="space-y-6">
      <PageHeader
        title={__("Tasks")}
        description={__(
          "Track your assigned compliance tasks and keep progress on track."
        )}
      >
        <TaskFormDialog connection={connectionId}>
          <Button icon={IconPlusLarge}>{__("New task")}</Button>
        </TaskFormDialog>
      </PageHeader>
      <TasksCard 
        connectionId={connectionId} 
        tasks={tasks ?? []} 
        totalCount={totalCount}
        todoCount={todoCount}
        doneCount={doneCount}
        hasNext={pagination.hasNext}
        loadNext={pagination.loadNext}
        isLoadingNext={pagination.isLoadingNext}
      />
    </div>
  );
}
