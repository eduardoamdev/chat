/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socket";
import { rooms } from "../resources/rooms";
import { RoomInfo } from "../interfaces/Room";

const Room = () => {
  const socket = useContext(SocketContext);

  let [username, setUsername] = useState({
    username: "",
  });

  let [room, setRoom] = useState({
    room: useParams().id,
  });

  const allRooms: RoomInfo[] = rooms;

  let [message, setMessage] = useState({
    content: "",
  });

  const getUsername = () => {
    socket.emit("getUsername", {}, (response: any) => {
      setUsername({
        username: response.name,
      });
    });
  };

  const handleInput = (event: any) => {
    setMessage({
      content: event.target.value,
    });
  };

  const handleSubmit = () => {
    socket.emit(
      "createMessage",
      { text: message.content, room: room.room },
      () => {
        setMessage({
          content: "",
        });
      }
    );

    setMessage({
      content: "",
    });
  };

  const switchRoom = (newRoom: string) => {
    socket.emit("switchRoom", { currentRoom: room.room, newRoom }, () => {
      setRoom({
        room: newRoom,
      });
    });
  };

  useEffect(() => {
    getUsername();
    socket.emit("getUsers", room.room);
    socket.on("users", (users: any) => {
      console.log(users);
    });
    socket.on("newMessage", (newMessage: any) => {
      console.log(newMessage);
    });
  }, []);

  return (
    <div>
      <div>
        <div>
          <h1>
            Hi {username.username}. Welcome to {room.room}
          </h1>
          <span>
            Type your message:
            <input onChange={handleInput} value={message.content} />
          </span>
          <button onClick={handleSubmit}>Send</button>
        </div>
        <div>
          <ul>
            {allRooms.map((roomElement: RoomInfo) => {
              if (roomElement.name !== room.room) {
                return (
                  <div
                    key={roomElement.name}
                    onClick={() => {
                      switchRoom(roomElement.name);
                    }}
                  >
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
    </div>
  );
};

export default Room;
