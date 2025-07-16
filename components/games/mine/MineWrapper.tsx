"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import useCommonHook from "@/hooks/useCommonHook";
import { useUserStore } from "@/stores/useUser";
import BigNumber from "bignumber.js";
import { scroller } from "react-scroll";
import { useImmer } from "use-immer";
import AutobetBox from "../AutobetBox";
import HistoryBox from "../HistoryBox";
import styles from "./styles/mine.module.scss";

import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useGetGameInfo, useGetHistoryMy } from "@/querys/game/common";
import { useAssetStore } from "@/stores/useAsset";
import { amountFormatter, CookieOption } from "@/utils";

import Slider from "rc-slider";
import "./styles/rcSliderMine.css";

import {
  useGetMineRound,
  usePostMineAuto,
  usePostMineCashout,
  usePostMineDo,
  usePostMineRound,
} from "@/querys/game/mine";

import { useDictionary } from "@/context/DictionaryContext";
import { useCommonStore } from "@/stores/useCommon";
import classNames from "classnames";
import { useCookies } from "react-cookie";
import useSound from "use-sound";
import RealTimeStatistics from "@/components/common/RealTimeStatistics";

export default function MineWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [cookie, setCookie] = useCookies();
  const { token, displayFiat } = useUserStore();
  const { coin, setCoin } = useAssetStore();
  const [betAmount, setBetAmount] = useState<string | null>("0.01");
  const [playing, setPlaying] = useState(false);
  const [autoBetProfit, setAutoBetProfit] = useState(0);
  const { mutate: postGameMineRound, isLoading: isLoadingRound } =
    usePostMineRound();
  const t = useDictionary();
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

  const [betSound] = useSound("/music/bet.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [failSound] = useSound("/music/boom.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [successSound] = useSound("/music/success.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [flipSound] = useSound("/music/flip.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const {
    exchangeRate,
    showToast,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    amountToDisplayFormat,
    divCoinType,
    gaEventTrigger,
  } = useCommonHook();
  // useEffect(() => {
  //   const imageList = [
  //     "/images/game/mine/img_winmodal_title.webp",
  //     "/images/game/mine/img_winmodal_flower.webp",
  //   ];
  //   loadingPreloadImages(imageList);
  // }, []);
  const { media } = useCommonStore();

  const { mutate: postGameMineCashout, isLoading: isLoadingCashOut } =
    usePostMineCashout();

  const [bombArr, setbombArr] = useState<number[]>([]);
  const [selectedNumArr, setselectedNumArr] = useState<number[]>([]);
  const { mutate: postGameMineDo, isLoading: isLoadingDo } = usePostMineDo();
  const { mutate: postGameMineAuto, isLoading: isLoadingAuto } =
    usePostMineAuto();
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);

  //history ani
  const [historyAni, setHistoryAni] = useState(false);
  // const { mutate: postGameFlipDo } = usePostCoinFlipDo();

  const [lastGameIdx, setLastGameIdx] = useState<number>(1);
  // 내 플립 게임 히스토리
  const { data: myHistoryData, refetch: refetchMyHistoryData } =
    useGetHistoryMy(
      "mines",
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

  const { refetch: refetchCommonData } = useGetCommon(token);

  // 플립 게임 기준 데이터
  const { data: infoData } = useGetGameInfo("mines");
  const [gameState, setGameState] = useState<"play" | "playEnd" | null>(null);

  // auto bet start
  const [autoBetState, setAutoBetState] = useState(false);
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);

  const [boomCount, setBoomCount] = useState(1);

  const [bombCache, setBombCache] = useState<number>(0);

  const [numberOfBet, setNumberOfBet] = useState("");

  const { data: assetReferData } = useGetAssetRefer();

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

  // 게임 결과
  const [resultData, setResultData] = useImmer<{
    winYn: "Y" | "N";
    profit: number;
  }>({ winYn: "Y", profit: 0 });
  const refetchDelay = 2000;

  const [winModalData, setWinModalData] = useImmer<{
    betCoinType: string;
    profit: string;
    profitDollar: string;
    payOut: string;
    win_yn: "Y" | "N";
  } | null>(null);

  const [IsShowWinModal, setIsShowWinModal] = useState(false);

  const [resultHistoryData, setResultHistoryData] = useImmer<
    { pay_out: string; win_yn: string; idx: number }[] | []
  >([]);

  const { data: getMineRoundData, refetch } = useGetMineRound();

  useEffect(() => {
    setselectedNumArr([]);
    setbombArr([]);
    setWinModalData(null);
    setGameState(null);
  }, [isShowAutoBet]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (getMineRoundData && getMineRoundData.code === 1) {
      const coinType = getMineRoundData.result.betCoinType.toLocaleLowerCase();

      // 현재 날짜를 가져옴
      const currentDate = new Date();

      // 현재 날짜에 100년을 더함
      const futureDate = new Date(currentDate);
      futureDate.setFullYear(currentDate.getFullYear() + 100);
      if (coinType) {
        setCoin(coinType);
        setCookie("coin", coinType, { ...CookieOption, expires: futureDate });
      }

      setBoomCount(getMineRoundData.result.boomCount);

      let limitAmount = divCoinType(
        getMineRoundData.result.betAmount,
        coinType,
      );

      if (displayFiat) {
        limitAmount = new BigNumber(limitAmount).times(exchangeRate).toString();
      }

      // 초기 베팅 데이터를 설정하고, 이미 설정되었다면 갱신하지 않음
      if (!firstAutoBetData.betAmount) {
        setFirstAutoBetData({
          betAmount: limitAmount,
          numberOfBet,
        });
      }

      setBetAmount(limitAmount);
      setselectedNumArr(getMineRoundData.result.selectList);
      setPlaying(true);
      setGameState("play");
    }
  }, [getMineRoundData]);

  // 내 게임 히스토리 위에 16개
  useEffect(() => {
    if (propMyHistoryData && propMyHistoryData.result) {
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
          if (autoBetState) {
            setIsShowWinModal(true);
          }
          setPropMyHistoryData(myHistoryData);
          autoBetState && gameState === "play" && setGameState("playEnd");
          refetchCommonData();
        },
        !autoBetState || gameState === "play" ? 0 : 1000,
        // 0,
      );
    }
    return () => {
      clearTimeout(setTimeOut);
    };
  }, [myHistoryData]);

  const getPayoutNumber = (index: number) => {
    const totalSuccessCount: number = index + 1;
    const k = new BigNumber(1);
    let percent = new BigNumber(1);
    for (let i = 0; i < totalSuccessCount; i++) {
      percent = percent.times((25 - boomCount - i) / (25 - i));
    }
    const payout = k.div(percent).times(0.99);
    const newPayout = payout
      .decimalPlaces(1e9, BigNumber.ROUND_CEIL)
      .toFixed(2, BigNumber.ROUND_DOWN);

    return newPayout.toString();
  };

  useEffect(() => {
    isShowAutoBet && setselectedNumArr([]);
  }, [boomCount]);

  // history ani
  useEffect(() => {
    if (historyAni) {
      setTimeout(() => setHistoryAni(false), 1500);
    }
  }, [historyAni]);

  const [caculatedBetAmount, setCaculatedBetAmount] = useState("0");
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

    setCaculatedBetAmount(calculatedAmount);

    if (selectedNumArr.length === 0 && isShowAutoBet) {
      showToast(t("toast_1"));
      return false;
    }

    if (isShowAutoBet) {
      postGameMineAuto(
        {
          betAmount: calculatedAmount,
          betCoinType: coin.toLocaleUpperCase(),
          boomCount,
          selectNumberList: selectedNumArr,
        },
        {
          onError() {},
          onSuccess(data: {
            code: number;
            result: {
              avatarIdx: number;
              betAmount: string;
              betCoinType: string;
              betDollar: string;
              boomCount: number;
              gameLogIdx: number;
              minesGameIdx: number;
              nickname: string;
              nonce: number;
              payOut: string;
              profit: string;
              profitDollar: string;
              resultList: number[];
              selectList: number[];
              userIdx: number;
              winYn: "Y" | "N";
            };
          }) {
            if (data.code === 0 || data.code === 1) {
              gaEventTrigger({
                category: "Betting",
                action: "click",
                label: "Betting Mines",
                value: Number(calculatedAmount),
              });

              if (isShowAutoBet) {
                setAutoBetState(true);
              }

              setPlaying(true);

              setGameState("play");

              // 초기 베팅 데이터를 설정하고, 이미 설정되었다면 갱신하지 않음
              if (!firstAutoBetData.betAmount) {
                setFirstAutoBetData({
                  betAmount: amount,
                  numberOfBet,
                });
              }

              const arr = [];
              for (
                let i = 0;
                i < data.result.resultList.length - (25 - boomCount);
                i++
              ) {
                arr.push(data.result.resultList[i]);
              }

              setbombArr(arr);
              // setselectedNumArr([]);
              // setResultData
              setIsShowWinModal(false);
              setResultData({
                winYn: data.result.winYn,
                profit: Number(data.result.profit),
              });

              if (myHistoryData?.result.length > 0) {
                setLastGameIdx(myHistoryData.result[0].idx);
              } else {
                refetchMyHistoryData();
              }
              if (data.result.winYn === "Y") {
                setWinModalData({
                  profit: data.result.profit,
                  betCoinType: coin,
                  profitDollar: data.result.profitDollar,
                  payOut: data.result.payOut,
                  win_yn: "Y",
                });
                // setIsShowWinModal(true);
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
                setWinModalData(null);
                failSound();
                setStatisticsArray(draft => {
                  draft.push({
                    uv: statisticsArray[statisticsArray.length - 1].uv - 1,
                    profit: -Number(calculatedAmount),
                    betAmount: Number(calculatedAmount),
                  });
                  return draft;
                });
                setBombCache(bombCache + 1);
              }

              // setGameState("playEnd");
            } else {
              // autobet초기화'
              showErrorMessage(data.code);
              reset();
            }
          },
        },
      );
    } else {
      postGameMineRound(
        {
          betAmount: calculatedAmount,
          betCoinType: coin.toLocaleUpperCase(),
          boomCount,
        },
        {
          onSuccess(data: { code: number; result: boolean }) {
            if (data.code === 0) {
              setIsShowWinModal(false);
              setWinModalData(null);

              setbombArr([]);
              setselectedNumArr([]);
              setPlaying(true);
              setGameState("play");

              // 초기 베팅 데이터를 설정하고, 이미 설정되었다면 갱신하지 않음
              if (!firstAutoBetData.betAmount) {
                setFirstAutoBetData({
                  betAmount: amount,
                  numberOfBet,
                });
              }
              betSound();
              refetchCommonData();
            } else {
              // autobet초기화
              showErrorMessage(data.code);
              reset();
            }
          },
        },
      );
    }
  };

  const cashout = () => {
    postGameMineCashout(
      {},
      {
        onSuccess(data: {
          code: number;
          result: {
            avatarIdx: number;
            betAmount: string;
            betCoinType: string;
            betDollar: string;
            boomCount: number;
            gameLogIdx: number;
            minesGameIdx: number;
            nickname: string;
            nonce: number;
            payOut: string;
            profit: string;
            profitDollar: string;
            resultList: number[];
            selectList: number[];
            userIdx: number;
            winYn: "Y" | "N";
          };
        }) {
          // setselectedNumArr([]);

          // 여기ㅣ부터
          if (data.code === 0) {
            const arr = [];
            successSound();

            for (
              let i = 0;
              i < data.result.resultList.length - (25 - boomCount);
              i++
            ) {
              arr.push(data.result.resultList[i]);
            }

            setbombArr(arr);
            setPlaying(false);
            setIsShowWinModal(true);
            setWinModalData({
              profit: data.result.profit,
              betCoinType: coin,
              profitDollar: data.result.profitDollar,
              payOut: data.result.payOut,
              win_yn: data.result.winYn,
            });
            if (myHistoryData?.result.length > 0) {
              setLastGameIdx(myHistoryData.result[0].idx);
            } else {
              refetchMyHistoryData();
            }

            setGameState("playEnd");
            if (statisticsState) {
              setStatisticsArray(draft => {
                draft.push({
                  uv: statisticsArray[statisticsArray.length - 1].uv + 1,
                  profit: Number(data.result.profit),
                  betAmount: Number(caculatedBetAmount),
                });
                return draft;
              });
            }

            refetchCommonData();
          } else {
            showErrorMessage(data.code);
          }
        },
      },
    );
  };

  const checkNumberPresence = (
    mainArray: number[],
    checkArray: number[],
  ): boolean => {
    for (const numberToCheck of checkArray) {
      if (mainArray.includes(numberToCheck)) {
        return true; // Return true if a number is found
      }
    }
    return false; // Return false if none of the numbers are found
  };

  // const [gameAbleState, setGameAbleState] = useState(true);
  const handleClick = (index: number) => {
    if (!token || isLoadingDo) {
      return false;
    }

    if (
      (isShowAutoBet && gameState === "play") ||
      (!isShowAutoBet && gameState !== "play")
    ) {
      return false;
    }

    // setNumbers(prevNumbers => prevNumbers.filter(number => number !== numberToRemove))

    if (isShowAutoBet) {
      if (checkNumberPresence(selectedNumArr, [index + 1])) {
        setselectedNumArr(prevNumbers =>
          prevNumbers.filter(number => number !== index + 1),
        );
      } else {
        if (selectedNumArr.length === 25 - boomCount) {
          return false;
        }
        setselectedNumArr([...selectedNumArr, index + 1]);
      }
    } else {
      // setGameAbleState(false);
      if (selectedNumArr.length === 25 - boomCount) {
        return false;
      }
      postGameMineDo(
        {
          selectNumber: index + 1,
        },
        {
          onSuccess(data) {
            if (data.code === 0) {
              flipSound();
            }

            if (data.code === 0 || data.code === 1) {
              setselectedNumArr([...selectedNumArr, index + 1]);
            } else {
              showErrorMessage(data.code);
            }

            if (data.code === 1) {
              setPlaying(false);
              setGameState("playEnd");
              failSound();
              setStatisticsArray(draft => {
                draft.push({
                  uv:
                    statisticsArray[statisticsArray.length - 1].uv -
                    Number(caculatedBetAmount),
                  profit: -Number(caculatedBetAmount),
                  betAmount: Number(caculatedBetAmount),
                });
                return draft;
              });
              setBombCache(bombCache + 1);

              const arr = [];
              for (
                let i = 0;
                i < data.result.resultList.length - (25 - boomCount);
                i++
              ) {
                arr.push(data.result.resultList[i]);
              }

              setbombArr(arr);

              if (myHistoryData?.result.length > 0) {
                setLastGameIdx(myHistoryData.result[0].idx);
              } else {
                refetchMyHistoryData();
              }
            }
            // setGameAbleState(true);
          },
        },
      );
    }
  };

  const endGameFn = () => {};

  // 리셋 ( 뺄수 없음 오토벳으로 )
  const reset = () => {
    if (isShowAutoBet) {
      setGameState(null);
      setselectedNumArr([]);
      setbombArr([]);
      setWinModalData(null);
    }

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

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{t("game_7")}</span>
          <span>/</span>
          <span>{t("game_19")}</span>
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
                      <span>{c.pay_out} x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles["not-login-row"]}>{t("game_9")}</p>
              ))}
          </div>
        </div>
        <div
          className={classNames(styles["mine-wrapper"], {
            [styles.tablet]: media?.includes("tablet"),
          })}
        >
          <div
            className={classNames(styles["game-area"], {
              [styles.tablet]: media?.includes("tablet"),
            })}
          >
            <div
              className={classNames(styles["mine-info"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <div
                className={classNames({
                  [styles.tablet]: media?.includes("tablet"),
                })}
              >
                <span>{25 - boomCount}</span>
              </div>
              <div
                className={classNames({
                  [styles.tablet]: media?.includes("tablet"),
                })}
              >
                <span>{boomCount}</span>
              </div>
            </div>
            <div
              className={classNames(styles["mine-container"], {
                [styles.tablet]: media?.includes("tablet"),
              })}
            >
              <div
                className={styles["win-modal"]}
                style={{
                  zIndex:
                    winModalData?.win_yn === "Y" && IsShowWinModal ? 150 : -2,
                }}
              >
                <div className={styles.dim}></div>
                <div
                  className={classNames(styles.box, {
                    [styles.active]:
                      winModalData?.win_yn === "Y" && IsShowWinModal,
                  })}
                >
                  <div className={styles.content}>
                    <span>{winModalData && winModalData.payOut} x</span>

                    <div className={styles.info}>
                      <span>
                        {hydrated &&
                          winModalData &&
                          amountToDisplayFormat(
                            winModalData.profit,
                            winModalData.betCoinType.toLocaleLowerCase(),
                            winModalData.profitDollar,
                          )}
                      </span>
                      <span
                        className={`${styles.ico}`}
                        style={{
                          backgroundImage: `url('/images/tokens/img_token_${
                            winModalData?.betCoinType.toLocaleLowerCase() ??
                            "eth"
                          }_circle.svg')`,
                        }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
              {Array.from({ length: 25 }).map((c, i) => {
                return (
                  <Box
                    key={i}
                    index={i}
                    setGameState={setGameState}
                    setbombArr={setbombArr}
                    bombArr={bombArr}
                    gameState={gameState}
                    boomCount={boomCount}
                    selectedNumArr={selectedNumArr}
                    setselectedNumArr={setselectedNumArr}
                    handleClick={handleClick}
                    isShowAutoBet={isShowAutoBet}
                    checkNumberPresence={checkNumberPresence}
                    bombCache={bombCache}
                  />
                );
              })}
            </div>
          </div>
          <PayoutBox
            boomCount={boomCount}
            getPayoutNumber={getPayoutNumber}
            selectedNumArr={selectedNumArr}
            gameState={gameState}
          />
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
          limitData={infoData?.result}
          type="MINES"
          cashout={() => cashout()}
          nextGameStartDelay={2000}
          isPending={
            isLoadingRound || isLoadingCashOut || isLoadingDo || isLoadingAuto
          }
          gameId="7"
          maxBetAmount={maxBetAmount}
          setMaxBetAmount={setMaxBetAmount}
          isBtnDisable={selectedNumArr.length === 0 && playing}
          setStatisticsState={setStatisticsState}
          statisticsState={statisticsState}
        >
          <div
            className={styles["bomb-choice-box"]}
            style={{ opacity: playing ? 0.4 : 1 }}
          >
            <div className={styles.top}>
              <p>
                <span>{t("game_20")}</span>
              </p>
            </div>
            <div className={styles["swipe-box"]}>
              <Slider
                min={0}
                max={25}
                step={1}
                defaultValue={boomCount}
                value={boomCount}
                onChange={(c: number | number[]) => {
                  if (playing) {
                    return false;
                  }
                  if (typeof c === "number") {
                    if (c < 1 || c > 24) {
                      return false;
                    } else {
                      setBoomCount(c);
                    }
                  }
                }}
              />
              <div className={styles["bomb-count-box"]}>
                <span>{boomCount}</span>
              </div>
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
        refetchDelay={autoBetState ? refetchDelay : 100}
        myHistoryData={propMyHistoryData?.result}
        type="mines"
      />
    </div>
  );
}

const Box = ({
  index,
  bombArr,
  gameState,
  selectedNumArr,
  handleClick,
  isShowAutoBet,
  checkNumberPresence,
  bombCache,
}: {
  index: number;
  setGameState: Dispatch<SetStateAction<"play" | "playEnd" | null>>;
  setbombArr: Dispatch<SetStateAction<number[]>>;
  bombArr: number[];
  gameState: "play" | "playEnd" | null;
  boomCount: number;
  setselectedNumArr: Dispatch<SetStateAction<number[]>>;
  selectedNumArr: number[];
  handleClick: (index: number) => void;
  isShowAutoBet: boolean;
  checkNumberPresence: (mainArray: number[], checkArray: number[]) => boolean;
  bombCache: number;
}) => {
  const findBomb = (number: number) => {
    for (let i = 0; i < bombArr.length; i++) {
      if (bombArr[i] === number) {
        // 특정 숫자를 찾으면 true 반환
        return true;
      }
    }
    // 특정 숫자를 찾지 못하면 false 반환
    return false;
  };

  return (
    <div
      className={classNames(styles.item, {
        [styles.bomb]: gameState === "playEnd" && findBomb(index + 1),
        [styles.seleted]:
          checkNumberPresence(selectedNumArr, [index + 1]) && !isShowAutoBet,
        [styles["autobet-seleted"]]:
          checkNumberPresence(selectedNumArr, [index + 1]) && isShowAutoBet,
        [styles["game-end"]]: gameState === "playEnd",
        [styles.candy]:
          (!isShowAutoBet &&
            checkNumberPresence(selectedNumArr, [index + 1]) &&
            !findBomb(index + 1)) ||
          (gameState === "playEnd" && !findBomb(index + 1)),
        [styles.dim]:
          gameState === "playEnd" &&
          !checkNumberPresence(selectedNumArr, [index + 1]),

        [styles.fire]:
          gameState === "playEnd" &&
          checkNumberPresence(bombArr, [index + 1]) &&
          checkNumberPresence(selectedNumArr, [index + 1]),
        [styles.case]:
          gameState === "playEnd" &&
          checkNumberPresence(selectedNumArr, [index + 1]) &&
          !findBomb(index + 1),
      })}
    >
      <div>
        {gameState === "playEnd" &&
          checkNumberPresence(bombArr, [index + 1]) &&
          checkNumberPresence(selectedNumArr, [index + 1]) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${process.env.NEXT_PUBLIC_REAL_URL}/images/game/mine/img_fire.gif?cache=${bombCache}`}
              alt="img bomb"
            />
          )}
      </div>
      <button type="button" onClick={() => handleClick(index)}></button>
    </div>
  );
};

const PayoutBox = ({
  boomCount,
  getPayoutNumber,
  selectedNumArr,
  gameState,
}: {
  boomCount: number;
  getPayoutNumber: (index: number) => string;
  selectedNumArr: number[] | null;
  gameState: "play" | "playEnd" | null;
}) => {
  const { checkMedia } = useCommonHook();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boxRefArray = useRef<any[]>([]);
  const payoutBoxRef = useRef<HTMLDivElement>(null);
  const [successArray, setSuccessArray] = useState<number[] | null>(null);

  useEffect(() => {
    if (gameState === "play") {
      setSuccessArray(selectedNumArr);
    }
  }, [selectedNumArr]);
  useEffect(() => {
    if (checkMedia === "mobile") {
      if (payoutBoxRef.current && successArray?.length) {
        // const childElements = payoutBoxRef.current.children;
        const nextChildLeft =
          boxRefArray.current[successArray?.length - 1].offsetLeft -
          (boxRefArray.current[successArray?.length - 1].offsetWidth + 8);
        payoutBoxRef.current.scrollTo({
          left: nextChildLeft,
          behavior: "smooth",
        });
      }
    } else {
      scroller.scrollTo("payout" + successArray?.length.toString(), {
        duration: 300,
        // delay: 100,
        // offset: -60,
        smooth: "easeInOutQuint",
        containerId: "payoutBox",
        // ... other options
      });
    }
  }, [successArray, checkMedia]);

  return (
    <div className={styles["payout-box"]}>
      <button
        type="button"
        className={styles.up}
        onClick={() => {
          if (checkMedia !== "mobile") {
            scroller.scrollTo("payout" + 1, {
              duration: 300,
              smooth: "easeInOutQuint",
              containerId: "payoutBox",
            });
          } else {
            if (payoutBoxRef.current) {
              // const childElements = payoutBoxRef.current.children;
              payoutBoxRef.current.scrollTo({
                left: 0,
                behavior: "smooth",
              });
            }
          }
        }}
      ></button>
      <div className={styles["scroll-box"]} id="payoutBox" ref={payoutBoxRef}>
        {Array.from({ length: 25 - boomCount }).map((c, i) => {
          return (
            <div
              ref={el => (boxRefArray.current[i] = el)}
              key={i}
              className={`${styles.box} ${
                i + 1 === successArray?.length ? styles.active : ""
              }`}
              id={"payout" + (i + 1)}
            >
              <div>
                <span>{i + 1}</span>
              </div>
              <div>
                {amountFormatter({ val: getPayoutNumber(i), withDecimal: 2 })} x
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className={styles.down}
        onClick={() => {
          if (checkMedia !== "mobile") {
            scroller.scrollTo("payout" + (25 - boomCount), {
              duration: 300,
              smooth: "easeInOutQuint",
              containerId: "payoutBox",
            });
          } else {
            if (payoutBoxRef.current) {
              // const childElements = payoutBoxRef.current.children;
              const nextChildLeft =
                boxRefArray.current[24 - boomCount].offsetLeft -
                (boxRefArray.current[24 - boomCount].offsetWidth + 8);
              payoutBoxRef.current.scrollTo({
                left: nextChildLeft,
                behavior: "smooth",
              });
            }
          }
        }}
      ></button>
    </div>
  );
};
