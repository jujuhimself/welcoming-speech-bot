
import React from "react";

export default function DateRangeFilter({
  from,
  to,
  setFrom,
  setTo,
}: {
  from: string;
  to: string;
  setFrom: (d: string) => void;
  setTo: (d: string) => void;
}) {
  return (
    <div className="flex gap-2 items-center mb-3 flex-wrap">
      <label className="text-sm font-medium">From:</label>
      <input
        type="date"
        value={from}
        onChange={e => setFrom(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      />
      <label className="text-sm font-medium ml-2">To:</label>
      <input
        type="date"
        value={to}
        onChange={e => setTo(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      />
    </div>
  );
}
