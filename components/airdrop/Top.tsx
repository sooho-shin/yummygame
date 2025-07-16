"use client";

import React from "react";
import styles from "./styles/airdrop.module.scss";
import classNames from "classnames";
import { scroller } from "react-scroll";
import { useDictionary } from "@/context/DictionaryContext";

const AirdropTop = () => {
  const t = useDictionary();
  return (
    <>
      <div className={styles["top-wrapper"]}>
        <div className={styles.content}>
          <h2>
            {t("airdrop_1")}
            <br />
            {t("airdrop_2")}
          </h2>
          <pre>{t("airdrop_3")}</pre>
          <div className={classNames(styles["top-btn-row"], styles.pc)}>
            <button
              type={"button"}
              onClick={() => {
                scroller.scrollTo("airdrop", {
                  duration: 300,
                  offset: -130,
                  smooth: "easeInOutQuint",
                });
              }}
            >
              <span>{t("airdrop_4")}</span>
            </button>
            <a
              href={"https://www.chocowave.org/"}
              target={"_blank"}
              rel="noreferrer"
            >
              <span>{t("airdrop_5")}</span>
            </a>
          </div>
        </div>
      </div>
      <div className={classNames(styles["top-btn-row"], styles.mobile)}>
        <button
          type={"button"}
          onClick={() => {
            scroller.scrollTo("airdrop", {
              duration: 300,
              offset: -130,
              smooth: "easeInOutQuint",
            });
          }}
        >
          <span>{t("airdrop_4")}</span>
        </button>
        <a
          href={"https://www.chocowave.org/"}
          target={"_blank"}
          rel="noreferrer"
        >
          <span>{t("airdrop_5")}</span>
        </a>
      </div>
    </>
  );
};

export default AirdropTop;
