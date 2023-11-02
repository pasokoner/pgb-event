import { getPageSession } from "@/server/auth";
import HeaderDropdown from "./header-dropdown";
import SidebarToggle from "./sidebar-toggle";

export default async function Header() {
  const session = await getPageSession();

  return (
    <header className="mb-6 flex h-16 w-full items-center bg-white px-4">
      <SidebarToggle />
      <div className="ml-auto">
        {session && <HeaderDropdown initials={session.user.username} />}
      </div>
    </header>
  );
}
