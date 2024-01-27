'use client'

import { Button } from '@/components/ui/button'
import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/modals/ConfirmModal'

interface BannerProps {
  documentId: Id<"documents">
}

const Banner = ({documentId}: BannerProps) => {

  const document = useQuery(api.documents.getById, {
    documentId
  });
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);
  const deleteCoverById = useMutation(api.documents.deleteCoverById)
  const router = useRouter();

  const handleRemove = () => {
    if (document?.coverImage) {
      deleteCoverById({
        documentId
      })
    };
    const promise = remove({id: documentId});

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted.',
      error: 'Failed to delete note.'
    });
    
    router.push('/documents')
  }

  const handleRestore = () => {
    const promise = restore({id: documentId})

    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored.',
      error: 'Failed to restore note.'
    })
  }

  return (
    <div className='bg-rose-500 flex items-center justify-center gap-3 text-sm text-center text-white py-2'>
            <p className='whitespace-nowrap'>This page is in the Trash.</p>
            <Button variant='outline' size='sm' className='bg-transparent border-white px-2 ' onClick={handleRestore}>
              Restore page
            </Button>
            <ConfirmModal onConfirm={handleRemove}>
            <Button variant='outline' size='sm' className='bg-transparent px-2  border-white ' >
              Delete forever
            </Button>
            </ConfirmModal>
        </div>
  )
}

export default Banner