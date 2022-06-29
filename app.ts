import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { connectValidation, messageValidation } from "./middleware/validation";
import { messageController } from "./controller/message";
import { userController } from "./controller/user";
const httpServer = createServer();
const io = new Server(httpServer);
const adminIo = io.of("/admin");
const messageIo = io.of("/msg");
const userIo = io.of("/user");
io.use(connectValidation);
adminIo.use(connectValidation);
messageIo.use(connectValidation);
userIo.use(connectValidation);
adminIo.on("connection", (socket: Socket) => {
  console.log("admin server listen");
});

userIo.on("connection", (socket: Socket) => {
  userController(userIo, socket);
});

messageIo.use(messageValidation);
messageIo.on("connection", (socket: Socket) => {
  if (messageIo.sockets.size > 1000) {
    socket.disconnect();
  }

  messageController(messageIo, socket);

  socket.on("disconnecting", (reason: string) => {
    console.log(reason);
    const { room_id } = socket.handshake.query;
    socket.to(room_id + "").emit("msg:leaveUser", { message: "user leave" });
  });
});

httpServer.listen(4000);
