import { auth, db, storage } from "../Firebase"; // Import initialized services from config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, query, serverTimestamp, addDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

/**
 * Cloud Storage
 *
 * @param {String} storagePath - Path in Firebase storage where the file gets stored
 * @param {File} file - The file as a File object
 * @param {UploadMetadata} metadata - Metadata for the newly uploaded object
 * @callback onUploadProgress - Callback to monitor the upload progress
 * @callback onSuccessfulUpload - Callback when the file is successfully uploaded
 * @callback onError - Callback when an error occurs during the upload
 */
export const uploadToStorage = (
  storagePath,
  file,
  metadata = {},
  onUploadProgress = () => {},
  onSuccessfulUpload = () => {},
  onError = () => {}
) => {
  const storageRef = ref(storage, `${storagePath}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onUploadProgress(progress);
    },
    (error) => handleUploadError(error, onError),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(onSuccessfulUpload);
    }
  );
};

/**
 * Handle errors during upload
 */
const handleUploadError = (error, onError) => {
  let msg = "";
  switch (error.code) {
    case "storage/unauthorized":
      msg = "User does not have permission to access the object.";
      break;
    case "storage/canceled":
      msg = "User canceled the upload.";
      break;
    case "storage/unknown":
      msg = "Unknown error occurred, inspect error.serverResponse.";
      break;
    default:
      msg = "An error occurred.";
  }
  onError(msg, error);
};

/**
 * Return the signed-in user's display name.
 */
export const getUserName = () => {
  return auth?.currentUser?.displayName || "Unknown";
};

/**
 * Return the signed-in user's profile Pic URL.
 */
export const getProfilePicUrl = () => {
  return auth?.currentUser?.photoURL || "/images/profile_placeholder.png";
};

/**
 * Return a style for the picture
 */
export const profilePicStyle = (url, style = {}) => {
  if (!url) return undefined;
  if (url.includes("googleusercontent.com") && !url.includes("?")) {
    url += "?sz=150";
  }
  return { ...style, backgroundImage: `url(${url})` };
};

/**
 * Get the current timestamp from Firebase server
 */
export const getServerTimestamp = () => {
  return serverTimestamp();
};

/**
 * Signs-in using popup auth and Google as the identity provider
 */
export const signIn = () => {
  const provider = new GoogleAuthProvider(); // Firebase v9: GoogleAuthProvider is imported from firebase/auth
  return signInWithPopup(auth, provider)     // Firebase v9: signInWithPopup is imported from firebase/auth
    .then((result) => {
      console.log("User signed in: ", result.user);
    })
    .catch((error) => {
      console.error("Error during sign-in: ", error);
    });
};

/**
 * Signs-out of Firebase.
 */
export const signOut = () => {
  return firebaseSignOut(auth)               // Firebase v9: signOut is imported from firebase/auth
    .then(() => {
      console.log("User signed out.");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
};

/**
 * Get the post collection
 */
export const fire_posts = collection(db, "posts");

/**
 * Query all posts and return a snapshot.
 */
export const postQuerySnapshot = async (onSnapshot) => {
  try {
    const q = query(fire_posts);
    const snapshot = await getDocs(q);
    console.log("Number of posts fetched:", snapshot.size); // Debug log
    onSnapshot(snapshot);
  } catch (error) {
    console.error("Error getting post snapshot:", error);
  }
};

/**
 * Get the comment collection
 */
export const fire_comments = collection(db, "comments");

/**
 * Get a reference to a post document
 */
export const getPostReference = (postId = null) => {
  if (postId) {
    return doc(fire_posts, postId);
  }
  // Return a new document reference with auto-generated ID
  return doc(fire_posts);
};

/**
 * Save or update a document in the specified collection
 * @param {string|null} post_key - The document ID for the post. If null, Firestore generates a new one.
 * @param {object} data_post - The data to save to the post.
 * @param {function} onSetDocument - Optional callback on success.
 */
export const setPostReference = async (post_key = null, data_post, onSetDocument = () => {}) => {
  try {
    let fire_post;

    if (post_key) {
      fire_post = doc(fire_posts, post_key);
      await setDoc(fire_post, {
        ...data_post,
        timestamp: serverTimestamp(),
      });
    } else {
      fire_post = await addDoc(fire_posts, {
        ...data_post,
        timestamp: serverTimestamp(),
      });
    }

    onSetDocument(fire_post.id);
    return fire_post.id;
  } catch (error) {
    console.error("Error setting post reference:", error);
    throw error;
  }
};

/**
 * Get a post document and optionally run a callback on it
 */
export const getPost = async (post_key, onGetDocument = () => {}) => {
  try {
    const docRef = doc(fire_posts, post_key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      onGetDocument(docSnap);
    } else {
      console.error("No such Post document");
    }
  } catch (error) {
    console.error("Error getting post:", error);
  }
};

/**
 * Get a comment document and optionally run a callback on it
 */
export const getComment = async (post_key, onGetDocument = () => {}) => {
  try {
    const docRef = doc(fire_comments, post_key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      onGetDocument(docSnap);
    } else {
      console.error("No such Comment document");
    }
  } catch (error) {
    console.error("Error getting comment:", error);
  }
};

/**
 * Add or update a user's comment in the comments collection
 */
export const pushComment = async (post_key, comment_key, data, onSetDocument = () => {}) => {
  const fire_comment_doc = doc(fire_comments, post_key);
  try {
    const docSnap = await getDoc(fire_comment_doc);
    let document = docSnap.exists() ? docSnap.data() : {};
    document[comment_key] = data;
    await setDoc(fire_comment_doc, document);
    onSetDocument();
  } catch (error) {
    console.error("Error setting comment document:", error);
  }
};

/**
 * Update a post in Firestore
 */
export const updatePost = async (post_key, data_post, onAfterUpdate = () => {}) => {
  const fire_post_doc = doc(fire_posts, post_key);
  try {
    const docSnap = await getDoc(fire_post_doc);
    await updateDoc(fire_post_doc, { ...docSnap.data(), ...data_post });
    onAfterUpdate();
  } catch (error) {
    console.error("Error updating post document:", error);
  }
};

/**
 * Update a comment document in Firestore
 */
export const updateComment = async (post_key, commentid, data_comment, onAfterSetDocument = () => {}) => {
  const fire_comment_doc = doc(fire_comments, post_key);
  try {
    const docSnap = await getDoc(fire_comment_doc);
    let document = { ...docSnap.data() };
    document[commentid] = { ...document[commentid], ...data_comment };
    await setDoc(fire_comment_doc, document);
    onAfterSetDocument();
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};

/**
 * Invalidate a comment by clearing its content
 */
export const invalidateComment = (post_key, commentid, onAfterSetDocument) => {
  const data_comment = {
    author: "",
    profilePicUrl: "",
    plainText: "Comment deleted",
    richText: "<blockquote>Comment deleted</blockquote>",
    lastEdit: serverTimestamp()
  };
  updateComment(post_key, commentid, data_comment, onAfterSetDocument);
};

/**
 * Invalidate a post by clearing its content
 */
export const invalidatePost = (post_key, onAfterupdate) => {
  const data_post = {
    author: "",
    comments: 1,
    profilePicUrl: "",
    plainText: "Post deleted",
    status: "closed",
    lastEdit: serverTimestamp()
  };
  updatePost(post_key, data_post, onAfterupdate);
};