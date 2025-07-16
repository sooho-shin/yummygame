"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./styles/plinko.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
import { useGetGameInfo, useGetHistoryMy } from "@/querys/game/common";
import { useImmer } from "use-immer";
import { useUserStore } from "@/stores/useUser";
import { points, plinkoStructure, plinkoChance } from "./config";
import AutobetBox from "../AutobetBox";
import useCommonHook from "@/hooks/useCommonHook";
import { useAssetStore } from "@/stores/useAsset";
import { useCookies } from "react-cookie";
import {
  useGetAssetRefer,
  useGetCommon,
  useGetCryptoUsd,
} from "@/querys/common";
import Slider from "rc-slider";
import "./styles/rcSliderPlinko.css";
import classNames from "classnames";
import { Textfit } from "react-textfit";
import { useCommonStore } from "@/stores/useCommon";
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  IEventCollision,
  Render,
  Runner,
  World,
} from "matter-js";
import { preloadImage } from "@/utils/imagePreload";
import { usePostPlinkoDo } from "@/querys/game/plinko";
import { customConsole } from "@/utils";
import HistoryBox from "../HistoryBox";
import BigNumber from "bignumber.js";
import useSound from "use-sound";
import ball from "/images/game/plinko/candy_01.webp";
import CommonLoading from "@/components/common/Loading";

const obj: any = {};
let aniTime: (number | null)[] = [];
let pinPosition: number[][] = [];
let effectSize = 0;
const isSampling = false;

interface CustomBody extends Body {
  metaData?: any;
}

interface HistoryDataType {
  slot: number;
  winYn: string;
  profit: string;
  payOut: string;
  idx: number;
  user_idx: number;
  nickname: string;
  avatar_idx: number;
  bet_coin_type: string;
  bet_amount: string;
  bet_dollar: string;
  profit_amount: string;
  profit_dollar: string;
  result_number: number;
  risk: string;
  row_count: number;
  pay_out: string;
  addTime: number;
  asset: {
    eth: string;
    bnb: string;
    btc: string;
    xrp: string;
    trx: string;
    sol: string;
    usdt: string;
    usdc: string;
    jel: string;
    jel_lock: string;
    hon: string;

    jel_claim?: string;
    wager?: string;
    create_date?: string;
    update_date?: string;
    idx?: number;
    user_idx?: number;
  };
}

function PlinkoWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [cookie] = useCookies();
  const { token, displayFiat } = useUserStore();
  const { coin } = useAssetStore();
  const [betAmount, setBetAmount] = useState<string | null>("0.01");
  const [playing, setPlaying] = useState(false);
  const [autoBetProfit, setAutoBetProfit] = useState(0);
  const [maxBetAmount, setMaxBetAmount] = useState<string | null>(null);
  const [lastGameIdx] = useState<number>(0);
  // auto bet start
  const [autoBetState, setAutoBetState] = useState(false);
  const [isShowAutoBet, setIsShowAutoBet] = useState(false);
  const { data: exchangeData } = useGetCryptoUsd();

  const [numberOfBet, setNumberOfBet] = useState("");
  const { refetch: refetchCommonData } = useGetCommon(token);
  const { data: assetReferData } = useGetAssetRefer();

  const [tempPoint, setTempPoint] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  // 플립 게임 기준 데이터
  const { data: infoData } = useGetGameInfo("plinko");
  const [gameState, setGameState] = useState<"play" | "playEnd" | null>(null);
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

  const {
    exchangeRate,
    showErrorMessage,
    getLimitAmount,
    commonValidateGameBet,
    calculateBetAmount,
    divCoinType,
    fiatSymbol,
    transformObject,
    gaEventTrigger,
    showToast,
  } = useCommonHook();
  const { tokenList, setTokenList } = useCommonStore();

  useEffect(() => {
    setBetAmount(
      getLimitAmount({ limitType: "min", limitData: infoData?.result }),
    );
  }, [displayFiat, coin, infoData, exchangeRate, assetReferData]);

  const t = useDictionary();
  // 내 게임 히스토리
  const { data: myHistoryData, refetch: refetchMyHistoryData } =
    useGetHistoryMy(
      "plinko",
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
    if (propMyHistoryData) {
      const arr: { pay_out: string; win_yn: string; idx: number }[] = [];

      const slicedArr = propMyHistoryData.slice(0, 12);

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
    }
  }, [propMyHistoryData]);

  useEffect(() => {
    if (myHistoryData?.result) {
      setPropMyHistoryData(myHistoryData.result);
    }
  }, [myHistoryData]);

  //history ani
  const [historyAni, setHistoryAni] = useState(false);

  useEffect(() => {
    if (historyAni) {
      setTimeout(() => setHistoryAni(false), 1500);
    }
  }, [historyAni]);

  const riskArray = [
    {
      text: t("game_66"),
      value: "low",
    },
    {
      text: t("game_67"),
      value: "medium",
    },
    {
      text: t("game_68"),
      value: "high",
    },
  ];

  const endGameFn = () => {};

  // 리셋 ( 뺄수 없음 오토벳으로 )
  const reset = () => {
    setPlaying(false);
    setAutoBetState(false);
    setAutoBetProfit(0);
    setPlinkoAutobetState(true);
    setAutoBetState(false);
    if (firstAutoBetData.betAmount) {
      setBetAmount(firstAutoBetData.betAmount);
      setNumberOfBet(firstAutoBetData.numberOfBet);
    }
    setFirstAutoBetData({
      betAmount: null,
      numberOfBet: "",
    });
  };
  const [betSound] = useSound("/music/bet.mp3", {
    soundEnabled: !cookie.disableSound,
  });
  const [floorSound] = useSound("/music/floor-effect.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  // ****************************** 여기부터 플링코 코드 **************************************** //

  const [pins, setPins] = useState<Body[]>([]);
  const [render, setRender] = useState<Render | null>(null);
  const [lines, setLines] = useState(10);
  const [risk, setRisk] = useState(riskArray[0].value);
  const plinkoRef = useRef<HTMLDivElement>(null);
  const floorBoxRefArray = useRef<HTMLDivElement[] | null[]>([]);

  const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);

  useEffect(() => {
    if (!pins.length) return;
    aniTime = Array(pins.length).fill(null);
    pinPosition = pins.map(p => [p.position.x, p.position.y]);
  }, [pins]);

  useEffect(() => {
    const imageList = [
      "/images/game/plinko/candy_01.webp",
      "/images/game/plinko/candy_02.webp",
      "/images/game/plinko/candy_03.webp",
      "/images/game/plinko/candy_04.webp",
      "/images/game/plinko/candy_05.webp",
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagesPromiseList: Promise<any>[] = [];
    for (const i of imageList) {
      imagesPromiseList.push(preloadImage(i));
    }
    const loadCall = async () => {
      await Promise.all(imagesPromiseList);
      setImagesPreloaded(true);
    };
    loadCall();
  }, []);
  const engine = useMemo(() => {
    return Engine.create();
  }, []);

  const world = {
    width: 518 * 2,
    height: 406 * 2,
  };

  const engineConfig = {
    engineGravity: 2,
  };

  const pointRadius = 3;
  const pointWeightRatio = 0.3;
  const worldWidth: number = world.width;
  const worldHeight: number = world.height;

  const screenRatio = useMemo(() => {
    if (!plinkoRef.current) {
      return 1;
    } else {
      return (plinkoRef.current?.offsetWidth * 2) / worldWidth;
    }
  }, [plinkoRef.current?.offsetWidth]);

  const plinkoConfig = useMemo(() => {
    effectSize = ((worldWidth / lines + 2) / 2) * 0.6;
    return {
      culoums: lines + 2,
      pointRadius: pointRadius,
      topWallGap: 170,
      topBallGap: 50,
      pinSize: pointRadius * ((18 - lines + 2) * pointWeightRatio + 1),
    };
  }, [lines, pointWeightRatio]);

  useEffect(() => {
    engine.gravity.y = engineConfig.engineGravity;
    const element = document.getElementById("plinko");
    const render = Render.create({
      element: element!,
      bounds: {
        max: {
          y: worldHeight,
          x: worldWidth,
        },
        min: {
          y: 0,
          x: 0,
        },
      },
      options: {
        background: "transparent",
        hasBounds: true,
        width: worldWidth,
        height: worldHeight,
        wireframes: false,
      },
      engine,
    });
    setRender(render);
    Render.run(render);
    const interval = setInterval(() => {
      Engine.update(engine, 1000 / 60); // 60 FPS
    }, 1000 / 100);

    return () => {
      clearInterval(interval);
      World.clear(engine.world, true);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  useEffect(() => {
    if (!plinkoConfig || !imagesPreloaded) return;

    Composite.clear(engine.world, false);
    const pins: CustomBody[] = [];
    const floors: CustomBody[] = [];

    const verticalSpacing =
      (world.height - plinkoConfig.topBallGap) / (lines - 1) -
      plinkoConfig.pinSize / (lines - 1);

    const centerX = worldWidth / 2;
    let pointA = { x: 0, y: 0 };
    let pointB = { x: 0, y: 0 };
    let pointC = { x: 0, y: 0 };

    function calculateAngle(
      A: { x: number; y: number },
      B: { x: number; y: number },
      C: { x: number; y: number },
    ) {
      // AB 벡터 계산
      const ABx = A.x - B.x;
      const ABy = A.y - B.y;
      // BC 벡터 계산
      const BCx = C.x - B.x;
      const BCy = C.y - B.y;
      // 내적 계산
      const dotProduct = ABx * BCx + ABy * BCy;
      // 각 벡터의 크기 계산
      const magnitudeAB = Math.sqrt(ABx * ABx + ABy * ABy);
      const magnitudeBC = Math.sqrt(BCx * BCx + BCy * BCy);
      // 코사인 값 계산
      const cosTheta = dotProduct / (magnitudeAB * magnitudeBC);
      // 라디안 단위 각도 계산
      const angleInRadians = Math.acos(cosTheta);
      // 라디안을 도 단위로 변환
      const angleInDegrees = angleInRadians * (180 / Math.PI);
      return angleInDegrees;
    }

    let pinIdx = 0;
    for (let i = 2; i < plinkoConfig.culoums; i++) {
      for (let j = 0; j <= i; j++) {
        const x = centerX + (j - i / 2) * (worldWidth / plinkoConfig.culoums);
        const y = (i + -2) * verticalSpacing + plinkoConfig.topBallGap - 12;
        if (i === 2 && j === 0) {
          pointA = { x, y };
        }

        if (i === 2 && j === 2) {
          // tempPoint = [pointA, { x, y }];
          setTempPoint([
            { x: pointA.x, y: pointA.y },
            { x, y },
          ]);
        }

        const pin: CustomBody = Bodies.circle(x, y, plinkoConfig.pinSize, {
          label: `pin-${pinIdx}`,
          render: {
            // fillStyle: "#fff",
            sprite: {
              texture: "/images/game/plinko/ball.webp",
              xScale: plinkoConfig.pinSize / (60 / 2), // Scale the image as needed
              yScale: plinkoConfig.pinSize / (60 / 2),
            },
          },
          isStatic: true,
        });
        pin.metaData = pinIdx;
        pinIdx++;
        pins.push(pin);

        if (i === plinkoConfig.culoums - 1 && j !== i) {
          const floor: CustomBody = Bodies.rectangle(
            x + worldWidth / plinkoConfig.culoums / 2,
            y + plinkoConfig.pinSize + 12,
            worldWidth / plinkoConfig.culoums,
            1,
            {
              label: "block-" + j,
              render: {
                visible: false,
                fillStyle: "red",
              },
              isStatic: true,
            },
          );
          floor.metaData = j;
          obj["block-" + j] = [];

          floors.push(floor);

          if (j === 0) {
            pointB = { x, y };
          }
          if (j === 1) {
            pointC = { x, y };
          }
        }
      }
    }
    const leftWall = Bodies.rectangle(-0, worldHeight, worldWidth * 2, 1, {
      angle: (-calculateAngle(pointA, pointB, pointC) * Math.PI) / 180,
      render: {
        visible: false,
        fillStyle: "red",
      },
      isStatic: true,
    });

    const rightWall = Bodies.rectangle(
      worldWidth + 0,
      worldHeight,
      worldWidth * 2,
      1,
      {
        angle: (calculateAngle(pointA, pointB, pointC) * Math.PI) / 180,
        render: {
          visible: false,
          fillStyle: "red",
        },
        isStatic: true,
      },
    );

    Composite.add(engine.world, [...pins, leftWall, rightWall, ...floors]);

    setPins(pins);
  }, [plinkoConfig, imagesPreloaded, lines]);

  const [currentBallIdList, setCurrentBallIdList] = useImmer<number[]>([]);

  useEffect(() => {
    if (currentBallIdList.length === 0) {
      setPlaying(false);
      setGameState("playEnd");
      refetchCommonData();
    }
  }, [currentBallIdList]);

  const addInGameBall = (ballId: number) => {
    setCurrentBallIdList(draft => {
      draft.push(ballId);
      return;
    });
  };

  const removeInGameBall = (ballId: number) => {
    setCurrentBallIdList(draft => {
      const arr = draft.filter(element => element !== ballId);
      return arr;
    });
  };

  const addBall = useCallback(
    (
      type: string,
      ballId: number,
      point: number,
      score: number,
      hitoryData: HistoryDataType,
    ) => {
      const ballX = point;
      const ballColor = "#fff";
      const ballSize =
        ((worldWidth / plinkoConfig.culoums) * 0.5 - plinkoConfig.pinSize) *
        0.8;
      const date = new Date().getTime();

      const ball: CustomBody = Bodies.circle(ballX, 0, ballSize, {
        restitution: 0.7,
        friction: 1,
        // label: `${ballX}`,

        label: `ball-${ballId}-${type}-${score}-${ballX}`,
        id: date,
        frictionAir: 0.01,
        collisionFilter: {
          group: -1,
        },
        render: {
          fillStyle: ballColor,
          sprite: {
            texture: `/images/game/plinko/candy_0${
              Math.floor(Math.random() * 5) + 1
            }.webp`,
            xScale: ballSize / (450 / 2),
            yScale: ballSize / (450 / 2),
          },
        },
        isStatic: false,
      });

      ball.metaData = {
        ...hitoryData,
        x: ballX,
        addTime: Date.now(),
      };

      addInGameBall(date);
      Composite.add(engine.world, ball);
    },
    [lines],
  );

  const onCollideWithMultiplier = useCallback(
    (ball: Body, multiplier: Body) => {
      ball.collisionFilter.group = 2;

      World.remove(engine.world, ball);

      removeInGameBall(ball.id);
      const ballInfo = ball.label.split("-") as string[];
      const ballId = ballInfo[1];
      const multiplierValue = Number(ballInfo[3]);
    },
    [engine, World],
  );
  const [lastResurt, setLastResurt] = useState<HistoryDataType | null>(null);

  useEffect(() => {
    if (lastResurt) {
      const slicedArr = propMyHistoryData.slice(0, 100 - 1);

      const newTokenList = lastResurt.asset;

      delete newTokenList.jel_claim;
      delete newTokenList.wager;
      delete newTokenList.create_date;
      delete newTokenList.update_date;
      delete newTokenList.idx;
      delete newTokenList.user_idx;

      setTokenList(transformObject(newTokenList as any));

      floorSound();
      setPropMyHistoryData([
        {
          ...lastResurt,
          game_idx: lastResurt.idx,
          create_date: lastResurt.addTime,
        },
        ...slicedArr,
      ]);
    }
  }, [lastResurt]);

  const onBodyCollision = useCallback(
    (
      event: IEventCollision<Engine>,
      // authUser: any,
    ) => {
      const pairs = event.pairs;
      for (const pair of pairs) {
        const bodyA: CustomBody = pair.bodyA;
        const bodyB: CustomBody = pair.bodyB;
        if (bodyB.label.includes("ball") && bodyA.label.includes("block")) {
          if (isSampling) {
            const { x, addTime } = bodyB.metaData;
            obj[bodyA.label].push({ num: x, deltaTime: Date.now() - addTime });
          }
          const blockIndex = bodyA.metaData;
          if (floorBoxRefArray?.current?.[blockIndex]) {
            floorBoxRefArray.current[blockIndex]!.classList.add(styles.ani);

            setLastResurt(bodyB.metaData);

            setTimeout(() => {
              floorBoxRefArray.current[blockIndex]!.classList.remove(
                styles.ani,
              );
            }, 100);

            // setHistoryAni(true);
          }

          onCollideWithMultiplier(bodyB, bodyA);
        } else if (bodyA.label.includes("pin")) {
          const pinIdx = bodyA.metaData;

          if (!aniTime[pinIdx]) {
            aniTime[pinIdx] = Date.now();
          }
        }
      }
    },
    [engine, risk, lines, propMyHistoryData, floorSound],
  );

  // point 배열 뽑기 용

  type ArrayObject = {
    [key: string]: number[];
  };

  function evenlySelect<T>(arr: T[], numSamples: number): T[] {
    if (arr.length < numSamples) {
      return arr;
    }

    const step = arr.length / numSamples;
    const sampledArr: T[] = [];

    for (let i = 0; i < numSamples; i++) {
      const index = Math.floor(step * i);
      sampledArr.push(arr[index]);
    }

    return sampledArr;
  }

  function processObject(obj: ArrayObject, numSamples: number): ArrayObject {
    const result: ArrayObject = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = evenlySelect(obj[key], numSamples);
      }
    }

    return result;
  }

  function sampling(obj: any) {
    const result = {};
    for (const key in obj) {
      const data = obj[key];
      const size = data.length;

      const sum = data
        // @ts-ignore
        .map(o => o.deltaTime)
        // @ts-ignore
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const average = sum / size;

      const limit = average * 1.3;
      // @ts-ignore
      const filterData = data.filter(o => o.deltaTime <= limit);
      const sample = evenlySelect(filterData, 50);
      // @ts-ignore
      result[key] = sample.map(o => o.num);
    }
    return result;
  }

  const betMutation = usePostPlinkoDo(); // 새로운 mutation 객체 생성
  const [plinkoAutobetState, setPlinkoAutobetState] = useState(true);

  useEffect(() => {
    if (!autoBetState) {
      if (firstAutoBetData.betAmount) {
        setBetAmount(firstAutoBetData.betAmount);
        setNumberOfBet(firstAutoBetData.numberOfBet);
      }
    } else {
      setFirstAutoBetData({
        betAmount: betAmount,
        numberOfBet,
      });
    }
  }, [autoBetState]);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    // Safari 문자열이 포함되어 있으면서 Chrome, CriOS(iOS Chrome), FxiOS(iOS Firefox),
    // Edge, OPiOS(iOS Opera), Opera 등이 없으면 사파리라고 판단
    const safariPattern = /Safari/;
    const excludePattern = /Chrome|CriOS|FxiOS|Edge|OPiOS|Opera/;

    const isSafariBrowser =
      safariPattern.test(userAgent) && !excludePattern.test(userAgent);

    setIsSafari(isSafariBrowser);
  }, []);

  const bet = async (amount: string) => {
    if (isSafari) {
      showToast(t("game_78"));
      return false;
    }
    if (!plinkoAutobetState && autoBetState) {
      setAutoBetState(false);
      setPlinkoAutobetState(true);
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
    // setKey(key + 1);
    try {
      const data = await betMutation.mutateAsync({
        id: Date.now(),
        betAmount: calculatedAmount,
        betCoinType: coin.toLocaleUpperCase(),
        risk: risk,
        rowCount: lines,
        // key,
      });

      if (data.code === 0) {
        gaEventTrigger({
          category: "Betting",
          action: "click",
          label: "Betting Plinko",
          value: Number(calculatedAmount),
        });
        if (isShowAutoBet && !autoBetState) {
          setAutoBetState(true);
          setPlinkoAutobetState(true);
        }
        // 초기 베팅 데이터를 설정하고, 이미 설정되었다면 갱신하지 않음
        // if (!firstAutoBetData.betAmount && isShowAutoBet) {
        //   setFirstAutoBetData({
        //     betAmount: amount,
        //     numberOfBet,
        //   });
        // }

        setResultData(draft => {
          draft.winYn = data.result.winYn;
          draft.profit = Number(data.result.profit);
        });

        const pointArray = points[lines - 8];
        // @ts-ignore
        const pointData = pointArray[`block-${data.result.slot}`];
        const ran = Math.floor(Math.random() * pointData.length);

        let x = tempPoint[0].x;
        if (!isSampling) {
          addBall("data.difficulty", 9981, pointData[ran], 6238, data.result);
        } else {
          const interval = setInterval(() => {
            addBall(
              "data.difficulty",
              9981,
              // @ts-ignore
              x,
              6238,
              data.result,
            );
            x += 0.05;
            if (Number(x.toFixed(2)) >= tempPoint[1].x) {
              clearInterval(interval);
            }
          }, 40);
        }
      } else {
        // autobet초기화
        showErrorMessage(data.code);
        reset();
      }
    } catch (error) {
      customConsole(error);
    }
  };

  useEffect(() => {
    if (!render) return;

    Events.on(render, "afterRender", () => {
      const context = render.context;
      const now = Date.now();
      aniTime.forEach((ani, pinIdx) => {
        if (!ani) return;
        const delta = now - ani;
        if (delta > 400) {
          aniTime[pinIdx] = null;
          return;
        }
        const position = pinPosition[pinIdx];
        if (!position) throw new Error("Unknown peg at index " + pinIdx);
        const pct = delta / 400;
        const k = 130;
        const y = Math.log(k * pct + 1) / Math.log(pct + 1);
        const expandRadius = Math.max(0, effectSize - y);
        context.fillStyle = "#fff2";
        context.beginPath();
        context.arc(position[0], position[1], expandRadius, 0, 2 * Math.PI);
        context.fill();
      });
    });

    return () => {
      Events.off(render, "afterRender", () => {});
    };
  }, [render]);

  // Events.on(engine, 'collisionActive', onBodyCollision)
  useEffect(() => {
    if (!engine) return;
    // userIdRef.current = authUser.id;
    Events.on(engine, "collisionStart", e => {
      onBodyCollision(e);
    });

    return () => {
      Events.off(engine, "collisionStart", () => {});
    };
  }, [engine]);

  const colors = useMemo(() => {
    switch (plinkoConfig.culoums) {
      case 17:
        return [
          "#787BFD",
          "#8572E1",
          "#906BCA",
          "#9767BB",
          "#A061A8",
          "#A85B97",
          "#AF5687",
          "#B95072",
          "#C3495C",
        ];
      case 16:
        return [
          "#787BFD",
          "#8572E1",
          "#906BCA",
          "#9767BB",
          "#9F61A8",
          "#A85B97",
          "#AF5687",
          "#C3495C",
        ];
      case 15:
        return [
          "#787BFD",
          "#8572E1",
          "#906BCA",
          "#9767BB",
          "#9F61A8",
          "#A85B97",
          "#AF5687",
          "#C3495C",
        ];
      case 14:
        return [
          "#787BFD",
          "#8572E1",
          "#906BCA",
          "#9767BB",
          "#A061A8",
          "#AF5687",
          "#C3495C",
        ];
      case 13:
        return [
          "#787BFD",
          "#8572E1",
          "#906BCA",
          "#9767BB",
          "#A061A8",
          "#AF5687",
          "#B95072",
        ];
      case 12:
        return [
          "#787BFD",
          "#8572E1",
          "#906BCA",
          "#A061A8",
          "#AF5687",
          "#C3495C",
        ];
      case 11:
        return [
          "#787BFD",
          "#8572E1",
          "#906BCA",
          "#A061A8",
          "#AF5687",
          "#C3495C",
        ];
      case 10:
        return ["#787BFD", "#906BCA", "#A061A8", "#AF5687", "#C3495C"];
      case 9:
        return ["#787BFD", "#906BCA", "#A061A8", "#AF5687", "#C3495C"];
      default:
        return [
          "#787BFD",
          "#8572E1",
          "#8E6DCE",
          "#9767BB",
          "#9F61A8",
          "#A85B97",
          "#B05584",
          "#B95072",
          "#C3495C",
        ];
    }
  }, [plinkoConfig.culoums]);

  const [hoveredFloorIndex, setHoveredFloorIndex] = useState(0);

  const caculateHoverdAmount = useMemo(() => {
    return new BigNumber(
      divCoinType(
        calculateBetAmount(betAmount)
          ? new BigNumber(calculateBetAmount(betAmount) ?? "0")
              .times(
                // @ts-ignore
                plinkoStructure[risk][lines][hoveredFloorIndex] <= 1
                  ? "1"
                  : // @ts-ignore
                    plinkoStructure[risk][lines][hoveredFloorIndex],
              )
              .minus(calculateBetAmount(betAmount) ?? "0")
              .toString()
          : "0",
        coin,
      ),
    )
      .decimalPlaces(7, BigNumber.ROUND_CEIL)
      .toString();
  }, [betAmount, plinkoStructure, hoveredFloorIndex]);

  // if (!resultHistoryData || !render || !plinkoConfig || !imagesPreloaded)
  //   return <CommonLoading />;
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles["game-wrapper"]}>
          <div className={styles["bread-comp"]}>
            <span>{t("game_7")}</span>
            <span>/</span>
            <span>{t("game_69")}</span>
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
                      <div
                        key={i}
                        className={c.win_yn === "Y" ? styles.win : ""}
                      >
                        <span>{Number(c.pay_out).toFixed(2)} x</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles["not-login-row"]}>{t("game_9")}</p>
                ))}
            </div>
            <div className={styles["plinko-wrapper"]}>
              <div className={styles["plinko-content"]}>
                {(!resultHistoryData ||
                  !render ||
                  !plinkoConfig ||
                  !imagesPreloaded) && (
                  <div className={styles["loading-wrapper"]}>
                    <div className={styles["loading-container"]}>
                      <span className={styles.loader}></span>
                    </div>
                  </div>
                )}
                <div
                  id="plinko"
                  ref={plinkoRef}
                  style={{
                    opacity:
                      !resultHistoryData ||
                      !render ||
                      !plinkoConfig ||
                      !imagesPreloaded
                        ? 0
                        : 1,
                  }}
                />
                <div
                  className={styles["floor-row"]}
                  style={{
                    padding: `0 ${
                      (worldWidth / plinkoConfig.culoums / 4) * screenRatio
                      // screenRatio
                    }px`,
                    opacity:
                      !resultHistoryData ||
                      !render ||
                      !plinkoConfig ||
                      !imagesPreloaded
                        ? 0
                        : 1,
                  }}
                >
                  <div
                    className={styles.row}
                    style={
                      {
                        // gap: `${plinkoConfig.pinSize * screenRatio}px`,
                      }
                    }
                  >
                    {hydrated && exchangeData && (
                      <div className={styles["info-box"]}>
                        <div>
                          <div className={styles.top}>
                            <span>{t("game_70")}</span>
                            <span>
                              {coin.toLocaleLowerCase() !== "hon" &&
                                fiatSymbol +
                                  " " +
                                  new BigNumber(caculateHoverdAmount)
                                    .times(exchangeRate)
                                    .decimalPlaces(2, BigNumber.ROUND_CEIL)
                                    .toString()}
                            </span>
                          </div>
                          <div className={styles.box}>
                            <span
                              className={styles.ico}
                              style={{
                                backgroundImage: `url(/images/tokens/img_token_${coin.toLocaleLowerCase()}_circle.svg)`,
                              }}
                            ></span>
                            <span>
                              {caculateHoverdAmount}
                              {/* {coin.toLocaleLowerCase()} */}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className={styles.top}>
                            <span>{t("game_71")}</span>
                          </div>
                          <div className={styles.box}>
                            <span>
                              {
                                plinkoChance[
                                  lines.toString() as
                                    | "8"
                                    | "9"
                                    | "10"
                                    | "11"
                                    | "12"
                                    | "13"
                                    | "14"
                                    | "15"
                                ][hoveredFloorIndex]
                              }
                            </span>
                            <span className={styles.percent}>%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {Array.from({ length: plinkoConfig.culoums - 1 }).map(
                      (_, i) => {
                        const isEven = (plinkoConfig.culoums - 1) % 2 === 0;
                        const centerIndex = Math.floor(
                          (plinkoConfig.culoums - 1) / 2,
                        );

                        let color;
                        if (
                          isEven &&
                          (i === centerIndex || i === centerIndex - 1)
                        ) {
                          color = colors[0];
                        } else {
                          const colorIndex = Math.abs(centerIndex - i);
                          color = colors[colorIndex % colors.length];
                        }

                        return (
                          <div
                            key={i}
                            ref={element => {
                              floorBoxRefArray.current[i] = element;
                            }}
                            style={{
                              backgroundColor: color,
                              width:
                                ((worldWidth -
                                  worldWidth / plinkoConfig.culoums -
                                  plinkoConfig.pinSize * 2) /
                                  (lines + 1) /
                                  2) *
                                screenRatio,
                            }}
                            className={styles.floor}
                            onMouseOver={() => {
                              // @ts-ignore
                              setHoveredFloorIndex(i);
                            }}
                          >
                            <span>
                              {
                                <Textfit mode="single" max={12}>
                                  {/* @ts-ignore */}
                                  {plinkoStructure[risk][lines][i]}x
                                </Textfit>
                              }
                            </span>
                          </div>
                        );
                      },
                    )}
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
            limitData={infoData?.result}
            type="PLINKO"
            nextGameStartDelay={2000}
            // isPending={
            //   isLoadingRound || isLoadingCashOut || isLoadingDo || isLoadingAuto
            // }
            gameId="8"
            maxBetAmount={maxBetAmount}
            setMaxBetAmount={setMaxBetAmount}
            setPlinkoAutobetState={setPlinkoAutobetState}
          >
            <>
              <div
                className={styles["risk-row"]}
                style={{
                  opacity: playing || currentBallIdList.length ? 0.4 : 1,
                }}
              >
                <div className={styles.top}>
                  <p>
                    <span>{t("game_72")}</span>
                  </p>
                </div>
                <div
                  className={classNames(styles.row, {
                    [styles.disabled]: playing || currentBallIdList.length,
                  })}
                >
                  {riskArray.map(c => {
                    return (
                      <button
                        type="button"
                        key={c.value}
                        className={classNames({
                          [styles.active]: risk === c.value,
                        })}
                        onClick={() => {
                          if (playing || currentBallIdList.length) {
                            return false;
                          }
                          setRisk(c.value);
                        }}
                      >
                        <span>{c.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div
                className={styles["bomb-choice-box"]}
                style={{
                  opacity: playing || currentBallIdList.length ? 0.4 : 1,
                }}
              >
                <div className={styles.top}>
                  <p style={{ width: "100%" }}>
                    {/* <span>Row {currentBallIdList.length}</span> */}
                    <span>{t("game_73")}</span>
                    <span style={{ marginLeft: "auto" }}>{lines}</span>
                  </p>
                </div>
                <div className={styles["swipe-box"]}>
                  <div className={styles["bomb-count-box"]}>
                    <span>8</span>
                  </div>
                  <Slider
                    min={8}
                    max={16}
                    step={1}
                    defaultValue={lines}
                    value={lines}
                    onChange={(c: number | number[]) => {
                      if (playing || currentBallIdList.length) {
                        return false;
                      }
                      if (typeof c === "number") {
                        if (c < 8 || c > 16) {
                          return false;
                        } else {
                          setLines(c);
                        }
                      }
                    }}
                  />
                  <div className={styles["bomb-count-box"]}>
                    <span>16</span>
                  </div>
                </div>
              </div>
            </>
          </AutobetBox>
        )}
        <HistoryBox
          refetchDelay={0}
          myHistoryData={propMyHistoryData}
          type="plinko"
        />
      </div>
    </>
  );
}

export default PlinkoWrapper;
