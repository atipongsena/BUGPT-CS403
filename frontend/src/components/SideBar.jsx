import React, { useContext, useState } from "react";
import aiLogo from "../assets/aiLogo.png";
import { Link } from "react-router-dom";
import { CiCirclePlus, CiSettings, CiTrash } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { Context } from "../context/Context";
import { UserContext } from "../context/UserContext"; 
import Modal from 'react-modal';  // Import Modal from react-modal

const Sidebar = () => {
  const { newChat, chathistory, setCurrentSession, setShowResult, deleteChatHistory } = useContext(Context);
  const { user, setUser } = useContext(UserContext); // Get user from context

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    password: '',
    confirmPassword: '', // Add confirm password field
  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/updateUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser); // Update user in context
        closeModal();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const loadPrompt = async (session) => {
    setCurrentSession(session);
    setShowResult(true);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amPM = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hours}:${minutes} ${amPM}`;
  };

  return (
    <div className="md:w-[336px] w-[200px] shadow-2xl overflow-y-auto shadow-[#BAD5FF] border-r-1 border-white-300/25 flex flex-col justify-between">
      <div className="p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <img className="h-12 rounded-full" src={aiLogo} alt="" />
          <button onClick={() => newChat()} className="flex items-center bg-blue-200 pl-2 pr-3 py-1 ml-2 md:pl-3 md:pr-4 md:py-2 rounded-full hover:shadow-lg hover:shadow-cyan-900">
            <CiCirclePlus className="w-6 h-6" />
            <span className="md:ml-2 ml-1 ">New Chat</span>
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Chat History</h3>
          {chathistory.map((session, index) => {
            const firstQuestion = session[0]?.question || "No Question";
            const sessionTime = session[0]?.time || "No Time";
            return (
              <div className="space-y-4 mt-5" key={index}>
                <div
                  onClick={() => loadPrompt(session)}
                  className="flex items-center bg-gray-100 rounded-full py-3 pl-4 pr-8 cursor-pointer hover:bg-blue-200 hover:bg-opacity-50"
                >
                  <div className="flex-grow">{firstQuestion.slice(0, 24)} ...</div>
                  <div className="text-xs text-gray-500">{sessionTime}</div>
                  <button onClick={() => deleteChatHistory(index)} className="ml-2">
                    <CiTrash className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center cursor-pointer" onClick={openModal}> {/* Add cursor-pointer class */}
            <CiSettings className="w-6 h-6" />
            <span className="ml-2 text-gray-700">Settings</span>
          </div>
          <div className="flex items-center">
            <IoIosLogOut className="w-6 h-6" />
            <Link to="/">
              <span className="ml-2 text-gray-700">Log out</span>
            </Link>
          </div>
          {user && user.username ? (
            <div className="flex items-center">
              <button className="rounded-full py-[9px] px-[15px] bg-cyan-700 text-white">
                {user.username.charAt(0).toUpperCase()}
              </button>
              <span className="ml-2 text-gray-700">{user.username}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <button className="rounded-full py-[9px] px-[15px] bg-cyan-700 text-white">U</button>
              <span className="ml-2 text-gray-700">User</span>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-8 w-[400px] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={closeModal} className="py-2 px-4 bg-gray-500 text-white rounded-md">Cancel</button>
              <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">Save</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
