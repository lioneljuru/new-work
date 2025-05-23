import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns } from "@/lib/columns";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import ChartsPanel from "../components/ChartsPanel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMemo } from "react";

export default function AdminReports() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["donations"],
        queryFn: async () => {
            const res = await fetch("https://new-work-production-07dd.up.railway.app/api/payment/record-donation", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });
            return res.json();
        },
    });

    const filtered = useMemo(() => {
        if (!data) return [];
        
        return data.filter((d) => {
            const matchStatus = status === "all" || d.status === status;
            const matchSearch =
              !search ||
              d.email?.toLowerCase().includes(search.toLowerCase()) ||
              d.paymentMethod?.toLowerCase().includes(search.toLowerCase());
            
            const date = new Date(d.createdAt).getTime();
            const matchStart = start ? date >= new Date(start).getTime() : true;
            const matchEnd = end ? date <= new Date(end).getTime() : true;

            return matchStatus && matchSearch && matchStart && matchEnd;
        });
    }, [data, search, status, start, end]);

    const exportCSV = () => {
        const rows = filtered.map(d => ({
            Date: new Date(d.CreatedAt).toLocaleDateString(),
            Email: d.email,
            Amount:d.amount,
            Currency: d.currency,
            Method: d.paymentMethod,
            Status: d.status,
        }));

        const csv =[
            Object.keys(rows[0]).join(","),
            ...rows.map((row) => Object.values(row).join(",")),
        ].join("\n");

        const blob = new Blob([csv], {type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "donations-report.csv";
        link.click();

        toast.success("CSV exported");
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Donation Report", 14, 16);

        const rows = filtered.map((d) => [
            new Date(d.createdAt).toLocaleString(),
            d.email,
            d.amount,
            d.currency,
            d.paymentMethod,
            d.status,
        ]);

        autoTable(doc, {
            head: [["Date", "Email", "Amount", "Currency", "Method", "Status"]],
            body: rows,
            startY: 20,
        });

        doc.save("donations-report.pdf");
        toast.success("PDF exported");
    };
    
    return (
        <div className="space-y-16">
            <h1 className="text-3xl font-extrabold mb-4">Donation Reports</h1>

            <div className="flex flex-wrap gap-15 items-center">
                <Input
                  placeholder="search email/method..."
                  className="w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
                <Input type="date" className="w-64" value={start} onChange={(e) => setStart(e.target.value)} />
                <Input type="date" className="w-64" value={end} onChange={(e) => setEnd(e.target.value)} />
                <Button onClick={exportCSV}>Export CSV</Button>
                <Button variant="outline" onClick={exportPDF}>Export PDF</Button>
            </div>
            <div className="flex justify-center">
                <ChartsPanel donations={filtered} />
            </div>

            <DataTable
              columns={columns}
              data={filtered}
              isLoading={isLoading}
            />
        </div>
    );
}