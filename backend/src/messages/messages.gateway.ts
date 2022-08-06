import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { MessagesService } from "./messages.service";
import { Server, Socket } from "socket.io";
import { User } from "./interfaces/user.interface";
import { MessageDto } from "./dtos/message.dto";

@WebSocketGateway(5000, {
  cors: {
    origin: "*",
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage("joinRoom")
  joinRoom(
    @MessageBody("name") name: string,
    @MessageBody("room") room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);

    this.messagesService.identifyUser(client.id, name, room);

    return { success: true };
  }

  @SubscribeMessage("users")
  getUsers(@MessageBody() room: string) {
    const users: User[] = this.messagesService.getUsers(room);

    this.server.to(room).emit("users", users);
  }

  @SubscribeMessage("createMessage")
  create(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const newMessage = this.messagesService.createMessage(message, client.id);

    this.server.to(message.room).emit("newMessage", newMessage);
  }

  @SubscribeMessage("switchRoom")
  switchRoom(
    @MessageBody() currentRoom: string,
    @MessageBody() newRoom: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesService.switchRoom(client.id, currentRoom, newRoom);

    client.leave(currentRoom);
    client.join(newRoom);
  }
}
