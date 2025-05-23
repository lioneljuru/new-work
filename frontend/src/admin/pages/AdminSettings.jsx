import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { logoutAdmin } from "../adminAuthSlice";

export default function AdminSettings() {
  const [orgName, setOrgName] = useState("UNICEF");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [logo, setLogo] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.adminAuth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    toast("Logged outSuccessfully");
    //navigate("/admin/login", { replace: true });
  };

  const handleSave = () => {
    toast.success("Settings saved");
  };

  const handlePasswordChange = async () => {
    if (!password) return toast.error("Password is required");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");

      toast.success("Password updated");
      setPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 p-30">
      <h1 className="text-3xl font-extrabold mb-4">Admin Settings</h1>

      <div>
        <label className="text-sm font-medium">Organization Name</label>
        <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
      </div>

      <div>
        <label className="text-sm font-medium">Organization Logo</label>
        <Input
          type="file"
          onChange={(e) => setLogo(e.target.files[0])}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Email Alerts</label>
        <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
      </div>

      <div className="border-t pt-4">
        <label className="text-sm font-medium">Change Password</label>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={handlePasswordChange}
          disabled={loading}
          className="mt-2"
        >
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>

      <Button onClick={handleSave}>Save All Settings</Button>
      <div>  
        <Button 
          onClick={handleLogout} 
          variant="destructive"
          className="mt-auto self-start  bg-gray-800 text-white hover:bg-gray-700 rounded-md"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
