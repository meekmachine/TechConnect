import React, { Component } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PostList from "./Pages/PostList";
import Login from "./Pages/Login";
import Edit from "./Components/Edit";
import Create from "./Pages/Create";
import Post from "./Pages/Post";
import Navbar from "./Components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Remove AuthenticatedRoute component
export default class App extends Component {
  state = {
    user: null,
  };

  setUser = (user) => {
    this.setState({ user });
  };

  // Listen to auth state changes
  initFirebaseAuth = () => {
    const auth = getAuth(); // Initialize Firebase auth instance
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in");
      } else {
        console.log("User is logged out");
      }
      this.setUser(user);
    });
  };

  componentDidMount() {
    this.initFirebaseAuth();
  }

  render() {
    const { user } = this.state;

    return (
      <BrowserRouter>
        <div>
          <Navbar setuserCallback={this.setUser} />
          <main className="mdl-layout__content mdl-color--grey-100">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route
                path="/login"
                element={user == null ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/create"
                element={user != null ? <Create /> : <Navigate to="/login" />}
              />
              <Route path="/post/:id" element={<Post />} />
              <Route
                path="/edit/:postkey/:commentid"
                element={user != null ? <Edit /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<h1>Page not found</h1>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}