/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL: string;
    REACT_APP_TOKEN_NAME: string;
    REACT_APP_WEBSOCKET_URL: string;
  }
}

type User = {
  id: string;
  name: string;
  ingame?: string;
};

type Role = 'mafia' | 'police' | 'doctor' | 'civil';

type GameType = '4set' | '6set' | 'custom';

type RoleInfo = {
  [key in Role]: number;
};

type CreateGameData = {
  roomName: string;
  isPrivate: boolean;
  gameType: GameType;
  roleInfo: RoleInfo;
  userCount: number;
};

type GameInfo = {
  gameId: string;
  roomName: string;
  isPrivate: boolean;
  userCount: number;
  gameType: GameType;
  roleInfo: RoleInfo;
  masterId: string;
  sessions: User[];
};

type GameState = 'inGame' | 'waiting';

type GamePhase = 'init';
