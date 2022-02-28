import { useState } from "react";
import { useAlert } from "react-alert";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const alert = useAlert();

  function mutate(data: any, withCookie?: boolean) {
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ...(withCookie && { credentials: "same-origin" }),
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then(setData)
      .catch((e) => alert.show(e))
      .finally(() => setLoading(false));
  }

  return [mutate, { loading, data }];
}
