"use client";

import styles from "./styles/emptyData.module.scss";
import { useDictionary } from "@/context/DictionaryContext";

export default function CommonEmptyData({ text }: { text?: string }) {
  const t = useDictionary();
  return (
    <div className={styles["not-data-box"]}>
      <div className={styles.bear}></div>
      <p>{text ?? t("common_1")}</p>
    </div>
  );
}
