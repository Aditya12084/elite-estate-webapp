import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { IoIosBed } from "react-icons/io";
import { FaBath } from "react-icons/fa";
import { app } from "../firebase";
import { MdMapsHomeWork } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, NavLink, Route, Routes } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { set } from "mongoose";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [wishlist, setWishlist] = useState([]);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  useEffect(() => {
    if (formData.avatar) {
      console.log(formData.avatar);
      handleSubmit(new Event("submit"));
    }
  }, [formData.avatar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password } = formData;

    if (!password) {
      toast.error("Password is required.");
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(password)) {
      toast.error(
        "Password must be 8+ characters long and include an uppercase letter, a lowercase letter, and a number."
      );
      return;
    }

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      toast.success("Password updated successfully!!");
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  useEffect(() => {
    handleShowListings();
  }, []);

  useEffect(() => {
    handleWishListing();
  }, []);

  const handleWishListing = async () => {
    try {
      const res = await axios.get(`/api/listing/wish-list`);
      setWishlist(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRemoveFromWishList = async (listingId) => {
    try {
      const res = await axios.delete(`/api/listing/wish-list/remove/${listingId}`);
      if (res.status === 200) {
        setWishlist((prev) => prev.filter((listing) => listing._id !== listingId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-7xl m-auto  flex flex-row gap-3">
      <div className="max-w-xs  border-2  px-4 py-4 bg-slate-300 rounded-lg flex flex-col">
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <NavLink to="" className="flex flex-col gap-2">
              <img
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className="rounded-full h-16 w-16 object-cover cursor-pointer self-center mt-2 border-2 border-yellow-300"
              />
              <p className="text-sm self-center">
                {fileUploadError ? (
                  <span className="text-red-700">
                    Error Image upload (image must be less than 2 mb)
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-700">
                    Image successfully uploaded!
                  </span>
                ) : (
                  ""
                )}
              </p>
              <h3 className="self-center font-bold text-lg text-slate-700">
                {currentUser.username}
              </h3>
            </NavLink>
            <hr />
            {/* <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              id="username"
              className="border p-3 rounded-lg outline-1  outline-yellow-400"
              onChange={handleChange}
              required
              readOnly
              disabled
            /> */}
          </form>
        </div>
        <div className="flex flex-col flex-1  h-fit">
          <ul className="flex flex-1 flex-col gap-4 py-5 ">
            <li onClick={handleShowListings}>
              <NavLink
                to="my-listings"
                className="flex gap-4 items-center font-semibold text-base bg-yellow-100 px-5 rounded-md py-3 text-slate-700"
              >
                <MdMapsHomeWork className="text-2xl" /> My Listings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="wishlist"
                className="flex gap-4 items-center font-semibold text-base bg-yellow-100 px-5 rounded-md py-3 text-slate-700"
              >
                <FaBookmark className="text-2xl" /> Wishlisted properties
              </NavLink>
            </li>
          </ul>

          <div className="flex flex-col justify-between mt-5 gap-4">
            <span
              onClick={handleSignOut}
              className="text-red-700 cursor-pointer"
            >
              Sign out
            </span>
            <span
              // onClick={handleDeleteUser}
              className="text-red-700 cursor-pointer"
            >
              Delete account
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1  rounded-md max-h-screen overflow-scroll">
        <Routes>
          <Route
            path=""
            element={
              <div>
                <h1 className="text-3xl font-semibold text-center my-7">
                  Profile
                </h1>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 max-w-xl m-auto"
                >
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                  />
                  <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt="profile"
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-yellow-300"
                  />
                  <p className="text-sm self-center">
                    {fileUploadError ? (
                      <span className="text-red-700">
                        Error Image upload (image must be less than 2 mb)
                      </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                      <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                      <span className="text-green-700">
                        Image successfully uploaded!
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                  <input
                    type="text"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    id="username"
                    className="border p-3 rounded-lg outline-1  outline-yellow-400"
                    onChange={handleChange}
                    required
                    readOnly
                    disabled
                  />
                  <input
                    type="email"
                    placeholder="email"
                    id="email"
                    defaultValue={currentUser.email}
                    className="border p-3 rounded-lg outline-1  outline-yellow-400"
                    onChange={handleChange}
                    readOnly
                    disabled
                  />
                  <input
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                    id="password"
                    className="border p-3 rounded-lg outline-1  outline-yellow-400"
                    required
                  />
                  <button
                    disabled={loading}
                    className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
                  >
                    {loading ? "Loading..." : "Update"}
                  </button>
                  <Link
                    className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                    to={"/create-listing"}
                  >
                    Create Listing
                  </Link>
                </form>
              </div>
            }
          />
          <Route
            path="my-listings"
            element={
              <div>
                {" "}
                {userListings && userListings.length > 0 && (
                  <div className="flex flex-col gap-4 mb-6 px-5">
                    <h1 className="text-center mt-7 text-2xl font-semibold mb-4 text-slate-600">
                      Your Listings
                    </h1>
                    <hr className="" />
                    {userListings.map((listing) => (
                      <div
                        key={listing._id}
                        className=" rounded-lg px-3 flex justify-between items-center gap-4  py-3"
                      >
                        <Link
                          to={`/listing/${listing._id} `}
                          className="rounded-md"
                        >
                          <img
                            src={listing.imageUrls[0]}
                            alt="listing cover"
                            className="rounded-lg w-96 object-contain m-0"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col gap-6">
                          <Link
                            className="text-slate-700 font-semibold  truncate flex flex-1 flex-col gap-4"
                            to={`/listing/${listing._id}`}
                          >
                            <p>{listing.name}</p>
                            <p className="flex items-center">
                              <FaLocationDot className="mr-2" />{" "}
                              {listing.address}
                            </p>
                            <span className="text-slate-700 bg-yellow-100 text-gr self-start px-2 py-1 rounded-md">
                              ₹ {listing.regularPrice} /-
                            </span>

                            <div className="flex gap-1">
                              <span className="flex items-center bg-yellow-100 text-slate-700 rounded-md px-2 py-1">
                                <IoIosBed /> {listing.bedrooms} bedrooms
                              </span>
                              <span className="flex items-center bg-yellow-100 ml-2 text-slate-700 rounded-md px-2 py-1">
                                <FaBath /> {listing.bathrooms} bathrooms
                              </span>
                            </div>
                          </Link>
                          <div className="flex flex-row items-baseline space-x-2">
                            <Link
                              to={`/update-listing/${listing._id}`}
                              className=" justify-center"
                            >
                              <button className="uppercase bg-green-400 px-4 py-1 text-white rounded-md">
                                Edit
                              </button>
                            </Link>
                            <button
                              onClick={() => handleListingDelete(listing._id)}
                              className=" uppercase  ml-6 bg-red-500 px-4 py-1 text-white rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}{" "}
              </div>
            }
          />

          <Route
            path="wishlist"
            element={
              <div>
                {" "}
                {wishlist && wishlist.length > 0 && (
                  <div className="flex flex-col gap-4 mb-6 px-5">
                    <h1 className="text-center mt-7 text-2xl font-semibold mb-4 text-slate-600">
                      Your Wishlist
                    </h1>
                    <hr className="" />
                    {wishlist.map((listing) => (
                      <div
                        key={listing._id}
                        className=" rounded-lg px-3 flex justify-between items-center gap-4  py-3"
                      >
                        <Link
                          to={`/listing/${listing._id} `}
                          className="rounded-md"
                        >
                          <img
                            src={listing.imageUrls[0]}
                            alt="listing cover"
                            className="rounded-lg w-96 object-contain m-0"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col gap-6">
                          <Link
                            className="text-slate-700 font-semibold  truncate flex flex-1 flex-col gap-4"
                            to={`/listing/${listing._id}`}
                          >
                            <p>{listing.name}</p>
                            <p className="flex items-center">
                              <FaLocationDot className="mr-2" />{" "}
                              {listing.address}
                            </p>
                            <span className="text-slate-700 bg-yellow-100 text-gr self-start px-2 py-1 rounded-md">
                              ₹ {listing.regularPrice} /-
                            </span>

                            <div className="flex gap-1">
                              <span className="flex items-center bg-yellow-100 text-slate-700 rounded-md px-2 py-1">
                                <IoIosBed /> {listing.bedrooms} bedrooms
                              </span>
                              <span className="flex items-center bg-yellow-100 ml-2 text-slate-700 rounded-md px-2 py-1">
                                <FaBath /> {listing.bathrooms} bathrooms
                              </span>
                            </div>
                          </Link>
                          <div className="flex flex-row items-baseline space-x-2">
                            <button
                              onClick={() => handleListingDelete(listing._id)}
                              className=" uppercase  bg-red-500 px-4 py-1 text-white rounded-md"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}{" "}
              </div>
            }
          />
        </Routes>
      </div>
      {/* <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 border-yellow-300"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg outline-1  outline-yellow-400"
          onChange={handleChange}
          required
          readOnly
          disabled
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg outline-1  outline-yellow-400"
          onChange={handleChange}
          readOnly
          disabled
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg outline-1  outline-yellow-400"
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>

      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-center mt-7 text-2xl font-semibold mb-4">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 border-yellow-400 mb-2"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-row-reverse items-center item-center space-x-2 ">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase  ml-6"
                >
                  Delete
                </button>
                <Link
                  to={`/update-listing/${listing._id}`}
                  className=" justify-center"
                >
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )} */}
      <ToastContainer />
    </div>
  );
}
