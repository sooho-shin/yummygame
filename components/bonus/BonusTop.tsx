"use client";

import React, { useState } from "react";
import styles from "./styles/bonus.module.scss";
import classNames from "classnames";
import { useGetBonusStatisticsVer2, usePostBonusRedeem } from "@/querys/bonus";
import useCommonHook from "@/hooks/useCommonHook";
import { useUserStore } from "@/stores/useUser";
import { useGetCommon } from "@/querys/common";
import { useDictionary } from "@/context/DictionaryContext";
import useModalHook from "@/hooks/useModalHook";

const BonusTop = () => {
  const [code, setCode] = useState<string | null>(null);
  const { mutate } = usePostBonusRedeem();
  const t = useDictionary();
  const { showToast, showErrorMessage } = useCommonHook();
  const { token } = useUserStore();
  const { refetch } = useGetCommon(token);
  const { refetch: bonusDataRefetch } = useGetBonusStatisticsVer2(token);
  const { openModal, closeModal } = useModalHook();

  const postRedeemCode = () => {
    if (!code) return;

    const handleSuccess = (data: any) => {
      if (data.code === -10034) {
        openModal({ type: "accountSetting" });
        showToast(t("error_10034"));
        // closeModal();
        return false;
      }
      showErrorMessage(data.code);

      if (data.code !== 0) return;

      const { get_point, asset_type, type } = data.result;

      if (type === "DEPOSIT") {
        openModal({ type: "wallet" });
      }

      if (get_point === "0") {
        showToast(t("modal_410"));
      } else if (asset_type) {
        showToast(t("modal_443", [get_point, asset_type]));
      } else {
        showToast(t("modal_442"));
      }

      refetch();
      bonusDataRefetch();
    };

    mutate({ code }, { onSuccess: handleSuccess });
  };
  return (
    <div className={styles["bonus-top-container"]}>
      <h2>BONUS</h2>

      <div className={styles["input-box"]}>
        <div>
          <input
            type="text"
            placeholder={t("bonus_140")}
            value={code ?? ""}
            onChange={e => setCode(e.target.value)}
            className={classNames({ [styles.active]: code })}
            onKeyDown={e => {
              if (e.key === "Enter") {
                postRedeemCode();
              }
            }}
          />
        </div>

        <button
          type={"button"}
          onClick={() => postRedeemCode()}
          className={classNames({ [styles.active]: code && code?.length > 2 })}
        >
          <span>{t("bonus_62")}</span>
        </button>
      </div>
    </div>
  );
};

export default BonusTop;
