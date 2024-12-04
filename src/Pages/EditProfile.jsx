import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.displayName || "");
      setProfilePic(currentUser.photoURL || "");
    }
  }, []);

  const handleSave = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, {
        displayName: name,
        photoURL: profilePic,
      });
      alert("Profile updated successfully!");
      navigate("/profile");
    }
  };

  if (!user) {
    return <div className="container my-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h1>Edit Profile</h1>
      <div className="card p-3">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="profilePic" className="form-label">
            Profile Picture URL
          </label>
          <input
            type="text"
            id="profilePic"
            className="form-control"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
          />
        </div>
        <button className="btn btn-success" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfile;