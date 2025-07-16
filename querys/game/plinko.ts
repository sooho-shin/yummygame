import { useMutation } from "@tanstack/react-query";

import fetchDataServer from "@/utils/fetchServer";
// import { UserDataInterface } from "@/types/user";
// import axiosFetch from "@/utils/fetchDataServer";

export function usePostPlinkoDo() {
  return useMutation(
    async (data: {
      id: number;
      betCoinType: string;
      betAmount: string;
      risk: string;
      rowCount: number;
    }) => {
      const response = await fetchDataServer({
        url: "/plinko/do" + `?id=${data.id}`,
        method: "post",
        data: {
          betCoinType: data.betCoinType,
          betAmount: data.betAmount,
          risk: data.risk,
          rowCount: data.rowCount,
        },
      });
      return response;
    },
  );
}
