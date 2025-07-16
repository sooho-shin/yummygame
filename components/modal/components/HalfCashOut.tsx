"use client";

import { useMemo } from "react";
import styles from "./styles/autobetModal.module.scss";
import { useSearchParams } from "next/navigation";
import { useDictionary } from "@/context/DictionaryContext";

export default function HalfCashOut() {
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
        <span>{t("modal_160")}</span>
      </div>
      <div className={styles.content}>
        <div>
          <p>{t("modal_161")}</p>
          <p>{t("modal_162")}</p>
        </div>
        <ul>
          <li>
            <div>
              <p>{t("modal_163")}</p>
              <p>{t("modal_164")}</p>
            </div>
          </li>
          <li>
            <div>
              <p>{t("modal_165")}</p>
              <p>{t("modal_166")}</p>
            </div>
          </li>
        </ul>
        <div>
          <p>{t("modal_167")}</p>
        </div>
        <div>
          <p>{t("modal_168")}</p>
        </div>
      </div>
    </div>
  );
}
