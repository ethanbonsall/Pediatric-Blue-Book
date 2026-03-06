// Admin users page: list all users from Supabase and allow superusers to edit roles.

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/navbar-profile";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type UserRow = {
  id: string;
  first_name: string | null;
  email: string | null;
  title: string | null;
  role: string | null;
};

const ROLES = ["user", "admin", "superuser"] as const;

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pendingRoleChanges, setPendingRoleChanges] = useState<
    Record<string, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getAuthAndUsers = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: roleData, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (roleError) {
          router.push("/login");
          return;
        }

        if (roleData?.role === "superuser") {
          setIsSuperUser(true);

          const { data: usersData, error: usersError } = await supabase
            .from("users")
            .select("id, first_name, email, title, role")
            .order("created_at", { ascending: false });

          if (usersError) {
            console.error("Error fetching users:", usersError);
          } else {
            setUsers((usersData ?? []) as UserRow[]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    getAuthAndUsers();
  }, [router]);

  const handleRoleSelect = (userId: string, newRole: string) => {
    setPendingRoleChanges((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSave = async () => {
    const entries = Object.entries(pendingRoleChanges);
    if (entries.length === 0) return;
    setIsSaving(true);
    try {
      for (const [userId, newRole] of entries) {
        const { error } = await supabase
          .from("users")
          .update({ role: newRole })
          .eq("id", userId);
        if (error) throw error;
      }
      setUsers((prev) =>
        prev.map((u) =>
          pendingRoleChanges[u.id] != null
            ? { ...u, role: pendingRoleChanges[u.id] }
            : u
        )
      );
      setPendingRoleChanges({});
    } catch (err) {
      console.error("Error updating roles:", err);
      alert(
        err instanceof Error ? err.message : "Failed to save role changes."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const hasPendingChanges = Object.keys(pendingRoleChanges).length > 0;

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => {
      const name = (user.first_name ?? "").toLowerCase();
      const email = (user.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [users, searchQuery]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Users Panel | Admin | Pediatric Blue Book</title>
        </Head>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center px-4">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </>
    );
  }

  if (!isSuperUser) {
    return (
      <>
        <Head>
          <title>Users Panel | Admin | Pediatric Blue Book</title>
        </Head>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center px-4 py-8">
          <p className="text-center text-lg text-muted-foreground">
            You do not have the right permissions for this page.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Users Panel | Admin | Pediatric Blue Book</title>
      </Head>
      <Navbar />
      <main className="flex h-screen max-h-[100dvh] flex-col bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 overflow-hidden">
          <h1 className="text-2xl font-semibold tracking-tight shrink-0">
            Users Panel
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
            <input
              type="text"
              placeholder="Search by first name or email..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="flex-[0.5] rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              onClick={handleSave}
              disabled={!hasPendingChanges || isSaving}
              className="w-full sm:w-auto shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto rounded-lg border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-background backdrop-blur-lg">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">First name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      {user.first_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.title ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {isSuperUser ? (
                        <Select
                          value={
                            pendingRoleChanges[user.id] ??
                            user.role ??
                            "user"
                          }
                          onValueChange={(value) =>
                            handleRoleSelect(user.id, value)
                          }
                          disabled={isSaving}
                        >
                          <SelectTrigger className="w-[140px] bg-[#ffffff] opacity-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className="!bg-[#ffffff] opacity-100"
                            viewportClassName="!bg-[#ffffff] opacity-100"
                            style={{
                              backgroundColor: "#ffffff",
                              opacity: 1,
                            }}
                          >
                            {ROLES.map((role) => (
                              <SelectItem
                                key={role}
                                value={role}
                                className="!bg-[#ffffff] !opacity-100 !text-gray-900 data-[highlighted]:!bg-[#e5e7eb] data-[highlighted]:!text-gray-900 focus:!bg-[#e5e7eb] focus:!text-gray-900"
                              >
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="capitalize">
                          {user.role ?? "user"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="text-muted-foreground shrink-0">No users found.</p>
          )}
          {users.length > 0 && filteredUsers.length === 0 && (
            <p className="text-muted-foreground shrink-0">
              No users match your search.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
