"use client";

import { Button } from "@/components/ui/button";
import { type EventStatus } from "@prisma/client";
import { Play, Square, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type EventButtonsProps = {
  status: EventStatus;
  id: string;
};

export default function EventButtons({ status, id }: EventButtonsProps) {
  const utils = api.useContext();

  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<EventStatus>(status);
  const [late, setLate] = useState(format(new Date(), "HH:mm"));

  const { mutate: updateStatus, isLoading: isUpdating } =
    api.event.updateStatus.useMutation({
      onSuccess: async () => {
        await utils.event.eventById.invalidate(id);
        setOpen(false);
      },
    });

  const { mutate: startEvent, isLoading: isStarting } =
    api.event.startEvent.useMutation({
      onSuccess: async () => {
        await utils.event.eventById.invalidate(id);
        setOpen(false);
      },
    });

  function setStatus(status: EventStatus) {
    setOpen(true);
    setNewStatus(status);
  }

  function onConfirm() {
    if (newStatus === "ONGOING") {
      startEvent({ status: newStatus, id, late });
    }

    updateStatus({ status: newStatus, id });
  }

  return (
    <>
      {status === "UPCOMING" && (
        <>
          <Button
            size="sm"
            className="border-red-500 text-red-500 hover:border-red-400 hover:text-red-400"
            onClick={() => setStatus("CANCELLED")}
            variant="outline"
          >
            <X className="mr-1 h-5 w-5" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => setStatus("ONGOING")}
            className="bg-green-500 hover:bg-green-400"
          >
            <Play className="mr-1 h-5 w-5" />
            Start
          </Button>
        </>
      )}

      {status === "ONGOING" && (
        <>
          <Button
            size="sm"
            onClick={() => setStatus("CANCELLED")}
            className="border-red-500 text-red-500 hover:border-red-400 hover:text-red-400"
            variant="outline"
          >
            <X className="mr-1 h-5 w-5" />
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setStatus("ENDED")}
          >
            <Square className="mr-1 h-5 w-5" />
            End
          </Button>
        </>
      )}

      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          {newStatus === "ONGOING" && (
            <div className="text-sm text-gray-600">Set time for latecomers</div>
          )}
          <div className="grid w-full grid-cols-2 gap-2">
            {newStatus === "ONGOING" && (
              <Input
                type="time"
                defaultValue={late}
                className="col-span-2"
                onChange={(v) => setLate(v.currentTarget.value)}
              />
            )}

            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isUpdating || isStarting}
                className="border-red-500 text-red-500 hover:border-red-400 hover:text-red-400"
              >
                Close
              </Button>
            </DialogClose>
            <Button disabled={isUpdating || isStarting} onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
