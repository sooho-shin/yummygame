"use client";

import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles/honDropEventModal.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { formatNumber } from "@/utils";
import { useEffect } from "react";

export default function HonDropEvent() {
  const t = useDictionary();
  const { props, openModal, closeModal } = useModalHook();

  useEffect(() => {
    if (!props) {
      closeModal();
    }
  }, [props]);
  if (!props) return <></>;

  return (
    <div className={styles["hon-drop-modal"]}>
      <div className={styles.top}>
        <span>{}</span>
      </div>
      <div className={styles.content}>
        <p className={styles.small}>{t("modal_426")}</p>
        <p className={styles.big}>{t("modal_427")}</p>
        <p className={styles.sub}>{t("modal_428")}</p>
        <LazyLoadImage
          src="/images/modal/honDropEvent/img_trophy.webp"
          alt="img crypto"
          width={"200px"}
        />
        <p className={styles["date-info"]}>
          {t("modal_429")} <span>{props.strikeCount}</span> {t("modal_430")}
          <br />
          {props.strikeCount === 7 ? (
            <>{t("modal_433")}</>
          ) : (
            <>
              {t("modal_431")} <span>{7 - Number(props.strikeCount)}</span>{" "}
              {t("modal_432")}
            </>
          )}
        </p>
        <p className={styles.crt}>
          {t("modal_434")} <br />
          {t("modal_435")}{" "}
          <span>{formatNumber({ value: props.todayGetHon.toString() })}</span>{" "}
          HON
        </p>
      </div>
    </div>
  );
}
