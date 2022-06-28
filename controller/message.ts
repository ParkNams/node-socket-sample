import { Server, Socket, Namespace } from "socket.io";
import { MessageData, Result } from "../type";
import {
  getAllMessage,
  insertMessage,
  updateMessage,
} from "../manager/message";
export const messageController = (io: Server | Namespace, socket: Socket) => {
  socket.on("msg:insert", (data: MessageData) => {
    insertMessage(data, (err: Error, result: MessageData) => {
      err
        ? socket.emit("msg:error", { error: err.toString() })
        : socket.emit("msg:inserted", result);
    });
  });
  socket.on("msg:update", (data: MessageData) => {
    updateMessage(data, (err: Error, result: MessageData) => {
      err
        ? socket.emit("msg:error", { error: err.toString() })
        : socket.emit("msg:updated", result);
    });
  });
  socket.on("msg:getAll", () => {
    let { room_id } = socket.handshake.query;
    room_id = room_id + "" || "-1";
    getAllMessage(room_id, (err: Error, list: Array<MessageData>) => {
      err
        ? socket.emit("msg:error", { error: err.toString() })
        : socket.emit("msg:getAll", list);
    });
  });
};
