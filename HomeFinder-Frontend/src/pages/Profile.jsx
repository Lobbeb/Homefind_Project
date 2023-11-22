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
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileInput = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filepercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

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

  //Sign out function
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const response = await fetch("/api/auth/signout");

      // Check if the response is not OK (i.e., HTTP status code outside of the 2xx range)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server responded with an error.");
      }

      const data = await response.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message || "Failed to sign out."));
        alert(`Sign out failed: ${data.message || "Server error"}`);
        return;
      }

      dispatch(signOutUserSuccess());
      alert("Signed out successfully.");
    } catch (error) {
      // Check if the error object has a message property
      dispatch(
        signOutUserFailure(
          error.message || "Sign out failed due to an unexpected error."
        )
      );
      alert(`Sign out failed: ${error.message || "Unexpected error occurred"}`);
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const response = await fetch(`/api/user/listings/${currentUser._id}`);

      // Check if the response is not OK (i.e., HTTP status code outside of the 2xx range)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server responded with an error.");
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch listings.");
      }

      setUserListings(data);
    } catch (error) {
      // Check if the error object has a message property
      setShowListingsError(error.message || "An unexpected error occurred.");
    }
  };

  // Delete listings thingy
  const handleListingDelete = async (listingId) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      // Check if the response status is not ok (i.e., not in the range of 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "There was an error processing your request."
        );
      }

      const data = await response.json();

      // Assuming that the delete operation returns a success status to confirm deletion
      if (data.success) {
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        alert("Listing deleted successfully."); // Provide user feedback
      } else {
        // If success is false or not provided, log the message from the response
        console.error("Delete failed:", data.message);
        alert("Failed to delete the listing."); // Provide user feedback
      }
    } catch (error) {
      // Log and alert the error message
      console.error("Delete failed:", error.message);
      alert("Failed to delete the listing due to an error."); // Provide user feedback
    }
  };

  //Down here is everything that shows for the profile page aka UI
  return (
    <div
      className="p-6 max-w-lg mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl font-bold text-center my-8">
        {currentUser ? `Welcome! ${currentUser.username}` : "Profile Page"}
      </h1>
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
        <Link
          className="bg-blue-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90 font-semibold"
          to={"/create-listing"}
        >
          {" "}
          Create a listing{" "}
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer hover:underline"
        >
          delete account
        </span>
        <span
          onClick={handleSignOut}
          className="cursor-pointer hover:underline"
        >
          sign out
        </span>
      </div>
      <p className="text-red-700 m-5">{error ? error : ""}</p>
      <p className="text-green-700 m-5">
        {updateSuccess ? "Update Successfully" : ""}
      </p>
      {/*Everything below for show listing*/}
      <div className="flex justify-center">
        {" "}
        {/* This will center the button horizontally */}
        <button
          onClick={handleShowListings}
          className="text-white rounded-lg font-semibold uppercase bg-blue-700 p-2"
        >
          Show Listings
        </button>
      </div>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 border-black"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
