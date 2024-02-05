import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import "./content.css";

const Content = (props) => {
  const { matchedUser } = props;
  console.log(matchedUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddItem = () => {
    if (itemName && itemPrice && matchedUser && matchedUser.id) {
      const newExpense = { itemName, cost: itemPrice };

      // Update local state
      setItems([...items, newExpense]);
      setItemName("");
      setItemPrice("");

      // Check if matchedUser has expenses and calculate the next index
      const nextIndex = matchedUser.expenses
        ? Object.keys(matchedUser.expenses).length + 1
        : 1;

      // Update the existing user's expenses object
      const updatedExpenses = {
        ...matchedUser.expenses,
        [`explist${nextIndex}`]: newExpense,
      };

      // Update the signup data
      const updatedApiData = apiData.map((user) =>
        user.id === matchedUser.id ? { ...user, expenses: updatedExpenses } : user
      );

      // Update state with the modified signup data
      setApiData(updatedApiData);

      // Post the updated data to the server
      axios
        .put(`http://localhost:3000/signUpData/${matchedUser.id}`, {
          ...matchedUser,
          expenses: updatedExpenses,
        })
        .then((response) => {
          // Handle successful response if needed
          console.log("Data updated successfully:", response.data);
        })
        .catch((error) => {
          // Handle error if needed
          console.error("Error updating data:", error);
        });
    }
  };

  // const submitTotalSalaryAndExpenses = () => {
  //   setUpdatedTotalSalary(totalSalary);
  //   if (updatedTotalSalary && matchedUser && matchedUser.id) {
  //     axios
  //       .put(`http://localhost:3000/signUpData/${matchedUser.id}`, {
  //         ...matchedUser,
  //         totalSalary: updatedTotalSalary,
  //       })
  //       .then((response) => {
  //         // Check if response exists before accessing 'data'
  //         if (response && response.data) {
  //           console.log("Total Salary updated successfully:", response.data);

  //           // Fetch updated data after successful update
  //           getData();
  //         } else {
  //           console.error("Total Salary update response is undefined");
  //         }
  //       })
  //       .catch((error) => {
  //         // Handle error if needed
  //         console.error("Error updating Total Salary:", error);
  //       });
  //   }
  // };

  const getData = () => {
    axios
      .get("http://localhost:3000/signUpData")
      .then((res) => setApiData(res.data));
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(apiData);

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
              {/* <label htmlFor="itemName" className="text-[18px] pr-2">
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
              </button> */}
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

              {/* Separate button to submit total salary and expenses */}
            </form>
          </div>
        </Modal>
      </div>
      <div className="w-[100%] h-auto flex justify-center items-center gap-4 overflow-y-scroll">
        <div className="w-[30%] h-[60vh] bg-white rounded-lg">
          <h1 className="text-[22px] p-2 font-semibold underline text-center">
            History
          </h1>
        </div>
        <div className="w-[30%] h-[60vh] bg-white rounded-lg overflow-y-scroll">
          <h1 className="text-[22px] p-2 font-semibold underline text-center">
            Todays Expenses
          </h1>
          <div className="w-full text-[20px] flex justify-center p-1">
            <ul className="text-black w-full border-2 border-black">
              {apiData.map((item, id) => (
                <span key={id}>
                  <div
                    className={`text-center p-2 font-semibold text-[20px] border-b-2 border-black ${
                      matchedUser.id === item.id && item.totalSalary
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {matchedUser.id === item.id && item.totalSalary
                      ? `Total salary : $${item.totalSalary}`
                      : " "}
                  </div>
                  <li key={item.id}>
                    {item.id === matchedUser.id &&
                      item.expenses &&
                      Object.keys(item.expenses).map(
                        (expenseKey, expenseIndex) => (
                          <div
                            className="w-full flex  justify-between border-b-2 border-black"
                            key={expenseIndex}
                          >
                            <div className="w-[50%] text-center p-2 border-r-[1px] border-black">
                              {item.expenses[expenseKey]?.itemName || ""}
                            </div>
                            <div className="w-[50%] text-center p-2">
                              ${item.expenses[expenseKey]?.cost || " "}
                            </div>
                          </div>
                        )
                      )}
                  </li>
                  <div
                    className={`text-center p-2 font-semibold text-[20px] border-b-2 border-black ${
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
                      <div className="text-center p-2 font-semibold text-[20px]">
                        Add items
                      </div>
                    )}
                </span>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-[30%] h-[60vh] bg-white rounded-lg">
          <h1 className="text-[22px] p-2 font-semibold underline text-center">
            Completed
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Content;


