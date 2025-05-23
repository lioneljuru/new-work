import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InviteAdminForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("https://new-work-production-07dd.up.railway.app/api/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invite failed");

      toast.success("✅ Invite sent");
      setEmail("");
    } catch (err) {
      toast.error("Invite failed", { description: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4 max-w-sm">
      <Input
        type="email"
        placeholder="newadmin@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={sending} className="w-full">
        {sending ? "Sending..." : "Send Invite"}
      </Button>
    </form>
  );
}
