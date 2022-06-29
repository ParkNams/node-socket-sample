import { User } from "../type";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
const SECRET_SALT: string = process.env.USER_SECRET_SALT + "";

const userLogin = (user: User, callback: Function) => {
  try {
    const hash = CryptoJS.AES.encrypt(JSON.stringify(user), SECRET_SALT);
    callback(null, hash.toString());
  } catch (e) {
    callback(e);
  }
};

export { userLogin };
