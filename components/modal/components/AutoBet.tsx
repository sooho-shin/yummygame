"use client";

import { useMemo } from "react";
import styles from "./styles/autobetModal.module.scss";
import { useSearchParams } from "next/navigation";
import { useDictionary } from "@/context/DictionaryContext";

export default function AutoBet() {
  const searchParams = useSearchParams();
  const t = useDictionary();
  const modalGameType = searchParams.get("modalGameType") as
    | "CRASH"
    | "MINES"
    | "ROULETTE"
    | "CLASSIC_DICE"
    | "ULTIMATE_DICE"
    | "COIN_FLIP"
    | "WHEEL"
    | "PROVIDER";

  return (
    <div className={styles["autobet-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_39")}</span>
      </div>
      <div className={styles.content}>
        <div>
          <h5>{t("modal_40")}</h5>
          <p>{t("modal_41")}</p>
        </div>
        <ul>
          <li>
            <div>
              <p>{t("modal_42")}</p>
              <p>{t("modal_43")}</p>
              <p>{t("modal_44")}</p>
            </div>
          </li>
          <li>
            <div>
              <p>{t("modal_45")}</p>
              <p>{t("modal_46")}</p>
              <p>{t("modal_47")}</p>
            </div>
          </li>
          <li>
            <div>
              <p>{t("modal_48")}</p>
              <p>{t("modal_49")}</p>
              <p>{t("modal_50")}</p>
            </div>
          </li>
        </ul>
        <div>
          <p>{t("modal_51")}</p>
        </div>
      </div>
    </div>
  );
}
