import { Server, Socket, Namespace } from "socket.io";
import { userLogin } from "../manager/user";
import { User } from "../type";

export const userController = (io: Server | Namespace, socket: Socket) => {
  socket.on("user:login", (user: User) => {
    userLogin(user, (err: Error, result: string) => {
      err
        ? io.to(socket.id).emit("user:error", { error: err.toString() })
        : io
            .to(socket.id)
            .emit("user:loginSuccess", { message: "success", token: result });
    });
  });
};
