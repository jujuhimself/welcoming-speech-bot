
import React from "react";
import { useReportTemplates, useGeneratedReports, useGenerateReport } from "@/hooks/useReporting";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ReportModal from "@/components/ReportModal";
import { Button } from "@/components/ui/button";

export default function RetailReporting() {
  const { data: templates = [], isLoading: loadingTemplates } = useReportTemplates();
  const { data: reports = [], isLoading: loadingReports } = useGeneratedReports();
  const generateReport = useGenerateReport();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Automated Report Generation (Preview)</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setOpen(true)} disabled={loadingTemplates || templates.length === 0}>
            Generate Report
          </Button>
          <ReportModal
            open={open}
            onOpenChange={setOpen}
            templates={templates}
            onGenerateReport={(opts) => generateReport.mutate(opts)}
            isLoading={generateReport.isPending}
          />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingReports ? (
            <div>Loading…</div>
          ) : reports.length === 0 ? (
            <div>No generated reports yet.</div>
          ) : (
            <ul>
              {reports.slice(0, 5).map(r => (
                <li key={r.id}>
                  {r.file_path} — <span className="capitalize">{r.status}</span> • {new Date(r.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
