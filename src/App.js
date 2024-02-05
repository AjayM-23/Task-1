import { useState } from "react";
import "./App.css";
import LoginSignUp from "./components/LoginSignup/LoginAndSignUp";
import MainContent from "./components/MainPage/mainpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="w-[100%] h-[100vh]">
        <Routes>
          <Route path="/" element={<LoginSignUp />}></Route>
          <Route path="/main" element={<MainContent />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
