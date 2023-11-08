"use client";

import { useOnClickOutside } from "usehooks-ts";
import { useMediaQuery } from "@uidotdev/usehooks";
import SidebarLink from "./sidebar-link";

import {
  BarChartHorizontal,
  Building,
  CalendarCheck2,
  LayoutDashboard,
  UserCog2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarState } from "../_utils/sidebar";
import { useRecoilState } from "recoil";
import SidebarToggle from "./sidebar-toggle";
import { useRef } from "react";

export default function Sidebar() {
  const lg = useMediaQuery("only screen and (min-width: 1024px)");

  const ref = useRef(null);

  const [sidebar, setSidebar] = useRecoilState(sidebarState);

  const handleClickOutside = () => {
    setSidebar((prev) => ({ ...prev, isOpen: false }));
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-60 border-[1px] bg-white transition-transform",
        lg
          ? "translate-x-0"
          : sidebar.isOpen
          ? "translate-x-0"
          : "-translate-x-full",
      )}
      aria-label="Sidebar"
    >
      {!lg && (
        <div className="pl-4 pt-4">
          <SidebarToggle />
        </div>
      )}

      <div className="mb-4 flex items-center justify-center py-6">
        <h1 className="text-center text-2xl font-bold">PGB EVENT</h1>
      </div>

      <div className="h-full space-y-4 overflow-y-auto px-2">
        <div className="space-y-1">
          {/* <SidebarLink name="Dashboard" path="/dashboard">
            <LayoutDashboard className="h-5 w-5" />
          </SidebarLink> */}

          <SidebarLink name="Events" path="/events">
            <CalendarCheck2 className="h-5 w-5" />
          </SidebarLink>

          <SidebarLink name="Employees" path="/employees">
            <Users className="h-5 w-5" />
          </SidebarLink>

          <SidebarLink name="Offices" path="/offices">
            <Building className="h-5 w-5" />
          </SidebarLink>

          <SidebarLink name="Generate Report" path="/generate-report">
            <BarChartHorizontal className="h-5 w-5" />
          </SidebarLink>

          <SidebarLink name="Users" path="/users">
            <UserCog2 className="h-5 w-5" />
          </SidebarLink>
        </div>
      </div>
    </aside>
  );
}
