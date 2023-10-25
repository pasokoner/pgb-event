import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AddEmployee() {
  return (
    <Button size="sm" className="rounded-sm">
      <UserPlus className="mr-2" />
      Add Employee
    </Button>
  );
}
