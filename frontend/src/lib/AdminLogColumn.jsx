// src/lib/adminLogColumns.js
export const adminLogColumns = [
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "targetEmail",
      header: "Target",
    },
    {
      accessorKey: "actorEmail",
      header: "By",
    },
    {
      accessorKey: "createdAt",
      header: "Time",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleString(),
    },
];
  