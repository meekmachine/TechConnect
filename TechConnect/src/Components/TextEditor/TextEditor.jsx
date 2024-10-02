import React, { useState, useCallback } from "react";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { Transforms, createEditor } from "slate";
import Html from "slate-html-serializer";
import { Progress } from "reactstrap";
import { uploadToStorage } from "../../Scripts/firebase";
import { TextArea, EditorContainer, Button, Icon, Toolbar, Image } from "./StyledComponents";
import "./TextEditor.css";

// Define block tags and mark tags
const BLOCK_TAGS = {
  p: "paragraph",
  blockquote: "blockquote",
  pre: "code",
  h1: "heading-one",
  h2: "heading-two",
  ol: "numbered-list",
  ul: "bulleted-list",
  li: "list-item",
  a: "link",
  img: "image"
};

const MARK_TAGS = {
  em: "italic",
  strong: "bold",
  u: "underlined"
};

// HTML serializer
const rules = [
  // Deserialization and serialization rules...
];

const html = new Html({ rules });

const TextEditor = ({ initialRichText = "", post_key }) => {
  const [value, setValue] = useState(html.deserialize(initialRichText));
  const [uploadProgress, setUploadProgress] = useState(100);
  const editor = useCallback(() => withReact(createEditor()), []);

  const onChange = (newValue) => setValue(newValue);

  const handleUpload = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        uploadToStorage(
          post_key,
          file,
          { contentType: file.type },
          (progress) => setUploadProgress(progress),
          (src) => Transforms.insertNodes(editor, { type: "image", data: { src }, isVoid: true })
        );
      }
    });
  };

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Transforms.unsetNodes(editor, format, { match: n => Text.isText(n), split: true });
    } else {
      Transforms.setNodes(editor, { [format]: true }, { match: n => Text.isText(n), split: true });
    }
  };

  const renderLeaf = (props) => {
    let { attributes, children, leaf } = props;
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underlined) children = <u>{children}</u>;
    return <span {...attributes}>{children}</span>;
  };

  const renderElement = (props) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case "image":
        return <Image src={element.data.src} {...attributes} />;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  return (
    <EditorContainer>
      <Toolbar>
        {["bold", "italic", "underlined"].map((type) => (
          <Button key={type} onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, type);
          }}>
            <Icon>{type}</Icon>
          </Button>
        ))}
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </Toolbar>

      <TextArea>
        <Slate editor={editor} value={value} onChange={onChange}>
          <Editable
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            placeholder="Type something..."
          />
        </Slate>
      </TextArea>

      {uploadProgress < 100 && <Progress animated value={uploadProgress} />}
    </EditorContainer>
  );
};

export default TextEditor;