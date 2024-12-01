import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
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
import { signIn, getUserName, getProfilePicUrl } from "../Scripts/firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: getUserName(),
          profilePic: getProfilePicUrl(),
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    firebaseSignOut(auth);
  };

  return (
    <div>
      <Navbarstrap color="navbar navbar-dark" expand="md">
        <NavbarBrand href="/">React Firebase Forum</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/TechConnect/home">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/TechConnect/about-us">About Us</NavLink>
            </NavItem>
            {user ? (
              <>
                <NavItem>
                  <div
                    id="user-pic"
                    style={{
                      backgroundImage: `url(${user.profilePic})`,
                      backgroundSize: "cover",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                </NavItem>
                <NavItem>
                  <NavLink>{user.name}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#" onClick={handleSignOut}>
                    Sign-out
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <NavItem>
                <NavLink href="#" onClick={signIn}>
                  <MaterialIcon icon="account_circle" size="small" />
                  Sign-in with Google
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbarstrap>
    </div>
  );
};

export default Navbar;