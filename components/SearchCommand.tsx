"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSearch } from "@/hooks/useSearch";
import { useQuery } from "convex/react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchCommand = () => {
  const documents = useQuery(api.documents.getSearch);

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isOpen = useSearch((state) => state.isOpen);
  const onOpen = useSearch((state) => state.onOpen);
  const onClose = useSearch((state) => state.onClose);
  const toggle = useSearch((state) => state.toggle);

  useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  const onSelect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
    onClose();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle]);

  if (!isMounted) {
    return null
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search for a note..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document: Doc<'documents'>) => (
            <CommandItem key={document._id} value={`${document._id}-${document.title}`} title={document.title} onSelect={onSelect}>
              {document.icon ? (
                <span className="text-[18px] mr-2">{document.icon}</span>
              ) : (
                <File className="w-4 h-4 mr-2 text-muted-foreground" />
              )}
              <p className="text-muted-foreground text-sm">{document.title}</p>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
