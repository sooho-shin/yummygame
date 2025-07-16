"use client";

import { useMemo } from "react";
import styles from "./styles/ruleModal.module.scss";
import { useSearchParams } from "next/navigation";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";

export default function Rule() {
  // const searchParams = useSearchParams();
  // const modalGameType = searchParams.get("modalGameType") as
  //   | "CRASH"
  //   | "MINES"
  //   | "ROULETTE"
  //   | "CLASSIC_DICE"
  //   | "ULTIMATE_DICE"
  //   | "COIN_FLIP"
  //   | "WHEEL"
  //   | "PROVIDER";
  const { props } = useModalHook();
  const t = useDictionary();

  const text = useMemo(() => {
    switch (props.modalGameType) {
      case "CRASH":
        return t("modal_213");

      case "WHEEL":
        return t("modal_214");

      case "MINES":
        return t("modal_215");

      case "ROULETTE":
        return t("modal_216");

      case "CLASSIC_DICE":
        return t("modal_217");

      case "ULTIMATE_DICE":
        return t("modal_218");

      case "COIN_FLIP":
        return t("modal_219");

      case "PLINKO":
        return t("modal_419");

      case "LIMBO":
        return t("modal_424");

      default:
        return "";
    }
  }, [props.modalGameType]);

  return (
    <div className={styles["rule-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_220")}</span>
      </div>
      <div className={styles.content}>
        <pre>{text}</pre>
      </div>
    </div>
  );
}
