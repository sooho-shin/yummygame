"use client";

import React from "react";
import styles from "./styles/bonus.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames";
import { useDictionary } from "@/context/DictionaryContext";

const HowCanReceiveBonus = () => {
  const t = useDictionary();
  return (
    <div className={styles["receive-wrapper"]}>
      <h2 className={styles.title}>{t("bonus_111")}</h2>
      <div className={styles["step-container"]}>
        <div className={styles.box}>
          <div className={classNames(styles["img-box"], styles["first"])}>
            <LazyLoadImage
              src={"/images/bonus/img_step_1.webp"}
              alt={"img step"}
            />
          </div>
          <p className={styles.title}>{t("bonus_112")}</p>
          <p className={styles["sub-text"]}>{t("bonus_113")}</p>
        </div>
        <div className={styles.border}></div>
        <div className={styles.box}>
          <div className={classNames(styles["img-box"], styles["second"])}>
            <LazyLoadImage
              src={"/images/bonus/img_step_2.webp"}
              alt={"img step"}
            />
          </div>
          <p className={styles.title}>{t("bonus_114")}</p>
          <p className={styles["sub-text"]}>{t("bonus_115")}</p>
        </div>
        <div className={styles.border}></div>
        <div className={styles.box}>
          <div className={classNames(styles["img-box"], styles["third"])}>
            <LazyLoadImage
              src={"/images/bonus/img_step_3.webp"}
              alt={"img step"}
            />
          </div>
          <p className={styles.title}>{t("bonus_116")}</p>
          <p className={styles["sub-text"]}>{t("bonus_117")}</p>
        </div>
      </div>
    </div>
  );
};

export default HowCanReceiveBonus;
