type ConnectedAction = {
  type: "connected";
};

type EnteredWaitingRoom = {
  type: "enteredWaitingRoom";
  totalUser: number;
};

export type ReceiveAction = ConnectedAction | EnteredWaitingRoom;
