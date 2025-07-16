"use client";

import CommonButton from "@/components/common/Button";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import { useSocketStore } from "@/stores/useSocket";
import { useUserStore } from "@/stores/useUser";
import { CookieOption } from "@/utils";
import Draggable from "react-draggable";

import { BetLimitDataType } from "@/types/games/common";
import {
  BetInfo,
  CrashGameStatusType,
  ICrash,
  ICrashHistory,
} from "@/types/games/crash";
import { truncateDecimal, validateNumberWithDecimal } from "@/utils";
import { BigNumber } from "bignumber.js";
import classNames from "classnames";
import _ from "lodash";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQueue } from "react-use";
import { useImmer } from "use-immer";
import useSound from "use-sound";
import AutobetBox from "../AutobetBox";
import HistoryBoxOfRound from "../HistoryBoxOfRound";
import CrashContainer from "./Crash";
import styles from "./styles/crash.module.scss";
import useModalHook from "@/hooks/useModalHook";

export default function CrashWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const t = useDictionary();
  const { token, displayFiat } = useUserStore();

  const [resultHistoryData, setResultHistoryData] = useImmer<
    { game_result: string; idx: number }[] | []
  >([]);

  const [cookie, setCookie] = useCookies();

  const [betSound] = useSound("/music/bet.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [boomSound] = useSound("/music/boom.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [successSound] = useSound("/music/success.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const { coin } = useAssetStore();
  const { refetch: refetchCommonData } = useGetCommon(token);
  const [isShowWinModal, setIsShowWinModal] = useState(false);
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);
  const { add: qAdd, first: qFirst, remove: qRemove } = useQueue<BetInfo>();

  const {
    exchangeRate,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    amountToDisplayFormat,
    gaEventTrigger,
    showToast,
  } = useCommonHook();

  useEffect(() => {
    if (isShowWinModal) {
      setTimeout(() => setIsShowWinModal(false), 2100);
    }
  }, [isShowWinModal]);

  const refetchDelay = 4000;

  const [allHistoryData, setAllHistoryData] = useImmer<ICrash[]>([]);
  const [myHistoryData, setMyHistoryData] = useImmer<ICrashHistory[]>([]);
  const [historyAni, setHistoryAni] = useState(false);
  const draggableRef = useRef<HTMLDivElement>(null);

  // 내 게임 히스토리 위에 16개

  useEffect(() => {
    if (allHistoryData.length > 0) {
      const arr: { game_result: string; idx: number }[] = [];

      const slicedArr = allHistoryData.slice(0, 16);

      for (const o of slicedArr) {
        const data: { game_result: string; idx: number } = {
          game_result: o.game_result ?? "0",
          idx: o.idx ?? 0,
        };

        arr.unshift(data);
      }
      setResultHistoryData(draft => {
        draft.slice(0, 16 - arr.length);
        draft = [...draft, ...arr];
        return draft;
      });
      setHistoryAni(true);
    }
  }, [allHistoryData]);

  // history ani
  useEffect(() => {
    if (historyAni) {
      setTimeout(() => setHistoryAni(false), 1500);
    }
  }, [historyAni]);

  // ************************************************************************************

  const [autoBetProfit, setAutoBetProfit] = useState(0);
  const [autoBetState, setAutoBetState] = useImmer(false);
  // 최초 오토벳 데이터
  const [firstAutoBetData, setFirstAutoBetData] = useImmer<{
    betAmount: string | null;
    numberOfBet: string;
  }>({
    betAmount: null,
    numberOfBet: "",
  });
  const [gameState, setGameState] = useState<"play" | "playEnd" | null>(null);
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);
  const [isShowHalfCashOut, setIsShowHalfCashOut] = useState(false);
  const [numberOfBet, setNumberOfBet] = useState("");
  const [playing, setPlaying] = useState(false);
  const [holdState, setHoldState] = useState(false);

  useEffect(() => {
    if (isShowAutoBet) {
      setIsShowHalfCashOut(false);
    }
  }, [isShowAutoBet]);

  useEffect(() => {
    if (isShowHalfCashOut) {
      setIsShowAutoBet(false);
    }
  }, [isShowHalfCashOut]);

  useEffect(() => {
    setHoldState(false);
    setPlaying(false);
  }, [coin]);

  const [betAmount, setBetAmount] = useState<string | null>("0.01");
  // 내가 지금 벳을 걸었는지 안  걸었는지
  const [currentBetData, setCurrentBetData] = useImmer<{
    betAmount: string | null;
    betCashout: string | null;
    betCoin: string | null;
  }>({
    betAmount: null,
    betCashout: null,
    betCoin: null,
  });

  const [multiply, setMultiply] = useState<string | null>(
    cookie.multiply ?? "100",
  );

  const [resultData, setResultData] = useImmer<{
    resultMultiply: string | null;
    winYn: "Y" | "N" | null;
    profit: number;
    profitDollar: string | null;
    betCoinType: string | null;
    halfCashOutState: boolean;
  }>({
    winYn: null,
    profit: 0,
    resultMultiply: null,
    profitDollar: null,
    betCoinType: null,
    halfCashOutState: false,
  });

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
    // max_profit_fiat: {
    //   usd: "0",
    //   eur: "0",
    //   jpy: "0",
    //   gbp: "0",
    //   aud: "0",
    //   cad: "0",
    //   cny: "0",
    //   krw: "0",
    // },
  });

  const { data: assetReferData } = useGetAssetRefer();
  useEffect(() => {
    setBetAmount(getLimitAmount({ limitType: "min", limitData: limitData }));
  }, [displayFiat, coin, limitData, exchangeRate, assetReferData]);
  // 현재 rate
  const [rate, setRate] = useState("0");
  // net work ping
  const [, setNetworkPing] = useState<number>(0);

  // 게임 토탈 데이터
  const [totalData, setTotalData] = useImmer<{
    gameId: string;
    realHistoryData: BetInfo[];
    players: string;
    dollar: string;
  }>({
    gameId: "0",
    realHistoryData: [],
    players: "0",
    dollar: "0",
  });

  const { crashSocket } = useSocketStore();
  const socketCrash = useMemo(() => crashSocket(token), [crashSocket, token]);
  // const socketCrash = socket();

  // ------------------ 여기까지 임시 -----------------
  // 게임 결과용 데이터
  const [gameData, setGameData] = useImmer<{
    startTimeStamp: number;
    count: number | null;
    resultRate: number;
    gapTimeStamp: number;
    betStartTimeStamp: number;
    status: CrashGameStatusType | null;
  }>({
    startTimeStamp: new Date().getTime(),
    count: 0,
    resultRate: 0,
    gapTimeStamp: 0,
    betStartTimeStamp: 0,
    status: null,
  });

  // 캐쉬아웃
  const cashOut = (isHalf: 0 | 1 = 0) => {
    socketCrash?.emit(
      "cashOut",
      {
        isHalf: isHalf,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data: any) => {
        showErrorMessage(data.code);
      },
    );
    return true;
  };

  // 베팅 벨리데이션 체크

  useEffect(() => {
    if (!autoBetState) {
      setHoldState(false);
    }
  }, [autoBetState]);

  const [betLoadingState, setBetLoadingState] = useState(false);

  // bet
  const bet = (amount: string | null) => {
    if (coin.toLocaleUpperCase() === "YYG") {
      showToast(t("main_86"));
      return false;
    }

    if (!holdState && !autoBetState && playing) {
      reset();
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

    if (!multiply) return false;

    if (isShowAutoBet) {
      setAutoBetState(true);
      setHoldState(true);
    }

    if (gameData.status !== "Bet" && !holdState) {
      setHoldState(true);
      setPlaying(true);
    }

    if (!isShowAutoBet && holdState && gameData.status !== "Bet") {
      setHoldState(false);
      setPlaying(false);
    }

    if (gameData.status !== "Bet") {
      return false;
    }

    setBetLoadingState(true);

    socketCrash?.emit(
      "bet",
      {
        amount: calculatedAmount,
        autoCashOut: multiply,
        type: coin.toLocaleUpperCase(),
        enableTwice: isShowHalfCashOut ? 1 : 0,
      },

      (data: {
        status: string;
        code: number;
        message: string;
        info: {
          userIdx: number;
          nickName: string;
          avatarIdx: number;
          betAmount: string;
          betDollar: string;
          betType: string;
          autoCashOut: string;
          enableTwice: number;
          gameLogIdx: number;
        };
      }) => {
        gaEventTrigger({
          category: "Betting",
          action: "click",
          label: "Betting crash",
          value: Number(calculatedAmount),
        });
        setBetLoadingState(false);
        if (data.code === 0 && gameData.status !== "PlayEnd") {
          setLoadingState(true);
          if (!firstAutoBetData.betAmount) {
            setFirstAutoBetData({
              betAmount: amount,
              numberOfBet,
            });
          }

          betSound();

          setCookie("multiply", multiply, CookieOption);
          setPlaying(true);
          // console.log(data);
          if (data.status === "success") {
            setCurrentBetData(draft => {
              draft.betAmount = data.info.betAmount;
              draft.betCashout = data.info.autoCashOut;
              draft.betCoin = data.info.betType;

              return draft;
            });
            if (!isShowAutoBet) {
              setHoldState(false);
            }

            refetchCommonData();
          }
        } else {
          showErrorMessage(data.code);
          reset();
        }
      },
    );
    return false;
  };

  // 게임 시작
  const startGame = (gameStartTimeStamp: number, serverTimestamp: number) => {
    setGameData(draft => {
      draft.startTimeStamp = gameStartTimeStamp;
      draft.gapTimeStamp = new Date().getTime() - serverTimestamp;
      draft.status = "Play";
      return draft;
    });

    // playSoundStart();
    const startPing = Date.now();
    socketCrash?.emit("networkPing", () => {
      setNetworkPing((Date.now() - startPing) / 1000);
    });
  };

  // 게임 끝
  const endGame = (successMultiply: number) => {
    setGameState("playEnd");
    setGameData(draft => {
      draft.resultRate = successMultiply;
      draft.status = "PlayEnd";
      return draft;
    });
  };

  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (!(gameData.status === "Bet" || gameData.status === "BetStop")) {
      setLoadingState(false);
    }
  }, [gameData.status, playing]);

  useEffect(() => {
    if (gameData.status === "Bet" && holdState) {
      bet(betAmount);
    }

    if (gameData.status !== "PlayEnd" && gameData.status !== "BetReady") {
      setGameState("play");
    }
    if (gameData.status === "PlayEnd") {
      setGameState("playEnd");
    }
  }, [gameData.status]);

  const [roadmapData, setRoadmapData] = useImmer<ICrash[][]>([]);
  const [newRoadmapData, setNewRoadmapData] = useImmer<ICrash | null>(null);

  useEffect(() => {
    if (newRoadmapData) {
      // roadmap

      const MAX_ROWS = 14;
      const resultValue = parseFloat(newRoadmapData.game_result);

      // 현재 마지막 줄과 마지막 값
      const lastRow = roadmapData[roadmapData.length - 1];
      const lastGameInRow = lastRow[lastRow.length - 1];
      const lastResultValue = parseFloat(lastGameInRow.game_result);

      // 마지막 줄의 마지막 게임 결과와 비교하여 2배 이상의 차이가 있는지 확인
      const isOverTwo = resultValue >= 2;
      const wasOverTwo = lastResultValue >= 2;

      // 같은 조건이면 마지막 줄에 추가, 아니면 새로운 줄 추가
      if (
        isOverTwo === wasOverTwo &&
        roadmapData[roadmapData.length - 1].length < 6
      ) {
        setRoadmapData(draft => {
          draft[draft.length - 1].unshift(newRoadmapData);
          return draft;
        });
      } else {
        setRoadmapData(draft => {
          draft.push([newRoadmapData]);
          // 줄이 14개를 넘으면 첫 번째 줄을 삭제
          if (draft.length > MAX_ROWS) {
            draft.shift();
          }
          return draft;
        });
      }
    }
  }, [newRoadmapData]);

  function splitResultsByThreshold(
    data: ICrash[],
    maxRows: number,
  ): ICrash[][] {
    // 최신 데이터를 마지막에 오도록 idx 기준 내림차순 정렬
    const sortedData = [...data].sort((a, b) => b.idx - a.idx);

    const result: ICrash[][] = [];
    let currentRow: ICrash[] = [];

    for (const game of sortedData) {
      if (currentRow.length === 0) {
        currentRow.push(game);
      } else {
        const lastGameResult = parseFloat(
          currentRow[currentRow.length - 1].game_result,
        );
        const currentGameResult = parseFloat(game.game_result);

        // 같은 줄에 있는 데이터는 2배 이하 or 이상인 애들끼리 묶음
        if (
          ((lastGameResult < 2 && currentGameResult < 2) ||
            (lastGameResult >= 2 && currentGameResult >= 2)) &&
          currentRow.length < 6
        ) {
          currentRow.push(game);
        } else {
          result.push(currentRow);
          currentRow = [game];
        }
      }

      // 최대 줄 수를 초과하면 종료
      if (result.length >= maxRows) {
        break;
      }
    }

    if (currentRow.length > 0 && result.length < maxRows) {
      result.push(currentRow);
    }

    // 가장 최신 데이터가 마지막 줄에 위치해야 하므로 결과를 역순으로 반환
    return result.reverse();
  }

  // socket 시작
  useEffect(() => {
    if (!socketCrash) {
      return () => false;
    }

    // Crash 방 연결
    socketCrash.connect();

    // 에러
    socketCrash.on("connect_error", () => {
      // handleSocketError();
    });

    // 에러 테슼트
    socketCrash.on("connection", () => {});
    // 소켓 연결
    const startPing = Date.now();

    socketCrash.on("connect", () => {
      setNetworkPing((Date.now() - startPing) / 1000);
    });

    // 게임 중간에 진입시 current status
    socketCrash.on(
      "currentStatus",
      (socket: {
        status: CrashGameStatusType;
        startTimestamp: number;
        betInfo: {
          nickName: string;
          avatarIdx: number;
          betAmount: string;
          betDollar: string;
          betType: string;
          autoCashOut: string;
          enableTwice: number;
          gameLogIdx: number;
          cashOutMultiply50: string;
          earnAmount50: string;
          earnDollar50: string;
          cashOutMultiply100: string;
          earnAmount100: string;
          earnDollar100: string;
        };
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
        limit: BetLimitDataType;
        betStartTimestamp: number;
        preData: {
          seed: string;
          round: string;
        };
        serverTimestamp: number;
        successMultiply: number;
      }) => {
        setLimitData(socket.limit);

        setGameData(draft => {
          draft.status = socket.status;
          draft.resultRate = socket.successMultiply;
        });
        if (socket.status === "Play") {
          startGame(socket.startTimestamp, socket.serverTimestamp);

          if (!socket.betInfo) {
            return false;
          } else {
            // 중간 진입 해야함
            if (!socket.betInfo.cashOutMultiply100) {
              setCurrentBetData(draft => {
                draft.betAmount = socket.betInfo.betAmount;
                draft.betCashout = socket.betInfo.autoCashOut;
                draft.betCoin = socket.betInfo.betType;
                return draft;
              });

              setPlaying(true);

              socket.betInfo.enableTwice === 1 && setIsShowHalfCashOut(true);

              if (socket.betInfo.cashOutMultiply50) {
                setResultData(draft => {
                  draft.halfCashOutState = true;
                  draft.profit = socket.betInfo.earnAmount100
                    ? Number(socket.betInfo.earnAmount100)
                    : socket.betInfo.earnAmount50
                      ? Number(socket.betInfo.earnAmount50)
                      : 0;

                  return draft;
                });
              }
            }
          }
        }

        if (socket.status === "Bet" || socket.status === "BetReady") {
          //
          setGameData(draft => {
            draft.betStartTimeStamp = socket.betStartTimestamp;
            draft.gapTimeStamp = new Date().getTime() - socket.serverTimestamp;
          });
        }
      },
    );

    // 방 연결 해제
    socketCrash.on("disconnect", () => {
      // setSocketErrorState(true);
      // handleSocketError();
    });

    // 게임시작
    socketCrash.on(
      "startGame",
      (socket: { startTimestamp: number; serverTimestamp: number }) => {
        // setGameId
        startGame(socket.startTimestamp, socket.serverTimestamp);
        setLoadingState(false);
      },
    );

    // 게임끝남
    socketCrash.on(
      "endGame",
      (socket: { round: string; seed: string; successMultiply: number }) => {
        boomSound();
        endGame(socket.successMultiply);
      },
    );

    // cash 아웃 결과
    socketCrash.on("cashOutSuccess", (socket: BetInfo) => {
      // refetchAssets();
      setResultData(draft => {
        if (socket.cashOutMultiply50) {
          draft.halfCashOutState = true;
        }

        draft.profit = socket.earnAmount100
          ? Number(socket.earnAmount100)
          : socket.earnAmount50
            ? Number(socket.earnAmount50)
            : 0;

        draft.profitDollar = socket.earnDollar100 ?? socket.earnDollar50!;
        draft.resultMultiply = socket.cashOutMultiply100
          ? socket.cashOutMultiply100
          : socket.cashOutMultiply50
            ? socket.cashOutMultiply50
            : null;
        draft.winYn = "Y";
        draft.betCoinType = socket.betType as string;
        return draft;
      });
      if (socket.cashOutMultiply100) {
        // 확인해보자();
        setPlaying(false);
      }
      setIsShowWinModal(true);

      refetchCommonData();

      successSound();
    });

    // 대기상태 카운트
    socketCrash.on(
      "betStatus",
      (socket: {
        gameId: string;
        startTimestamp: number;
        betStatus: "BetReady" | "Bet" | "BetStop";
        serverTimestamp: number;
      }) => {
        if (socket.betStatus === "BetReady") {
          setGameState("play");
          setTotalData(draft => {
            draft.gameId = socket.gameId;
            draft.players = "0";
            draft.dollar = "0";
            draft.realHistoryData = [];
            return draft;
          });

          setResultData(draft => {
            draft.halfCashOutState = false;
            draft.profit = 0;
            draft.resultMultiply = null;
            draft.winYn = null;
            draft.betCoinType = null;
            return draft;
          });

          setCurrentBetData({
            betAmount: null,
            betCashout: null,
            betCoin: null,
          });
        }

        setGameData(draft => {
          // 10ms 미만으로 두개의 BetStop과 Play상태가 변할 수 있어서 네트워크 상황에 따라 버그 발생 여지가 있음.
          // Play상태인데 BetStop이벤트가 넘어오면 무시.
          if (socket.betStatus === "BetStop" && draft.status === "Play") {
            return draft;
          }
          draft.betStartTimeStamp = socket.startTimestamp;
          draft.status = socket.betStatus;
          draft.gapTimeStamp = new Date().getTime() - socket.serverTimestamp;
          return draft;
        });
      },
    );

    socketCrash.on(
      "liveData",
      (socket: {
        gameId: string;
        count: number;
        dollar: string;
        betList: BetInfo[];
      }) => {
        setTotalData(draft => {
          if (draft.gameId !== socket.gameId) {
            draft.realHistoryData = [];
          }
          draft.gameId = socket.gameId;
          draft.players = socket.count ? socket.count.toString() : "0";
          draft.dollar = socket.dollar ? socket.dollar : "0";
          draft.realHistoryData.push(...socket.betList);

          return draft;
        });
      },
    );

    // cashout member
    socketCrash.on("liveCashOut", (socket: BetInfo) => {
      qAdd(socket);
      // setCurrentCahOutUser(draft => {
      //   draft.push(socket as never);
      //   return draft;
      // });
      setTotalData(draft => {
        const filtered = draft.realHistoryData.filter(
          e => e.gameLogIdx !== socket.gameLogIdx,
        );
        draft.realHistoryData = [socket, ...filtered];
      });
    });

    // game all history
    socketCrash.on("crashHistory", (socket: { list: ICrash[] }) => {
      // 여기
      if (socket.list.length === 1) {
        const cloneData = _.cloneDeep(socket.list[0]);
        setTimeout(() => {
          setAllHistoryData(data => {
            if (allHistoryData.length >= 100) {
              data.pop();
            }
            data.unshift(cloneData);
          });
          setNewRoadmapData(cloneData);
        }, refetchDelay);
      } else {
        setAllHistoryData(socket.list);
        setRoadmapData(splitResultsByThreshold(socket.list, 7));
      }
    });

    // game all history
    socketCrash.on("userHistory", (socket: { list: ICrashHistory[] }) => {
      if (socket.list.length === 1) {
        const cloneData = _.cloneDeep(socket.list[0]);
        setTimeout(() => {
          setMyHistoryData(data => {
            if (myHistoryData.length >= 100) {
              data.pop();
            }
            data.unshift(cloneData);
          });
        }, refetchDelay);
      } else {
        setMyHistoryData(socket.list);
      }
    });

    // 재 연결 테스트
    socketCrash.on("reconnect", () => {});

    return () => {
      socketCrash.removeAllListeners();
      socketCrash.disconnect();
    };
  }, [socketCrash, successSound, boomSound]);

  const endGameFn = () => {
    if (currentBetData.betAmount) {
      setResultData(draft => {
        draft.winYn = draft.winYn === "Y" ? draft.winYn : "N";
        return draft;
      });
    }
  };

  const reset = () => {
    if (!holdState || (autoBetState && holdState)) {
      setPlaying(false);
      setAutoBetState(false);
    }
    // 확인해보자();

    // if (isShowAutoBet) {

    // }
    setAutoBetProfit(0);
    if (!autoBetState) {
      setFirstAutoBetData({
        betAmount: null,
        numberOfBet: "",
      });
    }
  };

  useEffect(() => {
    if (!autoBetState && isShowAutoBet) {
      if (Number(firstAutoBetData.betAmount) > 0) {
        setBetAmount(firstAutoBetData.betAmount);
        setNumberOfBet(firstAutoBetData.numberOfBet);
      }
    }
  }, [autoBetState]);
  // game_1	로딩 중
  // game_2	현금 인출
  // game_3	오토 베팅 중지
  // game_4	오토 베팅 시작
  // game_61 베팅
  const betText: {
    text: string;
    value: "loading" | "cashout" | "stopAutoBet" | "autoBet" | "bet";
  } = useMemo(() => {
    if (loadingState || (!isShowAutoBet && holdState)) {
      return {
        text: t("game_1"),
        value: "loading",
      };
    }
    if (
      playing &&
      !autoBetState &&
      !loadingState &&
      currentBetData.betCoin &&
      currentBetData.betAmount &&
      gameData.status !== "PlayEnd"
    ) {
      return {
        text: t("game_2"),
        value: "cashout",
      };
    }

    if (autoBetState) {
      return {
        text: t("game_3"),
        value: "stopAutoBet",
      };
    }
    if (isShowAutoBet && !autoBetState) {
      return {
        text: t("game_4"),
        value: "autoBet",
      };
    }
    return {
      text: t("game_61"),
      value: "bet",
    };
  }, [
    autoBetState,
    playing,
    isShowAutoBet,
    loadingState,
    holdState,
    currentBetData,
    gameData.status,
  ]);

  const betSubText = (half: boolean) => {
    if (!isShowAutoBet && holdState && gameData.status !== "Bet") {
      return <span className={styles.cancel}>{t("game_5")}</span>;
    }

    if (gameData.status !== "Bet" && !isShowAutoBet && !holdState && !playing) {
      return <span className={styles.nextround}>{t("game_6")}</span>;
    }

    if (
      playing &&
      !autoBetState &&
      !loadingState &&
      currentBetData.betCoin &&
      currentBetData.betAmount &&
      gameData.status !== "PlayEnd"
    ) {
      return (
        <p className={styles["current-rate-row"]}>
          <span className={styles.amount}>
            {amountToDisplayFormat(
              half && resultData.profit
                ? new BigNumber(resultData.profit).toFixed(10)
                : new BigNumber(currentBetData.betAmount)
                    .times(rate)
                    .div(half ? 2 : 1)
                    .div(!half && resultData.halfCashOutState ? 2 : 1)
                    .toFixed(10),
              currentBetData.betCoin,
              null,
              false,
              7,
            )}
          </span>
          <span
            className={`${styles.ico} `}
            style={{
              backgroundImage: `url('/images/tokens/img_token_${currentBetData.betCoin.toLocaleLowerCase()}_circle.svg')`,
            }}
          ></span>
        </p>
      );
    }

    return <></>;
  };

  const crashRate: (result: string) => "rate-1" | "rate-2" | "rate-10" = (
    result: string,
  ) => {
    if (Number(result) < 2) {
      return "rate-1";
    }
    if (Number(result) >= 2 && Number(result) < 10) {
      return "rate-2";
    }

    if (Number(result) >= 10) {
      return "rate-10";
    }

    return "rate-1";
  };

  const { openModal } = useModalHook();
  const RoadMapContainer = useMemo(() => {
    if (!hydrated) return <></>;
    return (
      <Draggable nodeRef={draggableRef}>
        <div className={styles["roadmap-box"]} ref={draggableRef}>
          <div className={styles["roadmap-content"]}>
            <button
              type={"button"}
              className={styles["close-btn"]}
              onClick={() => setShowRoadMapContainer(false)}
            ></button>
            <div className={styles.top}>
              <span>{t("game_75")}</span>
            </div>
            <div className={styles.roadmap}>
              <div className={styles.content}>
                {Array.from({ length: 14 }).map((_, j) => {
                  return (
                    <div key={j}>
                      {Array.from({ length: 6 }).map((_, i) => {
                        return (
                          <div key={i}>
                            <div
                              className={classNames(styles.ball, {
                                [styles.pink]:
                                  roadmapData[j] &&
                                  roadmapData[j][i] &&
                                  Number(roadmapData[j][i].game_result) >= 10,
                                [styles.blue]:
                                  roadmapData[j] &&
                                  roadmapData[j][i] &&
                                  Number(roadmapData[j][i].game_result) >= 2 &&
                                  Number(roadmapData[j][i].game_result) < 10,
                                [styles.purple]:
                                  roadmapData[j] &&
                                  roadmapData[j][i] &&
                                  Number(roadmapData[j][i].game_result) < 2,
                              })}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.trend}>
              <button
                type={"button"}
                onClick={() => openModal({ type: "trend" })}
              >
                <span></span>
                <span>{t("game_76")}</span>
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    );
  }, [roadmapData, hydrated]);
  const [showRoadMapContainer, setShowRoadMapContainer] = useState(false);

  const winModal = useMemo(() => {
    return (
      <div
        className={styles["win-modal"]}
        style={{
          zIndex: resultData?.winYn === "Y" && isShowWinModal ? 150 : -2,
        }}
      >
        <div
          className={`${styles.box} ${
            resultData?.winYn === "Y" && isShowWinModal ? styles.active : ""
          }`}
        >
          <div className={styles.content}>
            <span>{resultData && resultData.resultMultiply} x</span>
            <div className={styles.info}>
              <span>
                {hydrated &&
                  resultData &&
                  amountToDisplayFormat(
                    resultData?.profit.toString() || "0",
                    resultData.betCoinType || "jel",
                    // resultData.profitDollar,
                  )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${
                    resultData?.betCoinType
                      ? resultData?.betCoinType.toLocaleLowerCase()
                      : "eth"
                  }_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [isShowWinModal]);

  const { media } = useCommonStore();

  const { checkMedia, loadingPreloadImages } = useCommonHook();

  useEffect(() => {
    const imageList = [
      "/images/game/crash/img_bomb.gif",
      "/images/game/crash/img_fire.gif",
      "/images/game/crash/img_rocket.webp",
      "/images/game/crash/img_crash_bg.webp",
      "/images/game/crash/img_planet.webp",
      "/images/game/crash/img_crash_bg_top.webp",
    ];
    loadingPreloadImages(imageList);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles.gradation}></div>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_8")}</span>
        </div>
        <div className={styles["result-container"]}>
          <div className={styles["result-chart-row"]}>
            <div className={styles["result-row"]}>
              {hydrated &&
                (resultHistoryData.length > 0 ? (
                  <div
                    className={`${styles["coin-row"]} ${
                      historyAni ? styles.ani : ""
                    }`}
                  >
                    {resultHistoryData.map((c, i) => (
                      <div key={i} className={styles[crashRate(c.game_result)]}>
                        <span>{c.game_result} x</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles["not-login-row"]}>{t("game_9")}</p>
                ))}
            </div>
            <div className={styles["roadmap-container"]}>
              <button
                type={"button"}
                onClick={() => setShowRoadMapContainer(!showRoadMapContainer)}
                className={showRoadMapContainer ? styles.active : ""}
              ></button>
              {showRoadMapContainer && hydrated && RoadMapContainer}
            </div>
          </div>
          <CrashContainer
            resultRate={gameData.resultRate}
            startTimeStamp={gameData.startTimeStamp}
            gapTimeStamp={gameData.gapTimeStamp}
            betStartTimeStamp={gameData.betStartTimeStamp}
            status={gameData.status}
            setCurrentRate={setRate}
            winModal={winModal}
            qFirst={qFirst}
            qRemove={qRemove}
          >
            <CurrentHistoryBox
              realHistoryData={totalData.realHistoryData}
              gameState={gameState}
              totalDollar={totalData.dollar}
              userCount={totalData.players}
            />
          </CrashContainer>
        </div>
      </div>
      {hydrated && (
        <AutobetBox
          autoBetProfit={autoBetProfit}
          autoBetState={autoBetState}
          bet={(amount: string) => bet(amount)}
          betAmount={betAmount ?? ""}
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
          setBetAmount={setBetAmount}
          setIsShowAutoBet={setIsShowAutoBet}
          setNumberOfBet={setNumberOfBet}
          limitData={limitData}
          type="CRASH"
          cashout={cashOut}
          loadingState={loadingState}
          crashAutobetData={{
            setIsShowHalfCashOut: setIsShowHalfCashOut,
            isShowHalfCashOut: isShowHalfCashOut,
          }}
          gameId="1"
          maxBetAmount={maxBetAmount}
          setMaxBetAmount={setMaxBetAmount}
        >
          <>
            <div
              className={styles["choice-box"]}
              style={{ opacity: playing || autoBetState ? 0.4 : 1 }}
            >
              <div className={styles.top}>
                <p>
                  <span>{t("game_10")}</span>
                  {/* <button
                    type="button"
                    className={styles["btn-tooltip"]}
                  ></button> */}
                </p>
              </div>
              <div
                className={`${styles["payout-box"]} ${
                  playing || autoBetState ? styles.disabled : ""
                }`}
              >
                <input
                  type="text"
                  value={multiply ?? ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.value) {
                      setMultiply(null);
                    } else {
                      const val = validateNumberWithDecimal(e.target.value, {
                        maxDecimal: 2,
                        maxInteger: 9999999,
                      });
                      val && setMultiply(val);
                    }
                  }}
                  onBlur={e => {
                    if (!e.target.value) {
                      setMultiply("100");
                    }
                  }}
                  disabled={playing || autoBetState}
                />
                <div className={styles["btn-row"]}>
                  <button
                    type="button"
                    onClick={() => {
                      const cMultiply = truncateDecimal({
                        num: new BigNumber(multiply || "0").minus(1).toString(),
                        decimalPlaces: 2,
                      });
                      if (Number(cMultiply) < 1.01) {
                        setMultiply("1.01");
                      } else {
                        setMultiply(cMultiply);
                      }
                    }}
                  >
                    {`<`}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cMultiply = truncateDecimal({
                        num: new BigNumber(multiply || "0").plus(1).toString(),
                        decimalPlaces: 2,
                      });
                      if (Number(cMultiply) > 9999.99) {
                        setMultiply("9999.99");
                      } else {
                        setMultiply(cMultiply);
                      }
                    }}
                  >
                    {`>`}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div
                className={classNames(styles["btn-group"], {
                  [styles.tablet]: media?.includes("tablet"),
                })}
              >
                {betText.value === "cashout" &&
                  !autoBetState &&
                  isShowHalfCashOut && (
                    <button
                      type="button"
                      className={`${styles["bet-btn"]} ${styles.half}`}
                      onClick={() => {
                        cashOut(1);
                      }}
                      disabled={resultData.halfCashOutState || autoBetState}
                      style={{ opacity: resultData.halfCashOutState ? 0.4 : 1 }}
                    >
                      <span>{t("game_11")}</span>
                      {betSubText(true)}
                    </button>
                  )}
                <CommonButton
                  text={betText.text}
                  btnSub={betSubText(false)}
                  className={`${styles["bet-btn"]} ${
                    !isShowAutoBet && holdState && gameData.status !== "Bet"
                      ? styles.cancel
                      : ""
                  }`}
                  disabled={loadingState}
                  onClick={() => {
                    switch (betText.value) {
                      case "stopAutoBet":
                        setAutoBetState(false);
                        setPlaying(false);
                        break;
                      case "cashout":
                        cashOut();
                        break;
                      default:
                        bet(betAmount);
                        break;
                    }
                  }}
                  isPending={betLoadingState}
                />
              </div>
            </div>
          </>
        </AutobetBox>
      )}
      {hydrated &&
        ((checkMedia === "desktop" && media?.includes("tablet")) ||
          checkMedia !== "desktop") && (
          <CurrentHistoryBox
            realHistoryData={totalData.realHistoryData}
            gameState={gameState}
            totalDollar={totalData.dollar}
            userCount={totalData.players}
          />
        )}
      <HistoryBoxOfRound
        refetchDelay={refetchDelay}
        myHistoryData={myHistoryData}
        allHistoryData={allHistoryData}
        type={"crash"}
      />
    </div>
  );
}

const CurrentHistoryBox = ({
  realHistoryData,
  gameState,
  userCount,
  totalDollar,
}: {
  realHistoryData: BetInfo[];
  gameState: "play" | "playEnd" | null;
  userCount: string;
  totalDollar: string;
}) => {
  const [historyData, setHistoryData] = useState<BetInfo[]>([]);
  const { amountToDisplayFormat } = useCommonHook();
  const t = useDictionary();
  const sortedHistoryData = useMemo(() => {
    const withoutCashOutMultiply = _.filter(
      realHistoryData,
      item =>
        _.isUndefined(item.cashOutMultiply50) &&
        _.isUndefined(item.cashOutMultiply100),
    );

    const withCashOutMultiply = _.filter(
      realHistoryData,
      item =>
        _.has(item, "cashOutMultiply50") || _.has(item, "cashOutMultiply100"),
    );

    // cashOutMultiply50 또는 cashOutMultiply100 값이 있는 객체를
    // 값이 높은 순서로 정렬
    const sortedWithCashOutMultiply = _.orderBy(
      withCashOutMultiply,
      ["cashOutMultiply50", "cashOutMultiply100"],
      ["desc", "desc"],
    );

    return withoutCashOutMultiply.concat(sortedWithCashOutMultiply);
  }, [realHistoryData]);

  useEffect(() => {
    if (realHistoryData.length === 0) {
      setHistoryData([]);
    } else {
      let customArray: BetInfo[];

      if (gameState === "playEnd") {
        customArray = sortedHistoryData;
      } else {
        customArray = realHistoryData;
      }

      const groupedArr = _.groupBy(customArray, "gameLogIdx");
      const uniqueArr = _.map(groupedArr, group => group[0]);

      uniqueArr.length > 0 && setHistoryData(uniqueArr);
    }
  }, [gameState, realHistoryData, sortedHistoryData]);

  const { media } = useCommonStore();

  return (
    <div
      className={classNames(styles["current-history-box"], {
        [styles.tablet]: media?.includes("tablet"),
      })}
    >
      <div>
        <div className={styles.top}>
          <span>
            <span>
              {
                _.filter(
                  historyData,
                  obj => obj.cashOutMultiply100 || obj.cashOutMultiply50,
                ).length
              }
            </span>{" "}
            / {userCount} {t("game_12")}
          </span>
          <span>{amountToDisplayFormat(null, "jel", totalDollar)}</span>
        </div>
        <div className={styles.scroll}>
          <ul>
            {historyData.map((c, i) => {
              return (
                <li key={i}>
                  <div className={styles["user-info"]}>
                    <span
                      className={styles.avatar}
                      style={{
                        backgroundImage: `url('/images/avatar/img_avatar_${
                          c.avatarIdx || "hidden"
                        }.webp')`,
                      }}
                    ></span>
                    <span className={styles.nickname}>
                      {c.nickName || "Hidden"}
                    </span>
                  </div>
                  <div className={styles["bet-status"]}>
                    <span>
                      {c.cashOutMultiply100
                        ? c.cashOutMultiply100 + " x"
                        : c.cashOutMultiply50
                          ? c.cashOutMultiply50 + " x"
                          : gameState === "playEnd"
                            ? "crashed"
                            : "betting"}
                    </span>
                  </div>
                  <div className={styles["amount-info"]}>
                    <span
                      className={`${styles.amount} ${
                        (c.cashOutMultiply50 || c.cashOutMultiply100) &&
                        styles.success
                      } ${
                        gameState === "playEnd" &&
                        !c.cashOutMultiply50 &&
                        !c.cashOutMultiply100 &&
                        styles.lose
                      }`}
                    >
                      {amountToDisplayFormat(
                        c.earnAmount100
                          ? (
                              Number(c.earnAmount100) -
                              Number(c.betAmount) / (c.earnAmount50 ? 2 : 1)
                            ).toString()
                          : c.earnAmount50
                            ? (
                                Number(c.earnAmount50) -
                                Number(c.betAmount) / 2
                              ).toString()
                            : c.betAmount,
                        c.betType,
                      )}
                    </span>
                    <span
                      className={`${styles.ico}`}
                      style={{
                        backgroundImage: `url('/images/tokens/img_token_${c.betType.toLocaleLowerCase()}_circle.svg')`,
                      }}
                    ></span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
