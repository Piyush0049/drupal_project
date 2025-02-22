import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// Custom Modal component built from scratch using Tailwind CSS.
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex text-gray-200 items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Overlay background */}
      <div className="absolute bg-black opacity-60 inset-0" />
      <div
        className="bg-gray-900 rounded-lg w-11/12 z-[1000] max-w-md p-5 relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 bg-transparent text-2xl text-gray-200 hover:text-gray-700"
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

  // Handle input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addRowToUserTable = async (formData) => {
    try {
      const baseUrl = 'http://localhost';
      const getUrl = `${baseUrl}/jsonapi/node/mydata`;
      const getResponse = await axios.get(getUrl, {
        headers: { 'Content-Type': 'application/vnd.api+json' }
      });
      
      const node = getResponse.data.data[0];
      const nodeId = node.id;
      let existingTable = node.attributes.field_mydata?.value || {};
      
      // Generate a new key using a valid UUID if possible.
      const newKey = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    
      console.log(formData, "soko")
      // Append the new row to the existing table.
      existingTable[newKey] = {
        "0": newKey,              // uid: a unique identifier
        "1": formData.name,        // name
        "2": formData.email,       // email
        "3": formData.role,        // role
        "weight": 0                // weight: adjust as needed
      };
      
      // Prepare the PATCH payload.
      const payload = {
        data: {
          type: 'node--mydata',  // Ensure this matches your content type machine name.
          id: nodeId,
          attributes: {
            field_mydata: {
              value: existingTable
            }
          }
        }
      };
      
      // Send the PATCH request using the correct node UUID.
      const patchUrl = `${baseUrl}/jsonapi/node/mydata/${nodeId}`;
      const patchResponse = await axios.patch(patchUrl, payload, {
        headers: { 'Content-Type': 'application/vnd.api+json' }
      });
      
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
      // Replace '4' with the actual node ID you want to update.
      const nodeId = '4';
      const newUserData = await addRowToUserTable(formData);
      onUserCreated(newUserData);
      onClose();
    } catch (err) {
      console.error('Error creating user:', err.response || err);
      setError('There was an error creating the user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold">Create New User</h2>
      </div>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-semibold">
            Username:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block mb-1 font-semibold">
            Role:
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-100 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;
