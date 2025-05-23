import { Badge } from "lucide-react";

export const adminUserColumns = [
    {
      accessorKey: "email",
      header: "Email",
      filterable: true,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="capitalize px-2 py-1 bg-accent rounded">
          {row.getValue("role")}
        </span>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Last Active",
      cell: ({ row }) => 
        new Date(row.getValue("lastLogin")).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === 'active' ? 'default' : 'secondary'}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => 
        new Date(row.getValue("createdAt")).toLocaleString(),
    },
];