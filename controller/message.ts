import { Server, Socket, Namespace } from "socket.io";
import { MessageData, User } from "../type";
import {
  getAllMessage,
  insertMessage,
  updateMessage,
} from "../manager/message";
import uuid, { v4 } from "uuid";

export const messageController = (io: Server | Namespace, socket: Socket) => {
  socket.on("msg:insert", (data: MessageData) => {
    insertMessage(data, (err: Error, result: MessageData) => {
      err
        ? socket.to(socket.id).emit("msg:error", { error: err.toString() })
        : socket.to(data.chatRoomId + "").emit("msg:inserted", result);
    });
  });
  socket.on("msg:update", (data: MessageData) => {
    updateMessage(data, (err: Error, result: MessageData) => {
      err
        ? socket.to(socket.id).emit("msg:error", { error: err.toString() })
        : socket.to(data.chatRoomId + "").emit("msg:updated", result);
    });
  });
  socket.on("msg:getAll", () => {
    let { room_id } = socket.handshake.query;
    room_id = room_id + "" || "-1";
    getAllMessage(room_id, (err: Error, list: Array<MessageData>) => {
      err
        ? socket.to(socket.id).emit("msg:error", { error: err.toString() })
        : socket.to(room_id + "").emit("msg:getAll", list);
    });
  });
};
