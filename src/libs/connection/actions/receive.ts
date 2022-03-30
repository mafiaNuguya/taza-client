type EnteredAction = {
  type: 'entered';
  gameInfo: GameInfo;
  enteredId: string;
  enteredName: string;
  color: string;
};

type LeavedAction = {
  type: 'leaved';
  leavedId: string;
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
  | EnteredAction
  | LeavedAction
  | EnteredFailAction
  | CalledAction
  | AnsweredAction
  | CandidatedAction
  | GameStartedAction;
