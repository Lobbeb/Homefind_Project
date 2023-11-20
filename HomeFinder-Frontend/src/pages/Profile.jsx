import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileInput = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filepercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageReference = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(prog));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //TODO: CHECK THIS, ITS HELLA VOLATILE
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());

    try {
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST", // Keeping it as POST as per your requirement
        headers: {
          "Content-Type": "application/json",
          // Include authorization headers if required
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        // Checking both the HTTP status and the success property in the response
        dispatch(
          updateUserFailure(data.message || "Failed to update profile.")
        );
        alert(`Update failed: ${data.message || "Server error"}`); // User feedback
        return;
      }

      dispatch(updateUserSuccess(data));
      alert("Profile updated successfully."); // User feedback
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      alert(`Update failed: ${error.message}`); // User feedback in case of a network error
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Handling non-2xx HTTP responses
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete user.");
      }

      const data = await response.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message || "Failed to delete user."));
        alert(`Delete failed: ${data.message || "Server error"}`);
        return;
      }

      dispatch(deleteUserSuccess());
      alert("User deleted successfully.");
      // Redirects to the home page automaticcly thanks to userslice.js
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      alert(`Delete failed: ${error.message}`);
    }
  };

  //Down here is everything that shows for the profile page aka UI
  return (
    <div
      className="p-6 max-w-lg mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl font-bold text-center my-8">Profile Page</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileInput}
          hidden
          accept="image/*"
        ></input>
        <img
          onClick={() => fileInput.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full w-20 h-20 object-cover cursor-pointer self-center mt-3 mb-3"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-500">File upload error</span>
          ) : filepercentage > 0 && filepercentage < 100 ? (
            <span className="text-blue-500">
              {"File upload progress: " + filepercentage + "%"}
            </span>
          ) : filepercentage === 100 ? (
            <span className="text-green-500">File uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text "
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        ></input>
        <input
          type="text "
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        ></input>
        <button
          disabled={loading}
          className="bg-blue-700 text-white font-semibold rounded-lg p-3 uppercase hover:opacity-90 disabled:bg-gray-500 disabled:hover:opacity-100"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer hover:underline"
        >
          delete account
        </span>
        <span className="cursor-pointer hover:underline">sign out</span>
      </div>
      <p className="text-red-700 m-5">{error ? error : ""}</p>
      <p className="text-green-700 m-5">
        {updateSuccess ? "Update Successfully" : ""}
      </p>
    </div>
  );
}
