"use client";

import { useDictionary } from "@/context/DictionaryContext";
import styles from "./styles/bonusUsagePolicyModal.module.scss";

export default function BonusUsagePolicy() {
  const t = useDictionary();

  return (
    <div className={styles["bonus-usage-policy-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_555")}</span>
      </div>
      <div className={styles.content}>
        <div>
          <pre>{t("modal_556")}</pre>
        </div>
        <div>
          <pre>{t("modal_557")}</pre>
        </div>
        <div>
          <pre>{t("modal_558")}</pre>
        </div>
        <div>
          <pre>{t("modal_559")}</pre>
        </div>
        <div>
          <p>{t("modal_560")}</p>
          <pre>{t("modal_561")}</pre>
        </div>
        <div>
          <pre>{t("modal_562")}</pre>
        </div>
        <div>
          <pre>{t("modal_563")}</pre>
        </div>
        <div>
          <pre>{t("modal_564")}</pre>
        </div>
        <div>
          <p>{t("modal_565")}</p>
          <pre>{t("modal_566")}</pre>
        </div>
        <div>
          <pre>{t("modal_567")}</pre>
          <a
            href={"https://www.yummygame.io/policies/bonus"}
            target="_blank"
            rel="noreferrer"
          >
            https://www.yummygame.io/policies/bonus
          </a>
        </div>
      </div>
    </div>
  );
}
