'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { useRef, useState } from "react"

interface TitleProps {
  initialData: Doc<'documents'>
}

const Title = ({initialData}: TitleProps) => {
  const update = useMutation(api.documents.update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData.title)
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setIsEditing(true);
    setTitle(initialData.title);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0);
  }

  const disableInput = () => {
      setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      disableInput()
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    update({id: initialData._id, title: e.target.value || 'Untitled'})
  }

  return (
    <div className="flex items-center gap-1">
      {!!initialData.icon && <span className="text-[18px]">{initialData.icon}</span>}
      {isEditing ? (
        <Input ref={inputRef} value={title} className="h-7 px-2 focus-visible:ring-transparent" onChange={handleChange} onBlur={disableInput} onKeyDown={handleKeyDown}/>
      ) : (
        <Button size="lg" variant="ghost" className="font-normal py-1 px-2 h-auto" onClick={enableInput}>
          <p className="truncate">
          {initialData?.title}
          </p>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="w-24 h-6 rounded-md" />
  )
}


export default Title