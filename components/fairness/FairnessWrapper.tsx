"use client";

import { useCallback, useRef, useState } from "react";
import styles from "../policy/styles/policy.module.scss";
import Link from "next/link";
import { useDictionary } from "@/context/DictionaryContext";
import FairnessCrash from "./contents/Crash";
import FairnessWheel from "./contents/Wheel";
import FairnessRoulette from "./contents/Roulette";
import FairnessDice from "./contents/Dice";
import FairnessUltimateDice from "./contents/UltimateDice";
import FairnessMines from "./contents/Mines";
import FairnessCoinFlip from "./contents/CoinFlip";
import Image from "next/image";
import { useClickAway } from "react-use";
import FairnessPlinko from "@/components/fairness/contents/Plinko";
import FairnessLimbo from "@/components/fairness/contents/Limbo";

type gameType =
  | "crash"
  | "wheel"
  | "roulette"
  | "dice"
  | "ultimatedice"
  | "mines"
  | "flip"
  | "plinko"
  | "limbo";

const tabArray: gameType[] = [
  "crash",
  "wheel",
  "roulette",
  "dice",
  "ultimatedice",
  "mines",
  "flip",
  "plinko",
  "limbo",
];

export default function FairnessWrapper({ tab }: { tab: gameType }) {
  const getTabName = useCallback(
    (tab: gameType) => {
      switch (tab) {
        case "crash":
          return "Crash";
        case "wheel":
          return "Wheel";
        case "roulette":
          return "Roulette";
        case "dice":
          return "Dice";
        case "ultimatedice":
          return "Ultimate Dice";
        case "mines":
          return "Mines";
        case "flip":
          return "Coin Flip";
        case "plinko":
          return "Plinko";
        case "limbo":
          return "Limbo";
        default:
          return null;
      }
    },
    [tab],
  );

  const dropboxRef = useRef<HTMLDivElement>(null);
  const [dropdownState, setDropdownState] = useState(false);
  const t = useDictionary();
  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });

  if (!getTabName(tab)) return <></>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t("modal_300")}</h2>
      <div className={styles.content}>
        <div className={styles["policies-nav"]} ref={dropboxRef}>
          <button
            type="button"
            onClick={() => setDropdownState(!dropdownState)}
            // className={styles["select-btn"]}
            className={dropdownState ? styles.active : ""}
          >
            <span>{getTabName(tab as gameType)}</span>
            <Image
              src="/images/common/ico_arrow_w.svg"
              alt="img arrow"
              width="24"
              height="24"
              priority
            />
          </button>
          <ul className={dropdownState ? styles.active : ""}>
            {tabArray.map(c => {
              return (
                <li key={c}>
                  <Link
                    href={`/fairness/${c}`}
                    className={c === tab ? styles.active : ""}
                  >
                    <span>{getTabName(c as gameType)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles["policies-content"]}>
          {/* <pre dangerouslySetInnerHTML={{ __html: t(tab) }}></pre> */}
          {/* <pre>
          </pre> */}

          {tab === tabArray[0] && <FairnessCrash />}
          {tab === tabArray[1] && <FairnessWheel />}
          {tab === tabArray[2] && <FairnessRoulette />}
          {tab === tabArray[3] && <FairnessDice />}
          {tab === tabArray[4] && <FairnessUltimateDice />}
          {tab === tabArray[5] && <FairnessMines />}
          {tab === tabArray[6] && <FairnessCoinFlip />}
          {tab === tabArray[7] && <FairnessPlinko />}
          {tab === tabArray[8] && <FairnessLimbo />}
        </div>
      </div>
    </div>
  );
}
