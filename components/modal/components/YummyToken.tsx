"use client";

import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles/yummyTokenModal.module.scss";

export default function YummyToken() {
  const t = useDictionary();

  return (
    <div className={styles["yummy-token-modal"]}>
      <div className={styles.top}>
        <span>{t("airdrop_63")}</span>
      </div>
      <div className={styles.content}>
        <LazyLoadImage
          src="/images/tokens/img_token_yyg.svg"
          alt="img crypto"
          width={"54px"}
        />
        <pre>{t("airdrop_62")}</pre>
      </div>
    </div>
  );
}
