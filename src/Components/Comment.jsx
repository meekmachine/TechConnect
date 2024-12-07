import React, { Component } from "react";
import {
  getDateObject,
  getDateTime,
  timeDifference
} from "../Scripts/utilities";
import CommentMenu from "./CommentMenu";
import { profilePicStyle } from "../Scripts/firebase";

class Comment extends Component {
  toggleCloseCallback = () => {
    this.props.toggleCloseCallback(this.props.post_key);
  };

  deleteCallback = () => {
    this.props.deleteCallback(this.props.post_key, this.props.comment.id);
  };

  formatTimestamp = (timestamp) => {
    const date = getDateObject(timestamp);
    return date ? timeDifference(date) : '';
  };

  render() {
    const imageStyle = {
      width: "40px",
      height: "40px",
      backgroundSize: "cover",
      borderRadius: "50%",
      marginRight: "1rem"
    };
    
    let comment = this.props.comment;
    let post_title = this.props.post_title;
    let post_status = this.props.post_status;
    let post_key = this.props.post_key;
    
    return (
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {comment.profilePicUrl ? (
                <div
                  className="profilePic"
                  style={profilePicStyle(comment.profilePicUrl, imageStyle)}
                  title={comment.author}
                />
              ) : (
                <div
                  className="material-icons profilePic"
                  style={imageStyle}
                  title="The author deleted this comment"
                >
                  account_circle
                </div>
              )}
              <div>
                <h6 className="mb-0">
                  {comment.author ? (
                    <strong>{comment.author}</strong>
                  ) : (
                    <strong>&nbsp;</strong>
                  )}
                </h6>
                <small className="text-muted">
                  Posted: {this.formatTimestamp(comment.timestamp)}
                  {comment.lastEdit && comment.timestamp !== comment.lastEdit && (
                    <span className="ms-2">
                      • Modified: {this.formatTimestamp(comment.lastEdit)}
                    </span>
                  )}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {comment.id === 1 && (
            <h5 className="card-title mb-3">
              {post_title}{" "}
              {post_status === "closed" && (
                <span className="badge bg-danger ms-2">CLOSED</span>
              )}
            </h5>
          )}
          
          <div className="card-text">
            {comment.richText ? (
              <div
                className="postRichText"
                dangerouslySetInnerHTML={{
                  __html: comment.richText
                }}
              />
            ) : (
              <div className="postRichText">
                {comment.plainText}
              </div>
            )}
          </div>
        </div>

        <div className="card-footer bg-white border-top-0">
          <CommentMenu
            comment_id={comment.id}
            author={comment.author}
            post_key={post_key}
            post_status={post_status}
            deleteCallback={this.deleteCallback}
            toggleCloseCallback={this.toggleCloseCallback}
          <div className="reaction-buttons">
            <button onClick={() => this.props.handleReaction('like')}>👍 {comment.reactions?.like || 0}</button>
            <button onClick={() => this.props.handleReaction('love')}>❤️ {comment.reactions?.love || 0}</button>
            <button onClick={() => this.props.handleReaction('laugh')}>😂 {comment.reactions?.laugh || 0}</button>
          </div>
          />
        </div>
      </div>
    );
  }
}

export default Comment;
