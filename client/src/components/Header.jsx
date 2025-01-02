import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaSignInAlt } from "react-icons/fa";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="">
          <h1 className="font-bold text-2xl flex flex-wrap justify-center items-end">
            <span className="text-yellow-400 text-3xl ">Elite</span>
            <span className="text-slate-700 mb-[0.2px]">Estate</span>
          </h1>
        </Link>

        <ul className="flex gap-10 items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-100 p-2 rounded-lg flex items-center border-2 border-yellow-300"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-24 sm:w-64 "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className="text-slate-600" />
            </button>
          </form>
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/contactus">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Contact us
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full border-2 border-yellow-400 h-12 w-12 object-cover "
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" flex items-center bg-gradient-to-r from-yellow-400 to-yellow-200 text-white cursor-pointer  text-center shadow-xs transition-all duration-500 hover:bg-gradient-to-l px-2 py-1 rounded-md">
                {" "}
                Sign in <FaSignInAlt className="ml-2 text-lg" />
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
