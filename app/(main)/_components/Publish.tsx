import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import useOrigin from "@/hooks/useOrigin";
import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface PublishProps {
  initialData: Doc<"documents">;
}

const Publish = ({ initialData }: PublishProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const origin = useOrigin();
  const url = `${origin}/preview/${initialData._id}`;

  const update = useMutation(api.documents.update);

  const onPublish = () => {
    setIsSubmitting(true);
    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note published!",
      error: "Failed to publish note.",
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);
    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Note unpublished!",
      error: "Failed to unpublish note.",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Publish
          {initialData.isPublished && (
            <Globe className="w-4 h-4 text-sky-500 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-center gap-2 text-sky-500">
              <Globe className="h-6 w-6 animate-pulse" />
              <p className="font-medium text-sm">
                This note is live on the web.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <input value={url} disabled className="flex-1 px-2 text-sm border rounded-l-md h-8 bg-muted truncate"/>
              <Button size='sm' onClick={onCopy} disabled={isCopied} className="h-8 rounded-l-none">
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              size='sm'
              className="w-full"
              onClick={onUnpublish}
              disabled={isSubmitting}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Globe className="w-8 h-8 text-muted-foreground" />
            <h3 className="font-medium text-sm">Publish this note</h3>
            <p className="text-muted-foreground mb-2 text-sm font-semibold">
              Share your work with others.
            </p>
            <Button
              size="sm"
              className="w-full text-sm"
              disabled={isSubmitting}
              onClick={onPublish}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
