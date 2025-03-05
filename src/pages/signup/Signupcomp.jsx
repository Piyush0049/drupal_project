"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPageComponent = ({setIsVerify, isVerify }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (username) => {
    if (!username) {
      return "Required";
    } else if (username.length < 3) {
      return "Username must be at least 3 characters";
    }
    return "";
  };

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
    } else if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      return "Required";
    } else if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const usernameValidationError = validateUsername(username);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(confirmPassword);
    setUsernameError(usernameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);
    if (
      !usernameValidationError &&
      !emailValidationError &&
      !passwordValidationError &&
      !confirmPasswordValidationError
    ) {
      console.log({ username, email, password });
    }
    const data = { username, email, password, confirmPassword };
    try {
      const responseData = await axios.post("http://localhost:5000/api/auth/register", data, { withCredentials: true });
      console.log(responseData.data)
      if (responseData.data.success) {
        toast.success(responseData.data.message);
        localStorage.setItem("email", data.email);
        setIsVerify(true);
      } else {
        toast.error(responseData.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex font-poppins justify-center bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800 text-white relative bg-cover bg-center"
    >
      <div className="absolute w-40 h-40 bg-pink-500 blur-3xl opacity-20 rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-40 h-40 bg-purple-500 blur-3xl opacity-20 rounded-full bottom-20 right-10 animate-pulse"></div>
      <div className="absolute w-40 h-40 bg-purple-500 blur-3xl opacity-20 rounded-full bottom-40 left-40 animate-pulse"></div>
      <div className="flex w-auto min-w-[80%] sm:min-w-[60%] lg:min-w-0 lg:w-[40%] justify-center items-center bg-transparent px-[0px] lg:pl-10 py-10 bg-opacity-80 relative z-10">
        <div className="w-full lg:max-w-[83%] xl:max-w-[63%] space-y-8">
          <div>
            <div className="text-[22px] lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
              Create Your Account
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-1 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-teal-50">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 mt-1 text-xs border border-purple-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all bg-transparent placeholder-purple-300"
                />
                {usernameError && (
                  <div className="text-red-400 text-xs mt-2">{usernameError}</div>
                )}
              </div>
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
                  className="w-full p-2 mt-1 text-xs border border-purple-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all bg-transparent placeholder-purple-200"
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
                    className="w-full p-2 mt-1 text-xs border border-purple-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all bg-transparent placeholder-purple-300"
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {passwordError && (
                  <div className="text-red-400 text-xs mt-2">{passwordError}</div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-teal-50">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 mt-1 text-xs border border-purple-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all bg-transparent placeholder-purple-300"
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-400 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {confirmPasswordError && (
                  <div className="text-red-400 text-xs mt-2">{confirmPasswordError}</div>
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
                "Sign Up"
              )}
            </button>
            <p className="text-center text-xs mt-4">
              Already have an account?{" "}
              <a onClick={() => navigate("/login")} className="text-teal-300 hover:cursor-pointer hover:text-purple-200">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPageComponent;
