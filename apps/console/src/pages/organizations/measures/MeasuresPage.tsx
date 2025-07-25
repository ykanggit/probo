import type { MeasureGraphListQuery } from "/hooks/graph/__generated__/MeasureGraphListQuery.graphql";
import {
  usePreloadedQuery,
  type PreloadedQuery,
  usePaginationFragment,
} from "react-relay";
import { useTranslate } from "@probo/i18n";
import {
  ActionDropdown,
  Button,
  Card,
  DropdownItem,
  FileButton,
  IconChevronDown,
  IconChevronUp,
  IconFolderUpload,
  IconPencil,
  IconPlusLarge,
  IconTrashCan,
  IconListStack,
  IconDotGrid1x3Horizontal,
  IconUpload,
  MeasureBadge,
  MeasureImplementation,
  PageHeader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useConfirm,
  useDialogRef,
  InfiniteScrollTrigger,
} from "@probo/ui";
import {
  measuresQuery,
  useDeleteMeasureMutation,
} from "/hooks/graph/MeasureGraph";
import { graphql } from "relay-runtime";
import type {
  MeasuresPageFragment$data,
  MeasuresPageFragment$key,
} from "./__generated__/MeasuresPageFragment.graphql";
import { groupBy, objectKeys, slugify, sprintf } from "@probo/helpers";
import { useMemo, useRef, useState, type ChangeEventHandler } from "react";
import type { NodeOf } from "/types";
import type { MeasuresPageImportMutation } from "./__generated__/MeasuresPageImportMutation.graphql";
import { useMutationWithToasts } from "/hooks/useMutationWithToasts";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { Link, useParams } from "react-router";
import MeasureFormDialog from "./dialog/MeasureFormDialog";
import ExportMeasuresDialog from "./dialog/ExportMeasuresDialog";
import { usePageTitle } from "@probo/hooks";

// Function to compare dot notation strings (e.g., "A.5.1" vs "A.5.10")
function compareDotNotation(a: string, b: string): number {
  if (a === b) return 0;
  if (a === '') return -1;
  if (b === '') return 1;
  
  const partsA = a.split('.');
  const partsB = b.split('.');
  
  const maxLength = Math.max(partsA.length, partsB.length);
  
  for (let i = 0; i < maxLength; i++) {
    const partA = partsA[i] || '';
    const partB = partsB[i] || '';
    
    // Try to compare as numbers first
    const numA = parseInt(partA, 10);
    const numB = parseInt(partB, 10);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      // Both are numbers, compare numerically
      if (numA !== numB) {
        return numA - numB;
      }
    } else {
      // At least one is not a number, compare as strings
      if (partA !== partB) {
        return partA.localeCompare(partB);
      }
    }
  }
  
  return 0;
}

type Props = {
  queryRef: PreloadedQuery<MeasureGraphListQuery>;
};

type SortField = 'name' | 'category' | 'state';
type SortDirection = 'asc' | 'desc';

const measuresFragment = graphql`
  fragment MeasuresPageFragment on Organization
  @refetchable(queryName: "MeasuresPageFragment_query")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 100 }
    order: { type: "MeasureOrder", defaultValue: null }
    after: { type: "CursorKey", defaultValue: null }
    before: { type: "CursorKey", defaultValue: null }
    last: { type: "Int", defaultValue: null }
  ) {
    measures(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $order
    ) @connection(key: "MeasuresPageFragment_measures") {
      __id
      totalCount
      notStartedCount
      inProgressCount
      notApplicableCount
      completedCount
      edges {
        node {
          id
          referenceId
          name
          category
          state
          description
          controls(first: 1) {
            edges {
              node {
                sectionTitle
                exclusionJustification
                framework {
                  name
                  referenceId
                }
              }
            }
          }
          tasks(first: 1) {
            edges {
              node {
                id
                referenceId
                name
                description
                state
              }
            }
          }
          ...MeasureFormDialogMeasureFragment
        }
      }
    }
  }
`;

