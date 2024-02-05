import React, { useEffect, useState } from "react";
import Content from "../Content/content";
import Header from "../Header/header";
import Sidebar from "../Sidebar/sidebar";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MainContent = () => {
  const location = useLocation();
  const { signUpData, values } = location.state || {};
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    if (signUpData && values) {
      const matchingUser = signUpData.find(
        (user) =>
          user.username === values.logUsername &&
          user.password === values.logPassword
      );

      if (matchingUser) {
        setMatchedUser(matchingUser);
        console.log("Matched user details:", matchingUser);
      } else {
        console.log("No matching user found");
      }
    }
  }, [signUpData, values]);

  return (
    <div className="w-[100%] h-full ">
      <Header matchedUser = {matchedUser}/>
      <div className="w-full h-[85vh] flex ">
        <Sidebar />
        <Content matchedUser = {matchedUser}/>
      </div>
    </div>
  );
};

export default MainContent;
