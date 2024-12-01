import React, { Component } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Edit from "./Components/Edit";
import Create from "./Pages/Create";
import Home from "./Pages/Home";
import Post from "./Pages/Post";
import AboutUs from "./Pages/AboutUs";
import Navbar from "./Components/Navbar";

export default class App extends Component {
  state = {
    user: null,
    loading: true
  };

  componentDidMount() {
    const auth = getAuth();
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.setState({ 
        user,
        loading: false 
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { user, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <BrowserRouter basename="/TechConnect">
        <div>
          <Navbar />
          <main className="mdl-layout__content mdl-color--grey-100">
            <Routes>
              <Route path="/" element={user ? <Dashboard /> : <Home />} />
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
        
              <Route
                path="/about-us"
                element={ <AboutUs />}
              />
             
              
              <Route
                path="/create"
                element={user ? <Create /> : <Navigate to="/login" />}
              />
              <Route path="/post/:id" element={<Post />} />
              <Route
                path="/edit/:postkey/:commentid"
                element={user ? <Edit /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<h1>Page not found</h1>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}