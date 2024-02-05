import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const { matchedUser } = props;
  const [profile, setProfile] = useState(false);

  useEffect(() => {
    console.log(matchedUser);
  }, [matchedUser]);

  const [modal2Open, setModal2Open] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-[100%] h-[15vh] bg-[#6D213C] flex items-center justify-between px-10">
      <div className="text-[24px] text-white capitalize">
        {matchedUser ? matchedUser.name : " "}
      </div>
      <div
        className="w-[60px] h-[60px] bg-white rounded-[30px] relative cursor-pointer"
        onClick={() => setModal2Open(true)}
      ></div>
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
          className="text-[16px] mb-2 cursor-pointer transition-all duration-700 ease-in-out"
          onClick={() => setProfile(!profile)}
        >
          <UserOutlined className="pr-2" />
          Profile
        </div>
        <div
          className={`text-[16px] transition-all duration-700 ease-in-out ${
            profile ? "max-h-full opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <h1 className="border-b-[2px] pb-2 border-[#FAF3E0]">
            {matchedUser ? matchedUser.username : ""}
          </h1>
          <h1 className="border-b-[2px] pb-2 border-[#FAF3E0]">
            {matchedUser ? matchedUser.name : ""}
          </h1>
          <h1 className="border-b-[2px] pb-2 border-[#FAF3E0]">
            {matchedUser ? matchedUser.email : ""}
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
