"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LuciaForm from "@/components/lucia-form";

type HeaderDropdownProps = {
  initials: string;
};

export default function HeaderDropdown({ initials }: HeaderDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-7 w-7 rounded-full bg-primary uppercase text-white hover:bg-primary/90">
        {initials[0]}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LuciaForm action="/api/auth/logout">
            <input type="submit" value="Sign out" />
          </LuciaForm>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
