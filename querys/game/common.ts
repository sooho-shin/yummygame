import { BookmarksKeys, CommonGameKeys } from "@/config/queryKey";
import {
  BetLimitDataType,
  GameDetailDataType,
  GameMasterDataType,
  GetInfoFavoriteDataType,
} from "@/types/games/common";
import fetchDataServer from "@/utils/fetchServer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function replaceUnderscoreWithHyphen(input: string): string {
  return input.replace(/_/g, "-");
}

export function useGetHistoryAll() {
  return useQuery(
    [CommonGameKeys.ALLHISTORY],
    () => fetchDataServer({ url: `/game/all` }),
    {
      keepPreviousData: true,
    },
  );
}

export function useGetHistoryMy(
  type: string,
  data: { gameIdx: number },
  token: string | null,
) {
  return useQuery(
    [
      `${CommonGameKeys.MYHISTORY}${type}`,
      { gameIdx: data.gameIdx === 0 ? null : data.gameIdx },
      token,
    ],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/${replaceUnderscoreWithHyphen(type)}/my`,
          data,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
  );
}

export function useGetGameInfo(type: string) {
  return useQuery<{ result: BetLimitDataType }>(
    [CommonGameKeys.INFO, type],
    () =>
      fetchDataServer({ url: `/${replaceUnderscoreWithHyphen(type)}/info` }),
  );
}

export function useGetGameDataOfRound(data: {
  type: string | null;
  round: number | null;
}) {
  return useQuery<GameMasterDataType>([CommonGameKeys.INFO, data], () => {
    if (data.round) {
      return fetchDataServer({ url: `/${data.type}/${data.round}` });
    } else {
      // token이 null이면 아무 데이터도 가져오지 않도록 처리
      return Promise.resolve({ data: null });
    }
  });
}

export function useGetGameSeed(data: { gameType: string }) {
  return useQuery<{
    result: {
      user_idx: number;
      game_type: string;
      current_server_seed_hash: string;
      current_client_seed: string;
      next_server_seed_hash: string;
      nonce: number;
    };
  }>(
    [CommonGameKeys.SEED],
    () => fetchDataServer({ url: `/game/seed`, data }),
    {
      keepPreviousData: true,
    },
  );
}

export function useGetGameDetail(data: {
  type: string | null;
  GameIdx: number | null;
}) {
  return useQuery<GameDetailDataType>(
    [CommonGameKeys.DETAIL, data],
    () => {
      if (data.GameIdx) {
        return fetchDataServer({
          url: `/game/detail/${data.type}/${data.GameIdx}`,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
    {
      keepPreviousData: false,
    },
  );
}

export function usePutGameSeed() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { gameType: string; clientSeed: string }) =>
      fetchDataServer({ url: "/game/seed", method: "put", data }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([CommonGameKeys.SEED]);
        }
      },
    },
  );
}

export function useGetIsFavorite(gameId: string, token: string | null) {
  return useQuery<GetInfoFavoriteDataType>(
    [CommonGameKeys.ISFAVORITE, gameId, token],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/game/info/${gameId}`,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
  );
}

// 즐겨찾기 추가
export function usePostFavorite() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { gameId: string }) =>
      fetchDataServer({
        url: "/game/favorite",
        method: "post",
        data,
      }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([CommonGameKeys.ISFAVORITE]);
          queryClient.invalidateQueries([BookmarksKeys.FAVORITES]);
        }
      },
    },
  );
}

// 즐겨찾기 삭제
export function useDeleteFavorite() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { gameId: string }) =>
      fetchDataServer({
        url: "/game/favorite",
        method: "delete",
        data,
      }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([CommonGameKeys.ISFAVORITE]);
          queryClient.invalidateQueries([BookmarksKeys.FAVORITES]);
        }
      },
    },
  );
}
