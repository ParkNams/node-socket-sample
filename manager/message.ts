import { cache } from "../cache";
import { MessageData } from "../type";

const insertMessage = (data: MessageData, callback: Function) => {
  try {
    const getMsgList: Array<MessageData> | undefined = cache.get(
      data.chatRoomId
    );
    data.createdDate = new Date();
    data.updatedDate = new Date();
    if (getMsgList) {
      data.order = getMsgList.length;
      getMsgList.push(data);
      cache.set(String(data.chatRoomId), getMsgList);
    } else {
      data.order = 0;
      cache.set(String(data.chatRoomId), [data]);
    }
    callback(null, data);
  } catch (e) {
    callback(e);
  }
};

const updateMessage = (data: MessageData, callback: Function) => {
  try {
    const getMsgList: Array<MessageData> | undefined = cache.get(
      data.chatRoomId
    );
    if (!getMsgList) {
      callback(new Error("message doesn't have"));
    } else {
      getMsgList[data.order || 0] = data;
      cache.set(String(data.chatRoomId), getMsgList);
      callback(null, data);
    }
  } catch (e) {
    callback(e);
  }
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
