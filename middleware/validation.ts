import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const connectValidation = (socket: Socket, next: Function): void => {
  const header = socket.handshake.headers;
  if (process.env.API_KEY !== header["api_key"]) {
    next(new Error("not accept"));
  } else {
    next();
  }
};

const messageValidation = (socket: Socket, next: Function): void => {
  const query = socket.handshake.query;
  if (query.room_id) {
    socket.join(query.room_id);
    next();
  } else {
    next(new Error("doesnt have room id"));
  }
};

export { connectValidation, messageValidation };
