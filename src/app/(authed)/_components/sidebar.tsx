"use client";

import SidebarLink from "./sidebar-link";

import { CalendarCheck2, LayoutDashboard, Users } from "lucide-react";

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-60 -translate-x-full border-[1px] bg-white transition-transform lg:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="mb-4 flex items-center justify-center py-6">
        <h1 className="text-center text-2xl font-bold">PGB EVENT</h1>
      </div>

      <div className="h-full space-y-4 overflow-y-auto px-2">
        <div className="space-y-1">
          <SidebarLink name="Dashboard" path="/dashboard">
            <LayoutDashboard className="h-5 w-5" />
          </SidebarLink>

          <SidebarLink name="Employees" path="/employees">
            <Users className="h-5 w-5" />
          </SidebarLink>

          <SidebarLink name="Events" path="/events">
            <CalendarCheck2 className="h-5 w-5" />
          </SidebarLink>
        </div>
      </div>
    </aside>
  );
}
