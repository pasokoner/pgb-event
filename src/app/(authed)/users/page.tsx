import EventsTable from "./_components/table";
import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TableSkeleton from "@/components/table-skeleton";
import AddUser from "./_components/add-user";

export default async function EventsPage() {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.userRole !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-4 sm:mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Users</h1>
          <p className="text-gray-500">Manage your users</p>
        </div>

        <div>
          <AddUser />
        </div>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <EventsTable />
      </Suspense>
    </div>
  );
}
