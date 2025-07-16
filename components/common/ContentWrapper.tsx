"use client";

import useCommonHook from "@/hooks/useCommonHook";
import { useCommonStore } from "@/stores/useCommon";
import classNames from "classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import ReactGA from "react-ga4";
import { useMeasure } from "react-use";
import CommonLoading from "./Loading";
import styles from "./styles/content.module.scss";
import { ToastContainer } from "react-toastify";
import { useCookies, Cookies } from "react-cookie";
import { useDictionary } from "@/context/DictionaryContext";
import { CookieOption } from "@/utils";
import useModalHook from "@/hooks/useModalHook";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NextTopLoader from "nextjs-toploader";
import { signOut } from "@/lib/firebase";
import { useGetUserLogout, useGetUserSignIn } from "@/querys/user";
import { useUserStore } from "@/stores/useUser";
import { useGetCommon } from "@/querys/common";
import { useModalStore } from "@/stores/useModal";

export const ContentWrapper = ({ children }: { children: ReactNode }) => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [initialized, setInitialized] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const telegramParam = searchParams.get("tg");
  const passwordResetParam = searchParams.get("pwd-reset-token");
  const [cookies, setCookie, removeCookie] = useCookies();
  const t = useDictionary();
  const { openModal } = useModalHook();

  const cookieArray = [
    "theme",
    "isCheckCookie",
    "tracking",
    "fiat",
    "coin",
    "lang",
    "newChat",
    "newNotice",
    "disableSound",
    "currency",
    "token",
    "displayFiat",
    "disableMusic",
    "multiply",
    "affiliateCode",
  ];

  const { mutate } = useGetUserLogout();
  const { logout, token } = useUserStore();
  const { refetch } = useGetCommon(token);
  const logOut = async () => {
    mutate(undefined, {
      onSuccess(data) {
        if (data.code === 0) {
          logout();
          refetch();
          removeCookie("token", CookieOption);
        }
      },
    });
  };

  useEffect(() => {
    if (telegramParam && token) {
      removeCookie("tracking", CookieOption);
      setCookie("tracking", telegramParam, CookieOption);

      logOut();
    }
  }, [telegramParam]);

  const { mutate: mutateSignIn } = useGetUserSignIn();
  const {
    setMedia,
    isShowChat,
    isShowNotice,
    swipeState,
    media,
    wholeLoadingState,
    setWholeLoadingState,
  } = useCommonStore();
  const { login } = useUserStore();
  const { setGoogleAccessToken } = useModalStore();
  const { showErrorMessage } = useCommonHook();
  const signIn = async (accessToken: string) => {
    mutateSignIn(
      { accessToken, telegram: true },
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

  useEffect(() => {
    if (telegramParam && token) {
      removeCookie("tracking", CookieOption);
      setCookie("tracking", telegramParam, CookieOption);

      logOut();
    }
  }, [telegramParam]);
  useEffect(() => {
    if (!token && telegramParam && telegramParam === "telegram") {
      let pollingInterval: NodeJS.Timer | null = null;

      const checkTelegramReady = () => {
        const tg = window?.Telegram?.WebApp;

        if (tg) {
          tg.ready();
          tg.expand();

          if (tg.initData) {
            // tg.initData가 확인되면 폴링 중지
            if (pollingInterval) clearInterval(pollingInterval);
            signIn(tg.initData);
          }
        }
      };

      // 100ms마다 checkTelegramReady 함수를 실행
      pollingInterval = setInterval(checkTelegramReady, 100);

      // 컴포넌트 언마운트 시 폴링 중지
      return () => {
        if (pollingInterval) clearInterval(pollingInterval);
      };
    }
  }, [token]);

  useEffect(() => {
    if (passwordResetParam && hydrated) {
      openModal({
        type: "resetPassword",
        props: {
          passwordResetParam,
        },
      });
    }
  }, [passwordResetParam, hydrated]);
  //
  // useEffect(() => {
  //   setTimeout(() => {
  //     openModal({ type: "wallet" });
  //   }, 600);
  //   setTimeout(() => {
  //     openModal({ type: "redeem" });
  //   }, 600);
  // }, []);

  useEffect(() => {
    for (const argument of cookieArray) {
      const value = cookies[argument];

      if (value && process.env.NEXT_PUBLIC_MODE === "production") {
        removeCookie(argument);
        setCookie(argument, value, CookieOption);
      }
    }
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && hydrated) {
      ReactGA.initialize("G-NXCP323FSR", {
        gaOptions: {
          debug_mode: true,
        },
        gtagOptions: {
          debug_mode: true,
        },
      });

      setInitialized(true);
    }
  }, [process.env.NODE_ENV, hydrated]);

  // location 변경 감지시 pageview 이벤트 전송
  useEffect(() => {
    if (initialized) {
      ReactGA.send({
        hitType: "pageview",
        page: pathname,
        title: "Page Change",
      });
    }
  }, [initialized, pathname]);

  const { isTopBanner, checkMedia } = useCommonHook();

  const [scrollRef, { width }] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    if (width) {
      if (width <= 1064) {
        setMedia(["tablet"]);
      } else {
        setMedia(["desktop"]);
      }
    }
  }, [width]);

  const [isLoadingState, setIsLoadingState] = useState(true);

  useEffect(() => {
    if (!hydrated || !media || swipeState === null || wholeLoadingState) {
      setIsLoadingState(true);
    } else {
      setTimeout(() => {
        setIsLoadingState(false);
      }, 300);
    }
  }, [hydrated, media, swipeState, wholeLoadingState]);

  // useEffect(() => {
  //   console.log(pathname);
  //   if (typeof window !== "undefined") {
  //     const currentUrl = window.location.href;
  //     const referrer = document.referrer;
  //
  //     // console.log(
  //     //   currentUrl === referrer ? "같음" : "다름",
  //     //   ",",
  //     //   currentUrl,
  //     //   "    ,    ",
  //     //   referrer,
  //     // );
  //
  //     // referrer가 동일하고 이전 기록이 존재할 때만 실행
  //     if (currentUrl === referrer && window.history.state) {
  //       const newState = { ...window.history.state, isDuplicate: true };
  //
  //       // 현재 state에 플래그 추가 후 replace
  //       window.history.replaceState(newState, "", currentUrl);
  //     }
  //   }
  // }, [pathname]);
  //
  // useEffect(() => {
  //   const current = new URLSearchParams(Array.from(searchParams.entries()));
  //   console.log("쿼리스트링", current.toString());
  // }, [searchParams]);

  // useEffect(() => {
  //   console.log("???");
  //   setTimeout(
  //     () =>
  //       openModal({
  //         type: "claimBonus",
  //         props: {
  //           claimType: "RAKEBACK",
  //           claimedJel: "99819981",
  //         },
  //       }),
  //     1000,
  //   );
  // }, [hydrated]);

  return (
    <>
      {!(pathname.includes("sports") && searchParams) && (
        <NextTopLoader height={4} zIndex={9999} color={"#db2d59"} />
      )}

      {isLoadingState && <CommonLoading />}
      {/*<ProgressBar*/}
      {/*  height="40px"*/}
      {/*  color="red"*/}
      {/*  options={{ showSpinner: false }}*/}
      {/*  shallowRouting*/}
      {/*/>*/}
      <div
        className={classNames(styles.content, {
          [styles.main]: isTopBanner,
          [styles.swipe]: swipeState,
          [styles.isShowNoticeOrChat]: isShowChat || isShowNotice,
        })}
        ref={scrollRef}
        id="ContainerElementID"
      >
        {/*<button*/}
        {/*  type={"button"}*/}
        {/*  style={{ width: "100%", height: "40px", backgroundColor: "red" }}*/}
        {/*  onClick={() => {*/}
        {/*    openModal({*/}
        {/*      type: "claimBonus",*/}
        {/*      props: {*/}
        {/*        claimType: "RAKEBACK",*/}
        {/*        claimedJel: "99819981",*/}
        {/*      },*/}
        {/*    });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  TEST*/}
        {/*</button>*/}
        {children}
        <ToastContainer
          autoClose={2000}
          position={
            checkMedia === "mobile" && hydrated ? "bottom-center" : "top-right"
          }
        />
      </div>
      {process.env.NEXT_PUBLIC_MODE !== "production" && (
        <span
          style={{
            position: "fixed",
            left: "10px",
            bottom: "10px",
            zIndex: 9999,
            color: "red",
            backgroundColor: "white",
            padding: "2px 4px",
            opacity: "0.6",
            fontSize: "12px",
          }}
        >
          {process.env.NEXT_PUBLIC_MODE === "development" ? "개발" : "테스트"}
          모드 {process.env.NEXT_PUBLIC_MODE}
        </span>
      )}
      {/*{process.env.NEXT_PUBLIC_MODE === "production" && hydrated && (*/}
      {/*  <button*/}
      {/*    type={"button"}*/}
      {/*    id={"customFreshdeskButton"}*/}
      {/*    className={styles["freshdesk-btn"]}*/}
      {/*    onClick={() => {*/}
      {/*      if (window.fcWidget) {*/}
      {/*        window.fcWidget.open();*/}
      {/*      }*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <span>{t("common_22")}</span>*/}
      {/*  </button>*/}
      {/*)}*/}
    </>
  );
};
