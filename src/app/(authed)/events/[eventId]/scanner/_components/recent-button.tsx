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
      <DialogTrigger>Recent Activity</DialogTrigger>
      <DialogContent className="flex h-full max-h-[70vh] flex-col p-3">
        <DialogHeader>
          <DialogTitle>Event Recent Activity</DialogTitle>
        </DialogHeader>

        <Activity eventId={eventId} />
      </DialogContent>
    </Dialog>
  );
}
