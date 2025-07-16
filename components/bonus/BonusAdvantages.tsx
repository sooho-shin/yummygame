"use client";

import React from "react";
import styles from "./styles/bonus.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames";
import { useDictionary } from "@/context/DictionaryContext";

const BonusAdvantages = () => {
  const t = useDictionary();
  const advantagesArray = [
    {
      name: "jel",
      title: t("bonus_118"),
      text: t("bonus_119"),
    },
    {
      name: "spin",
      title: t("bonus_120"),
      text: t("bonus_121"),
    },
    {
      name: "lottery",
      title: t("bonus_122"),
      text: t("bonus_123"),
    },
    {
      name: "quests",
      title: t("bonus_124"),
      text: t("bonus_125"),
    },
    {
      name: "level-up",
      title: t("bonus_126"),
      text: t("bonus_127"),
    },
    {
      name: "tier-up",
      title: t("bonus_128"),
      text: t("bonus_129"),
    },
    {
      name: "sweetener",
      title: t("bonus_130"),
      text: t("bonus_131"),
    },
    {
      name: "weekly",
      title: t("bonus_132"),
      text: t("bonus_133"),
    },
    {
      name: "monthly",
      title: t("bonus_134"),
      text: t("bonus_135"),
    },
  ];
  type GameName =
    | "jel"
    | "spin"
    | "lottery"
    | "quests"
    | "level-up"
    | "tier-up"
    | "sweetener"
    | "weekly"
    | "monthly";

  return (
    <div className={styles["bonus-advantages-wrapper"]}>
      <p className={styles.title}>{t("bonus_136")}</p>
      <div className={styles["advantages-group"]}>
        {advantagesArray.map(c => {
          return (
            <div className={styles["box"]} key={c.name}>
              <div className={styles["img-row"]}>
                <p className={styles.title}>{c.title}</p>
                <div className={styles.img}>
                  <LazyLoadImage
                    src={`/images/bonus/${c.name}.webp`}
                    alt={"img advantages"}
                  />
                  <div
                    className={classNames(
                      styles.dim,
                      styles[c.name as GameName],
                    )}
                  ></div>
                </div>
              </div>
              <div className={styles.border}></div>
              <p className={styles.info}>{c.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BonusAdvantages;
