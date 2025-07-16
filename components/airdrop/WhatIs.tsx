"use client";

import React from "react";
import styles from "./styles/airdrop.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDictionary } from "@/context/DictionaryContext";
import { scroller } from "react-scroll";

const AirdropWhatIs = () => {
  const t = useDictionary();

  return (
    <div className={styles["whatis-wrapper"]}>
      <div className={styles["info-box"]}>
        <div>
          <h4>{t("airdrop_6")}</h4>
          <LazyLoadImage
            src="/images/airdrop/img_coin.webp"
            alt="img yyg"
            className={styles.mobile}
          />
          <pre>{t("airdrop_7")}</pre>
        </div>
        <LazyLoadImage
          src="/images/airdrop/img_coin.webp"
          alt="img yyg"
          className={styles.pc}
        />
      </div>
      <div className={styles["btn-row"]}>
        <a
          href={"https://yyg.yummygame.io/"}
          target={"_blank"}
          rel="noreferrer"
        >
          <span>{t("airdrop_8")}</span>
        </a>
        <button
          type="button"
          onClick={() => {
            scroller.scrollTo("faq", {
              duration: 300,
              offset: -130,
              smooth: "easeInOutQuint",
            });
          }}
        >
          <span>FAQ</span>
        </button>
      </div>
    </div>
  );
};

export default AirdropWhatIs;
