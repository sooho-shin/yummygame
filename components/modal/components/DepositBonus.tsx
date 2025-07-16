"use client";

import { useEffect } from "react";
import styles from "./styles/depositBonusModal.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";

export default function DepositBonus() {
  const {
    props,
  }: {
    props: {
      referralCode: string;
      is_partner_code: boolean;
      default_data: {
        // bonus_multiply: number;
        max_deposit_dollar: number;
        min_deposit_dollar: number;
        roll_over_multiply: number;
        bonus_multiply: number;
      };
    };
  } = useModalHook();

  const t = useDictionary();
  return (
    <div className={styles["deposit-bonus-modal"]}>
      <div className={styles.top}>
        <span></span>
      </div>
      <div className={styles.content}>
        <p className={styles["partner-code"]}>
          [ {props?.referralCode ?? "0"} ]
        </p>
        {/* <p className={styles["partner-code"]}>[ 12 ]</p> */}
        <p className={styles.title}>{t("modal_363")}</p>
        <pre className={styles.sub}>{t("modal_364")}</pre>
        <div className={styles["bonus-box"]}>
          <div className={styles["bonus-info-box"]}>
            <span>{t("modal_365")}</span>
            <p className={styles.percent}>
              <span>{props?.default_data.bonus_multiply ?? "0"}</span>
              {/* <span>200</span> */}
              <span>%</span>
            </p>
            <p className={styles.info}>{t("modal_366")}</p>
          </div>
          <div className={styles["bonus-text-box"]}>
            <span>{t("modal_366")}</span>
            <div className={styles.group}>
              <p className={styles.row}>
                <span>{t("modal_367")}</span>
                <span>${props?.default_data.min_deposit_dollar ?? "0"}</span>
                {/* <span>$50</span> */}
              </p>
              <p className={styles.row}>
                <span>{t("modal_368")}</span>
                <span>{props?.default_data.roll_over_multiply ?? "0"} x</span>
                {/* <span>4 x</span> */}
              </p>
              <p className={styles.row}>
                <span>{t("modal_369")}</span>
                <span>{t("modal_370")}</span>
              </p>
            </div>
          </div>
        </div>
        <ul>
          <li>
            <span>{t("modal_371")}</span>
          </li>
          <li>
            <span>
              {t("modal_372")}
              <a href="/" target="_blank" rel="noreferrer">
                {t("modal_390")}
              </a>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
