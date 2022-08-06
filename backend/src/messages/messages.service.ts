import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { Message } from "./interfaces/message.interface";
import { MessageDto } from "./dtos/message.dto";

@Injectable()
export class MessagesService {
  users: User[];
  rooms;

  constructor() {
    this.users = [];

    this.rooms = {
      travels: {
        users: [],
        messages: [],
      },
      literature: {
        users: [],
        messages: [],
      },
    };
  }

  identifyUser(id: string, name: string, room: string) {
    const newUser: User = {
      id,
      name,
    };

    this.users.push(newUser);

    this.rooms[room].users.push(newUser);
  }

  getUsers(room) {
    return this.rooms[room].users;
  }

  createMessage(message: MessageDto, clientId: string) {
    const user: User = this.users.find((user) => {
      return user.id === clientId;
    });

    const newMessage: Message = {
      username: user.name,
      text: message.text,
    };

    this.rooms[message.room].messages.push(newMessage);

    return newMessage;
  }
}
