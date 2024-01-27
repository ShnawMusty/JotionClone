import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

interface DocumentMenuProps {
  document: Doc<"documents">;
}

const DocumentMenu = ({ document }: DocumentMenuProps) => {
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const archive = useMutation(api.documents.archive);

  const onArchive = () => {
    const promise = archive({ id: document._id });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note archived!",
      error: "Failed to archive note.",
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          role="button"
          className="group-hover:opacity-100 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 p-1"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        forceMount
        className="px-2 py-2"
      >
        <DropdownMenuItem onClick={onArchive} disabled={document?.isArchived} className={cn(document.isArchived && 'hover:cursor-wait')}>
          <Trash className="w-4 h-4 mr-2 -ml-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs font-semibold py-1 text-muted-foreground w-full">
          Last edited by: {user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DocumentMenu.Skeleton = function DocumentMenuSkeleton() {
  return (
    <Skeleton className="w-5 h-5 rounded-full p-1" />
  )
}

export default DocumentMenu;
