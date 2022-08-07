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
    <div className="vh-100 bg-orange">
      {joined.joined === true ? (
        <Navigate to={`/room/${room.room}`} />
      ) : (
        <div className="pt-12 d-flex flex-column ai-center">
          <h1 className="fs-3 fc-white mb-3">Welcome to "El Chat de Terra"</h1>
          <p className="fs-1-5 mb-1">Enter your username</p>
          <input onChange={handleInput} className="fs-1-5 mb-1-5" />
          <p className="fs-1-5 mb-1">Select a room</p>
          <select onChange={handleSelect} className="fs-1-5 mb-2-5">
            {rooms.map((room) => {
              return (
                <option key={room.name} value={room.name} className="fs-1-5">
                  {room.name}
                </option>
              );
            })}
          </select>
          <button onClick={handleSubmit} className="fs-1-5 mb-2-5">
            Submit
          </button>
          <p className="fs-1-5 fc-red">{message.message}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
