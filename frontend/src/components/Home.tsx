import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { SocketContext } from "../context/socket";
import { rooms } from "../resources/rooms";

const Home = () => {
  const socket = useContext(SocketContext);

  let [username, setUsername] = useState({
    username: "",
  });

  let [room, setRoom] = useState({
    room: rooms[0].name,
  });

  let [message, setMessage] = useState({
    message: "",
  });

  let [joined, setJoined] = useState({
    joined: false,
  });

  const handleInput = (event: any) => {
    setUsername({
      username: event.target.value,
    });
  };

  const handleSelect = (event: any) => {
    setRoom({
      room: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (username.username !== "") {
      socket.emit(
        "joinRoom",
        { name: username.username, room: room.room },
        () => {
          setJoined({
            joined: true,
          });
        }
      );
    } else {
      setMessage({
        message: "Fill the field properly.",
      });
    }
  };

  return (
    <div>
      {joined.joined === true ? (
        <Navigate to={`/room/${room.room}`} />
      ) : (
        <div>
          <h1>Welcome to "El Chat de Terra"</h1>
          <input onChange={handleInput} />
          <select onChange={handleSelect}>
            {rooms.map((room) => {
              return (
                <option key={room.name} value={room.name}>
                  {room.name}
                </option>
              );
            })}
          </select>
          <button onClick={handleSubmit}>Submit</button>
          <h4>{message.message}</h4>
        </div>
      )}
    </div>
  );
};

export default Home;
