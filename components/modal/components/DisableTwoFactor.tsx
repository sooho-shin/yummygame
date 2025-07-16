"use client";

import CommonButton from "@/components/common/Button";
import styles from "./styles/disableModal.module.scss";
import { customConsole } from "@/utils";
import { LegacyRef, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  useDeleteTwoFactorAuth,
  useGetTwoFactorAuth,
} from "@/querys/twoFactoe";
import CopyButton from "@/components/common/CopyButton";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
// Install Swiper modules

export default function DisableTwoFactor() {
  const { closeModal } = useModalHook();
  const t = useDictionary();

  const { showErrorMessage, showToast } = useCommonHook();
  const [passcode, setPassCode] = useState<string | null>("");

  const [focusState, setFocusState] = useState(false);

  const { mutate, isLoading } = useDeleteTwoFactorAuth();

  const handleSubmit = () => {
    if (passcode?.length === 6) {
      mutate(
        { passcode },
        {
          onSuccess(data) {
            showErrorMessage(data.code);
            if (data.code === 0) {
              closeModal();
              showToast(t("toast_14"));
            }
          },
        },
      );
    }
  };

  useEffect(() => {
    if (passcode && passcode.length === 6) {
      mutate(
        { passcode },
        {
          onSuccess(data) {
            showErrorMessage(data.code);
            if (data.code === 0) {
              closeModal();
              showToast(t("toast_14"));
              setPassCode("");
            }
          },
        },
      );
    }
  }, [passcode]);

  return (
    <div className={styles["disable-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_342")}</span>
      </div>
      <div className={styles.content}>
        <p>{t("modal_343")}</p>
        <div className={styles["verification-container"]}>
          <div className={styles.top}>
            <span>{t("modal_344")}</span>
          </div>
          <input
            type="text"
            onChange={e => {
              const regex = /^[0-9]*$/; // 숫자만 체크
              if (regex.test(e.target.value)) {
                setPassCode(e.target.value);
                return true;
              } else {
                return false;
              }
            }}
            value={passcode ?? ""}
            maxLength={6}
            id="code"
            onFocus={() => setFocusState(true)}
            onBlur={() => setFocusState(false)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <label className={styles["code-input-group"]} htmlFor="code">
            {Array.from({ length: 6 }).map((c, i) => {
              return (
                <div
                  className={classNames(styles.box, {
                    [styles.focus]:
                      focusState &&
                      (passcode?.length === i ||
                        (i === 5 && passcode?.length === 6)),
                  })}
                  key={i}
                >
                  <span>{passcode?.slice(i, i + 1)}</span>
                </div>
              );
            })}
          </label>
        </div>
      </div>

      <CommonButton
        isPending={isLoading}
        text="Disable"
        onClick={() => handleSubmit()}
        disabled={passcode?.length !== 6}
      />
    </div>
  );
}
