
import React from "react";

export default function UserSelect({ value, onChange, user }: { value: string, onChange: (v: string) => void, user?: any }) {
  if (!user) return null;
  return (
    <div className="flex gap-2 items-center mb-3">
      <label className="text-sm font-medium">User:</label>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">All</option>
        <option value={user.id}>You ({user.id})</option>
      </select>
    </div>
  );
}
