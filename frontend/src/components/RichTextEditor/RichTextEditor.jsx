import React, { useState } from "react";
import PropTypes from "prop-types";
import "./RichTextEditor.css";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Toolbar from "./Toolbar/EditorToolbar";
import EditorTabs from "./Tabs/EditorTabs";
import CustomTextField from "../TextFieldComponents/CustomTextField/CustomTextField";

const RichTextEditor = ({ sx = {}, previewComponent = null }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [mode, setMode] = useState("editor");
  const [header, setHeader] = useState("");

  const handleHeaderChange = (e) => {
    setHeader(e.target.value);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Heading,
      Link,
      BulletList,
      OrderedList,
    ],
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
  });

  return (
    <div style={sx}>
      {mode === "editor" ? (
        <>
          <CustomTextField
            labelText="Header"
            labelFontWeight={600}
            inputHeight="40px"
            TextFieldWidth={"100%"}
            value={header}
            onChange={handleHeaderChange}
            style={{ marginBottom: "2rem" }}
          />
          <label className="editor-label">Content</label>
          <div className="editor-container">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        React.cloneElement(previewComponent, { header, htmlContent })
      )}
      <EditorTabs mode={mode} setMode={setMode} sx={{ marginTop: "1rem" }} />
    </div>
  );
};

RichTextEditor.propTypes = {
  sx: PropTypes.object,
  previewComponent: PropTypes.node.isRequired,
};

export default RichTextEditor;
