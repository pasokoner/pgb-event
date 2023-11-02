"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="min-h-[50vh] w-full" />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
