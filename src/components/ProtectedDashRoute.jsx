// ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/verify", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          setAuth(true);
        } else {
          setAuth(false);
          toast.error(res.data.message)
        }
      })
      .catch((error) => {
        setAuth(false);
      });
  }, []);

  if (auth === null) {
    return <Loader/>;
  }

  if (auth && (location.pathname === "/login" || location.pathname === "/signup")) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!auth && location.pathname !== "/login" && location.pathname !== "/signup") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
