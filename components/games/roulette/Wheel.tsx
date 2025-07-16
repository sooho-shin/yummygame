import useCommonHook from "@/hooks/useCommonHook";
import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import { useUserStore } from "@/stores/useUser";
import { truncateDecimal } from "@/utils";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useMeasure } from "react-use";
import styles from "./styles/wheel.module.scss";

const europeanNumberOrder = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

type ResultType = {
  resultNumber: number | null;
  winYn: "Y" | "N";
  profit: number;
  betCoinType?: string;
  payOut?: string;
  profitDollar?: string;
};
export default function RouletteWheel({
  rouletteAnimate,
  resultData,
  gameState,
  animationDuration,
  autoBetState,
  resultAni,
}: {
  rouletteAnimate: boolean;
  resultData: ResultType;
  gameState: "play" | "playEnd" | null;
  animationDuration: number;
  autoBetState: boolean;
  resultAni: boolean;
}) {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [wheelSize, setWheelSize] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [resultAngle, setResultAngle] = useState<null | number>(null);
  const { displayFiat } = useUserStore();
  const { coin } = useAssetStore();
  const { amountToDisplayFormat } = useCommonHook();
  const [wrapperRef, { width: wrapperWidth }] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (wheelRef.current) {
      const updateWheelSize = () => {
        const parentSize = Math.min(
          wheelRef.current!.clientWidth,
          wheelRef.current!.clientHeight,
        );
        setWheelSize(parentSize);
      };

      updateWheelSize();
      window.addEventListener("resize", updateWheelSize);

      return () => {
        window.removeEventListener("resize", updateWheelSize);
      };
    }
  }, [wheelRef.current, hydrated, wrapperWidth]);

  const gapSize = 1.5;
  // const gapSize = 0;
  const totalSlices = europeanNumberOrder.length;
  const totalGap = gapSize * totalSlices;
  const adjustedSliceAngle = (360 - totalGap) / totalSlices;

  const slices = europeanNumberOrder.map((number, index) => {
    const isZero = number === 0;
    const sliceColor = isZero
      ? "#03AA00"
      : index % 2 !== 0
        ? "#FD2741"
        : "#3C444F";

    const startAngle = index * (adjustedSliceAngle + gapSize) * (Math.PI / 180);
    const endAngle =
      ((index + 1) * (adjustedSliceAngle + gapSize) - gapSize) *
      (Math.PI / 180);

    const slicePath = `
      M ${wheelSize / 2},${wheelSize / 2}
      L ${wheelSize / 2 + (wheelSize / 2) * Math.cos(startAngle)},${
        wheelSize / 2 + (wheelSize / 2) * Math.sin(startAngle)
      }
      A ${wheelSize / 2},${wheelSize / 2} 0 0,1 ${
        wheelSize / 2 + (wheelSize / 2) * Math.cos(endAngle)
      },${wheelSize / 2 + (wheelSize / 2) * Math.sin(endAngle)}
      Z
    `;

    const middleAngle = (startAngle + endAngle) / 2;
    const textX = wheelSize / 2 + (wheelSize / 2.3) * Math.cos(middleAngle);
    const textY = wheelSize / 2 + (wheelSize / 2.3) * Math.sin(middleAngle);
    const textRotation = (middleAngle * 180) / Math.PI;

    return (
      <g key={index}>
        <path d={slicePath} fill={sliceColor} className={number.toString()} />
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${textRotation + 90} ${textX} ${textY})`}
          fill="white"
        >
          {number}
        </text>
      </g>
    );
  });

  function findIndex(arr: number[], target: number): number {
    const index = arr.indexOf(target);

    return index + 1;
  }

  const countRotate = 2;

  useEffect(() => {
    if (resultData.resultNumber === null) return;
    const index = findIndex(europeanNumberOrder, resultData.resultNumber);
    // const index = resultNumber;

    if (index && gameState === "play") {
      const resultAngle =
        360 * countRotate +
        (360 / totalSlices) * index -
        360 / totalSlices / 2 -
        gapSize / 2;
      startAnimation(resultAngle);
    }
  }, [resultData, gameState]);

  const animationRef = React.useRef<number | null>(null);

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const startAnimation = (targetAngle: number) => {
    const startAngle = resultAngle; // 현재 위치한 angle 값을 저장

    let startTime: number | null = null;

    const updateAngle = (currentTime: number) => {
      // setBallAni(true);
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < animationDuration) {
        const progress = elapsedTime / animationDuration;
        const easedProgress = easeOutCubic(progress); // 속도 조절
        const newAngle = startAngle
          ? startAngle + (targetAngle - startAngle) * easedProgress
          : targetAngle * easedProgress; // 현재 위치에서 시작해서 targetAngle로 증가
        // const newAngle = targetAngle * easedProgress;
        setResultAngle(newAngle);
        animationRef.current = requestAnimationFrame(updateAngle);
      } else {
        setResultAngle(targetAngle);
        setTimeout(() => {
          // 애니메이션이 완료된 후 초기화
          const newAngleAfterReset = targetAngle - 360 * countRotate;
          setResultAngle(newAngleAfterReset);

          // requestAnimationFrame 클리어
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
        }, 100); // 100ms 지연 후 초기화
      }
    };

    animationRef.current = requestAnimationFrame(updateAngle);
  };

  React.useEffect(() => {
    // 컴포넌트가 언마운트될 때 requestAnimationFrame 클리어
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const { media } = useCommonStore();

  if (!hydrated) return <></>;

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.active]: gameState === "play" || resultAni || autoBetState,
        // [styles.active]: true,
        [styles.tablet]: media?.includes("tablet"),
      })}
      ref={wrapperRef}
    >
      <div className={`${styles["result-box"]}`}>
        <div
          className={`${
            resultAni && resultData.winYn === "Y" && gameState === "playEnd"
              ? styles.active
              : ""
          }`}
        >
          <div className={styles.dim}></div>
          <div className={styles["ani-container"]}>
            <div className={styles.img}></div>
            <span className={styles.payout}>
              {truncateDecimal({
                num: resultData.payOut ?? "0",
                decimalPlaces: 2,
              })}
              x
            </span>
            <span>
              {amountToDisplayFormat(
                resultData.profit.toString(),
                resultData.betCoinType ?? "jel",
                // resultData.profitDollar ?? "0",
              )}
              {!displayFiat && " " + coin}
            </span>
          </div>
        </div>
      </div>
      <div ref={wheelRef} className={styles.content}>
        <div className={styles.ball}>
          {resultAngle !== null && (
            <div
              style={{
                transform: `rotate(${resultAngle}deg)`,
              }}
            >
              <div className={rouletteAnimate ? styles.active : ""}></div>
            </div>
          )}
        </div>
        {wheelSize ? (
          <svg width={wheelSize} height={wheelSize}>
            {slices}
          </svg>
        ) : (
          <></>
        )}
        <div className={styles["center-circle"]}></div>
        <div className={styles["center-second-circle"]}></div>
      </div>
      <div className={styles.bar}>
        <div></div>
      </div>
    </div>
  );
}
