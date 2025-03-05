// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup/Signup";
import ProtectedRoute from "./components/ProtectedDashRoute";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <ProtectedRoute><LoginPage /></ProtectedRoute>} />
        <Route path="/signup" element={<ProtectedRoute><SignupPage /></ProtectedRoute>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
