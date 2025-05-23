import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialStats = {
  totalAmount: 0,
  totalDonations: 0,
  byCurrency: {},
  byMethod: {}
};

export default function AnalyticsCards() {
  const { data } = useQuery({
    queryKey: ['analytics-donations'],
    queryFn: async () => {
      const res = await fetch("https://new-work-production-07dd.up.railway.app/api/payment/record-donation", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return res.json();
    },
    refetchInterval: 10000,
  });

  const stats = useMemo(() => {
    if (!data) return initialStats;
    
    return data.reduce((acc, donation) => {
      //acc.totalAmount += donation.amount;
      acc.totalDonations++;
      acc.byCurrency[donation.currency] = (acc.byCurrency[donation.currency] || 0) + donation.amount;
      acc.byMethod[donation.paymentMethod] = (acc.byMethod[donation.paymentMethod] || 0) + 1;
      return acc;
    },
    {
      totalAmount: 0,
      totalDonations: 0,
      byCurrency: {},
      byMethod: {}
    });
  }, [data]);

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-4 gap-20 mb-7">
        <Card>
          <CardHeader>
            <CardTitle>Total Donations</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-green-700">
            {stats.totalDonations}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> Total Amount By Currency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(stats.byCurrency).map(([currency, total]) => (
              <div key={currency} className="text-sm">
                {currency}: {total.toLocaleString()}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donations By Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(stats.byMethod).map(([method, count]) => (
              <div key={method} className="text-sm capitalize">
                {method}: {count}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
