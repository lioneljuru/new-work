import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminAcceptInvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [form, setForm] = useState({ name: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.password) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("https://new-work-production-07dd.up.railway.app/api/admin/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Account created! You can now log in.");
      navigate("/admin/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("No token provided");
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center">Complete Your Admin Setup</h1>
        <Input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          type="password"
          placeholder="Choose a Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
// src/admin/pages/AdminAccept.jsx
/*import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminAcceptInvite() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing invite token");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return toast.error("Please enter a password");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invite acceptance failed");

      toast.success("Account setup complete");
      navigate("/admin/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Accept Admin Invite</h1>
        <Input
          type="password"
          placeholder="Set your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Setting up..." : "Complete Setup"}
        </Button>
      </form>
    </div>
  );
}
*/