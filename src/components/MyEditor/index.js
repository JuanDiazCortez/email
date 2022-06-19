import React, { Fragment } from "react";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

import { useEditor, EditorContent } from "@tiptap/react";
// import {StarterKit} from "@tiptap/starter-kit";
// import ReactComponent from "./Extension.js";
// import "./styles.scss";
import "./toolbar.css";
import {
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faListUl,
  faListOl,
  faQuoteLeft,
  faGripHorizontal,
  faUndoAlt,
  faRedoAlt,
  faParagraph,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faHighlighter
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Fragment>
      <div
        className="d-flex  flex-row flex-wrap"
        id="edit-toolbar"
        style={{ backgroundColor: "cadetblue" }}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Bold"
            role="button"
            icon={faBold}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Italic"
            role="button"
            icon={faItalic}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="strike"
            role="button"
            icon={faStrikethrough}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Code"
            role="button"
            icon={faCode}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Code"
            role="button"
            icon={faParagraph}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          h3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          h4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          h5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          h6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="List"
            role="button"
            icon={faListUl}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Order List"
            role="button"
            icon={faListOl}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Quotes"
            role="button"
            icon={faQuoteLeft}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Quotes"
            role="button"
            icon={faHighlighter}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Quotes"
            role="button"
            icon={faGripHorizontal}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Quotes"
            role="button"
            icon={faParagraph}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Undo"
            role="button"
            icon={faUndoAlt}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Redo"
            role="button"
            icon={faRedoAlt}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="A. Left"
            role="button"
            icon={faAlignLeft}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="A. Left"
            role="button"
            icon={faAlignCenter}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="A. Right"
            role="button"
            icon={faAlignRight}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <FontAwesomeIcon
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="A. Justify"
            role="button"
            icon={faAlignJustify}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
        </button>
      </div>
    </Fragment>
  );
};
const MyEditor = ({ texto, onChangeContent }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Image,
//      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Highlight
    ],
    content: texto,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChangeContent(json);
      // send the content to an API here
    },
    onCreate: ({ editor }) => {
      const json = editor.getJSON();
      console.log("onCreate");
      console.log(json);
      // send the content to an API here
    }
  });

  return (
    <div className="element">
      <MenuBar editor={editor} />
      <EditorContent
        className="h-75 p-3 mt-5"
        editor={editor}
        style={{
          minHeight: "40rem"
        }}
      />
    </div>
  );
};

export default MyEditor;
