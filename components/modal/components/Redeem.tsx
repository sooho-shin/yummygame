"use client";

import styles from "./styles/redeem.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import { useRouter } from "next/navigation";
import CommonInputBox from "@/components/common/InputBox";
import { useEffect, useState } from "react";
import CommonButton from "@/components/common/Button";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetBonusStatisticsVer2, usePostBonusRedeem } from "@/querys/bonus";
import { useGetCommon } from "@/querys/common";
import { useUserStore } from "@/stores/useUser";

export default function Redeem() {
  const { alertData, callback, closeModal } = useModalHook();
  const t = useDictionary();
  const [code, setCode] = useState<string | null>(null);
  const { showToast, showErrorMessage } = useCommonHook();
  const { mutate, isLoading } = usePostBonusRedeem();
  const { token } = useUserStore();
  const { refetch } = useGetCommon(token);
  const { refetch: bonusDataRefetch } = useGetBonusStatisticsVer2(token);
  const { openModal } = useModalHook();

  const postRedeemCode = () => {
    if (!code) return;

    const handleSuccess = (data: any) => {
      if (data.code === -10034) {
        openModal({ type: "accountSetting" });
        showToast(t("error_10034"));
        closeModal();
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
      closeModal();
    };

    mutate({ code }, { onSuccess: handleSuccess });
  };

  return (
    <div className={styles["redeem-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_408")}</span>
      </div>
      <div className={styles.content}>
        <CommonInputBox
          placeholder={t("modal_409")}
          value={code}
          onChange={e => {
            setCode(e.target.value);
          }}
          onKeyDownCallback={() => postRedeemCode()}
        />
      </div>
      <CommonButton
        text={t("modal_411")}
        isPending={isLoading}
        onClick={() => postRedeemCode()}
        disabled={!code || code.length > 100}
      />
    </div>
  );
}
