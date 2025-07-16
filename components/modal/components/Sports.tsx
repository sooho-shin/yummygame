"use client";

import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles/sportsModal.module.scss";

export default function Sports() {
  const t = useDictionary();

  return (
    <div className={styles["sports-modal"]}>
      <div className={styles.top}>{/*<span>{t("airdrop_63")}</span>*/}</div>
      <div className={styles.content}>
        <LazyLoadImage
          src="/images/modal/sports/img_sports.webp"
          alt="img crypto"
          width={"196px"}
          height={"195px"}
        />
        <h4>{t("modal_417")}</h4>
        <p>{t("modal_418")}</p>
      </div>
    </div>
  );
}
