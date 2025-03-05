"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ResendOtpButton = () => {
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const resendOTPHandler = async () => {
    setIsResendingOTP(true);
    const email = localStorage.getItem("email");

    try {
      const data = await axios.post("http://localhost:5000/api/auth/resend", { email });
      
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      setTimeLeft(30);
    } catch (error) {
      toast.error("Error re-sending OTP", error?.message);
    } finally {
      setIsResendingOTP(false);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const isDisabled = timeLeft > 0 || isResendingOTP;

  return (
    <div className="flex items-center gap-3 font-poppins">
      <button
        type="button"
        onClick={resendOTPHandler}
        disabled={isDisabled}
        className={` px-5 py-2 rounded-md text-white font-semibold transition-colors duration-300 focus:outline-none text-nowrap
          ${isDisabled ? "bg-gray-400 cursor-not-allowed hidden" : "bg-gradient-to-r from-pink-500 to-purple-500 hover:bg-purple-700"}`}
      >
        {isResendingOTP ? (
          <div className="flex items-center">
            Resending
            <Loader2 className="ml-2 w-4 h-4 animate-spin" />
          </div>
        ) : (
          "Resend OTP"
        )}
      </button>
      <span className={`text-sm text-purple-300 ${timeLeft==0 && "hidden"}`}>
        Resend OTP in 00:{String(timeLeft).padStart(2, "0")}s
      </span>
    </div>
  );
};

export default ResendOtpButton;
