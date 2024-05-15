import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import aiLogo from "../assets/aiLogo.png";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.username = username ? "" : "Username is required.";
    tempErrors.fullName = fullName ? "" : "Full Name is required.";
    tempErrors.studentId = studentId ? "" : "Student ID is required.";
    tempErrors.email = email ? (/^\S+@\S+\.\S+$/.test(email) ? "" : "Email is not valid.") : "Email is required.";
    tempErrors.password = password ? "" : "Password is required.";
    tempErrors.confirmPassword = confirmPassword === password ? "" : "Passwords do not match.";
    setErrors(tempErrors);

    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSignupSubmit = async () => {
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          fullName,
          studentId,
          email,
          password,
        }),
      });

      setIsLoading(false);
      const text = await response.text();
      console.log("Response text:", text);

      if (response.ok) {
        const responseData = JSON.parse(text);
        alert('Signup successful');
        console.log('Signup response data:', responseData);
        navigate("/login");
      } else {
        const errorData = JSON.parse(text);
        alert('Signup failed: ' + errorData.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Network or server error:", error);
      alert('Network or server error: ' + error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#BAD5FF]/50 to-[#92e0f7]/50 h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <img className="h-16 mb-4 rounded-full" src={aiLogo} alt="AI Logo" />
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        {/* Input fields with validation and error messages */}
        <input
          type="text"
          placeholder="Username"
          className={`w-full border ${errors.username ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 mb-1`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="text-red-500 text-xs mb-3">{errors.username}</p>}
        {/* Similar blocks for fullName, studentId, email, password, and confirmPassword with respective error messages */}
        <input
          type="text"
          placeholder="Full Name"
          className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 mb-1`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {errors.fullName && <p className="text-red-500 text-xs mb-3">{errors.fullName}</p>}
        <input
          type="text"
          placeholder="Student ID"
          className={`w-full border ${errors.studentId ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 mb-1`}
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        {errors.studentId && <p className="text-red-500 text-xs mb-3">{errors.studentId}</p>}

        <input
          type="email"
          placeholder="Email"
          className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 mb-1`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-xs mb-3">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 mb-1`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-xs mb-3">{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          className={`w-full border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md px-4 py-2 mb-1`}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mb-3">{errors.confirmPassword}</p>}

        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <label className="text-gray-700">
            ฉันรับทราบและยอมรับข้อตกลง
          </label>
        </div>

        <button
          onClick={handleSignupSubmit}
          disabled={isLoading}
          className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${isLoading ? "opacity-50" : ""}`}
        >
          {isLoading ? 'Signing Up...' : 'สมัครสมาชิก'}
        </button>
      </div>
    </div>
  );
}

export default Signup;
