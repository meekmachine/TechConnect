import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  setPostReference,
  getPostReference,
  getServerTimestamp
} from "../Scripts/firebase";

const Post = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [postKey, setPostKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically create a new post when the component mounts for debugging
    const createNewPost = async () => {
      try {
        console.log("Creating a new post..."); // Log before submission
        setIsSubmitting(true);

        // Generate a new post key/reference
        const newPostRef = getPostReference();

        // Log the new post reference
        console.log("New post reference generated:", newPostRef);

        // Data for the new post
        const newPostData = {
          title: "Debug Post",
          body: "This post is created for debugging purposes.",
          created: getServerTimestamp(),
          author: "Debug Author"
        };

        console.log("Setting post data in Firestore:", newPostData);

        // Set the post in Firestore
        await setPostReference(newPostRef, newPostData, () => {
          console.log("Post successfully created:", newPostRef.id);
          setPostKey(newPostRef.id);
          setIsSubmitting(false);
          navigate(`/post/${newPostRef.id}`); // Redirect to the new post
        });
      } catch (error) {
        console.error("Error creating post:", error);
        setErrorMessage("Failed to create the post. Please try again.");
        setIsSubmitting(false);
      }
    };

    // Call the function to create the post
    createNewPost();
  }, [navigate]);

  return (
    <div className="container">
      <div>
        <div className="panel panel-default">
          <br />
          <div className="panel-heading">
            <h3>Creating a new post...</h3>
          </div>
          <div className="panel-body">
            {isSubmitting && <div className="spinner">Submitting...</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          </div>
          <div className="panel-footer" />
        </div>
      </div>
      <br />
    </div>
  );
};

export default Post;