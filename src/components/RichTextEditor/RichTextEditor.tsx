"use client";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Strikethrough, Italic, List, ListOrdered } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

const RichTextEditor = ({
  value,
  onChange,
  toolbarOption,
}: {
  value: string;
  onChange: (content: { html: string; text: string }) => void;
  toolbarOption: number;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] max-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2  text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],
    content: value,
    immediatelyRender:false,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      onChange({ html: htmlContent, text: textContent });
    },
  });

  return (
    <>
      {editor ? (
        <RichTextEditorToolbar editor={editor} toolbarOption={toolbarOption} />
      ) : null}
      <EditorContent editor={editor} />
    </>
  );
};

const RichTextEditorToolbar = ({
  editor,
  toolbarOption,
}: {
  editor: Editor;
  toolbarOption: number;
}) => {
  return (
    <div className="border bg-transparent rounded-br-md rounded-bl-md p-1 flex flex-row items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      {toolbarOption >= 1 && (
        <>
          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Toggle>
        </>
      )}

      {toolbarOption === 2 && (
        <>
          <Separator orientation="vertical" className="w-[1px] h-8" />
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </>
      )}
      <Separator orientation="vertical" className="w-[1px] h-8" />
    </div>
  );
};

export default RichTextEditor;
