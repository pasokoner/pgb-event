import { atom } from "recoil";

export interface SidebarState {
  isOpen: boolean;
}

export const sidebarState = atom({
  key: "sidebarState",
  default: { isOpen: false } as SidebarState,
});
