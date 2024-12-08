import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Comment from "../Components/Comment";
import Reply from "../Components/Reply";
import {
  getPost,
  getComment,
  updatePost,
  getServerTimestamp,
  getUserName,
  getProfilePicUrl,
  deletePost,
  deleteComment,
  incrementViewCount // <-- Import incrementViewCount
} from "../Scripts/firebase";
import { auth } from "../Firebase";

const Post = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Manage body overflow when modal is open/closed
  useEffect(() => {
    document.body.style.overflow = showDeleteModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showDeleteModal]);

  const loadData = async () => {
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
            lastEdit: postData.lastEdit || postData.timestamp,
            richText: postData.richText || "",
            plainText: postData.plainText || ""
          });
        } else {
          setError("Post not found");
        }
      });

      // Get comments
      await getComment(id, (doc) => {
        if (doc.exists()) {
          const commentData = doc.data();
          const processedComments = Object.entries(commentData).reduce((acc, [key, comment]) => {
            acc[key] = {
              ...comment,
              timestamp: comment.timestamp,
              lastEdit: comment.lastEdit || comment.timestamp
            };
            return acc;
          }, {});
          setComments(processedComments);

          // If comment #1 exists, it might store edited post content
          if (processedComments["1"] && (processedComments["1"].richText || processedComments["1"].plainText)) {
            setPost(prevPost => ({
              ...prevPost,
              richText: processedComments["1"].richText || prevPost.richText,
              plainText: processedComments["1"].plainText || prevPost.plainText
            }));
          }
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading post:", error);
      setError("Failed to load post");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // Increment view count after the post is successfully loaded and is not null
  useEffect(() => {
    if (post && post.key) {
      incrementViewCount(post.key).catch(err => console.error("Error incrementing view count:", err));
    }
  }, [post]);

  const handleNewComment = async (commentText) => {
    try {
      const commentIds = Object.keys(comments).filter(id => id !== "1");
      const nextCommentId = commentIds.length > 0 
        ? Math.max(...commentIds.map(id => parseInt(id))) + 1 
        : 2;
      
      const currentTime = new Date();

      const newComment = {
        author: getUserName(),
        plainText: commentText,
        richText: commentText,
        timestamp: {
          seconds: Math.floor(currentTime.getTime() / 1000),
          nanoseconds: 0
        },
        lastEdit: {
          seconds: Math.floor(currentTime.getTime() / 1000),
          nanoseconds: 0
        },
        profilePicUrl: getProfilePicUrl(),
        id: nextCommentId
      };

      setComments(prevComments => ({
        ...prevComments,
        [nextCommentId]: newComment
      }));

      return nextCommentId;
    } catch (error) {
      console.error("Error handling new comment:", error);
      throw error;
    }
  };

  const toggleCloseCallback = async (postKey) => {
    try {
      if (!post) return;
      const newStatus = post.status === "closed" ? "open" : "closed";
      await updatePost(postKey, { status: newStatus });
      setPost(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error toggling post status:", error);
      setError("Failed to update post status");
    }
  };

  const showDeleteConfirmation = (type, item) => {
    console.log('showDeleteConfirmation called with:', { type, item });
    setDeleteType(type);
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      console.log('handleDelete called with:', { deleteType, itemToDelete, postKey: post.key });
      setIsDeleting(true);
      setError("");
      
      if (deleteType === 'post') {
        console.log('Attempting to delete post with key:', itemToDelete);
        const success = await deletePost(itemToDelete);
        if (success) {
          setShowDeleteModal(false);
          navigate('/');
        }
      } else if (deleteType === 'comment') {
        const { postKey, commentId } = itemToDelete;
        
        const newComments = { ...comments };
        delete newComments[commentId];
        setComments(newComments);

        await deleteComment(postKey, commentId);

        const commentCount = Object.keys(newComments)
          .filter(id => id !== "1")
          .length;

        await updatePost(postKey, { comments: commentCount });
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      setError(error.message || "Failed to delete content");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteCallback = (postKey, commentId) => {
    console.log('deleteCallback called with:', { postKey, commentId });
    if (commentId === 1 || commentId === "1") {
      console.log('Initiating post deletion');
      showDeleteConfirmation('post', postKey);
    } else {
      console.log('Initiating comment deletion');
      showDeleteConfirmation('comment', { postKey, commentId });
    }
  };

  const renderComments = () => {
    return Object.entries(comments)
      .filter(([id]) => id !== "1") 
      .map(([id, comment]) => ({
        ...comment,
        id: parseInt(id)
      }))
      .sort((a, b) => {
        const getTime = (timestamp) => {
          if (timestamp?.seconds) {
            return timestamp.seconds * 1000;
          }
          return new Date(timestamp).getTime();
        };
        return getTime(b.timestamp) - getTime(a.timestamp);
      })
      .map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          post_title={post.title}
          post_status={post.status}
          post_key={post.key}
          toggleCloseCallback={toggleCloseCallback}
          deleteCallback={deleteCallback}
        />
      ));
  };

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-question-circle me-2"></i>
          Post not found
        </div>
      </div>
    );
  }

  const commentCount = Object.keys(comments).filter(id => id !== "1").length;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <Comment
        comment={{ ...post, id: 1 }}
        post_title={post.title}
        post_status={post.status}
        post_key={post.key}
        toggleCloseCallback={toggleCloseCallback}
        deleteCallback={deleteCallback}
      />

      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">
            Comments {commentCount > 0 && `(${commentCount})`}
          </h5>
        </div>

        {post.status !== "closed" && (
          <div className="mb-4">
            <Reply
              post_key={post.key}
              onCommentSubmit={handleNewComment}
              currentUser={auth.currentUser}
            />
          </div>
        )}

        <div className="comments-list">
          {commentCount === 0 ? (
            <div className="text-center text-muted my-4">
              <i className="bi bi-chat-text me-2"></i>
              No comments yet. Be the first to comment!
            </div>
          ) : (
            renderComments()
          )}
        </div>

        {post.status === "closed" && (
          <div className="alert alert-secondary text-center mt-4" role="alert">
            <i className="bi bi-lock me-2"></i>
            This post is closed for new comments
          </div>
        )}
      </div>

      {showDeleteModal && (
        <>
          <div 
            className="modal-backdrop show"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040 
            }}
          />
          <div 
            className="modal show" 
            style={{ 
              display: 'block', 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1050,
              overflow: 'hidden'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isDeleting) {
                setShowDeleteModal(false);
              }
            }}
          >
            <div 
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: '500px' }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {deleteType === 'post' ? 'Delete Post' : 'Delete Comment'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => !isDeleting && setShowDeleteModal(false)}
                    disabled={isDeleting}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    {deleteType === 'post' 
                      ? 'Are you sure you want to delete this post? This action cannot be undone and will delete all comments.'
                      : 'Are you sure you want to delete this comment? This action cannot be undone.'
                    }
                  </p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => !isDeleting && setShowDeleteModal(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;