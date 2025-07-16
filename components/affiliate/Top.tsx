"use client";

import styles from "./styles/affiliate.module.scss";
import { useDictionary } from "@/context/DictionaryContext";

export default function AffiliateTop() {
  const t = useDictionary();
  return (
    <div className={styles["affiliate-top-wrapper"]}>
      <pre>{t("affiliate_36")}</pre>
      <p>{t("affiliate_37")}</p>
    </div>
  );
}
