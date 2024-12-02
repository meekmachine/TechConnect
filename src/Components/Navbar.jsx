import React, { Component } from "react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"; // Import from firebase/auth
import MaterialIcon from "material-icons-react";
import {
  Collapse,
  Navbar as Navbarstrap,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { signIn, getUserName, getProfilePicUrl } from "../Scripts/firebase"; // Your custom firebase helpers

export default class Navbar extends Component {
  state = {
    isOpen: false,
    user: null,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  componentDidMount() {
    // Initialize Firebase Authentication listener
    this.initFirebaseAuth();
  }

  initFirebaseAuth = () => {
    const auth = getAuth(); // Initialize the Firebase auth instance
    onAuthStateChanged(auth, (user) => {
      this.authStateObserver(user); // Call the observer when auth state changes
    });
  };

  authStateObserver = (user) => {
    const userPicElement = document.getElementById("user-pic");
    const userNameElement = document.getElementById("user-name");
    const signInButtonElement = document.getElementById("sign-in");
    const signOutButtonElement = document.getElementById("sign-out");

    if (user) {
      // User is signed in
      const profilePicUrl = getProfilePicUrl();
      const userName = getUserName();

      // Set user profile pic and name
      userPicElement.style.backgroundImage = `url(${this.addSizeToGoogleProfilePic(profilePicUrl)})`;
      userNameElement.textContent = userName;

      // Show user's profile and sign-out button
      userNameElement.removeAttribute("hidden");
      userPicElement.removeAttribute("hidden");ot44
      signOutButtonElement.removeAttribute("hidden");

      // Hide sign-in button
      signInButtonElement.setAttribute("hidden", "true");
    } else {
      // User is signed out
      userNameElement.setAttribute("hidden", "true");
      userPicElement.setAttribute("hidden", "true");
      signOutButtonElement.setAttribute("hidden", "true");

      // Show sign-in button
      signInButtonElement.removeAttribute("hidden");
    }
  };

  addSizeToGoogleProfilePic = (url) => {
    if (url.includes("googleusercontent.com") && !url.includes("?")) {
      return `${url}?sz=150`;
    }
    return url;
  };

  render() {
    return (
      <div>
        <Navbarstrap color="navbar navbar-dark" expand="md">
          <NavbarBrand href="/">React Firebase Forum</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem id="user-container">
                <NavLink hidden id="user-pic" href="#" />
                <NavLink hidden id="user-name" href="#" />
                <NavLink hidden id="sign-out" href="#" onClick={() => firebaseSignOut(getAuth())}>
                  Sign-out
                </NavLink>
                <NavLink id="sign-in" href="#" onClick={signIn}>
                  <MaterialIcon id="account_circle" icon="account_circle" size="small" />
                  Sign-in with Google
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbarstrap>
      </div>
    );
  }
}