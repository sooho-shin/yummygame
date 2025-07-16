import { useMutation, useQuery } from "@tanstack/react-query";

import {
  ArrayObject,
  RouletteBetType,
  ResultArrayObject,
} from "@/types/games/roulette";
import fetchDataServer from "@/utils/fetchServer";

export function usePostRouletteDo() {
  return useMutation(
    (data: {
      betCoinType: string;
      doRouletteGameBodyList: ResultArrayObject[];
    }) => fetchDataServer({ url: "/roulette/do", method: "post", data }),
  );
}
