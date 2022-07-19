import React, { Fragment } from "react";

import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import ReactComponent from "./Extension.js";
import EditorBar from "../EditorBar";

const MyEditor = ({ texto, onChangeContent, position }) => {
  // console.log(`MyEditor texto ${texto}`);
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      TextStyle,
      Image,
      TextAlign,
      StarterKit,
      Color,
      Highlight,
    ],
    content: texto,
    onUpdate: ({ editor }) => {
      const json = editor.getHTML();
      console.log(json);
      onChangeContent(json);
      // send the content to an API here
    },
    onCreate: ({ editor }) => {
      const json = editor.getHTML();
      console.log("onCreate");
      // send the content to an API here
    },
  });

  return (
    <div className="element">
      <EditorBar editor={editor} />
      <div
        style={{
          marginTop: position,
        }}
      >
        <EditorContent
          className="h-75 p-3 mt-5"
          editor={editor}
          style={{
            // minHeight: "40rem",
            marginTop: position,
          }}
        />
      </div>
    </div>
  );
};

export default MyEditor;
