import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Activity from "./activity";

type RecentButtonProps = {
  eventId: string;
};

export default function RecentButton({ eventId }: RecentButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="rounded-sm border-primary bg-gray-50 text-sm text-primary hover:bg-white hover:text-primary sm:text-base"
          size="sm"
          variant="outline"
        >
          Recent Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full max-h-[70vh] flex-col p-3">
        <DialogHeader>
          <DialogTitle>Event Recent Activity</DialogTitle>
        </DialogHeader>

        <Activity eventId={eventId} />
      </DialogContent>
    </Dialog>
  );
}
