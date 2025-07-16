"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/realTimeStatistics.module.scss";
import Draggable from "react-draggable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAssetStore } from "@/stores/useAsset";
import classNames from "classnames";
import { Updater, useImmer } from "use-immer";
import useCommonHook from "@/hooks/useCommonHook";
import { useDictionary } from "@/context/DictionaryContext";

export default function RealTimeStatistics({
  setStatisticsState,
  statisticsArray,
  setStatisticsArray,
}: {
  setStatisticsState: React.Dispatch<React.SetStateAction<boolean>>;
  statisticsArray: { uv: number; profit: number; betAmount: number }[];
  setStatisticsArray: Updater<
    { uv: number; profit: number; betAmount: number }[]
  >;
}) {
  const { coin } = useAssetStore();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { amountToDisplayFormat } = useCommonHook();

  // Draggable에 사용할 nodeRef 생성
  const draggableRef = useRef<HTMLDivElement>(null);
  const t = useDictionary();

  const gradientOffset = useMemo(() => {
    if (statisticsArray.length === 0 || statisticsArray.length === 1) return 0;

    const dataMax = Math.max(...statisticsArray.map(i => i.uv));
    const dataMin = Math.min(...statisticsArray.map(i => i.uv));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  }, [statisticsArray]);

  const [totalProfit, setTotalProfit] = useState(0);
  const [totalBet, setTotalBet] = useState(0);
  const [gameResult, setGameResult] = useState({ win: 0, lose: 0 });

  useEffect(() => {
    // console.log(statisticsArray);
    let win = 0;
    let lose = 0;
    for (const argument of statisticsArray) {
      setTotalProfit(totalProfit + argument.profit);
      setTotalBet(totalBet + argument.betAmount);
      if (argument.profit > 0) {
        win++;
      }
      if (argument.profit < 0) {
        lose++;
      }
    }
    if (statisticsArray.length > 1) {
      setGameResult({ win, lose });
    }
  }, [statisticsArray]);

  const off = gradientOffset;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "5px",
            borderRadius: "5px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <p>{`${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  if (!hydrated) return <></>;

  return (
    // Draggable 컴포넌트에 nodeRef 사용
    <Draggable nodeRef={draggableRef}>
      <div
        ref={draggableRef}
        className={styles["real-time-statistics-wrapper"]}
      >
        <div className={styles.top}>
          <button
            className={styles["close-btn"]}
            type={"button"}
            onClick={() => setStatisticsState(false)}
          ></button>
          <span>{t("common_52")}</span>
        </div>
        <div className={styles.content}>
          <div className={styles["refresh-row"]}>
            <span>벳</span>
            <button
              type={"button"}
              onClick={() => {
                setStatisticsArray([{ uv: 0, profit: 0, betAmount: 0 }]);
                setGameResult({ win: 0, lose: 0 });
                setTotalBet(0);
                setTotalProfit(0);
              }}
            ></button>
          </div>
          <div className={styles["bet-state-row"]}>
            <div>
              <span>{t("modal_456")}</span>
              <div>
                <span className={styles.amount}>
                  {amountToDisplayFormat(totalBet.toString(), coin)}
                </span>
                <span className={styles.unit}>{coin?.toUpperCase()}</span>
                <span
                  className={`${styles.ico}`}
                  style={{
                    backgroundImage: `url(/images/tokens/img_token_${
                      coin ?? "jel"
                    }_circle.svg)`,
                  }}
                ></span>
              </div>
            </div>
            <div>
              <span>{t("modal_457")}</span>
              <div>
                <span
                  className={classNames(styles.amount, {
                    [styles.red]: totalProfit < 0,
                    [styles.green]: totalProfit > 0,
                  })}
                >
                  {amountToDisplayFormat(totalProfit.toString(), coin)}
                </span>
                <span className={classNames(styles.unit)}>
                  {coin?.toUpperCase()}
                </span>
                <span
                  className={`${styles.ico}`}
                  style={{
                    backgroundImage: `url(/images/tokens/img_token_${
                      coin ?? "jel"
                    }_circle.svg)`,
                  }}
                ></span>
              </div>
            </div>
          </div>
          <div className={styles["chart-container"]}>
            {statisticsArray && statisticsArray.length > 1 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={statisticsArray}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  {/*<CartesianGrid strokeDasharray="3 3" />*/}
                  {/*<XAxis dataKey="name" />*/}
                  {/*<YAxis />*/}
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={off} stopColor="#4AC776" stopOpacity={1} />
                      <stop offset={off} stopColor="#E35E58" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="transparent"
                    fill="url(#splitColor)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className={styles["game-result-row"]}>
            <p>
              <span>{t("modal_458")}</span> <span>{gameResult.win}</span>
            </p>
            <p>
              <span>{t("modal_459")}</span> <span>{gameResult.lose}</span>
            </p>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
