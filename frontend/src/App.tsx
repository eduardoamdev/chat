import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import { SocketContext, socket } from "./context/socket";

function App() {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
