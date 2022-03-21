type ConnectedAction = {
  type: "connected";
  gameInfo: GameInfo;
  sessionId: string;
  sessionName: string;
};

type EnteredAction = {
  type: "entered";
  gameId: string;
  enteredId: string;
  enteredName: string;
};

type EnteredFailAction = {
  type: "enteredFail";
  gameId: string;
  reason: string;
};

type CalledAction = {
  type: "called";
  from: string;
  name: string;
  description: RTCSessionDescriptionInit;
};

type AnsweredAction = {
  type: "answered";
  from: string;
  description: RTCSessionDescriptionInit;
};

type CandidatedAction = {
  type: "candidated";
  from: string;
  candidate: RTCIceCandidateInit;
};

type GameStartedAction = {
  type: "gameStarted";
  onGame: true;
};

export type ReceiveAction =
  | ConnectedAction
  | EnteredAction
  | EnteredFailAction
  | CalledAction
  | AnsweredAction
  | CandidatedAction
  | GameStartedAction;
