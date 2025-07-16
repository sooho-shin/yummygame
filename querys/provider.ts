import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { ProviderKeys } from "@/config/queryKey";
import {
  ProviderData,
  ThirdPartyCountData,
  ThirdPartyDataType,
  ThirdPartyDetailData,
  ThirdPartyMyData,
  ThirdPartyParamsType,
} from "@/types/provider";
import fetchDataServer from "@/utils/fetchServer";

// https://velog.io/@vanillovin/react-query-infinite-scroll
export function usePostThirdParty(data: ThirdPartyParamsType) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useInfiniteQuery<ThirdPartyDataType>(
    [ProviderKeys.THIRDPARTY, data],
    ({ pageParam = 1 }) => {
      return fetchDataServer({
        url: `/soft-swiss`,
        method: "post",
        data: { ...data, page: pageParam.toString() },
        // data: { ...data },
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.pagination.page < lastPage.pagination.totalPage
          ? nextPage
          : undefined;
      },
      keepPreviousData: false,
    },

    // {
    //   keepPreviousData: true,
    // },
  );
}

export function usePostThirdPartyTemp(data: ThirdPartyParamsType) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useInfiniteQuery<ThirdPartyDataType>(
    [ProviderKeys.THIRDPARTY, data],
    ({ pageParam = 1 }) => {
      return fetchDataServer({
        url: `/soft-swiss`,
        method: "post",
        data: { ...data, page: pageParam.toString() },
        // data: { ...data },
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.pagination.page < lastPage.pagination.totalPage
          ? nextPage
          : undefined;
      },
      keepPreviousData: true,
    },

    // {
    //   keepPreviousData: true,
    // },
  );
}

export function usePostThirdPartySearch() {
  return useMutation(
    (data: {
      search: string;
      providerCode?: number;
      producerName?: string;
      categoryCode?: string;
    }) =>
      fetchDataServer({
        url: `/soft-swiss/search${data.providerCode ? "/provider" : ""}`,
        method: "post",
        data,
      }),
  );
}

export function usePostThirdPartySearchTemp() {
  return useMutation(
    (data: {
      search: string;
      providerCode?: number;
      producerName?: string;
      categoryCode?: string;
    }) =>
      fetchDataServer({
        url: `/soft-swiss/search${data.providerCode ? "/provider" : ""}`,
        method: "post",
        data,
      }),
  );
}

export function useGetThirdPartyDetail(data: {
  systemCode: string | null;
  pageCode: string | null;
}) {
  return useQuery<ThirdPartyDetailData>([ProviderKeys.DETAIL, data], () => {
    return fetchDataServer({
      url: `/soft-swiss/detail`,
      data,
    });
  });
}

export function useGetThirdPartyDetailTemp(data: {
  systemCode: string | null;
  pageCode: string | null;
}) {
  return useQuery<ThirdPartyDetailData>([ProviderKeys.DETAIL, data], () => {
    return fetchDataServer({
      url: `/soft-swiss/detail`,
      data,
    });
  });
}

export function usePostThirdPartyStart() {
  return useMutation(
    (data: {
      currency: string;
      assetType: string;
      system: string;
      page: string;
      demo: "1" | "0"; // 1 이 데모
      isMobile: "1" | "0";
      lang: string;
    }) => fetchDataServer({ url: "/soft-swiss/start", method: "post", data }),
  );
}

export function usePostThirdPartyStartTemp() {
  return useMutation(
    (data: {
      currency: string;
      assetType: string;
      system: string;
      page: string;
      demo: "1" | "0"; // 1 이 데모
      isMobile: "1" | "0";
      lang: string;
    }) => fetchDataServer({ url: "/soft-swiss/start", method: "post", data }),
  );
}

export function useGetThirdPartyMy(
  gameCode: string | undefined,
  token: string | null,
) {
  return useQuery<ThirdPartyMyData>(
    [ProviderKeys.DETAIL, gameCode, token],
    () => {
      if (gameCode && token) {
        return fetchDataServer({
          url: `/soft-swiss/my`,
          data: { gameCode },
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
  );
}

export function useGetThirdPartyMyTemp(
  gameCode: string | undefined,
  token: string | null,
) {
  return useQuery<ThirdPartyMyData>(
    [ProviderKeys.DETAIL, gameCode, token],
    () => {
      if (gameCode && token) {
        return fetchDataServer({
          url: `/soft-swiss/my`,
          data: { gameCode },
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
  );
}

export function useGetThirdPartyCount(data: { providerCode: string }) {
  return useQuery<ThirdPartyCountData>([ProviderKeys.COUNT, data], () => {
    return fetchDataServer({
      url: `/soft-swiss/category/count`,
      data,
    });
  });
}

export function useGetProviders() {
  return useQuery<ProviderData>([ProviderKeys.PROVIDERS], () => {
    return fetchDataServer({
      url: `/soft-swiss/providers`,
    });
  });
}
export function usePostSports() {
  return useMutation((data: { lang: string; assetType: string }) =>
    fetchDataServer({ url: "/betby/start", method: "post", data }),
  );
}
