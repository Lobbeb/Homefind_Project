import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileInput = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filepercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div
      className="p-6 max-w-lg mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl font-bold text-center my-8">Profile Page</h1>
      <form className="flex flex-col gap-3">
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
          ) : (
            <span>
              {filepercentage > 0 && filepercentage < 100 ? (
                <span className="text-blue-500">
                  {"File upload progress: " + filepercentage + "%"}
                </span>
              ) : filepercentage === 100 ? (
                <span className="text-green-500">
                  File uploaded successfully
                </span>
              ) : (
                ""
              )}
            </span>
          )}
        </p>
        <input
          type="text "
          placeholder="Username"
          className="border p-3 rounded-lg"
        ></input>
        <input
          type="text "
          placeholder="Password"
          className="border p-3 rounded-lg"
        ></input>
        <input
          type="text "
          placeholder="Email"
          className="border p-3 rounded-lg"
        ></input>
        <button className="bg-blue-700 text-white font-semibold rounded-lg p-3 uppercase hover:opacity-90 disabled:bg-gray-500 disabled:hover:opacity-100">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="cursor-pointer hover:underline">delete account</span>
        <span className="cursor-pointer hover:underline">sign out</span>
      </div>
    </div>
  );
}
