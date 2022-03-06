import type { CreateGameData } from "../../../components/game/CreateGame";

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
  gameData: CreateGameData;
};

export type SendAction = EnterAction | CreateGameAction;

const actionCreator = {
  enter: (channel: string): EnterAction => ({ type: "enter", channel }),
  // leave: (channel: string): LeaveAction => ({ type: "leave", channel }),
  createGame: (gameData: CreateGameData): CreateGameAction => ({
    type: "createGame",
    gameData,
  }),
};

export default actionCreator;
