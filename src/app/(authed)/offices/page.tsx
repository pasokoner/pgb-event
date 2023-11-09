import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TableSkeleton from "@/components/table-skeleton";
import AddOffice from "./_components/add-office";
import OfficesTable from "./_components/table";

export default async function OfficesPage() {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.userRole !== "ADMIN") {
    redirect("/events");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-4 sm:mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">OFFICES</h1>
          <p className="text-gray-500">Manage your offices</p>
        </div>

        <div>
          <AddOffice />
        </div>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <OfficesTable />
      </Suspense>
    </div>
  );
}
