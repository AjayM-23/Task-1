import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const { matchedUser } = props;
  const [profile, setProfile] = useState(false);
  const [letter, setLetter] = useState("Z");
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "LoggedOut successfully",
    });
  };

  useEffect(() => {
    console.log(matchedUser);
    if (matchedUser) {
      setLetter(matchedUser.name.charAt(0).toUpperCase());
      console.log("First letter of the name:", letter);
    }
  }, [matchedUser]);

  const [modal2Open, setModal2Open] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-[100%] h-[15vh] bg-[#6D213C] flex items-center justify-between px-10">
      {contextHolder}
      <div className="text-[30px] font-semibold text-white capitalize">
        {matchedUser ? matchedUser.name : " "}
      </div>
      <div
        className="w-[60px] h-[60px] bg-[#512DA8] text-[30px] font-semibold text-white flex justify-center items-center rounded-[30px] relative cursor-pointer"
        onClick={() => setModal2Open(true)}
      >
        {letter}
      </div>
      <Modal
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        width={210}
        mask={false}
        footer={null}
        closeIcon={null}
        style={{
          position: "fixed",
          top: "100px",
          right: "20px",
        }}
      >
        <div
          className="w-auto text-[16px] mb-2 cursor-pointer transition-all duration-700 ease-in-out"
          onClick={() => setProfile(!profile)}
        >
          <UserOutlined className="pr-2" />
          Profile
        </div>
        <div
          className={`w-[100%] text-[16px] transition-all duration-700 ease-in-out ${
            profile ? "max-h-full opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <h1 className="border-y-[2px] pb-2 border-[#FAF3E0] capitalize">
            Name:{" "}
            <span className="font-bold">
              {matchedUser ? matchedUser.name : ""}
            </span>
          </h1>
          <h1 className="border-b-[2px] pb-2 border-[#FAF3E0]">
            Username:{" "}
            <span className="font-bold">
              {matchedUser ? matchedUser.username : ""}
            </span>
          </h1>
          <h1 className="border-b-[2px] pb-2 border-[#FAF3E0]">
            email:{" "}
            <span className="font-bold">
              {matchedUser ? matchedUser.email : ""}
            </span>
          </h1>
        </div>
        <div
          className="text-[16px] mt-2 mb-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <LogoutOutlined className="pr-2" />
          LogOut
        </div>
      </Modal>
    </div>
  );
};

export default Header;
