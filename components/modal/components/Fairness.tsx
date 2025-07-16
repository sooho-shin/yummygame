"use client";

import { CommonGameKeys } from "@/config/queryKey";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetGameSeed, usePutGameSeed } from "@/querys/game/common";
import { validateByte } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styles from "./styles/fairnessModal.module.scss";
export default function Fairness() {
  const { props } = useModalHook();
  // const modalGameType = searchParams.get("modalGameType");
  if (!props.modalGameType) {
    return <>asdf</>;
  }
  if (props.modalGameType === "CRASH" || props.modalGameType === "WHEEL") {
    return <MultiGameComponent modalGameType={props.modalGameType} />;
  } else {
    return <SingleGameComponent modalGameType={props.modalGameType} />;
  }
}

const MultiGameComponent = ({
  modalGameType,
}: {
  modalGameType: "CRASH" | "WHEEL";
}) => {
  const t = useDictionary();
  return (
    <div className={styles["fairness-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_122")}</span>
      </div>
      <div className={styles["text-content"]}>
        <pre>{modalGameType === "CRASH" ? t("modal_123") : t("modal_124")}</pre>
        <a
          href={`${process.env.NEXT_PUBLIC_URL}/fairness/${
            modalGameType === "CRASH" ? "crash" : "wheel"
          }`}
          target="_blank"
          rel="noreferrer"
        >
          <span>{t("modal_125")}</span>
        </a>
      </div>
    </div>
  );
};

const SingleGameComponent = ({ modalGameType }: { modalGameType: string }) => {
  const { mutate: putGameSeed } = usePutGameSeed();
  const { showToast, showErrorMessage } = useCommonHook();
  const queryClient = useQueryClient();
  const t = useDictionary();

  function generateRandomString(minByte: number, maxByte: number): string {
    if (minByte < 10 || maxByte > 32 || minByte > maxByte) {
      throw new Error(t("modal_53"));
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    let currentByte = 0;

    while (currentByte < minByte) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const charByte = Buffer.from(characters.charAt(randomIndex)).length;

      if (currentByte + charByte <= maxByte) {
        result += characters.charAt(randomIndex);
        currentByte += charByte;
      }
    }

    return result;
  }

  const { data: seedData, refetch } = useGetGameSeed({
    gameType: modalGameType || "CRASH",
  });

  useEffect(() => {
    refetch();
  }, []);

  const [changeState, setChangeState] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);

  if (!seedData) return <></>;

  return (
    <div className={styles["fairness-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_126")}</span>
      </div>
      <div className={styles.content}>
        <p className={styles["sub-title"]}>{t("modal_127")}</p>
        <div className={styles["current-seed-box"]}>
          <p className={styles.title}>{t("modal_128")}</p>
          <div className={styles.box}>
            <div className={styles.row}>
              <span>{t("modal_129")}</span>
              <span>{seedData.result.current_server_seed_hash}</span>
            </div>
            <div className={styles.row}>
              <span>{t("modal_130")}</span>
              <span>{seedData.result.current_client_seed}</span>
            </div>
            <div className={styles.row}>
              <span>{t("modal_131")}</span>
              <span>{seedData.result.nonce}</span>
            </div>
          </div>
        </div>

        <div className={styles["new-seed-box"]}>
          <p className={styles.title}>{t("modal_132")}</p>
          <div className={styles.box}>
            <div className={styles["hash-box"]}>
              <p className={styles.title}>{t("modal_133")}</p>
              <div className={styles["input-box"]}>
                <input
                  type="input"
                  readOnly
                  value={seedData.result.next_server_seed_hash}
                ></input>
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <p className={styles.title}>{t("modal_134")}</p>
                <div className={styles["input-box"]}>
                  <input
                    type="text"
                    value={
                      changeState
                        ? seed ?? ""
                        : seedData.result.current_client_seed
                    }
                    onChange={e => {
                      setSeed(e.target.value);
                      setChangeState(true);
                    }}
                  />
                  <button
                    type="button"
                    className={styles["refresh-btn"]}
                    onClick={() => {
                      setChangeState(true);
                      setSeed(generateRandomString(15, 25));
                    }}
                  ></button>
                </div>
              </div>
              <div>
                <p className={styles.title}>{t("modal_135")}</p>
                <div className={`${styles["input-box"]} ${styles.disabled}`}>
                  <input type="text" readOnly value={"0"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.info}>{t("modal_136")}</p>
      </div>
      <button
        type="button"
        className={`${styles["submit-btn"]} ${
          validateByte(seed ?? "", 32, 10) && changeState ? styles.active : ""
        }`}
        disabled={!(validateByte(seed ?? "", 32, 10) && changeState)}
        onClick={() => {
          putGameSeed(
            { clientSeed: seed ?? "", gameType: modalGameType ?? "" },
            {
              onSuccess(data) {
                showErrorMessage(data.code);
                if (data.code === 0) {
                  showToast(t("modal_137"));
                  refetch();
                  queryClient.invalidateQueries([
                    `${
                      CommonGameKeys.MYHISTORY
                    }${modalGameType?.toLocaleUpperCase()}`,
                  ]);
                }
              },
            },
          );
        }}
      >
        <span>Use New Seeds</span>
      </button>
    </div>
  );
};
