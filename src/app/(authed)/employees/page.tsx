import { getPageSession } from "@/server/auth";
import AddEmployee from "./_components/add-employee";
import EmployeeTable from "./_components/employee-table";
import { redirect } from "next/navigation";

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
      <EmployeeTable />
    </div>
  );
}
