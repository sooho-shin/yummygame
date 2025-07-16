

import { useMutation, useQuery } from "@tanstack/react-query";

import { FlipKeys } from "@/config/queryKey";
import fetchDataServer from "@/utils/fetchServer";

export function usePostUltimateDiceDo() {
  return useMutation(
    (data: {
      betCoinType: string;
      betAmount: string;
      direction: 0 | 1;
      startNumber: number;
      endNumber: number;
    }) => fetchDataServer({ url: "/ultimate-dice/do", method: "post", data }),
  );
}

export function useGetUltimateDiceInfo() {
  return useQuery([FlipKeys.INFO], () =>
    fetchDataServer({ url: "/ultimate-dice/info" }),
  );
}
