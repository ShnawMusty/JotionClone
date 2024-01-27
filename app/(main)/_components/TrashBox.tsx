"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ConfirmModal from "../../../components/modals/ConfirmModal";

const TrashBox = () => {
  const params = useSearchParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const onRestore = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    e.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (
    documentId: Id<"documents">
  ) => {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted.",
      error: "Failed to delete note.",
    });
  };

  return (
    <section>
      <div className="flex items-center w-full bg-neutral-100 dark:bg-neutral-600 rounded-md px-2">
        <Search className="h-4 w-4  text-muted-foreground" />
        <Input
          placeholder="Filter by note title..."
          className="bg-inherit border-none focus-visible:ring-0
        focus-visible:ring-offset-0 p-1 "
        />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <p className="hidden last:block text-muted-foreground text-sm">
          No documents found
        </p>
        {documents?.map((document) => (
          <div key={document._id} className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-600 rounded-md px-2">
            <p>{document.title}</p>
            <div className="flex items-center gap-1">
              <span
                role="button"
                onClick={(e) => onRestore(e, document._id)}
                className="rounded-full p-2 hover:bg-neutral-300 "
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </span>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <span
                  role="button"
                  className="rounded-full p-2 hover:bg-neutral-300"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </span>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrashBox;
