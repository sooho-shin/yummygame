"use client";

import styles from "./styles/forgetAccountmodal.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
import { useRouter } from "next/navigation";
import CommonInputBox from "@/components/common/InputBox";
import { useEffect, useState } from "react";
import CommonButton from "@/components/common/Button";
import {
  useGetGeneralResetPasswordMail,
  usePostGeneralResetPassword,
} from "@/querys/user";
import useModalHook from "@/hooks/useModalHook";
import { useImmer } from "use-immer";
import useCommonHook from "@/hooks/useCommonHook";

export default function ResetPassword() {
  const t = useDictionary();
  const [password, setPassword] = useState<string | null>(null);

  const [passwordValidate, setPasswordValidate] = useImmer<
    { text: string; check: boolean }[] | null
  >(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const { showErrorMessage } = useCommonHook();

  const [confirmPasswordValidate, setonfirmPasswordValidate] = useImmer<
    { text: string; check: boolean }[] | null
  >(null);
  const { mutate } = usePostGeneralResetPassword();
  const { closeModal, props } = useModalHook();
  // soojoon9200000000@gmail.com
  const [completeResetPasswordState, setCompleteSendEmailState] =
    useState(false);

  //password validation
  useEffect(() => {
    if (password) {
      const passwordValidateList: { text: string; check: boolean }[] = [
        { text: t("modal_519"), check: false },
        { text: t("modal_520"), check: false },
        { text: t("modal_521"), check: false },
      ];

      // (1) 8-16자 범위 체크
      if (password.length >= 8 && password.length <= 16) {
        const item = passwordValidateList.find(v => v.text === t("modal_519"));
        if (item) {
          item.check = true;
        }
      }

      // (2) 알파벳 최소 1개 포함 체크
      if (/[a-zA-Z]/.test(password)) {
        const item = passwordValidateList.find(v => v.text === t("modal_520"));
        if (item) {
          item.check = true;
        }
      }

      // (3) 숫자 최소 1개 포함 체크
      if (/\d/.test(password)) {
        const item = passwordValidateList.find(v => v.text === t("modal_521"));
        if (item) {
          item.check = true;
        }
      }

      setPasswordValidate(passwordValidateList);
    }
  }, [password]);
  //confirm password validation
  useEffect(() => {
    if (confirmPassword) {
      const passwordValidateList: { text: string; check: boolean }[] = [
        { text: t("modal_519"), check: false },
        { text: t("modal_520"), check: false },
        { text: t("modal_521"), check: false },
      ];

      // (1) 8-16자 범위 체크
      if (confirmPassword.length >= 8 && confirmPassword.length <= 16) {
        const item = passwordValidateList.find(v => v.text === t("modal_519"));
        if (item) {
          item.check = true;
        }
      }

      // (2) 알파벳 최소 1개 포함 체크
      if (/[a-zA-Z]/.test(confirmPassword)) {
        const item = passwordValidateList.find(v => v.text === t("modal_520"));
        if (item) {
          item.check = true;
        }
      }

      // (3) 숫자 최소 1개 포함 체크
      if (/\d/.test(confirmPassword)) {
        const item = passwordValidateList.find(v => v.text === t("modal_521"));
        if (item) {
          item.check = true;
        }
      }

      setonfirmPasswordValidate(passwordValidateList);
    }
  }, [confirmPassword]);

  return (
    <div className={styles["forget-account-modal"]}>
      <div className={styles.top}>{/*<span>asdf</span>*/}</div>
      <div className={styles.content}>
        <p className={styles["reset-title"]}>
          {completeResetPasswordState ? t("modal_538") : t("modal_539")}
        </p>
        {completeResetPasswordState ? (
          <div className={styles["check-email-row"]}>{t("modal_540")}</div>
        ) : (
          <pre>{t("modal_541")}</pre>
        )}

        {!completeResetPasswordState && (
          <>
            <CommonInputBox
              title={t("modal_542")}
              required={true}
              placeholder={t("modal_543")}
              className={styles["mb"]}
              value={password ?? ""}
              onChange={e => {
                if (!e.target.value) {
                  setPassword(null);
                } else {
                  setPassword(e.target.value);
                }
              }}
              password={true}
              errorData={{
                text: null,
                listTitle: t("modal_544"),
                align: "left",
                list: passwordValidate,
              }}
              // onKeyDownCallback={() => generalSignIn()}
            />
            <CommonInputBox
              title={t("modal_545")}
              required={true}
              placeholder={t("modal_546")}
              // className={styles["input-row"]}
              value={confirmPassword ?? ""}
              onChange={e => {
                if (!e.target.value) {
                  setConfirmPassword(null);
                  // setLoginData(draft => {
                  //   draft.password = null;
                  //   return draft;
                  // });
                } else {
                  // setLoginErrorState(false);
                  setConfirmPassword(e.target.value);
                  // setLoginData(draft => {
                  //   draft.password = e.target.value;
                  //   return draft;
                  // });
                }
              }}
              password={true}
              errorData={{
                text: password !== confirmPassword ? t("modal_547") : null,
                listTitle: t("modal_544"),
                align: "left",
                list: confirmPasswordValidate,
              }}
              // onKeyDownCallback={() => generalSignIn()}
            />
          </>
        )}

        <CommonButton
          text={completeResetPasswordState ? t("modal_548") : t("modal_549")}
          isPending={false}
          className={completeResetPasswordState ? styles["mt-0"] : ""}
          onClick={() => {
            if (password && confirmPassword && props.passwordResetParam) {
              if (completeResetPasswordState) {
                closeModal();
              } else {
                mutate(
                  {
                    token: props.passwordResetParam,
                    password,
                    confirmPassword,
                  },
                  {
                    onSuccess: data => {
                      if (data.code === 0) {
                        setCompleteSendEmailState(true);
                      } else {
                        showErrorMessage(data.code);
                      }
                    },
                  },
                );
              }
            }
          }}
          disabled={
            passwordValidate?.some(c => !c.check) ||
            confirmPasswordValidate?.some(c => !c.check) ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
        />
      </div>
    </div>
  );
}
