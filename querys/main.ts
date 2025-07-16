import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

import { MainKeys, UserKeys } from "@/config/queryKey";
import { getCookie } from "@/utils";
import { userCommonGnbDataType } from "@/types/user";
import fetchDataServer from "@/utils/fetchServer";
import {
  MainBannerDataType,
  MainThirdPartyDataType,
  MainTopProfitDataType,
} from "@/types/main";
// import { UserDataInterface } from "@/types/user";
// import axiosFetch from "@/utils/fetchDataServer";

export function useGetMainTopProfit() {
  return useQuery<MainTopProfitDataType>([MainKeys.TOPPROFIT], () =>
    fetchDataServer({ url: "/main/topProfit" }),
  );
}

export function useGetMainThirdParty() {
  return useQuery<MainThirdPartyDataType>([MainKeys.THIRDPARTY], () =>
    fetchDataServer({ url: "/soft-swiss/main" }),
  );
}

export function useGetMainBanner(data: { languageCode: string }) {
  return useQuery<MainBannerDataType>([MainKeys.BANNER, data], () =>
    fetchDataServer({ url: "/main/banner-v2", data }),
  );
}
