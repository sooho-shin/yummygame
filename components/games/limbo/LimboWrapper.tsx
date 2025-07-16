"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./styles/limbo.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
import { useImmer } from "use-immer";
import { useUserStore } from "@/stores/useUser";
import AutobetBox from "../AutobetBox";
import HistoryBox from "../HistoryBox";
import { useGetGameInfo, useGetHistoryMy } from "@/querys/game/common";
import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useAssetStore } from "@/stores/useAsset";
import { useCookies } from "react-cookie";
import useSound from "use-sound";
import useCommonHook from "@/hooks/useCommonHook";
import { usePostLimboDo } from "@/querys/game/limbo";
import { customConsole, validateNumberWithDecimal } from "@/utils";

// import LimboGraphic from "./LimboGraphic";

const LimboGraphic = dynamic(() => import("./LimboGraphic"), { ssr: false });

import EventEmitter from "events";
import dynamic from "next/dynamic";
import RealTimeStatistics from "@/components/common/RealTimeStatistics";

const LimboWrapper = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // const eventEmitter = new EventEmitter();
  const { token, displayFiat } = useUserStore();
  const t = useDictionary();
  const [eventEmitter, setEventEmitter] = useState<EventEmitter | null>(null);
  const [resultHistoryData, setResultHistoryData] = useImmer<
    { result_number: number; win_yn: string; idx: number }[] | []
  >([]);
  //history ani
  const [historyAni, setHistoryAni] = useState(false);
  const { mutate: postGameLimboDo, isLoading } = usePostLimboDo();

  const {
    exchangeRate,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    showToast,
  } = useCommonHook();

  const { coin } = useAssetStore();
  const [betAmount, setBetAmount] = useState<string | null>("0.01");
  const [multiplier, setMultiplier] = useState<string | null>("2");
  const [winChance, setwinChance] = useState<string | null>("49.50");
  const [playing, setPlaying] = useState(false);
  const [autoBetProfit, setAutoBetProfit] = useState(0);
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);
  const { data: assetReferData } = useGetAssetRefer();
  const [load, onLoad] = useState(false);
  const [statisticsState, setStatisticsState] = useState(false);
  const [statisticsArray, setStatisticsArray] = useImmer<
    { uv: number; profit: number; betAmount: number }[]
  >([{ uv: 0, profit: 0, betAmount: 0 }]);

  useEffect(() => {
    if (!statisticsState) {
      setStatisticsArray([{ uv: 0, profit: 0, betAmount: 0 }]);
    }
  }, [statisticsState]);

  useEffect(() => {
    setStatisticsArray([{ uv: 0, profit: 0, betAmount: 0 }]);
  }, [coin]);

  const [cookie] = useCookies();

  const [betSound] = useSound("/music/bet.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [failSound] = useSound("/music/fail.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [successSound] = useSound("/music/success.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [lastGameIdx, setLastGameIdx] = useState<number>(0);
  // 내 플립 게임 히스토리
  const { data: myHistoryData, refetch: refetchMyHistoryData } =
    useGetHistoryMy(
      "limbo",
      {
        gameIdx: lastGameIdx,
      },
      token,
    );
  useEffect(() => {
    refetchMyHistoryData();
    setEventEmitter(new EventEmitter());
  }, []);
  const { refetch: refetchCommonData } = useGetCommon(token);
  // 플립 게임 기준 데이터
  const { data: limitData } = useGetGameInfo("limbo");
  const [gameState, setGameState] = useState<"play" | "playEnd" | null>(null);

  // auto bet start
  const [autoBetState, setAutoBetState] = useState(false);
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);

  const [numberOfBet, setNumberOfBet] = useState("");

  const refetchDelay = 500;

  useEffect(() => {
    setBetAmount(
      getLimitAmount({ limitType: "min", limitData: limitData?.result }),
    );
  }, [displayFiat, coin, limitData, exchangeRate, assetReferData]);

  // 최초 오토벳 데이터
  const [firstAutoBetData, setFirstAutoBetData] = useImmer<{
    betAmount: string | null;
    numberOfBet: string;
  }>({
    betAmount: null,
    numberOfBet: "",
  });

  // auto bet end

  // 게임 결과
  const [resultData, setResultData] = useImmer<{
    result_number: number;
    winYn: "Y" | "N";
    profit: number;
  }>({ result_number: 0, winYn: "Y", profit: 0 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [propMyHistoryData, setPropMyHistoryData] = useState<any>(null);

  // 내 게임 히스토리 위에 16개
  useEffect(() => {
    if (propMyHistoryData?.result) {
      const arr: { result_number: number; win_yn: string; idx: number }[] = [];

      const slicedArr = propMyHistoryData.result.slice(0, 12);

      for (const o of slicedArr) {
        const data: { result_number: number; win_yn: string; idx: number } = {
          result_number: o.result_number,
          win_yn: o.win_yn,
          idx: o.idx,
        };

        arr.unshift(data);
      }

      setResultHistoryData(draft => {
        draft.slice(0, 12 - arr.length);
        draft = [...draft, ...arr];
        return draft;
      });
      setHistoryAni(true);
    }
  }, [propMyHistoryData]);

  useEffect(() => {
    let setTimeOut: NodeJS.Timeout | undefined;
    if (myHistoryData?.result) {
      // setPropMyHistoryData(myHistoryData);
      // gameState === "play" && setGameState("playEnd");

      // refetchCommonData();
      setTimeOut = setTimeout(
        () => {
          setPropMyHistoryData(myHistoryData);
          gameState === "play" && setGameState("playEnd");

          refetchCommonData();
        },
        gameState === "play" ? refetchDelay : 0,
      );
    }
    return () => {
      clearTimeout(setTimeOut);
    };
  }, [myHistoryData]);

  // history ani
  useEffect(() => {
    if (historyAni) {
      setTimeout(() => setHistoryAni(false), 150);
    }
  }, [historyAni]);

  // 리셋 ( 뺄수 없음 오토벳으로 )
  const reset = () => {
    setPlaying(false);
    setAutoBetState(false);
    setAutoBetProfit(0);
    if (firstAutoBetData.betAmount) {
      setBetAmount(firstAutoBetData.betAmount);
      setNumberOfBet(firstAutoBetData.numberOfBet);
    }
    setFirstAutoBetData({
      betAmount: null,
      numberOfBet: "",
    });
  };

  const endGameFn = () => {
    customConsole("end");
  };

  useEffect(() => {}, []);

  // const [rocketAni, setRocketAni] = useState(false);
  // const [bombAni, setBombAni] = useState(false);

  // useEffect(() => {
  //   if (bombAni) {
  //     setTimeout(() => {
  //       setBombAni(false);
  //     }, 150);
  //   }
  // }, [bombAni]);

  const bet = (amount: string) => {
    if (coin.toLocaleUpperCase() === "YYG") {
      showToast(t("main_86"));
      return false;
    }
    const calculatedAmount = commonValidateGameBet({
      amount,
      autoBetState,
      limitData: limitData?.result,
      playing,
      maxBetAmount: isShowAutoBet ? maxBetAmount : null,
    });

    if (Number(multiplier) < 1.01) {
      showToast("Pay Out 은 1.01보다 작으면 안됩니다. ");
    }

    if (!calculatedAmount) {
      reset();
      return false;
    }

    postGameLimboDo(
      {
        betAmount: calculatedAmount,
        betCoinType: coin.toLocaleUpperCase(),
        multiplier: Number(multiplier),
      },
      {
        onSuccess(data: {
          code: number;
          result: {
            resultNumber: number;
            winYn: "Y" | "N";
            profit: string;
          };
        }) {
          if (data.code === 0) {
            if (isShowAutoBet) {
              setAutoBetState(true);
            }
            betSound();
            setPlaying(true);
            setGameState("play");

            // 초기 베팅 데이터를 설정하고, 이미 설정되었다면 갱신하지 않음
            if (!firstAutoBetData.betAmount) {
              setFirstAutoBetData({
                betAmount: amount,
                numberOfBet,
              });
            }

            if (myHistoryData?.result.length > 0) {
              setLastGameIdx(myHistoryData.result[0].idx);
            } else {
              refetchMyHistoryData();
            }

            // setRocketAni(true);
            setResultData(draft => {
              draft.winYn = data.result.winYn;
            });

            eventEmitter?.emit(
              "rocketAni",
              data.result.winYn,
              data.result.resultNumber,
            );

            setTimeout(() => {
              setResultData(draft => {
                draft.winYn = data.result.winYn;
                draft.profit = Number(data.result.profit);
              });
              if (data.result.winYn === "Y") {
                successSound();
                if (statisticsState) {
                  setStatisticsArray(draft => {
                    draft.push({
                      uv:
                        statisticsArray[statisticsArray.length - 1].uv +
                        Number(data.result.profit),
                      profit: Number(data.result.profit),
                      betAmount: Number(calculatedAmount),
                    });
                    return draft;
                  });
                }
              } else {
                failSound();
                if (statisticsState) {
                  setStatisticsArray(draft => {
                    draft.push({
                      uv:
                        statisticsArray[statisticsArray.length - 1].uv -
                        Number(calculatedAmount),
                      profit: -Number(calculatedAmount),
                      betAmount: Number(calculatedAmount),
                    });
                    return draft;
                  });
                }
              }

              // if(){}else{}
            }, refetchDelay);
          } else {
            // autobet초기화
            showErrorMessage(data.code);
            reset();
          }
        },
      },
    );
  };

  function getProbability(X: number) {
    X = X * 100;
    const nBits = 52;
    // X = Math.floor(99 / (1 - r / 2^nBits))
    // => 1 - r / 2^nBits = 99 / X
    // => r / 2^nBits = 1 - 99 / X
    // => r = (1 - 99 / X) * 2^nBits
    if (X <= 99) {
      // X가 99 이하인 경우 확률은 0입니다. (r 값이 양수가 될 수 없으므로)
      return 0;
    }
    const r = (1 - 99 / X) * Math.pow(2, nBits);
    // r / 2^nBits는 [0, 1) 범위의 값입니다.
    const probability = 1 - r / Math.pow(2, nBits);
    return ((Math.round(probability * 1000000) / 1000000) * 100)
      .toFixed(4)
      .replace(/\.?0+$/, "");
  }

  function getMultiplier(probability: number) {
    const nBits = 52;
    const r = (1 - probability / 100) * Math.pow(2, nBits);
    const X = 99 / (1 - r / Math.pow(2, nBits));
    return (Math.round(X) / 100).toFixed(2);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_74")}</span>
        </div>
        <div className={styles["result-container"]}>
          <div className={styles["result-row"]}>
            {hydrated &&
              (token && resultHistoryData.length > 0 ? (
                <div
                  className={`${styles["coin-row"]} ${
                    historyAni ? styles.ani : ""
                  }`}
                >
                  {resultHistoryData.map(c => (
                    <div
                      key={c.idx}
                      className={c.win_yn === "Y" ? styles.win : ""}
                    >
                      <span>
                        {c.result_number === 0 ? 1.98 : c.result_number} x
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles["not-login-row"]}>{t("game_9")}</p>
              ))}
          </div>
          <div className={styles["limbo-wrapper"]}>
            <LimboGraphic
              endCallback={() => {
                // setRocketAni(false);
              }}
              eventEmitter={eventEmitter!}
              onLoad={onLoad}
            />
            {!load && (
              <div className={styles["phaser-wrapper"]}>
                <div className={styles["loading-wrapper"]}>
                  <div className={styles["loading-container"]}>
                    <span className={styles.loader}></span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles["bet-info-box"]}>
              <div className={styles["input-group"]}>
                <span className={styles.title}>{t("game_14")}</span>
                <div className={styles["input-box"]}>
                  <input
                    type="text"
                    value={multiplier || ""}
                    onBlur={e => {
                      const value = Number(e.target.value);
                      const isNumeric = !isNaN(value);
                      if (!isNumeric || value < 1.01) {
                        setMultiplier("1.01");
                        setwinChance(getProbability(1.01).toString());
                      }
                    }}
                    onChange={e => {
                      if (!e.target.value) {
                        setMultiplier(null);
                        setwinChance("0");
                        return false;
                      }
                      const value = validateNumberWithDecimal(e.target.value, {
                        maxDecimal: 2,
                        maxInteger: 7,
                      });

                      if (!value) {
                        return false;
                      }

                      if (Number(value) > 1000000) {
                        setMultiplier("1000000");
                        setwinChance("0");
                        return false;
                      }

                      if (Number(value) < 1.01) {
                        setwinChance("0");
                      } else {
                        setwinChance(getProbability(Number(value)).toString());
                      }

                      setMultiplier(value);
                    }}
                  ></input>
                  <span>x</span>
                </div>
              </div>
              <div className={styles["input-group"]}>
                <span className={styles.title}>{t("game_16")}</span>
                <div className={styles["input-box"]}>
                  <input
                    type="text"
                    value={winChance || ""}
                    onChange={e => {
                      if (!e.target.value) {
                        setMultiplier("1.01");
                        setwinChance(null);

                        return false;
                      }
                      const value = validateNumberWithDecimal(e.target.value, {
                        maxDecimal: 2,
                        maxInteger: 3,
                      });

                      if (!value) {
                        return false;
                      }

                      if (Number(value) > 100) {
                        setMultiplier("1.01");
                        setwinChance("100");
                        return false;
                      }

                      setMultiplier(getMultiplier(Number(value)).toString());

                      setwinChance(value);
                    }}
                  ></input>
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        limitData={limitData?.result}
        isPending={isLoading}
        gameId="9"
        type="LIMBO"
        maxBetAmount={maxBetAmount}
        setMaxBetAmount={setMaxBetAmount}
        nextGameStartDelay={200}
        setStatisticsState={setStatisticsState}
        statisticsState={statisticsState}
      >
        <></>
      </AutobetBox>
      {statisticsState && (
        <RealTimeStatistics
          setStatisticsState={setStatisticsState}
          statisticsArray={statisticsArray}
          setStatisticsArray={setStatisticsArray}
        />
      )}

      <HistoryBox
        refetchDelay={refetchDelay}
        myHistoryData={propMyHistoryData?.result}
        type="limbo"
      />
    </div>
  );
};
export default LimboWrapper;
