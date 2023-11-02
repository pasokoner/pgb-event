import { getPageSession } from "@/server/auth";
import AddEmployee from "./_components/add-employee";
import EmployeesTable from "./_components/table";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TableSkeleton from "@/components/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default async function EmployeesPage() {
  const session = await getPageSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between gap-4 sm:mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">EMPLOYEE</h1>
          <p className="text-gray-500">Manage your employees</p>
        </div>

        <div>
          <AddEmployee />
        </div>
      </div>
      <Suspense
        fallback={
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-full max-w-sm" />
              <Skeleton className="h-10 w-16" />
            </div>
            <TableSkeleton />
          </div>
        }
      >
        <EmployeesTable />
      </Suspense>
    </div>
  );
}
