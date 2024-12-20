import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import './Login.css';

const Login = ({ setIsAuthenticated, setUserId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("authToken", token);
      console.log(token);
      setIsAuthenticated(true);
      setUserId(userCredential.user.uid);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <section className="container">
      <div className="login-container">
        <div className="circle circle-one"></div>
        <div className="form-container">
          <h1 className="opacity">LOGIN</h1>
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
            <button type="button" className="opacity" onClick={handleLogin}>
              SUBMIT
            </button>
          </form>
          <div className="register-forget opacity">
            <a onClick={() => navigate('/signup')}>REGISTER</a>
          </div>
        </div>
        <div className="circle circle-two"></div>
      </div>
      <div className="theme-btn-container"></div>
    </section>
  );
};

export default Login;
