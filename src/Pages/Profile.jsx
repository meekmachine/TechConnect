import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName,
        email: currentUser.email,
        profilePic: currentUser.photoURL,
      });
    }
  }, []);

  if (!user) {
    return <div className="container my-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h1>Profile</h1>
      <div className="card p-3">
        <div className="d-flex align-items-center">
          <img
            src={user.profilePic || "/images/profile_placeholder.png"}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "100px", height: "100px", marginRight: "20px" }}
          />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <Link to="/edit-profile" className="btn btn-primary mt-3">
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default Profile;