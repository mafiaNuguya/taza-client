type Disconnect = {
  type: "disconnect";
  from: string;
};

export type MessageType = Disconnect;

const messageCreator = {
  disconnect: (from: string): Disconnect => ({ type: "disconnect", from }),
};

export default messageCreator;
