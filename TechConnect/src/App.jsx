import React, { Component } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PostList from "./Pages/PostList";
import Login from "./Pages/Login";
import Edit from "./Components/Edit";
import Create from "./Pages/Create";
import Post from "./Pages/Post";
import Navbar from "./Components/Navbar";
import * as firebase from 'firebase/app';
import 'firebase/auth';

// Secure routes
function AuthenticatedRoute({
  component: Component,
  authenticated,
  redirect = "/login",
  ...rest
}) {
  return (
    <Route
      {...rest}
      element={authenticated === true ? <Component {...rest} /> : <Navigate to={redirect} />}
    />
  );
}

export default class App extends Component {
  state = {
    user: null,
  };

  setUser = (user) => {
    this.setState({ user: user });
  };

  // Listen to auth state changes
  initFirebaseAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in");
      } else {
        console.log("User is logged out");
      }
      this.setUser(user);
    });
  }

  componentDidMount() {
    this.initFirebaseAuth();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar setuserCallback={this.setUser} />
          <main className="mdl-layout__content mdl-color--grey-100">
            <Routes>
              <Route path="/" element={<PostList />} />
              <AuthenticatedRoute
                path="/login"
                authenticated={this.state.user == null}
                redirect="/"
                component={Login}
              />
              <AuthenticatedRoute
                path="/create"
                authenticated={this.state.user != null}
                component={Create}
              />
              <Route path="/post/:id" element={<Post />} />
              <AuthenticatedRoute
                path="/edit/:postkey/:commentid"
                authenticated={this.state.user != null}
                component={Edit}
              />
              <Route path="*" element={<h1>Page not found</h1>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}