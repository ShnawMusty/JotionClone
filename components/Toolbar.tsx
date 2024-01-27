'use client'

import { Doc } from "@/convex/_generated/dataModel"
import IconPicker from "./iconPicker"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "./ui/button"
import { ImageIcon, Smile, X } from "lucide-react"
import { ElementRef, useRef, useState } from "react"
import TextareaAutosize from 'react-textarea-autosize'
import { useCoverImage } from "@/hooks/useCoverImage"

interface ToolbarProps {
  initialData: Doc<'documents'>
  preview?: Boolean
}

const Toolbar = ({initialData, preview}: ToolbarProps) => {
  const removeIcon = useMutation(api.documents.removeIcon);
  const update = useMutation(api.documents.update);

  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const coverImage = useCoverImage();
  

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
    }, 0)
  }

  const disableInput = () => setIsEditing(false);
  
  const onInput = (value: string) => {
    setValue(value);
    update({id: initialData._id, title: value || 'Untitled'})
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  }

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon
    })
  }

  const onIconRemove = () => {
    removeIcon({
      id: initialData._id
    })
  }

  return (
    <section className="group pl-14">

    {preview && !!initialData.icon && (
      <span className="text-6xl pt-2">{initialData.icon}</span>
    )}

    {!preview && !!initialData.icon && (
      <div className="flex gap-2 group/icon">
      <IconPicker onChange={onIconSelect}>
        <span className="text-6xl transition hover:opacity-75">{initialData.icon}</span>
      </IconPicker>
      <Button size='sm' variant='outline' className="opacity-0 group-hover/icon:opacity-100 text-muted-foreground p-2 rounded-full" onClick={onIconRemove}>
        <X className="w-4 h-4 " />
      </Button>
      </div>
    )}

    <div className="opacity-100 group-hover:opacity-100 flex items-center gap-1 pt-4 pb-1">
    {!preview && !initialData.icon && (
      <IconPicker asChild onChange={onIconSelect}>
        <Button className="text-muted-foreground" variant='outline' size='sm'>
          <Smile className="w-4 h-4 mr-2" />
          Add icon
        </Button>
      </IconPicker>
    )}
    {!preview && !initialData.coverImage && (
      <Button className="text-muted-foreground" variant='outline' size='sm' onClick={coverImage.onOpen}>
        <ImageIcon className="w-4 h-4 mr-2" />
        Add cover
      </Button>
    )}
    </div>

    {!preview && isEditing ? (
      <TextareaAutosize
      ref={inputRef}
      onBlur={disableInput}
      onKeyDown={onKeyDown}
      value={value}
      onChange={(e) => onInput(e.target.value)}
      className="text-4xl max-w-2xl font-bold break-words outline-none resize-none bg-gray-100/50 px-2 rounded-lg"
      />
    ) : (
      <p className="text-4xl font-bold break-words outline-none" onClick={enableInput}>{initialData.title}</p>
    )}
    </section>
  )
}

export default Toolbar