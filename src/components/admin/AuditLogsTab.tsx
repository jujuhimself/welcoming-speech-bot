
import { useAuditLogs } from "@/hooks/useAudit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Eye, User, Download } from "lucide-react";

const AuditLogsTab = () => {
  const { data, isLoading, error } = useAuditLogs(undefined, undefined, 30);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div>Loading audit logs...</div>}
        {error && <div className="text-red-600">Failed to load logs</div>}
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {data && data.length === 0 && <div className="text-sm text-muted-foreground">No logs</div>}
            {data &&
              data.map((log: any) => (
                <div key={log.id} className="border-b pb-2 pt-2 last:border-0 text-sm flex gap-3 items-center">
                  <Badge variant="outline">{log.action}</Badge>
                  <span className="font-medium">{log.resource_type}</span>
                  {log.category && (
                    <span className="bg-blue-50 px-2 py-0.5 rounded text-xs text-blue-900">{log.category}</span>
                  )}
                  <span className="text-gray-500">{log.created_at?.substring(0,16)}</span>
                  <span className="text-gray-400 ml-auto">{log.user_id?.slice(0, 6)}...</span>
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditLogsTab;
