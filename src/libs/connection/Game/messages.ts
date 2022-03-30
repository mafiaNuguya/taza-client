type Disconnect = {
  type: 'disconnect';
  from: string;
};

type StartGame = {
  type: 'startGame';
};

export type MessageType = Disconnect | StartGame;

const messageCreator = {
  disconnect: (from: string): Disconnect => ({ type: 'disconnect', from }),
  startGame: (): StartGame => ({ type: 'startGame' }),
};

export default messageCreator;
