"use client";

import Slider from "rc-slider";
import React, { useEffect, useRef, useState } from "react";
// import "rc-slider/assets/index.css";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useUserStore } from "@/stores/useUser";
import Image from "next/image";
import diceAniStyles from "./styles/diceAni.module.scss";
import "./styles/rcSliderUltimateDice.css";
import styles from "./styles/ultimatedice.module.scss";

import {
  formatNumber,
  truncateDecimal,
  validateNumberWithDecimal,
} from "@/utils";

import { useAssetStore } from "@/stores/useAsset";
import BigNumber from "bignumber.js";
import { useImmer } from "use-immer";
import AutobetBox from "../AutobetBox";
// import { useGetDiceInfo, usePostDiceDo } from "@/querys/game/dice";
import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useGetGameInfo, useGetHistoryMy } from "@/querys/game/common";
import { usePostUltimateDiceDo } from "@/querys/game/ultimatedice";
import { useCookies } from "react-cookie";
import useSound from "use-sound";
import HistoryBox from "../HistoryBox";
import RealTimeStatistics from "@/components/common/RealTimeStatistics";

export default function UltimateDiceWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token, displayFiat } = useUserStore();
  const { coin } = useAssetStore();
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);
  const t = useDictionary();
  const {
    exchangeRate,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    fiatSymbol,
    gaEventTrigger,
    showToast,
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

  //history ani

  const [historyAni, setHistoryAni] = useState(false);

  const [lastGameIdx, setLastGameIdx] = useState<number>(0);

  // 내 플립 게임 히스토리
  const { data: myHistoryData, refetch: refetchMyHistoryData } =
    useGetHistoryMy(
      "ultimate_dice",
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
    { result_number: string; win_yn: string; idx: number }[] | []
  >([]);

  const refetchDelay = 2500;

  // const queryClient = useQueryClient();

  const [values, setValues] = useState<number[]>([2500, 7499]);

  // 내 게임 히스토리 위에 16개
  useEffect(() => {
    if (propMyHistoryData && propMyHistoryData.result) {
      const arr: { result_number: string; win_yn: string; idx: number }[] = [];

      const slicedArr = propMyHistoryData.result.slice(0, 12);

      for (const o of slicedArr) {
        const data: { result_number: string; win_yn: string; idx: number } = {
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

  // const [selectNumber, setSelectNumber] = useState<string | null>("50.00");
  const [winChance, setWinChance] = useState<string | null>("50.00");
  const [winAmount, setWinAmount] = useState<string | null>(null);
  const [direction, setDirection] = useState<0 | 1>(0);
  const [payOut, setPayOut] = useState("1.98");
  const [betAmount, setBetAmount] = useState<string | null>("0.01");
  const [rolling] = useState(false);
  const { refetch: refetchCommonData } = useGetCommon(token);
  const { mutate: postUltimateDiceDo, isLoading } = usePostUltimateDiceDo();

  useEffect(() => {
    const amount = new BigNumber(payOut).times(betAmount ?? "0").toString();
    setWinAmount(truncateDecimal({ num: amount, decimalPlaces: 7 }));
  }, [betAmount, payOut]);

  const { data: limitData } = useGetGameInfo("ultimate_dice");
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

  const [diceAnimate, setDiceAnimate] = useState(false);

  const ref = useRef(null);

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
      limitData: limitData?.result,
      playing,
      maxBetAmount: isShowAutoBet ? maxBetAmount : null,
    });

    if (!calculatedAmount) {
      reset();
      return false;
    }

    postUltimateDiceDo(
      {
        betAmount: calculatedAmount,
        betCoinType: coin.toLocaleUpperCase(),
        endNumber: values[1],
        startNumber: values[0],
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
              label: "Betting Ultimate Dice",
              value: Number(calculatedAmount),
            });
            if (isShowAutoBet) {
              setAutoBetState(true);
            }

            setPlaying(true);
            setGameState("play");
            betSound();

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

  const handleChange = (newValues: number[]) => {
    // const [left, middle, right] = newValues;

    setValues(newValues);
  };

  useEffect(() => {
    // 먼저 맞출 확률을 구함
    const standard: BigNumber = new BigNumber(1);
    const range = values[1] - values[0] + 1;
    let percentOfHit = new BigNumber(range).div(10000).times(100);
    if (direction === 1) {
      percentOfHit = new BigNumber(100).minus(percentOfHit);
    }

    // 맞췄을 경우와 맞추지 못했을 경우에 대한 winYn, realPayOut, profitAmount를 구함
    // let winYn = "N";
    const payOut = standard.div(percentOfHit).times(0.99).times(100);
    const expectPayOut = payOut
      .decimalPlaces(1e9, BigNumber.ROUND_CEIL)
      .toFixed(4, BigNumber.ROUND_DOWN);

    setPayOut(expectPayOut);
  }, [winChance]);

  useEffect(() => {
    // setWinChance((100 - Number(winChance)).toFixed(2));
    setWinChance(val => {
      return new BigNumber(100).minus(val ?? "0").toFixed(2);
    });
  }, [direction]);

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_24")}</span>
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
                      <span>{c.result_number}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles["not-login-row"]}>{t("game_9")}</p>
              ))}
          </div>
          <div className={styles["betting-container"]}>
            <div className={styles["amount-info-container"]}>
              <div className={styles.box}>
                <span>{t("game_25")}</span>
                <span>{values[0]}</span>
              </div>
              <div
                className={`${styles.result} ${
                  resultData?.winYn === "N" ? styles.lose : ""
                } ${resultData?.winYn === "Y" ? styles.win : ""} ${
                  diceAnimate ? styles.ani : ""
                }
                `}
              >
                {Array.from({ length: 5 }).map((c, i) => (
                  <span key={i}>
                    {resultData.resultNumber === 0
                      ? "5000"
                      : resultData.resultNumber}
                  </span>
                ))}
              </div>

              <div className={styles.box}>
                <span>{t("game_26")}</span>
                <span>{values[1]}</span>
              </div>
            </div>

            <div className={styles["progress-bar-container"]}>
              <div className={styles["step-info-group"]}>
                {[0, 2500, 5000, 7500, 9999].map(c => {
                  return (
                    <div key={c}>
                      <span>{c}</span>
                    </div>
                  );
                })}
              </div>
              <div
                // ref={ref}
                style={{ position: "relative" }}
                className={styles["progress-box"]}
              >
                <div
                  className={styles["step-box"]}
                  style={{ left: values[0] / 100 + "%" }}
                >
                  <span>{values[0]}</span>
                </div>
                <div
                  className={styles["step-box"]}
                  style={{ left: values[1] / 100 + "%" }}
                >
                  <span>{values[1]}</span>
                </div>
                <div
                  className={`${styles["custom-rc-slider"]} ${
                    direction === 1 ? "reverse" : ""
                  }`}
                >
                  <Slider
                    ref={ref}
                    prefixCls="ulti-rc-slider"
                    range
                    onChange={(c: number | number[]) => {
                      if (typeof c === "number") {
                        return false;
                      }
                      if (c[1] - c[0] >= 9800) {
                        // 슬라이더의 최소 값이 199보다 작거나 최대 값이 9800보다 클 경우
                        if (c[0] < 199 || c[1] > 9800) {
                          handleChange([c[0], c[0] + 9799]); // 슬라이더 값을 [현재값, 현재값 + 9799]로 변경
                          setWinChance("98.00"); // 승률을 98.00으로 설정
                          return false; // 함수 종료
                        }
                      }

                      handleChange(c); // 슬라이더 값 변경 없음
                      // setWinChance(Math.ceil((c[1] - c[0]) / 100).toFixed(2)); // 승률 계산

                      const chance = new BigNumber(c[1] - c[0])
                        .div(100)
                        .toFixed(2);
                      setWinChance(Number(chance) <= 0.02 ? "0.02" : chance);
                    }}
                    min={0}
                    max={9999}
                    value={values}
                    allowCross={false}
                    draggableTrack
                    // disabled={playing || !sliderState}
                    disabled={playing}
                    step={1}

                    // handleRender={<div>aa</div>}
                  />
                </div>
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
                    className={`${styles["dice-box"]} ${
                      resultData.winYn === "Y" ? styles.win : ""
                    } ${resultData.winYn === "N" ? "" : ""} ${
                      diceAnimate ? styles.ani : ""
                    }`}
                  >
                    {/* <div className={styles.caramel}>
                      <Image
                        src="/images/game/dice/img_caramel.webp"
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
                    </div> */}
                    {resultData.winYn === "Y" && diceAnimate && (
                      <>
                        <div className={styles.caramel}>
                          <Image
                            src="/images/game/dice/img_caramel.webp"
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
                    {rolling && !playing ? (
                      <Dice />
                    ) : (
                      <Image
                        src="/images/game/dice/img_dice.webp"
                        alt="img arrow"
                        width="56"
                        height="56"
                      />
                    )}
                  </div>
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
                <p>{t("game_27")}</p>
                <div className={`${styles["select-box"]}`}>
                  <button
                    className={direction === 0 ? styles.active : ""}
                    type="button"
                    onClick={() => setDirection(0)}
                  >
                    {t("game_28")}
                  </button>
                  <button
                    className={direction === 1 ? styles.active : ""}
                    type="button"
                    onClick={() => setDirection(1)}
                  >
                    {t("game_29")}
                  </button>
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
                          if (Number(val) <= 0.02) {
                            setValues([5000, 5000]);
                            setWinChance(val);
                            return false;
                          }

                          const total = 10000;
                          const percent = Number(val) / 100;
                          const range = total * percent;

                          if (direction === 1) {
                            const start = Math.ceil(range / 2);
                            const end = Math.ceil(total - 1 - start);
                            setValues([start, end]);
                          } else {
                            const start = Math.ceil(5000 - range / 2);
                            const end = Math.ceil(start + range - 1);
                            setValues([start, end]);
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
          gameId="6"
          type="ULTIMATE_DICE"
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
        type="ultimate_dice"
      />
    </div>
  );
}

const Dice = () => {
  return (
    <div className={`${diceAniStyles.dice} ${diceAniStyles["roll-1"]}`}>
      <div className={diceAniStyles.one}>
        <span></span>
      </div>
      <div className={diceAniStyles.two}>
        <span></span>
        <span></span>
      </div>
      <div className={diceAniStyles.three}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={diceAniStyles.four}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={diceAniStyles.five}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={diceAniStyles.six}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
