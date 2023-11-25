import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Pagination } from "swiper/modules";
import { IoIosArrowForward } from "react-icons/io";
import ItemListing from "../Components/ItemListing";
import SwiperCore from "swiper";
import "swiper/css/bundle";

//TODO fix mobile version of this, when you does it to mini size the two first things are shit
//TODO second style it abit better, right now its OK at best.
export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation]);

  const [rentListings, setRentListings] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const navigate = useNavigate();

  console.log(offerListings);
  console.log("Offer listings:", offerListings);
  console.log("Rent listings:", rentListings);
  console.log("Sale listings:", saleListings);
  useEffect(() => {
    const fetchLatestListings = async () => {
      try {
        const response = await fetch(
          "/api/listing/get?limit=4&sort=createdAt&order=desc"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLatestListings(data);
      } catch (error) {
        console.error("Failed to fetch latest listings:", error);
      }
    };

    //Can literally delete everything from here to next comment (to scared to do that tho)
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };

    const fetchAllListings = async () => {
      await fetchLatestListings();
      await fetchOfferListings();
      await fetchRentListings();
      await fetchSaleListings();
    };
    //To here
    fetchAllListings();
  }, []);

  return (
    <div className="">
      {/* top*/}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <div
          className="bg-gray-200 bg-opacity-80 rounded-lg p-4 "
          style={{ maxWidth: "50%" }}
        >
          <h1 className="text-blue-700 font-bold text-3xl lg:text-6xl">
            Find your <span className="text-blue-400">dream</span>
            <br /> home!
          </h1>
          <div className="text-blue-700 font-semibold">
            Homefind - The convinient living for your life
            <br />
            Wide range of personlized apartments & houses
          </div>

          <Link
            to={"/search"}
            className="text-xs sm:text-sm text-blue-900 font-bold hover:underline"
          >
            {" "}
            Get started today!
          </Link>
        </div>
      </div>
      {/* Swiper middle */}
      <div className="h-[550px] flex flex-wrap md:flex-row gap-5 items-center justify-center bg-blue-900 bg-opacity-80 md-15">
        <div className="flex flex-col gap-3">
          <h1 className="text-white text-[50px] font-semibold">
            Our latest postings<span className="text-">.</span>
            <p className="text-[16px] max-w-[400px] text-white md:text-white">
              Browse through our latest postings to find your perfect home.
            </p>
          </h1>
        </div>
        <div className="w-full md:w-[70%]">
          <Swiper
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            freeMode={true}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            modules={[FreeMode, Pagination, Navigation]}
            className="mySwiper"
          >
            {latestListings &&
              latestListings.length > 0 &&
              latestListings.map((listing) => (
                <SwiperSlide key={listing._id} className="mb-22">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => navigate(`/listing/${listing._id}`)} // Redirect to the listing detail page
                  >
                    <img
                      src={listing.imageUrls[0]}
                      alt="Listing"
                      className="rounded-md object-cover"
                      style={{ height: "500px", width: "100%" }}
                    />
                    {/* Listing Information */}

                    <div className="absolute inset-0 bg-gradient-to-r rounded-lg from-blue-800 via-blue-500 to-blue-300 opacity-0 group-hover:opacity-70 transition-all duration-300 ease-in-out" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                      <span className="text-white">View Listing</span>
                      <IoIosArrowForward className="ml-2 text-white" />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>

      {/* TODO: Can delete this below and add an about page or redo/redesign it, its a temporary fix for now*/}
      {/* listing results for offer, sale and rent */}
      <div
        className="bg-gray-200 
      "
      >
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 ">
          {offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-blue-600">
                  Recent offers on sale!
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?offer=true"}
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ItemListing listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-blue-600">
                  Recent places for rent
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=rent"}
                >
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ItemListing listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-blue-600">
                  Recent places for sale
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=sale"}
                >
                  Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ItemListing listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Bottom of the page */}
      <div className="h-[350px] flex flex-col md:flex-row gap-5 items-center justify-around bg-blue-900 md:px-15 opacity-90">
        {/* Contact Information */}
        <div className="text-white text-center flex flex-col justify-between p-4">
          <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
          <p>Street: Placeholder</p>
          <p>City, Placeholder</p>
          <p>Phone: Placeholder</p>
          <p>Email: Placeholder</p>
        </div>

        {/* Social Media Links */}
        <div className="text-white text-center flex flex-col justify-between p-4">
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/pepethe_frog/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/instagramicon1.png"
                alt="Instagram"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://twitter.com/elonmusk?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/Twittericon1.png"
                alt="Twitter"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://www.facebook.com/KaibigangOsoPH/videos/1027901588319269"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/facebookicon.png"
                alt="Facebook"
                className="w-8 h-8"
              />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-white text-center flex flex-start p-4">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          </a>
          {/* Add quick links or navigation items here */}
        </div>
      </div>
    </div>
  );
}
