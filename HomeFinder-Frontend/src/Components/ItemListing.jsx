import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ItemListing({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Ffoundation.app%2F%40h7ddns%2Ffoundation%2F121984&psig=AOvVaw0drUVo18bdnOx54z5gLq7-&ust=1700894641763000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCLCgnriE3IIDFQAAAAAdAAAAABAE"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover rounded-lg hover:scale-110 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-black truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-2">
            <MdLocationOn className="h-4 w-4 text-blue-700" />
            <p className="text-sm text-black truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-black line-clamp-2">
            {listing.description}
          </p>

          <p className="text-green-600 mt-2 font-semibold">
            € {listing.regularPrice.toLocaleString("en-Europe")}
            {listing.type === "rent" && "/ Month"}
          </p>
          {listing.offer && (
            <p className="text-red-600 text-xs">
              Save € {listing.discountPrice.toLocaleString("en-Europe")}!
            </p>
          )}

          <div className="text-black flex gap-2">
            <div className="font-semibold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms `
                : `${listing.bedrooms} Beds `}
            </div>
            <div className="font-semibold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms `
                : `${listing.bathrooms} Baths `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
