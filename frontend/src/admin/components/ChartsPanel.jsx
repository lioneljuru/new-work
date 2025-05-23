import { useMemo } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartsPanel({ donations = [] }) {
    const methodStats = useMemo(() => {
        const groups = {};
        donations.forEach((d) => {
            if (!groups[d.paymentMethod]) groups[d.paymentMethod] = 0;
            groups[d.paymentMethod] += d.amount;
        });
        return {
            labels: Object.keys(groups),
            datasets: [
                {
                    label: "Total Amount by Method",
                    data: Object.values(groups),
                    backgroundColor: "#3b82f6",
                },
            ],
        };
    }, [donations]);

    const statusStats = useMemo(() => {
        const counts = {};
        donations.forEach((d) => {
            counts[d.status] = (counts[d.status] || 0) + 1;
        });
        return {
            labels: Object.keys(counts),
            datasets: [
                {
                    data: Object.values(counts),
                    backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
                },
            ],
        };
    }, [donations]);

    return (
        <div className="grid grid-cols-1 space-x-20 lg:grid-cols-2 gap-8 mt-1">
            <div className="bg-white  w-125 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-2">Total Donations by Method</h2>
                <Bar data={methodStats} width={300} height={187}/>
            </div>
            <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-lg font-semibold mb-2">Donations by Status</h2>
                <Pie data={statusStats} width={300} height={187} />
            </div>
        </div>
    );
}