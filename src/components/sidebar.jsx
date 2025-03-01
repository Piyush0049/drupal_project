import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  AiOutlineUser, 
  AiOutlineMail, 
  AiOutlinePlusCircle, 
  AiOutlineBarChart, 
  AiOutlineLogout 
} from "react-icons/ai";
import { FaAngleRight } from "react-icons/fa";

const Sidebar = ({ showCreateModal, setShowCreateModal }) => {
  const [active, setActive] = useState("Dashboard");

  const handleItemClick = (item) => {
    if (item.label === "Add New User") {
      setShowCreateModal(true);
    } else if (item.label === "Logout") {
      handleLogout();
    } else {
      setActive(item.label);
    }
  };

  const handleLogout = async () => {
    try {
      
      await axios.delete("http://localhost:5000/api/auth/logout", { withCredentials: true })
      // Redirect or refresh page after logout
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex w-60 lg:w-64 sticky top-0 left-0 max-h-screen md:bg-[#0b1327] bg-opacity-90 backdrop-blur-md rounded-l-[30px] flex-col py-6 text-white shadow-2xl"
      >
        <div className="text-[24px] font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-white text-center">
          User Dashboard
        </div>
        <nav className="flex flex-col space-y-2 mt-3">
          {menuItems.map((section, i) => (
            <div key={i}>
              {section.title && (
                <h2 className="text-pink-300 text-sm font-bold px-8 mt-4 mb-3">
                  {section.title}
                </h2>
              )}
              {section.items.map((item, j) => (
                <motion.div
                  key={j}
                  onClick={() => handleItemClick(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center py-3 px-8 rounded-lg text-gray-300 transition-all duration-300 cursor-pointer border-l-4 ${
                    active === item.label
                      ? "bg-gray-800 border-pink-400 text-white shadow-lg"
                      : "border-transparent hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {active === item.label && (
                    <motion.span
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaAngleRight className="text-pink-300 text-lg mr-2" />
                    </motion.span>
                  )}
                  {item.icon}
                  <span className="font-semibold ml-3">{item.label}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </nav>
      </motion.aside>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-[10000] border-t-[0.5px] border-gray-300 bg-black bg-opacity-95 backdrop-blur-md shadow-2xl flex justify-around items-center py-1.5 lg:hidden"
      >
        {bottomNavItems.map((item, i) => (
          <motion.div
            key={i}
            onClick={() => handleItemClick(item)}
            whileTap={{ scale: 0.9 }}
            className={`flex flex-col items-center text-gray-300 cursor-pointer ${
              active === item.label ? "text-pink-400" : "hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-[8px] mt-1">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

const menuItems = [
  {
    title: "Dashboard",
    items: [{ icon: <AiOutlineBarChart className="text-xl" />, label: "Dashboard" }],
  },
  {
    title: "User Management",
    items: [
      { icon: <AiOutlinePlusCircle className="text-xl" />, label: "Add New User" },
      { icon: <AiOutlineUser className="text-xl" />, label: "All Users" },
    ],
  },
  {
    title: "Emails",
    items: [{ icon: <AiOutlineMail className="text-xl" />, label: "Inbox" }],
  },
  {
    title: "Settings",
    items: [{ icon: <AiOutlineLogout className="text-xl text-red-50" />, label: "Logout" }],
  },
];

const bottomNavItems = [
  { icon: <AiOutlineBarChart className="text-2xl" />, label: "Dashboard" },
  { icon: <AiOutlinePlusCircle className="text-2xl" />, label: "Add New User" },
  { icon: <AiOutlineUser className="text-2xl" />, label: "All Users" },
  { icon: <AiOutlineMail className="text-2xl" />, label: "Inbox" },
  { icon: <AiOutlineLogout className="text-2xl text-red-400" />, label: "Logout" },
];

export default Sidebar;
