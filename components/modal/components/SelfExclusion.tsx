"use client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import CommonInputBox from "@/components/common/InputBox";
import styles from "./styles/selfExclusionModal.module.scss";
import { useUserStore } from "@/stores/useUser";
import { useGetCommon } from "@/querys/common";
import {
  useGetUserLogout,
  useGetUserProfile,
  usePostUserExclusion,
} from "@/querys/user";
import { useMemo, useState } from "react";
import { signOut } from "@/lib/firebase";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useInterval } from "react-use";
import { CookieOption } from "@/utils";
import CommonButton from "@/components/common/Button";
import { useDictionary } from "@/context/DictionaryContext";

export default function SelfExclusion() {
  dayjs.extend(utc);
  const router = useRouter();
  const { logout, token } = useUserStore();
  const { data: userData } = useGetUserProfile(token);
  const t = useDictionary();
  const periodArray = [
    { text: t("modal_221") },
    { text: t("modal_222") },
    { text: t("modal_223") },
    { text: t("modal_224") },
    { text: t("modal_225") },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const { closeModal } = useModalHook();
  const { mutate, isLoading } = usePostUserExclusion();
  const [, , removeCookie] = useCookies();
  const { showToast, showErrorMessage } = useCommonHook();

  function extractNumberFromPeriod(period: string): number {
    const numberPart = period.replace(/\D/g, ""); // 숫자 이외의 문자 제거
    const number = parseInt(numberPart, 10); // 문자열을 숫자로 변환

    // 만약 변환된 숫자가 유효하다면 반환, 그렇지 않으면 null 반환
    return number;
  }

  const [confirmState, setConfirmState] = useState(false);
  const [endDate, setEndData] = useState("");
  useInterval(
    () => {
      setEndData(
        dayjs()
          .add(Number(extractNumberFromPeriod(selectedPeriod ?? "7")))
          .format("YY/MM/DD HH:mm:ss"),
      );
    },
    selectedPeriod ? 1000 : null,
  );

  return (
    <div className={styles["exclusion-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_226")}</span>
      </div>
      <div
        className={`${styles.content} ${
          confirmState ? styles["non-padding"] : ""
        }`}
      >
        <div className={styles["notice-group"]}>
          <p className={styles.title}>{t("modal_227")}</p>
          <ul>
            <li className={styles["not-point"]}>
              <span>{t("modal_228")}</span>
            </li>
            <li>
              <span>{t("modal_229")}</span>
            </li>
            <li>
              <span>{t("modal_230")}</span>
            </li>
            <li>
              <span>{t("modal_231")}</span>
            </li>
            <li>
              <span>{t("modal_232")}</span>
            </li>
          </ul>
        </div>
        <div className={styles["input-group"]}>
          <CommonInputBox
            readonly={true}
            title={t("modal_233")}
            value={userData?.result.email}
            ico={<span className={styles["ico-google"]}></span>}
            required={false}
          />
          <CommonInputBox
            title={t("modal_234")}
            dropdownData={{
              dropDownArray: periodArray,
              selectedValue: { text: selectedPeriod },
              setSelectedValue: (data: {
                icoPath?: string;
                text?: string | null;
              }) => {
                setSelectedPeriod(data.text ?? "");
              },
              placeholder: t("modal_235"),
            }}
          />
        </div>
      </div>

      <button
        type="button"
        disabled={!selectedPeriod}
        className={styles["submit-btn"]}
        onClick={() => {
          setConfirmState(true);
        }}
      >
        <span>{t("modal_236")}</span>
      </button>

      <div
        className={`${styles["confirm-container"]} ${
          confirmState ? styles.active : ""
        }`}
      >
        <div className={styles.top}>
          <span>{t("modal_237")}</span>
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
            <p className={styles.title}>{t("modal_238")}</p>
            <ul>
              <li className={styles["not-point"]}>
                <span>{t("modal_239")}</span>
              </li>
              <li className={styles["not-point"]}>
                <span>{t("modal_240")}</span>
              </li>
              <li className={`${styles["not-point"]} ${styles.margin}`}>
                <span>{t("modal_241")}</span>
              </li>
            </ul>
          </div>
          <div className={styles["input-group"]}>
            <CommonInputBox
              readonly={true}
              title={t("modal_242")}
              value={userData?.result.email}
              ico={<span className={styles["ico-google"]}></span>}
              required={false}
            />
            <CommonInputBox
              title={t("modal_243")}
              required={false}
              readonly={true}
              value={selectedPeriod}
            />
            <CommonInputBox
              title={t("modal_244")}
              required={false}
              readonly={true}
              value={
                endDate ??
                dayjs()
                  .add(Number(extractNumberFromPeriod(selectedPeriod ?? "7")))
                  .format("YY/MM/DD HH:mm:ss")
              }
            />
          </div>
        </div>
        <CommonButton
          isPending={isLoading}
          disabled={!selectedPeriod}
          className={styles["submit-btn"]}
          onClick={() => {
            if (!selectedPeriod || !extractNumberFromPeriod(selectedPeriod))
              return false;
            mutate(
              { period: extractNumberFromPeriod(selectedPeriod) },
              {
                onSuccess(data) {
                  showErrorMessage(data.code);
                  if (data.code === 0) {
                    showToast(t("modal_245"));
                    logout();
                    signOut();
                    removeCookie("token", CookieOption);
                    router.refresh();
                  }
                },
              },
            );
          }}
          text={t("modal_246")}
        />
      </div>
    </div>
  );
}
