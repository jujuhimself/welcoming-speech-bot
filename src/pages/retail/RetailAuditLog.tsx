
import { useAuth } from "@/contexts/AuthContext";
import { useAuditLogs } from "@/hooks/useAudit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RetailAuditLog() {
  const { user } = useAuth();
  const { data: logs = [], isLoading } = useAuditLogs(undefined, undefined, 20);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Audit Log (Preview)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading…</div>
          ) : logs.length === 0 ? (
            <div>No audit log entries found.</div>
          ) : (
            <ul className="text-xs">
              {logs.map(log => (
                <li key={log.id} className="mb-2">
                  <div>
                    <b>{log.action}</b> on <span className="capitalize">{log.resource_type}</span>
                    {log.resource_id && <> (ID: {log.resource_id})</>}
                  </div>
                  <div>
                    <span className="text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                    {" "}by <span className="text-blue-800">{log.user_id}</span>
                  </div>
                  {log.old_values && (
                    <div className="border p-1 mt-1 rounded bg-gray-50">
                      <b>Old:</b>{" "}
                      <code>{JSON.stringify(log.old_values)}</code>
                    </div>
                  )}
                  {log.new_values && (
                    <div className="border p-1 mt-1 rounded bg-gray-50">
                      <b>New:</b>{" "}
                      <code>{JSON.stringify(log.new_values)}</code>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
