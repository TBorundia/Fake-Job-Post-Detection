import React, { useState } from "react";
import axios from "axios";

const ValidateInput = () => {
  const [inputText, setInputText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/validate/", { text: inputText });
      setMessage(response.data.message); // Display message from backend
    } catch (error) {
      setMessage("Error: Unable to validate.");
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Validate Statement</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your statement"
          style={{ padding: "10px", width: "300px" }}
        />
        <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>
          Submit
        </button>
      </form>
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default ValidateInput;
