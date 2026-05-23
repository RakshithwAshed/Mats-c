import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://matsc-backend.onrender.com");

function Chat() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

  console.log("Socket connected");

  // LOAD OLD MESSAGES
  socket.on("load_messages", (data) => {

    console.log("Old messages:", data);

    setMessages(data);

  });

  // RECEIVE NEW MESSAGE
  socket.on("receive_message", (data) => {

    console.log("Message received:", data);

    setMessages((prev) => [...prev, data]);

  });

  return () => {

    socket.off("load_messages");
    socket.off("receive_message");

  };

}, []);

  const sendMessage = () => {

    if(message.trim() === "") return;

    const user = JSON.parse(localStorage.getItem("user"));

const messageData = {
  text: message,
  username: user.username
};

    console.log("Sending:", messageData);

    socket.emit("send_message", messageData);

    setMessage("");

  };

  return (

    <div style={{ padding: "20px" }}>

      <h1>Private Chat 💬</h1>

      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "20px"
        }}
      >

        {
          messages.map((msg, index) => (

            <p key={index}>
              <strong>{msg.username}: </strong> {msg.text}
            </p>

          ))
        }

      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>

  );

}

export default Chat;