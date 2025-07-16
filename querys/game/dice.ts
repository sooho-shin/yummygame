import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { getCookie } from "@/utils";
import fetchDataServer from "@/utils/fetchServer";
// import { UserDataInterface } from "@/types/user";
// import axiosFetch from "@/utils/fetchDataServer";

export function usePostDiceDo() {
  return useMutation(
    (data: {
      betCoinType: string;
      betAmount: string;
      selectNumber: number;
      direction: 0 | 1;
    }) => fetchDataServer({ url: "/classic-dice/do", method: "post", data }),
  );
}
