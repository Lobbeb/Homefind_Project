import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/homefind-high-resolution-logo-transparent.png"; // Adjust the path as necessary
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there's an existing query string and create an object from it
    const existingParams = new URLSearchParams(window.location.search);

    // Set 'searchTerm' to the current searchTerm state
    existingParams.set("searchTerm", searchTerm);

    // Stringify the parameters to append to the navigation path
    const queryString = existingParams.toString();

    // Navigate to the search page with the query string
    navigate(`/search?${queryString}`);
  };

  useEffect(() => {
    // Create a function to encapsulate the logic for updating the searchTerm
    const updateSearchTermFromURL = () => {
      const queryParams = new URLSearchParams(location.search);
      const searchTermFromURL = queryParams.get("searchTerm");
      if (searchTermFromURL) {
        setSearchTerm(searchTermFromURL);
      }
    };

    // Call the function within the useEffect
    updateSearchTermFromURL();
  }, [location.search]); // Only re-run the effect if location.search changes

  return (
    <header className="bg-blue-900 shadow-md opacity-95">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          {/* Use the imported high-resolution logo here and apply size styling */}
          <img
            src={logo}
            alt="HomeFind Logo"
            className="h-5 sm:h-8 flex-wrap"
          />{" "}
          {/* Adjust the h-5 sm:h-8 as necessary */}
        </Link>

        <form
          onSubmit={handleSubmit}
          className=" bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent placeholder-black focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-black cursor-pointer" />
          </button>
        </form>

        <ul className=" flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-100 font-bold hover:underline">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="text-slate-100 font-bold hover:underline">About</li>
          </Link>

          {/* TODO: Add these below, extra*/}
          <Link to="/Map">
            <li className="text-slate-100 font-bold hover:underline">Map</li>
          </Link>

          <Link to="/MortageCalculator">
            <li className="hidden sm:inline text-slate-100 font-bold hover:underline">
              Mortage Calculator
            </li>
          </Link>

          {/* TODO: Move this to the top aka left side of all the bars*/}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover "
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-100 font-bold hover:underline">
                SignIn
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
