import { auth, db, storage } from "../Firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  serverTimestamp,
  addDoc,
  deleteDoc,
  runTransaction
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";

/**
 * Handle errors during file uploads.
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
 * Cloud Storage
 * Uploads files to Firebase storage with progress tracking and error handling.
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
 * User Authentication and Profile Helpers
 */
export const getUserName = () => auth?.currentUser?.displayName || "Unknown";

export const getProfilePicUrl = () => auth?.currentUser?.photoURL || "/images/profile_placeholder.png";

export const profilePicStyle = (url, style = {}) => {
  if (!url) return undefined;
  if (url.includes("googleusercontent.com") && !url.includes("?")) {
    url += "?sz=150";
  }
  return { ...style, backgroundImage: `url(${url})` };
};

export const signIn = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log("User signed in: ", result.user);
    })
    .catch((error) => {
      console.error("Error during sign-in: ", error);
    });
};

export const signOut = () => {
  return firebaseSignOut(auth)
    .then(() => {
      console.log("User signed out.");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
};

export const getServerTimestamp = () => serverTimestamp();

/**
 * Firestore References
 */
export const fire_posts = collection(db, "posts");
export const fire_comments = collection(db, "comments");

/**
 * Retrieve all posts and pass them to a callback.
 */
export const postQuerySnapshot = async (onSnapshot) => {
  try {
    const q = query(fire_posts);
    const snapshot = await getDocs(q);
    console.log("Number of posts fetched:", snapshot.size);
    onSnapshot(snapshot);
  } catch (error) {
    console.error("Error getting post snapshot:", error);
  }
};

/**
 * Save or update a post document.
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
 * Increment the view count for a post.
 */
export const incrementViewCount = async (postId) => {
  const postRef = doc(fire_posts, postId);
  try {
    await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) throw "Post does not exist";
      const currentViews = postDoc.data().views || 0;
      transaction.update(postRef, { views: currentViews + 1 });
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
};

/**
 * Toggle like for a post by the current user.
 * If the user already liked the post, remove the like.
 * If not, add the like.
 */
export const toggleLike = async (postId, userId) => {
  const postRef = doc(fire_posts, postId);
  try {
    const updatedUserLikes = await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) throw "Post does not exist";

      const postData = postDoc.data();
      const userLikes = postData.userLikes || [];
      const userIndex = userLikes.indexOf(userId);

      if (userIndex > -1) {
        // User already liked, remove the like
        userLikes.splice(userIndex, 1);
      } else {
        // Add the userId to likes
        userLikes.push(userId);
      }

      transaction.update(postRef, { userLikes });
      return userLikes;
    });
    return updatedUserLikes;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

/**
 * Retrieve a post document and run a callback on it.
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
 * Retrieve a comment document and run a callback on it.
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
 * Add or update a user's comment in the comments collection.
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
 * Update a post by merging existing data with new data.
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
 * Update a comment by merging existing data with new data.
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
 * Invalidate a comment by clearing its content but not removing the doc reference entirely.
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
 * Invalidate a post by clearing its content but not removing the doc reference entirely.
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

/**
 * Delete a post and its associated comments.
 */
export const deletePost = async (post_key) => {
  try {
    console.log('Starting post deletion for key:', post_key);
    
    // Verify post exists
    const postRef = doc(fire_posts, post_key);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post document does not exist');
    }
    
    // Verify user has permission
    const postData = postDoc.data();
    const currentUser = getUserName();
    if (postData.author !== currentUser) {
      throw new Error('User does not have permission to delete this post');
    }

    console.log('Deleting post document...');
    await deleteDoc(postRef);
    console.log('Post document deleted successfully');

    // Delete the associated comments document
    console.log('Deleting comments document...');
    const commentsRef = doc(fire_comments, post_key);
    await deleteDoc(commentsRef);
    console.log('Comments document deleted successfully');

    return true;
  } catch (error) {
    console.error("Error deleting post:", error.message);
    throw error;
  }
};

/**
 * Delete a specific comment from a post.
 */
export const deleteComment = async (post_key, comment_id) => {
  try {
    const commentsRef = doc(fire_comments, post_key);
    const docSnap = await getDoc(commentsRef);
    
    if (docSnap.exists()) {
      const comments = docSnap.data();
      delete comments[comment_id];
      await setDoc(commentsRef, comments);
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};