import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MainKeys, UserKeys } from "@/config/queryKey";
import { UserAccountSettingDataType, userUserProfileType } from "@/types/user";
import fetchDataServer from "@/utils/fetchServer";

// import { UserDataInterface } from "@/types/user";
// import axiosFetch from "@/utils/fetchDataServer";
import { getCookie } from "../utils/index";

export function useGetUserProfile(
  token: null | string,
  userIdx?: null | number,
) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<userUserProfileType>(
    [UserKeys.PROFILE, userIdx, token],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/user/profile${userIdx ? "/" + userIdx : ""}`,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
  );
}

// <파라미터>

// - avatarIdx(number): 아바타 index값(0 ~ 9)
// - nickName(string): 닉네임(min 3 ~ max 12)
// - isHidden(number): 0 or 1(1 -> hidden)
// : 위 파라미터는 모두 선택값입니다. 해당 값이 없을 경우 업데이트 되지 않습니다.
export function usePutUser() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: { avatarIdx: number; nickName?: string | null; isHidden: 0 | 1 }) =>
      fetchDataServer({ url: "/user", method: "put", data }),
    {
      onSuccess() {
        // queryClient.invalidateQueries([DerbyKeys.ALL]);
        queryClient.invalidateQueries([UserKeys.COMMON]);
        queryClient.invalidateQueries([UserKeys.PROFILE]);
      },
    },
  );
}

export function useGetUserAccountSetting(token: string | null) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<UserAccountSettingDataType>(
    [UserKeys.ACCOUNTSETTING, token],
    () => {
      if (token) {
        return fetchDataServer({
          url: `/user/accountSetting`,
        });
      } else {
        // token이 null이면 아무 데이터도 가져오지 않도록 처리
        return Promise.resolve({ data: null });
      }
    },
  );
}

export function useGetUserLogout() {
  return useMutation(() =>
    fetchDataServer({ url: "/user/logout", method: "get" }),
  );
}

export function useGetUserSignIn() {
  return useMutation((data: { accessToken: string; telegram?: boolean }) =>
    fetchDataServer({
      url: data.telegram ? "/user/telegram/signin" : "/user/signin",
      method: "post",
      data: data.telegram
        ? { hash: data.accessToken }
        : {
            accessToken: data.accessToken,
          },
    }),
  );
}

export function useGetUserGeneralSignIn() {
  return useMutation((data: { email: string; password: string }) =>
    fetchDataServer({ url: "/user/general/signin", method: "post", data }),
  );
}

export function useGetUserSignUp() {
  return useMutation(
    (data: {
      email?: string;
      username?: string;
      password?: string;
      accessToken?: string;
      isAgreeTosAndPp: 1 | 0;
      localeCode: string;
      referralCode?: string | null;
      tracking?: string | null;
      telegram?: boolean;
      hash?: string;
    }) =>
      fetchDataServer({
        url: data.email
          ? "/user/general/signup"
          : data.telegram
            ? "/user/telegram/signup"
            : "/user/signup",
        method: "post",
        data,
      }),
  );
}
// "email": "string",            -> 이메일
// "username": "string",         -> username(닉네임)
// "password": "string",         -> 비밀번호
// "localeCode": "string",       -> 국가코드
// "referralCode": "string",     -> 추천인코드
// "isAgreeTosAndPp": 0,         -> 약관동의여부
// "tracking": "string"          -> 트래킹 코드
// /user/general/signup

export function usePostUserKyc1() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: FormData) =>
      fetchDataServer({
        url: "/user/kyc/1",
        method: "post",
        data,
        isMultipart: true,
        // options: "multipart/form-data",
      }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([UserKeys.ACCOUNTSETTING]);
        }
      },
    },
  );
}

export function usePostUserKyc2() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: FormData) =>
      fetchDataServer({
        url: "/user/kyc/2",
        method: "post",
        data,
        isMultipart: true,
        // options: "multipart/form-data",
      }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([UserKeys.ACCOUNTSETTING]);
        }
      },
    },
  );
}

export function usePostUserKyc3() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: FormData) =>
      fetchDataServer({
        url: "/user/kyc/3",
        method: "post",
        data,
        isMultipart: true,
        // options: "multipart/form-data",
      }),
    {
      onSuccess(data) {
        if (data.code === 0) {
          queryClient.invalidateQueries([UserKeys.ACCOUNTSETTING]);
        }
      },
    },
  );
}

export function usePostUserExclusion() {
  return useMutation((data: { period: number }) =>
    fetchDataServer({ url: "/user/exclusion", method: "post", data }),
  );
}

export function usePutUserSession() {
  return useMutation(() =>
    fetchDataServer({ url: "/user/secession", method: "delete" }),
  );
}

export function usePostGeneralSignupCheck() {
  return useMutation(
    //   성공시 200
    // 실패시
    // -10002 : 이메일 유효성 검사 실패
    // -10004 : 이메일 중복
    // -10037 : username 중복
    // -10036 : 비밀번호 유효성 검사 실패
    (data: { email: string; username: string; password: string }) =>
      fetchDataServer({
        url: "/user/general/signup/check",
        method: "post",
        data,
      }),
  );
}
export function useGetGeneralResetPasswordMail() {
  return useMutation((data: { email: string }) =>
    fetchDataServer({
      url: "/user/general/reset-password-mail",
      method: "get",
      data,
    }),
  );
}

export function usePostGeneralResetPassword() {
  return useMutation(
    (data: { token: string; password: string; confirmPassword: string }) =>
      fetchDataServer({
        url: "/user/general/reset/password",
        method: "post",
        data,
      }),
  );
}
