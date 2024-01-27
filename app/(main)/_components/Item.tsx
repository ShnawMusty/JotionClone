"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

interface ItemProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
}

export const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {

  const { user } = useUser();
  
  const router = useRouter()
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const handleExpand = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    onExpand?.();
  };

  const onCreate = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = create({title: 'Untitled', parentDocument: id})
    .then((documentId) => {
      router.push(`/documents/${'%5E'+documentId}`)
      if (!expanded) {
        onExpand?.();
      }
    }
    );
    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.'
    })
  }

  const onArchive = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = archive({id});
    
    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash.',
      error: 'Failed to archive note.'
    })
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-2 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-semibold",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <span
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1 p-[2px]"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </span>
      )}

      {documentIcon ? (
        <span className="shrink-0 mr-2 text-[18px]">{documentIcon}</span>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <p className="truncate">{label}</p>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[14px] font-medium text-muted-foreground">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <span role="button" className={cn(`opacity-0  group-hover:opacity-100 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 p-[2px]`, isMobile && 'opacity-100'
              )}>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align={isMobile ? 'end' : 'start'} forceMount className="px-2 py-2">
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="w-4 h-4 mr-2 -ml-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <div className="text-xs font-semibold py-1 text-muted-foreground w-full">
                Last edited by: {user?.username}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <span role="button" className={cn("opacity-0 group-hover:opacity-100 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 p-[2px]", isMobile && 'opacity-100')} onClick={onCreate}>
            <Plus className="h-4 w-4 text-muted-foreground " />
          </span>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
