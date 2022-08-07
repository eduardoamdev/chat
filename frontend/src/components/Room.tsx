/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socket";
import { rooms } from "../resources/rooms";
import { RoomInfo } from "../interfaces/Room";

const Room = () => {
  const socket = useContext(SocketContext);

  const allRooms: RoomInfo[] = rooms;

  let [username, setUsername] = useState({
    username: "",
  });

  let [users, setUsers] = useState({
    users: [],
  });

  let [messages, setMessages] = useState<any>({
    messages: [],
  });

  let [room, setRoom] = useState<any>({
    room: useParams().id,
  });

  let [leave, setLeave] = useState({
    leave: false,
  });

  let [message, setMessage] = useState({
    content: "",
  });

  const handleInput = (event: any) => {
    setMessage({
      content: event.target.value,
    });
  };

  const handleSubmit = () => {
    socket.emit("createMessage", { text: message.content, room: room.room });

    setMessage({
      content: "",
    });
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", { room: room.room });
    setLeave({
      leave: true,
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
    socket.emit("getUsername", {}, (response: any) => {
      setUsername({
        username: response.name,
      });
    });

    socket.emit("getUsers", room.room);

    socket.on("users", (users: any) => {
      setUsers({
        users,
      });
    });

    socket.on("newMessage", (newMessage: any) => {
      const roomMessages: any[] = messages.messages;

      roomMessages.push(newMessage);

      setMessages({
        messages: roomMessages,
      });
    });
  }, []);

  return (
    <div className="vh-100 bg-orange">
      {leave.leave === true ? (
        <Navigate to={`/`} />
      ) : (
        <div>
          <nav className="bg-light-orange d-flex flex-space-between p-2-3 border-bottom-5-pink">
            <span className="fs-1-5">Username: {username.username}</span>
            <div>
              <span className="fs-1-5">Room: {room.room}</span>
              <button onClick={handleLeaveRoom} className="fs-1-5 ml-2">
                Home
              </button>
            </div>
          </nav>
          <div className="d-flex wp-100">
            <div className="wp-50 d-flex flex-center pt-7">
              <div className="vh-55 p-2-3 bg-white border-5-pink  wp-40">
                <div className="hp-95 scroll">
                  <ul>
                    {messages.messages.map(
                      (message: {
                        id: string;
                        username: string;
                        text: string;
                      }) => {
                        console.log(messages);
                        return (
                          <li key={message.id} className="li-style-none mb-1">
                            <div>
                              {message.username === username.username ? (
                                <span className="fs-1-5">You</span>
                              ) : (
                                <span className="fs-1-5">
                                  {message.username}
                                </span>
                              )}
                              : <span className="fs-1-5">{message.text}</span>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
                <div>
                  <input
                    onChange={handleInput}
                    value={message.content}
                    className="fs-1-5 mr-1"
                  />
                  <button onClick={handleSubmit} className="fs-1-5">
                    Send
                  </button>
                </div>
              </div>
            </div>
            <div className="wp-50 d-flex flex-column ai-center pt-7">
              <div className="vh-20 p-2-3 bg-white border-5-pink wp-30 mb-3">
                <p className="mb-1 fs-1-5">Rooms:</p>
                <div className="scroll bg-white hp-70">
                  <ul>
                    {allRooms.map((roomElement: RoomInfo) => {
                      if (roomElement.name !== room.room) {
                        return (
                          <li
                            key={roomElement.name}
                            onClick={() => {
                              switchRoom(roomElement.name);
                            }}
                            className="li-style-none mb-1 fs-1-5"
                          >
                            {roomElement.name}
                          </li>
                        );
                      } else {
                        return <div key={roomElement.name}></div>;
                      }
                    })}
                  </ul>
                </div>
              </div>
              <div className="vh-20 p-2-3 bg-white border-5-pink wp-30">
                <p className="mb-1 fs-1-5">Users:</p>
                <div className="scroll bg-white hp-70">
                  <ul>
                    {users.users.map((user: { id: string; name: string }) => {
                      if (user.name !== username.username) {
                        return (
                          <li
                            key={user.id}
                            className="li-style-none mb-1 fs-1-5"
                          >
                            {user.name}
                          </li>
                        );
                      } else {
                        return <div key={user.name}></div>;
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
