import React from "react";

export default function CreateListing() {
  return (
    <main
      className="p-6 max-w-2xl mx-auto my-8 rounded-lg shadow"
      style={{ backgroundColor: "rgba(229, 231, 235, 0.85)" }}
    >
      <h1 className="text-3xl font-semibold text-center mb-7">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <input
            className="border p-3 rounded-lg placeholder-black"
            type="text"
            placeholder="Name"
            id="name"
            maxLength="70"
            minLength="10"
            required
          />
          <textarea
            className="border p-3 rounded-lg placeholder-black"
            placeholder="Description"
            id="description"
            required
          />
          <input
            className="border p-3 rounded-lg placeholder-black"
            type="text"
            placeholder="Address"
            id="address"
            required
          />
          {/*Checkboxes below //TODO ADD MORE */}
          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-3">
              <input type="checkbox" id="sale" className="w-5"></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" id="rent" className="w-5"></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" id="parking" className="w-5"></input>
              <span>Parking spot</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" id="furnished" className="w-5"></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-3 ">
              <input type="checkbox" id="offer" className="w-5"></input>
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
                min="1"
                required
              />
              <label htmlFor="regularPrice" className="mt-2">
                Regular Price ($/month)
              </label>
            </div>

            <div className="flex flex-col items-center">
              <input
                className="p-3 border border-black rounded-lg text-center"
                type="number"
                id="discountPrice"
                min="1"
                required
              />
              <label htmlFor="discountPrice" className="mt-2">
                Discounted Price ($/month)
              </label>
            </div>
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
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button" // Change to "submit" if this button should submit the form
                className="font-semibold p-3 text-green-700 border border-green-700 rounded uppercase hover:bg-green-50"
              >
                Upload
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700"
          >
            Submit Listing
          </button>
        </div>
      </form>
    </main>
  );
}
