"use client";

import React from "react";
import styles from "./styles/bonus.module.scss";
import { useDictionary } from "@/context/DictionaryContext";

const Notice = () => {
  const t = useDictionary();
  return (
    <div className={styles["notice-container"]}>
      <p className={styles.title}>{t("bonus_102")}</p>
      <ul>
        <li>
          <span>{t("bonus_103")}</span>
        </li>
        <li>
          <span>{t("bonus_104")}</span>
        </li>
        <li>
          <span>{t("bonus_105")}</span>
        </li>
        <li>
          <span>{t("bonus_106")}</span>
        </li>
      </ul>
    </div>
  );
};

export default Notice;
