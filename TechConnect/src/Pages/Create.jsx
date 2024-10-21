import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextEditor from "../Components/TextEditor/TextEditor";
import {
  getUserName,
  getProfilePicUrl,
  pushComment,
  getServerTimestamp,
  getPostReference,
  setPostReference
} from "../Scripts/firebase";

class Create extends Component {
  state = {
    title: "Debugging Post Title", // Set a default title for debugging
    post_key: "",
    fire_post: null,
  };

  refEditor = React.createRef();
  initialRichText = "Debugging post content"; // Default rich text content for debugging

  async componentDidMount() {
    try {
      // Get a new post reference with an auto-generated key
      const fire_post = await getPostReference();
      this.setState({ post_key: fire_post.id, fire_post });
      
      // Automatically save a post when component mounts (for debugging)
      const author = getUserName();
      const profilePicUrl = getProfilePicUrl();
      const timestamp = getServerTimestamp();
      const data_post = {
        author: author,
        comments: 1,
        plainText: this.initialRichText,
        profilePicUrl: profilePicUrl,
        status: "open",
        title: this.state.title,
        lastEdit: timestamp,
        timestamp: timestamp
      };

      const onSuccessfullySetDocument = () => {
        console.log("Post created successfully: ", this.state.post_key);
      };

      // Save the post to Firebase
      setPostReference(fire_post, data_post, onSuccessfullySetDocument);
    } catch (error) {
      console.error("Error during post creation:", error);
    }
  }

  onChangeTitle = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    // The manual submit logic if needed in addition to automatic save
  };

  render() {
    const { title, post_key } = this.state;
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
                />
              </div>
              <div className="form-group">
                <div className="border border-dark">
                  <TextEditor
                    ref={this.refEditor}
                    post_key={post_key}
                    initialRichText={this.initialRichText}
                  />
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-bgn">
                  Submit
                </button>
                <Link to="/" className="btn btn-bgn ml-1">
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

export default Create;