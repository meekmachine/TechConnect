import React, { Component } from "react";
import { getUserName } from "../Scripts/firebase";
import { Link } from "react-router-dom";

export default class CommentMenu extends Component {
  handleToggleClose = () => {
    const { post_key } = this.props;
    if (this.props.toggleCloseCallback) {
      this.props.toggleCloseCallback(post_key);
    }
  };

  handleDelete = () => {
    const { post_key, comment_id } = this.props;
    if (this.props.deleteCallback) {
      this.props.deleteCallback(post_key, comment_id);
    }
  };

  render() {
    const { post_key, comment_id, post_status, author } = this.props;
    const currentUser = getUserName();

    if (author !== currentUser) {
      return null;
    }

    return (
      <div className="d-flex gap-2 text-muted">
        <Link
          to={`/edit/${post_key}/${comment_id}`}
          className="text-decoration-none text-muted"
        >
          <i className="bi bi-pencil me-1"></i>
          Edit
        </Link>

        {comment_id === "1" && (
          <button
            type="button"
            className="btn btn-link text-muted p-0 border-0"
            title={post_status === "open" ? "Close this post to new comments" : "Open this post for new comments"}
            onClick={this.handleToggleClose}
          >
            <i className={`bi bi-${post_status === "open" ? "lock" : "unlock"} me-1`}></i>
            {post_status === "open" ? "Close" : "Open"}
          </button>
        )}

        <button
          type="button"
          className="btn btn-link text-danger p-0 border-0"
          title={`Delete this ${comment_id === "1" ? "post" : "comment"}`}
          onClick={this.handleDelete}
        >
          <i className="bi bi-trash me-1"></i>
          Delete
        </button>
      </div>
    );
  }
}
