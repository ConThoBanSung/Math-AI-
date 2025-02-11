import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

const ChatGPT = () => {
  const [chats, setChats] = useState([{ id: 1, title: "Chat 1", messages: [] }]);
  const [activeChat, setActiveChat] = useState(0);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState({ username: "User", avatar: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.post(
          "https://0d8a-14-241-224-21.ngrok-free.app/auth/verifyToken",
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserId(res.data.userId);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchUserId();
  }, [navigate]);

  const saveChat = async () => {
    try {
      const chat = chats[activeChat];
      const filteredMessages = chat.messages.filter(msg => msg.sender === "user").map(msg => ({
        sender: msg.sender,
        content: msg.text
      }));

      if (!userId) return;

      const chatId = `chat${chat.id}`;
      const payload = { userId, chatId, messages: filteredMessages };

      await axios.post(
        "http://localhost:8080/auth/saveChat",
        payload,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await axios.post(
        "https://0d8a-14-241-224-21.ngrok-free.app/auth/updateProfile",
        {
          userId,
          username: profile.username,
          avatar: profile.avatar,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const updatedAvatar = response.data.avatar;
      setProfile({ ...profile, avatar: updatedAvatar });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "" || isSending) return;

    setIsSending(true);
    const userMessage = { sender: "user", text: input, animation: "message-enter" };
    const updatedChats = [...chats];
    updatedChats[activeChat].messages.push(userMessage);
    setChats(updatedChats);

    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/generate",
        { prompt: input },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setIsTyping(false);
      const botMessage = { sender: "bot", text: res.data.response, animation: "message-enter" };
      updatedChats[activeChat].messages.push(botMessage);
      setChats(updatedChats);

      await saveChat();
    } catch (error) {
      setIsTyping(false);
      const errorMessage = { sender: "bot", text: "Oops! Something went wrong.", animation: "message-enter" };
      updatedChats[activeChat].messages.push(errorMessage);
      setChats(updatedChats);
    }

    setIsSending(false);
  };

  const createNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };

    setChats((prev) => [...prev, newChat]);
    setActiveChat(chats.length);
    setInput("");
    setIsTyping(false);
  };

  const editProfile = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-sidebar">
        <button className="new-chat-btn" onClick={createNewChat}>
          + New Chat
        </button>
        <ul>
          {chats.map((chat, index) => (
            <li
              key={chat.id}
              className={index === activeChat ? "active-chat" : ""}
              onClick={() => setActiveChat(index)}
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <h2>{chats[activeChat]?.title || "ChatGPT"}</h2>
          <button className="profile-btn" onClick={editProfile}>
            <img
              src={profile.avatar || "https://via.placeholder.com/40"}
              alt="Profile"
              className="avatar"
            />
          </button>
        </div>
        <div className="chat-body">
          {chats[activeChat]?.messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender} ${msg.animation || ""}`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      {isEditingProfile && (
        <div className="profile-modal">
          <h3>Edit Profile</h3>
          <input
            type="text"
            placeholder="Username"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
          <button onClick={updateProfile}>Save</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ChatGPT;
