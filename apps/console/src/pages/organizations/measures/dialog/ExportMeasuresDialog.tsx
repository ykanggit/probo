import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  useDialogRef,
  type DialogRef,
} from "@probo/ui";
import type { ReactNode } from "react";
import { useTranslate } from "@probo/i18n";
import { useState } from "react";

type ExportScope = 'current' | 'all';
type ExportFormat = 'csv' | 'json';

interface ExportOptions {
  scope: ExportScope;
  format: ExportFormat;
}

type Props = {
  children: ReactNode;
  onExport: (options: ExportOptions) => void;
  ref?: DialogRef;
};

export default function ExportMeasuresDialog(props: Props) {
  const { __ } = useTranslate();
  const dialogRef = props.ref ?? useDialogRef();
  const [options, setOptions] = useState<ExportOptions>({
    scope: 'current',
    format: 'csv'
  });

  const handleExport = () => {
    props.onExport(options);
    dialogRef.current?.close();
  };

  return (
    <Dialog
      trigger={props.children}
      ref={dialogRef}
      title={__("Export Measures")}
    >
      <DialogContent padded className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">{__("Export Scope")}</h3>
            <div className="space-y-2">
              <button
                type="button"
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  options.scope === 'current'
                    ? 'border-primary bg-primary/5'
                    : 'border-border-low hover:border-border-medium'
                }`}
                onClick={() => setOptions(prev => ({ ...prev, scope: 'current' }))}
              >
                <div className="font-medium">{__("Current View")}</div>
                <div className="text-sm text-txt-secondary">
                  {__("Export only the measures currently loaded on this page")}
                </div>
              </button>
              <button
                type="button"
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  options.scope === 'all'
                    ? 'border-primary bg-primary/5'
                    : 'border-border-low hover:border-border-medium'
                }`}
                onClick={() => setOptions(prev => ({ ...prev, scope: 'all' }))}
              >
                <div className="font-medium">{__("All Records")}</div>
                <div className="text-sm text-txt-secondary">
                  {__("Export all measures in the organization (may take longer)")}
                </div>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">{__("Export Format")}</h3>
            <div className="space-y-2">
              <button
                type="button"
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  options.format === 'csv'
                    ? 'border-primary bg-primary/5'
                    : 'border-border-low hover:border-border-medium'
                }`}
                onClick={() => setOptions(prev => ({ ...prev, format: 'csv' }))}
              >
                <div className="font-medium">{__("CSV File")}</div>
                <div className="text-sm text-txt-secondary">
                  {__("Spreadsheet format with columns: CONTROL, TITLE, DESCRIPTION, APPLICABLE, JUSTIFICATION, STATE, IMPLEMENTATION DETAILS")}
                </div>
              </button>
              <button
                type="button"
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  options.format === 'json'
                    ? 'border-primary bg-primary/5'
                    : 'border-border-low hover:border-border-medium'
                }`}
                onClick={() => setOptions(prev => ({ ...prev, format: 'json' }))}
              >
                <div className="font-medium">{__("JSON File")}</div>
                <div className="text-sm text-txt-secondary">
                  {__("Import format with full measure data including tasks and controls")}
                </div>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button onClick={handleExport}>
          {__("Export")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
} 