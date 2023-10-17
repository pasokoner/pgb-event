import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type SidebarLinkProps = {
  path: string;
  name: string;
  children: React.ReactNode;
};

export default function SidebarLink({
  path,
  name,
  children,
}: SidebarLinkProps) {
  const pathname = usePathname();

  const active = pathname.startsWith(path);

  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="lg"
      asChild
      className="w-full justify-start space-x-2 text-base font-medium"
    >
      <Link href={path}>
        {children}

        <span>{name}</span>
      </Link>
    </Button>
  );
}
