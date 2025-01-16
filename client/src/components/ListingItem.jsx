import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { IoIosBed } from "react-icons/io";
import { FaBath } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";

import { FaRegMessage } from "react-icons/fa6";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { updateWishList } from "../redux/user/userSlice";

export default function ListingItem({ listing }) {
  const [inWishList, setInWishList] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addToWishList = async (id) => {
    setInWishList(!inWishList);
    const res = await axios.post(`/api/listing/wish-list/post/${id}`);
    if (res.status === 201) {
      setInWishList(true);
      dispatch(updateWishList(id));
    } else {
      setInWishList(false);
      dispatch(updateWishList(id));
    }
  };

  useEffect(() => {
    currentUser.wishlist.includes(listing._id)
      ? setInWishList(true)
      : setInWishList(false);
  }, []);

  return (
    <div className="bg-white shadow-md relative border hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <div className="absolute right-3 top-3 space-x-3 text-slate-100 z-[1]  cursor-pointer flex items-center">
        <FaRegMessage className="text-[28px]" />
        {inWishList ? (
          <FaBookmark
            className="text-[29px] text-yellow-200/80"
            onClick={() => {
              addToWishList(listing._id);
            }}
          />
        ) : (
          <FaRegBookmark
            className="text-[29px] text-slate-100"
            onClick={() => addToWishList(listing._id)}
          />
        )}
      </div>

      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover z-[2] hover:scale-105 transition-scale duration-300 "
        />

        <div className="p-3 flex flex-col gap-3 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          <div>
            <p className="text-slate-700 inline-block bg-yellow-200/80 px-2 py-1 rounded-md mt-2 font-semibold ">
              ₹
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-sm bg-slate-200 p-1 rounded-md flex items-center">
              <IoIosBed className="mr-2 text-xs" />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} bedrooms `
                : ` ${listing.bedrooms} bedroom `}
            </div>
            <div className="font-bold text-sm bg-slate-200 p-1 rounded-md flex items-center">
              <FaBath className="mr-2 text-xs" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} bathrooms `
                : `${listing.bathrooms} bathroom `}
            </div>
          </div>
        </div>
      </Link>
      <ToastContainer />
    </div>
  );
}
