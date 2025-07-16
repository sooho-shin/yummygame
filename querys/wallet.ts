import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { WalletKeys } from "@/config/queryKey";

import fetchDataServer from "@/utils/fetchServer";
import { getCookie } from "@/utils";
import {
  WalletReferenceDataType,
  WalletTransactionsDataType,
  WalletTransactionsParamsType,
} from "@/types/wallet";

export function useGetWalletReference(token: string | null) {
  return useQuery<{ result: WalletReferenceDataType }>(
    [WalletKeys.REFERENCE],
    () => {
      if (token) {
        return fetchDataServer({ url: "/user/wallet/reference" });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
    {
      keepPreviousData: true,
    },
  );
}

export function useGetWalletTransactions(
  data: WalletTransactionsParamsType,
  token: string | null,
) {
  return useQuery<WalletTransactionsDataType>(
    [WalletKeys.TRANSACTIONS, data, token],
    () => {
      if (token) {
        return fetchDataServer({ url: "/user/wallet/transactions", data });
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

export function usePostWalletWithdrawal() {
  return useMutation(
    (data: {
      withdrawalAddress: string;
      chainNetwork: string;
      destinationTag?: string;
      amount: string;
      coinType: string;
      passcode?: string;
    }) =>
      fetchDataServer({ url: "/user/wallet/withdrawal", method: "post", data }),
  );
}

export function usePostWalletSwap() {
  return useMutation(
    (data: { fromCoinType: string; fromAmount: string; toCoinType: string }) =>
      fetchDataServer({ url: "/user/wallet/swap", method: "post", data }),
  );
}

export function usePostWalletCreate() {
  return useMutation((data: { coinType: string; chainId?: string }) =>
    fetchDataServer({ url: "/user/wallet/create", method: "post", data }),
  );
}

export function usePostRolloverForfeit() {
  return useMutation(() =>
    fetchDataServer({
      url: "/bonus/rollover/forfeit",
      method: "post",
      data: {},
    }),
  );
}

// WalletKeys.REFERENCE
