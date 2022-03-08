type Disconnect = {
  type: "disconnect";
  destroyGame: boolean;
};

export type MessageType = Disconnect;

const messageCreator = {
  disconnect: (isMaster: boolean): Disconnect => ({
    type: "disconnect",
    destroyGame: isMaster,
  }),
};

export default messageCreator;
