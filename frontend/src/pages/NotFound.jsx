// pages/NotFound.jsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <Button onClick={() => navigate("/")}>
        Return to Donation Page
      </Button>
    </div>
  );
}