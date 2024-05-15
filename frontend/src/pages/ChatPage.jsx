import React, { useContext } from "react";
import aiLogo from "../assets/aiLogo.png";
import { IoSend } from "react-icons/io5";
import { Context } from "../context/Context";
import { UserContext } from "../context/UserContext";

function ChatPage() {
  const {
    onSent,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    currentSession,
  } = useContext(Context);

  const { user } = useContext(UserContext);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSent();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-grow overflow-y-auto p-4">
        {currentSession.map((prompt, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-start">
              <button className="rounded-full py-[9px] px-[15px] md:mr-4 bg-cyan-700 text-white">
                {user && user.username ? user.username.charAt(0).toUpperCase() : "B"}
              </button>
              <div className="flex flex-col bg-gray-200 rounded-lg p-3 shadow-sm">
                <span className="text-gray-700">{prompt.question}</span>
                <span className="text-gray-500 text-sm mt-1">{prompt.time}</span>
              </div>
            </div>
            {prompt.response ? (
              <div className="flex items-start justify-end mb-4">
                <div
                  className="rounded-lg p-3 text-white shadow-sm"
                  style={{ backgroundColor: "#2980b9" }}
                >
                  <span dangerouslySetInnerHTML={{ __html: prompt.response }}></span>
                </div>
                <img className="h-12 rounded-full md:ml-4" src={aiLogo} alt="" />
              </div>
            ) : (
              <div className="flex items-start justify-end mb-4">
                <div
                  className="rounded-lg p-3 text-white shadow-sm"
                  style={{ backgroundColor: "#2980b9" }}
                >
                  <img
                    src="https://cdn.dribbble.com/users/1186261/screenshots/3718681/media/1df2396f1eaa146bcb7dd3e73c1dc77b.gif"
                    alt="Loading..."
                    className="w-6 h-6 bg-transparent animate-spin mx-auto rounded-full"
                  />
                </div>
                <img className="h-12 rounded-full md:ml-4" src={aiLogo} alt="" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center px-4 py-6 border-t border-gray-300">
        <input
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          value={input}
          type="text"
          className="w-full rounded-full pl-10 md:pl-4 md:px-2 md:py-4 focus:outline-none focus:border-cyan-700"
          placeholder="Type your message..."
          style={{ paddingLeft: "28px" }}
        />
        <button
          onClick={() => onSent()}
          className="ml-2 rounded-full py-2 px-2 bg-cyan-700 text-white"
        >
          <IoSend className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
