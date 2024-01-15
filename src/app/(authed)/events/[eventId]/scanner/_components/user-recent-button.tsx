import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Activity from "./activity";

type UserRecentButtonProps = {
  eventId: string;
};

export default function UserRecentButton({ eventId }: UserRecentButtonProps) {
  return (
    <Dialog>
      <DialogTrigger>Your Activity</DialogTrigger>
      <DialogContent className="flex h-full max-h-[70vh] flex-col p-3">
        <DialogHeader>
          <DialogTitle>Your Recent Activity</DialogTitle>
        </DialogHeader>

        <Activity eventId={eventId} onlyUser />
      </DialogContent>
    </Dialog>
  );
}