const importMeasuresMutation = graphql`
  mutation MeasuresPageImportMutation(
    $input: ImportMeasureInput!
    $connections: [ID!]!
    $taskConnections: [ID!]!
  ) {
    importMeasure(input: $input) {
      measureEdges @appendEdge(connections: $connections) {
        node {
          id
          name
          category
          state
        }
      }
      taskEdges @appendEdge(connections: $taskConnections) {
        node {
          id
          name
          description
          state
          measure {
            id
          }
        }
      }
    }
  }
`;

export default function MeasuresPage(props: Props) {
  const { __ } = useTranslate();
  const organization = usePreloadedQuery(
    measuresQuery,
    props.queryRef
  ).organization;
  const pagination = usePaginationFragment(
    measuresFragment,
    organization as MeasuresPageFragment$key
  );
  const connectionId = pagination.data.measures.__id;
  const measures = pagination.data.measures.edges.map((edge) => edge.node);
  const totalCount = pagination.data.measures?.totalCount ?? 0;
  const notStartedCount = pagination.data.measures?.notStartedCount ?? 0;
  const inProgressCount = pagination.data.measures?.inProgressCount ?? 0;
  const notApplicableCount = pagination.data.measures?.notApplicableCount ?? 0;
  const completedCount = pagination.data.measures?.completedCount ?? 0;
  const measuresPerCategory = useMemo(() => {
    return groupBy(measures, (measure) => measure.category);
  }, [measures]);
  
  // View state
  const [viewMode, setViewMode] = useState<'categories' | 'table'>('table');
  
  // Sorting state for table view
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Multi-select state for table view
  const [selectedMeasures, setSelectedMeasures] = useState<Set<string>>(new Set());
  
  const [importMeasures] = useMutationWithToasts<MeasuresPageImportMutation>(
    importMeasuresMutation,
    {
      successMessage: __("Measures imported successfully."),
      errorMessage: __("Failed to import measures. Please try again."),
    }
  );
  const [deleteMeasure] = useDeleteMeasureMutation();
  const confirm = useConfirm();
  const importFileRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  usePageTitle(__("Measures"));

  const handleImport: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    importMeasures({
      variables: {
        input: {
          organizationId: organization.id,
          file: null,
        },
        connections: [connectionId],
        taskConnections: [`client:${organization.id}:__TasksPageFragment_tasks_connection`],
      },
      uploadables: {
        "input.file": file,
      },
      onCompleted() {
        importFileRef.current!.value = "";
      },
    });
  };

  const handleExport = async (options: { scope: 'current' | 'all'; format: 'csv' | 'json' }) => {
    if (options.scope === 'current' && options.format === 'csv') {
      // Export current view as CSV
      const csvHeaders = ['CONTROL', 'TITLE', 'DESCRIPTION', 'APPLICABLE', 'JUSTIFICATION', 'STATE', 'IMPLEMENTATION DETAILS'];
      
      // Group measures by category and sort within each category
      const measuresByCategory = groupBy(measures, (measure) => measure.category);
      const sortedCategories = objectKeys(measuresByCategory).sort();
      
      const csvRows: (string | string[])[] = [];
      
      for (const category of sortedCategories) {
        // Add category header row
        csvRows.push([category, '', '', '', '', '', '']);
        
        // Get measures for this category and sort them
        const categoryMeasures = measuresByCategory[category];
        const categoryRows = categoryMeasures.map(measure => {
          // Get the first linked control's section title as the control reference
          const controlReference = measure.controls?.edges?.[0]?.node?.sectionTitle || '';
          // Get the first linked task's description as implementation details
          const implementationDetails = measure.tasks?.edges?.[0]?.node?.description || '';
          
          // Determine APPLICABLE value based on measure state
          const isApplicable = measure.state === 'NOT_APPLICABLE' ? 'NO' : 'YES';
          
          // Determine JUSTIFICATION value
          const justification = isApplicable === 'NO' 
            ? (measure.controls?.edges?.[0]?.node?.exclusionJustification || 'n/a')
            : 'n/a';
          
          return [
            controlReference,
            measure.name,
            measure.description,
            isApplicable,
            justification,
            measure.state,
            implementationDetails
          ];
        }).sort((a, b) => {
          // Sort by CONTROL column (first column) in ascending order using dot notation
          const controlA = a[0] || '';
          const controlB = b[0] || '';
          return compareDotNotation(controlA, controlB);
        });
        
        csvRows.push(...categoryRows);
      }
      
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => {
          if (Array.isArray(row)) {
            return row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',');
          } else {
            return `"${String(row).replace(/"/g, '""')}"`;
          }
        })
        .join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `measures-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (options.scope === 'current' && options.format === 'json') {
      // Export current view as JSON
      const exportData = measures.map(measure => ({
        name: measure.name,
        description: measure.description,
        category: measure.category,
        'reference-id': measure.referenceId,
        state: measure.state,
        standards: measure.controls?.edges?.map(edge => ({
          framework: edge.node.framework?.referenceId || edge.node.framework?.name || 'Unknown',
          control: edge.node.sectionTitle
        })) || [],
        tasks: measure.tasks?.edges?.map(edge => ({
          name: edge.node.name,
          description: edge.node.description,
          'reference-id': edge.node.referenceId,
          state: edge.node.state
        })) || []
      }));
      
      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `measures-export-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (options.scope === 'all') {
      setExporting(true);
      try {
        const orgId = organization.id;
        const url = `/api/console/v1/export/measures?organization_id=${encodeURIComponent(orgId)}&format=${options.format}`;
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const blob = await res.blob();
        // Try to get filename from Content-Disposition header
        let filename = `measures-export.${options.format}`;
        const disposition = res.headers.get('Content-Disposition');
        if (disposition) {
          const match = disposition.match(/filename="([^"]+)"/);
          if (match) filename = match[1];
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err: any) {
        alert(__('Failed to export all records: ') + (err?.message || err));
      } finally {
        setExporting(false);
      }
    } else {
      alert(__('Unknown export option.'));
    }
  };

  // Sort measures for table view
  const sortedMeasures = useMemo(() => {
    return [...measures].sort((a, b) => {
      let aValue: string;
      let bValue: string;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'state':
          aValue = a.state.toLowerCase();
          bValue = b.state.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [measures, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleSelectAll = () => {
    if (selectedMeasures.size === sortedMeasures.length) {
      setSelectedMeasures(new Set());
    } else {
      setSelectedMeasures(new Set(sortedMeasures.map(m => m.id)));
    }
  };

  const handleSelectMeasure = (measureId: string) => {
    const newSelected = new Set(selectedMeasures);
    if (newSelected.has(measureId)) {
      newSelected.delete(measureId);
    } else {
      newSelected.add(measureId);
    }
    setSelectedMeasures(newSelected);
  };

  const handleBulkDelete = () => {
    confirm(
      () => {
        const promises = Array.from(selectedMeasures).map(measureId => 
          deleteMeasure({
            variables: { 
              input: { measureId },
              connections: [connectionId],
              taskConnections: [`client:${organization.id}:__TasksPageFragment_tasks_connection`]
            }
          })
        );
        
        return Promise.all(promises).then(() => {
          setSelectedMeasures(new Set());
        });
      },
      {
        message: sprintf(__("This will permanently delete %s selected measures. This action cannot be undone."), selectedMeasures.size),
      }
    );
  };

  const handleDeleteMeasure = (measureId: string) => {
    confirm(
      () => {
        return deleteMeasure({
          variables: { 
            input: { measureId },
            connections: [connectionId],
            taskConnections: [`client:${organization.id}:__TasksPageFragment_tasks_connection`]
          }
        });
      },
      {
        message: __("This will permanently delete this measure. This action cannot be undone."),
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={__("Measures")}
        description={__(
          "Measures are actions taken to reduce the risk. Add them to track their implementation status."
        )}
      >
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'categories' ? 'primary' : 'secondary'}
            icon={IconDotGrid1x3Horizontal}
            onClick={() => setViewMode('categories')}
          >
                          {__("Category view")}
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            icon={IconListStack}
            onClick={() => setViewMode('table')}
          >
                          {__("Table view")}
          </Button>
        </div>
        <ExportMeasuresDialog onExport={handleExport}>
          <Button
            variant="secondary"
            icon={IconUpload}
            disabled={exporting}
          >
            {exporting ? __("Exporting...") : __("Export")}
          </Button>
        </ExportMeasuresDialog>
        <FileButton
          ref={importFileRef}
          variant="secondary"
          icon={IconFolderUpload}
          onChange={handleImport}
        >
          {__("Import")}
        </FileButton>
        <MeasureFormDialog connection={connectionId}>
          <Button variant="primary" icon={IconPlusLarge}>
            {__("New measure")}
          </Button>
        </MeasureFormDialog>
      </PageHeader>
      
      <MeasureImplementation measures={measures} totalCount={totalCount} className="my-10" />
      
      {viewMode === 'categories' ? (
        // Category tiles view (existing implementation)
        objectKeys(measuresPerCategory)
          .sort((a, b) => a.localeCompare(b))
          .map((category) => (
            <Category
              key={category}
              category={category}
              measures={measuresPerCategory[category]}
              connectionId={connectionId}
              onDeleteMeasure={handleDeleteMeasure}
            />
          ))
      ) : (
        // Table view
        <Card className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-border-low">
            <div className="flex items-center gap-4 text-sm text-txt-secondary">
              <span>
                {__("Total measures")}:{" "}
                <span className="text-txt-primary font-medium">
                  {totalCount}
                </span>
              </span>
              <span>
                {__("Not Started")}:{" "}
                <span className="text-txt-primary font-medium">
                  {notStartedCount}
                </span>
              </span>
              <span>
                {__("In Progress")}:{" "}
                <span className="text-txt-primary font-medium">
                  {inProgressCount}
                </span>
              </span>
              <span>
                {__("Not Applicable")}:{" "}
                <span className="text-txt-primary font-medium">
                  {notApplicableCount}
                </span>
              </span>
              <span>
                {__("Completed")}:{" "}
                <span className="text-txt-primary font-medium">
                  {completedCount}
                </span>
              </span>
            </div>
          </div>
          {selectedMeasures.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-highlight border-b border-border-low">
              <span className="text-sm text-txt-primary">
                {sprintf(__("%s measures selected"), selectedMeasures.size)}
              </span>
              <Button
                variant="danger"
                icon={IconTrashCan}
                onClick={handleBulkDelete}
              >
                {sprintf(__("Delete %s measures"), selectedMeasures.size)}
              </Button>
            </div>
          )}
          <Table>
            <Thead>
              <Tr>
                <Th width={50}>
                  <input
                    type="checkbox"
                    checked={selectedMeasures.size === sortedMeasures.length && sortedMeasures.length > 0}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectAll();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-border-low"
                  />
                </Th>
                <Th>
                  <button
                    className="flex items-center gap-1 hover:text-txt-primary transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    {__("Measure")}
                    {getSortIcon('name')}
                  </button>
                </Th>
                <Th>
                  <button
                    className="flex items-center gap-1 hover:text-txt-primary transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    {__("Category")}
                    {getSortIcon('category')}
                  </button>
                </Th>
                <Th>
                  <button
                    className="flex items-center gap-1 hover:text-txt-primary transition-colors"
                    onClick={() => handleSort('state')}
                  >
                    {__("State")}
                    {getSortIcon('state')}
                  </button>
                </Th>
                <Th width={50}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedMeasures.map((measure) => (
                <MeasureRow
                  key={measure.id}
                  measure={measure}
                  connectionId={connectionId}
                  showCategory={true}
                  isSelected={selectedMeasures.has(measure.id)}
                  onSelect={() => handleSelectMeasure(measure.id)}
                  onDelete={handleDeleteMeasure}
                />
              ))}
            </Tbody>
          </Table>
          {pagination.hasNext && (
            <InfiniteScrollTrigger
              onView={() => pagination.loadNext(50)}
              loading={pagination.isLoadingNext}
            />
          )}
        </Card>
      )}
    </div>
  );
}

type CategoryProps = {
  category: string;
  measures: NodeOf<MeasuresPageFragment$data["measures"]>[];
  connectionId: string;
  onDeleteMeasure: (measureId: string) => void;
};

function Category(props: CategoryProps) {
  const params = useParams<{ categoryId?: string }>();
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();
  const categoryId = slugify(props.category);
  const [limit, setLimit] = useState<number | null>(4);
  const measures = useMemo(() => {
    return limit ? props.measures.slice(0, limit) : props.measures;
  }, [props.measures, limit]);
  const showMoreButton = limit !== null && props.measures.length > limit;
  const isExpanded = categoryId === params.categoryId;
  const ExpandComponent = isExpanded ? IconChevronUp : IconChevronDown;
  const completedMeasures = props.measures.filter(
    (m) => m.state === "IMPLEMENTED"
  );

  return (
    <Card className="py-3 px-5">
      <Link
        to={`/organizations/${organizationId}/measures/category/${categoryId}`}
        className="flex items-center justify-between cursor-pointer"
      >
        <h2 className="text-base font-medium">{props.category}</h2>
        <div className="flex items-center gap-3 text-sm text-txt-secondary">
          <span>
            {__("Completion")}:{" "}
            <span className="text-txt-primary font-medium">
              {completedMeasures.length}/{props.measures.length}
            </span>
          </span>
          <span className="text-border-low">|</span>
          <span>
            {__("Total")}:{" "}
            <span className="text-txt-primary font-medium">
              {props.measures.length}
            </span>
          </span>
          <span className="text-border-low">|</span>
          <ExpandComponent size={16} className="text-txt-secondary" />
        </div>
      </Link>
      {isExpanded && (
        <div className="mt-3">
          <Table className="bg-invert">
            <Thead>
              <Tr>
                <Th>{__("Measure")}</Th>
                <Th>{__("State")}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {measures.map((measure) => (
                <MeasureRow
                  key={measure.id}
                  measure={measure}
                  connectionId={props.connectionId}
                  onDelete={props.onDeleteMeasure}
                />
              ))}
            </Tbody>
          </Table>
          {showMoreButton && (
            <Button
              variant="tertiary"
              onClick={() => setLimit(null)}
              className="mt-3 mx-auto"
              icon={IconChevronDown}
            >
              {sprintf(__("Show %s more"), props.measures.length - limit)}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

type MeasureRowProps = {
  measure: NodeOf<MeasuresPageFragment$data["measures"]>;
  connectionId: string;
  showCategory?: boolean;
  isSelected?: boolean;
  onSelect?: (measureId: string) => void;
  onDelete?: (measureId: string) => void;
};

function MeasureRow(props: MeasureRowProps) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();

  const onDelete = () => {
    if (!props.onDelete) return;
    props.onDelete(props.measure.id);
  };

  const dialogRef = useDialogRef();

  return (
    <>
      <MeasureFormDialog measure={props.measure} ref={dialogRef} />
      <Tr to={`/organizations/${organizationId}/measures/${props.measure.id}`}>
        {props.showCategory && (
          <Td>
            <input
              type="checkbox"
              checked={props.isSelected}
              onChange={(e) => {
                e.stopPropagation();
                props.onSelect?.(props.measure.id);
              }}
              onClick={(e) => e.stopPropagation()}
              className="rounded border-border-low"
            />
          </Td>
        )}
        <Td>{props.measure.name}</Td>
        {props.showCategory && (
          <Td>{props.measure.category}</Td>
        )}
        <Td width={120}>
          <MeasureBadge state={props.measure.state} />
        </Td>
        <Td noLink width={50} className="text-end">
          <ActionDropdown>
            <DropdownItem
              icon={IconPencil}
              onClick={() => dialogRef.current?.open()}
            >
              {__("Edit")}
            </DropdownItem>
            <DropdownItem
              onClick={onDelete}
              disabled={false}
              variant="danger"
              icon={IconTrashCan}
            >
              {__("Delete")}
            </DropdownItem>
          </ActionDropdown>
        </Td>
      </Tr>
    </>
  );
}
