import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
// import { BsTwitterX } from "react-icons/bs";
import { IoLinkSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

import { IoIosCall } from "react-icons/io";

import { MdEmail } from "react-icons/md";

import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-slate-300 h-[350px] px-[12%] space-y-10 ">
      <div className="flex items-center justify-between pt-6">
        <Link to="/" className="">
          <h1 className="font-bold text-2xl flex flex-wrap justify-center items-end">
            <span className="text-yellow-400 text-3xl ">Elite</span>
            <span className="text-slate-700 mb-[0.2px]">Estate</span>
          </h1>
        </Link>
        <div className="flex items-center space-x-3">
          <a href="">
            <FaWhatsapp className="text-3xl text-slate-700" />
          </a>
          <a href="">
            <FaFacebook className="text-3xl text-slate-700" />
          </a>

          <a href="">
            <FaInstagram className="text-3xl text-slate-700" />
          </a>

          {/* <BsTwitterX />s */}
        </div>
      </div>

      <div className="flex ">
        <div className="basis-[25%]">
          <ul className="space-y-3 ml-3">
            <li className="flex items-center ">
              <IoLinkSharp className="mr-2" />
              <Link to="/" className="hover:text-blue-600 hover:underline">
                Home
              </Link>{" "}
            </li>
            <li className="flex items-center">
              <IoLinkSharp className="mr-2" />
              <Link className="hover:text-blue-600 hover:underline" to="/about">
                About
              </Link>{" "}
            </li>
            <li className="flex items-center">
              <IoLinkSharp className="mr-2" />
              <Link
                className="hover:text-blue-600 hover:underline"
                to="/contactus"
              >
                Contact us
              </Link>{" "}
            </li>
          </ul>
        </div>
        <div className="basis-[25%]">
          <ul className="space-y-3 ml-3">
            <li className="flex items-center ">
              <IoLinkSharp className="mr-2" />
              <Link
                to="/search"
                className="hover:text-blue-600 hover:underline"
              >
                Property listings
              </Link>{" "}
            </li>
          </ul>
        </div>
        <div className="basis-[50%]">
          <ul className="space-y-3 ml-3">
            <li className="flex items-center ">
              <FaLocationDot className="mr-2 text-xl" />
              Shiv Shakti Rahiwashi Mandal, Rajendra Nagar, Borivali East,
              Mumbai, Maharshtra 400066.
            </li>
            <li className="flex items-center">
              <IoIosCall className="mr-2 text-xl" />
              +91 9324210559
            </li>
            <li className="flex items-center">
              <MdEmail className="mr-2" />
              eliteestate1@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center pt-10">
        <FaCopyright className="mr-1" /> EliteEstate 2024. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
