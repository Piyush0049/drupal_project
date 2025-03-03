import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex text-gray-200 items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="absolute bg-black opacity-70 inset-0" />
      <div
        className="bg-gray-900 w-11/12 z-[1000] max-w-md p-5 relative rounded-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl  rounded-2xl text-gray-200 hover:text-gray-700"
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
    console.log('CreateUserModal mounted');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        headers: { 'Content-Type': 'application/vnd.api+json' }
      });
      console.log(getResponse.data)
      const node = getResponse.data.data;
      // let existingTable = node.attributes.field_mydata?.value || {};
      // const duplicate = Object.values(existingTable).find(entry => {
      //   return entry["1"] === formData.name || entry["2"] === formData.email;
      // });

      let existingTable = node.attributes.field_mydata?.value || {};
      const duplicate = false;
      for (const key in existingTable) {
        if (key === "0" || key === "caption") continue;
        const row = existingTable[key];
        if (row["1"] === formData.name || row["2"] === formData.email) {
          duplicateFound = true;
          break;
        }
      }

      if (duplicate) {
        toast.error("Username or Email already exists!");
        throw new Error("Duplicate user found");
      }

      const newKey = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      console.log(formData);

      existingTable[newKey] = {
        "0": newKey,
        "1": formData.name,
        "2": formData.email,
        "3": formData.role,
        "weight": "0"
      };



      const payload = {
        data: {
          type: 'node--mydata',
          id: nodeId,
          attributes: {
            field_mydata: {
              value: existingTable
            }
          }
        }
      };

      console.log(existingTable)

      const patchResponse = await axios.patch(url, payload, {
        headers: { 'Content-Type': 'application/vnd.api+json' }
      });

      if (patchResponse.status === 200) {
        toast.success("User has been added successfully!");
      } else {
        toast.error("An error occurred while adding the user!");
      }
      console.log("Data is : ", patchResponse.data)
      return patchResponse.data;
    } catch (err) {
      console.error('Error updating node:', err.response || err);
      throw err;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const newUserData = await addRowToUserTable(formData);
      onUserCreated(newUserData);
      onClose();
    } catch (err) {
      console.log(err)
      console.error('Error creating user:', err.response || err);
      setError('There was an error creating the user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className=" max-w-md mx-auto">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-300">Create New User</h2>
        </div>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 bg-gray-900">
            <label htmlFor="role" className="block text-gray-300 mb-1">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className={`w-full p-3 border border-gray-300 ${formData.role === "Select a role" && "text-gray-500"} bg-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className="px-4 py-2 bg-gray-500 text-gray-200 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-gray-200 rounded hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};


export default CreateUserModal;
