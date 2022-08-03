import React from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect("http://127.0.0.1:5000");
export const SocketContext = React.createContext();
