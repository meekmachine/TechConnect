import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase";

/**
 * Store file to path in Firebase Storage
 *
 * @param {String} storagePath - Path in Firebase storage where the file gets stored, e.g. the post_key
 * @param {File} file - The file as a File object
 * @param {UploadMetadata} metadata - Metadata for the newly uploaded object
 * @callback [onUploadProgress] - Callback on upload progress triggering when the file is being uploaded.
 * @callback [onSuccessfulUpload] - Callback on the file URL triggering when the file is successfully uploaded
 * @callback [onError] - Callback on error message and object triggering when the upload encounters an error
 */
export const uploadToStorage = (
  storagePath,
  file,
  metadata = {},
  onUploadProgress = (progress) => {},
  onSuccessfulUpload = (url) => {},
  onError = (err) => {}
) => {
  const storageRef = ref(storage, `${storagePath}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onUploadProgress(progress);
    },
    (error) => {
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
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        onSuccessfulUpload(downloadURL);
      });
    }
  );
};