import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import fetchDataServer from "@/utils/fetchServer";

import {
  AffiliateKeys,
  BonusKeys,
  ChatKeys,
  UserKeys,
} from "@/config/queryKey";
import {
  AffiliateClaimData,
  AirdropLeaderboardDataType,
  BonusClaimCountData,
  BonusHistoryDataType,
  BonusStatisticsDataType,
  BonusStatisticsDataVer2Type,
  DepositReferDataType,
} from "@/types/bonus";
import { getCookie } from "@/utils";
import {
  AffiliateMemberDataType,
  AffiliateStatisticsDataType,
} from "@/types/affiliate";
import { NoticeDataListType } from "@/types/chat";

export function useGetBonusStatisticsVer2(token: string | null) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<BonusStatisticsDataVer2Type>(
    [BonusKeys.STATISTICSV2, token],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/bonus/statistics/v2`,
        });
      } else {
        return Promise.resolve(null);
      }
    },
  );
}

export function useGetBonusHistory(
  data: { page: number },
  token: string | null,
) {
  //   return useQuery<{ result: userCommonGnbDataType }>(

  return useQuery<BonusHistoryDataType>(
    [BonusKeys.HISTORY, data, token],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/bonus/history`,
          data,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve(null);
      }
    },
    {
      keepPreviousData: false,
    },
  );
}

export function useGetBonusClaim() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: {
      bonusType:
        | "RAKEBACK"
        | "LEVELUP"
        | "TIERUP"
        | "WEEKLY"
        | "MONTHLY"
        | "SP_EVT_WEEKLY_PAYBACK"
        | "SP_EVT_LUCKY_POUCH";
    }) => fetchDataServer({ url: "/bonus/claim", method: "get", data: data }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([BonusKeys.STATISTICS]);
          queryClient.invalidateQueries([BonusKeys.STATISTICSV2]);
          queryClient.invalidateQueries([BonusKeys.COUNT]);
        }
      },
    },
  );
}

export function useGetAffiliateStatistics(token: string | null) {
  //   return useQuery<{ result: userCommonGnbDataType }>(

  return useQuery<AffiliateStatisticsDataType>(
    [AffiliateKeys.STATISTICS, token],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/bonus/affiliate/statistics`,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve(null);
      }
    },
  );
}

export function usePostDepositAccept() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { status: -1 | 2 }) =>
      fetchDataServer({ url: "/bonus/deposit/accept", method: "post", data }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([UserKeys.COMMON]);
          queryClient.invalidateQueries([BonusKeys.STATISTICSV2]);
        }
      },
    },
  );
}

export function useGetAffiliateMembers(
  data: { page: number; filter: string },
  token: string | null,
) {
  return useQuery<AffiliateMemberDataType>(
    [AffiliateKeys.MEMBER, data, token],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/bonus/affiliate/members`,
          data,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve(null);
      }
    },
  );
}

export function usePostBonusRedeem() {
  return useMutation((data: { code: string }) =>
    fetchDataServer({ url: "/bonus/redeem", method: "post", data }),
  );
}

export function useGetBonusLeaderBoard() {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<AirdropLeaderboardDataType>([BonusKeys.LEADERBOARD], () => {
    return fetchDataServer({
      url: `/bonus/airdrop/leaderboard`,
    });
  });
}

export function useGetBonusDepositRefer() {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<DepositReferDataType>([BonusKeys.DEPOSITREFER], () => {
    return fetchDataServer({
      url: `/bonus/deposit/refer`,
    });
  });
}

export function usePostBonusSpinDo() {
  const data = {};
  return useMutation(() =>
    fetchDataServer({ url: "/bonus/spin/do", method: "post", data }),
  );
}
export function useGetBonusClaimCount(token: string | null) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<BonusClaimCountData>([BonusKeys.COUNT, token], () => {
    if (token) {
      return fetchDataServer({ url: `/bonus/claim/count` });
    } else {
      return Promise.resolve({ data: null });
    }
  });
}

export function useGetAffiliateClaim() {
  const queryClient = useQueryClient();
  return useMutation(
    () => fetchDataServer({ url: `/bonus/affiliate/claim`, method: "get" }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([AffiliateKeys.STATISTICS]);
        }
      },
    },
  );
}
