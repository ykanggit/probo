import { graphql } from "relay-runtime";
import {
  Card,
  IconPlusLarge,
  Button,
  Tr,
  Td,
  Table,
  Thead,
  Tbody,
  Th,
  IconChevronDown,
  IconTrashCan,
  Badge,
  TrButton,
} from "@probo/ui";
import { useTranslate } from "@probo/i18n";
import type { LinkedAuditsCardFragment$key } from "./__generated__/LinkedAuditsCardFragment.graphql";
import { useFragment } from "react-relay";
import { useMemo, useState } from "react";
import { sprintf, getAuditStateVariant } from "@probo/helpers";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { LinkedAuditsDialog } from "./LinkedAuditsDialog";
import clsx from "clsx";

const linkedAuditFragment = graphql`
  fragment LinkedAuditsCardFragment on Audit {
    id
    name
    createdAt
    state
    validFrom
    validUntil
    framework {
      id
      name
    }
  }
`;

type Mutation<Params> = (p: {
  variables: {
    input: {
      auditId: string;
    } & Params;
    connections: string[];
  };
}) => void;

type Props<Params> = {
  audits: (LinkedAuditsCardFragment$key & { id: string })[];
  params: Params;
  disabled?: boolean;
  connectionId: string;
  onAttach: Mutation<Params>;
  onDetach: Mutation<Params>;
  variant?: "card" | "table";
};

export function LinkedAuditsCard<Params>(props: Props<Params>) {
  const { __ } = useTranslate();
  const [limit, setLimit] = useState<number | null>(4);
  const audits = useMemo(() => {
    return limit ? props.audits.slice(0, limit) : props.audits;
  }, [props.audits, limit]);
  const showMoreButton = limit !== null && props.audits.length > limit;
  const variant = props.variant ?? "table";

  const onAttach = (auditId: string) => {
    props.onAttach({
      variables: {
        input: {
          auditId,
          ...props.params,
        },
        connections: [props.connectionId],
      },
    });
  };

  const onDetach = (auditId: string) => {
    props.onDetach({
      variables: {
        input: {
          auditId,
          ...props.params,
        },
        connections: [props.connectionId],
      },
    });
  };

  const Wrapper = variant === "card" ? Card : "div";

  return (
    <Wrapper padded className="space-y-[10px]">
      {variant === "card" && (
        <div className="flex justify-between">
          <div className="text-lg font-semibold">{__("Audits")}</div>
          <LinkedAuditsDialog
            disabled={props.disabled}
            linkedAudits={props.audits}
            onLink={onAttach}
            onUnlink={onDetach}
          >
            <Button variant="tertiary" icon={IconPlusLarge}>
              {__("Link audit")}
            </Button>
          </LinkedAuditsDialog>
        </div>
      )}
      <Table className={clsx(variant === "card" && "bg-invert")}>
        <Thead>
          <Tr>
            <Th>{__("Name")}</Th>
            <Th>{__("State")}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {audits.length === 0 && (
            <Tr>
              <Td colSpan={3} className="text-center text-txt-secondary">
                {__("No audits linked")}
              </Td>
            </Tr>
          )}
          {audits.map((audit) => (
            <AuditRow
              key={audit.id}
              audit={audit}
              onClick={onDetach}
            />
          ))}
          {variant === "table" && (
            <LinkedAuditsDialog
              disabled={props.disabled}
              linkedAudits={props.audits}
              onLink={onAttach}
              onUnlink={onDetach}
            >
              <TrButton colspan={3} icon={IconPlusLarge}>
                {__("Link audit")}
              </TrButton>
            </LinkedAuditsDialog>
          )}
        </Tbody>
      </Table>
      {showMoreButton && (
        <Button
          variant="tertiary"
          onClick={() => setLimit(null)}
          className="mt-3 mx-auto"
          icon={IconChevronDown}
        >
          {sprintf(__("Show %s more"), props.audits.length - limit)}
        </Button>
      )}
    </Wrapper>
  );
}

function AuditRow(props: {
  audit: LinkedAuditsCardFragment$key & { id: string };
  onClick: (auditId: string) => void;
}) {
  const audit = useFragment(linkedAuditFragment, props.audit);
  const organizationId = useOrganizationId();
  const { __ } = useTranslate();

  return (
    <Tr to={`/organizations/${organizationId}/audits/${audit.id}`}>
      <Td>
        <div className="flex flex-col">
          <div className="font-medium">
            {audit.framework?.name}
          </div>
          {audit.name && (
            <div className="text-sm text-txt-secondary">
              {audit.name}
            </div>
          )}
        </div>
      </Td>
      <Td>
        <Badge color={getAuditStateVariant(audit.state)}>
          {audit.state.replace(/_/g, " ")}
        </Badge>
      </Td>
      <Td noLink width={50} className="text-end">
        <Button
          variant="secondary"
          onClick={() => props.onClick(audit.id)}
          icon={IconTrashCan}
        >
          {__("Unlink")}
        </Button>
      </Td>
    </Tr>
  );
}
