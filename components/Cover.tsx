'use client'

import { api } from '@/convex/_generated/api'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useMutation, useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { ImageIcon, X } from 'lucide-react'
import { useCoverImage } from '@/hooks/useCoverImage'
import { useEdgeStore } from '@/lib/edgestore'

interface CoverImageProps {
  documentId: Id<'documents'>
  url?: string
  preview?: boolean
}

const Cover = ({documentId, url, preview}: CoverImageProps) => {
  
  const coverImage = useCoverImage();
  const deleteCoverById = useMutation(api.documents.deleteCoverById);
  const { edgestore } = useEdgeStore()

  const handleRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url
      })
    }
    deleteCoverById({
      documentId
    })
  }

  return (
    <div className={cn('relative w-full h-[38vh] group', url && 'bg-muted', !url && 'h-[18vh] bg-muted')}>
      {!!url && (
        <Image src={url} fill alt='cover image' className='object-cover object-center' />
      )}
      {!preview && url && (
        <div className='absolute bottom-5 right-5 md:opacity-0 md:group-hover:opacity-100 flex items-center gap-2 text-muted-foreground'>
          <Button variant='outline' size='sm' onClick={() => coverImage.onReplace(url)}>
            <ImageIcon className='w-4 h-4 mr-2' />
            Change cover
          </Button> 
          <Button variant='outline' size='sm' onClick={handleRemove}>
            <X className='w-4 h-4 mr-2' />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cover