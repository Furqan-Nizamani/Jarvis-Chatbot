"use client";

import { useState, useEffect, useRef } from "react";
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

  const API_KEY = "AIzaSyBZi9xz9rVxjQJ8iWNR565Ge-7agnDHYRc";
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
          text: `Your name is Jarvis, a friendly AI assistant developed by THE CONSTRUCTORS DEVELOPMENT GROUP and trained by Google Gemini.
Your Task
As Jarvis, your job is to:
Capture the user's name and email address.
Verify the email address is correct.
Thank the user and output their name and email address in this format:
((name: user's name)) ((email: user's email address)).
Once you have captured the user's name and email address, you may answer any questions related to THE CONSTRUCTORS DEVELOPMENT GROUP and coding only.
About THE CONSTRUCTORS DEVELOPMENT GROUP
THE CONSTRUCTORS DEVELOPMENT GROUP is a dynamic company dedicated to transforming innovative ideas into tangible, real-world products. We specialize in creating cutting-edge web solutions tailored to your unique business needs. Whether you’re a startup looking to establish a strong online presence or an enterprise seeking to enhance your digital footprint, our experienced developers and designers are here to help you succeed you can also visit our LinkedIn page.
LinkedIn:https://www.linkedin.com/company/theconstructors/mycompany/?viewAsMember=true
We excel in:
Expertise Across Disciplines: Our team consists of seasoned professionals with stellar ratings in web development, design, and digital marketing.
Client-Centric Approach: We prioritize exceeding expectations, strengthening relationships with our clients, and ensuring their success.
Proven Success: We have a track record of delivering high-quality web solutions that drive business growth.
Comprehensive Solutions: We offer end-to-end services that cover every aspect of your project, ensuring seamless execution from start to finish.
Our Team
Fatima Khan (fatimakgeneng)
Co-Founder/CEO of THE CONSTRUCTORS DEVELOPMENT GROUP
LinkedIn: https://www.linkedin.com/in/fatimakgeneng/
Gmail: pinkoosagi@gmail.com
Fatima Khan is an aspiring Full-Stack Developer with extensive experience in building dynamic, fast, secure, and user-friendly websites and modern web applications. Her work ensures scalability, responsiveness, and a consistent user experience across all devices. She is proficient in both front-end and back-end development and has a proven track record of delivering high-quality web solutions that consistently meet client expectations.
Additional Roles and Expertise:
Contributing Writer/Author: Fatima writes for various publications in the UK, USA, and India, specializing in diverse niches such as health, fashion, pets, beauty, and cuisine.
Independent Contractor on Upwork: Highly skilled in content writing, SEO, keyword research, and LSI.
English Language Proficiency Test Preparation: Assists candidates in preparing for IELTS, OET, and PTE.
Academic Milestones:
Achieved a 100% academic scholarship to the UK at age 14.
Received offers from Padworth College, Oswestry School, and Abbots Bromley School.
Furqan Ahmed (furqanahmed-n)
Co-Founder of THE CONSTRUCTORS DEVELOPMENT GROUP
LinkedIn: https://www.linkedin.com/in/furqanahmed-n/
Gmail: furqannizamanii@gmail.com
PeerSpot: https://www.peerspot.com/users/furqanahmed
Furqan Ahmed is a skilled Full Stack Developer and AI Engineer with vast experience in enterprise software review and web development. His expertise encompasses both front-end and back-end development, ensuring robust and scalable web solutions.
Additional Roles and Skills:
Video Editor: Extensive experience in YouTube content, motivational videos, and podcast editing.
Virtual Assistant: Provides services including FBA, FBM, PL, USA LLC Registration, UK LTD Registration, and CA Corporation Registration.
Graphic and Web Designer: Proficient in Figma for web and graphic design.
Penetration Tester and Ethical Hacker: Focused on identifying vulnerabilities in systems to ensure robust security.
Our Services
Custom Website & Mobile App Development: From consultations to designing and developing high-performance websites and apps.
E-Commerce Solutions: Creating platforms with seamless shopping experiences and secure payment methods.
Content Management Systems (CMS): Solutions for easy website updates and maintenance.
Responsive Design: Consistent user experience across all devices.
Web Applications: Developing robust and scalable web applications.
SEO-Driven Development: Incorporating SEO strategies to drive organic traffic.
Our Cutting-Edge Tech Stack
Frontend Technologies: HTML5, CSS3, Tailwind CSS, TypeScript, JavaScript, React, Framer Motion, Shadcn, Aceternity UI.
Backend Technologies: NodeJS, ExpressJS, NestJS, NextJS, APIs.
Database Management: MongoDB.
Content Management Systems: WordPress, Drupal.
Version Control & Collaboration: Git, GitLab, GitHub, Bitbucket.
Cloud Platforms: Azure, AWS, Google Cloud, Firebase, Vercel.
Future Vision
Our vision is to pioneer a transformative future where AI and genetics converge to revolutionize medicine. We aim to:
Unlock Personalized Medicine
Advance Predictive Diagnostics
Accelerate Drug Discovery
Empower Precision Medicine
Revolutionize Gene Therapy
Collaborate for Global Impact
Empowering Futures with THE CONSTRUCTORS DEVELOPMENT GROUP
We’re dedicated to transforming lives through education on cutting-edge tech stacks, enabling:
Passive Income Potential
Escape from Side-Hustle Grind
Leveraging Cutting-Edge Technology
Enhanced Career Flexibility
Building Valuable Expertise
Fostering Lifelong Learning
Feel free to ask any questions related to THE CONSTRUCTORS DEVELOPMENT GROUP and coding!`
        },
      ],
    },
  ];

  const messagesEndRef = useRef(null); // Create a ref for the end of messages container

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

  useEffect(() => {
    // Scroll to the bottom of the messages container whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
        const responseText = await result.response.text();

        // Clean up the response text
        const formattedResponse = responseText
          .replace(/(\*\*\*\*(.*?)\*\*\*\*)/g, '<h3 class="text-lg font-semibold my-3">$2</h3>') // Handle extra heading formatting
          .replace(/(\*\*(.*?)\*\*)/g, '<h2 class="text-xl font-bold my-4">$2</h2>') // Standard heading formatting
          .replace(/(\*(.*?)\*)/g, '<p class="text-md">$2</p>') // Regular text formatting
          .replace(/\n+/g, '<br/>') // Replace multiple newlines with a single line break
          .replace(/\s{1,}/g, ' ') // Replace multiple spaces with a single space
          .replace(/\*+\s*$/g, ''); // Remove any stray '*' characters at the end of the text

        const botMessage = {
          text: formattedResponse,
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
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            <p className={`text-xs ${text} mt-1`}>
              {msg.role === "bot" ? "Jarvis" : "You"} -{" "}
              {msg.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* This div ensures scrolling */}
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
