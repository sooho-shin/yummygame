"use client";

import useCommonHook from "@/hooks/useCommonHook";
import styles from "./styles/mainWrapper.module.scss";
import { useState, useEffect } from "react";
import { useDictionary } from "@/context/DictionaryContext";

export default function MainAffiliate() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { checkMedia } = useCommonHook();
  const t = useDictionary();

  return (
    <div className={styles["main-affiliate-wrapper"]}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.top}>
            <h5>{t("main_26")}</h5>
            <p>{t("main_27")}</p>
          </div>
          <div className={styles["info-container"]}>
            <div className={styles.row}>
              {checkMedia !== "mobile" && hydrated && (
                <div className={styles.ico}></div>
              )}

              <div className={styles["info-group"]}>
                <p className={styles.title}>
                  {checkMedia === "mobile" && hydrated && (
                    <span className={styles.ico}></span>
                  )}
                  <span>{t("main_28")}</span>
                </p>
                <p className={styles.sub}>
                  <span>{t("main_29")}</span>
                  <span>{t("main_30")}</span>
                </p>
              </div>
            </div>
            <div className={styles.row}>
              {checkMedia !== "mobile" && hydrated && (
                <div className={styles.ico}></div>
              )}
              <div className={styles["info-group"]}>
                <p className={styles.title}>
                  {checkMedia === "mobile" && hydrated && (
                    <span className={styles.ico}></span>
                  )}
                  <span>{t("main_31")}</span>
                </p>
                <p className={styles.sub}>
                  <span>{t("main_32")}</span>
                  <span>{t("main_33")}</span>
                </p>
              </div>
            </div>
            <div className={styles.row}>
              {checkMedia !== "mobile" && hydrated && (
                <div className={styles.ico}></div>
              )}
              <div className={styles["info-group"]}>
                <p className={styles.title}>
                  {checkMedia === "mobile" && hydrated && (
                    <span className={styles.ico}></span>
                  )}
                  <span>{t("main_34")}</span>
                </p>
                <p className={styles.sub}>
                  <span>{t("main_35")}</span>
                  <span>{t("main_36")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles["img-group"]}>
            <div>
              <div className={styles.img}></div>
              <span>{t("main_37")}</span>
            </div>
            <div>
              <div className={styles.img}></div>
              <span>{t("main_38")}</span>
            </div>
            <div>
              <div className={styles.img}></div>
              <span>{t("main_39")}</span>
            </div>
            <div>
              <div className={styles.img}></div>
              <span>{t("main_40")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
