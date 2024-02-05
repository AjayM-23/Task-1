import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const LoginSignUp = () => {
  const [switchBetween, setSwitchBetween] = useState("login");
  const [signUpData, setSignUpData] = useState([]);
  const [formData, setFormData] = useState("welcome");
  const navigate = useNavigate();

  const handleSwitch = (val) => {
    setSwitchBetween(val);
  };

  const getData = async () => {
    try {
      // const loginResponse = await axios.get("http://localhost:3000/loginData");
      // setLoginData(loginResponse.data);

      const signUpResponse = await axios.get(
        "http://localhost:3000/signUpData"
      );
      setSignUpData(signUpResponse.data);
      console.log(signUpData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async (values) => {
    try {
      axios
        .post(
          `http://localhost:3000/${
            switchBetween === "login" ? "loginData" : "signUpData"
          }`,
          values
        )
        .then(() => {
          getData();
        })
        .catch((error) => {
          console.error("Error posting data:", error);
        })
        .then(handleSwitch("login"));
      //  Check if login data matches signup data
      // console.log(values);

      const match = await signUpData.some(
        (user) =>
          user.username === values.logUsername &&
          user.password === values.logPassword
      )

      if (match) {
        console.log("Login successful, proceed to the next page");
        navigate("/main", { state: { signUpData, values } });
        // You can add logic to navigate to the next page or take desired actions here
      } else {
        console.log("Invalid login credentials");
        // You can add logic to display an error message or take other actions here
        return; // Stop further execution if login credentials are invalid
      }
    } catch (error) {
      console.error("Error posting/fetching data:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    // <data.Provider value={{ loginData, signUpData }}>
    <div className="w-[100%] h-[100vh] flex justify-center items-center">
      {switchBetween === "login" ? (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className=" w-[30%] h-[45%] border-[1px] flex flex-col justify-center items-center border-white p-4 pt-6 rounded-[5px] bg-[#00000066]"
        >
          <h1 className="text-[26px] font-bold mb-4">Login</h1>
          <Form.Item
            name="logUsername"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="enter username"
              suffix={<UserOutlined />}
              className="w-[350px]"
            />
          </Form.Item>
          <Form.Item
            name="logPassword"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="enter password"
              className="w-[350px]"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" className="bg-[blue]">
              Submit
            </Button>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 30,
            }}
          >
            Don't have an account?
            <span
              className="text-[blue] pl-2 underline cursor-pointer"
              onClick={() => handleSwitch("SignUp")}
            >
              SignUp
            </span>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className=" w-[30%] h-auto border-[1px] flex flex-wrap flex-col justify-center items-center  border-white p-4 pt-6 rounded-[5px] bg-[#00000066]"
        >
          <h1 className="text-[26px] font-bold mb-4">Sign Up</h1>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="enter name"
              className="w-[350px] "
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="enter email"
              className="w-[350px]"
            />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="enter username"
              suffix={<UserOutlined />}
              className="w-[350px]"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="enter password"
              className="w-[350px]"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve(); // Passwords match, resolve the promise
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  ); // Passwords do not match, reject the promise with an error message
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Confirm your password"
              className="w-[350px]"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 30,
            }}
          >
            <Button type="primary" htmlType="submit" className="bg-[blue]">
              Submit
            </Button>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 30,
            }}
          >
            Already have an account?
            <span
              className="text-[blue] pl-2 underline cursor-pointer"
              onClick={() => handleSwitch("login")}
            >
              LogIn
            </span>
          </Form.Item>
        </Form>
      )}
    </div>
    // </data.Provider>
  );
};

export default LoginSignUp;
