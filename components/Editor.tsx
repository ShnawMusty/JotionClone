'use client'

import { useEdgeStore } from "@/lib/edgestore";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {useBlockNote, BlockNoteView } from "@blocknote/react"
import { useTheme } from "next-themes";
import "@blocknote/core/style.css";


interface EditorProps {
  editable?: boolean
  initialContent?: string
  onChange: (value: string) => void
}

const Editor = ({onChange,editable,initialContent}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const handleUpload = async (file: File) => {
      const res = await edgestore.publicFiles.upload({
        file
      })
      return res.url
  }

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleUpload
  })
  return (
    <>
      <BlockNoteView editor={editor} theme={resolvedTheme === "dark" ? "dark" : "light"}/>
    </>
  )
}

export default Editor