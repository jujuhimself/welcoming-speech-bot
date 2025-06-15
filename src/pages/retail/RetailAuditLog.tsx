
import { useAuth } from "@/contexts/AuthContext";
import { useAuditLogs } from "@/hooks/useAudit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ExportButton from "@/components/ExportButton";
import DateRangeFilter from "@/components/DateRangeFilter";
import UserSelect from "@/components/UserSelect";
import { useState, useMemo } from "react";

export default function RetailAuditLog() {
  const { user } = useAuth();
  const { data: logs = [], isLoading } = useAuditLogs();
  // Add local filtering (since API does not expose by date/user)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const filtered = useMemo(() =>
    logs.filter(log => {
      const dateOk = (!from || new Date(log.created_at) >= new Date(from)) &&
        (!to || new Date(log.created_at) <= new Date(to));
      const userOk = !userId || log.user_id === userId;
      const actOk = !action || log.action === action;
      return dateOk && userOk && actOk;
    }), [logs, from, to, userId, action]);

  // Find distinct actions for filter
  const actions = Array.from(new Set(logs.map(log => log.action || ""))).filter(a => a);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Audit Log (Preview)
            <span className="float-right">
              <ExportButton data={filtered} filename="audit_log.csv" disabled={filtered.length === 0} />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2 items-center">
            <DateRangeFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
            <UserSelect value={userId} onChange={setUserId} user={user} />
            {actions.length > 0 && (
              <div>
                <label className="text-sm mr-1">Action:</label>
                <select className="border rounded px-2 py-1 text-sm"
                  value={action} onChange={e => setAction(e.target.value)}>
                  <option value="">All</option>
                  {actions.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
          </div>
          {isLoading ? (
            <div>Loading…</div>
          ) : filtered.length === 0 ? (
            <div>No audit log entries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>Resource ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Old</th>
                    <th>New</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 30).map(log => (
                    <tr key={log.id}>
                      <td>{log.action}</td>
                      <td className="capitalize">{log.resource_type}</td>
                      <td>{log.resource_id || "-"}</td>
                      <td className="text-blue-800">{log.user_id}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                      <td className="break-all">
                        {log.old_values && <code>{JSON.stringify(log.old_values)}</code>}
                      </td>
                      <td className="break-all">
                        {log.new_values && <code>{JSON.stringify(log.new_values)}</code>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
