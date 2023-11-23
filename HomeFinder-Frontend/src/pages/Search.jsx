import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  console.log(listings);

  //Change fields
  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    let update = {};

    // Handling 'type' field (rent, sale, all)
    if (["rent", "sale"].includes(id)) {
      update.type = id;
      update.all = false; // When rent or sale is selected, set all to false
    } else if (id === "all") {
      update = { type: "all", all: true }; // Reset to default when all is selected
    }

    // Handling 'searchTerm' field
    if (id === "searchTerm") {
      update.searchTerm = value;
    }

    // Handling 'parking', 'furnished', and 'offer' checkboxes
    if (["parking", "furnished", "offer"].includes(id)) {
      update[id] = checked;
    }

    // Handling 'sort_order' dropdown
    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      update.sort = sort || "created_at";
      update.order = order || "desc";
    }

    setSidebardata({ ...sidebardata, ...update });
  };

  //submit the stuff
  const handleSubmit = (e) => {
    e.preventDefault();

    // Utility function to create a URL search string from an object
    const createSearchString = (params) => {
      const urlParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== false) {
          urlParams.set(key, params[key]);
        }
      });
      return urlParams.toString();
    };

    // Create the search query from the sidebardata state
    const searchQuery = createSearchString(sidebardata);
    navigate(`/search?${searchQuery}`);
  };

  //set states
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // Utility function to safely parse boolean URL params
    const parseBooleanParam = (paramValue) => paramValue === "true";

    // Update sidebardata based on URL parameters
    const updateSidebardataFromUrl = () => {
      setSidebardata({
        searchTerm: urlParams.get("searchTerm") || "",
        type: urlParams.get("type") || "all",
        parking: parseBooleanParam(urlParams.get("parking")),
        furnished: parseBooleanParam(urlParams.get("furnished")),
        offer: parseBooleanParam(urlParams.get("offer")),
        sort: urlParams.get("sort") || "created_at",
        order: urlParams.get("order") || "desc",
      });
    };

    // Function to fetch listings
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setShowMore(data.length > 8);
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    updateSidebardataFromUrl();
    fetchListings();
  }, [location.search]);

  return (
    <div className="bg-gray-200 bg-opacity-70">
      <div className="flex flex-col md:flex-row text-black">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen border-black">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Type:</label>
              {/*Coppy this div if you want to add stuf 4 rows down  */}
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "all"}
                />

                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === "sale"}
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            {/*Copy here down down there to add a whole new one for more filters later */}
            <div className="flex gap-2 flex-wrap items-center">
              <label className="font-semibold">Ameneties</label>
              {/*Coppy this div if you want to add stuf 4 rows down  */}
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span>Furniture</span>
              </div>
            </div>
            {/*Copy here down down there to add a whole new one for more filters later */}
            <div className="flex items-center gap-2">
              <label className="font-semibold">Sort:</label>
              <select
                id="sort_order"
                className="border rounded-lg p-3  "
                onChange={handleChange}
                defaultValue={"created_at_desc"}
              >
                <option value="regularPrice_desc">Low to high</option>
                <option value="regularPrice_asc">High to low</option>
                <option value="createdAt_desc">Newest</option>
                <option value="createdAt_asc">Oldest</option>
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
