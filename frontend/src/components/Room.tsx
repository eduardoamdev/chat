/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socket";

const Room = () => {
  const socket = useContext(SocketContext);

  const room = useParams().id;

  let [message, setMessage] = useState({
    content: "",
  });

  const handleInput = (event: any) => {
    setMessage({
      content: event.target.value,
    });
  };

  const handleSubmit = () => {
    socket.emit("createMessage", { text: message.content, room }, () => {
      setMessage({
        content: "",
      });
    });
  };

  useEffect(() => {
    socket.emit("users", room);
    socket.on("users", (users: any) => {
      console.log(users);
    });
    socket.on("newMessage", (newMessage: any) => {
      console.log(newMessage);
    });
  }, []);

  return (
    <div>
      <h1>Welcome to {useParams().id}</h1>
      <span>
        Type your message:
        <input onChange={handleInput} value={message.content} />
      </span>
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default Room;
