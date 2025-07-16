import { useState } from "react";
import styles from "./styles/mainWrapper.module.scss";
import { useBoolean, useInterval } from "react-use";
import { useDictionary } from "@/context/DictionaryContext";

export default function MainFair() {
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [isRunning, toggleIsRunning] = useBoolean(true);
  const t = useDictionary();

  useInterval(
    () => {
      let count = currentIndex;
      count = currentIndex + 1;

      if (count === 5) {
        count = 1;
      }
      setCurrentIndex(count);
    },
    isRunning ? 2000 : null,
  );

  return (
    <div className={styles["main-fair-wrapper"]}>
      <div className={styles.top}>
        <h5>{t("main_59")}</h5>
        <p>
          <span>{t("main_60")}</span>
          <span>{t("main_61")}</span>
        </p>
      </div>
      <div className={styles["content-box"]}>
        <div className={styles["planet-box"]}>
          <div className={styles.star}></div>
          <div
            className={`${styles[`planet_${currentIndex as 1 | 2 | 3 | 4}`]}`}
          ></div>
        </div>
        <div className={styles["content-group"]}>
          <button
            type="button"
            className={`${styles.content} ${
              currentIndex === 1 ? styles.active : ""
            }`}
            onClick={() => {
              setCurrentIndex(1);
              toggleIsRunning(false);
            }}
            onMouseEnter={() => {
              setCurrentIndex(1);
              toggleIsRunning(false);
            }}
          >
            <div className={styles.ico}></div>
            <div className={styles["text-group"]}>
              <p className={styles.title}>{t("main_62")}</p>
              <p className={styles.text}>{t("main_63")}</p>
            </div>
          </button>
          <button
            type="button"
            className={`${styles.content} ${
              currentIndex === 2 ? styles.active : ""
            }`}
            onClick={() => {
              setCurrentIndex(2);
              toggleIsRunning(false);
            }}
            onMouseEnter={() => {
              setCurrentIndex(2);
              toggleIsRunning(false);
            }}
          >
            <div className={styles.ico}></div>
            <div className={styles["text-group"]}>
              <p className={styles.title}>{t("main_64")}</p>
              <p className={styles.text}>{t("main_65")}</p>
            </div>
          </button>
          <button
            type="button"
            className={`${styles.content} ${
              currentIndex === 3 ? styles.active : ""
            }`}
            onClick={() => {
              setCurrentIndex(3);
              toggleIsRunning(false);
            }}
            onMouseEnter={() => {
              setCurrentIndex(3);
              toggleIsRunning(false);
            }}
          >
            <div className={styles.ico}></div>
            <div className={styles["text-group"]}>
              <p className={styles.title}>{t("main_66")}</p>
              <p className={styles.text}>{t("main_67")}</p>
            </div>
          </button>
          <button
            type="button"
            className={`${styles.content} ${
              currentIndex === 4 ? styles.active : ""
            }`}
            onClick={() => {
              setCurrentIndex(4);
              toggleIsRunning(false);
            }}
            onMouseEnter={() => {
              setCurrentIndex(4);
              toggleIsRunning(false);
            }}
          >
            <div className={styles.ico}></div>
            <div className={styles["text-group"]}>
              <p className={styles.title}>{t("main_68")}</p>
              <p className={styles.text}>{t("main_69")}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
