import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { Message } from "./interfaces/message.interface";
import { MessageDto } from "./dtos/message.dto";

@Injectable()
export class MessagesService {
  users: User[];
  rooms;
  messageCounter: string;

  constructor() {
    this.users = [];

    this.messageCounter = "0";

    this.rooms = {
      travels: {
        users: [],
        messages: [],
      },
      literature: {
        users: [],
        messages: [],
      },
      art: {
        users: [],
        messages: [],
      },
      politics: {
        users: [],
        messages: [],
      },
      economics: {
        users: [],
        messages: [],
      },
    };
  }

  getUsers(room: string) {
    return this.rooms[room].users;
  }

  getUsername(id) {
    return this.users.find((user) => user.id === id);
  }

  joinRoom(id: string, name: string, room: string) {
    const newUser: User = {
      id,
      name,
    };

    this.users.push(newUser);

    this.rooms[room].users.push(newUser);
  }

  switchRoom(clientId: string, payload) {
    const currentRoomUsers: User[] = [];

    let user: User;

    this.rooms[payload.currentRoom].users.forEach((roomUser) => {
      if (roomUser.id !== clientId) {
        currentRoomUsers.push(roomUser);
      } else {
        user = roomUser;
      }
    });

    this.rooms[payload.newRoom].users.push(user);

    this.rooms[payload.currentRoom].users = currentRoomUsers;
  }

  leaveRoom(clientId: string, room: string) {
    const allUsers: User[] = [];

    this.users.forEach((user) => {
      if (user.id !== clientId) {
        allUsers.push(user);
      }
    });

    this.users = allUsers;

    const roomUsers: User[] = [];

    this.rooms[room].users.forEach((user) => {
      if (user.id !== clientId) {
        roomUsers.push(user);
      }
    });

    this.rooms[room].users = roomUsers;

    return this.rooms[room].users;
  }

  createMessage(message: MessageDto, clientId: string) {
    const user: User = this.users.find((user) => {
      return user.id === clientId;
    });

    const newMessage: Message = {
      id: this.messageCounter,
      username: user.name,
      text: message.text,
    };

    this.rooms[message.room].messages.push(newMessage);

    const newMessageCounterValue = (
      parseInt(this.messageCounter) + 1
    ).toString();

    this.messageCounter = newMessageCounterValue;

    return this.rooms[message.room].messages;
  }

  getMessages(room: string) {
    return this.rooms[room].messages;
  }
}
