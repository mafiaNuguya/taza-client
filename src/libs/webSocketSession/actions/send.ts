import Session from "../Session";

type EnterAction = {
  type: "enter";
  channel: string;
};

// type LeaveAction = {
//   type: "leave";
//   channel: string;
// };

type CreateGameAction = {
  type: "createGame";
};

export type SendAction = EnterAction | CreateGameAction;

const actionCreator = {
  enter: (channel: string): EnterAction => ({ type: "enter", channel }),
  // leave: (channel: string): LeaveAction => ({ type: "leave", channel }),
};

export default actionCreator;
