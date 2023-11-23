import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchLandlord() {
      if (!listing.userRef) {
        // Early return if there is no user reference to fetch
        console.log("No userRef available");
        return;
      }

      try {
        const response = await fetch(`/api/user/${listing.userRef}`, {
          signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLandlord(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          // Handle errors except for the fetch cancellation
          console.error("Fetch landlord error:", error);
        }
      }
    }

    fetchLandlord();

    // Cleanup function to abort fetch on unmount
    return () => {
      abortController.abort();
    };
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p className="text-xl">
            Contact <span className=" font-semibold ">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold ">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder=" Enter your message here..."
            className="w-full border p-3 rounded-lg placeholder-black"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-blue-700 text-white font-semibold text-center p-3 uppercase rounded-lg hover:opacity-90"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
