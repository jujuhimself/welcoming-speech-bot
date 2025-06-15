
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

function exportCSV(data: any[], filename: string) {
  if (!data || !data.length) return;
  const replacer = (_key: string, value: any) => (value === null ? '' : value);
  const header = Object.keys(data[0]);
  const csv = [
    header.join(','),
    ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export default function ExportButton({ data, filename, disabled }: { data: any[], filename: string, disabled?: boolean }) {
  return (
    <Button
      variant="outline"
      className="flex gap-2 items-center"
      onClick={() => exportCSV(data, filename)}
      disabled={disabled || !data.length}
      title="Export as CSV"
      size="sm"
      type="button"
    >
      <Download className="w-4 h-4" />
      Export
    </Button>
  );
}
