import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center w-screen items-center min-h-screen bg-gray-800">
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 border-r-teal-400 border-b-purple-500 border-l-pink-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
