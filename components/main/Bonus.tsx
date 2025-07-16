import { useEffect, useRef } from "react";
import styles from "./styles/mainWrapper.module.scss";
import { useIntersection, useWindowScroll } from "react-use";
import { useInView } from "react-intersection-observer";
import { useDictionary } from "@/context/DictionaryContext";

export default function MainBonus() {
  const { ref: textGroupRef, inView: textGroupInView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const { ref: contentGroupRef, inView: contentGroupInView } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const { ref: sparkleGroupRef, inView: sparkleGroupInView } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const t = useDictionary();

  return (
    <div className={styles["main-bonus-wrapper"]}>
      <div
        className={`${styles.sparkle} ${
          sparkleGroupInView ? styles.active : ""
        }`}
        ref={sparkleGroupRef}
      ></div>

      <div className={styles.top}>
        <h5>{t("main_41")}</h5>
        <p>{t("main_42")}</p>
      </div>

      <div
        className={`${styles["text-group"]} ${
          textGroupInView ? styles.active : ""
        }`}
        ref={textGroupRef}
      >
        <span>{t("main_82")}</span>
        <span>{t("main_83")}</span>
      </div>
      <div
        className={`${styles["content-group"]} ${
          contentGroupInView ? styles.active : ""
        }`}
        ref={contentGroupRef}
      >
        <div className={styles.content}>
          <p className={styles["content-title"]}>{t("main_43")}</p>
          <p className={styles["content-sub-title"]}>{t("main_44")}</p>
          <div className={styles.image}></div>
          <p className={styles["content-title-bottom"]}>{t("main_45")}</p>
          <p className={styles["content-sub-title-bottom"]}>{t("main_46")}</p>
        </div>
        <div className={styles.content}>
          <p className={styles["content-title"]}>{t("main_47")}</p>
          <p className={styles["content-sub-title"]}>{t("main_48")}</p>
          <div className={styles.image}></div>
          <p className={styles["content-title-bottom"]}>{t("main_49")}</p>
          <p className={styles["content-sub-title-bottom"]}>{t("main_50")}</p>
        </div>
        <div className={styles.content}>
          <p className={styles["content-title"]}>{t("main_51")}</p>
          <p className={styles["content-sub-title"]}>{t("main_52")}</p>
          <div className={styles.image}></div>
          <p className={styles["content-title-bottom"]}>{t("main_53")}</p>
          <p className={styles["content-sub-title-bottom"]}>{t("main_54")}</p>
        </div>
        <div className={styles.content}>
          <p className={styles["content-title"]}>{t("main_55")}</p>
          <p className={styles["content-sub-title"]}>{t("main_56")}</p>
          <div className={styles.image}></div>
          <p className={styles["content-title-bottom"]}>{t("main_57")}</p>
          <p className={styles["content-sub-title-bottom"]}>{t("main_58")}</p>
        </div>
      </div>
    </div>
  );
}
