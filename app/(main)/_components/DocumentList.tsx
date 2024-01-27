'use client'

import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Item } from "./Item"
import { FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"


interface DocumentListProps {
  parentDocumentId?: Id<"documents">
  level?: number
  data?: Doc<"documents">[]
}

const DocumentList = ({ parentDocumentId, level = 0}: DocumentListProps) => {

  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpanded = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }))
  };
  
  const onRedirect = (documentId: string) => {
    router.push(`/documents/^${documentId}`)
  }

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId
  });

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />

      </>
    )
  }

  return (
    <>
      <p style={{paddingLeft: level ? `${(level * 12) + 25}px` : undefined}} className={cn('hidden text-sm font-medium text-muted-foreground/80', expanded && 'last:block', level === 0 && 'hidden')}>
        No pages inside
      </p>
      {documents?.map((document) => (
        <div key={document._id}>
          <Item 
          id={document._id}
          label={document.title}
          icon={FileIcon}
          documentIcon={document.icon}
          active={params.documentId === document._id}
          level={level}
          onClick={() => onRedirect(document._id)}
          expanded={expanded[document._id]}
          onExpand={() => onExpanded(document._id)}  />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  )
}

export default DocumentList