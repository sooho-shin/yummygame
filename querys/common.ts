import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { CommonKeys, UserKeys } from "@/config/queryKey";
import { getCookie } from "@/utils";
import { userCommonGnbDataType } from "@/types/user";
import fetchDataServer from "@/utils/fetchServer";
import { AssetReferType } from "@/types/common";
// import { UserDataInterface } from "@/types/user";
// import axiosFetch from "@/utils/fetchDataServer";

export function useGetCommon(token: string | null) {
  return useQuery<{ result: userCommonGnbDataType }>(
    [UserKeys.COMMON, token],
    () => {
      if (token) {
        return fetchDataServer({ url: "/common/gnb" });
      } else {
        return Promise.resolve({ data: null });
      }
    },
  );
}

export function useGetCryptoUsd() {
  return useQuery([CommonKeys.CRYPTOUSD], () =>
    fetchDataServer({ url: "/common/crypto/usd" }),
  );
}

export function useGetAssetRefer() {
  return useQuery<AssetReferType>([CommonKeys.ASSETREFER], () =>
    fetchDataServer({ url: "/common/asset/refer" }),
  );
}
