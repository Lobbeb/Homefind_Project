import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../Components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/get/${params.listingId}`);

        if (!response.ok) {
          // Handle HTTP errors
          throw new Error("Network response was not ok.");
        }

        const data = await response.json();

        if (data.success === false) {
          // Handle API errors
          throw new Error(data.message || "Error fetching the listing.");
        }

        setListing(data);
      } catch (error) {
        console.error("Fetch listing error:", error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  // State for the modal visibility and the current image
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // Function to open modal with the clicked image
  const openModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p>Error loading the listing.</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation={true}>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px] cursor-pointer "
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover", // TODO: change to contain for the others, review the results
                  }}
                  onClick={() => openModal(url)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full border-blue-700 w-12 h-12 flex justify-center items-center text-white bg-blue-700 cursor-pointer hover:opacity-80">
            <FaShare
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            ></FaShare>
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-green-600 p-2">
              Link copied!
            </p>
          )}
          {/*TODO: Gotta decide if we want it to be on the left or we move all info more into the middle leaving it as it is for*/}
          <div className="bg-gray-300 flex-grow flex bg-opacity-90">
            <div className="container mx-auto p-24">
              <div>
                <p className="text-2xl font-semibold transformed-text1">
                  {listing.name} -{" "}
                  <span
                    className={`${
                      listing.offer ? "text-red-500" : "text-black"
                    }`}
                  >
                    €{" "}
                    {listing.offer
                      ? (
                          listing.regularPrice - listing.discountPrice
                        ).toLocaleString("en-Europe")
                      : listing.regularPrice.toLocaleString("en-Europe")}
                    {listing.type === "rent" && " / month"}
                  </span>
                </p>
                <p className="flex items-center mt-6 gap-2 text-black text-sm transformed-text2 font-semibold">
                  <FaMapMarkerAlt className="text-blue-700" />
                  {listing.address}
                </p>
                <div className="flex gap-4 transformed-text">
                  <p className="bg-blue-700 w-full max-w-[200px] text-white text-center p-1 rounded-md transformed-text3">
                    {listing.type === "rent" ? "For Rent" : "For Sale"}
                  </p>
                  {listing.offer && (
                    <p className="bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md transformed-text3">
                      {listing.discountPrice.toLocaleString("en-Europe")} € Off
                    </p>
                  )}
                </div>
                <p className="whitespace-normal break-words  text-black transformed-text4">
                  <span className="font-semibold text-black ">
                    Description -{" "}
                  </span>
                  {listing.description}
                </p>
                {/*TODO: DOING MORE FILTERS ADD THEM HERE*/}
                <ul className="text-blue-900 font-semibold text-sm flex flex-wrap items-center gap-2 sm:gap-6 transformed-text5">
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <FaBed className="text-lg" />
                    {listing.bedrooms > 1
                      ? `${listing.bedrooms} beds `
                      : `${listing.bedrooms} bed `}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <FaBath className="text-lg" />
                    {listing.bathrooms > 1
                      ? `${listing.bathrooms} baths `
                      : `${listing.bathrooms} bath `}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <FaParking className="text-lg" />
                    {listing.parking ? "Parking spot" : "No Parking"}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <FaChair className="text-lg" />
                    {listing.furnished ? "Furnished" : "Unfurnished"}
                  </li>
                </ul>
                {currentUser &&
                  listing.userRef !== currentUser._id &&
                  !contact && (
                    <div className="flex justify-center mt-4 ">
                      {" "}
                      {/* This will center the button */}
                      <button
                        onClick={() => setContact(true)}
                        className="bg-blue-700 text-white font-semibold rounded-lg uppercase hover:opacity-95 p-3"
                      >
                        Contact Owner
                      </button>
                    </div>
                  )}
                {contact && <Contact listing={listing} />}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Gotta have this here to cover everything when clicking the image*/}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <img
            src={currentImage}
            alt="Enlarged view"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </main>
  );
}
