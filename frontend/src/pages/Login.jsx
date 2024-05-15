import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import aiLogo from "../assets/aiLogo.png";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginIdentifier,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ username: data.username });
        navigate('/mainpage');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed: Invalid username/student ID or password");
        console.error("Login failed:", errorData.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Network or server error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#BAD5FF]/50 to-[#92e0f7]/50 h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <img className="h-16 mb-4 rounded-full" src={aiLogo} alt="AI Logo" />
        <h2 className="text-2xl font-semibold mb-4">Log In</h2>
        <input
          type="text"
          placeholder="Username or Student ID"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
          value={loginIdentifier}
          onChange={(e) => setLoginIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-gray-700">Remember me</label>
          </div>
          <Link to="/signup" className="text-blue-500 ml-3 text-[0.75rem] hover:underline">
            Forgot Password?
          </Link>
        </div>
        <button
          onClick={handleLoginSubmit}
          className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Logging In..." : "Log In"}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
