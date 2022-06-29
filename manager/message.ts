import { cache } from "../cache";
import { MessageData } from "../type";
import async from "async";
import {
  messageDataVaild,
  messageInsert,
  messageUpdate,
} from "./handler/message";
const insertMessage = (data: MessageData, callback: Function) => {
  async.waterfall(
    [
      (callback: Function) => callback(null, data),
      messageDataVaild,
      messageInsert,
    ],
    (err, result) => {
      err ? callback(err) : callback(null, result);
    }
  );
};

const updateMessage = (data: MessageData, callback: Function) => {
  async.waterfall(
    [
      (callback: Function) => callback(null, data),
      messageDataVaild,
      messageUpdate,
    ],
    (err, result) => {
      err ? callback(err) : callback(null, result);
    }
  );
};

const getAllMessage = (room_id: string, callback: Function) => {
  try {
    const getMsgList: Array<MessageData> = cache.get(room_id) || [];
    callback(null, getMsgList);
  } catch (e) {
    callback(e);
  }
};

export { insertMessage, updateMessage, getAllMessage };
