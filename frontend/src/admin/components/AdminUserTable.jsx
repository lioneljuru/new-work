// File: src/admin/components/AdminUsersTable.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { adminUserColumns } from "@/lib/AdminUserColumn";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminUsersTable() {
  const [email, setEmail] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await fetch("https://new-work-production-07dd.up.railway.app/api/admin/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      fetch(`https://new-work-production-07dd.up.railway.app/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ role }),
      }).then(res => res.json()),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: () => toast.error("Failed to update role"),
  });

  const handleInvite = async () => {
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

      toast.success("Invitation sent");
      setInviteOpen(false);
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columnsWithActions = [
    ...adminUserColumns,
    {
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            {/*<Button
              size="sm"
              variant="destructive"
              onClick={async () =>{
                if (!comfirm(`Delete ${user.email}?`)) return;
                try {
                  const res = await fetch(`/api/admin/${user._id}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                  });
                  if (!res.ok) throw new Error("Failed to delete admin");
                  toast.success("Admin deleted");
                  queryClient.invalidateQueries(["adminUsers"]);
                } catch (err) {
                  toast.error("Error deleting admin");
                }
              }}
            >
              Delete
            </Button>*/}
            <Button
              size="sm"
              variant={user.status === "active" ? "destructive" : "outline"}
              onClick={async () => {
                try {
                  const res = await fetch(
                    `https://new-work-production-07dd.up.railway.app/api/admin/users/${user._id}/status`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                      },
                      body: JSON.stringify({
                        status: user.status === "active" ? "inactive" : "active",
                      }),
                    }
                  );
                  if (!res.ok) throw new Error("Failed to toggle status");
                  toast.success("Status updated");
                  queryClient.invalidateQueries(["adminUsers"]);
                } catch (err) {
                  toast.error("Error updating status");
                }
              }}
            >
              {user.status === "active" ? "Deactivate" : "Activate"}
            </Button>
            <Button
              size="sm"
              className="border shadow hover:bg-gray-400"
              variant="secondary"
              onClick={async () => {
                try {
                  const res = await fetch(`https://new-work-production-07dd.up.railway.app/api/admin/invite/resend`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                    body: JSON.stringify({ email: user.email }),
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Failed to resend invite");
                  toast.success("Invite resent to " + user.email);
                } catch (err) {
                  toast.error("Error resending invite");
                }
              }}
            >
              Resend
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-8">
      <div className="mb-4">
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>Invite new Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Admin</DialogTitle>
              <DialogDescription>
                Send a signup invite link to their email.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleInvite} className="mt-4">
              Send Invite
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columnsWithActions}
        data={data || []}
        isLoading={isLoading}
        error={error?.message}
      />
    </div>
  );
}
