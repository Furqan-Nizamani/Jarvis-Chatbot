"use client";

import { useState, useEffect } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export default function Jarvis() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState(null);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState(null);

  const API_KEY = "AIzaSyCIkKjH2wVRh--0gBUI25_N3zw_wSQJ7cA";
  const MODEL_NAME = "gemini-1.5-flash";

  const genAI = new GoogleGenerativeAI(API_KEY);

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const history = [
    {
      role: "user",
      parts: [
        {
          text: `You are Jarvis, a friendly AI assistant developed by THE CONSTRUCTORS DEVELOPMENT GROUP and trained by Google Gemini.

About THE CONSTRUCTORS DEVELOPMENT GROUP
Transforming Ideas into Real-World Products

THE CONSTRUCTORS DEVELOPMENT GROUP is a dynamic company that helps clients transform their innovative ideas into tangible, real-world products. We specialize in:

Our Services
Coding
We provide comprehensive coding services to create custom websites, mobile applications, and software solutions tailored to your specific needs.

Web & Mobile App Development
Our team of skilled developers builds user-friendly and high-performing websites and mobile applications that meet your business objectives.

Coding Education
We are passionate about empowering individuals with coding skills. We offer various educational programs and resources to help you learn to code and earn money online.

Our Team
Our team is led by:

Fatima Khan (fatimakgeneng): is the CEO of THE CONSTRUCTORS DEVELOPMENT GROUP and also Full Stack Developer and AI engineer. Fatima's LinkedIn: \n "https://www.linkedin.com/in/fatimakgeneng/" \n , Gmail: "pinkoosagi@gmail.com"

Commitment
We are committed to delivering exceptional results, transparent communication, and unwavering support throughout your project journey.

LinkedIn Page
You can find our LinkedIn page here .

Your Task
As Jarvis, your job is to:

Capture the user's name and email address.
Verify the email address is correct.
Thank the user and output their name and email address in this format: ((name: user's name)) ((email: user's email address)).
Once you have captured the user's name and email address, you may answer any questions related to THE CONSTRUCTORS DEVELOPMENT GROUP and coding only.`
        },
      ],
    },
  ];

  useEffect(() => {
    const initChat = async () => {
      try {
        const newChat = await genAI
          .getGenerativeModel({ model: MODEL_NAME })
          .startChat({
            generationConfig,
            safetySettings,
            history,
          });
        setChat(newChat);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setError("Failed to initialize chat, please try again.");
      }
    };
    initChat();
  }, []);

  const handleSendMessage = async () => {
    try {
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");
      if (chat) {
        const result = await chat.sendMessage(userInput);
        const botMessage = {
          text: await result.response.text(),
          role: "bot",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message, please try again.");
    }
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
          border: "border-gray-300",
        };
      case "dark":
        return {
          primary: "bg-gray-900",
          secondary: "bg-gray-800",
          accent: "bg-yellow-500",
          text: "text-gray-100",
          border: "border-gray-700",
        };
      default:
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
          border: "border-gray-300",
        };
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const { primary, secondary, accent, text, border } = getThemeColors();

  return (
    <div className={`flex flex-col h-screen p-4 ${primary} font-sans`}>
      <header className={`flex justify-between items-center mb-4 p-4 ${border} rounded-lg shadow-md`}>
        <h1 className={`text-2xl sm:text-3xl font-bold ${text}`}>
          Jarvis{" "}
          <span className="text-blue-500 font-bold font-serif">AI</span>
        </h1>
        <button
          onClick={handleThemeToggle}
          className={`p-2 md:p-3 rounded-md ${accent} text-white shadow-md hover:bg-opacity-80 transition-all duration-300`}
        >
          Toggle Theme
        </button>
      </header>
      <main className={`flex-1 overflow-y-auto ${secondary} rounded-lg p-4 space-y-4`}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-2 sm:p-3 rounded-lg max-w-full sm:max-w-md ${msg.role === "user" ? `${accent} text-white` : `${primary} ${text}`}`}
            >
              {msg.text}
            </div>
            <p className={`text-xs ${text} mt-1`}>
              {msg.role === "bot" ? "Jarvis" : "You"} -{" "}
              {msg.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ))}
      </main>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <footer className="flex items-center mt-4 p-2 border-t border-gray-300">
        <input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeypress}
          className={`flex-1 p-2 sm:p-3 rounded-md border ${border} ${text} placeholder-gray-500 focus:outline-none focus:border-${accent} transition-all duration-300`}
        />
        <button
          onClick={handleSendMessage}
          className={`p-2 sm:p-3 ${accent} text-white rounded-r-md hover:bg-opacity-80 focus:outline-none transition-all duration-300`}
        >
          Send
        </button>
      </footer>
    </div>
  );
}
