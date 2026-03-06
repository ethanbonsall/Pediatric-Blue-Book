import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/navbar-profile";
import { Button } from "@/components/ui/button";
import { Beaker, Users } from "lucide-react";

const AdminIndex = () => {
  return (
    <>
      <Head>
        <title>Admin Panel | Pediatric Blue Book</title>
      </Head>
      <Navbar />
      <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-10 text-3xl font-semibold tracking-tight">
            Admin Panel
          </h1>

          <div className="space-y-6">
            <section className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-medium">Formula Panel</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Manage the product database for infant formula (powder and
                    liquid ingredients). View, add, edit, approve, activate, and
                    deactivate products.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/admin/formula-panel">Formula Panel</Link>
                </Button>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-medium">Users Panel</h2>
                  </div>
                  <p className="text-muted-foreground">
                    View and manage user accounts, roles, and permissions.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/admin/users-panel">Users Panel</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminIndex;
