import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Room = () => {
  let [message, setMessage] = useState({
    content: "",
  });

  let [room, setRoom] = useState({
    room: useParams().id,
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
    socket.on("new-message", (newMessage) => {
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
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
};

export default Room;
