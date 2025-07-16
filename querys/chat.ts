import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";

import fetchDataServer from "@/utils/fetchServer";

import {
  ChatDataListType,
  ChatParamType,
  DirectMessageType,
  NoticeDataListType,
} from "@/types/chat";
import { ChatKeys } from "@/config/queryKey";

export function usePostChat(): UseMutationResult<
  { code: number },
  Error,
  ChatParamType
> {
  return useMutation((data: ChatParamType) =>
    fetchDataServer({ url: "/chat", method: "post", data }),
  );
}
export function useGetChat() {
  return useQuery<ChatDataListType>([ChatKeys.CHAT], () => {
    return fetchDataServer({
      url: `/chat`,
    });
  });
}

export function useGetNotice() {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<NoticeDataListType>([ChatKeys.NOTICE], () => {
    return fetchDataServer({
      url: `/chat/notification`,
    });
  });
}

export function useGetDirectMessage(token: string | null) {
  return useQuery<DirectMessageType>([ChatKeys.DIRECTMASSAGE, token], () => {
    if (token) {
      return fetchDataServer({
        url: `/chat/direct/message`,
      });
    } else {
      return Promise.resolve({ data: null });
    }
  });
}

export function usePostDirectMassage() {
  return useMutation((data: { messageIdx: string }) =>
    fetchDataServer({ url: "/chat/direct/message", method: "post", data }),
  );
}

export function useDeleteDirectMassage() {
  return useMutation((data: { messageIdx: string }) =>
    fetchDataServer({ url: "/chat/direct/message", method: "delete", data }),
  );
}
