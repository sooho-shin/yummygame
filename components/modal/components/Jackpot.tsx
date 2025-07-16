"use client";

import styles from "./styles/jackpotModal.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDictionary } from "@/context/DictionaryContext";

export default function Jackpot() {
  const t = useDictionary();
  return (
    <div className={styles["jackpot-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_169")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["example-img"]}>
          <LazyLoadImage src="/images/modal/jackpot/img_jackpot_example.png" />
        </div>
        <pre>{t("modal_170")}</pre>
        <div className={styles["example-img-winmodal"]}>
          <LazyLoadImage src="/images/modal/jackpot/img_winmodal_example.png" />
        </div>
        <pre>{t("modal_171")}</pre>
      </div>
    </div>
  );
}
