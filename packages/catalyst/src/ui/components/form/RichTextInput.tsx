"use client";

import { IconBold, IconItalic } from "@tabler/icons-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { memo } from "react";

type Props = {
  label: string;
  onChange: (value: string) => void;
  defaultValue: string;
};

export const RichTextInput: React.FC<Props> = memo(
  function RichTextInput(props) {
    const id = `richtext-${props.label}`;

    const editor = useEditor({
      extensions: [StarterKit],
      content: props.defaultValue,
      editorProps: {
        attributes: {
          class: "p-2 h-32 overflow-y-scroll focus:outline-none",
          id,
        },
      },
      onUpdate: ({ editor }) => {
        props.onChange(editor.getHTML());
      },
    });

    return (
      <div>
        <label htmlFor={id} className="text-gray-600 font-semibold mb-1 block">
          {props.label}
        </label>
        {editor && (
          <div className="border border-gray-300 rounded bg-white">
            <div className="flex items-center gap-2 p-2 border-b border-gray-300 bg-gray-200">
              <button
                onClick={editor.commands.toggleBold}
                type="button"
                className={
                  editor.isActive("bold") ? "text-black" : "text-gray-400"
                }
              >
                <IconBold className="w-5 h-5" />
              </button>
              <button
                onClick={editor.commands.toggleItalic}
                type="button"
                className={
                  editor.isActive("italic") ? "text-black" : "text-gray-400"
                }
              >
                <IconItalic className="w-5 h-5" />
              </button>
            </div>
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    );
  },
  () => true
);
