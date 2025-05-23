// lib/columns.js
import { Badge } from "lucide-react";

export const columns = [
    {
      accessorKey: "createdAt",
      header: "Date",
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.getValue("createdAt");
        const parsed = new Date(value);
        return isNaN(parsed)
          ? "Invalid"
          : new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Africa/Kigali"
          }).format(parsed);
      }
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `${row.getValue("amount")} ${row.original.currency}`,
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => <span className="capitalize">{row.getValue("paymentMethod")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === 'success' ? 'success' : 'destructive'}>
          {row.getValue("status")}
        </Badge>
      ),
    },
];