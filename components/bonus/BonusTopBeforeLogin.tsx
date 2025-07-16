"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/bonus.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import { scroller } from "react-scroll";
import { useSearchParams } from "next/navigation";

const BonusTopBeforeLogin = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { openModal } = useModalHook();
  const t = useDictionary();

  const searchParams = useSearchParams();
  const param = searchParams.get("special");

  useEffect(() => {
    openModal({ type: "getstarted" });
  }, [hydrated, param]);

  return (
    <div className={styles["bonus-top-before-login-wrapper"]}>
      <h2 className={styles.title}>{t("bonus_107")}</h2>
      <div className={styles["banner"]}>
        <div className={styles.bg}></div>
        <p className={styles.title}>{t("bonus_108")}</p>
        <p className={styles["sub-text"]}>{t("bonus_109")}</p>
        <button
          type={"button"}
          onClick={() => openModal({ type: "getstarted" })}
        >
          <span>{t("bonus_110")}</span>
        </button>
      </div>
    </div>
  );
};

export default BonusTopBeforeLogin;
