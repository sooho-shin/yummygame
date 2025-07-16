"use client";

import { useGetUserAccountSetting } from "@/querys/user";
import styles from "./styles/accountSetting.module.scss";
import { useUserStore } from "@/stores/useUser";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";

export default function AccountSetting() {
  const { token } = useUserStore();
  const { data: accountData } = useGetUserAccountSetting(token);
  const { openModal } = useModalHook();
  const t = useDictionary();

  const amountInfoArray = [
    {
      fiatDepositWithdrawalLimits: t("setting_1"),
      cryptoDepositLimit: t("setting_2"),
      cryptoWithdrawalLimit: t("setting_2"),
    },
    {
      fiatDepositWithdrawalLimits: t("setting_4"),
      cryptoDepositLimit: t("setting_2"),
      cryptoWithdrawalLimit: t("setting_2"),
    },
    {
      fiatDepositWithdrawalLimits: t("setting_6"),
      cryptoDepositLimit: t("setting_2"),
      cryptoWithdrawalLimit: t("setting_2"),
    },
    {
      fiatDepositWithdrawalLimits: t("setting_2"),
      cryptoDepositLimit: t("setting_2"),
      cryptoWithdrawalLimit: t("setting_2"),
    },
  ];

  if (!accountData || !accountData.result) return <></>;

  return (
    <div className={styles["setting-wrapper"]}>
      <h2 className={styles.title}>{t("setting_8")}</h2>
      <h3 className={styles["sub-title"]}>KYC / AML</h3>
      <p>{t("setting_9")}</p>
      <div className={styles.box}>
        <div className={styles["level-group"]}>
          <div className={styles["progress-group"]}>
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className={
                    i <= Number(accountData?.result.kyc_level)
                      ? styles.fill
                      : ""
                  }
                ></div>
              );
            })}
          </div>
          <div className={styles["level-box"]}>
            <span>Level {accountData?.result.kyc_level}</span>
            <button
              type="button"
              onClick={() => {
                openModal({
                  type: "accountSetting",
                });
              }}
              disabled={
                accountData.result.is_processing === 1 ||
                accountData.result.kyc_level === 3
              }
            >
              <span>
                {accountData.result.is_processing === 1
                  ? t("setting_10")
                  : accountData.result.kyc_level === 3
                    ? t("setting_11")
                    : t("setting_12")}
              </span>
            </button>
          </div>
        </div>
        <div className={styles["info-box"]}>
          <div className={styles.row}>
            <span>{t("setting_14")}</span>
            <span>
              {amountInfoArray[accountData.result.kyc_level].cryptoDepositLimit}
            </span>
          </div>
          <div className={styles.row}>
            <span>{t("setting_15")}</span>
            <span>
              {
                amountInfoArray[accountData.result.kyc_level]
                  .cryptoWithdrawalLimit
              }
            </span>
          </div>
        </div>
      </div>
      <div className={styles["box-row"]}>
        <div className={styles.box}>
          <div className={styles["detail-group"]}>
            <h5 className={styles.title}>{t("setting_25")}</h5>
            <p>{t("setting_23")}</p>
            <div className={styles["btn-row"]}>
              <button
                type="button"
                className={classNames(styles["fa-btn"], {
                  [styles.disable]:
                    accountData.result.is_two_factor_enable === 1,
                })}
                onClick={() => {
                  openModal({
                    type:
                      accountData.result.is_two_factor_enable === 0
                        ? "enableTwoFactor"
                        : "disableTwoFactor",
                  });
                }}
              >
                <span>
                  {accountData.result.is_two_factor_enable === 0
                    ? t("setting_22")
                    : t("setting_24")}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles["detail-group"]}>
            <h5 className={styles.title}>{t("setting_19")}</h5>
            <p>{t("setting_20")}</p>
            <div className={styles["btn-row"]}>
              <button
                type="button"
                className={styles.detail}
                onClick={() => {
                  openModal({
                    type: "withdrawAccount",
                  });
                }}
              >
                <span>{t("setting_21")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["box-row"]}>
        <div className={styles.box}>
          <div className={styles["detail-group"]}>
            <h5 className={styles.title}>{t("setting_16")}</h5>
            <p>{t("setting_17")}</p>
            <div className={styles["btn-row"]}>
              <button
                type="button"
                className={styles.detail}
                onClick={() => {
                  openModal({
                    type: "exclusion",
                  });
                }}
              >
                <span>{t("setting_18")}</span>
              </button>
            </div>
          </div>
        </div>
        <div className={classNames(styles.box, styles.nothing)}></div>
      </div>
    </div>
  );
}
