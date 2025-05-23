// admin/components/AdminLogsTable.jsx
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { adminLogColumns } from "@/lib/AdminLogColumn";

/*async function fetchAdminLogs() {
  const res = await fetch("http://localhost:5000/api/admin/logs", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export default function AdminLogsTable() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: fetchAdminLogs,
    retry: 1
  });

  if (isLoading) return <div>Loading logs...</div>;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="mt-8 space-y-4">
      <DataTable 
        columns={adminLogColumns} 
        data={data} 
        enableColumnFiltering
        initialState={{
          columnFilters: [{ id: 'action', value: '' }]
        }}
      />
    </div>
  );
}*/
import { useState } from "react";

export default function AdminLogsTable() {
  const [filters, setFilters] = useState({ action: "", from: "", to: "" });

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["adminLogs", filters],
    queryFn: async () => {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:5000/api/admin/logs?${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
  });

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Filter by action (e.g. invite)"
          value={filters.action}
          onChange={(e) => updateFilter("action", e.target.value)}
          className="border p-2 rounded w-60"
        />
        <input
          type="date"
          value={filters.from}
          onChange={(e) => updateFilter("from", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => updateFilter("to", e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      <DataTable
        columns={adminLogColumns}
        data={data || []}
        isLoading={isLoading}
        error={error?.message}
      />
    </div>
  );
}
