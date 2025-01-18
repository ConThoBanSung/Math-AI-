import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css'; // Sử dụng chung CSS đã được thiết kế

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const signupData = { email, password };
      const res = await axios.post(
        "http://localhost:8080/auth/signup",
        signupData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      console.log("Signup successful:", res.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <section className="container">
      <div className="login-container">
        <div className="circle circle-one"></div>
        <div className="form-container">
          <h1 className="opacity">SIGNUP</h1>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="opacity" onClick={handleSignup}>
              SUBMIT
            </button>
          </form>
          <div className="register-forget opacity">
            <a onClick={() => navigate('/login')}>GO TO LOGIN</a>
          </div>
        </div>
        <div className="circle circle-two"></div>
      </div>
      <div className="theme-btn-container"></div>
    </section>
  );
};

export default Signup;
