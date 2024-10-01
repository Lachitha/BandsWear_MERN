import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Components/UserNavigation';
import Footer from './Components/Footer';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [updatedData, setUpdatedData] = useState({
    username: '',
    email: '',
    password: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/showUserById/${userId}`)
      .then(response => {
        setUserData(response.data);
        setUpdatedData({
          username: response.data.username,
          email: response.data.email,
          password: response.data.password,
          contactNumber: response.data.contactNumber,
          address: response.data.address
        });
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        setErrorMessage('Error fetching user details.');
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handlePasswordCheck = (e) => {
    setPasswordCheck(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (passwordCheck !== userData.password) {
      setErrorMessage('Previous password does not match.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/updateUser/${userId}`, updatedData);
      if (response.status === 200) {
        setSuccessMessage('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Error updating user.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:3001/deleteUser/${userId}`);
      if (response.status === 200) {
        alert('User deleted successfully');
        navigate('/userList');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Error deleting user.');
    }
  };

  return (
    <div>
      <Navigation />
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">User Profile</h1>

        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block mb-2 text-lg">Username:</label>
            <input
              type="text"
              name="username"
              value={updatedData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Email:</label>
            <input
              type="email"
              name="email"
              value={updatedData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Previous Password:</label>
            <input
              type="password"
              placeholder="Enter previous password"
              value={passwordCheck}
              onChange={handlePasswordCheck}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">New Password:</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={updatedData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-lg">Address:</label>
            <input
              type="text"
              name="address"
              value={updatedData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Update User
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Delete User
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;
