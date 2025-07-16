"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useGetGameInfo, useGetHistoryMy } from "@/querys/game/common";
import { usePostCoinFlipDo } from "@/querys/game/flip";
import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import { useUserStore } from "@/stores/useUser";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useImmer } from "use-immer";
import useSound from "use-sound";
import AutobetBox from "../AutobetBox";
import HistoryBox from "../HistoryBox";
import styles from "./styles/flip.module.scss";
import RealTimeStatistics from "@/components/common/RealTimeStatistics";

export default function FlipWrapper() {
  const { token, displayFiat } = useUserStore();

  const {
    exchangeRate,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    gaEventTrigger,
    showToast,
  } = useCommonHook();

  // useEffect(() => {
  //   const imageList = [
  //     "/images/game/flip/img_coin_head.webp",
  //     "/images/game/flip/img_coin_tail.webp",
  //     "/images/game/flip/img_coin_bg_head.webp",
  //     "/images/game/flip/img_coin_bg_tail.webp",
  //   ];
  //   loadingPreloadImages(imageList);
  // }, []);

  const t = useDictionary();

  const { coin } = useAssetStore();
  const [betAmount, setBetAmount] = useState<string | null>("0.01");
  const [selectDirection, setSelectDirection] = useState<0 | 1>(0);
  const [playing, setPlaying] = useState(false);
  const [autoBetProfit, setAutoBetProfit] = useState(0);
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);
  const { data: assetReferData } = useGetAssetRefer();
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

  //reward ani
  const [rewardAni, setRewardAni] = useState(false);

  //coin ani
  const [coinAni, setCoinAni] = useState(false);

  //history ani
  const [historyAni, setHistoryAni] = useState(false);

  const { mutate: postGameFlipDo, isLoading } = usePostCoinFlipDo();

  const [lastGameIdx, setLastGameIdx] = useState<number>(0);
  // 내 플립 게임 히스토리
  const { data: myHistoryData, refetch: refetchMyHistoryData } =
    useGetHistoryMy(
      "coin_flip",
      {
        gameIdx: lastGameIdx,
      },
      token,
    );

  useEffect(() => {
    refetchMyHistoryData();
  }, []);
  const { refetch: refetchCommonData } = useGetCommon(token);
  // 플립 게임 기준 데이터
  const { data: infoData } = useGetGameInfo("coin_flip");
  const [gameState, setGameState] = useState<"play" | "playEnd" | null>(null);

  // auto bet start
  const [autoBetState, setAutoBetState] = useState(false);
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);

  const [numberOfBet, setNumberOfBet] = useState("");

  const refetchDelay = 3000;

  useEffect(() => {
    setBetAmount(
      getLimitAmount({ limitType: "min", limitData: infoData?.result }),
    );
  }, [displayFiat, coin, infoData, exchangeRate, assetReferData]);

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
    resultNumber: 0 | 1;
    winYn: "Y" | "N";
    profit: number;
  }>({ resultNumber: 0, winYn: "Y", profit: 0 });

  const [resultHistoryData, setResultHistoryData] = useImmer<
    | {
        side: "head" | "tail";
        result: 0 | 1;
        idx: number;
      }[]
    | []
  >([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [propMyHistoryData, setPropMyHistoryData] = useState<any>(null);

  // 내 게임 히스토리 위에 16개
  useEffect(() => {
    if (propMyHistoryData?.result) {
      const arr: {
        side: "head" | "tail";
        result: 0 | 1;
        idx: number;
      }[] = [];

      const slicedArr = propMyHistoryData.result.slice(0, 16);

      for (const o of slicedArr) {
        const data: {
          side: "head" | "tail";
          result: 0 | 1;
          idx: number;
        } = {
          side: o.result_number === 1 ? "tail" : "head",
          result: o.win_yn === "N" ? 1 : 0,
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
      setTimeOut = setTimeout(
        () => {
          setPropMyHistoryData(myHistoryData);
          gameState === "play" && setGameState("playEnd");
          setRewardAni(true);

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
      setTimeout(() => setHistoryAni(false), 1500);
    }
  }, [historyAni]);

  const bet = (amount: string) => {
    if (coin.toLocaleUpperCase() === "YYG") {
      showToast(t("main_86"));
      return false;
    }
    const calculatedAmount = commonValidateGameBet({
      amount,
      autoBetState,
      limitData: infoData?.result,
      playing,
      maxBetAmount: isShowAutoBet ? maxBetAmount : null,
    });

    if (!calculatedAmount) {
      reset();
      return false;
    }

    postGameFlipDo(
      {
        betAmount: calculatedAmount,
        betCoinType: coin.toLocaleUpperCase(),
        selectDirection,
      },
      {
        onSuccess(data: {
          code: number;
          result: {
            resultNumber: 0 | 1;
            winYn: "Y" | "N";
            profit: string;
          };
        }) {
          if (data.code === 0) {
            gaEventTrigger({
              category: "Betting",
              action: "click",
              label: "Betting Flip",
              value: Number(calculatedAmount),
            });
            if (isShowAutoBet) {
              setAutoBetState(true);
            }
            betSound();
            setRewardAni(false);
            setPlaying(true);
            setCoinAni(true);
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

            setResultData(draft => {
              draft.resultNumber = data.result.resultNumber;
            });
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
    setCoinAni(false);
  };

  const { media } = useCommonStore();

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_18")}</span>
        </div>
        <div className={styles["result-container"]}>
          <div className={styles["result-row"]}>
            {token && resultHistoryData.length !== 0 ? (
              <div
                className={`${styles["coin-row"]} ${
                  historyAni ? styles.ani : ""
                }`}
              >
                {resultHistoryData.map((c, i) => (
                  <ResultCoin key={i} side={c.side} result={c.result} />
                ))}
              </div>
            ) : (
              <p className={styles["not-login-row"]}>{t("game_9")}</p>
            )}
          </div>
          <div className={`${styles["flip-wrapper"]} `}>
            <div
              className={classNames(styles["result-box"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <div>
                <span>50%</span>
                <span
                  className={`${
                    selectDirection === 0 ? styles.head : styles.tail
                  } ${
                    !playing && resultData?.winYn === "N" ? styles.lose : ""
                  }`}
                >
                  {selectDirection === 0 ? "Head" : "Tail"}
                </span>
              </div>
            </div>
            <div
              className={classNames(styles["coin-flip-box"], {
                [styles.head]: selectDirection === 0,
                [styles.tail]: selectDirection !== 0,
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <div
                className={`${styles["coin-box"]} ${
                  coinAni ? styles.playing : ""
                } ${
                  resultData
                    ? resultData.resultNumber === 1
                      ? styles.reverse
                      : ""
                    : ""
                }`}
              >
                <div className={`${styles.head}`}></div>
                <div className={`${styles.tail}`}></div>
              </div>
            </div>
            <div
              className={classNames(styles["magnification-box"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <div
                className={`${
                  rewardAni && resultData?.winYn === "N" ? styles.lose : ""
                } ${rewardAni && resultData?.winYn === "Y" ? styles.win : ""}
                `}
              >
                {Array.from({ length: 5 }).map((c, i) => (
                  <span key={i}>
                    {resultData
                      ? resultData?.winYn === "Y"
                        ? "1.98"
                        : "0.00"
                      : "1.98"}{" "}
                    x
                  </span>
                ))}
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
        limitData={infoData?.result}
        isPending={isLoading}
        gameId="4"
        type="COIN_FLIP"
        maxBetAmount={maxBetAmount}
        setMaxBetAmount={setMaxBetAmount}
        setStatisticsState={setStatisticsState}
        statisticsState={statisticsState}
      >
        <div
          className={styles["choice-box"]}
          style={{ opacity: playing ? 0.4 : 1 }}
        >
          <div className={styles.top}>
            <p>
              <span>{t("game_18")}</span>
            </p>
          </div>
          <div className={styles["btn-row"]}>
            <button
              type="button"
              className={`${selectDirection === 0 ? styles.active : ""} `}
              onClick={() => setSelectDirection(0)}
            >
              <span>Head</span>
            </button>
            <button
              type="button"
              className={`${selectDirection === 1 ? styles.active : ""}`}
              onClick={() => setSelectDirection(1)}
            >
              <span>Tail</span>
            </button>
          </div>
        </div>
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
        type="coin_flip"
      />
    </div>
  );
}

const ResultCoin = ({
  side,
  result,
}: {
  side: "head" | "tail";
  result: 0 | 1;
}) => {
  return (
    <div
      className={`${styles.coin} ${styles[side]} ${
        result === 0 ? styles.win : styles.lose
      }`}
    ></div>
  );
};
