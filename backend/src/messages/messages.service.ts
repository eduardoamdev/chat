import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";

@Injectable()
export class MessagesService {
  users: User[] = [];

  messages: {
    travels: [];
    literature: [];
  };

  identify(id: string, name: string) {
    const newUser: User = {
      id,
      name,
    };

    this.users.push(newUser);

    return this.users;
  }

  getUsers() {
    return this.users;
  }

  /* create(createMessageDto: CreateMessageDto, cliendId: string) {
    const message = {
      name: this.clientToUser[cliendId],
      text: createMessageDto.text,
    };
    return message;
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  } */
}
