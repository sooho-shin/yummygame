"use client";

import styles from "./styles/forgetAccountmodal.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
import { useRouter } from "next/navigation";
import CommonInputBox from "@/components/common/InputBox";
import { useState } from "react";
import CommonButton from "@/components/common/Button";
import { useGetGeneralResetPasswordMail } from "@/querys/user";
import useModalHook from "@/hooks/useModalHook";

export default function ForgetAccount() {
  const t = useDictionary();
  const [email, setEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate } = useGetGeneralResetPasswordMail();
  const { closeModal } = useModalHook();
  // soojoon9200000000@gmail.com
  const [completeSendEmailState, setCompleteSendEmailState] = useState(false);

  return (
    <div className={styles["forget-account-modal"]}>
      <div className={styles.top}>{/*<span>asdf</span>*/}</div>
      <div className={styles.content}>
        <p className={styles["reset-title"]}>
          {completeSendEmailState ? t("modal_534") : t("modal_535")}
        </p>
        {completeSendEmailState ? (
          <div className={styles["check-email-row"]}>
            {t("modal_536")} <span>{email}</span>
          </div>
        ) : (
          <pre>{t("modal_537")}</pre>
        )}

        {!completeSendEmailState && (
          <CommonInputBox
            title={t("modal_522")}
            required={true}
            placeholder={t("modal_523")}
            value={email ?? ""}
            onChange={e => {
              if (!e.target.value) {
                setErrorMessage(t("modal_517"));
                setEmail(null);
              } else {
                const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const result = regExp.test(e.target.value);
                if (!result) {
                  setErrorMessage(t("modal_518"));
                } else {
                  setErrorMessage(null);
                }

                setEmail(e.target.value);
              }
            }}
            deleteValueFn={() => setEmail(null)}
            errorData={{ text: errorMessage, align: "left" }}
            onKeyDownCallback={() => {
              if (email) {
                mutate(
                  { email },
                  {
                    onSuccess: data => {
                      if (data.code === 0) {
                        setCompleteSendEmailState(true);
                      } else {
                        setErrorMessage(t("modal_518"));
                      }
                    },
                  },
                );
              }
            }}
          />
        )}

        <CommonButton
          text={completeSendEmailState ? "Confirm" : "Send Reset Link"}
          isPending={false}
          className={completeSendEmailState ? styles["mt-0"] : ""}
          onClick={() => {
            if (email) {
              if (completeSendEmailState) {
                closeModal();
              } else {
                mutate(
                  { email },
                  {
                    onSuccess: data => {
                      if (data.code === 0) {
                        setCompleteSendEmailState(true);
                      } else {
                        setErrorMessage(t("modal_518"));
                      }
                    },
                  },
                );
              }
            }
          }}
          disabled={!completeSendEmailState && (!!errorMessage || !email)}
        />
      </div>
    </div>
  );
}
