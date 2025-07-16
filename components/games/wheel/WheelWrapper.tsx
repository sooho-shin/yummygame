"use client";

import { useEffect, useMemo, useState } from "react";
// import "rc-slider/assets/index.css";
import { useUserStore } from "@/stores/useUser";
import _ from "lodash";
import Image from "next/image";
import styles from "./styles/wheel.module.scss";

import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import { customConsole, formatNumber } from "@/utils";
import { useImmer } from "use-immer";
import AutobetBox from "../AutobetBox";
// import { useGetDiceInfo, usePostDiceDo } from "@/querys/game/dice";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useSocketStore } from "@/stores/useSocket";

import { BetLimitDataType } from "@/types/games/common";
import {
  BetInfo,
  BetResult,
  IWheel,
  IWheelHistory,
  WheelStatusType,
} from "@/types/games/wheel";
import classNames from "classnames";
import { useCookies } from "react-cookie";
import useSound from "use-sound";
import HistoryBoxOfRound from "../HistoryBoxOfRound";
import Wheel from "./Wheel";
import { useGetAssetRefer } from "@/querys/common";

export default function WheelWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { media } = useCommonStore();

  const [cookie] = useCookies();

  const [betSound] = useSound("/music/bet.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const {
    exchangeRate,
    showToast,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    amountToDisplayFormat,
    checkMedia,
    divCoinType,
    gaEventTrigger,
  } = useCommonHook();

  const { token, displayFiat } = useUserStore();
  const { wheelSocket } = useSocketStore();
  const socketWheel = useMemo(() => wheelSocket(token), [wheelSocket, token]);
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);
  const { openModal } = useModalHook();

  //history ani

  const [historyAni, setHistoryAni] = useState(false);
  const { coin } = useAssetStore();

  const [myHistoryData, setMyHistoryData] = useImmer<IWheelHistory[]>([]);
  const [allHistoryData, setAllHistoryData] = useImmer<IWheel[]>([]);
  const [resultHistoryData, setResultHistoryData] = useImmer<
    { success_multiply: number; idx: number }[]
  >([]);

  const t = useDictionary();
  const refetchDelay = 4000;

  // 내 게임 히스토리 위에 16개
  useEffect(() => {
    if (allHistoryData.length) {
      const limit = 25;
      const arr = allHistoryData
        .slice(0, resultHistoryData.length ? 1 : limit)
        .map(o => {
          return {
            success_multiply: o.success_multiply ?? 0,
            idx: o.idx ?? 0,
          };
        })
        .reverse();

      setResultHistoryData(draft => {
        const overSize = draft.length - limit;
        return draft.concat(arr).slice(overSize < 0 ? 0 : overSize);
      });

      setHistoryAni(true);
    }
  }, [allHistoryData]);

  const [currentBettingData, setCurrentBettingData] = useImmer<
    null | BetInfo[]
  >(null);

  // const [selectNumber, setSelectNumber] = useState<string | null>("50.00");

  const [betAmount2x, setBetAmount2x] = useState<string | null>("0.01");
  const [betAmount3x, setBetAmount3x] = useState<string | null>("0.01");
  const [betAmount5x, setBetAmount5x] = useState<string | null>("0.01");
  const [betAmount50x, setBetAmount50x] = useState<string | null>("0.01");

  // useEffect(() => {
  //   const amount = new BigNumber(payOut).times(betAmount ?? "0").toString();
  //   setWinAmount(truncateDecimal({ num: amount, decimalPlaces: 7 }));
  // }, [betAmount, payOut]);

  const [limitData, setLimitData] = useImmer<BetLimitDataType>({
    bnb_max: "0",
    bnb_min: "0",
    btc_max: "0",
    btc_min: "0",
    eth_max: "0",
    eth_min: "0",
    hon_max: "0",
    hon_min: "0",
    jel_max: "0",
    jel_min: "0",
    xrp_max: "0",
    xrp_min: "0",
    usdt_max: "0",
    usdt_min: "0",
    usdc_max: "0",
    usdc_min: "0",
    max_profit: "0",
  });

  const [firstCurrentDataUpdateCount, setFirstCurrentDataUpdateCount] =
    useState(0);
  const { data: assetReferData } = useGetAssetRefer();
  useEffect(() => {
    setBetAmount2x(getLimitAmount({ limitType: "min", limitData: limitData }));
    setBetAmount3x(getLimitAmount({ limitType: "min", limitData: limitData }));
    setBetAmount5x(getLimitAmount({ limitType: "min", limitData: limitData }));
    setBetAmount50x(getLimitAmount({ limitType: "min", limitData: limitData }));
    setAutoBetAmount(
      getLimitAmount({ limitType: "min", limitData: limitData }),
    );
    setFirstCurrentDataUpdateCount(state => state++);
  }, [displayFiat, coin, limitData, exchangeRate, assetReferData]);

  useEffect(() => {
    const payoutArr = [2, 3, 5, 50];
    if (
      currentBettingData &&
      currentBettingData.length > 0 &&
      wheelStatus === "Bet"
    ) {
      // 여기서 잘못됨 currentBettingData 를 먼저 돌리고 그안에 payout 이 있는지 찾아서 넣어야함
      currentBettingData.forEach(obj => {
        payoutArr.forEach(payout => {
          if (obj.betMultiply === payout) {
            const betAmount =
              obj.betMultiply === payout
                ? divCoinType(obj.betAmount, obj.betType)
                : getLimitAmount({ limitType: "min", limitData: limitData });

            switch (obj.betMultiply) {
              case 2:
                setBetAmount2x(betAmount);
                break;
              case 3:
                setBetAmount3x(betAmount);
                break;
              case 5:
                setBetAmount5x(betAmount);
                break;
              case 50:
                setBetAmount50x(betAmount);
                break;
              default:
                break;
            }
          }
        });
      });
    }
  }, [currentBettingData, firstCurrentDataUpdateCount]);

  const [autoBetProfit, setAutoBetProfit] = useState(0);
  const [autoBetState, setAutoBetState] = useState(false);

  // 최초 오토벳 데이터
  const [firstAutoBetData, setFirstAutoBetData] = useImmer<{
    betAmount: string | null;
    numberOfBet: string;
  }>({
    betAmount: null,
    numberOfBet: "",
  });
  const [gameState, setGameState] = useState<"play" | "playEnd" | null>(null);
  const [wheelStatus, setWheelStatus] = useImmer<WheelStatusType>(null);
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);
  const [numberOfBet, setNumberOfBet] = useState("");
  const [playing, setPlaying] = useState(false);
  // 게임 결과

  // export interface BetResult {
  //   userIdx: number;
  //   winYn: "Y" | "N";
  //   profit: string;
  //   multiply: string;
  //   jackpotJel?: string;
  // }

  const [resultData, setResultData] = useImmer<{
    resultMultiply: number | null;
    resultNumber: number | null;
    winYn: "Y" | "N" | null;
    profit: number;
    profitDollar: string | null;
    betCoinType: string | null;
    jackpotJel?: string | null;
    jackpotInfo?: {
      count: number;
      totalJel: string;
      multiply: string;
    } | null;
  }>({
    resultNumber: null,
    winYn: null,
    profit: 0,
    resultMultiply: null,
    profitDollar: null,
    betCoinType: null,
    jackpotInfo: null,
  });

  const [infoData, setInfoData] = useImmer<{
    latest100: {
      "2": number;
      "3": number;
      "5": number;
      "50": number;
    };
    jackInfo: {
      "2": string;
      "3": string;
      "5": string;
      "50": string;
    };
  }>({
    latest100: {
      "2": 0,
      "3": 0,
      "5": 0,
      "50": 0,
    },
    jackInfo: {
      "2": "0",
      "3": "0",
      "5": "0",
      "50": "0",
    },
  });

  const [liveData, setLiveData] = useImmer<{
    "2": BetInfo[];
    "3": BetInfo[];
    "5": BetInfo[];
    "50": BetInfo[];
  }>({
    "2": [],
    "3": [],
    "5": [],
    "50": [],
  });

  // history ani
  useEffect(() => {
    if (historyAni) {
      setTimeout(() => setHistoryAni(false), 1500);
    }
  }, [historyAni]);

  const [autoBetAmount, setAutoBetAmount] = useState<string | null>(null);
  const [autoBetMultiply, setAutoBetMultiply] = useState<number>(2);

  const bet = (
    amount: string | null,
    multiply: number = autoBetMultiply,
    callback: () => void = () => customConsole("bet callback"),
  ) => {
    if (coin.toLocaleUpperCase() === "YYG") {
      showToast(t("main_86"));
      return false;
    }
    if (!multiply) {
      showToast("멀티플라이 없음");
      return false;
    }

    const calculatedAmount = commonValidateGameBet({
      amount,
      autoBetState,
      limitData: limitData,
      playing: false,
      maxBetAmount: isShowAutoBet ? maxBetAmount : null,
    });

    if (!calculatedAmount) {
      reset();
      return false;
    }

    socketWheel?.emit(
      "bet",
      {
        amount: calculatedAmount,
        type: coin.toUpperCase(),
        multiply,
      },
      (data: { code: number; status: "success" | "fail" }) => {
        if (data.code === 0) {
          if (isShowAutoBet) {
            setAutoBetState(true);
          }
          gaEventTrigger({
            category: "Betting",
            action: "click",
            label: "Betting Wheel",
            value: Number(calculatedAmount),
          });

          betSound();
          // 초기 베팅 데이터를 설정하고, 이미 설정되었다면 갱신하지 않음
          if (!firstAutoBetData.betAmount) {
            setFirstAutoBetData({
              betAmount: amount,
              numberOfBet,
            });
          }
          setPlaying(true);
          callback && callback();
        } else {
          showErrorMessage(data.code);
        }
      },
    );
  };

  const endGameFn = () => {
    // setDiceAnimate(false);
  };
  // 리셋 ( 뺄수 없음 오토벳으로 )
  const reset = () => {
    setPlaying(false);
    setAutoBetState(false);
    setAutoBetProfit(0);

    if (Number(firstAutoBetData.betAmount) > 0) {
      setAutoBetAmount(firstAutoBetData.betAmount);
      setNumberOfBet(firstAutoBetData.numberOfBet);
    }

    setFirstAutoBetData({
      betAmount: null,
      numberOfBet: "",
    });
  };

  // 게임 관련 데이터
  const [countImmer, setCountImmer] = useImmer({
    startTimestamp: 0,
    serverTimestamp: 0,
    gapTimeStamp: 0,
  });

  useEffect(() => {
    if (isShowAutoBet) {
      if (autoBetMultiply === 2) {
        setAutoBetAmount(betAmount2x);
      }
      if (autoBetMultiply === 3) {
        setAutoBetAmount(betAmount3x);
      }
      if (autoBetMultiply === 5) {
        setAutoBetAmount(betAmount5x);
      }
      if (autoBetMultiply === 10) {
        setAutoBetAmount(betAmount50x);
      }
      // setAutoBetAmount()
    }
  }, [
    isShowAutoBet,
    autoBetMultiply,
    betAmount2x,
    betAmount3x,
    betAmount5x,
    betAmount50x,
  ]);

  useEffect(() => {
    if (isShowAutoBet) {
      if (autoBetMultiply === 2) {
        setBetAmount2x(autoBetAmount);
      }
      if (autoBetMultiply === 3) {
        setBetAmount3x(autoBetAmount);
      }
      if (autoBetMultiply === 5) {
        setBetAmount5x(autoBetAmount);
      }
      if (autoBetMultiply === 10) {
        setBetAmount50x(autoBetAmount);
      }
    }
  }, [autoBetAmount]);

  // socket

  useEffect(() => {
    if (!socketWheel) {
      return () => false;
    }

    // 에러 테슼트
    socketWheel.on("connection", () => {
      // setSocketErrorState(true);
    });

    // 게임중간에 진입시
    socketWheel.on(
      "currentStatus",
      (socket: {
        gameStatus: "Bet" | "StopBet" | "Create";
        serverTimestamp: number;
        startTimestamp: number;
        gameResult: null | string;
        gameMultiply: number;
        betInfo: BetInfo[];
        limit: BetLimitDataType;
        latest100: {
          "2": number;
          "3": number;
          "5": number;
          "50": number;
        };
        jackInfo: {
          "2": string;
          "3": string;
          "5": string;
          "50": string;
        };
      }) => {
        // setServerTimestamp(socket.serverTimestamp);
        setInfoData(draft => {
          draft.jackInfo = socket.jackInfo;
          draft.latest100 = socket.latest100;
          return draft;
        });

        setLimitData(draft => {
          draft = { ...draft, ...socket.limit };
          return draft;
        });
        if (socket.gameStatus === "Bet") {
          setCurrentBettingData(socket.betInfo);
          setGameState("play");
        } else {
          setGameState("playEnd");
        }

        setWheelStatus(socket.gameStatus);

        setResultData(draft => {
          draft.resultNumber = Number(socket.gameResult ?? "0");
          // draft.resultNumber = Number(socket.gameResult);
          draft.resultMultiply = Number(socket.gameMultiply);
          return draft;
        });

        setCountImmer(draft => {
          draft.startTimestamp = socket.startTimestamp;
          draft.serverTimestamp = socket.startTimestamp;
          draft.gapTimeStamp = new Date().getTime() - socket.serverTimestamp;
        });
      },
    );

    // 베팅 시작
    socketWheel.on(
      "startBet",
      (socket: {
        round: number;
        startTimestamp: number;
        serverTimestamp: number;
        coinPrice: {
          eth: string;
          bnb: string;
          btc: string;
          xrp: string;
          jel: string;
          usdt: string;
          usdc: string;
          jel_lock: string;
        };
        limit: {
          bnb_max: string;
          bnb_min: string;
          btc_max: string;
          btc_min: string;
          eth_max: string;
          eth_min: string;
          hon_max: string;
          hon_min: string;
          jel_max: string;
          jel_min: string;
          xrp_max: string;
          xrp_min: string;
          usdt_max: string;
          usdt_min: string;
          max_profit: string;
        };
        latest100: {
          "2": number;
          "3": number;
          "5": number;
          "50": number;
        };
        jackInfo: {
          "2": string;
          "3": string;
          "5": string;
          "50": string;
        };
      }) => {
        // setIsBet(true);
        setCountImmer(draft => {
          draft.startTimestamp = socket.startTimestamp;
          draft.serverTimestamp = socket.startTimestamp;
          draft.gapTimeStamp = new Date().getTime() - socket.serverTimestamp;
        });
        setInfoData(draft => {
          draft.jackInfo = socket.jackInfo;
          draft.latest100 = socket.latest100;
          return draft;
        });
        //초기화
        setLiveData({
          "2": [],
          "3": [],
          "5": [],
          "50": [],
        });
        setWheelStatus("Bet");
        setGameState("play");
        setResultData(draft => {
          draft.resultMultiply = null;
          draft.winYn = null;
          draft.jackpotJel = null;
          draft.jackpotInfo = null;
          return draft;
        });
      },
    );

    // 베팅 끝
    socketWheel.on("stopBet", (socket: { gameInfo: IWheel }) => {
      if (socket.gameInfo.game_result) {
        setResultData(draft => {
          draft.resultNumber = Number(socket.gameInfo.game_result);
          // draft.resultNumber = 0;
          draft.resultMultiply = Number(socket.gameInfo.success_multiply);
          return draft;
        });

        setCurrentBettingData([]);
        setWheelStatus("StopBet");
        setGameState("playEnd");
      }
    });

    // 개인 게임 결과
    socketWheel.on("result", (socket: BetResult) => {
      setResultData(draft => {
        draft.profit = Number(socket.profit);
        draft.winYn = socket.winYn;
        draft.betCoinType = socket.betCoinType;
        draft.profitDollar = socket.profitDollar;

        if (socket.jackpotJel) {
          draft.jackpotJel = socket.jackpotJel;
        }

        return draft;
      });
    });

    // Jackpot
    socketWheel.on(
      "jackpotInfo",
      (socket: { count: number; totalJel: string; multiply: string }) => {
        setResultData(draft => {
          draft.jackpotInfo = socket;
          return draft;
        });
      },
    );

    //라이브 데이터
    socketWheel.on("liveData", (socket: { betList: BetInfo[] }) => {
      socket.betList.forEach(c => {
        setLiveData(draft => {
          draft[c.betMultiply as 2 | 3 | 5 | 50].push(c);
          return draft;
        });
      });
    });

    //전체 히스토리
    socketWheel.on("wheelHistory", (socket: { list: IWheel[] }) => {
      if (socket.list.length === 1) {
        const cloneData = _.cloneDeep(socket.list[0]);
        setTimeout(() => {
          setAllHistoryData(data => {
            if (allHistoryData.length >= 100) {
              data.pop();
            }
            data.unshift(cloneData);
          });
        }, refetchDelay);
      } else {
        setAllHistoryData(socket.list);
      }
    });

    //마이 히스토리
    socketWheel.on("myHistory", (socket: { list: IWheelHistory[] }) => {
      customConsole("socket === ", socket);
      let whole = true;
      if (socket.list.length <= 4) {
        const checker = socket.list.filter(
          item => item.round !== socket.list[0].round,
        ).length;
        if (checker === 0) whole = false;
      }
      if (!whole) {
        const cloneData = _.cloneDeep(socket.list);
        const dataLen = socket.list.length;
        setTimeout(() => {
          setMyHistoryData(data => {
            if (myHistoryData.length + dataLen > 100) {
              data.splice(myHistoryData.length - dataLen, dataLen);
            }
            data.unshift(...cloneData);
          });
        }, refetchDelay);
      } else {
        setMyHistoryData(socket.list);
      }
    });
    // useEffect cleanup 함수에서 socket 리스너 제거
    return () => {
      socketWheel.removeAllListeners();
      socketWheel.disconnect();
    };
  }, []);

  useEffect(() => {
    //방연결
    if (socketWheel) {
      socketWheel.connect();
    }
  }, [socketWheel]);

  if (!hydrated) return <></>;

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_31")}</span>
        </div>
        <div className={styles["result-container"]}>
          <div className={styles["result-row"]}>
            {hydrated &&
              (resultHistoryData.length > 0 ? (
                <div
                  className={`${styles["coin-row"]} ${
                    historyAni ? styles.ani : ""
                  }`}
                >
                  {resultHistoryData.map((c, i) => (
                    <div
                      key={i}
                      className={
                        c.success_multiply === 2
                          ? styles.payout_2
                          : c.success_multiply === 3
                            ? styles.payout_3
                            : c.success_multiply === 5
                              ? styles.payout_5
                              : c.success_multiply === 50
                                ? styles.payout_50
                                : ""
                      }
                    >
                      {/* <span>{c.success_multiply}</span> */}
                      <span>{c.success_multiply} x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles["not-login-row"]}>{t("game_9")}</p>
              ))}
          </div>
          <div
            className={classNames(styles["wheel-container"], {
              [styles.tablet]: media?.includes("tablet"),
            })}
          >
            {!(
              (checkMedia === "desktop" && media?.includes("tablet")) ||
              checkMedia !== "desktop"
            ) && (
              <div className={styles["last-hendred-history"]}>
                <p>{t("game_32")} </p>
                <div className={styles.content}>
                  <div className={styles["win-chance-row"]}>
                    <span>{infoData.latest100[2]}</span>
                    <span>{infoData.latest100[3]}</span>
                    <span>{infoData.latest100[5]}</span>
                    <span>{infoData.latest100[50]}</span>
                  </div>
                  <div className={styles["progress-bar"]}>
                    <div
                      style={{
                        width: `${infoData.latest100[2]}%`,
                      }}
                    ></div>
                    <div
                      style={{
                        width: `${infoData.latest100[3]}%`,
                      }}
                    ></div>
                    <div
                      style={{
                        width: `${infoData.latest100[5]}%`,
                      }}
                    ></div>
                    <div
                      style={{
                        width: `${infoData.latest100[50]}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles["wheel-box"]}>
              <Wheel
                countImmer={countImmer}
                resultNumber={resultData.resultNumber}
                resultMultiply={resultData.resultMultiply}
                wheelStatus={wheelStatus}
                refetchDelay={refetchDelay}
                jackpotInfo={resultData.jackpotInfo}
                winYn={resultData.winYn}
                playing={playing}
                modal={
                  <div
                    className={styles["win-modal"]}
                    style={{
                      zIndex: resultData?.winYn === "Y" ? 150 : -2,
                    }}
                  >
                    <div className={styles.dim}></div>
                    <div
                      className={`${styles.box} ${
                        resultData?.winYn === "Y" ? styles.active : ""
                      }`}
                    >
                      <div className={styles.content}>
                        <span>{resultData && resultData.resultMultiply} x</span>
                        <div className={styles.info}>
                          <span>
                            {hydrated &&
                              resultData &&
                              amountToDisplayFormat(
                                resultData.profit.toString(),
                                coin,
                                resultData.profitDollar,
                              )}
                          </span>

                          <span
                            className={`${styles.ico}`}
                            style={{
                              backgroundImage: resultData.betCoinType
                                ? `url("/images/tokens/img_token_${resultData.betCoinType.toLocaleLowerCase()}_circle.svg")`
                                : "none",
                            }}
                          ></span>
                        </div>
                      </div>
                    </div>
                    {/* resultData.jackpotJel */}
                    {resultData.jackpotJel && (
                      <div className={`${styles["jackpot-content"]}`}>
                        <p className={styles.sub}>{t("game_34")}</p>
                        <div className={styles.title}></div>
                        <div className={styles["amount-info-box"]}>
                          <span className={styles.amount}>
                            {resultData.jackpotJel
                              ? formatNumber({
                                  value: resultData.jackpotJel,
                                  decimal: 18,
                                  maxDigits: 2,
                                })
                              : "0"}
                          </span>
                          <span className={styles.unit}>J</span>
                        </div>
                        <p className={styles.info}>{t("game_33")}</p>
                      </div>
                    )}
                  </div>
                }
              />
            </div>

            {!(
              (checkMedia === "desktop" && media?.includes("tablet")) ||
              checkMedia !== "desktop"
            ) && (
              <div className={classNames(styles["jackpot-box"])}>
                <div className={styles.title}>
                  <button
                    type="button"
                    className={styles["btn-tooltip"]}
                    onClick={() =>
                      openModal({
                        type: "jackpot",
                      })
                    }
                  ></button>
                </div>
                <div className={styles.row}>
                  <div className={styles.gray}>
                    {hydrated && (
                      <>
                        {!displayFiat && "$ "}
                        {amountToDisplayFormat(
                          infoData.jackInfo[2],
                          "jel",
                          null,
                          false,
                          2,
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.red}>
                    {hydrated && (
                      <>
                        {!displayFiat && "$ "}
                        {amountToDisplayFormat(
                          infoData.jackInfo[3],
                          "jel",
                          null,
                          false,
                          2,
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.blue}>
                    {hydrated && (
                      <>
                        {!displayFiat && "$ "}
                        {amountToDisplayFormat(
                          infoData.jackInfo[5],
                          "jel",
                          null,
                          false,
                          2,
                        )}
                      </>
                    )}
                  </div>
                  <div className={styles.gold}>
                    {hydrated && (
                      <>
                        {!displayFiat && "$ "}
                        {amountToDisplayFormat(
                          infoData.jackInfo[50],
                          "jel",
                          null,
                          false,
                          2,
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!(
            (checkMedia === "desktop" && media?.includes("tablet")) ||
            checkMedia !== "desktop"
          ) && (
            <div className={styles["betting-history-container"]}>
              {[2, 3, 5, 50].map(c => {
                return (
                  <CurrentHistoryBox
                    key={c}
                    payout={c}
                    displayFiat={displayFiat}
                    liveData={liveData[c.toString() as "2" | "3" | "5" | "50"]}
                    resultMultiply={resultData.resultMultiply}
                    refetchDelay={refetchDelay}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      {hydrated && (
        <AutobetBox
          autoBetProfit={autoBetProfit}
          autoBetState={autoBetState}
          bet={(
            amount: string,
            multiply?: number | undefined,
            callback?: () => void,
          ) => bet(amount, multiply, callback)}
          betAmount={autoBetAmount ?? ""}
          endGameFn={endGameFn}
          firstAutoBetData={firstAutoBetData}
          gameState={gameState}
          isShowAutoBet={isShowAutoBet}
          numberOfBet={numberOfBet}
          playing={playing}
          reset={reset}
          resultData={resultData}
          setAutoBetProfit={setAutoBetProfit}
          setAutoBetState={setAutoBetState}
          setBetAmount={setAutoBetAmount}
          setIsShowAutoBet={setIsShowAutoBet}
          setNumberOfBet={setNumberOfBet}
          limitData={limitData}
          nextGameStartDelay={refetchDelay}
          type="WHEEL"
          wheelAutobetData={{
            wheelMultiply: autoBetMultiply,
            setWheelMultiply: setAutoBetMultiply,
            betAmount2x: betAmount2x,
            betAmount3x: betAmount3x,
            betAmount5x: betAmount5x,
            betAmount50x: betAmount50x,
            currentBettingData: currentBettingData,
            refetchDelay: refetchDelay,
            setBetAmount2x: setBetAmount2x,
            setBetAmount3x: setBetAmount3x,
            setBetAmount5x: setBetAmount5x,
            setBetAmount50x: setBetAmount50x,
            setCurrentBettingData: setCurrentBettingData,
            wheelStatus: wheelStatus,
            autoBetMultiply: autoBetMultiply,
          }}
          gameId="2"
          maxBetAmount={maxBetAmount}
          setMaxBetAmount={setMaxBetAmount}
        >
          <></>
        </AutobetBox>
      )}
      {((checkMedia === "desktop" && media?.includes("tablet")) ||
        checkMedia !== "desktop") && (
        <div
          className={classNames(
            styles["betting-history-container"],
            styles.tablet,
          )}
        >
          {[2, 3, 5, 50].map(c => {
            return (
              <CurrentHistoryBox
                key={c}
                payout={c}
                displayFiat={displayFiat}
                liveData={liveData[c.toString() as "2" | "3" | "5" | "50"]}
                tablet={true}
                resultMultiply={resultData.resultMultiply}
                refetchDelay={refetchDelay}
              />
            );
          })}
        </div>
      )}
      {((checkMedia === "desktop" && media?.includes("tablet")) ||
        checkMedia !== "desktop") && (
        <div
          className={classNames(styles["last-hendred-history"], styles.tablet)}
        >
          <p>{t("game_32")} </p>
          <div className={classNames(styles.content, styles.tablet)}>
            <div className={styles["win-chance-row"]}>
              <span>{infoData.latest100[2]}</span>
              <span>{infoData.latest100[3]}</span>
              <span>{infoData.latest100[5]}</span>
              <span>{infoData.latest100[50]}</span>
            </div>
            <div className={styles["progress-bar"]}>
              <div
                style={{
                  width: `${infoData.latest100[2]}%`,
                }}
              ></div>
              <div
                style={{
                  width: `${infoData.latest100[3]}%`,
                }}
              ></div>
              <div
                style={{
                  width: `${infoData.latest100[5]}%`,
                }}
              ></div>
              <div
                style={{
                  width: `${infoData.latest100[50]}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {((checkMedia === "desktop" && media?.includes("tablet")) ||
        checkMedia !== "desktop") && (
        <div className={classNames(styles["jackpot-box"], styles.tablet)}>
          <div className={styles.title}>
            <button
              type="button"
              className={styles["btn-tooltip"]}
              onClick={() =>
                openModal({
                  type: "jackpot",
                })
              }
            ></button>
          </div>
          <div className={styles.row}>
            <div className={styles.gray}>
              {hydrated && (
                <>
                  {!displayFiat && "$ "}
                  {amountToDisplayFormat(infoData.jackInfo[2], "jel")}
                </>
              )}
            </div>
            <div className={styles.red}>
              {hydrated && (
                <>
                  {!displayFiat && "$ "}
                  {amountToDisplayFormat(infoData.jackInfo[3], "jel")}
                </>
              )}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.blue}>
              {hydrated && (
                <>
                  {!displayFiat && "$ "}
                  {amountToDisplayFormat(infoData.jackInfo[5], "jel")}
                </>
              )}
            </div>
            <div className={styles.gold}>
              {hydrated && (
                <>
                  {!displayFiat && "$ "}
                  {amountToDisplayFormat(infoData.jackInfo[50], "jel")}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <HistoryBoxOfRound
        refetchDelay={refetchDelay}
        myHistoryData={myHistoryData}
        allHistoryData={allHistoryData}
        type={"wheel"}
      />
    </div>
  );
}

const CurrentHistoryBox = ({
  payout,
  liveData,
  tablet = false,
  resultMultiply,
  refetchDelay,
}: {
  displayFiat: string | null;
  payout: number;
  liveData: BetInfo[];
  tablet?: boolean;
  resultMultiply: number | null;
  refetchDelay: number;
}) => {
  const [sumDollar, setSumDollar] = useState(0);
  const [hasOwnDataOne, setHasOwnDataOne] = useState(false);
  const { amountToDisplayFormat } = useCommonHook();
  const t = useDictionary();

  useEffect(() => {
    const sum = _.sumBy(liveData, item => parseFloat(item.betDollar));
    const isOwnData = _.some(liveData, { ownData: 1 });

    setHasOwnDataOne(isOwnData);
    setSumDollar(sum);
  }, [liveData]);

  const [customResultMultiply, setCustomResultMultiply] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (resultMultiply) {
      setTimeout(() => {
        setCustomResultMultiply(resultMultiply);
      }, refetchDelay);
    } else {
      setCustomResultMultiply(null);
    }
  }, [resultMultiply]);

  const [dropdownState, setDropdownState] = useState(false);

  return (
    <div className={classNames(styles.box, { [styles.tablet]: tablet })}>
      <div
        className={classNames(
          styles.title,
          styles[`payout_${payout.toString() as "2" | "3" | "5" | "50"}`],
        )}
      >
        {tablet ? (
          <button
            type="button"
            onClick={() => setDropdownState(!dropdownState)}
          >
            {hasOwnDataOne && <div className={styles.gradient}></div>}
            <div className={styles["player-info"]}>
              <span
                className={classNames(
                  styles[
                    `payout_${payout.toString() as "2" | "3" | "5" | "50"}`
                  ],
                )}
              >
                {liveData.length} {t("game_12")}
              </span>
            </div>
            <div className={styles["payout-info"]}>
              <span
                className={classNames({
                  [styles.active]: customResultMultiply === payout,
                })}
              >
                {sumDollar &&
                  amountToDisplayFormat(
                    null,
                    "jel",
                    sumDollar.toString(),
                    false,
                    2,
                  )}
              </span>
              <Image
                src="/images/common/ico_arrow_w.svg"
                alt="img arrow"
                width="24"
                height="24"
                priority
                style={{
                  transform: `rotate(${dropdownState ? "180" : "0"}deg)`,
                }}
              />
            </div>
          </button>
        ) : (
          <>
            {hasOwnDataOne && !tablet && (
              <div className={styles.gradient}></div>
            )}
            <span>{payout} x</span>
          </>
        )}
      </div>
      <div className={styles.content}>
        {!tablet && (
          <div className={styles.top}>
            <span>{liveData.length} Player</span>
            <span
              className={classNames({
                [styles.active]: customResultMultiply === payout,
              })}
            >
              {sumDollar &&
                amountToDisplayFormat(
                  null,
                  "jel",
                  sumDollar.toString(),
                  false,
                  2,
                )}
            </span>
          </div>
        )}
        {((tablet && dropdownState) || !tablet) && (
          <div
            className={classNames(styles.scroll, { [styles.tablet]: tablet })}
          >
            {liveData.length > 0 ? (
              liveData.map((c, i) => {
                return (
                  <div className={styles.row} key={i}>
                    <div>
                      <span
                        className={styles.avatar}
                        style={{
                          backgroundImage: `url('/images/avatar/img_avatar_${
                            c.avatarIdx || "hidden"
                          }.webp')`,
                        }}
                      ></span>
                      <span
                        className={`${styles.nick} ${
                          c.ownData === 1 ? styles.my : ""
                        }`}
                      >
                        {c.nickName || "Hidden"}
                      </span>
                    </div>
                    <div>
                      <span
                        className={classNames(styles.amount, {
                          [styles.my]: c.ownData === 1,
                          [styles.active]: customResultMultiply === payout,
                        })}
                      >
                        {amountToDisplayFormat(c.betAmount, c.betType)}
                      </span>
                      <span
                        className={`${styles.coin}`}
                        style={{
                          backgroundImage: `url('/images/tokens/img_token_${c.betType.toLocaleLowerCase()}_circle.svg')`,
                        }}
                      ></span>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
