"use client";

import ToggleBtn from "@/components/common/ToggleBtn";
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import InputBox from "../common/GameInputBox";
import styles from "./styles/autobet.module.scss";

import { useUserStore } from "@/stores/useUser";

import { useAssetStore } from "@/stores/useAsset";
import {
  CookieOption,
  formatNumber,
  truncateDecimal,
  validateNumberWithDecimal,
} from "@/utils";
import BigNumber from "bignumber.js";
import { useClickAway, useInterval } from "react-use";
// import { Updater } from "use-immer";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import {
  useDeleteFavorite,
  useGetIsFavorite,
  usePostFavorite,
} from "@/querys/game/common";
import { useCommonStore } from "@/stores/useCommon";
import { BetLimitDataType } from "@/types/games/common";
import { BetInfo, WheelStatusType } from "@/types/games/wheel";
import classNames from "classnames";
import { useCookies } from "react-cookie";
import { Updater } from "use-immer";
import CommonButton from "../common/Button";
import { usePathname } from "next/navigation";

/*

  playing 은 유저의 행동에 의한 play

  gameState Play 는 유저행동과 관계없이 게임 상태

*/

export default function AutobetBox({
  children,
  playing,
  isShowAutoBet,
  setIsShowAutoBet,
  betAmount,
  setBetAmount,
  autoBetState,
  setAutoBetState,
  bet,
  reset,
  firstAutoBetData,
  numberOfBet,
  setNumberOfBet,
  autoBetProfit,
  setAutoBetProfit,
  resultData,
  gameState,
  endGameFn,
  limitData,
  nextGameStartDelay,
  type,
  cashout,
  wheelAutobetData,
  loadingState,
  betBtnSub,
  crashAutobetData,
  isPending = false,
  gameId,
  maxBetAmount,
  setMaxBetAmount,
  isBtnDisable,
  setPlinkoAutobetState,
  setStatisticsState,
  statisticsState,
}: {
  type:
    | "CRASH"
    | "MINES"
    | "ROULETTE"
    | "CLASSIC_DICE"
    | "ULTIMATE_DICE"
    | "COIN_FLIP"
    | "WHEEL"
    | "PLINKO"
    | "PROVIDER"
    | "LIMBO";
  maxBetAmount: string | null;
  setMaxBetAmount: Dispatch<SetStateAction<string | null>>;
  gameId: string;
  loadingState?: boolean;
  playing: boolean;
  isShowAutoBet: boolean;
  setIsShowAutoBet: Dispatch<SetStateAction<boolean>>;
  setBetAmount: Dispatch<SetStateAction<string | null>>;
  setAutoBetState: Dispatch<SetStateAction<boolean>>;
  betAmount: string;
  children: ReactNode;
  autoBetState: boolean;
  isPending?: boolean;
  isBtnDisable?: boolean;
  bet: (
    amount: string,
    multiply?: number | undefined,
    callback?: () => void,
  ) => boolean | undefined | Promise<false | undefined>;
  reset: () => void;
  firstAutoBetData: { [key: string]: string | number | boolean | null };
  numberOfBet: string;
  setNumberOfBet: Dispatch<SetStateAction<string>>;
  autoBetProfit: number;
  setAutoBetProfit: Dispatch<SetStateAction<number>>;
  resultData: {
    winYn: "Y" | "N" | null;
    profit: number;
  };
  gameState: "play" | "playEnd" | null;
  endGameFn: () => void;
  limitData: BetLimitDataType | undefined;
  nextGameStartDelay?: number;
  cashout?: () => void;
  betBtnSub?: ReactNode;
  wheelAutobetData?: {
    wheelMultiply: number;
    setWheelMultiply: Dispatch<SetStateAction<number>>;
    betAmount2x: string | null;
    betAmount3x: string | null;
    betAmount5x: string | null;
    betAmount50x: string | null;
    setBetAmount2x: Dispatch<SetStateAction<string | null>>;
    setBetAmount3x: Dispatch<SetStateAction<string | null>>;
    setBetAmount5x: Dispatch<SetStateAction<string | null>>;
    setBetAmount50x: Dispatch<SetStateAction<string | null>>;
    wheelStatus: WheelStatusType;
    currentBettingData: BetInfo[] | null;
    refetchDelay: number;
    setCurrentBettingData: Updater<BetInfo[] | null>;
    autoBetMultiply: number;
  };
  crashAutobetData?: {
    setIsShowHalfCashOut: Dispatch<SetStateAction<boolean>>;
    isShowHalfCashOut: boolean;
  };
  setPlinkoAutobetState?: Dispatch<SetStateAction<boolean>>;
  setStatisticsState?: Dispatch<SetStateAction<boolean>>;
  statisticsState?: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { displayFiat, token } = useUserStore();
  const { coin } = useAssetStore();

  const [winIncreaseMf, setWinIncreaseMf] = useState<string | null>("100");
  const [winIncreaseState, setWinIncreaseState] = useState<string>("reset");

  const [loseIncreaseMf, setLoseIncreaseMf] = useState<string | null>("100");
  const [loseIncreaseState, setLoseIncreaseState] = useState<string>("reset");

  const [stopProfit, setStopProfit] = useState<string | null>(null);
  const [stopLoss, setStopLoss] = useState<string | null>(null);

  const {
    exchangeRate,
    showToast,
    amountToDisplayFormat,
    checkMedia,
    timesCoinType,
    divCoinType,
  } = useCommonHook();

  useEffect(() => {
    if (displayFiat) {
      setStopProfit(
        stopProfit && Number(stopProfit) > 0
          ? truncateDecimal({
              num: new BigNumber(stopProfit).times(exchangeRate).toString(),
              decimalPlaces: 2,
            }).toString()
          : null,
      );
      setStopLoss(
        stopLoss && Number(stopLoss) > 0
          ? truncateDecimal({
              num: new BigNumber(stopLoss).times(exchangeRate).toString(),
              decimalPlaces: 2,
            }).toString()
          : null,
      );
      setMaxBetAmount(
        maxBetAmount && Number(maxBetAmount) > 0
          ? truncateDecimal({
              num: new BigNumber(maxBetAmount).times(exchangeRate).toString(),
              decimalPlaces: 2,
            }).toString()
          : null,
      );
    } else {
      setStopProfit(
        stopProfit && Number(stopProfit) > 0
          ? truncateDecimal({
              num: new BigNumber(stopProfit).div(exchangeRate).toString(),
              decimalPlaces: 7,
            }).toString()
          : null,
      );
      setStopLoss(
        stopLoss && Number(stopLoss) > 0
          ? truncateDecimal({
              num: new BigNumber(stopLoss).div(exchangeRate).toString(),
              decimalPlaces: 7,
            }).toString()
          : null,
      );
      setMaxBetAmount(
        maxBetAmount && Number(maxBetAmount) > 0
          ? truncateDecimal({
              num: new BigNumber(maxBetAmount).div(exchangeRate).toString(),
              decimalPlaces: 2,
            }).toString()
          : null,
      );
    }
  }, [displayFiat, exchangeRate, coin]);

  const { openModal } = useModalHook();

  const clearAutoTimeout = useRef<NodeJS.Timeout>();
  const t = useDictionary();

  // game_1	로딩 중
  // game_2	현금 인출
  // game_3	오토 베팅 중지
  // game_4	오토 베팅 시작
  // game_61 베팅

  const betText: {
    text: string;
    value: "loading" | "cashout" | "stopAutoBet" | "autoBet" | "bet";
  } = useMemo(() => {
    if (loadingState) {
      return {
        text: t("game_1"),
        value: "loading",
      };
    }
    if (
      (type === "MINES" || type === "CRASH") &&
      playing &&
      !autoBetState &&
      !loadingState
    ) {
      return {
        text: t("game_2"),
        value: "cashout",
      };
    }
    if ((autoBetState && playing) || (autoBetState && type === "PLINKO")) {
      return {
        text: t("game_3"),
        value: "stopAutoBet",
      };
    }
    if (isShowAutoBet && !playing) {
      return {
        text: t("game_4"),
        value: "autoBet",
      };
    }

    return {
      text: t("game_61"),
      value: "bet",
    };
  }, [autoBetState, playing, isShowAutoBet, type, loadingState]);

  const startAutobet = () => {
    // 경고 메시지를 보여주고 초기화 함수를 호출하는 함수
    const showAlertAndReset = (message: string) => {
      showToast(message);
      reset();
      return false;
    };

    // 베팅 금액이 없을 경우 경고 메시지를 표시하고 초기화 함수를 호출
    if (!betAmount) {
      return showAlertAndReset(t("toast_7"));
    }

    // 코인이 선택되지 않았을 경우 경고 메시지를 표시하고 초기화 함수를
    if (!coin) {
      return showAlertAndReset(t("toast_8"));
    }

    // 남은 베팅 횟수가 0이면 종료하고 초기화 함
    if (firstAutoBetData.numberOfBet && Number(numberOfBet) === 1) {
      showAlertAndReset(t("toast_9"));
      return false;
    } else if (firstAutoBetData.numberOfBet) {
      setNumberOfBet((Number(numberOfBet) - 1).toString());
    }

    // 베팅에 사용할 계산된 금액, 이익 및 손실 한도를 초기화
    let calculatedAmount = timesCoinType(betAmount, coin);

    let calculatedStopProfit =
      stopProfit && Number(stopProfit) > 0
        ? timesCoinType(
            truncateDecimal({
              num: new BigNumber(stopProfit).toString(),
              decimalPlaces: 7,
            }).toString(),
            coin,
          )
        : null;

    let calculatedStopLoss =
      stopLoss && Number(stopLoss) > 0
        ? timesCoinType(
            truncateDecimal({
              num: new BigNumber(stopLoss).toString(),
              decimalPlaces: 7,
            }).toString(),
            coin,
          )
        : null;

    // display fiat 모드가 활성화되었다면 금액 계산에 환율을 적용하고 소수점 자리 수를 조정
    if (displayFiat) {
      calculatedAmount = timesCoinType(
        truncateDecimal({
          num: new BigNumber(betAmount).div(exchangeRate).toString(),
          decimalPlaces: 7,
        }).toString(),
        coin,
      );

      calculatedStopProfit =
        stopProfit && Number(stopProfit) > 0
          ? timesCoinType(
              truncateDecimal({
                num: new BigNumber(stopProfit).div(exchangeRate).toString(),
                decimalPlaces: 7,
              }).toString(),
              coin,
            )
          : null;

      calculatedStopLoss =
        stopLoss && Number(stopLoss) > 0
          ? timesCoinType(
              truncateDecimal({
                num: new BigNumber(stopLoss).div(exchangeRate).toString(),
                decimalPlaces: 7,
              }).toString(),
              coin,
            )
          : null;
    }

    // 이전 결과에 따라 처리
    const resultWinYn = resultData?.winYn;

    // 이긴 경우 처리
    if (resultWinYn === "Y") {
      // const profitAmount = Number(
      //   divCoinType(resultData ? resultData.profit.toString() : "0", coin),
      // );
      const profitAmount = Number(
        resultData ? resultData.profit.toString() : "0",
      );
      const increaseProfit = autoBetProfit + profitAmount;

      // 이익 한도를 초과하면 종료하고 초기화 함수를 호출

      if (
        calculatedStopProfit &&
        new BigNumber(increaseProfit).gte(calculatedStopProfit)
      ) {
        showToast(t("toast_10"));
        reset();
        return false;
      } else {
        setAutoBetProfit(increaseProfit);
      }

      if (winIncreaseState === "reset") {
        setBetAmount(
          firstAutoBetData.betAmount
            ? firstAutoBetData.betAmount.toString()
            : "0",
        );
        type !== "WHEEL" &&
          type !== "CRASH" &&
          bet(
            firstAutoBetData.betAmount
              ? firstAutoBetData.betAmount.toString()
              : "0",
          );
        return false;
      } else {
        // 다음 베팅 금액 계산 및 베팅 실행
        const nextBetAmount = truncateDecimal({
          num: new BigNumber(betAmount)
            .times(winIncreaseMf || 1)
            .div(100)
            .plus(betAmount)
            .toString(),
          decimalPlaces: displayFiat ? 2 : 7,
        });

        if (maxBetAmount && new BigNumber(nextBetAmount).gte(maxBetAmount)) {
          showToast("최대 베팅 금액을 초과했습니다.");
          reset();
          return false;
          // setBetAmount(maxBetAmount);
          // type !== "WHEEL" && type !== "CRASH" && bet(maxBetAmount);
        } else {
          setBetAmount(nextBetAmount);
          type !== "WHEEL" && type !== "CRASH" && bet(nextBetAmount);
        }
      }
    }

    if (!firstAutoBetData.betAmount) {
      return false;
    }

    // 진 경우 처리
    if (resultWinYn === "N") {
      // 오토벳 전용
      const autoBetLossAmount = Number(
        resultData ? resultData.profit.toString() : "0",
      );
      const lossAmount = Number(calculatedAmount);
      const decreaseProfit =
        autoBetProfit - (type === "ROULETTE" ? autoBetLossAmount : lossAmount);

      if (
        calculatedStopLoss &&
        new BigNumber(-decreaseProfit).gte(calculatedStopLoss)
      ) {
        showToast(t("toast_11"));
        reset();
        return false;
      } else {
        setAutoBetProfit(decreaseProfit);
      }

      if (loseIncreaseState === "reset") {
        setBetAmount(
          firstAutoBetData.betAmount
            ? firstAutoBetData.betAmount.toString()
            : "0",
        );
        type !== "WHEEL" &&
          type !== "CRASH" &&
          bet(
            firstAutoBetData.betAmount
              ? firstAutoBetData.betAmount.toString()
              : "0",
          );
        return false;
      } else {
        // 다음 베팅 금액 계산 및 베팅 실행
        const nextBetAmount = truncateDecimal({
          num: new BigNumber(betAmount)
            .times(loseIncreaseMf || 1)
            .div(100)
            .plus(betAmount)
            .toString(),
          decimalPlaces: displayFiat ? 2 : 7,
        });

        if (maxBetAmount && new BigNumber(nextBetAmount).gte(maxBetAmount)) {
          showToast("최대 베팅 금액을 초과했습니다.");
          reset();
          return false;
          // setBetAmount(maxBetAmount);
          // type !== "WHEEL" && type !== "CRASH" && bet(maxBetAmount);
        } else {
          setBetAmount(nextBetAmount);
          type !== "WHEEL" && type !== "CRASH" && bet(nextBetAmount);
        }
      }
    }
  };

  useInterval(
    () => {
      if (autoBetState) {
        startAutobet();
      }
    },
    type === "PLINKO" && autoBetState ? 500 : null,
  );

  // useEffect(() => {
  //   if (type === "PLINKO" && !autoBetState && gameState === "play") {

  //   }
  // }, [gameState]);

  // autobet
  useEffect(() => {
    if (gameState === "playEnd" && type !== "PLINKO") {
      // setCoinAni(false);
      endGameFn();

      if (autoBetState && resultData.winYn) {
        clearAutoTimeout.current = setTimeout(() => {
          startAutobet();
        }, nextGameStartDelay ?? 1000);
      }

      if (!autoBetState) {
        // 크래시하면서 뺌 오류있을수 있음
        // setPlaying(false);
        reset();
      }
    }
  }, [gameState, resultData]);

  useEffect(() => {
    if (!autoBetState && clearAutoTimeout.current) {
      clearTimeout(clearAutoTimeout.current);
      reset();
    }
  }, [autoBetState]);

  const { data: isFavoriteData } = useGetIsFavorite(gameId, token);

  const { mutate: mutatePostFavorite } = usePostFavorite();
  const { mutate: mutateDeleteFavorite } = useDeleteFavorite();

  const [cookie, setCookie, removeCookie] = useCookies();

  const [settingState, setSettingState] = useState<boolean>(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  useClickAway(dropboxRef, () => {
    setSettingState(false);
  });

  const { media, setIsChangeAssetState } = useCommonStore();

  useEffect(() => {
    if (autoBetState) {
      setIsChangeAssetState(false);
    } else {
      setIsChangeAssetState(true);
    }
  }, [autoBetState]);

  const isNotDesktop = useMemo(() => {
    return (
      (checkMedia === "desktop" && media?.includes("tablet")) ||
      checkMedia !== "desktop"
    );
  }, [checkMedia, media]);

  useEffect(() => {
    if (checkMedia === "mobile" && hydrated && !cookie.disableAnimation) {
      const currentDate = new Date();

      const futureDate = new Date(currentDate);
      futureDate.setFullYear(currentDate.getFullYear() + 100);

      setCookie("disableAnimation", "disable", {
        ...CookieOption,
        expires: futureDate,
      });
    }
  }, [media, hydrated, cookie]);

  return (
    <div className={classNames(styles["betting-container"], {})}>
      <div
        className={classNames(styles["setting-row"], {
          [styles.crash]: media?.includes("tablet") && type === "CRASH",
          [styles["wheel-mobile"]]:
            type === "WHEEL" &&
            isShowAutoBet &&
            wheelAutobetData &&
            checkMedia === "mobile",
        })}
      >
        <div className={styles["autobet-box"]}>
          <div
            className={styles["btn-box"]}
            style={{
              opacity:
                (playing && type !== "WHEEL") || autoBetState || loadingState
                  ? 0.4
                  : 1,
            }}
          >
            <ToggleBtn
              active={isShowAutoBet}
              callback={() => {
                if (
                  (type === "WHEEL" && !autoBetState) ||
                  (!playing && !loadingState && !autoBetState)
                ) {
                  setIsShowAutoBet(!isShowAutoBet);
                }
              }}
            />
            <span>{t("common_40")}</span>
            <button
              type="button"
              className={styles["btn-tooltip"]}
              onClick={() => {
                openModal({
                  type: "autobet",
                });
              }}
            ></button>
          </div>
          {type === "CRASH" && (
            <div
              className={styles["btn-box"]}
              style={{
                opacity: playing || autoBetState || loadingState ? 0.4 : 1,
              }}
            >
              <ToggleBtn
                active={crashAutobetData?.isShowHalfCashOut}
                callback={() => {
                  if (!playing && !loadingState && !autoBetState) {
                    crashAutobetData?.setIsShowHalfCashOut(
                      !crashAutobetData.isShowHalfCashOut,
                    );
                  }
                }}
              />
              <span>{t("game_11")}</span>
              <button
                type="button"
                className={styles["btn-tooltip"]}
                onClick={() => {
                  openModal({
                    type: "halfCashOut",
                  });
                }}
              ></button>
            </div>
          )}

          {type === "WHEEL" &&
            isShowAutoBet &&
            wheelAutobetData &&
            !(
              checkMedia !== "desktop" ||
              (checkMedia === "desktop" && media?.includes("tablet"))
            ) && (
              <div
                className={styles["wheel-autobet-option"]}
                style={{ opacity: autoBetState ? 0.4 : 1 }}
              >
                <button
                  type="button"
                  className={
                    wheelAutobetData.wheelMultiply === 2 ? styles.active : ""
                  }
                  disabled={autoBetState}
                  onClick={() => {
                    wheelAutobetData.setWheelMultiply &&
                      wheelAutobetData.setWheelMultiply(2);
                  }}
                >
                  <span>2x</span>
                </button>
                <button
                  type="button"
                  className={
                    wheelAutobetData.wheelMultiply === 3 ? styles.active : ""
                  }
                  disabled={autoBetState}
                  onClick={() => {
                    wheelAutobetData.setWheelMultiply &&
                      wheelAutobetData.setWheelMultiply(3);
                  }}
                >
                  <span>3x</span>
                </button>
                <button
                  type="button"
                  className={
                    wheelAutobetData.wheelMultiply === 5 ? styles.active : ""
                  }
                  disabled={autoBetState}
                  onClick={() => {
                    wheelAutobetData.setWheelMultiply &&
                      wheelAutobetData.setWheelMultiply(5);
                  }}
                >
                  <span>5x</span>
                </button>
                <button
                  type="button"
                  className={
                    wheelAutobetData.wheelMultiply === 50 ? styles.active : ""
                  }
                  disabled={autoBetState}
                  onClick={() => {
                    wheelAutobetData.setWheelMultiply &&
                      wheelAutobetData.setWheelMultiply(50);
                  }}
                >
                  <span>50x</span>
                </button>
              </div>
            )}
        </div>

        {hydrated && (
          <div className={styles["setting-btn-box"]}>
            {checkMedia === "mobile" ? (
              <>
                {token && (
                  <button
                    type="button"
                    className={`${styles.favorite} ${
                      isFavoriteData && isFavoriteData.result.is_favorite
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => {
                      if (isFavoriteData && isFavoriteData.result.is_favorite) {
                        mutateDeleteFavorite({ gameId });
                      } else {
                        mutatePostFavorite({ gameId });
                      }
                    }}
                  >
                    <div className={styles["info-text"]}>{t("common_41")}</div>
                  </button>
                )}
                <button
                  type="button"
                  className={styles.fair}
                  onClick={() => {
                    openModal({
                      type: "fairness",
                      props: {
                        modalGameType: type,
                      },
                    });
                  }}
                >
                  <div className={styles["info-text"]}>{t("common_42")}</div>
                </button>

                {setStatisticsState && (
                  <button
                    type="button"
                    className={classNames(styles.statistics, {
                      [styles.active]: statisticsState,
                    })}
                    onClick={() => {
                      setStatisticsState(!statisticsState);
                    }}
                  >
                    <div className={styles["info-text"]}>{t("common_52")}</div>
                  </button>
                )}

                <div className={styles["setting-group"]} ref={dropboxRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingState(!settingState);
                    }}
                  ></button>
                  {settingState && (
                    <div className={styles["setting-box"]}>
                      <button
                        type="button"
                        className={classNames(styles.sound, {
                          [styles.active]: !cookie.disableSound,
                        })}
                        onClick={() => {
                          const currentDate = new Date();

                          const futureDate = new Date(currentDate);
                          futureDate.setFullYear(
                            currentDate.getFullYear() + 100,
                          );

                          if (!cookie.disableSound) {
                            setCookie("disableSound", "disable", {
                              ...CookieOption,
                              expires: futureDate,
                            });
                          } else {
                            removeCookie("disableSound", {
                              ...CookieOption,
                              expires: futureDate,
                            });
                          }
                        }}
                      >
                        <div className={styles["info-text"]}>
                          {t("common_43")}
                        </div>
                      </button>
                      {type === "CRASH" && (
                        <button
                          type="button"
                          className={classNames(styles.ani, {
                            [styles.active]:
                              !cookie.disableAnimation ||
                              cookie.disableAnimation === "able",
                          })}
                          onClick={() => {
                            const currentDate = new Date();

                            const futureDate = new Date(currentDate);
                            futureDate.setFullYear(
                              currentDate.getFullYear() + 100,
                            );

                            if (
                              !cookie.disableAnimation ||
                              cookie.disableAnimation === "able"
                            ) {
                              setCookie("disableAnimation", "disable", {
                                ...CookieOption,
                                expires: futureDate,
                              });
                            } else {
                              setCookie("disableAnimation", "able", {
                                ...CookieOption,
                                expires: futureDate,
                              });
                              // removeCookie("disableAnimation", {
                              //   path: "/",
                              //   expires: futureDate,
                              // });
                            }
                          }}
                        >
                          <div className={styles["info-text"]}>
                            {t("common_44")}
                            {/* {cookie.disableAnimation} */}
                          </div>
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.tooltip}
                        onClick={() => {
                          openModal({
                            type: "rules",
                            props: {
                              modalGameType: type,
                            },
                          });
                        }}
                      >
                        <div className={styles["info-text"]}>
                          {t("common_45")}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {token && (
                  <button
                    type="button"
                    className={`${styles.favorite} ${
                      isFavoriteData && isFavoriteData.result.is_favorite
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => {
                      if (isFavoriteData && isFavoriteData.result.is_favorite) {
                        mutateDeleteFavorite({ gameId });
                      } else {
                        mutatePostFavorite({ gameId });
                      }
                    }}
                  >
                    <div className={styles["info-text"]}>{t("common_41")}</div>
                  </button>
                )}

                <button
                  type="button"
                  className={classNames(styles.sound, {
                    [styles.active]: !cookie.disableSound,
                  })}
                  onClick={() => {
                    const currentDate = new Date();

                    const futureDate = new Date(currentDate);
                    futureDate.setFullYear(currentDate.getFullYear() + 100);

                    if (!cookie.disableSound) {
                      setCookie("disableSound", "disable", {
                        ...CookieOption,
                        expires: futureDate,
                      });
                    } else {
                      removeCookie("disableSound", {
                        ...CookieOption,
                        expires: futureDate,
                      });
                    }
                  }}
                >
                  <div className={styles["info-text"]}>{t("common_43")}</div>
                </button>
                {type === "CRASH" && (
                  <button
                    type="button"
                    className={classNames(styles.ani, {
                      [styles.active]:
                        !cookie.disableAnimation ||
                        cookie.disableAnimation === "able",
                    })}
                    onClick={() => {
                      const currentDate = new Date();

                      const futureDate = new Date(currentDate);
                      futureDate.setFullYear(currentDate.getFullYear() + 100);

                      if (
                        !cookie.disableAnimation ||
                        cookie.disableAnimation === "able"
                      ) {
                        setCookie("disableAnimation", "disable", {
                          ...CookieOption,
                          expires: futureDate,
                        });
                      } else {
                        setCookie("disableAnimation", "able", {
                          ...CookieOption,
                          expires: futureDate,
                        });
                      }
                    }}
                  >
                    <div className={styles["info-text"]}>{t("common_44")}</div>
                  </button>
                )}

                <button
                  type="button"
                  className={styles.fair}
                  onClick={() => {
                    openModal({
                      type: "fairness",
                      props: {
                        modalGameType: type,
                      },
                    });
                  }}
                >
                  <div className={styles["info-text"]}>{t("common_42")}</div>
                </button>

                {setStatisticsState && (
                  <button
                    type="button"
                    className={classNames(styles.statistics, {
                      [styles.active]: statisticsState,
                    })}
                    onClick={() => {
                      setStatisticsState(!statisticsState);
                    }}
                  >
                    <div className={styles["info-text"]}>{t("common_52")}</div>
                  </button>
                )}

                <button
                  type="button"
                  className={styles.tooltip}
                  onClick={() => {
                    openModal({
                      type: "rules",
                      props: {
                        modalGameType: type,
                      },
                    });
                  }}
                >
                  <div className={styles["info-text"]}>{t("common_45")}</div>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {type === "WHEEL" &&
        isShowAutoBet &&
        wheelAutobetData &&
        (checkMedia !== "desktop" ||
          (checkMedia === "desktop" && media?.includes("tablet"))) && (
          <div
            className={classNames(
              styles["wheel-autobet-option"],
              styles.tablet,
            )}
            style={{ opacity: autoBetState ? 0.4 : 1 }}
          >
            <button
              type="button"
              className={
                wheelAutobetData.wheelMultiply === 2 ? styles.active : ""
              }
              disabled={autoBetState}
              onClick={() => {
                wheelAutobetData.setWheelMultiply &&
                  wheelAutobetData.setWheelMultiply(2);
              }}
            >
              <span>2x</span>
            </button>
            <button
              type="button"
              className={
                wheelAutobetData.wheelMultiply === 3 ? styles.active : ""
              }
              disabled={autoBetState}
              onClick={() => {
                wheelAutobetData.setWheelMultiply &&
                  wheelAutobetData.setWheelMultiply(3);
              }}
            >
              <span>3x</span>
            </button>
            <button
              type="button"
              className={
                wheelAutobetData.wheelMultiply === 5 ? styles.active : ""
              }
              disabled={autoBetState}
              onClick={() => {
                wheelAutobetData.setWheelMultiply &&
                  wheelAutobetData.setWheelMultiply(5);
              }}
            >
              <span>5x</span>
            </button>
            <button
              type="button"
              className={
                wheelAutobetData.wheelMultiply === 50 ? styles.active : ""
              }
              disabled={autoBetState}
              onClick={() => {
                wheelAutobetData.setWheelMultiply &&
                  wheelAutobetData.setWheelMultiply(50);
              }}
            >
              <span>50x</span>
            </button>
          </div>
        )}
      <div
        className={classNames(styles["betting-row"], {
          [styles.tablet]: media?.includes("tablet"),
          [styles.limbo]: type === "LIMBO",
        })}
      >
        {type !== "ROULETTE" &&
          (type !== "WHEEL" || (type === "WHEEL" && isNotDesktop)) && (
            <div
              className={styles["bet-box"]}
              style={{
                opacity:
                  (type !== "WHEEL" && playing) || loadingState || autoBetState
                    ? 0.4
                    : 1,
              }}
            >
              <InputBox
                type="minMax"
                title={t("game_39")}
                limitData={limitData}
                topSub={`${
                  displayFiat && coin !== "hon"
                    ? formatNumber({
                        value: new BigNumber(betAmount ?? "0")
                          .div(exchangeRate)
                          .toString(),
                        decimal: 0,
                        maxDigits: 7,
                      }) +
                      " " +
                      coin?.toLocaleUpperCase()
                    : ""
                }`}
                setAmount={(amount: string) => setBetAmount(amount)}
                coin={coin}
                disabled={
                  (type !== "WHEEL" && playing) || loadingState || autoBetState
                }
                value={betAmount}
                onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.value) {
                    setBetAmount(null);
                  } else {
                    const val = validateNumberWithDecimal(e.target.value, {
                      maxDecimal: displayFiat ? 2 : 7,
                      maxInteger: 9999999,
                    });

                    if (!val || !limitData) return false;
                    setBetAmount(val);
                  }
                }}
                tooltip={
                  `${t("common_56")} : ${
                    coin.toLocaleLowerCase() === "hon"
                      ? 0
                      : limitData && limitData.max_profit
                        ? amountToDisplayFormat(
                            null,
                            "jel",
                            limitData.max_profit,
                          )
                        : ""
                  }`
                  // type === "WHEEL" || type === "CRASH" || type === "MINES"
                  //   ? `Max Profit : ${
                  //       limitData && limitData.max_profit
                  //         ? amountToDisplayFormat(
                  //             null,
                  //             "jel",
                  //             limitData.max_profit,
                  //           )
                  //         : ""
                  //     }`
                  //   : null
                }
              />
            </div>
          )}
        {children}
        {type === "WHEEL" && wheelAutobetData && (
          <div className={styles["wheel-betting-container"]}>
            <BettingBox
              payout={2}
              betAmount={wheelAutobetData.betAmount2x}
              coin={coin}
              displayFiat={displayFiat}
              exchangeRate={exchangeRate}
              limitData={limitData}
              setBetAmount={wheelAutobetData.setBetAmount2x}
              bet={bet}
              wheelStatus={wheelAutobetData.wheelStatus}
              currentBettingData={wheelAutobetData.currentBettingData}
              refetchDelay={wheelAutobetData.refetchDelay}
              setCurrentBettingData={wheelAutobetData.setCurrentBettingData}
              isShowAutoBet={isShowAutoBet}
              autoBetMultiply={wheelAutobetData.autoBetMultiply}
              autoBetState={autoBetState}
              setAutoBetState={setAutoBetState}
              playing={playing}
              autobetAmount={betAmount}
              maxBetAmount={maxBetAmount}
            />
            <BettingBox
              payout={3}
              betAmount={wheelAutobetData.betAmount3x}
              coin={coin}
              displayFiat={displayFiat}
              exchangeRate={exchangeRate}
              limitData={limitData}
              setBetAmount={wheelAutobetData.setBetAmount3x}
              bet={bet}
              wheelStatus={wheelAutobetData.wheelStatus}
              currentBettingData={wheelAutobetData.currentBettingData}
              refetchDelay={wheelAutobetData.refetchDelay}
              setCurrentBettingData={wheelAutobetData.setCurrentBettingData}
              isShowAutoBet={isShowAutoBet}
              autoBetMultiply={wheelAutobetData.autoBetMultiply}
              autoBetState={autoBetState}
              setAutoBetState={setAutoBetState}
              playing={playing}
              autobetAmount={betAmount}
              maxBetAmount={maxBetAmount}
            />
            <BettingBox
              payout={5}
              betAmount={wheelAutobetData.betAmount5x}
              coin={coin}
              displayFiat={displayFiat}
              exchangeRate={exchangeRate}
              limitData={limitData}
              setBetAmount={wheelAutobetData.setBetAmount5x}
              bet={bet}
              wheelStatus={wheelAutobetData.wheelStatus}
              currentBettingData={wheelAutobetData.currentBettingData}
              refetchDelay={wheelAutobetData.refetchDelay}
              setCurrentBettingData={wheelAutobetData.setCurrentBettingData}
              isShowAutoBet={isShowAutoBet}
              autoBetMultiply={wheelAutobetData.autoBetMultiply}
              autoBetState={autoBetState}
              setAutoBetState={setAutoBetState}
              playing={playing}
              autobetAmount={betAmount}
              maxBetAmount={maxBetAmount}
            />
            <BettingBox
              payout={50}
              betAmount={wheelAutobetData.betAmount50x}
              coin={coin}
              displayFiat={displayFiat}
              exchangeRate={exchangeRate}
              limitData={limitData}
              setBetAmount={wheelAutobetData.setBetAmount50x}
              bet={bet}
              wheelStatus={wheelAutobetData.wheelStatus}
              currentBettingData={wheelAutobetData.currentBettingData}
              refetchDelay={wheelAutobetData.refetchDelay}
              setCurrentBettingData={wheelAutobetData.setCurrentBettingData}
              isShowAutoBet={isShowAutoBet}
              autoBetMultiply={wheelAutobetData.autoBetMultiply}
              autoBetState={autoBetState}
              setAutoBetState={setAutoBetState}
              playing={playing}
              autobetAmount={betAmount}
              maxBetAmount={maxBetAmount}
            />
          </div>
        )}
        {type !== "WHEEL" && type !== "CRASH" && (
          <div
            className={classNames({
              [styles["limbo-bet-btn"]]: type === "LIMBO",
            })}
          >
            <CommonButton
              text={betText.text}
              isPending={isPending}
              onClick={() => {
                switch (betText.value) {
                  case "stopAutoBet":
                    setPlinkoAutobetState && setPlinkoAutobetState(false);
                    setAutoBetState(false);
                    break;
                  case "cashout":
                    cashout && cashout();
                    break;

                  default:
                    bet(betAmount);
                    break;
                }
              }}
              disabled={
                (type !== "MINES" && !autoBetState && playing) ||
                loadingState ||
                isBtnDisable
              }
              btnSub={betBtnSub}
              className={classNames(styles["bet-btn"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            />
          </div>
        )}
      </div>
      {isShowAutoBet && (
        <div
          className={classNames(styles["autobet-row"], {
            [styles.tablet]: media?.includes("tablet"),
          })}
        >
          {/* first */}
          <div
            style={{
              opacity:
                playing ||
                type === "ROULETTE" ||
                autoBetState ||
                loadingState ||
                type === "PLINKO"
                  ? 0.4
                  : 1,
            }}
          >
            <div className={styles.top}>
              <span>{t("game_35")}</span>
            </div>
            <div
              className={classNames(styles["input-box-group"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <InputBox
                title={t("game_40")}
                type="withToggle"
                disabled={
                  playing ||
                  type === "ROULETTE" ||
                  loadingState ||
                  autoBetState ||
                  type === "PLINKO"
                }
                limitData={limitData}
                value={winIncreaseMf}
                disabledUnit={true}
                onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.value) {
                    setWinIncreaseMf("");
                  } else {
                    const val = validateNumberWithDecimal(e.target.value, {
                      maxDecimal: 2,
                      maxInteger: 100,
                    });
                    val && setWinIncreaseMf(val);
                  }
                }}
                inputSub="%"
                onToggleFn={string => setWinIncreaseState(string)}
                toggleActiveVal={winIncreaseState}
                toggleData={[
                  { title: t("game_36"), val: "reset" },
                  { title: t("game_37"), val: "increase" },
                ]}
              />
              <InputBox
                title={t("game_41")}
                type="withToggle"
                disabled={
                  playing ||
                  type === "ROULETTE" ||
                  loadingState ||
                  autoBetState ||
                  type === "PLINKO"
                }
                limitData={limitData}
                disabledUnit={true}
                value={loseIncreaseMf}
                onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.value) {
                    setLoseIncreaseMf("");
                  } else {
                    const val = validateNumberWithDecimal(e.target.value, {
                      maxDecimal: 2,
                      maxInteger: 100,
                    });
                    val && setLoseIncreaseMf(val);
                  }
                }}
                inputSub="%"
                onToggleFn={string => setLoseIncreaseState(string)}
                toggleActiveVal={loseIncreaseState}
                toggleData={[
                  { title: t("game_36"), val: "reset" },
                  { title: t("game_37"), val: "increase" },
                ]}
              />
            </div>
          </div>
          {/* second */}
          <div
            style={{
              opacity: playing || loadingState || autoBetState ? 0.4 : 1,
            }}
          >
            <div className={styles.top}>
              <span>{t("game_38")}</span>
            </div>
            <div
              className={classNames(styles["input-box-group"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <InputBox
                title={t("game_42")}
                // title={stopProfit === ""  "0"}
                type="amount"
                coin={coin}
                disabled={playing || loadingState || autoBetState}
                value={stopProfit}
                limitData={limitData}
                // topSub={"0.00162 ETH"}
                topSub={`${
                  displayFiat
                    ? formatNumber({
                        value: new BigNumber(stopProfit ?? "0")
                          .div(exchangeRate)
                          .toString(),
                        decimal: 0,
                        maxDigits: 7,
                      }) +
                      " " +
                      coin?.toLocaleUpperCase()
                    : ""
                }`}
                onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.value) {
                    setStopProfit(null);
                  } else {
                    const val = validateNumberWithDecimal(e.target.value, {
                      maxDecimal: 8,
                      maxInteger: 10000000,
                    });
                    val && setStopProfit(val);
                  }
                }}
              />
              <InputBox
                title={t("game_43")}
                type="amount"
                disabled={playing || loadingState || autoBetState}
                coin={coin}
                value={stopLoss}
                limitData={limitData}
                topSub={`${
                  displayFiat
                    ? formatNumber({
                        value: new BigNumber(stopLoss ?? "0")
                          .div(exchangeRate)
                          .toString(),
                        decimal: 0,
                        maxDigits: 7,
                      }) +
                      " " +
                      coin?.toLocaleUpperCase()
                    : ""
                }`}
                onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.value) {
                    setStopLoss(null);
                  } else {
                    const val = validateNumberWithDecimal(e.target.value, {
                      maxDecimal: 7,
                      maxInteger: 10000000,
                    });
                    val && setStopLoss(val);
                  }
                }}
              />
            </div>
          </div>
          {/* third */}
          <div
            style={{
              opacity: playing || loadingState || autoBetState ? 0.4 : 1,
            }}
          >
            <div className={styles.top}>
              <span>{t("game_62")}</span>
            </div>

            <div
              className={classNames(styles["input-box-group"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <InputBox
                title={t("game_44")}
                type="withButton"
                disabled={playing || loadingState || autoBetState}
                limitData={limitData}
                disabledUnit={true}
                placeholder={"0"}
                // coin={coin}
                value={numberOfBet}
                // topSub={"0.00162 ETH"}
                onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
                  const onlyNumbersRegex = /^[0-9]+$/;
                  if (!e.target.value) {
                    setNumberOfBet("");
                  }
                  if (onlyNumbersRegex.test(e.target.value)) {
                    setNumberOfBet(e.target.value);
                  } else {
                    return false;
                  }
                }}
                buttonElement={
                  <button
                    className={`${styles["number-bet-btn"]} ${
                      Number(numberOfBet) === 0 ? styles.active : ""
                    }`}
                  >
                    <span>∞</span>
                  </button>
                }
              />
              <div
                style={{
                  opacity:
                    playing || autoBetState
                      ? 1
                      : type === "ROULETTE" || type === "PLINKO"
                        ? 0.4
                        : 1,
                  width: "100%",
                }}
              >
                <InputBox
                  title={t("game_45")}
                  type="amount"
                  coin={coin}
                  disabled={
                    playing ||
                    type === "ROULETTE" ||
                    loadingState ||
                    autoBetState ||
                    type === "PLINKO"
                  }
                  value={maxBetAmount}
                  limitData={limitData}
                  // topSub={"0.00162 ETH"}
                  topSub={`${
                    displayFiat
                      ? formatNumber({
                          value: new BigNumber(maxBetAmount ?? "0")
                            .div(exchangeRate)
                            .toString(),
                          decimal: 0,
                          maxDigits: 7,
                        }) +
                        " " +
                        coin?.toLocaleUpperCase()
                      : ""
                  }`}
                  onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.value) {
                      setMaxBetAmount(null);
                    } else {
                      const val = validateNumberWithDecimal(e.target.value, {
                        maxDecimal: 7,
                        maxInteger: 10000000,
                      });
                      val && setMaxBetAmount(val);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const BettingBox = ({
  limitData,
  displayFiat,
  betAmount,
  exchangeRate,
  coin,
  setBetAmount,
  payout,
  bet,
  wheelStatus,
  currentBettingData,
  isShowAutoBet,
  refetchDelay,
  autoBetMultiply,
  autoBetState,
  setAutoBetState,
  playing,
  autobetAmount,
  maxBetAmount,
}: {
  limitData: BetLimitDataType | undefined;
  displayFiat: string | null;
  betAmount: string | null;
  exchangeRate: string;
  coin: string | null | undefined;
  setBetAmount: Dispatch<SetStateAction<string | null>>;
  payout: 2 | 3 | 5 | 50;
  wheelStatus: WheelStatusType;
  autobetAmount: string;
  bet: (
    amount: string,
    multiply?: number,
    callback?: () => void,
  ) => boolean | undefined | Promise<false | undefined>;
  currentBettingData: null | BetInfo[];
  setCurrentBettingData: Updater<BetInfo[] | null>;
  refetchDelay: number;
  isShowAutoBet: boolean;
  autoBetMultiply: number;
  autoBetState: boolean;
  setAutoBetState: Dispatch<SetStateAction<boolean>>;
  playing: boolean;
  maxBetAmount: string | null;
}) => {
  const [betState, setBetState] = useState(false);
  const [holdState, setHoldState] = useState(false);
  const { media } = useCommonStore();
  // const { coin } = useAssetStore();
  const { checkMedia, amountToDisplayFormat, commonValidateGameBet } =
    useCommonHook();
  const t = useDictionary();

  useEffect(() => {
    setHoldState(false);
    setAutoBetState(false);
  }, [coin]);

  useEffect(() => {
    if (
      currentBettingData &&
      currentBettingData.length > 0 &&
      wheelStatus === "Bet"
    ) {
      for (const obj of currentBettingData) {
        if (obj.betMultiply === payout) {
          setBetState(true);
        }
      }
      // setCurrentBettingData([]);
    } else {
      if (wheelStatus === "Bet" && !holdState) {
        setBetState(false);
      }
      if (wheelStatus === "Bet" && holdState) {
        bet(betAmount ?? "0", payout, () => {
          setBetState(true);
          if (!autoBetState) {
            setHoldState(false);
          }
        });
      }

      if (wheelStatus === "StopBet") {
        setTimeout(() => {
          setBetState(false);
        }, refetchDelay);
      }
    }
  }, [currentBettingData, wheelStatus]);

  const isNotDesktop = useMemo(() => {
    return (
      (checkMedia === "desktop" && media?.includes("tablet")) ||
      checkMedia !== "desktop"
    );
  }, [checkMedia, media]);

  useEffect(() => {
    if (!autoBetState) {
      setHoldState(false);
    }
  }, [autoBetState]);

  return (
    <div className={styles.box}>
      <button
        type="button"
        disabled={betState || (isShowAutoBet && autoBetMultiply !== payout)}
        style={{
          opacity:
            betState || (isShowAutoBet && autoBetMultiply !== payout) ? 0.4 : 1,
        }}
        onClick={() => {
          if (isNotDesktop) {
            setBetAmount(autobetAmount);
          }
          const wheelAmount = isNotDesktop ? autobetAmount : betAmount;
          const calculatedAmount = commonValidateGameBet({
            amount: wheelAmount,
            autoBetState,
            limitData: limitData,
            playing: false,
            maxBetAmount: isShowAutoBet ? maxBetAmount : null,
          });

          if (!calculatedAmount) {
            return false;
          }
          if (isShowAutoBet) {
            if (autoBetState) {
              setHoldState(false);
              setAutoBetState(false);
            } else {
              if (wheelStatus === "Bet") {
                bet(wheelAmount ?? "0", payout, () => {
                  setBetState(true);
                  setAutoBetState(true);
                  setHoldState(true);
                });
              } else {
                setHoldState(true);
                setAutoBetState(true);
              }
            }

            return false;
          }

          if (wheelStatus === "Bet" && !holdState) {
            bet(wheelAmount ?? "0", payout, () => {
              setBetState(true);
              setHoldState(false);
            });
            return false;
          }

          if (wheelStatus !== "Bet" && !betState && !holdState) {
            setHoldState(true);
            return false;
          }

          if (wheelStatus !== "Bet" && !betState && holdState) {
            setHoldState(false);
            return false;
          }
        }}
      >
        <span>{payout} x</span>

        {isShowAutoBet && autoBetState && autoBetMultiply == payout && (
          <span>{t("game_3")}</span>
        )}
        {isShowAutoBet && !autoBetState && autoBetMultiply == payout && (
          <span>{t("game_4")}</span>
        )}
        {!isShowAutoBet && wheelStatus === "Bet" && betState && (
          <span>{t("modal_256")}</span>
        )}
        {!isShowAutoBet && wheelStatus !== "Bet" && betState && (
          <span>{t("game_1")}</span>
        )}
        {!isShowAutoBet && wheelStatus !== "Bet" && !betState && holdState && (
          <span>{t("game_5")}</span>
        )}
        {!isShowAutoBet && wheelStatus !== "Bet" && !betState && !holdState && (
          <span>{t("game_6")}</span>
        )}
      </button>
      {!isNotDesktop && (
        <div
          style={{
            width: "100%",
            opacity:
              (!isShowAutoBet &&
                wheelStatus !== "Bet" &&
                !betState &&
                holdState) ||
              (isShowAutoBet && playing) ||
              (isShowAutoBet && autoBetMultiply !== payout) ||
              autoBetState ||
              betState
                ? 0.4
                : 1,
          }}
        >
          <InputBox
            type="wheel"
            title={t("game_46")}
            limitData={limitData}
            // title={exchangeRate}
            topSub={`${
              displayFiat && coin !== "hon"
                ? formatNumber({
                    value: new BigNumber(betAmount ?? "0")
                      .div(exchangeRate)
                      .toString(),
                    decimal: 0,
                    maxDigits: 7,
                  }) +
                  " " +
                  coin?.toLocaleUpperCase()
                : ""
            }`}
            setAmount={(amount: string) => setBetAmount(amount)}
            coin={coin}
            disabled={
              betState ||
              autoBetState ||
              (!isShowAutoBet &&
                wheelStatus !== "Bet" &&
                !betState &&
                holdState) ||
              (isShowAutoBet && autoBetMultiply !== payout)
            }
            value={betAmount}
            onChangeFn={(e: ChangeEvent<HTMLInputElement>) => {
              if (!e.target.value) {
                setBetAmount(null);
              } else {
                const val = validateNumberWithDecimal(e.target.value, {
                  maxDecimal: displayFiat ? 2 : 7,
                  maxInteger: 9999999,
                });

                val && setBetAmount(val);
              }
            }}
            tooltip={`${t("common_56")} : ${
              coin && coin.toLocaleLowerCase() === "hon"
                ? 0
                : limitData && limitData.max_profit
                  ? amountToDisplayFormat(null, "jel", limitData.max_profit)
                  : ""
            }`}
          />
        </div>
      )}
    </div>
  );
};
