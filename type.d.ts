import { Server, Socket } from "socket.io";

declare interface MessageData {
  userId: string;
  chatRoomId: number;
  message: string;
  order?: number;
  createdDate?: Date;
  updatedDate?: Date;
}

declare interface Result {
  message: string;
}

declare interface User {
  userId: string;
  userPassword: string;
}
