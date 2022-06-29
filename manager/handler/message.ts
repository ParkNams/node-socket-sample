import { MessageData } from "../../type";
import { cache } from "../../cache";

const messageDataVaild = (data: MessageData, callback: Function) => {
  if (data.userId && data.chatRoomId && data.message) {
    callback(null, data);
  } else {
    callback(new Error("invalid data"));
  }
};

const messageInsert = (data: MessageData, callback: Function) => {
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

const messageUpdate = (data: MessageData, callback: Function) => {
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

export { messageDataVaild, messageInsert, messageUpdate };
