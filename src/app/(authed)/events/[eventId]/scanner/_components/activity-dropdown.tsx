import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActivitySquareIcon } from "lucide-react";
import RecentButton from "./recent-button";
import UserRecentButton from "./user-recent-button";

type ActivityDropdownProps = {
  eventId: string;
};

export default function ActivityDropdown({ eventId }: ActivityDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ActivitySquareIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Activity Log</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RecentButton eventId={eventId} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserRecentButton eventId={eventId} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
