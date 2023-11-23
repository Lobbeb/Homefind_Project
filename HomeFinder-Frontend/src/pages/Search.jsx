import React from "react";

export default function Search() {
  return (
    <div className="bg-gray-200 bg-opacity-70">
      <div className="flex flex-col md:flex-row text-black">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen border-black">
          <form className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <label
                htmlFor="searchTerm"
                className="whitespace-nowrap font-semibold"
              >
                Search term
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="border rounded-lg p-3 w-full placeholder-black"
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Type:</label>
              {/*Coppy this div if you want to add stuf 4 rows down  */}
              <div className="flex gap-2">
                <input type="checkbox" id="all" className="w-5" />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="sale" className="w-5" />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-5" />
                <span>Offer</span>
              </div>
            </div>
            {/*Copy here down down there to add a whole new one for more filters later */}
            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Ameneties</label>
              {/*Coppy this div if you want to add stuf 4 rows down  */}
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className="w-5" />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className="w-5" />
                <span>Furniture</span>
              </div>
            </div>
            {/*Copy here down down there to add a whole new one for more filters later */}
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <select id="sort_order" className="border rounded-lg p-3 ">
                <option>Price Increasing</option>
                <option>Price Decreasing</option>
                <option>Oldest</option>
                <option>Latest</option>
              </select>
            </div>
            <button className="bg-blue-700 text-white  p-3 rounded-lg uppercase font-semibold hover:opacity-90 hover:underline">
              Search
            </button>
          </form>
        </div>
        <div className="p-7">
          <h1 className="text-3xl font-bold border-b p-3 text-black mt-5">
            Search Results
          </h1>
        </div>
      </div>
    </div>
  );
}
