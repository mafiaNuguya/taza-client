import type { User } from "./useUser";
import type { RoleCounts } from "../../components/game/CreateGame/RoleCounter";

import useSWR, { Fetcher, KeyedMutator } from "swr";

type GameType = "4set" | "6set" | "custom";

export type GameRoom = {
  gameId: string;
  roomName: string;
  gameType: GameType;
  isPrivate: boolean;
  roleCounts: RoleCounts;
  masterId: string;
  sessions: User[];
};

type UseGameRoomReturnType = [
  GameRoom[] | undefined,
  {
    mutate: KeyedMutator<{ gameRooms?: GameRoom[] }>;
    loading: boolean;
    error: any;
  }
];

const fetcher: Fetcher<{ gameRooms?: GameRoom[] }> = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("정보를 불러 올 수 없습니다.");
  }
  return res.json();
};

const useGameRoom = (): UseGameRoomReturnType => {
  const { data, mutate, error } = useSWR(
    `${process.env.REACT_APP_API_URL}/gameRooms`,
    fetcher
  );

  if (data?.gameRooms) {
    data.gameRooms[0].sessions = [{ name: "이름", id: "id" }];
  }

  return [
    data?.gameRooms,
    {
      mutate,
      loading: !data && !error,
      error,
    },
  ];
};

export default useGameRoom;
