type ConnectedAction = {
  type: 'connected';
  sessionId: string;
  sessionName: string;
};

type EnteredAction = {
  type: 'entered';
  gameInfo: GameInfo;
  enteredId: string;
  enteredName: string;
  memberIndex: number;
};

type EnteredFailAction = {
  type: 'enteredFail';
  gameId: string;
  reason: string;
};

type CalledAction = {
  type: 'called';
  from: string;
  name: string;
  description: RTCSessionDescriptionInit;
  color: string;
};

type AnsweredAction = {
  type: 'answered';
  from: string;
  description: RTCSessionDescriptionInit;
};

type CandidatedAction = {
  type: 'candidated';
  from: string;
  candidate: RTCIceCandidateInit;
};

type GameStartedAction = {
  type: 'gameStarted';
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
