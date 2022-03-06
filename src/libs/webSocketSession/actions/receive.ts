type ConnectedAction = {
  type: "connected";
};

type EnteredWaitingRoomAction = {
  type: "enteredWaitingRoom";
  totalUser: number;
};

type CreatedGameRoomAction = {
  type: "createdGameRoom";
  gameId: string;
};

export type ReceiveAction =
  | ConnectedAction
  | EnteredWaitingRoomAction
  | CreatedGameRoomAction;
