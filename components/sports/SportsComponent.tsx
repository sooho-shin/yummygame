"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePostSports } from "@/querys/provider";
import { useUserStore } from "@/stores/useUser";
import { useAssetStore } from "@/stores/useAsset";
import { useCookies } from "react-cookie";
import { useCommonStore } from "@/stores/useCommon";
import useModalHook from "@/hooks/useModalHook";
import CommonEmptyData from "@/components/common/EmptyData";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./styles/styles_sports.css";
import { CookieOption } from "@/utils";
import fetchDataServer from "@/utils/fetchServer";
import { useSocketStore } from "@/stores/useSocket";

const SportsComponent = () => {
  const [hydrated, setHydrated] = useState(false);

  const searchParams = useSearchParams();
  useEffect(() => {
    setHydrated(true);
    return () => {
      if (bt.current) {
        bt.current.kill();
        bt.current = null;
      }
    };
  }, []);
  const [isScript, setIsScript] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{
    brandId: string;
    token: string;
    lang: string;
  } | null>(null);
  const { token } = useUserStore();
  const { coin, setCoin } = useAssetStore();
  const { mutate } = usePostSports();
  const [cookies, setCookie, removeCookie] = useCookies();
  const { openModal } = useModalHook();
  const t = useDictionary();
  const { checkMedia, showToast } = useCommonHook();
  const bt = useRef<any>(null);
  const pathname = usePathname();

  const { cacheStreamSocket } = useSocketStore();

  /**
   * hon일경우 usdt로 변경해서 화면 진입할 수 있도록.
   */
  useEffect(() => {
    if (!coin || coin?.toLowerCase() === "hon") {
      setCoin("usdt");
    }
  }, [coin]);

  /**
   * sessionInfo 정보가 있는 상태에서 토큰 상태가 바뀌면 다시 로드
   */
  useEffect(() => {
    if (!sessionInfo) return;
    setSessionInfo(null);
    mutationSports();
  }, [token]);

  useEffect(() => {}, [token]);

  useEffect(() => {
    if (!cacheStreamSocket) return () => false;

    if (!cacheStreamSocket.connected) {
      cacheStreamSocket.connect();
    }

    cacheStreamSocket.on("provider.message", (socket: any) => {
      showToast(socket.message);
    });

    return () => {
      cacheStreamSocket.off("provider.message");
    };
  }, [cacheStreamSocket]);

  useEffect(() => {
    const handlePopState = () => {
      // cookie 설정
      const timestamp = Date.now();
      document.cookie = `navigationtype=popstate-${timestamp}; path=/`;
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const checkScriptLoaded = setInterval(() => {
      if (window.BTRenderer) {
        clearInterval(checkScriptLoaded);
        setIsScript(true);
      }
    }, 100);

    return () => clearInterval(checkScriptLoaded);
  }, []);

  useEffect(() => {
    // setWholeLoadingState(true);
    if (
      coin.toLowerCase() === "hon" ||
      coin.toLowerCase() === "yyg" ||
      !hydrated ||
      !isScript
    ) {
      return;
    }

    mutationSports();
  }, [coin, hydrated, cookies.lang, isScript]);

  // const [v, setV] = useState(1);
  const mutationSports = () => {
    mutate(
      { assetType: coin.toLocaleUpperCase(), lang: cookies.lang },
      {
        onSuccess: data => {
          setSessionInfo({
            brandId: data.result.brandId,
            lang: data.result.lang,
            token: data.result.token,
          });
        },
      },
    );
  };

  useEffect(() => {
    if (sessionInfo) {
      initBt(coin, sessionInfo.brandId, sessionInfo.token, sessionInfo.lang);
    }
  }, [sessionInfo]);

  useEffect(() => {
    const updateWidgetVisibility = () => {
      if (window.fcWidget) {
        window.fcWidget.hide();
      }
    };

    const checkWidgetLoaded = () => {
      if (typeof window !== "undefined" && window.fcWidget) {
        // 위젯이 로드되었으면 상태 업데이트
        updateWidgetVisibility();

        // window.fcWidget.on("widget:loaded", () => {
        //   window.fcWidget.on("widget:close", onWidgetClose);
        // });
      } else {
        // 위젯이 아직 로드되지 않았으면 재시도
        setTimeout(checkWidgetLoaded, 100);
      }
    };

    checkWidgetLoaded(); // 위젯 로드 상태 확인

    return () => {
      if (
        typeof window !== "undefined" &&
        window.fcWidget &&
        window.fcWidget.off
      ) {
        window.fcWidget.show();
        window.fcWidget.off("widget:loaded", updateWidgetVisibility);
      }
    };
  }, [pathname]);

  const initBt = useCallback((c: string, b: string, tk: string, l: string) => {
    if (bt.current) {
      bt.current.kill();
      bt.current = null;
    }
    bt.current = new window.BTRenderer();
    bt.current.initialize({
      brand_id: b,
      token: tk,
      onTokenExpired: async function () {
        const data = await fetchDataServer({
          url: "/betby/start",
          method: "post",
          data: {
            assetType: c.toUpperCase(),
            lang: l || "EN",
          },
        });
        return data.result.token;
      },
      themeName: "yummygame",
      lang: l || "EN",
      target: document.getElementById("betby"),
      betSlipOffsetBottom: checkMedia === "mobile" ? 62 : 0,
      betslipZIndex: checkMedia === "mobile" ? 999 : 4600,
      betSlipOffsetTop: 64,
      stickyTop: 64,
      onRecharge: function () {
        openModal({ type: "wallet" });
      }, // betSlipOffsetBottom: 100,
      onLogin: function () {
        if (
          coin.toLocaleLowerCase() === "hon" ||
          coin.toLowerCase() === "yyg"
        ) {
          openModal({
            type: "alert",
            alertData: {
              title: "알림",
              children: (
                <span style={{ color: "#e3e3e5" }}>{t("common_53")}</span>
              ),
            },
          });
        } else {
          openModal({ type: "getstarted" });
        }
      },
      onRegister: function () {
        if (
          coin.toLocaleLowerCase() === "hon" ||
          coin.toLowerCase() === "yyg"
        ) {
          openModal({
            type: "alert",
            alertData: {
              title: t("common_54"),
              children: (
                <span style={{ color: "#e3e3e5" }}>{t("common_53")}</span>
              ),
            },
          });
        } else {
          openModal({ type: "getstarted" });
        }
      },
      onSessionRefresh: function () {
        window.location.reload();
      },
    });
  }, []);
  if (!hydrated) return <></>;

  if (coin.toLowerCase() === "yyg") {
    return (
      <div style={{ height: "100vh" }}>
        <CommonEmptyData text={t("common_53")} />
      </div>
    );
  }
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          // backgroundColor: "rgb(28, 35, 49)",
          position: "absolute",
          left: "0",
          top: "0",
          zIndex: "-1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className={"loader"}></span>
      </div>
      <Script src={process.env.NEXT_PUBLIC_BETBY_SCRIPT!} />
      <div id="betby"></div>
    </div>
  );
};

export default SportsComponent;
