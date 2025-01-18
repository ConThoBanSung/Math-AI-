import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Chat from './components/ChatGPT';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // Thêm state để lưu trữ userId
  const location = useLocation();

  // Tạo ref cho mỗi route
  const nodeRef = useRef(null);

  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname} // Sử dụng pathname để định danh route
        classNames="fade"
        timeout={300} // Thời gian hiệu ứng
        nodeRef={nodeRef} // Thêm nodeRef
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Chat userId={userId} />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />
                )
              }
            />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />}
            />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
