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

  @SubscribeMessage("getUsers")
  getUsers(@MessageBody() room: string) {
    const users: User[] = this.messagesService.getUsers(room);

    this.server.to(room).emit("users", users);
  }

  @SubscribeMessage("getUsername")
  getUsername(@ConnectedSocket() client: Socket) {
    return this.messagesService.getUsername(client.id);
  }

  @SubscribeMessage("joinRoom")
  joinRoom(
    @MessageBody("name") name: string,
    @MessageBody("room") room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);

    this.messagesService.joinRoom(client.id, name, room);

    return { success: true };
  }

  @SubscribeMessage("switchRoom")
  switchRoom(@MessageBody() payload, @ConnectedSocket() client: Socket) {
    this.messagesService.switchRoom(client.id, payload);

    client.leave(payload.currentRoom);

    client.join(payload.newRoom);

    const users: User[] = this.messagesService.getUsers(payload.newRoom);

    this.server.to(payload.newRoom).emit("users", users);

    return { success: true };
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(
    @MessageBody() room: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const users = this.messagesService.leaveRoom(client.id, room.room);

    this.server.to(room.room).emit("users", users);

    client.leave(room.room);
  }

  @SubscribeMessage("createMessage")
  createMessage(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const newMessage = this.messagesService.createMessage(message, client.id);

    this.server.to(message.room).emit("newMessage", newMessage);
  }
}
