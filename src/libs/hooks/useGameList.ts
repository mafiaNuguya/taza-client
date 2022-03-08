import useSWR, { Fetcher, KeyedMutator } from "swr";

type UseGameRoomReturnType = [
  GameInfo[] | undefined,
  {
    mutate: KeyedMutator<{ gameList?: GameInfo[] }>;
    loading: boolean;
    error: any;
  }
];

const fetcher: Fetcher<{ gameList?: GameInfo[] }> = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("정보를 불러 올 수 없습니다.");
  }
  return res.json();
};

const useGameRoom = (): UseGameRoomReturnType => {
  const { data, mutate, error } = useSWR(
    `${process.env.REACT_APP_API_URL}/game/list`,
    fetcher
  );

  return [
    data?.gameList,
    {
      mutate,
      loading: !data && !error,
      error,
    },
  ];
};

export default useGameRoom;
