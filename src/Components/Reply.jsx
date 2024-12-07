import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import TextEditor from "./TextEditor/TextEditor";
import {
  getPost,
  updatePost,
  pushComment,
  getUserName,
  getProfilePicUrl
} from "../Scripts/firebase";

const ReplyWrapper = (props) => {
  const navigate = useNavigate();
  return <Reply {...props} navigate={navigate} />;
};

class Reply extends Component {
  state = {
    post: undefined,
    post_key: this.props.post_key || "",
    comment_key: "",
    isLoading: false,
    error: "",
    isMounted: false
  };

  editorRef = React.createRef();

  componentDidMount() {
    this.setState({ isLoading: true, isMounted: true });
    
    if (this.props.post_key) {
      getPost(this.props.post_key, doc => {
        if (this.state.isMounted) {
          if (doc.exists()) {
            const postData = doc.data();
            this.setState({
              post: postData,
              post_key: doc.id,
              comment_key: postData.comments + 1,
              isLoading: false,
              error: ""
            });
          } else {
            this.setState({
              isLoading: false,
              error: "Failed to load post data"
            });
          }
        }
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.state.isMounted) return;

    try {
      this.setState({ isLoading: true, error: "" });
      
      const { post_key } = this.state;
      const commentText = this.editorRef.current.getValue();
      
      if (!post_key) {
        this.setState({
          error: "Invalid post reference",
          isLoading: false
        });
        return;
      }
      
      if (!commentText || commentText.trim() === "") {
        this.setState({ 
          error: "Comment text cannot be empty",
          isLoading: false 
        });
        return;
      }

      // Get the next comment ID and update local state through parent component
      const nextCommentId = await this.props.onCommentSubmit(commentText);

      // Create comment data
      const currentTime = new Date();
      const commentData = {
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
        profilePicUrl: getProfilePicUrl()
      };

      // Push the comment to Firebase
      // Optionally handle reactions for the new comment, if needed in future expansions.
      if (commentData.reactions) {
        commentData.reactions = {
          like: 0,
          love: 0,
          laugh: 0
        };
      }
      await pushComment(post_key, nextCommentId, commentData);

      // Update comment count
      await updatePost(
        post_key,
        { comments: nextCommentId }
      );

      // Reset the editor and state
      if (this.state.isMounted) {
        this.setState({ isLoading: false });
        if (this.editorRef.current) {
          this.editorRef.current.setValue("");
        }
      }

    } catch (error) {
      console.error("Error submitting comment:", error);
      if (this.state.isMounted) {
        this.setState({
          error: "Failed to submit comment. Please try again.",
          isLoading: false
        });
      }
    }
  };

  render() {
    const { isLoading, error, post_key } = this.state;
    
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          
          <form onSubmit={this.onSubmit}>
            <div className="form-group mb-3">
              <TextEditor
                ref={this.editorRef}
                postKey={post_key}
                initialText=""
              />
            </div>
            
            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Submit Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ReplyWrapper;
