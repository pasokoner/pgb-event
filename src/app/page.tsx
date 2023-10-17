import { getPageSession } from "@/server/auth";
import Hey from "./_components/hey";

export default async function Home() {
  const session = await getPageSession();

  return (
    <div>
      <Hey></Hey>
      {JSON.stringify(session)}
    </div>
  );
}
