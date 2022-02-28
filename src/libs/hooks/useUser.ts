import { useEffect } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import useSWR, { Fetcher, KeyedMutator } from "swr";

type User = {
  id: string;
  name: string;
};

type UseUserReturnType = [
  User | undefined,
  { mutate: KeyedMutator<{ user?: User }>; loading: boolean; error: any }
];

const fetcher: Fetcher<{ user?: User }> = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("유효한 토큰이 아닙니다.");
  }
  return res.json();
};

const useUser = (): UseUserReturnType => {
  const navigate = useNavigate();
  const alert = useAlert();
  const { data, mutate, error } = useSWR(
    `${process.env.REACT_APP_API_URL}/user`,
    fetcher
  );

  useEffect(() => {
    if (!data && error) {
      alert.show(error.message, { type: "error" });
      return;
    }
  }, [data, error, navigate, alert]);

  return [
    data?.user,
    {
      mutate,
      loading: !data && !error,
      error,
    },
  ];
};

export default useUser;
