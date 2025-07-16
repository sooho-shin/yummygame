import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { BookmarksKeys } from "@/config/queryKey";

import { getCookie } from "../utils/index";
import fetchDataServer from "@/utils/fetchServer";
import { BookmarkDataType } from "@/types/bookmark";

export function useGetBookmark(
  type: "favorite" | "recent",
  token: string | null,
) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<BookmarkDataType>(
    [BookmarksKeys.FAVORITES, type, token],
    () => {
      return fetchDataServer({
        url: `/game/${type}`,
      });
    },
  );
}
