import React, { Component } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import TextEditor from "./TextEditor/TextEditor";
import {
  getPost,
  getComment,
  getServerTimestamp,
  updatePost,
  updateComment
} from "../Scripts/firebase";

// Wrapper component to provide router hooks to class component
const EditWrapper = () => {
  const params = useParams();
  const navigate = useNavigate();
  return <Edit params={params} navigate={navigate} />;
};

class Edit extends Component {
  state = {
    title: "",
    plainText: "",
    richText: "",
    isLoading: true,
    error: "",
    post_key: this.props.params.postkey,
    originalData: null
  };

  editorRef = React.createRef();
  editingPost = this.props.params.commentid === "1";

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    try {
      const { postkey, commentid } = this.props.params;

      if (this.editingPost) {
        // If editing the main post, get post data
        await getPost(postkey, doc => {
          if (doc.exists()) {
            const postData = doc.data();
            this.setState({
              title: postData.title,
              plainText: postData.plainText || "",
              richText: postData.richText || "",
              originalData: postData,
              isLoading: false
            });
          } else {
            this.setState({
              error: "Post not found",
              isLoading: false
            });
          }
        });
      } else {
        // If editing a comment, get comment data
        await getComment(postkey, doc => {
          if (doc.exists() && doc.data()[commentid]) {
            const commentData = doc.data()[commentid];
            this.setState({
              plainText: commentData.plainText,
              richText: commentData.richText,
              originalData: commentData,
              isLoading: false
            });
          } else {
            this.setState({
              error: "Comment not found",
              isLoading: false
            });
          }
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
      this.setState({
        error: "Failed to load content",
        isLoading: false
      });
    }
  };

  onChangeTitle = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      this.setState({ isLoading: true, error: "" });
      
      const { postkey, commentid } = this.props.params;
      const commentText = this.editorRef.current.getValue();
      
      if (!commentText || commentText.trim() === "") {
        this.setState({ 
          error: "Text cannot be empty",
          isLoading: false 
        });
        return;
      }

      if (this.editingPost && !this.state.title.trim()) {
        this.setState({ 
          error: "Title cannot be empty",
          isLoading: false 
        });
        return;
      }

      const timestamp = getServerTimestamp();

      if (this.editingPost) {
        // Update post data
        const { title } = this.state;
        const data_post = {
          ...this.state.originalData,
          plainText: commentText,
          richText: commentText,
          title: title,
          lastEdit: timestamp
        };
        await updatePost(postkey, data_post);

        // Also update the post content in comments (comment #1)
        const data_comment = {
          ...this.state.originalData,
          plainText: commentText,
          richText: commentText,
          lastEdit: timestamp
        };
        await updateComment(postkey, "1", data_comment);
      } else {
        // Update comment only
        const data_comment = {
          ...this.state.originalData,
          plainText: commentText,
          richText: commentText,
          lastEdit: timestamp
        };
        await updateComment(postkey, commentid, data_comment);
      }

      // Navigate back to post
      this.props.navigate(`/post/${postkey}`);
      
    } catch (error) {
      console.error("Error updating content:", error);
      this.setState({
        error: "Failed to save changes",
        isLoading: false
      });
    }
  };

  render() {
    const { title, richText, isLoading, error } = this.state;
    const { postkey } = this.props.params;

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

    return (
      <div className="container py-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <h3 className="card-title mb-0">
              {this.editingPost ? "Edit Post" : "Edit Comment"}
            </h3>
          </div>
          
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              {this.editingPost && (
                <div className="form-group mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={title}
                    onChange={this.onChangeTitle}
                    placeholder="Enter post title"
                  />
                </div>
              )}
              
              <div className="form-group mb-3">
                <label className="form-label">Content</label>
                <TextEditor
                  ref={this.editorRef}
                  postKey={postkey}
                  initialText={richText}
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2 me-2"></i>
                      Save Changes
                    </>
                  )}
                </button>
                
                <Link
                  to={`/post/${postkey}`}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditWrapper;
