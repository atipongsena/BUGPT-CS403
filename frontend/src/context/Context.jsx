import React, { createContext, useState, useContext, useEffect } from "react";
import runChat from "../../../backend/config/gemini";
import { UserContext } from "./UserContext";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [chathistory, setChatHistory] = useState([]);
  const [currentSession, setCurrentSession] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (user && user.username) {
        const response = await fetch(`http://localhost:5000/api/chathistory/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data.chathistory || []);
        } else {
          console.error("Failed to load chat history");
        }
      }
    };

    loadChatHistory();
    newChat(); // Start a new chat session when the user logs in
  }, [user]);

  const saveChatHistory = async (updatedHistory) => {
    if (user && user.username) {
      const response = await fetch(`http://localhost:5000/api/chathistory/${user.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chathistory: updatedHistory }),
      });
      if (!response.ok) {
        console.error("Failed to save chat history");
      }
    }
  };

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    if (currentSession.length > 0) {
      const updatedHistory = [...chathistory, currentSession];
      setChatHistory(updatedHistory);
      saveChatHistory(updatedHistory);
    }
    setCurrentSession([]);
    setLoading(false);
    setShowResult(false);
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amPM = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${amPM}`;
  };

  const onSent = async (prompt) => {
    const userInput = prompt !== undefined ? prompt : input;
    if (!userInput) return;

    // Get current time
    const currentTime = new Date();
    const formattedTime = formatTime(currentTime);

    // Update the chat with the user's message
    setCurrentSession((prev) => [
      ...prev,
      { question: userInput, response: null, time: formattedTime },
    ]);
    setRecentPrompt(userInput);
    setInput("");

    setLoading(true);
    setShowResult(true);

    // Get the bot's response
    let response = await runChat(userInput);

    // Process response...
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");

    // Update the chat with the bot's response
    setCurrentSession((prev) =>
      prev.map((item, index) =>
        index === prev.length - 1
          ? { ...item, response: newResponse2 }
          : item
      )
    );

    setLoading(false);
  };

  const deleteChatHistory = async (index) => {
    const updatedHistory = chathistory.filter((_, i) => i !== index);
    setChatHistory(updatedHistory);
    await saveChatHistory(updatedHistory);
  };

  const contextValue = {
    chathistory,
    currentSession,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    setCurrentSession,
    deleteChatHistory,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
