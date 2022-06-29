import { Server, Socket } from "socket.io";
//import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { userCache } from "./../cache";
import crypto from "crypto";
dotenv.config();
const SECRET_SALT: string = process.env.USER_SECRET_SALT + "";
const connectValidation = (socket: Socket, next: Function): void => {
  const auth = socket.handshake.auth;
  // const hash = CryptoJS.AES.encrypt(
  //   JSON.stringify(auth["userId"]),
  //   SECRET_SALT
  // ).toString();
  const hash = crypto
    .createHmac("sha256", SECRET_SALT)
    .update(auth["userId"])
    .digest("hex");
  if (
    (process.env.API_KEY !== auth["API_KEY"] &&
      process.env.API_KEY !== auth["api_key"]) ||
    userCache.get(hash)
  ) {
    next(new Error("not accept"));
  } else {
    userCache.set(hash, { userId: auth["userId"] });
    socket.handshake.auth.userHash = hash;
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
