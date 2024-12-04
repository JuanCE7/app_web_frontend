"use client";
import { useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, List, ListOrdered } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

export const RichTextEditor = ({
  value,
  onChange,
  toolbarOption,
  data_test,
}: {
  value: string;
  onChange: (content: { html: string; text: string }) => void;
  toolbarOption: number;
  data_test: string;
}) => {
  if (typeof window === "undefined") {
    return null;
  }

  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] max-h-[150px] w-full rounded-md border px-3 py-2 text-sm overflow-auto",
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-4" },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-4" },
        },
      }),
    ],
    content: value ?? "",
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const textContent = editor.getText();
      onChange({ html: htmlContent, text: textContent });
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null; // Retorna null si el editor aún no está listo
  }
  return (
    <>
      {editor ? (
        <RichTextEditorToolbar editor={editor} toolbarOption={toolbarOption} />
      ) : null}
      <EditorContent editor={editor} data-testid={data_test} />
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
    <div className="border bg-transparent rounded p-1 flex gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      {toolbarOption >= 1 && (
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>
      )}
      {toolbarOption === 2 && (
        <>
          <Separator orientation="vertical" className="w-[1px] h-8" />
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
        </>
      )}
    </div>
  );
};

export default RichTextEditor;
