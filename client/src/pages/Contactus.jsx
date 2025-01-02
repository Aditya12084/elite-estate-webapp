import React from "react";

const Contactus = () => {
  return (
    <div className="min-h-[600px] flex items-center justify-center  bg-gray-100">
      <div className="max-w-6xl p-3 md:flex space-x-9 w-full ">
        <div className="flex-1 flex flex-col space-y-7 justify-center basis-[80%]">
          <h2 className="text-4xl font-semibold mb-4">Contact us</h2>
          <p className="text-lg mb-6 ">
            Need to get in touch with us? Either fill out the form with your
            inquiry or find the
            <a href="#" className="text-yellow-400 underline ml-1 mr-2">
               department email
            </a>
             you’d like to contact below.
          </p>
        </div>

        {/* Right side (Form) */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg basis-[50%]  ">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First name*
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                  placeholder="First Name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last name*
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                placeholder="Email"
                required
              />
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                What can we help you with?
              </label>
              <textarea
                name="message"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                placeholder="Your message"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-yellow-400 text-white py-2 px-4 rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
