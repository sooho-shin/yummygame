"use client";
import BigNumber from "bignumber.js";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useGetGameInfo, useGetHistoryMy } from "@/querys/game/common";
import { usePostRouletteDo } from "@/querys/game/roulette";
import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import { useRouletteStore } from "@/stores/useRoulette";
import { useUserStore } from "@/stores/useUser";
import { ArrayObject, ResultArrayObject } from "@/types/games/roulette";
import { customConsole, truncateDecimal } from "@/utils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useImmer } from "use-immer";
import useSound from "use-sound";
import AutobetBox from "../AutobetBox";
import HistoryBox from "../HistoryBox";
import Board from "./Board";
import RouletteWheel from "./Wheel";
import styles from "./styles/roulette.module.scss";
import RealTimeStatistics from "@/components/common/RealTimeStatistics";
// import { preloadImage } from "@/utils/imagePreload";

type ResultType = {
  resultNumber: number | null;
  winYn: "Y" | "N";
  profit: number;
  betCoinType?: string;
  payOut?: string;
  profitDollar?: string;
};

export default function RouletteWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);
  // useEffect(() => {
  //   const imageList = [
  //     "/images/game/plinko/candy_01.webp",
  //     "/images/game/plinko/candy_02.webp",
  //     "/images/game/plinko/candy_03.webp",
  //     "/images/game/plinko/candy_04.webp",
  //     "/images/game/plinko/candy_05.webp",
  //   ];

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const imagesPromiseList: Promise<any>[] = [];
  //   for (const i of imageList) {
  //     imagesPromiseList.push(preloadImage(i));
  //   }
  //   const loadCall = async () => {
  //     await Promise.all(imagesPromiseList);
  //     setImagesPreloaded(true);
  //   };
  //   loadCall();
  // }, []);

  const { token, displayFiat } = useUserStore();
  const t = useDictionary();
  const { openModal } = useModalHook();

  const [lastGameIdx, setLastGameIdx] = useState<number>(0);
  const {
    exchangeRate,
    showToast,
    getAmountByToken,
    showErrorMessage,
    fiatSymbol,
    getLimitAmount,
    divCoinType,
    timesCoinType,
    gaEventTrigger,
  } = useCommonHook();
  const { coin } = useAssetStore();

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

  // 내 룰렛 게임 히스토리
  const { data: myHistoryData, refetch: refetchMyHistoryData } =
    useGetHistoryMy(
      "roulette",
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
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);
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

  const [resultAni, setResultAni] = useState(false);
  useEffect(() => {
    let setTimeOut: NodeJS.Timeout | undefined;
    if (myHistoryData?.result) {
      setTimeOut = setTimeout(
        () => {
          setPropMyHistoryData(myHistoryData);

          if (gameState === "play") {
            setResultAni(true);
            setGameState("playEnd");
          }

          refetchCommonData();
        },
        gameState === "play" ? refetchDelay : 0,
      );
    }
    return () => {
      clearTimeout(setTimeOut);
    };
  }, [myHistoryData]);

  // 결과 애니메이션
  useEffect(() => {
    if (resultAni) {
      if (resultData.winYn === "Y") {
        successSound();
      } else {
        failSound();
      }

      setTimeout(() => {
        setResultAni(false);
      }, 3000);
    }
  }, [resultAni]);

  const { data: limitData } = useGetGameInfo("roulette");
  // const [winAmount, setWinAmount] = useState<string | null>(null);
  //history ani
  const [historyAni, setHistoryAni] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const resultHistoryData: any[] = [];

  const refetchDelay = 3500;
  const [autoBetProfit, setAutoBetProfit] = useState(0);
  const [autoBetState, setAutoBetState] = useState(false);
  const [playing, setPlaying] = useState(false);
  const {
    selectedChipAmount,
    setSelectedChipAmount,
    selectedBoardData,
    setSelectedBoardData,
  } = useRouletteStore();

  const { refetch: refetchCommonData } = useGetCommon(token);
  const { mutate: postRouletteDo, isLoading } = usePostRouletteDo();
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);
  const [gameState, setGameState] = useState<"play" | "playEnd" | null>(null);
  const [rouletteAnimate, setRouletteAnimate] = useState(false);

  const [doRouletteGameBodyList, setDoRouletteGameBodyList] = useState<
    ResultArrayObject[] | null
  >(null);
  const [betAmount, setBetAmount] = useState<string | null>(null);
  const [numberOfBet, setNumberOfBet] = useState("");

  // 모바일 결과 애니메이션

  // const [isTabletWheelShow, setIsTabletWheelShow] = useState(false);

  // 최초 오토벳 데이터
  const [firstAutoBetData, setFirstAutoBetData] = useImmer<{
    betAmount: string | null;
    numberOfBet: string;
  }>({
    betAmount: null,
    numberOfBet: "",
  });
  // 게임 결과
  const [resultData, setResultData] = useImmer<ResultType>({
    resultNumber: null,
    winYn: "Y",
    profit: 0,
  });

  // history ani
  useEffect(() => {
    if (historyAni) {
      setTimeout(() => setHistoryAni(false), 1500);
    }
  }, [historyAni]);

  const { data: assetReferData } = useGetAssetRefer();
  useEffect(() => {
    const minAmount = getLimitAmount({
      limitType: "min",
      limitData: limitData?.result,
    });

    const array = convertChipAmountAndMultiply(
      mergeBets(selectedBoardData),
      minAmount,
    );

    setDoRouletteGameBodyList(array);
    setBetAmount(null);

    let amount = 0;

    if (array.length > 0) {
      array.forEach(c => {
        amount = Number(new BigNumber(amount).plus(c.betAmount).toString());
      });
    }
    setBetAmount(divCoinType(amount.toString(), coin));
  }, [displayFiat, coin, limitData, selectedBoardData, assetReferData]);

  // selectedBoardData 합치는 함수
  function mergeBets(bets: ArrayObject[]): ArrayObject[] {
    const mergedBets: ArrayObject[] = [];

    bets.forEach(bet => {
      // 이미 mergedBets 배열에 해당 type과 selectList를 가진 항목이 있는지 확인
      const existingBet = mergedBets.find(
        mergedBet =>
          mergedBet.type === bet.type &&
          JSON.stringify(mergedBet.selectList) ===
            JSON.stringify(bet.selectList),
      );

      if (existingBet) {
        // 이미 있는 경우, chipAmount를 더해줌
        existingBet.chipAmount = (
          Number(existingBet.chipAmount) + Number(bet.chipAmount)
        ).toString();
      } else {
        // 없는 경우, 새로운 항목으로 추가
        mergedBets.push({
          type: bet.type,
          chipAmount: bet.chipAmount,
          selectList: bet.selectList,
        });
      }
    });

    return mergedBets;
  }

  // chipAmount를 변환하고 minAmount와 곱한 결과를 반환하는 함수
  function convertChipAmountAndMultiply(
    arr: ArrayObject[],
    minAmount: string,
  ): ResultArrayObject[] {
    const result: ResultArrayObject[] = [];

    for (const item of arr) {
      // 각 chipAmount를 BigNumber로 변환
      if (item.chipAmount) {
        const chipAmount = new BigNumber(item.chipAmount);

        // chipAmount와 minAmount를 곱함
        const multipliedAmount = chipAmount.times(minAmount).toString();
        if (multipliedAmount !== "0") {
          // 결과 객체 생성
          const convertedItem: ResultArrayObject = {
            type: item.type,
            betAmount: displayFiat
              ? timesCoinType(
                  truncateDecimal({
                    num: new BigNumber(multipliedAmount)
                      .div(exchangeRate)
                      .toString(),
                    decimalPlaces: 7,
                  }).toString(),
                  coin,
                )
              : timesCoinType(multipliedAmount, coin),
            selectList: item.selectList,
          };

          result.push(convertedItem);
        }
      }
    }

    return result;
  }

  const endGameFn = () => {
    setRouletteAnimate(false);
    // setResultData({
    //   resultNumber: null,
    //   winYn: "Y",
    //   profit: 0,
    // });
    // setTimeout(() => {
    //   if (!autoBetState) {
    //     setIsTabletWheelShow(false);
    //   }
    // }, 3500);
  };

  // 리셋 ( 뺄수 없음 오토벳으로 )
  const reset = () => {
    setPlaying(false);
    setAutoBetState(false);
    setAutoBetProfit(0);
    // setBetAmount(firstAutoBetData.betAmount);
    setNumberOfBet(firstAutoBetData.numberOfBet);

    setFirstAutoBetData({
      betAmount: null,
      numberOfBet: "",
    });
  };

  const bet = (amount: string) => {
    if (coin.toLocaleUpperCase() === "YYG") {
      showToast(t("main_86"));
      return false;
    }

    if (!token) {
      openModal({ type: "getstarted" });
      return false;
    }

    if (!doRouletteGameBodyList || doRouletteGameBodyList?.length === 0) {
      showToast(t("toast_2"));
      reset();

      return false;
    }

    if (!token) {
      showToast(t("toast_3"));
      return false;
    }

    if (!autoBetState && playing) {
      return false;
    }

    if (new BigNumber(amount).gt(getAmountByToken(coin))) {
      showToast(t("toast_4"));
      reset();
      return false;
    }

    if (
      new BigNumber(amount).lt(
        getLimitAmount({
          limitType: "min",
          limitData: limitData?.result,
          crypto: true,
        }),
      )
    ) {
      showToast(t("toast_5"));
      reset();
      return false;
    }

    if (
      new BigNumber(amount).gt(
        getLimitAmount({
          limitType: "max",
          limitData: limitData?.result,
          crypto: true,
        }),
      )
    ) {
      showToast(t("toast_6"));
      reset();
      return false;
    }

    if (!coin) {
      showToast("코인 선택하슈");
      reset();
      return false;
    }

    postRouletteDo(
      {
        doRouletteGameBodyList: doRouletteGameBodyList,
        betCoinType: coin.toLocaleUpperCase(),
      },
      {
        onSuccess(data: { code: number; result: ResultType }) {
          if (data.code === 0) {
            if (isShowAutoBet) {
              setAutoBetState(true);
            }
            gaEventTrigger({
              category: "Betting",
              action: "click",
              label: "Betting Roullette",
            });

            betSound();

            setPlaying(true);
            setGameState("play");
            // setIsTabletWheelShow(true);

            setResultData({
              resultNumber: data.result.resultNumber,
              winYn: data.result.winYn,
              profit: Number(data.result.profit),
              payOut: data.result.payOut,
              profitDollar: data.result.profitDollar,
              betCoinType: data.result.betCoinType,
            });
            let betAmount = 0;

            for (const c of doRouletteGameBodyList) {
              betAmount = betAmount + Number(c.betAmount);
            }
            setTimeout(() => {
              if (statisticsState) {
                if (data.result.winYn === "Y") {
                  setStatisticsArray(draft => {
                    draft.push({
                      uv:
                        statisticsArray[statisticsArray.length - 1].uv +
                        Number(data.result.profit),
                      profit: Number(data.result.profit),
                      betAmount: betAmount,
                    });
                    return draft;
                  });
                } else {
                  setStatisticsArray(draft => {
                    draft.push({
                      uv:
                        statisticsArray[statisticsArray.length - 1].uv -
                        betAmount,
                      profit: -betAmount,
                      betAmount: betAmount,
                    });
                    return draft;
                  });
                }
              }
            }, refetchDelay);

            setRouletteAnimate(true);

            // 초기 베팅 데이터를 설정하고, 이미 설정되었다면 갱신하지 않음
            if (!firstAutoBetData.betAmount) {
              setFirstAutoBetData({
                betAmount: amount,
                numberOfBet,
              });
            }
            if (myHistoryData?.result.length > 0) {
              setLastGameIdx(myHistoryData?.result[0].idx);
            } else {
              refetchMyHistoryData();
            }
          } else {
            // autobet초기화
            showErrorMessage(data.code);
            reset();
          }
        },
      },
    );
  };

  const { media } = useCommonStore();

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_21")}</span>
        </div>

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

        <div className={styles["roulette-container"]}>
          <div
            className={classNames(styles["roulette-wheel-wrap"], {
              [styles.tablet]: media?.includes("tablet"),
              // [styles.active]: isTabletWheelShow,
            })}
          >
            <RouletteWheel
              rouletteAnimate={rouletteAnimate}
              resultData={resultData}
              gameState={gameState}
              animationDuration={refetchDelay}
              autoBetState={autoBetState}
              resultAni={resultAni}
            />
          </div>
          <div
            className={classNames(styles["roulette-board-wrap"], {
              [styles.tablet]: media?.includes("tablet"),
            })}
          >
            <div className={styles["btn-row"]}>
              <button
                type="button"
                onClick={() => {
                  const currentSelectedBoardData = selectedBoardData.slice(
                    0,
                    selectedBoardData.length - 1,
                  );
                  setSelectedBoardData(currentSelectedBoardData);
                }}
                disabled={selectedBoardData.length === 0}
              >
                <span>Undo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedBoardData([]);
                }}
                disabled={selectedBoardData.length === 0}
              >
                <span>Clear</span>
              </button>
            </div>
            <Board />
          </div>
        </div>
      </div>
      {hydrated && (
        <AutobetBox
          type="ROULETTE"
          autoBetProfit={autoBetProfit}
          autoBetState={autoBetState}
          bet={(amount: string) => bet(amount)}
          betAmount={betAmount ?? ""}
          setBetAmount={setBetAmount}
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
          setIsShowAutoBet={setIsShowAutoBet}
          setNumberOfBet={setNumberOfBet}
          limitData={limitData?.result}
          nextGameStartDelay={1000}
          isPending={isLoading}
          gameId="3"
          maxBetAmount={maxBetAmount}
          setMaxBetAmount={setMaxBetAmount}
          setStatisticsState={setStatisticsState}
          statisticsState={statisticsState}
        >
          <>
            <div
              className={styles["choice-box"]}
              style={{ opacity: playing ? 0.4 : 1 }}
            >
              <div className={styles.top}>
                <p>
                  <span>{t("game_22")}</span>
                  <span className={styles.sub}>
                    {displayFiat && coin !== "hon" && fiatSymbol}
                    {new BigNumber(
                      getLimitAmount({
                        limitType: "min",
                        limitData: limitData?.result,
                      }),
                    )
                      .times(selectedChipAmount)
                      .toString()}{" "}
                    {displayFiat && coin !== "hon"
                      ? ""
                      : coin.toLocaleUpperCase()}{" "}
                  </span>
                </p>
              </div>

              <div className={styles["chip-choice-box"]}>
                <div className={styles["chip-box"]}>
                  <button
                    type="button"
                    className={`${styles.coin} ${styles.one} ${
                      selectedChipAmount === 1 ? styles.active : ""
                    }`}
                    onClick={() => setSelectedChipAmount(1)}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className={`${styles.coin} ${styles.ten} ${
                      selectedChipAmount === 10 ? styles.active : ""
                    }`}
                    onClick={() => setSelectedChipAmount(10)}
                  >
                    10
                  </button>
                  <button
                    type="button"
                    className={`${styles.coin} ${styles.hundred} ${
                      selectedChipAmount === 100 ? styles.active : ""
                    }`}
                    onClick={() => setSelectedChipAmount(100)}
                  >
                    100
                  </button>
                  <button
                    type="button"
                    className={`${styles.coin} ${styles.thousand} ${
                      selectedChipAmount === 1000 ? styles.active : ""
                    }`}
                    onClick={() => setSelectedChipAmount(1000)}
                  >
                    1K
                  </button>
                  <button
                    type="button"
                    className={`${styles.coin} ${styles["ten-thousand"]} ${
                      selectedChipAmount === 10000 ? styles.active : ""
                    }`}
                    onClick={() => setSelectedChipAmount(10000)}
                  >
                    10K
                  </button>
                  <button
                    type="button"
                    className={`${styles.coin} ${styles["hundred-thousand"]} ${
                      selectedChipAmount === 100000 ? styles.active : ""
                    }`}
                    onClick={() => setSelectedChipAmount(100000)}
                  >
                    100K
                  </button>
                  <button
                    type="button"
                    className={`${styles.coin} ${styles.million} ${
                      selectedChipAmount === 1000000 ? styles.active : ""
                    }`}
                    onClick={() => setSelectedChipAmount(1000000)}
                  >
                    1M
                  </button>
                </div>
              </div>
            </div>
            <div
              className={styles["choice-box"]}
              style={{ opacity: playing ? 0.4 : 1 }}
            >
              <div className={styles.top}>
                <p>
                  <span>{t("game_23")}</span>
                  {displayFiat && coin !== "hon" && (
                    <span className={styles.sub}>
                      {betAmount ? betAmount : "0"} {coin.toLocaleUpperCase()}
                    </span>
                  )}
                </p>
              </div>
              <div className={styles["win-amount-box"]}>
                {displayFiat ? (
                  <span
                    className={classNames(styles.unit, {
                      [styles.opacity]: !betAmount || betAmount === "0",
                    })}
                  >
                    {fiatSymbol + " "}
                  </span>
                ) : (
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
                  className={classNames({
                    [styles.opacity]: !betAmount || betAmount === "0",
                  })}
                  value={truncateDecimal({
                    num: betAmount
                      ? displayFiat
                        ? new BigNumber(betAmount)
                            .times(exchangeRate)
                            .toString()
                        : betAmount
                      : "0",
                    decimalPlaces: displayFiat ? 2 : 7,
                  })}
                  readOnly
                />

                {displayFiat && (
                  <span className={styles.circle}>
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
          </>
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
        type="roulette"
        refetchDelay={refetchDelay}
        myHistoryData={propMyHistoryData?.result}
      />
    </div>
  );
}
