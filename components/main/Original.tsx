import styles from "./styles/original.module.scss";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import required modules
import { useDictionary } from "@/context/DictionaryContext";
import classNames from "classnames";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInterval } from "react-use";
import "./styles/originalswiper.css";
import { customConsole } from "@/utils";

export default function MainOriginal({ id }: { id: string | number }) {
  const t = useDictionary();

  const gameInfoData = {
    crash: {
      label: t("home_11"),
      hash: [t("home_53"), t("home_54")],
    },
    plinko: {
      label: t("game_69"),
      hash: [],
    },
    wheel: {
      label: t("home_12"),
      hash: [t("home_55"), t("home_56"), t("home_57")],
    },
    roulette: {
      label: t("home_13"),
      hash: [t("home_58")],
    },
    classic_dice: {
      label: t("home_15"),
      hash: [],
    },
    ultimate_dice: {
      label: t("home_16"),
      hash: [],
    },
    mines: {
      label: t("home_17"),
      hash: [],
    },
    coin_flip: {
      label: t("home_14"),
      hash: [],
    },
    limbo: {
      label: t("game_74"),
      hash: [],
    },
  };

  const [gameListArray, setGameListArray] = useState<
    (
      | "crash"
      | "wheel"
      | "classic_dice"
      | "roulette"
      | "ultimate_dice"
      | "mines"
      | "coin_flip"
      | "plinko"
      | "limbo"
    )[]
  >([
    "crash",
    "plinko",
    "wheel",
    "classic_dice",
    "roulette",
    "ultimate_dice",
    "mines",
    "coin_flip",
  ]);

  const getGameHref = useCallback((gameType: string): string => {
    switch (gameType.toLocaleLowerCase()) {
      case "crash":
        return "crash";
      case "wheel":
        return "wheel";
      case "roulette":
        return "roulette";
      case "classic_dice":
        return "dice";
      case "ultimate_dice":
        return "ultimatedice";
      // case "mines":
      //   return "mine";
      case "mines":
        return "mine";
      case "coin_flip":
        return "flip";
      default:
        return gameType;
    }
  }, []);

  const [hoverState, setHoverState] = useState(false);

  // useInterval(
  //   () => {
  //     const newList = [...gameListArray];
  //     const firstItem = newList.shift();
  //     if (firstItem) {
  //       newList.push(firstItem);
  //       setGameListArray(newList);
  //     }
  //   },
  //   hoverState ? null : 5000,
  // );

  const ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   ref && customConsole("자식 scroll 위치 ==== ", ref.current?.offsetHeight);
  // }, [ref]);

  return (
    <div
      className={styles["main-original-wrapper"]}
      id={id.toString()}
      ref={ref}
    >
      <div className={styles.top}>
        <h5>{t("main_4")}</h5>
        <p>{t("main_5")}</p>
      </div>
      <div className={styles["content-container"]}>
        {gameListArray.map((c, i) => (
          <Link
            href={"/game/" + getGameHref(c)}
            className={classNames(styles["game-detail-box"])}
            onMouseEnter={() => setHoverState(true)}
            onMouseLeave={() => setHoverState(false)}
            key={c}
          >
            <span>{gameInfoData[c].label}</span>
            <div className={styles.dim}></div>
            <div
              className={classNames(styles.background)}
              style={{
                backgroundImage: `url('/images/main/swiper/img_swiper_btn_${c}.webp')`,
              }}
            ></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
