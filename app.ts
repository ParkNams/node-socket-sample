import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { connectValidation, messageValidation } from "./middleware/validation";
import { messageController } from "./controller/message";
import { userController } from "./controller/user";
import { userCache } from "./cache";
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
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
    console.log("disconnect");
    userCache.del(socket.handshake.auth.userHash);
    const { room_id } = socket.handshake.query;
    messageIo.to(room_id + "").emit("msg:leaveUser", { message: "user leave" });
  });
});

messageIo.on("disconnecting", () => {
  messageIo.disconnectSockets(true);
});
httpServer.listen(4000);
