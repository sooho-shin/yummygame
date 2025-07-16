"use client";

import React from "react";
import styles from "./styles/bonus.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";

const BonusBanner = () => {
  const { openModal } = useModalHook();
  const t = useDictionary();
  return (
    <div className={styles["banner-container"]}>
      <p className={styles.title}>{t("bonus_137")}</p>
      <button type={"button"} onClick={() => openModal({ type: "getstarted" })}>
        <span>{t("bonus_138")}</span>
      </button>
    </div>
  );
};

export default BonusBanner;
