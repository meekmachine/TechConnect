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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { signIn, getUserName, getProfilePicUrl } from "../Scripts/firebase";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
        <NavbarBrand href="/TechConnect/">TechConnect</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/TechConnect/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about">About Us</NavLink>
            </NavItem>
            {user ? (
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle nav caret>
                  <div
                    id="user-pic"
                    style={{
                      backgroundImage: `url(${user.profilePic})`,
                      backgroundSize: "cover",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-block",
                      marginRight: "10px",
                    }}
                  />
                  {user.name}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to="/profile">
                    Profile
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/edit-profile">
                    Edit Profile
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={handleSignOut}>Sign-out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
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