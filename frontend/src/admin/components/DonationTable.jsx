// components/DonationTable.jsx
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/lib/columns";

export default function DonationTable() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['donation-table'],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/payment/record-donation", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return res.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Donations</h1>
      
      {error && (
        <p className="text-sm text-red-500 mb-4">{error.message}</p>
      )}

      <DataTable
        key={data?.length || 0}
        columns={columns} 
        data={data || []} 
        isLoading={isLoading}
      />
    </div>
  );
}
