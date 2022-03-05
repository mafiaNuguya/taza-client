import Session from "../Session";

type EnterAction = {
  type: "enter";
  channel: string;
};

// type LeaveAction = {
//   type: "leave";
//   channel: string;
// };

export type SendAction = EnterAction;

const actionCreator = {
  enter: (channel: string): EnterAction => ({ type: "enter", channel }),
  // leave: (channel: string): LeaveAction => ({ type: "leave", channel }),
};

export default actionCreator;
