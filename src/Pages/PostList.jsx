import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination";
import { truncate, getDateObject, getDateTime, timeDifference } from "../Scripts/utilities";
import { fire_posts, profilePicStyle, postQuerySnapshot } from "../Scripts/firebase";  // Correct import
import { query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const TRUNCATION_LIMIT = 290;
const PAGE_SIZE = 20;

class PostList extends Component {
  state = {
    posts: [],
    sortBy: "timestamp",
    direction: "desc",
    isLoading: true,
    currentPage: 0,
  };

  pagesCount = 0;


  componentDidMount() {
    const { sortBy, direction } = this.state;
    
    // Create initial query
    const q = query(
      fire_posts,
      orderBy(sortBy, direction),
      limit(PAGE_SIZE)
    );

    // Set up initial snapshot listener
    this.unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = [];
        snapshot.forEach((doc) => {
          posts.push({ ...doc.data(), key: doc.id });
        });
        this.setState({ 
          posts,
          isLoading: false,
          currentPage: 0,
          pagesCount: Math.ceil(snapshot.size / PAGE_SIZE)
        });
      },
      this.handleFirestoreError
    );
  }

  componentDidUpdate(_, prevState) {
    const { sortBy, direction, currentPage } = this.state;

    if (
      sortBy !== prevState.sortBy ||
      direction !== prevState.direction ||
      currentPage !== prevState.currentPage
    ) {
      // Create a proper query
      const q = query(
        fire_posts,
        orderBy(sortBy, direction),
        limit((currentPage + 1) * PAGE_SIZE)
      );

      // Set up the snapshot listener
      this.unsubscribe = onSnapshot(
        q,
        this.onPostsCollectionUpdate,
        this.handleFirestoreError
      );
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe(); // Unsubscribe from Firestore updates
    }
  }

  onPostsCollectionUpdate = (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), key: doc.id });
    });
    this.setState({ posts, isLoading: false });
  };

  handleSort = (event) => {
    const { name } = event.target;
    const { sortBy, direction } = this.state;
    const newDirection = sortBy === name && direction === "desc" ? "asc" : "desc";
    this.setState({ sortBy: name, direction: newDirection, isLoading: true });
  };

  handlePageClick = (event, page) => {
    event.preventDefault();
    this.setState({ isLoading: true, currentPage: page });
  };

  handleFirestoreError = (error) => {
    console.error("Firestore error:", error); // Log Firestore errors for debugging
    this.setState({ isLoading: false });
  };

  renderSortingIndicator = (targetName) => {
    const { sortBy, direction } = this.state;
    return sortBy === targetName ? (direction === "desc" ? "▲" : "▼") : "";
  };

  render() {
    const { isLoading, posts, currentPage } = this.state;

    return (
      <div className="container">
        <div className="panel panel-default">
          <h3 className="panel-title">Posts</h3>
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <div>
              <table className="table">
                <thead>
                  <tr>
                    {["Picture", "Title", "Text", "Comments", "Author", "Status", "Created"].map((header, index) => (
                      <th key={index} name={header.toLowerCase()} onDoubleClick={this.handleSort}>
                        {header} {this.renderSortingIndicator(header.toLowerCase())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td>No posts available</td>
                    </tr>
                  ) : (
                    posts
                      .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
                      .map((post, index) => (
                        <tr key={post.key} className={index % 2 === 0 ? "alt1" : "alt2"}>
                          <td>
                            {post.profilePicUrl ? (
                              <div
                                className="profilePic"
                                style={profilePicStyle(post.profilePicUrl)}
                                title={post.author}
                              />
                            ) : (
                              <div className="material-icons md-36 profilePic" title="Deleted">
                                account_circle
                              </div>
                            )}
                          </td>
                          <td><Link to={`/post/${post.key}`}>{post.title}</Link></td>
                          <td>{truncate(post.plainText, TRUNCATION_LIMIT)}</td>
                          <td>{post.comments - 1}</td>
                          <td>{post.author}</td>
                          <td>{post.status}</td>
                          <td title={getDateTime(getDateObject(post.timestamp))}>
                            {timeDifference(getDateObject(post.timestamp))}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
              <Pagination currentPage={currentPage} pagesCount={this.pagesCount} handlePageClick={this.handlePageClick} />
            </div>
          )}
          <Link to="/create" className="btn btn-bgn">New Post</Link>
        </div>
      </div>
    );
  }
}

export default PostList;