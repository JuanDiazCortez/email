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

import "../components/MyEditor/toolbar.css";
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
  faHighlighter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditorBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Fragment>
      <div
        id="id-toolbar-email"
        style={{
          background:
            "rgba(0, 0, 0, 0) linear-gradient(rgb(159, 238, 220), rgb(28, 205, 196)) repeat scroll 0% 0%",
        }}
      >
        <div className="d-flex  flex-row flex-wrap" id="edit-toolbar">
          <div>
            <input
              type="color"
              onInput={(event) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
              value={editor.getAttributes("textStyle").color}
            />
            <button
              onClick={() => editor.chain().focus().setColor("#958DF1").run()}
              className={
                editor.isActive("textStyle", { color: "#958DF1" })
                  ? "is-active"
                  : ""
              }
            >
              purple
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#F98181").run()}
              className={
                editor.isActive("textStyle", { color: "#F98181" })
                  ? "is-active"
                  : ""
              }
            >
              red
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#FBBC88").run()}
              className={
                editor.isActive("textStyle", { color: "#FBBC88" })
                  ? "is-active"
                  : ""
              }
            >
              orange
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#FAF594").run()}
              className={
                editor.isActive("textStyle", { color: "#FAF594" })
                  ? "is-active"
                  : ""
              }
            >
              yellow
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#70CFF8").run()}
              className={
                editor.isActive("textStyle", { color: "#70CFF8" })
                  ? "is-active"
                  : ""
              }
            >
              blue
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#94FADB").run()}
              className={
                editor.isActive("textStyle", { color: "#94FADB" })
                  ? "is-active"
                  : ""
              }
            >
              teal
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#B9F18D").run()}
              className={
                editor.isActive("textStyle", { color: "#B9F18D" })
                  ? "is-active"
                  : ""
              }
            >
              green
            </button>
            <button onClick={() => editor.chain().focus().unsetColor().run()}>
              unsetColor
            </button>
          </div>
        </div>
        <div>
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
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
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
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
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
      </div>
    </Fragment>
  );
};
export default EditorBar;
