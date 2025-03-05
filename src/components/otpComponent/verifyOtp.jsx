"use client";

import { useState, useRef } from "react";
import ResendOtpButton from "./ResendOtpButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Verify = ({ isVerify, setIsVerify }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const email = localStorage.getItem("email")

    const verifyOTP = async (otpValue) => {
        if (isVerifying) return;
        setIsVerifying(true);
        const otpString = otpValue.join("");
        let isSuccess = false;
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/verifyOTP",
                { otp: otpString, email},
                { withCredentials: true }
            );
            console.log("OTP verification response:", response);
            if(response.data.success){
                toast.success(response.data.message);
            }else{
                toast.error(response.data.message)
            }
            isSuccess = true;
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (error) {
            console.error("Error verifying OTP:", error);
        } finally {
            if (!isSuccess) {
                setIsVerifying(false);
            }
        }
    };

    const handleChange = (index, value) => {
        if (!isNaN(Number(value)) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
            if (newOtp.every((digit) => digit !== "")) {
                verifyOTP(newOtp);
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e, index) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("Text");
        const digits = pastedData.replace(/\D/g, "");
        if (digits.length === otp.length) {
            const otpArray = digits.split("");
            setOtp(otpArray);
            inputRefs.current[otp.length - 1]?.focus();
            verifyOTP(otpArray);
        }
    };


    return (
        <>
            <div className={`min-h-screen w-full flex font-poppins justify-center bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800 text-white relative bg-cover bg-center ${isVerifying ? "filter blur-sm" : ""}`}>
                <div className="absolute w-40 h-40 bg-pink-500 blur-3xl opacity-20 rounded-full top-10 left-10 animate-pulse"></div>
                <div className="absolute w-40 h-40 bg-purple-500 blur-3xl opacity-20 rounded-full bottom-20 right-10 animate-pulse"></div>
                <div className="absolute w-40 h-40 bg-purple-500 blur-3xl opacity-20 rounded-full bottom-40 left-40 animate-pulse"></div>
                <div className="p-10 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <h2 className="mb-5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Enter OTP</h2>
                    <p className="mb-5 text-sm text-purple-100 text-center">Please enter the 6-digit code sent to your email.</p>
                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center w-full">
                        <div className="flex gap-2 mb-5">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={(e) => handlePaste(e, index)}
                                    maxLength={1}
                                    ref={(el) => {
                                        if (el) inputRefs.current[index] = el;
                                    }}
                                    className="w-12 h-12 text-center text-xl font-bold border-2 bg-gray-700 border-gray-300 rounded-md outline-none focus:border-purple-500 shadow-sm"
                                />
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-5">
                            <ResendOtpButton />
                        </div>
                        {isVerifying && <p className="mt-3 text-sm text-purple-300">Verifying...</p>}
                    </form>
                </div>
            </div>
            {isVerifying && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </>
    );
};

export default Verify;
