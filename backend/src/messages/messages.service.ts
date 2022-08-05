import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { Message } from "./interfaces/message.interface";
import { MessageDto } from "./dtos/message.dto";

@Injectable()
export class MessagesService {
  rooms;

  constructor() {
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

    this.rooms[room].users.push(newUser);
  }

  getUsers(room) {
    return this.rooms[room].users;
  }

  createMessage(message: MessageDto) {
    const newMessage: Message = {
      name: message.name,
      text: message.text,
    };

    this.rooms[message.room].messages.push(newMessage);
  }
}
