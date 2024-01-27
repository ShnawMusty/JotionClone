'use client'

import { useQuery } from 'convex/react'
import Title from './Title'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { MenuIcon } from 'lucide-react'
import Banner from './Banner'
import { api } from '@/convex/_generated/api'
import DocumentMenu from './DocumentMenu'
import Publish from './Publish'

interface DocumentNavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

const DocumentNavbar = ({isCollapsed, onResetWidth}: DocumentNavbarProps) => {
  const params = useParams();

  const documentId = decodeURIComponent(params.documentId as string).slice(1) as Id<'documents'>

  const document = useQuery(api.documents.getById, {
    documentId
  });

  if (document === null) {
    return null
  }

  if (document === undefined) {
    return (
      <nav className='w-full flex items-center justify-between gap-4 p-3 bg-background dark:bg-[#1F1F1F]'>
        <Title.Skeleton/>
        <div className='flex items-center gap-2'>
          <DocumentMenu.Skeleton/>
        </div>
      </nav>
    )
  }


  return (
    <>
      <nav className='w-full flex items-center gap-4 p-3 bg-background dark:bg-[#1F1F1F]'>
        {isCollapsed && (
          <MenuIcon role='button' onClick={onResetWidth} className='w-6 h-6 text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm' />
        )}
        <div className='w-full flex items-center justify-between'>
          <Title initialData={document} />
          <div className='flex items-center gap-4'>
            <Publish initialData={document} />
            <DocumentMenu document={document} />
          </div>
        </div>
      </nav>
      {document.isArchived && (
        <Banner documentId={document._id} />
      )}
    </>
  )
}

export default DocumentNavbar