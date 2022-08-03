import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessagesService {
  clientToUser = {};

  create(createMessageDto: CreateMessageDto, cliendId: string) {
    const message = {
      name: this.clientToUser[cliendId],
      text: createMessageDto.text,
    };
    return message;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
