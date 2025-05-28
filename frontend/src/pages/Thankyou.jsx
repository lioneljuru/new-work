// src/pages/ThankYou.jsx
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-blue-50">
      <CheckCircle className="text-green-500" size={64} />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-4">Thank you for your donation!</h1>
      <p className="text-md text-gray-600 mt-2 max-w-lg">
        Your support means the world to us. We've successfully received your donation and it's already making an impact.
      </p>
      <Link to="/" className="mt-6 text-blue-600 underline">
        Go back to Home
      </Link>
    </div>
  );
}
