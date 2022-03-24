type EnterAction = {
  type: 'enter';
  gameId: string;
};

type CallAction = {
  type: 'call';
  to: string;
  description: RTCSessionDescriptionInit;
  color: string;
};

type AnswerAction = {
  type: 'answer';
  to: string;
  description: RTCSessionDescriptionInit;
};

type CandidateAction = {
  type: 'candidate';
  to: string;
  candidate: RTCIceCandidate | null;
};

type GameStartAction = {
  type: 'gameStart';
  gameId: string;
};

export type SendAction =
  | EnterAction
  | CallAction
  | AnswerAction
  | CandidateAction
  | GameStartAction;

const actionCreator = {
  enter: (gameId: string): EnterAction => ({ type: 'enter', gameId }),
  call: (to: string, description: RTCSessionDescriptionInit, color: string): CallAction => ({
    type: 'call',
    to,
    description,
    color,
  }),
  answer: (to: string, description: RTCSessionDescriptionInit): AnswerAction => ({
    type: 'answer',
    to,
    description,
  }),
  candidate: (to: string, candidate: RTCIceCandidate | null): CandidateAction => ({
    type: 'candidate',
    to,
    candidate,
  }),
  gameStart: (gameId: string): GameStartAction => ({
    type: 'gameStart',
    gameId,
  }),
};

export default actionCreator;
