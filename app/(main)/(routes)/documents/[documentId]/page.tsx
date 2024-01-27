'use client'

import Cover from "@/components/Cover";
import Toolbar from "@/components/Toolbar";
import { Spinner } from "@/components/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useMemo } from "react";


interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

const DocumentIdPage = ({params}: DocumentIdPageProps) => {
  const Editor = useMemo(() => 
  dynamic(() => import('@/components/Editor') ,{
    ssr: false
  })
  , [])
  const documentId = decodeURIComponent(params.documentId as string).slice(1) as Id<'documents'>

  const document = useQuery(api.documents.getById, {
    documentId
  });

  const update = useMutation(api.documents.update)

  const onChange = (content: string) => {
    setTimeout(() => {
      update({
        id: documentId,
        content
      })
    }, 3000)
  }

  if (document === undefined) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size='lg'/>
      </div>
      )
    }
    
    if (document === null) {
      notFound()
    }
  
  return (
    <div>
      <Cover url={document.coverImage} documentId={document._id}/>
      <div className="px-20 py-6 space-y-4">
      <Toolbar initialData={document} />
      <Editor onChange={onChange} initialContent={document.content}/>
      </div>
    </div>
  )
}

export default DocumentIdPage