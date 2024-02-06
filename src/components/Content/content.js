import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import "./content.css";
import { Empty } from "antd";

const Content = (props) => {
  const { matchedUser } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [remainingAmount, setRemainingAmount] = useState();
  const [totalSalary, setTotalSalary] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddItem = async () => {
    if (itemName && itemPrice) {
      const newExpense = {
        itemName,
        cost: parseFloat(itemPrice),
        timestamp: new Date().toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      try {
        // Fetch user data from the server based on the matchedUser id
        const response = await axios.get(
          `http://localhost:3000/signUpData/${matchedUser.id}`
        );
        const userData = response.data;
        console.log(userData);
        console.log(totalSalary);

        // Check if user has expenses
        const userExpenses = userData.expenses || {};
        console.log(userExpenses);

        // Get the next index
        const nextIndex = Object.keys(userExpenses).length || 0;
        console.log(nextIndex);

        // Update the existing user's expenses object
        const updatedExpenses = {
          ...userExpenses,
          [`explist${nextIndex + 1}`]: newExpense,
        };
        const totalExpenses = Object.values(updatedExpenses).reduce(
          (total, expense) => total + (expense.cost || 0),
          0
        );

        const remainingSalary = Math.max(
          0,
          userData.totalSalary - parseFloat(totalExpenses)
        );

        // Update the user's data with the new expenses
        const updatedUser = {
          ...userData,
          expenses: updatedExpenses,
          remainingSalary: remainingSalary,
        };

        // Post the updated data to the server
        await axios.put(
          `http://localhost:3000/signUpData/${matchedUser.id}`,
          updatedUser
        );

        // Refresh data
        getData();

        // Clear input fields
        setItemName("");
        setItemPrice("");
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  const submitTotalSalaryAndExpenses = async () => {
    if (totalSalary && matchedUser && matchedUser.id) {
      try {
        // Fetch the current user data
        const response = await axios.get(
          `http://localhost:3000/signUpData/${matchedUser.id}`
        );
        const userData = response.data;

        // Update the user's total salary
        userData.totalSalary = totalSalary;

        userData.timestamp = new Date().toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        // Send the updated data to the server
        const updateResponse = await axios.put(
          `http://localhost:3000/signUpData/${matchedUser.id}`,
          userData
        );

        // Check if the update was successful
        if (updateResponse && updateResponse.data) {
          console.log(
            "Total Salary updated successfully:",
            updateResponse.data
          );

          // Fetch updated data after successful update
          getData();
        } else {
          console.error("Total Salary update response is undefined");
        }
      } catch (error) {
        // Handle error if needed
        console.error("Error updating Total Salary:", error);
      }
    }
  };

  const getData = () => {
    axios
      .get("http://localhost:3000/signUpData")
      .then((response) => {
        const currentMonth = new Date().getMonth(); // Get the current month
        const newData = response.data.map((item) => {
          // Check if the data timestamp's month is different from the current month
          if (new Date(item.timestamp).getMonth() !== currentMonth) {
            // If the month is different, move the item to the "Previous Months History" div
            return { ...item, isPreviousMonth: true };
          } else {
            return item;
          }
        });
        setApiData(newData);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  return (
    <div className="w-[100%] h-[85vh] bg-[#2C3E50]">
      <div className="w-full h-auto flex justify-end p-4 pr-8">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          className="bg-[#512DA8]"
        >
          Add
        </Button>
        <Modal
          title="Enter Your Expenses here"
          mask={false}
          footer={false}
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <h2 className="text-[18px] py-2">Price List</h2>
            <form className="flex flex-col">
              <label htmlFor="itemName" className="text-[18px] pr-2">
                Total Salary:
              </label>
              <input
                type="tel"
                id="totalSalary"
                value={totalSalary}
                onChange={(e) => setTotalSalary(e.target.value)}
                className="border-2 border-[#FBEAE9] mr-2 rounded-md py-[2px] outline-none"
              />
              <button
                type="button"
                className="w-[30%] bg-[#512DA8] text-white p-1 mt-4 rounded-[5px] px-2 mb-2"
                onClick={() => submitTotalSalaryAndExpenses()}
              >
                Submit Total Salary
              </button>
              <label htmlFor="itemName" className="text-[18px] pr-2">
                Item:
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="border-2 border-[#FBEAE9] mr-2 rounded-md py-[2px] outline-none"
              />

              <label htmlFor="itemPrice" className="text-[18px]  pr-2 ">
                Price:
              </label>
              <input
                type="text"
                id="itemPrice"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="border-2 border-[#FBEAE9] mr-2 rounded-md py-[2px] outline-none"
              />
              <button
                type="button"
                className="w-[20%] bg-[#512DA8] text-white p-1 mt-4 rounded-[5px] px-2"
                onClick={() => handleAddItem()}
              >
                Add Item
              </button>
            </form>
          </div>
        </Modal>
      </div>
      <div className="w-[100%] h-auto flex justify-center items-center gap-4 overflow-y-scroll">
        <div className="w-[40%] h-[60vh] bg-white rounded-lg overflow-y-scroll">
          <h1 className="text-[22px] p-2 font-semibold underline text-center">
            Previous Months History
          </h1>
          <div className="w-full text-[20px] flex justify-center p-1">
            <ul className="text-black w-full ">
              {(apiData ?? []).map((item, id) => (
                <span key={id}>
                  {item.isPreviousMonth && (
                    <div className="w-[100%] flex">
                      <div
                        className={`w-[60%] text-right p-2 font-semibold text-[22px] border-y-[1px] border-l-[1px] border-black ${
                          matchedUser.id === item.id && item.totalSalary
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        {matchedUser.id === item.id && item.totalSalary
                          ? `Total salary : $${item.totalSalary},`
                          : " "}
                      </div>
                      <div
                        className={`w-[40%] flex items-center text-left p-2 text-[14px] border-y-[1px] border-r-[1px] border-black ${
                          matchedUser.id === item.id && item.timestamp
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        {matchedUser.id === item.id && item.timestamp
                          ? formatDate(item.timestamp)
                          : " "}
                      </div>
                    </div>
                  )}
                  {item.id === matchedUser.id &&
                    item.isPreviousMonth &&
                    item.expenses &&
                    Object.keys(item.expenses).map(
                      (expenseKey, expenseIndex) => (
                        <div
                          className="w-full flex  justify-between border-b-[1px] border-black"
                          key={expenseIndex}
                        >
                          <div className="w-[50%] text-center p-2 border-x-[1px] border-black">
                            {item.expenses[expenseKey]?.itemName || ""}
                          </div>
                          <div className="w-[50%] text-center p-2 border-r-[1px] border-black">
                            ${item.expenses[expenseKey]?.cost || " "}
                          </div>
                          <div className="w-[50%] flex justify-center items-center border-r-[1px] border-black p-2 text-[14px]">
                            {formatDate(item.timestamp) || " "}
                          </div>
                        </div>
                      )
                    )}
                  <div
                    className={`text-center p-2 font-semibold text-[20px] border-x-[1px] border-b-[1px] border-black ${
                      item.isPreviousMonth &&
                      matchedUser.id === item.id &&
                      item.remainingSalary
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {matchedUser.id === item.id && item.remainingSalary
                      ? `Remaining salary : ${item.remainingSalary}Rs`
                      : " "}
                  </div>

                  <div className="w-[100%] h-[50vh] flex justify-center items-center p-2 font-semibold text-[20px]">
                    <Empty />
                  </div>
                </span>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-[40%] h-[60vh] bg-white rounded-lg overflow-y-scroll">
          <h1 className="text-[22px] p-2 font-semibold underline text-center">
            Monthly Expenses
          </h1>
          <div className="w-full text-[20px] flex justify-center p-1">
            <ul className="text-black w-full ">
              {(apiData ?? []).map((item, id) => (
                <span key={id}>
                  <div className="w-[100%] flex">
                    <div
                      className={`w-[60%] text-right p-2 font-semibold text-[22px] border-y-[1px] border-l-[1px] border-black ${
                        matchedUser.id === item.id && item.totalSalary
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      {matchedUser.id === item.id && item.totalSalary
                        ? `Total salary : $${item.totalSalary},`
                        : " "}
                    </div>
                    <div
                      className={`w-[40%] flex items-center text-left p-2 text-[14px] border-y-[1px] border-r-[1px] border-black ${
                        matchedUser.id === item.id && item.timestamp
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      {matchedUser.id === item.id && item.timestamp
                        ? formatDate(item.timestamp)
                        : " "}
                    </div>
                  </div>
                  {item.id === matchedUser.id &&
                    item.expenses &&
                    Object.keys(item.expenses).map(
                      (expenseKey, expenseIndex) => (
                        <div
                          className="w-full flex  justify-between border-b-[1px] border-black"
                          key={expenseIndex}
                        >
                          <div className="w-[50%] text-center p-2 border-x-[1px] border-black">
                            {item.expenses[expenseKey]?.itemName || ""}
                          </div>
                          <div className="w-[50%] text-center p-2 border-r-[1px] border-black">
                            ${item.expenses[expenseKey]?.cost || " "}
                          </div>
                          <div className="w-[50%] flex justify-center items-center border-r-[1px] border-black p-2 text-[14px]">
                            {formatDate(item.timestamp) || " "}
                          </div>
                        </div>
                      )
                    )}
                  <div
                    className={`text-center p-2 font-semibold text-[20px] border-x-[1px] border-b-[1px] border-black ${
                      matchedUser.id === item.id && item.remainingSalary
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {matchedUser.id === item.id && item.remainingSalary
                      ? `Remaining salary : $${item.remainingSalary}`
                      : " "}
                  </div>
                  {matchedUser.id === item.id &&
                    (!item.expenses ||
                      Object.keys(item.expenses).length === 0) && (
                      <div className="w-[100%] h-[50vh] flex justify-center items-center p-2 font-semibold text-[20px]">
                        <Empty />
                      </div>
                    )}
                </span>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
