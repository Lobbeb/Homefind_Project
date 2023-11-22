import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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

  // You should return your JSX from the component function.
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
                  className="h-[500px] "
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}
