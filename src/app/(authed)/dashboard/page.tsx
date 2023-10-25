import { getPageSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getPageSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <div>DashboardPage</div>;
}
