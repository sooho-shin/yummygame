import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { CommonGameKeys, MineKeys } from "@/config/queryKey";
import { getCookie } from "@/utils";
import fetchDataServer from "@/utils/fetchServer";
// import { UserDataInterface } from "@/types/user";
// import axiosFetch from "@/utils/fetchDataServer";

// export function usePostDiceDo() {
//   return useMutation(
//     (data: {
//       betCoinType: string;
//       betAmount: string;
//       selectNumber: number;
//       direction: 0 | 1;
//     }) => fetchDataServer({ url: "/classic-dice/do", method: "post", data }),
//   );
// }

export function usePostMineRound() {
  return useMutation(
    (data: { boomCount: number; betCoinType: string; betAmount: string }) =>
      fetchDataServer({ url: "/mines/round", method: "post", data }),
  );
}

export function usePostMineDo() {
  return useMutation((data: { selectNumber: number }) =>
    fetchDataServer({ url: "/mines/do", method: "post", data }),
  );
}

export function usePostMineAuto() {
  return useMutation(
    (data: {
      boomCount: number;
      betCoinType: string;
      betAmount: string;
      selectNumberList: number[];
    }) => fetchDataServer({ url: "/mines/auto", method: "post", data }),
  );
}

export function usePostMineCashout() {
  return useMutation((data: object) =>
    fetchDataServer({ url: "/mines/cashout", method: "post", data }),
  );
}

export function useGetMineRound() {
  return useQuery([MineKeys.ROUND], () =>
    fetchDataServer({ url: `/mines/round` }),
  );
}
