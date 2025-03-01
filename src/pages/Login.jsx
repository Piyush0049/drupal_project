"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) {
      return "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return "Invalid email";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Required";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {

      const emailValidationError = validateEmail(email);
      const passwordValidationError = validatePassword(password);

      setEmailError(emailValidationError);
      setPasswordError(passwordValidationError);

      if (!emailValidationError && !passwordValidationError) {
        console.log({ email, password });
      }
      const responseData = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(responseData.data)
      if (responseData.data.success) {
        toast.success(responseData.data.message);
        navigate("dashboard")
      } else {
        toast.error(responseData.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex font-poppins justify-center bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800 text-white relative bg-cover bg-center"
    >
      <div className="flex w-auto min-w-[80%] sm:min-w-[60%] lg:min-w-0 lg:w-[40%] justify-center items-center bg-transparent px-[0px] lg:pl-10 py-10 bg-opacity-80 relative z-10">
        <div className="w-full lg:max-w-[83%] xl:max-w-[63%] space-y-8">
          <div>
            <div className="text-[22px] lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
              Login To Your Account
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-1 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-teal-50">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mt-1 text-xs border border-purple-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all bg-transparent placeholder-purple-300"
                />
                {emailError && (
                  <div className="text-red-400 text-xs mt-2">{emailError}</div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-teal-50">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 text-xs mt-1 border border-purple-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all bg-transparent placeholder-purple-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 cursor-pointer">
                    {showPassword ? (
                      <FaEyeSlash onClick={() => setShowPassword(false)} />
                    ) : (
                      <FaEye onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                </div>
                {passwordError && (
                  <div className="text-red-400 text-xs mt-2">{passwordError}</div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-10 text-sm py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-sm hover:shadow-sm hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-400 transition-all transform hover:scale-105 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-center text-xs mt-4">
              Don’t have an account?{" "}
              <a onClick={() => { navigate("/signup") }} className="text-teal-300 hover:cursor-pointer hover:text-purple-200">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
