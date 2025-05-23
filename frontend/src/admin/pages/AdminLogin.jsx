// admin/components/AdminLogin.jsx
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../adminAuthSlice";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const[loading, setLoading] =useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔎 Login Payload:", form);

      const res = await fetch("https://new-work-production-07dd.up.railway.app/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      dispatch(loginAdmin({ token: data.token, user: data.user }));

      toast.success("Login successful");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error("Login failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <Input
          value={form.email}
          placeholder="admin@example.com" 
          type="email"
          onChange={e => handleChange("email", e.target.value)}
          required 
        />
        <Input
          value={form.password}
          placeholder="......"
          type="password"
          onChange={e => handleChange("password", e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loggin in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

