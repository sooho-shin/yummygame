"use client";

import CommonButton from "@/components/common/Button";
import ToggleBtn from "@/components/common/ToggleBtn";
import HistoryBox, { MyHistoryDataType } from "@/components/games/HistoryBox";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import {
  useDeleteFavorite,
  useGetIsFavorite,
  usePostFavorite,
} from "@/querys/game/common";
import {
  useGetThirdPartyDetail,
  useGetThirdPartyDetailTemp,
  useGetThirdPartyMy,
  useGetThirdPartyMyTemp,
  usePostThirdPartyStart,
  usePostThirdPartyStartTemp,
} from "@/querys/provider";
import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import { useUserStore } from "@/stores/useUser";
import { categoryType } from "@/types/provider";
import {
  CookieOption,
  customConsole,
  formatNumber,
  getCategoryHrefName,
} from "@/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useClickAway, useFullscreen, useToggle } from "react-use";
import { useImmer } from "use-immer";
import styles from "./styles/gameWrapper.module.scss";
import CommonToolTip from "@/components/common/ToolTip";
import { useSocketStore } from "@/stores/useSocket";
import { motion } from "framer-motion";

export default function TempProviderGameWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const searchParams = useSearchParams();
  const systemCode = searchParams.get("systemCode");
  // systemCode = 991 slot
  const pageCode = searchParams.get("pageCode");
  const router = useRouter();

  // const categoryCode = searchParams.get("categoryCode");

  const gameType = searchParams.get("gameType");
  const [cookie, setCookie] = useCookies();
  const [gameStartState, setGameStartState] = useState(false);
  const { setIsInProviderGame } = useCommonStore();
  const { coin } = useAssetStore();
  const { showToast, checkMedia, showErrorMessage } = useCommonHook();
  const [wideState, setWideState] = useState(false);
  const { token } = useUserStore();

  const [script, setScript] = useState("");

  const { openModal } = useModalHook();

  useEffect(() => {
    if (!token) {
      openModal({ type: "getstarted" });
    }
  }, [hydrated]);

  const t = useDictionary();

  const { cacheStreamSocket } = useSocketStore();

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

  const detailParamData = useMemo(() => {
    if (!systemCode || !pageCode) return { systemCode: null, pageCode: null };

    return { systemCode, pageCode };
  }, [systemCode, pageCode]);

  const { data: detailData } = useGetThirdPartyDetailTemp(detailParamData);

  const { data: myHistoryServerData, refetch } = useGetThirdPartyMyTemp(
    detailData?.result.game_id,
    token,
  );

  useEffect(() => {
    refetch();
  }, []);

  const [myHistoryData, setMyHistoryData] = useState<
    MyHistoryDataType[] | null
  >(null);

  useEffect(() => {
    if (myHistoryServerData && myHistoryData !== myHistoryServerData.result) {
      setMyHistoryData(myHistoryServerData.result);
    }
  }, [myHistoryServerData]);

  useEffect(() => {
    setIsInProviderGame(true);

    return () => {
      setIsInProviderGame(false);
    };
  }, []);

  const [realGameState, setRealGameState] = useState(gameType === "real");

  const unitArray: (
    | "USD"
    | "EUR"
    | "JPY"
    | "GBP"
    | "AUD"
    | "CAD"
    | "CNY"
    | "KRW"
  )[] = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CNY", "KRW"];

  const [currency, setCurrency] = useState<
    "USD" | "EUR" | "JPY" | "GBP" | "AUD" | "CAD" | "CNY" | "KRW"
  >(cookie.currency ?? unitArray[0]);

  const { mutate, isLoading } = usePostThirdPartyStartTemp();

  const getUnit = (text: string) => {
    switch (text.toLocaleLowerCase()) {
      case "usd":
        return "$";
      case "eur":
        return "€";
      case "jpy":
        return "¥";
      case "gbp":
        return "£";
      case "aud":
        return "$";
      case "cad":
        return "$";
      case "cny":
        return "¥";
      case "krw":
        return "₩";
      default:
        return "메롱 ~ ㅋ";
    }
  };

  const dropboxRef = useRef<HTMLDivElement>(null);
  const dropboxChildRef = useRef<HTMLDivElement>(null);
  const gameContentRef = useRef<HTMLDivElement>(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(gameContentRef, show, {
    onClose: () => toggle(false),
  });
  const [cookies] = useCookies();

  const [descriptionDropDownState, setDescriptionDropDownState] =
    useState(false);

  const [dropdownState, setDropdownState] = useState(false);

  function extractScriptContent(inputString: string) {
    const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const matches = regex.exec(inputString);

    // 정규식에 매치된 경우 내용을 반환하고, 그렇지 않은 경우 빈 문자열 반환
    return matches
      ? matches[0]
          .replace(/<script\b[^>]*>|<\/script>/gi, "")
          .replace("(function() {", "(function() { ")
      : "";
  }

  const startGame = (isDemo: 0 | 1) => {
    // isReal : 1 이면 데모 0이면 리얼

    if (!token) {
      openModal({ type: "getstarted" });
    }

    if (!pageCode || !systemCode) {
      return false;
    }

    if (coin.toLocaleUpperCase() === "HON" && isDemo === 0) {
      showToast(t("provider_2"));
      setScript("");

      setGameStartState(false);
      setLoadingState(false);

      return false;
    }

    setScript("");

    setRealGameState(isDemo === 0);

    mutate(
      {
        assetType: coin.toLocaleUpperCase(),
        currency: currency,
        demo: isDemo === 0 ? "0" : "1",
        page: pageCode,
        system: systemCode,
        isMobile: checkMedia === "mobile" ? "1" : "0",
        lang: cookies.lang || "en",
      },
      {
        onSuccess(data) {
          showErrorMessage(data.code);
          if (data.code === 0) {
            if (checkMedia === "mobile") {
              router.push(
                `/providerm?assetType=${coin.toLocaleUpperCase()}&currency=${currency}&demo=${
                  isDemo === 0 ? "0" : "1"
                }&page=${pageCode}&system=${systemCode}&isMobile=${
                  checkMedia === "mobile" ? "1" : "0"
                }`,
                {
                  scroll: false,
                },
              );
            } else {
              setScript(`
                (function() {
                  const launcher = new GameLauncher('game_wrapper');
                  launcher.run(${JSON.stringify(
                    data.result.script,
                  )}); <!-- Replace '<server response>' with actual server response -->  
                })()`);

              setGameStartState(true);
            }
          } else {
            showToast(data.result.script);
          }
        },
      },
    );
  };

  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
      display: "block",
    },
    exit: {
      opacity: 0.1,
      transition: {
        duration: 0.3,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };
  useEffect(() => {
    // 이전 스크립트 제거
    if (scriptRef.current) {
      document.body.removeChild(scriptRef.current);
    }

    // 새로운 스크립트 생성
    const script = document.createElement("script");
    script.src = "https://cdn.launcher.a8r.games/connector.js";
    script.defer = true;
    document.body.appendChild(script);

    // 스크립트 엘리먼트를 ref로 저장
    scriptRef.current = script;

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [script]);

  useEffect(() => {
    if (gameStartState && checkMedia !== "mobile") {
      startGame(realGameState ? 0 : 1);
    }
  }, [coin, currency, realGameState, checkMedia]);

  useEffect(() => {
    if (gameType !== "real") {
      startGame(1);
    }
  }, [gameType]);

  useClickAway(dropboxRef, () => {
    if (dropdownState) {
      setDropdownState(false);
    }
  });

  const { data: isFavoriteData } = useGetIsFavorite(
    detailData?.result.game_id || "0",
    token,
  );

  const { mutate: mutatePostFavorite } = usePostFavorite();
  const { mutate: mutateDeleteFavorite } = useDeleteFavorite();

  const getCategoryName = (categoryCode: string) => {
    switch (categoryCode) {
      case "1364":
        return t("home_25");
      case "35":
        return t("home_20");
      case "4":
        return t("home_21");
      case "41":
        return t("home_26");
      case "37":
        return t("home_23");
      case "16":
        return t("home_22");
      case "7":
        return t("home_24");
      case "1366":
        return t("home_27");
      default:
        return null;
    }
  };

  const GameComponent = useMemo(() => {
    if (!detailData || checkMedia === "mobile") return <></>;
    return (
      <>
        <>
          <div
            className={styles["loading-back-container"]}
            style={{
              aspectRatio: detailData.result.aspect_ratio
                ? detailData.result.aspect_ratio.replace(
                    /(\d+):(\d+)/,
                    "$1 / $2",
                  )
                : "2 / 1",
              backgroundImage: `url(${detailData.result.image_full_path})`,
            }}
          ></div>
          <div
            className={styles["game-play-area"]}
            style={{
              aspectRatio: detailData.result.aspect_ratio
                ? detailData.result.aspect_ratio.replace(
                    /(\d+):(\d+)/,
                    "$1 / $2",
                  )
                : "2 / 1",
            }}
          >
            {script && (
              <div
                id="game_wrapper"
                className={styles["provider-game-content"]}
              ></div>
            )}
          </div>
        </>
      </>
    );
  }, [detailData, script, realGameState, checkMedia]);

  const [loadingState, setLoadingState] = useState<number | false>(false);

  if (!detailData || !systemCode || !pageCode) return <></>;

  return (
    <>
      {script && script !== "" && (
        <Script id={Date.now().toString()} type="text/javascript">
          {script}
        </Script>
      )}
      <div className={styles["provider-game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          {getCategoryName(detailData.result.categories[0].toString()) && (
            <>
              <span>
                <Link
                  href={
                    "/provider/" +
                    getCategoryHrefName(
                      detailData.result.categories[0].toString() as categoryType,
                    )
                  }
                >
                  {getCategoryName(detailData.result.categories[0].toString())}
                </Link>
              </span>
              <span>/</span>
            </>
          )}
          <span>{detailData.result.game_name}</span>
        </div>
        <div className={`${styles["game-container"]}`}>
          <>
            {/* {GameComponent} */}
            <div className={styles["mobile-game-content"]}>
              <div
                className={styles["img-group"]}
                style={{
                  backgroundImage: `url(${detailData.result.image_full_path})`,
                }}
              >
                <LazyLoadImage
                  src={detailData.result.image_full_path}
                  alt="img crypto"
                />
                <div className={styles["dim-group"]}>
                  <div className={styles.content}>
                    <span>{detailData.result.provider_name}</span>
                    <div className={styles.dim}></div>
                  </div>
                </div>
              </div>
              <div className={styles["info-group"]}>
                <div className={styles.top}>
                  <span className={styles["game-name"]}>
                    {detailData.result.game_name}
                  </span>
                  <button
                    type="button"
                    className={`${styles.favorite} ${
                      isFavoriteData && isFavoriteData.result?.is_favorite
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => {
                      if (
                        isFavoriteData &&
                        isFavoriteData.result?.is_favorite
                      ) {
                        mutateDeleteFavorite({
                          gameId: detailData.result.game_id,
                        });
                      } else {
                        mutatePostFavorite({
                          gameId: detailData.result.game_id,
                        });
                      }
                    }}
                  ></button>
                </div>
                <div className={styles.bottom}>
                  <div className={styles["dropbox-row"]}>
                    <div className={styles["balance-row"]}>
                      <span>{t("provider_3")}</span>

                      {/* {isSlot && (
                        <CommonToolTip
                          tooltipText={`Max Profit : ${fiatSymbol} ${
                            detailData &&
                            detailData.result.limit_info.max_profit_fiat
                              ? formatNumber({
                                  value:
                                    detailData.result.limit_info.max_profit_fiat[
                                      currency.toLocaleLowerCase() as
                                        | "usd"
                                        | "eur"
                                        | "jpy"
                                        | "gbp"
                                        | "aud"
                                        | "cad"
                                        | "cny"
                                        | "krw"
                                    ].toString(),
                                })
                              : ""
                          }`}
                          className={styles.tooltip}
                        />
                      )} */}
                    </div>

                    <div
                      className={`${styles["balance-dropbox"]} ${
                        dropdownState ? styles.active : ""
                      }`}
                      ref={dropboxRef}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownState(!dropdownState);
                        }}
                      >
                        <div>
                          <span>{getUnit(currency)}</span>
                        </div>
                        <span>{currency}</span>
                        <span className={styles.arrow}></span>
                      </button>
                      <motion.div
                        className={styles["dropbox-content"]}
                        initial={{
                          display: "none",
                        }}
                        animate={dropdownState ? "enter" : "exit"}
                        variants={subMenuAnimate}
                      >
                        {unitArray.map(c => {
                          return (
                            <button
                              type="button"
                              key={c}
                              onClick={() => {
                                setCurrency(c);
                                setCookie("currency", c, CookieOption);
                                setDropdownState(false);
                                // alert(c);
                              }}
                            >
                              <div>
                                <span>{getUnit(c)}</span>
                              </div>
                              <span>{c}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["btn-row"]}>
              {detailData.result.has_demo === "1" && (
                <CommonButton
                  text={t("provider_4")}
                  onClick={() => {
                    setLoadingState(1);
                    startGame(1);
                  }}
                  isPending={loadingState === 1}
                />
              )}

              <CommonButton
                text={t("provider_5")}
                onClick={() => {
                  setLoadingState(0);
                  startGame(0);
                }}
                isPending={loadingState === 0}
              />
            </div>
          </>
          <>
            <div
              className={`${styles["game-content"]} ${
                wideState ? styles.wide : ""
              }`}
              ref={gameContentRef}
            >
              {gameStartState ? (
                <>{GameComponent}</>
              ) : (
                <div
                  className={styles["ready-container"]}
                  style={{
                    aspectRatio: detailData.result.aspect_ratio
                      ? detailData.result.aspect_ratio.replace(
                          /(\d+):(\d+)/,
                          "$1 / $2",
                        )
                      : "2 / 1",
                    backgroundImage: `url(${detailData.result.image_full_path})`,
                  }}
                >
                  {isLoading && (
                    <div className={styles["loading-container"]}>
                      <span className={styles.loader}></span>
                    </div>
                  )}

                  <div className={styles.content}>
                    <div className={styles["dropbox-row"]}>
                      <span>{t("provider_3")}</span>
                      <div
                        className={`${styles["balance-dropbox"]} ${
                          dropdownState ? styles.active : ""
                        }`}
                        ref={dropboxRef}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownState(!dropdownState);
                          }}
                        >
                          <div>
                            <span>{getUnit(currency)}</span>
                          </div>
                          <span>{currency}</span>
                          <span className={styles.arrow}></span>
                        </button>
                        {dropdownState && (
                          <div className={styles["dropbox-content"]}>
                            {unitArray.map(c => {
                              return (
                                <button
                                  type="button"
                                  key={c}
                                  onClick={() => {
                                    setCurrency(c);
                                    setCookie("currency", c, CookieOption);
                                    setDropdownState(false);
                                  }}
                                >
                                  <div>
                                    <span>{getUnit(c)}</span>
                                  </div>
                                  <span>{c}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles["btn-row"]}>
                      {detailData.result.has_demo === "1" && (
                        <button
                          type="button"
                          onClick={() => {
                            startGame(1);
                          }}
                        >
                          <span>{t("provider_4")}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          startGame(0);
                        }}
                      >
                        <span>{t("provider_5")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`${styles["setting-row"]} ${
                wideState ? styles.wide : ""
              }`}
            >
              <div className={styles.left}>
                {gameStartState && (
                  <>
                    <span>{t("provider_4")}</span>
                    <ToggleBtn
                      active={realGameState}
                      callback={() => {
                        setRealGameState(!realGameState);
                      }}
                    />
                    <span>{t("provider_5")}</span>
                  </>
                )}
              </div>
              <div className={styles.right}>
                {gameStartState && (
                  <>
                    <div
                      className={`${styles["balance-dropbox"]} ${
                        dropdownState ? styles.active : ""
                      }`}
                      ref={dropboxRef}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownState(!dropdownState);
                        }}
                      >
                        <div>
                          <span>{getUnit(currency)}</span>
                        </div>
                        <span>{currency}</span>
                        <span className={styles.arrow}></span>
                      </button>
                      {dropdownState && (
                        <div className={styles["dropbox-content"]}>
                          {unitArray.map(c => {
                            return (
                              <button
                                type="button"
                                key={c}
                                onClick={() => {
                                  setCurrency(c);
                                  setDropdownState(false);
                                }}
                              >
                                <div>
                                  <span>{getUnit(c)}</span>
                                </div>
                                <span>{c}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className={styles["btn-row"]}>
                  <button
                    className={`${styles.favorite} ${
                      isFavoriteData &&
                      isFavoriteData.result &&
                      isFavoriteData.result?.is_favorite
                        ? styles.active
                        : ""
                    }`}
                    type="button"
                    onClick={() => {
                      if (token) {
                        if (
                          isFavoriteData &&
                          isFavoriteData.result?.is_favorite
                        ) {
                          mutateDeleteFavorite({
                            gameId: detailData.result.game_id,
                          });
                        } else {
                          mutatePostFavorite({
                            gameId: detailData.result.game_id,
                          });
                        }
                      } else {
                        openModal({
                          type: "getstarted",
                        });
                      }
                    }}
                  ></button>
                  <button
                    className={`${show ? styles.active : ""} ${styles.full}`}
                    type="button"
                    onClick={() => {
                      toggle();
                    }}
                  ></button>
                  <button
                    className={`${wideState ? styles.active : ""} ${
                      styles.wide
                    }`}
                    type="button"
                    onClick={() => {
                      setWideState(!wideState);
                    }}
                  ></button>
                </div>
              </div>
            </div>
          </>
        </div>
        {detailData.result.description && (
          <div className={styles["description-container"]}>
            <div>
              <div className={styles.top}>
                <div className={styles["name-group"]}>
                  <span>{detailData.result.game_name}</span>
                  <span>{detailData.result.provider_name}</span>
                </div>
                <button
                  type="button"
                  className={descriptionDropDownState ? styles.active : ""}
                  onClick={() =>
                    setDescriptionDropDownState(!descriptionDropDownState)
                  }
                ></button>
              </div>
              <div
                className={`${styles["description-box"]} ${
                  descriptionDropDownState ? styles.active : ""
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: detailData.result.description,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {myHistoryData && (
          <HistoryBox
            refetchDelay={100}
            type="provider"
            myHistoryData={myHistoryData}
          />
        )}
      </div>
    </>
  );
}
