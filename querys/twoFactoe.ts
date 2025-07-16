import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchDataServer from "@/utils/fetchServer";
import { TwoFactorKeys, UserKeys } from "@/config/queryKey";
import { TwoFactorAuthDataType } from "@/types/twoFactor";

export function useGetTwoFactorAuth() {
  return useQuery<TwoFactorAuthDataType>([TwoFactorKeys.AUTH], () =>
    fetchDataServer({ url: "/user/two-factor-auth" }),
  );
}

export function usePostTwoFactorAuth() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { passcode: string }) =>
      fetchDataServer({ url: "/user/two-factor-auth", method: "post", data }),
    {
      onSuccess() {
        queryClient.invalidateQueries([UserKeys.ACCOUNTSETTING]);
      },
    },
  );
}

export function useDeleteTwoFactorAuth() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { passcode: string }) =>
      fetchDataServer({ url: "/user/two-factor-auth", method: "delete", data }),
    {
      onSuccess() {
        queryClient.invalidateQueries([UserKeys.ACCOUNTSETTING]);
      },
    },
  );
}
