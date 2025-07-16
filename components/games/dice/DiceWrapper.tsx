"use client";

import React, { useEffect, useRef, useState } from "react";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useUserStore } from "@/stores/useUser";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { useSlider } from "react-use";
import useSound from "use-sound";
import styles from "./styles/dice.module.scss";

import {
  formatNumber,
  truncateDecimal,
  validateNumberWithDecimal,
} from "@/utils";

import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useGetGameInfo, useGetHistoryMy } from "@/querys/game/common";
import { usePostDiceDo } from "@/querys/game/dice";
import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import BigNumber from "bignumber.js";
import { useImmer } from "use-immer";
import AutobetBox from "../AutobetBox";
import HistoryBox from "../HistoryBox";
import RealTimeStatistics from "@/components/common/RealTimeStatistics";

export default function DiceWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token, displayFiat } = useUserStore();
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);

  //history ani
  const [historyAni, setHistoryAni] = useState(false);
  const { coin } = useAssetStore();
  const t = useDictionary();

  const {
    exchangeRate,
    showToast,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    gaEventTrigger,
    fiatSymbol,
  } = useCommonHook();

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
      "classic_dice",
      {
        gameIdx: lastGameIdx,
      },
      token,
    );

  useEffect(() => {
    refetchMyHistoryData();
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [propMyHistoryData, setPropMyHistoryData] = useState<any>(null);

  const [resultHistoryData, setResultHistoryData] = useImmer<
    { pay_out: string; win_yn: string; idx: number }[] | []
  >([]);

  // 내 게임 히스토리 위에 16개
  useEffect(() => {
    if (propMyHistoryData?.result) {
      const arr: { pay_out: string; win_yn: string; idx: number }[] = [];

      const slicedArr = propMyHistoryData.result.slice(0, 12);

      for (const o of slicedArr) {
        const data: { pay_out: string; win_yn: string; idx: number } = {
          pay_out: o.pay_out,
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

  const [selectNumber, setSelectNumber] = useState<string | null>("50.00");
  const [winChance, setWinChance] = useState<string | null>("50.00");
  const [winAmount, setWinAmount] = useState<string | null>(null);
  const [direction, setDirection] = useState<0 | 1>(0);
  const [payOut, setPayOut] = useState("1.98");
  const [betAmount, setBetAmount] = useState<string | null>("0.01");
  const { refetch: refetchCommonData } = useGetCommon(token);
  const { mutate: postDiceDo, isLoading } = usePostDiceDo();

  useEffect(() => {
    const amount = new BigNumber(payOut).times(betAmount ?? "0").toString();
    setWinAmount(truncateDecimal({ num: amount, decimalPlaces: 7 }));
  }, [betAmount, payOut]);

  const { data: limitData } = useGetGameInfo("classic_dice");
  const { data: assetReferData } = useGetAssetRefer();

  useEffect(() => {
    setBetAmount(
      getLimitAmount({ limitType: "min", limitData: limitData?.result }),
    );
  }, [displayFiat, coin, limitData, exchangeRate, assetReferData]);

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
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);
  const [numberOfBet, setNumberOfBet] = useState("");
  const [playing, setPlaying] = useState(false);

  // 게임 결과
  const [resultData, setResultData] = useImmer<{
    resultNumber: number;
    winYn: "Y" | "N";
    profit: number;
  }>({ resultNumber: 0, winYn: "Y", profit: 0 });

  const refetchDelay = 1500;

  const [diceAnimate, setDiceAnimate] = useState(false);

  const ref = useRef(null);

  const { value } = useSlider(ref);

  useEffect(() => {
    if (!playing && value) {
      let cValue = Math.round(value * 100).toString() + ".00";

      if (Number(cValue) < 2) {
        cValue = "2.00";
      }
      if (Number(cValue) > 98) {
        cValue = "98.00";
      }
      if (cValue) {
        setSelectNumber(cValue);
      }
    }
  }, [value]);

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
    if (!selectNumber) {
      reset();
      return false;
    }

    const calculatedAmount = commonValidateGameBet({
      amount,
      autoBetState,
      limitData: limitData?.result,
      playing,
      maxBetAmount: isShowAutoBet ? maxBetAmount : null,
    });

    if (!calculatedAmount) {
      reset();
      return false;
    }

    postDiceDo(
      {
        betAmount: calculatedAmount,
        betCoinType: coin.toLocaleUpperCase(),
        selectNumber: Number(new BigNumber(selectNumber).times(100).toString()),
        direction,
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
            gaEventTrigger({
              category: "Betting",
              action: "click",
              label: "Betting Dice",
              value: Number(calculatedAmount),
            });
            betSound();

            if (isShowAutoBet) {
              setAutoBetState(true);
            }

            setPlaying(true);
            setGameState("play");

            setResultData({
              resultNumber: data.result.resultNumber,
              winYn: data.result.winYn,
              profit: Number(data.result.profit),
            });

            setDiceAnimate(true);

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

            setTimeout(() => {
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
            }, 500);
          } else {
            // autobet초기화
            showErrorMessage(data.code);
            reset();
          }
        },
      },
    );
  };

  const endGameFn = () => {
    setDiceAnimate(false);
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

  useEffect(() => {
    if (Number(selectNumber) < 0.01) {
      setPayOut("0");
      setWinChance("0");
    } else {
      let percentOfHit: BigNumber = new BigNumber(selectNumber ?? "0").div(100);

      setWinChance(
        truncateDecimal({ num: selectNumber ?? "0", decimalPlaces: 2 }),
      );

      if (direction === 1) {
        percentOfHit = new BigNumber(100).minus(selectNumber ?? "0").div(100);
        setWinChance(
          truncateDecimal({
            num: (100 - Number(selectNumber ?? "0")).toString(),
            decimalPlaces: 2,
          }),
        );
      }

      const standard: BigNumber = new BigNumber(1);
      const payOut = standard.div(percentOfHit).times(0.99).times(100);
      const realPayOut = payOut
        .decimalPlaces(1e9, BigNumber.ROUND_CEIL)
        .div(100)
        .toFixed(4, BigNumber.ROUND_DOWN);

      setPayOut(truncateDecimal({ num: realPayOut, decimalPlaces: 4 }));
    }
  }, [selectNumber]);

  useEffect(() => {
    if (!winChance) {
      setSelectNumber("0");
    } else {
      if (direction === 1) {
        setSelectNumber(
          truncateDecimal({
            num: (100 - Number(winChance)).toString(),
            decimalPlaces: 2,
          }),
        );
      } else {
        setSelectNumber(truncateDecimal({ num: winChance, decimalPlaces: 2 }));
      }
    }
  }, [direction]);

  useCommonStore();

  // if (!hydrated) return <></>;

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_13")}</span>
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
                  {resultHistoryData.map((c, i) => (
                    <div key={i} className={c.win_yn === "Y" ? styles.win : ""}>
                      <span>{c.pay_out} x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles["not-login-row"]}>{t("game_9")}</p>
              ))}
          </div>
          <div className={styles["betting-container"]}>
            <div className={styles["progress-bar-container"]}>
              <div className={styles["step-info-group"]}>
                {[0, 25, 50, 75, 100].map(c => {
                  return (
                    <div key={c}>
                      <span>{c}</span>
                    </div>
                  );
                })}
              </div>
              <div
                ref={ref}
                style={{ position: "relative" }}
                className={styles["progress-box"]}
              >
                <div
                  className={styles["result-box"]}
                  style={{
                    left: `${
                      resultData.resultNumber
                        ? resultData.resultNumber / 100
                        : 50
                    }%`,
                  }}
                >
                  <div
                    className={`${styles["result-num"]}  ${
                      resultData.winYn === "Y" ? styles.win : ""
                    } ${resultData.winYn === "N" ? styles.lose : ""} ${
                      diceAnimate ? styles.ani : ""
                    }`}
                  >
                    {resultData.resultNumber
                      ? (resultData.resultNumber / 100).toFixed(2)
                      : "50.00"}
                  </div>
                  <div
                    className={`${styles["dice-box"]} ${
                      resultData.winYn === "Y" ? styles.win : ""
                    } ${resultData.winYn === "N" ? "" : ""} ${
                      diceAnimate ? styles.ani : ""
                    }`}
                  >
                    {resultData.winYn === "Y" && diceAnimate && (
                      <>
                        <div className={styles.marshmallow}>
                          <Image
                            src="/images/game/dice/img_marshmallow.webp"
                            alt="img"
                            fill
                          />
                        </div>
                        <div className={styles.yummy}>
                          <Image
                            src="/images/game/dice/img_yummy.webp"
                            alt="img"
                            fill
                          />
                        </div>
                      </>
                    )}
                    <Image
                      src="/images/game/dice/img_dice.webp"
                      alt="img arrow"
                      width="56"
                      height="56"
                    />
                  </div>
                </div>
                <div className={styles["bar-row"]}>
                  <div
                    className={`${
                      direction === 0 ? styles.green : styles.red
                    } ${styles.bar}`}
                    style={{ width: (selectNumber ?? "0") + "%" }}
                  ></div>
                  <div
                    className={`${
                      direction === 1 ? styles.green : styles.red
                    } ${styles.bar}`}
                    style={{ width: 100 - Number(selectNumber ?? 0) + "%" }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      left: `${selectNumber ?? 0}%`,
                    }}
                    className={styles.circle}
                  ></div>
                </div>
              </div>
            </div>
            <div className={styles["bet-info-container"]}>
              <div>
                <p>{t("game_14")}</p>
                <div className={styles["input-box"]}>
                  <input type="text" readOnly value={payOut} />
                  <span>x</span>
                </div>
              </div>
              <div>
                <p>{direction === 0 ? t("game_15") : t("game_63")}</p>
                <div className={`${styles["input-box"]} ${styles.disabled}`}>
                  <input
                    type="text"
                    readOnly
                    value={selectNumber ? Number(selectNumber) : "0.00"}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (direction === 0) {
                        setDirection(1);
                      } else {
                        setDirection(0);
                      }
                    }}
                  ></button>
                </div>
              </div>
              <div>
                <p>{t("game_16")}</p>
                <div className={styles["input-box"]}>
                  <input
                    type="text"
                    value={winChance ?? ""}
                    onChange={e => {
                      if (Number(e.target.value) > 98) {
                        return false;
                      }

                      if (!e.target.value) {
                        setWinChance(null);
                      } else {
                        const val = validateNumberWithDecimal(e.target.value, {
                          maxDecimal: 2,
                          maxInteger: 3,
                        });

                        if (val) {
                          if (direction === 1) {
                            setSelectNumber(
                              truncateDecimal({
                                num: (100 - Number(winChance)).toString(),
                                decimalPlaces: 2,
                              }),
                            );
                          } else {
                            setSelectNumber(
                              truncateDecimal({
                                num: e.target.value,
                                decimalPlaces: 2,
                              }),
                            );
                          }
                          setWinChance(val);
                        }
                      }
                    }}
                  />
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
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
          limitData={limitData?.result}
          nextGameStartDelay={300}
          isPending={isLoading}
          gameId="5"
          type="CLASSIC_DICE"
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
                <span>{t("game_17")}</span>
                {displayFiat && coin !== "hon" && (
                  <span className={styles.sub}>
                    {formatNumber({
                      value: new BigNumber(winAmount ?? "0")
                        .div(exchangeRate)
                        .toString(),
                      decimal: 0,
                      maxDigits: 7,
                    })}{" "}
                    {coin.toLocaleUpperCase()}
                  </span>
                )}
                {/* <span className={}></span> */}
              </p>
            </div>
            <div className={styles["win-amount-box"]}>
              {!displayFiat && (
                <span className={styles.circle}>
                  <span
                    className={`${styles.ico}`}
                    style={{
                      backgroundImage: `url('/images/tokens/img_token_${coin}_circle.svg')`,
                    }}
                  ></span>
                </span>
              )}
              <input
                type="text"
                value={
                  winAmount
                    ? displayFiat
                      ? fiatSymbol + " " + winAmount
                      : winAmount
                    : "0"
                }
                readOnly
              />
              {displayFiat && (
                <span className={styles.circle} style={{ marginLeft: "auto" }}>
                  <span
                    className={`${styles.ico}`}
                    style={{
                      backgroundImage: `url('/images/tokens/img_token_${coin}_circle.svg')`,
                    }}
                  ></span>
                </span>
              )}
            </div>
          </div>
        </AutobetBox>
      )}
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
        type="classic_dice"
      />
    </div>
  );
}
