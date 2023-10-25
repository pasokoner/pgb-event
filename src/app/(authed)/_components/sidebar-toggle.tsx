"use client";

import { useSetRecoilState } from "recoil";
import { sidebarState } from "../_utils/sidebar";

import { MenuIcon } from "lucide-react";

export default function SidebarToggle() {
  const setSidebar = useSetRecoilState(sidebarState);

  return (
    <button
      data-drawer-target="logo-sidebar"
      data-drawer-toggle="logo-sidebar"
      aria-controls="logo-sidebar"
      type="button"
      className="hover:bg-main-blue focus:bg-main-blue inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:text-gray-400 focus:text-gray-400 focus:outline-none focus:ring-2 lg:hidden"
      onClick={() => setSidebar((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
    >
      <span className="sr-only">Open sidebar</span>
      <MenuIcon className="h-6 w-6" />
    </button>
  );
}
