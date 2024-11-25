import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Comment from "../Components/Comment";
import Reply from "../Components/Reply";
import {
  getPost,
  getComment
} from "../Scripts/firebase";

const Post = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showReply, setShowReply] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Get post data
        await getPost(id, (doc) => {
          if (doc.exists()) {
            const postData = doc.data();
            setPost({
              ...postData,
              key: doc.id,
              timestamp: postData.timestamp,
              lastEdit: postData.lastEdit || postData.timestamp
            });
          } else {
            setError("Post not found");
          }
        });

        // Get comments
        await getComment(id, (doc) => {
          if (doc.exists()) {
            const commentData = doc.data();
            // Ensure each comment has proper timestamp fields
            const processedComments = Object.entries(commentData).reduce((acc, [key, comment]) => {
              acc[key] = {
                ...comment,
                timestamp: comment.timestamp,
                lastEdit: comment.lastEdit || comment.timestamp
              };
              return acc;
            }, {});
            setComments(processedComments);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading post:", error);
        setError("Failed to load post");
        setIsLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id]);

  const toggleShowReply = () => {
    setShowReply(!showReply);
  };

  const toggleCloseCallback = async (postKey) => {
    // Implement post close/open functionality if needed
    console.log("Toggle close for post:", postKey);
  };

  const deleteCallback = async (postKey, commentId) => {
    // Implement delete functionality if needed
    console.log("Delete comment:", postKey, commentId);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="alert alert-warning">Post not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Main post */}
      <Comment
        comment={{ ...post, id: 1 }}
        post_title={post.title}
        post_status={post.status}
        post_key={post.key}
        toggleCloseCallback={toggleCloseCallback}
        deleteCallback={deleteCallback}
      />

      {/* Comments section */}
      {Object.entries(comments)
        .filter(([id]) => id !== "1") // Filter out the main post which is stored as comment "1"
        .map(([id, comment]) => (
          <Comment
            key={id}
            comment={{ ...comment, id: parseInt(id) }}
            post_title={post.title}
            post_status={post.status}
            post_key={post.key}
            toggleCloseCallback={toggleCloseCallback}
            deleteCallback={deleteCallback}
          />
        ))}

      {/* Reply section */}
      {post.status !== "closed" && !showReply && (
        <div className="text-center mt-3 mb-3">
          <button 
            className="btn btn-primary" 
            onClick={toggleShowReply}
          >
            Reply to Post
          </button>
        </div>
      )}

      {showReply && (
        <Reply
          post_key={post.key}
          toggleShowReply={toggleShowReply}
        />
      )}
    </div>
  );
};

export default Post;