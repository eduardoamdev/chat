import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { Server, Socket } from "socket.io";

@WebSocketGateway(5000, {
  cors: {
    origin: "*",
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage("createMessage")
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(`room_${createMessageDto.room}`)
      .emit("new_message", createMessageDto.text);
  }

  /* @SubscribeMessage("findAllMessages")
  findAll() {
    return this.messagesService.findAll();
  } */

  @SubscribeMessage("joinRoom")
  joinRoom(
    @MessageBody("name") name: string,
    @MessageBody("room") room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    return this.messagesService.identify(name, client.id);
  }

  /* @SubscribeMessage("typing")
  async typing(
    @MessageBody("isTyping") isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.messagesService.getClientName(client.id);

    this.server.emit("typing", { name, isTyping });
  } */
}
