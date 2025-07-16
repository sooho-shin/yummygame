"use client";

import { useEffect } from "react";
import styles from "./styles/depositBonusPromotionModal.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import CommonButton from "@/components/common/Button";

import { usePostDepositAccept } from "@/querys/bonus";
import useCommonHook from "@/hooks/useCommonHook";
import BigNumber from "bignumber.js";
export default function DepositBonusPromotion() {
  const {
    props,
    closeModal,
  }: {
    closeModal: () => void;
    props: {
      totalBonusAmount: string;
      assetType: string;
      wagerMultiply: string;
    };
  } = useModalHook();
  const { showErrorMessage, showToast, divCoinType } = useCommonHook();

  const t = useDictionary();

  const { mutate } = usePostDepositAccept();

  const handleAccept = (status: 2 | -1) => {
    mutate(
      { status },
      {
        onSuccess(data) {
          showErrorMessage(data.code);
          if (data.code === 0) {
            showToast(status === 2 ? t("modal_393") : t("modal_394"));
          }
        },
      },
    );
    closeModal();
  };

  return (
    <div className={styles["deposit-bonus-modal"]}>
      <div className={styles.top}>
        <span></span>
      </div>
      <div className={styles.content}>
        <p className={styles["bonus-title"]}>{t("modal_382")}</p>
        <pre>{t("modal_383")}</pre>
        <div className={styles["bonus-box"]}>
          <p>{t("modal_384")}</p>
          <div className={styles["amount-group"]}>
            <span
              className={`${styles.ico}`}
              style={{
                backgroundImage: `url('/images/tokens/img_token_${props.assetType}_circle.svg')`,
              }}
            ></span>
            <span className={styles.amount}>
              {Number(
                divCoinType(
                  props.totalBonusAmount,
                  props.assetType.toLocaleLowerCase(),
                ),
              ).toFixed(4)}
            </span>
          </div>
          <div className={styles["info-row"]}>
            <p>
              ・{t("modal_385")} <span>{props.wagerMultiply} x</span>
            </p>
          </div>
        </div>
        <ul>
          <li>
            <span>{t("modal_388")}</span>
          </li>
          <li>
            <span>{t("modal_578")}</span>
          </li>
          <li>
            <span>{t("modal_579")}</span>
          </li>
          <li>
            <span>
              {t("modal_389")}
              <a href="/" target="_blank" rel="noreferrer">
                {t("modal_390")}
              </a>
            </span>
          </li>
        </ul>
      </div>
      <div className={styles["btn-row"]}>
        <button type="button" onClick={() => handleAccept(-1)}>
          <span>{t("modal_391")}</span>
        </button>
        <CommonButton
          isPending={false}
          onClick={() => handleAccept(2)}
          text={t("modal_392")}
        />
      </div>
    </div>
  );
}
