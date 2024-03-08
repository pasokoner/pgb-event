import { api } from "@/trpc/react";
import React, { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";
import { format } from "date-fns";

type AdjustLateProps = {
  id: string;
  defaultLate: Date;
};

export default function AdjustLate({ id, defaultLate }: AdjustLateProps) {
  const utils = api.useContext();

  const { mutate: updateLate, isLoading: isUpdating } =
    api.event.updateLate.useMutation({
      onSuccess: async () => {
        await utils.event.eventById.invalidate(id);
        setOpen(false);
      },
    });

  const [open, setOpen] = useState(false);
  const [late, setLate] = useState(format(defaultLate, "yyyy-MM-dd hh:mm"));

  function onConfirm() {
    updateLate({ id, date: new Date(late) });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button>
          <ClockIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-600">Set time for latecomers</div>
        <div className="grid w-full grid-cols-2 gap-2">
          <Input
            type="datetime-local"
            value={late}
            className="col-span-2"
            onChange={(v) => setLate(v.target.value)}
          />

          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isUpdating}
              className="border-red-500 text-red-500 hover:border-red-400 hover:text-red-400"
            >
              Close
            </Button>
          </DialogClose>
          <Button disabled={isUpdating} onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
