import { useEffect } from "react";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  //Adding files to filter & stuff has to be added here
  //TODO: ADD FILTERS HERE TOO
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 100,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        const response = await fetch(`/api/listing/get/${listingId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success === false) {
          // Handle the error state in your UI as needed
          console.error(data.message);
          // You may set an error state here and return to stop further execution
          return;
        }

        setFormData(data);
      } catch (error) {
        // Handle the error state in your UI as needed
        console.error("Fetching failed:", error);
        // Set an error state here if needed
      }
    };

    fetchListing();
  }, [params.listingId]); // Ensure dependency on listingId for re-fetching if it changes

  const handleImageSubmit = (e) => {
    // Ensure 'files' is an array
    const filesArray = Array.isArray(files) ? files : Array.from(files);

    if (
      filesArray.length > 0 &&
      filesArray.length + formData.imageUrls.length < 7
    ) {
      setUploading(true);
      setImageUploadError(false);

      const uploadPromises = filesArray.map((file) => storeImage(file));

      Promise.all(uploadPromises)
        .then((urls) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            imageUrls: [...prevFormData.imageUrls, ...urls],
          }));
          setImageUploadError(false);
        })
        .catch((err) => {
          console.error("Error uploading images:", err);
          setImageUploadError("Image upload failed (2 mb max per image)");
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  //Properly store them
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
          // If you have a progress callback to update UI, call it here
        },
        (error) => {
          console.error("Error during file upload:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  };

  //to remove iamges
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrls: prevFormData.imageUrls.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };
  //Handlechange for our checkboxes, add stuff here if you add more checkboxes.
  //TODO: LOOK AT THIS WHEN ADDING MORE FILTERS
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    setFormData((prevFormData) => {
      const isCheckbox = type === "checkbox";
      const isTextualInput =
        type === "number" || type === "text" || type === "textarea";
      const isNewType = id === "sale" || id === "rent";

      // Special case for 'sale' and 'rent' to set the 'type' property
      if (isNewType) {
        return {
          ...prevFormData,
          type: id,
        };
      }

      // For other checkbox inputs like 'parking', 'furnished', 'offer'
      if (isCheckbox) {
        return {
          ...prevFormData,
          [id]: checked,
        };
      }

      // For textual inputs like 'name', 'description', 'address', etc.
      if (isTextualInput) {
        return {
          ...prevFormData,
          [id]: value,
        };
      }

      // Return previous state by default if the input doesn't match any conditions
      return prevFormData;
    });
  };

  // To submit the stuff to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Validate input before sending
    if (formData.imageUrls.length < 1) {
      formData.imageUrls = ["/images/pepehouse_default.jpg"];
    } else if (formData.imageUrls.length > 6) {
      // Check if the imageUrls array exceeds the limit
      setLoading(false);
      setError("Cannot upload more than 6 images");
      return;
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      setLoading(false);
      setError("Discount price must be lower than regular price");
      return;
    }

    try {
      const response = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
        credentials: "include", // Necessary to include cookies with the request
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Frontend stuff so you see
  //TODO: SAME AS LISTING BUT ADD FILTERS HERE TOO IF YOU ADD MORE SO YOU CAN UPDATE THEM TOO
  return (
    <main
      className="p-6 max-w-2xl mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl font-semibold text-center mb-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <input
            className="border p-3 rounded-lg placeholder-black"
            type="text"
            placeholder="Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            maxLength="70"
            minLength="10"
            required
          />
          <textarea
            className="border p-3 rounded-lg placeholder-black"
            placeholder="Description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            className="border p-3 rounded-lg placeholder-black"
            type="text"
            placeholder="Address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          {/*Checkboxes below //TODO ADD MORE */}
          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              ></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="rent"
                className="w-5 onChange={handleChange}
                checked={formData.type === 'rent'}"
                onChange={handleChange}
                checked={formData.type === "rent"}
              ></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              ></input>
              <span>Parking spot</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              ></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-3 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              ></input>
              <span>Offer</span>
            </div>
          </div>
          {/*FIELDS TO FILL BELOW below //TODO ADD MORE */}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <input
                className="p-3 border border-black rounded-lg text-center"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms" className="mt-2">
                Beds
              </label>
            </div>

            <div className="flex flex-col items-center">
              <input
                className="p-3 border border-black rounded-lg text-center"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms" className="mt-2">
                Baths
              </label>
            </div>

            <div className="flex flex-col items-center">
              <input
                className="p-3 border border-black rounded-lg text-center"
                type="number"
                id="regularPrice"
                min="50"
                max="100000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <label htmlFor="regularPrice" className="mt-2">
                Regular Price (Euro/month)
              </label>
            </div>
            {formData.offer && (
              <div className="flex flex-col items-center">
                <input
                  className="p-3 border border-black rounded-lg text-center"
                  type="number"
                  id="discountPrice"
                  min="0"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <label htmlFor="discountPrice" className="mt-2">
                  Discounted Price (Euro/month)
                </label>
              </div>
            )}
          </div>

          {/*the annoying little shit code to upload files aka images and submit //TODO ADD MORE */}

          <div className="flex flex-col mt-4">
            <label className="font-semibold mb-2">
              Images:{" "}
              <span className="font-normal">
                The first image will be the cover (max 6)
              </span>
            </label>
            <div className="flex items-center gap-4">
              <input
                className="p-3 border border-black rounded-lg flex-grow"
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                onClick={handleImageSubmit}
                type="button"
                disabled={uploading}
                className="font-semibold p-3 text-green-700 border border-green-700 rounded uppercase hover:bg-green-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-500">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 && (
              <div className="mt-4">
                {" "}
                {/* Added margin-top here */}
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`} // Changed the key to be a combination of url and index
                    className="flex justify-between p-3 border border-black gap-3 items-center mb-4 rounded-lg" // Added margin-bottom here
                  >
                    <img
                      src={url}
                      alt={`Uploaded image ${index}`}
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-3 text-red-700 rounded-lg font-semibold border border-red-700 uppercase hover:opacity-75"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="font-semibold mt-4 bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
