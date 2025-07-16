import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { signOut } from "@/lib/firebase";
import { useGetCommon } from "@/querys/common";
import { usePutUserSession } from "@/querys/user";
import { useUserStore } from "@/stores/useUser";

import { CookieOption, formatNumber } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./styles/withdrawAccountModal.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
import { useCommonStore } from "@/stores/useCommon";

export default function WithdrawAccount() {
  const router = useRouter();
  const { logout } = useUserStore();
  const { tokenList } = useCommonStore();
  const { showToast, showErrorMessage, divCoinType } = useCommonHook();
  const [isAgreeDelete, setIsAgreeDelete] = useState(false);
  const [confirmState, setConfirmState] = useState(false);
  const { closeModal } = useModalHook();
  const [, , removeCookie] = useCookies();
  const t = useDictionary();

  const { mutate } = usePutUserSession();

  interface CryptoObject {
    name: string;
    amount: string;
  }

  function checkAmountIsZero(dataArray: CryptoObject[]): boolean {
    return dataArray
      .filter(item => item.name.toUpperCase() !== "HON")
      .every(item => item.amount === "0");
  }

  return (
    <div className={styles["withdraw-account-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_348")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["notice-group"]}>
          <p className={styles.title}>{t("modal_349")}</p>
          <ul>
            <li className={styles["not-point"]}>
              <span>{t("modal_350")}</span>
            </li>
            <li className={`${styles["not-point"]} ${styles.margin}`}>
              <span>{t("modal_351")}</span>
            </li>
          </ul>
        </div>
        <div className={styles["asset-group"]}>
          <p className={styles.title}>{t("modal_352")}</p>
          <div className={styles["asset-box"]}>
            {checkAmountIsZero(tokenList) ? (
              <div className={styles["no-data"]}>{t("modal_353")}</div>
            ) : (
              tokenList.map(token => {
                if (token.name.toLocaleLowerCase() === "hon") {
                  return <React.Fragment key={token.name}></React.Fragment>;
                }

                return (
                  <div className={styles.row} key={token.name}>
                    <span
                      className={`${styles.ico}`}
                      style={{
                        backgroundImage:
                          token.name.toLocaleLowerCase() === "jel_lock"
                            ? `url('/images/tokens/img_jel_lock.png')`
                            : `url('/images/tokens/img_token_${token.name.toLocaleLowerCase()}_circle.svg')`,
                      }}
                    ></span>
                    <span className={styles.name}>
                      {token.name.toLocaleLowerCase() === "jel_lock"
                        ? "JEL LOCK"
                        : token.name.toLocaleUpperCase()}
                    </span>
                    <div className={styles.amount}>
                      <span>
                        {formatNumber({
                          value: divCoinType(token.amount, token.name),
                          decimal: 0,
                          maxDigits: 7,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles["checkbox-area"]}>
          <input
            type="checkbox"
            id="check"
            onChange={({ target: { checked } }) => setIsAgreeDelete(checked)}
          />
          <label htmlFor="check">
            <span>{t("modal_354")}</span>
          </label>
        </div>
      </div>
      <button
        type="button"
        className={styles["submit-btn"]}
        disabled={!isAgreeDelete}
        onClick={() =>
          checkAmountIsZero(tokenList)
            ? mutate(
                // @ts-ignore
                {},
                {
                  onSuccess(data, variables, context) {
                    showErrorMessage(data.code);
                    if (data.code === 0) {
                      showToast(t("modal_355"));
                      logout();
                      signOut();
                      removeCookie("token", CookieOption);
                      closeModal();
                      // router.refresh();
                    }
                  },
                },
              )
            : setConfirmState(true)
        }
      >
        <span>{checkAmountIsZero(tokenList) ? "Confirm" : "Request"}</span>
      </button>

      <div
        className={`${styles["confirm-container"]} ${
          confirmState ? styles.active : ""
        }`}
      >
        <div className={styles.top}>
          <span>{t("modal_356")}</span>
          <button
            type="button"
            className={styles["back-btn"]}
            onClick={() => setConfirmState(!confirmState)}
          ></button>
          <button
            type="button"
            className={styles["close-btn"]}
            onClick={() => closeModal()}
          ></button>
        </div>
        <div className={styles.content}>
          <div className={styles["notice-group"]}>
            <p className={styles.title}>{t("modal_357")}</p>
            <ul>
              <li className={styles["not-point"]}>
                <span>{t("modal_358")}</span>
              </li>
              <li className={styles["not-point"]}>
                <span>{t("modal_359")}</span>
              </li>
              <li className={`${styles["not-point"]}`}>
                <span>{t("modal_360")}</span>
              </li>
            </ul>
          </div>
          <div className={styles["asset-group"]}>
            <p className={styles.title}>{t("modal_361")}</p>
            <div className={styles["asset-box"]}>
              {tokenList.map(token => {
                return (
                  <div className={styles.row} key={token.name}>
                    <span
                      className={`${styles.ico}`}
                      style={{
                        backgroundImage:
                          token.name.toLocaleLowerCase() === "jel_lock"
                            ? `url('/images/tokens/img_jel_lock.png')`
                            : `url('/images/tokens/img_token_${token.name.toLocaleLowerCase()}_circle.svg')`,
                      }}
                    ></span>
                    <span className={styles.name}>
                      {token.name.toUpperCase()}
                    </span>
                    <div className={styles.amount}>
                      <span>
                        {formatNumber({
                          value: divCoinType(token.amount, token.name),
                          decimal: 0,
                          maxDigits: 7,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled={!isAgreeDelete}
          className={styles["submit-btn"]}
          onClick={() => {
            if (isAgreeDelete) {
              mutate(
                // @ts-ignore
                {},
                {
                  onSuccess(data, variables, context) {
                    showErrorMessage(data.code);
                    if (data.code === 0) {
                      showToast(t("modal_355"));
                      logout();
                      signOut();
                      removeCookie("token", CookieOption);
                      router.refresh();
                    }
                  },
                },
              );
            }
          }}
        >
          <span>{t("modal_362")}</span>
        </button>
      </div>
    </div>
  );
}
