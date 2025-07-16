"use client";

import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { auth } from "@/lib/firebase";
import { useGetUserSignIn } from "@/querys/user";
import { useCommonStore } from "@/stores/useCommon";
import { useModalStore } from "@/stores/useModal";
import { useUserStore } from "@/stores/useUser";
import { CookieOption, customConsole, getCookie } from "@/utils";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useAuthState } from "react-firebase-hooks/auth";

export default function OneTab() {
  const [user, loading] = useAuthState(auth);
  const { login } = useUserStore();
  const [isInit, setIsInit] = useState<boolean>(false);
  const router = useRouter();
  const [, setCookie] = useCookies();
  const { openModal, type } = useModalHook();
  const { setGoogleAccessToken } = useModalStore();
  const { mutate: mutateSignIn } = useGetUserSignIn();
  const { setWholeLoadingState } = useCommonStore();
  const { showErrorMessage } = useCommonHook();

  const signIn = async (accessToken: string) => {
    mutateSignIn(
      { accessToken },
      {
        onSuccess(data, variables, context) {
          setWholeLoadingState(false);
          if (data.code === 0) {
            login(data.result);
            setCookie("token", data.result, CookieOption);
            return false;
          }
          if (data.code === -10001) {
            setGoogleAccessToken(accessToken);
            openModal({
              type: "getstarted",
            });
            return false;
          }

          showErrorMessage(data.code);
        },
      },
    );
  };

  const initializeGSI = useCallback(() => {
    setIsInit(true);
    // the authentication handler function
    const authHandler = async (response: any) => {
      setWholeLoadingState(true);
      const idToken = response.credential;
      const credential = GoogleAuthProvider.credential(idToken);
      try {
        const userCredential = await signInWithCredential(auth, credential);
        const token = (await userCredential.user.getIdTokenResult()).token;
        signIn(token);
      } catch (error) {
        // console.error(error);
      }
    };

    // @ts-ignore:next-line
    window?.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      callback: authHandler,
    });
    // @ts-ignore:next-line
    window?.google?.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
        // @ts-ignore:next-line
        window?.google?.accounts.id.prompt();
      }
    });
  }, []);

  useEffect(() => {
    if (loading || isInit || type === "getstarted") return;
    const token = getCookie("token");
    if (token) return;

    // google login은 되었으나 우리 token이 없는 경우
    if (user) {
      auth.signOut();
      return;
    }
    // using a timer to avoid the window?.google being undefined
    const timer = setTimeout(() => {
      initializeGSI();
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, loading, type, initializeGSI]);

  return <Script src="https://accounts.google.com/gsi/client" />;
}
