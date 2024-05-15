import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import ChatPage from "./ChatPage";
import { UserContext } from "../context/UserContext"; // Import UserContext

function MainPage() {
  const { user } = useContext(UserContext);
  
  console.log('User:', user); // Add this line to log the user object

  if (!user) {
    return <div>Loading...</div>; // or redirect to login if user is not available
  }

  return (
    <div className="bg-gradient-to-r from-[#BAD5FF]/50 to-[#92e0f7]/50 h-screen">
      <div className="grid grid-cols-[1fr,3fr] w-full h-full">
        <SideBar />
        <div className="flex w-full h-full">
          <ChatPage />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
