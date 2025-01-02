import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { ToastContainer, toast } from "react-toastify";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    const usernamePattern = /^(?=.*[A-Z])(?=.*\d)/;
    if (!usernamePattern.test(username)) {
      toast.error(
        "Username must contain at least one uppercase letter and one number."
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (confirmPassword !== password) {
      toast.warn("Confirm Password does not match the password.");
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
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setLoading(false);
        setError(data.message);
        toast.error(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      toast.success("Registration Successful!");
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto pb-10">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg outline-1 outline-yellow-400"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg outline-1 outline-yellow-400"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type={showPass ? "text" : "password"}
          placeholder="password"
          className="border p-3 rounded-lg outline-1 outline-yellow-400"
          id="password"
          onChange={handleChange}
          required
        />
        <input
          type={showPass ? "text" : "password"}
          placeholder="confirm password"
          className="border p-3 rounded-lg outline-1 outline-yellow-400"
          id="confirmPassword"
          onChange={handleChange}
          required
        />
        <div className="flex">
          <input
            type="checkbox"
            onChange={(e) => setShowPass(e.target.checked)}
            className="mr-3 ml-1 cursor-pointer"
            name=""
            id=""
          />
          <p>{showPass ? "Hide password" : "Show password"}</p>
        </div>

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}
