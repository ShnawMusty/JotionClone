'use client'

import { useCoverImage } from "@/hooks/useCoverImage"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { SingleImageDropzone } from "../singleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";


const CoverImageModal = () => {
  const params = useParams()
  const documentId = decodeURIComponent(params.documentId as string).slice(1) as Id<'documents'>
  
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();
  const updateCoverImage = useMutation(api.documents.update);

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url
        }
      });

      await updateCoverImage({
        id: documentId,
        coverImage: res.url
      });

      setFile(undefined);
      setIsSubmitting(false);
      coverImage.onClose();
    }
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose} >
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone disabled={isSubmitting} value={file} onChange={onChange} className="w-full outline-none"/>
      </DialogContent>
    </Dialog>
  )
}

export default CoverImageModal