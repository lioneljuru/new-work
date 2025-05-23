// components/SecureFetch.jsx
import { useEffect } from "react";
import { toast } from "sonner";

export const SecureFetch = ({ children }) => {
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (url, options = {}) => {
      const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("adminToken")}`,
        //'X-Requested-With': 'XMLHttpRequest'
      };

      try {
        const response = await originalFetch(url, { ...options, headers });
        
        if (response.status === 401) {
          toast({ title: "Session Expired", variant: "destructive" });
          window.location = '/admin/login';
        }

        return response;
      } catch (error) {
        toast({ title: "Network Error", variant: "destructive" });
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return children;
};