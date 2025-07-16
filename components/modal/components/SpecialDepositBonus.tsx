"use client";

import { useDictionary } from "@/context/DictionaryContext";
import styles from "./styles/specialDepositBonusModal.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useUserStore } from "@/stores/useUser";
import { useGetBonusStatisticsVer2 } from "@/querys/bonus";

export default function SpecialDepositBonus() {
  const { token } = useUserStore();
  const { data } = useGetBonusStatisticsVer2(token);
  const t = useDictionary();
  function getOrdinalSuffixNum(num: number): string {
    if (num % 100 >= 11 && num % 100 <= 13) {
      return `${num}th`;
    }

    switch (num % 10) {
      case 1:
        return `${num}st`;
      case 2:
        return `${num}nd`;
      case 3:
        return `${num}rd`;
      default:
        return `${num}th`;
    }
  }

  function getOrdinalSuffix(num: number): string {
    const ordinalMap: Record<number, string> = {
      1: "First",
      2: "Second",
      3: "Third",
      4: "Fourth",
    };

    return ordinalMap[num];
  }

  if (!data?.result) return <></>;
  return (
    <div className={styles["special-deposit-bonus-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_568")}</span>
      </div>
      <div className={styles.content}>
        <pre>{t("modal_569")}</pre>
        <div className={styles["step-container"]}>
          {data.result.deposit_bonus.deposit_bonus_info &&
            Array.from({ length: 4 }).map((_, i) => {
              return (
                <div className={styles.box} key={i}>
                  <div>
                    <p className={styles["step-info"]}>
                      {t("modal_570", [getOrdinalSuffixNum(i + 1)])}
                    </p>
                    <p className={styles["up-to-text"]}>
                      {t("modal_571", [
                        (
                          Number(
                            data.result.deposit_bonus.deposit_bonus_info?.[i]
                              ?.max_deposit_dollar,
                          ) *
                          Number(
                            data.result.deposit_bonus.deposit_bonus_info?.[i]
                              ?.bonus_multiply,
                          )
                        ).toString(),
                      ])}
                    </p>
                    <p className={styles["minimum-info-text"]}>
                      {t("modal_572", [
                        data.result.deposit_bonus.deposit_bonus_info?.[
                          i
                        ]?.min_deposit_dollar.toString() ?? "0",
                      ])}
                    </p>
                  </div>
                  <LazyLoadImage
                    src={`/images/bonus/img_bonus_${i + 1}_box_open.webp`}
                    alt={"img gift"}
                  />
                </div>
              );
            })}
        </div>
        <div className={styles["bonus-step-info"]}>
          {Array.from({ length: 4 }).map((_, i) => {
            return (
              <>
                <p>
                  {t("modal_573", [
                    (i + 1).toString(),
                    getOrdinalSuffix(i + 1),
                    (
                      (data.result.deposit_bonus.deposit_bonus_info?.[i]
                        ?.bonus_multiply ?? 0) * 100
                    ).toString() ?? "0",
                  ])}
                </p>
                <pre>
                  {t("modal_574", [
                    data.result.deposit_bonus.deposit_bonus_info?.[
                      i
                    ]?.min_deposit_dollar.toString() ?? "0",
                    Number(
                      data.result.deposit_bonus.deposit_bonus_info?.[i]
                        ?.max_deposit_dollar,
                    ).toLocaleString(),
                    data.result.deposit_bonus.deposit_bonus_info?.[
                      i
                    ]?.roll_over_multiply.toString() ?? "0",
                  ])}
                </pre>
              </>
            );
          })}
        </div>
        <pre>{t("modal_575")}</pre>
        <div className={styles["bonus-step-info"]}>
          <p>{t("modal_576")}</p>
          <pre>{t("modal_577")}</pre>
        </div>
        <div className={styles["bonus-step-info"]}>
          <pre>{t("modal_567")}</pre>
          <a
            href={"https://www.yummygame.io/policies/bonus"}
            target="_blank"
            rel="noreferrer"
          >
            https://www.yummygame.io/policies/bonus
          </a>
        </div>
      </div>
    </div>
  );
}
