/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socket";
import { rooms } from "../resources/rooms";
import { RoomInfo } from "../interfaces/Room";

const Room = () => {
  const socket = useContext(SocketContext);

  const room = useParams().id;

  const allRooms: RoomInfo[] = rooms;

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

  const switchRoom = () => {
    console.log("Switch room");
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
    <>
      <div>
        <div>
          <h1>Welcome to {useParams().id}</h1>
          <span>
            Type your message:
            <input onChange={handleInput} value={message.content} />
          </span>
          <button onClick={handleSubmit}>Send</button>
        </div>
        <div>
          <ul>
            {allRooms.map((roomElement: RoomInfo) => {
              if (roomElement.name !== room) {
                return (
                  <div key={roomElement.name} onClick={switchRoom}>
                    {roomElement.name}
                  </div>
                );
              } else {
                return <div key={roomElement.name}></div>;
              }
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Room;
