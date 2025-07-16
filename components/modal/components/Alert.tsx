"use client";

import styles from "./styles/modal.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import { useRouter } from "next/navigation";

export default function Alert() {
  const { alertData, callback, closeModal } = useModalHook();
  const t = useDictionary();
  const router = useRouter();
  if (!alertData)
    return (
      <div className={styles["alert-modal"]}>
        <div className={styles.top}>
          <span>모달 데이터 없음</span>
        </div>
        <div className={styles.content}>모달 데이터 없음</div>
      </div>
    );
  return (
    <div className={styles["alert-modal"]}>
      <div className={styles.top}>
        <span>{alertData.title}</span>
      </div>
      <div className={styles.content}>{alertData.children}</div>
      {callback && (
        <div className={styles["btn-row"]}>
          <button
            type="button"
            className={styles["confirm-btn"]}
            onClick={() => {
              callback();
              closeModal();
              // router.push("/");
              // closeModal();
            }}
          >
            <span>{t("modal_38")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
