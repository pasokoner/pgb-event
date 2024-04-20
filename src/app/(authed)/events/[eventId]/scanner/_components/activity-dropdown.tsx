import {
  DropdownMenu,
  DropdownMenuContent,
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
        {/* <DropdownMenuItem>
        </DropdownMenuItem>
        <DropdownMenuItem>
        </DropdownMenuItem> */}
        <div className="flex flex-col gap-2">
          <RecentButton eventId={eventId} />
          <UserRecentButton eventId={eventId} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
