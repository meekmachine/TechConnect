import React, { useState, forwardRef } from "react";
import { Progress } from "reactstrap";
import { uploadToStorage } from "../../Scripts/firebase";
import { TextArea, EditorContainer, Toolbar } from "./StyledComponents";
import "./TextEditor.css";

const TextEditor = forwardRef(({ initialText = "", postKey }, ref) => {
  const [value, setValue] = useState(initialText);
  const [uploadProgress, setUploadProgress] = useState(100);

  // Handle text input changes
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // Handle file uploads
  const handleUpload = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        uploadToStorage(
          postKey,
          file,
          { contentType: file.type },
          (progress) => {
            setUploadProgress(progress);
          },
          (src) => {
            console.log("Image uploaded at: ", src);
          }
        );
      }
    });
  };

  return (
    <EditorContainer>
      <Toolbar>
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </Toolbar>

      <TextArea>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Type something..."
          ref={ref}
          rows="10"
          style={{ width: "100%", padding: "10px", fontSize: "16px", fontFamily: "Arial" }}
        />
      </TextArea>

      {uploadProgress < 100 && <Progress animated value={uploadProgress} />}
    </EditorContainer>
  );
});

export default TextEditor;