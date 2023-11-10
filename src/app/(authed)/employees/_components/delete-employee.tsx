import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteEmployeeProps = {
  id: string;
};

export default function DeleteEmployee({ id }: DeleteEmployeeProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate, isLoading } = api.event.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <Trash2 className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
        </DialogHeader>
        <div className="grid w-full grid-cols-2 gap-x-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isLoading}
              className="border-red-500 text-red-500 hover:border-red-400 hover:text-red-400"
            >
              Close
            </Button>
          </DialogClose>
          <Button disabled={isLoading} onClick={() => mutate({ id: id })}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
