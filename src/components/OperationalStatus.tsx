
import React, { useEffect, useState } from "react";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

/**
 * Tiny indicator for system health.
 * In a real-world scenario, this might ping a /health endpoint.
 */
export const OperationalStatus = () => {
  const [status, setStatus] = useState<"operational" | "degraded" | "offline">("operational");

  useEffect(() => {
    // Demo: randomly degrade status every so often (replace with real logic in prod)
    const degrade = setTimeout(() => {
      // Fake a change in status only for demonstration
      setStatus((s) => (Math.random() > 0.98 ? "degraded" : s));
    }, 10000);
    return () => clearTimeout(degrade);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-background text-xs font-medium border">
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          status === "operational"
            ? "bg-green-500"
            : status === "degraded"
            ? "bg-yellow-400"
            : "bg-red-500"
        }`}
      />
      <span>
        {status === "operational" && (
          <span className="inline-flex items-center text-green-700">
            <CheckCircle className="h-4 w-4 mr-1" /> System OK
          </span>
        )}
        {status === "degraded" && (
          <span className="inline-flex items-center text-yellow-700">
            <AlertTriangle className="h-4 w-4 mr-1" /> Degraded
          </span>
        )}
        {status === "offline" && (
          <span className="inline-flex items-center text-red-700">
            <Info className="h-4 w-4 mr-1" /> Offline
          </span>
        )}
      </span>
    </div>
  );
};
