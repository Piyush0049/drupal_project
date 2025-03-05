"use client";
import React, { useState } from "react";
import SignupPageComponent from "./Signupcomp";
import Verify from "../../components/otpComponent/verifyOtp";

const SignupPage = () => {
  const [isVerify, setIsVerify] = useState(false);

  return (
    <>
      {!isVerify ? (
        <SignupPageComponent setIsVerify={setIsVerify} isVerify={isVerify} />
      ) : (
        <Verify setIsVerify={setIsVerify} isVerify={isVerify} />
      )}
    </>
  );
};

export default SignupPage;
