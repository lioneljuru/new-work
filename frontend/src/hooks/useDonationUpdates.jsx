// hooks/useDonationUpdates.js
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

export function useDonationUpdates() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/ws/donations');

    ws.onmessage = (event) => {
      const newDonation = JSON.parse(event.data);
      queryClient.setQueryData(['donations'], (old) => [newDonation, ...(old || [])]);
    };

    return () => ws.close();
  }, []);
}