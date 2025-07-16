"use client";

import styles from "./styles/affiliate.module.scss";
import { useDictionary } from "@/context/DictionaryContext";

export default function AffiliateNotice() {
  const t = useDictionary();
  return (
    <div className={styles["notice-group"]}>
      <p className={styles.title}>{t("affiliate_16")}</p>
      <ul>
        <li>
          <span>{t("affiliate_11")}</span>
        </li>
        <li>
          <span>{t("affiliate_12")}</span>
        </li>
        <li>
          <span>{t("affiliate_13")}</span>
        </li>
        <li>
          <span>{t("affiliate_14")}</span>
        </li>
        <li>
          <span>{t("affiliate_15")}</span>
        </li>
      </ul>
    </div>
  );
}
