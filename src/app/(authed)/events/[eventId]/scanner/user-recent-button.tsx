import { Button } from "@/components/ui/button";
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
      <DialogTrigger asChild>
        <Button
          className="rounded-sm border-primary bg-gray-50 text-sm text-primary hover:bg-white hover:text-primary sm:text-base"
          size="sm"
          variant="outline"
        >
          Your Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full max-h-[70vh] flex-col p-3">
        <DialogHeader>
          <DialogTitle>Your Recent Activity</DialogTitle>
        </DialogHeader>

        <Activity eventId={eventId} onlyUser />
      </DialogContent>
    </Dialog>
  );
}
