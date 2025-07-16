import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { FlipKeys } from "@/config/queryKey";
import { getCookie } from "@/utils";
import fetchDataServer from "@/utils/fetchServer";
// import { UserDataInterface } from "@/types/user";
// import axiosFetch from "@/utils/fetchDataServer";

export function usePostCoinFlipDo() {
  return useMutation(
    (data: {
      betCoinType: string;
      betAmount: string;
      selectDirection: 0 | 1;
    }) => fetchDataServer({ url: "/coin-flip/do", method: "post", data }),
  );
}
