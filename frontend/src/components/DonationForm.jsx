import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PaymentOptions from "./PaymentOptions";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";

import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

export default function DonationForm() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    amount: "", 
    currency: "RWF",
    paymentMethod: "" 
  });
  //const [showPayment, setShowPayment] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const recordDonationAttempt = useCallback(async (status, transaction_id = null) => {
    try {
        await fetch("https://new-work-production-07dd.up.railway.app/api/payment/record-donation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                name: anonymous ? "Anonymous": form.name,
                status,
                transaction_id,
                paymentMethod: form.paymentMethod,
                timestamp: new Date().toISOString()
            }),
        });
    } catch (error) {
        console.error("Failed to record donation:", error);
    }
  }, [form, anonymous]);

  //payment verification function
  const verifyPayment = useCallback(async (transaction_id) => {
    setLoading(true);
    try {
        const res = await fetch("https://new-work-production-07dd.up.railway.app/api/payment/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                name: anonymous ? "Anonymous" : form.name,
                id: transaction_id,
                currency: form.currency,
                amount: form.amount
            }),
        });
        const data = await res.json();
        if (res.ok && data.verified) {
            await recordDonationAttempt("success", transaction_id);
            window.location.href = '/thank-you';
        } else {
            await recordDonationAttempt("failed", transaction_id);
            setStatus(" Payment verification failed");
        }
    } catch (error) {
        console.error(error);
        await recordDonationAttempt("error");
        setStatus("Error when verifying payment");
    } finally {
        setLoading(false);
        setDialogOpen(false);
    }
  }, [form, recordDonationAttempt]);

  const config = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: form.amount,
    currency: form.currency || 'RWF',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: form.email,
      name: anonymous ? "Anonymous" : form.name,
    },
    customizations: {
      title: 'Unicef Donations',
      description: 'Thank you for your support',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };
 
  const fwConfig = {
    ...config,
    text: 'Pay with Flutterwave!',
    callback: async (response) => {
        console.log(response);
        closePaymentModal(); // this will close the modal programmatically
        if (response.status === 'successful') {
            setStatus("Verifying payment...")
            await verifyPayment(response.transaction_id, form.currency, form.amount);
        } else {
            await recordDonationAttempt("failed", response.transaction_id);
            setStatus("Payment failed. Please try again.")
        }
    },
    onClose: async () => {
        await recordDonationAttempt("canceled");
        setStatus("Payment was cancelled");
        setDialogOpen(false);
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (loading) return;

    if (!form.amount || !form.email || !form.paymentMethod) {
        setStatus("❌ Please fill all required fields");
        return;
    }

    //validate amount format
    if (isNaN(form.amount) || Number(form.amount) <= 0) {
        setStatus("❌ Please enter a valid donation amount");
        return;
    }

    setDialogOpen(true);

    setLoading(true);
    setStatus("Redirecting to payment...");
    try {
        await new Promise(resolve => setTimeout(resolve, 0)); // Ensure state updates
        setShowPayment(true);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              disabled={loading || anonymous}
              required
            />
            <Toggle pressed={anonymous} onPressedChange={setAnonymous} disabled={loading}>
              Donate Anonymously
            </Toggle>
        </div>

        <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
              disabled={loading}
              required
            />
        </div>

        <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={e => handleChange("amount", e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Currency</label>
              <Select
                value={form.currency}
                onValueChange={value => handleChange("currency", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RWF">RWF</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>

        <PaymentOptions 
          method={form.paymentMethod} 
          setMethod={value => handleChange("paymentMethod", value)} 
          disabled={loading}
        />

        <div className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gray-900 text-white" 
                disabled={loading}
                type="button"
              >
                {loading ? "Processing..." : "Donate Now"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Donation</AlertDialogTitle>
                <AlertDialogDescription>
                  Confirming this means you are ready to donate.
                  This action can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {anonymous ? "Anonymous" : form.name}</p>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Amount:</strong> {form.amount} {form.currency}</p>
                <p><strong>Method:</strong> {form.paymentMethod}</p>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  {form.paymentMethod === 'flutterwave' ? (
                    <FlutterWaveButton 
                      {...fwConfig}
                      className="w-full"
                    />
                  ) : (
                    <Button 
                      disabled={loading}
                      onClick={() => {/* Handle other payment methods here */}}
                    >
                      {loading ? "Processing..." : "Confirm Payment"}
                    </Button>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {status && (
            <p className="text-sm text-gray-600 text-center mt-2">{status}</p>
        )}
    </form>
  );
}
