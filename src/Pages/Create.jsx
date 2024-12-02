import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextEditor from "../Components/TextEditor/TextEditor";
import {
  getUserName,
  getProfilePicUrl,
  getServerTimestamp,
  setPostReference
} from "../Scripts/firebase";

// Define post categories
export const POST_CATEGORIES = [
  {
    id: 'JOBS',
    label: 'Jobs & Referrals',
    color: '#28a745'
  },
  {
    id: 'CAREER',
    label: 'Career Discussion',
    color: '#007bff'
  },
  {
    id: 'COMPANIES',
    label: 'Company Reviews',
    color: '#6f42c1'
  },
  {
    id: 'SKILLS',
    label: 'Skills & Learning',
    color: '#fd7e14'
  },
  {
    id: 'NEWS',
    label: 'News & Updates',
    color: '#6c757d'
  }
];

export const FEATURE_CATEGORIES = [
  {
    id: 'MARKET_ANALYSIS',
    label: 'Market Analysis',
    color: '#28a745'
  }
]

class Create extends Component {
  state = {
    title: "",
    category: "",
    post_key: "",
    isSubmitting: false,
    errorMessage: ""
  };

  refEditor = React.createRef();
  initialRichText = "";

  onChangeTitle = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeCategory = (e) => {
    this.setState({ category: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!this.state.category) {
        this.setState({ errorMessage: "Please select a category" });
        return;
      }

      this.setState({ isSubmitting: true, errorMessage: "" });
      
      const author = getUserName();
      const profilePicUrl = getProfilePicUrl();
      const timestamp = getServerTimestamp();
      const plainText = this.refEditor.current.getValue();
      
      const data_post = {
        author,
        comments: 1,
        plainText,
        profilePicUrl,
        status: "open",
        title: this.state.title,
        category: this.state.category,
        lastEdit: timestamp,
        timestamp
      };

      // Create new post
      const postId = await setPostReference(null, data_post);
      
      if (postId) {
        window.location.href = `/post/${postId}`;
      } else {
        this.setState({ 
          errorMessage: "Failed to create post - no postId returned",
          isSubmitting: false 
        });
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      this.setState({ 
        errorMessage: `Failed to create post: ${error.message}`,
        isSubmitting: false 
      });
    }
  };

  render() {
    const { title, category, isSubmitting, errorMessage } = this.state;

    return (
      <div className="container">
        <div className="panel panel-default">
          <br />
          <div className="panel-heading">
            <h3 className="panel-title">New Post</h3>
          </div>
          <div className="panel-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={title}
                  onChange={this.onChangeTitle}
                  placeholder="Title"
                  required
                />
              </div>

              <div className="form-group">
                <select 
                  className="form-control"
                  value={category}
                  onChange={this.onChangeCategory}
                  required
                >
                  <option value="">Select Category</option>
                  {POST_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <div className="border border-dark">
                  <TextEditor
                    ref={this.refEditor}
                    initialRichText={this.initialRichText}
                  />
                </div>
              </div>
              <div>
                <button 
                  type="submit" 
                  className="btn btn-bgn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Submit"}
                </button>
                <Link to="/" className="btn btn-bgn ml-1">
                  Cancel
                </Link>
              </div>
              {errorMessage && (
                <div className="alert alert-danger mt-3">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;