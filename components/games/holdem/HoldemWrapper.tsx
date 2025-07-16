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
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useImmer } from "use-immer";
import useSound from "use-sound";
import AutobetBox from "../AutobetBox";
import HistoryBox from "../HistoryBox";
import styles from "./styles/holdem.module.scss";
import dynamic from "next/dynamic";
const Holdem = dynamic(() => import("./pharser/Holdem"), { ssr: false });

export default function HoldemWrapper() {
  const gameContainer = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles["game-wrapper"]}>
        <div className={styles["bread-comp"]}>
          <span>{"오리지날"}</span>
          <span>/</span>
          <span>{"홀덤"}</span>
        </div>
        <div className={styles["result-container"]}>
          <div className={styles["holdem-wrapper"]}>
            <Holdem />
          </div>
        </div>
      </div>
    </div>
  );
}
