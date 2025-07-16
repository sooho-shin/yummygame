"use client";

import { useUserStore } from "@/stores/useUser";
import { BigNumber } from "bignumber.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./styles/wheel.module.scss";
// import useSocketHook from "@/hooks/useSocketHook";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetCommon } from "@/querys/common";
import { WheelStatusType } from "@/types/games/wheel";
import classNames from "classnames";
import useSound from "use-sound";

export default function Wheel({
  countImmer,
  resultNumber,
  wheelStatus,
  resultMultiply,
  refetchDelay,
  modal,
  jackpotInfo,
  winYn,
}: {
  countImmer: {
    startTimestamp: number;
    serverTimestamp: number;
    gapTimeStamp: number;
  };
  resultNumber: number | null;
  resultMultiply: number | null;
  wheelStatus: WheelStatusType;
  refetchDelay: number;
  modal: React.ReactNode;
  jackpotInfo:
    | {
        count: number;
        totalJel: string;
        multiply: string;
      }
    | null
    | undefined;
  winYn: "Y" | "N" | null;
  playing: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [cookie] = useCookies();

  const [failSound] = useSound("/music/fail.mp3", {
    soundEnabled: !cookie.disableSound,
  });

  const [successSound] = useSound("/music/success.mp3", {
    soundEnabled: !cookie.disableSound,
  });
  // 라인 분류 배열
  const choices = [
    [
      2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38,
      40, 42, 44, 46, 48, 50, 52,
    ],
    [3, 5, 7, 13, 15, 17, 23, 25, 27, 29, 31, 37, 39, 41, 47, 49, 51],
    [1, 9, 11, 19, 21, 33, 35, 43, 45, 53],
    [0],
  ];
  const { checkMedia } = useCommonHook();
  const { token } = useUserStore();
  const { refetch: refetchCommonData } = useGetCommon(token);
  const [isRotating, setIsRotating] = useState(false);
  const [rotation, setRotation] = useState<number>(0); // 회전 각도 상태 변수
  const [lines, setLines] = useState<React.JSX.Element[]>([]);
  //   const resultTriangle = useRef<SVGPolygonElement>(null);
  const [count, setCount] = useState<string | null>("0.0");
  const requestRef = useRef<number>(0);
  const t = useDictionary();

  const wheelPosition = useMemo(() => {
    if (checkMedia === "mobile") {
      return {
        center: 120,
        radius: 120,
      };
    } else {
      return {
        center: 140,
        radius: 140,
      };
    }
  }, [checkMedia]);

  const circumference = 2 * Math.PI * wheelPosition.radius; // 원둘레
  const rotateCount = 5; // 회전 바퀴 수
  const lineInterval = 2; // 간격
  const strokeWidth =
    Number((Number(circumference.toFixed(0)) / 50).toFixed(0)) - lineInterval; // 선의 두께
  const lineCount =
    choices[0].length +
    choices[1].length +
    choices[2].length +
    choices[3].length; // 선의 개수
  const angle = (2 * Math.PI) / lineCount; // 일정한 선의 간격을 위한 계산
  const resultTriangle = useRef<SVGPolygonElement>(null);

  const countDown = () => {
    const cur = new Date().getTime() - countImmer.gapTimeStamp;
    const count = countImmer.startTimestamp - cur + 10000;
    if (count > 0 && count <= 10000) {
      setCount((count / 1000).toFixed(1));
    }
    requestRef.current = requestAnimationFrame(countDown);
  };

  useEffect(() => {
    // requestAnimationFrame 실행 하는 곳
    requestRef.current = requestAnimationFrame(countDown);
    // if (crashSize.width > 0) {
    //     requestRef.current = requestAnimationFrame(run);
    // }

    return () => cancelAnimationFrame(requestRef.current);
  }, [countImmer]);

  const nameMap: Record<number, string> = {
    0: "#ACADC3",
    1: "#F01873",
    2: "#00BEFF",
    3: "#FFD953",
  };

  function getChoiceName(randomNumber: number) {
    return nameMap[
      choices.findIndex(numbers => numbers.includes(randomNumber))
    ];
  }

  function getRandomNumberWithDecimal(min: number, max: number) {
    // 무작위로 0과 1 사이의 숫자를 생성합니다.
    const randomNum = Math.random();

    // min과 max 사이의 범위를 구합니다.
    const range = max - min;

    // randomNum을 range으로 곱하여 min에서부터의 거리를 구하고,
    // 거기에 min을 더해 최종 랜덤 숫자를 얻습니다.
    const randomNumber = randomNum * range + min;

    // 소수점 두 자리까지 반올림하여 반환합니다.
    return Math.round(randomNumber * 100) / 100;
  }

  const [resultState, setResultState] = useState(false);

  useEffect(() => {
    if (resultTriangle.current) {
      const addRotateAmount = Number(
        new BigNumber(360)
          .div(lineCount)
          .times(resultNumber ?? 0)
          .plus(
            getRandomNumberWithDecimal(
              -Number(
                new BigNumber(360).div(lineCount).div(2).minus(1).toFixed(0),
              ),
              Number(
                new BigNumber(360).div(lineCount).div(2).minus(1).toFixed(0),
              ),
            ),
          )
          .toFixed(4),
      );

      setRotation(addRotateAmount);
      resultTriangle.current?.classList.add(styles.active);

      if (wheelStatus !== "Bet") {
        setResultState(true);
      }

      if (resultNumber !== null && wheelStatus === "StopBet") {
        setResultState(false);
        setIsRotating(true);

        resultTriangle.current?.classList.remove(styles.active);

        setRotation(360 * rotateCount + addRotateAmount);

        setTimeout(() => {
          setIsRotating(false);
          setRotation(addRotateAmount);
          resultTriangle.current?.classList.add(styles.active);
          setResultState(true);
          refetchCommonData();
          if (winYn === "Y") {
            successSound();
          }

          if (winYn === "N") {
            failSound();
          }
        }, refetchDelay);
      }
    }
  }, [
    resultNumber,
    wheelStatus,
    resultTriangle.current,
    winYn,
    successSound,
    failSound,
  ]);

  useEffect(() => {
    const lineArray = [];
    for (let i = 0; i < lineCount; i++) {
      const x1 = wheelPosition.center; // 시작점 x 좌표 계산
      const y1 = wheelPosition.center; // 시작점 y 좌표 계산
      const x2 =
        wheelPosition.center + Math.sin(i * angle) * wheelPosition.radius; // 끝점 x 좌표 계산
      const y2 =
        wheelPosition.center + Math.cos(i * angle) * wheelPosition.radius; // 끝점 y 좌표 계산

      //   const strokeColor = i % 2 === 0 ? "red" : "blue"; // 짝수 번째 선은 빨간색, 홀수 번째 선은 파란색
      lineArray.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={getChoiceName(i)}
          strokeWidth={strokeWidth}
        />,
      );
    }
    setLines(lineArray);
  }, [wheelPosition]);

  useEffect(() => {
    if (wheelStatus === "Bet") {
      setResultState(false);
    }
  }, [wheelStatus]);

  const [winModalAni, setWinModalAni] = useState(false);

  useEffect(() => {
    if (resultState) {
      setWinModalAni(true);
    }
  }, [resultState]);

  useEffect(() => {
    if (winModalAni) {
      setTimeout(() => {
        setWinModalAni(false);
      }, 3000);
    }
  }, [winModalAni]);

  if (!hydrated) return <></>;

  return (
    <div className={styles["wheel-content"]}>
      {jackpotInfo && winYn !== "Y" && (
        <div
          className={classNames(styles.jackpot, {
            [styles.active]: resultState,
          })}
        >
          <div>
            <div className={styles.title}></div>
            <div className={styles.info}>
              <span>
                {jackpotInfo.count} {t("game_12")}
              </span>
              {/* <span>{123} Player</span> */}
              <span>{t("game_30")}</span>
            </div>
          </div>
        </div>
      )}

      {!wheelStatus && (
        <div className={styles["loading-wrapper"]}>
          <div className={styles["loading-container"]}>
            <span className={styles.loader}></span>
          </div>
        </div>
      )}

      <div
        className={`${styles.modal} ${
          winModalAni && winYn === "Y" ? styles.active : ""
          // styles.active
        }`}
      >
        {modal}
      </div>
      {wheelStatus === "Bet" && !isRotating && !resultState && (
        <div className={`${styles.circle} ${styles.count}`}>
          <span>{count}</span>
        </div>
      )}

      {wheelStatus !== "Bet" &&
        resultMultiply &&
        resultNumber !== null &&
        resultState && (
          <div className={styles.circle}>
            <span style={{ color: `${getChoiceName(resultNumber ?? 0)}` }}>
              {resultMultiply} x
            </span>
          </div>
        )}

      <div className={styles["board-container"]}>
        <div
          className={`${styles.wheel} ${isRotating ? styles.rotating : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        ></div>

        <svg xmlns="http://www.w3.org/2000/svg">
          <g mask="url(#mask)">
            <g
              className={isRotating ? styles.rotating : ""}
              transform={`rotate(${rotation})`}
              // @ts-ignore
              transformOrigin="center center"
            >
              {lines}
            </g>
          </g>
          <mask id="mask">
            <path
              d="M24.667 34C15.8337 22.8298 15 4 15 4C15 4 14.1663 22.8298 5.33301 34L15.333 28.375L24.667 34Z"
              fill="white"
              transform={`translate(${
                checkMedia === "mobile" ? -20 : 0
              }, 230) translate(106, ${
                checkMedia === "mobile" ? -40 : 0
              }) rotate(180 24.667 17)`}
            />
          </mask>
          {resultNumber !== null && (
            <path
              className={styles["result-triangle"]}
              ref={resultTriangle}
              d="M24.667 34C15.8337 22.8298 15 4 15 4C15 4 14.1663 22.8298 5.33301 34L15.333 28.375L24.667 34Z"
              fill={
                resultNumber !== null
                  ? getChoiceName(resultNumber)
                  : "translate"
              }
              transform={`translate(${
                checkMedia === "mobile" ? -20 : 0
              }, 230) translate(106, ${
                checkMedia === "mobile" ? -40 : 0
              }) rotate(180 24.667 17)`}
            />
          )}
        </svg>
      </div>
    </div>
  );
}
