import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div className="absolute bg-black opacity-70 inset-0" />
      <div
        className="relative bg-gray-900 w-11/12 max-w-md p-6 rounded-2xl shadow-2xl border border-gray-700 text-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-200 transition"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
  useEffect(() => {
    console.log("CreateUserModal mounted");
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addRowToUserTable = async (formData) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const nodeId = import.meta.env.VITE_API_DATATABLEID;
      const url = `${baseUrl}/jsonapi/node/mydata/${nodeId}`;
      const getResponse = await axios.get(url, {
        headers: { "Content-Type": "application/vnd.api+json" },
      });
      console.log(getResponse.data);
      const node = getResponse.data.data;

      let existingTable = node.attributes.field_mydata?.value || {};
      let duplicate = false;
      for (const key in existingTable) {
        if (key === "0" || key === "caption") continue;
        const row = existingTable[key];
        if (row["1"] === formData.name || row["2"] === formData.email) {
          duplicate = true;
          break;
        }
      }

      if (duplicate) {
        toast.error("Username or Email already exists!");
        throw new Error("Duplicate user found");
      }

      const newKey = Date.now().toString();
      existingTable[newKey] = {
        "0": newKey,
        "1": formData.name,
        "2": formData.email,
        "3": formData.role,
        weight: "0",
      };

      const payload = {
        data: {
          type: "node--mydata",
          id: nodeId,
          attributes: {
            field_mydata: {
              value: existingTable,
            },
          },
        },
      };

      console.log(existingTable);

      const patchResponse = await axios.patch(url, payload, {
        headers: { "Content-Type": "application/vnd.api+json" },
      });

      if (patchResponse.status === 200) {
        toast.success("User has been added successfully!");
      } else {
        toast.error("An error occurred while adding the user!");
      }
      console.log("Data is : ", patchResponse.data);
      return patchResponse.data;
    } catch (err) {
      console.error("Error updating node:", err.response || err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const newUserData = await addRowToUserTable(formData);
      onUserCreated(newUserData);
      onClose();
    } catch (err) {
      console.error("Error creating user:", err.response || err);
      setError("There was an error creating the user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-md mx-auto font-semibold">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-200">Create New User</h2>
        </div>
        {error && <p className="text-red-400 text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-400 mb-1">
              Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-400 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role</option>
              <option value="Administrator">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="Author">Author</option>
              <option value="Subscriber">Subscriber</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-gray-200 rounded-md hover:bg-blue-500 transition"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateUserModal;
