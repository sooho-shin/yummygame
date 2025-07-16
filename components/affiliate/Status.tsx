"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import {
  useGetAffiliateClaim,
  useGetAffiliateStatistics,
} from "@/querys/bonus";
import { useUserStore } from "@/stores/useUser";
import { formatNumber } from "@/utils";
import Link from "next/link";
import CommonToolTip from "../common/ToolTip";
import styles from "./styles/affiliate.module.scss";
import { useEffect, useState } from "react";
import useModalHook from "@/hooks/useModalHook";
import classNames from "classnames";

export default function AffiliateStatus() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token } = useUserStore();
  const { data: affiliateData } = useGetAffiliateStatistics(token);
  const { amountToDisplayFormat, fiatSymbol, checkMedia } = useCommonHook();
  const { mutate } = useGetAffiliateClaim();
  const t = useDictionary();
  const { openModal } = useModalHook();

  if (!hydrated) return <></>;
  return (
    <div className={styles["affiliate-status-wrapper"]}>
      <div className={styles.content}>
        <p className={styles.title}>{t("affiliate_28")}</p>
        <div className={styles.row}>
          <div className={styles.box}>
            <div className={styles["top-row"]}>
              <span className={styles.title}>{t("affiliate_29")}</span>
              <div className={styles["jel-amount-box"]}>
                <span className={styles.opacity}>{fiatSymbol}</span>
                {hydrated && (
                  <span>
                    {!affiliateData ||
                    !token ||
                    !Number(affiliateData.result.total_wager)
                      ? "-"
                      : amountToDisplayFormat(
                          null,
                          "jel",
                          affiliateData.result.total_wager,
                          false,
                          null,
                          false,
                        )}
                  </span>
                )}
              </div>
            </div>
            <div className={styles["content-group"]}>
              <div className={styles.content}>
                <div className={styles["tier-member-info"]}>
                  <span>{t("affiliate_30")}</span>
                  <div>
                    <span>
                      {!affiliateData ||
                      !token ||
                      !Number(affiliateData.result.tier1_count)
                        ? "-"
                        : formatNumber({
                            value: affiliateData.result.tier1_count.toString(),
                          })}
                    </span>
                    <span></span>
                  </div>
                </div>
                <p>
                  {fiatSymbol}{" "}
                  {!affiliateData ||
                  !token ||
                  !Number(affiliateData.result.wager_tier1)
                    ? "-"
                    : amountToDisplayFormat(
                        null,
                        "jel",
                        affiliateData.result.wager_tier1,
                        false,
                        null,
                        false,
                      )}
                </p>
              </div>
              <div className={styles.content}>
                <div className={styles["tier-member-info"]}>
                  <span>{t("affiliate_31")}</span>
                  <div>
                    <span>
                      {!affiliateData ||
                      !token ||
                      !Number(affiliateData.result.tier2_count)
                        ? "-"
                        : formatNumber({
                            value: affiliateData.result.tier2_count.toString(),
                          })}
                    </span>
                    <span></span>
                  </div>
                </div>
                <p>
                  {fiatSymbol}{" "}
                  {!affiliateData ||
                  !token ||
                  !Number(affiliateData.result.wager_tier2)
                    ? "-"
                    : amountToDisplayFormat(
                        null,
                        "jel",
                        affiliateData.result.wager_tier2,
                        false,
                        null,
                        false,
                      )}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles["top-row"]}>
              <span className={styles.title}>{t("affiliate_32")}</span>
              <div className={styles["jel-amount-box"]}>
                <span>
                  {!affiliateData ||
                  !token ||
                  !affiliateData.result.total_affiliate_bonus ||
                  affiliateData.result.total_affiliate_bonus === "0"
                    ? "-"
                    : formatNumber({
                        value: affiliateData.result.total_affiliate_bonus,
                      })}
                </span>
                <span className={styles.opacity}>JEL</span>
              </div>
            </div>
            <div className={styles["content-group"]}>
              <div className={styles.content}>
                <div className={styles["tier-member-info"]}>
                  <span>{t("affiliate_30")}</span>
                </div>
                <div className={styles["amount-box"]}>
                  <span>
                    {!affiliateData ||
                    !token ||
                    !affiliateData.result.affiliate_bonus_tier1 ||
                    Number(affiliateData.result.affiliate_bonus_tier1) === 0
                      ? "-"
                      : formatNumber({
                          value: affiliateData.result.affiliate_bonus_tier1,
                        })}
                  </span>
                  <span></span>
                </div>
                <div className={styles["rate-info-row"]}>
                  <span>{t("affiliate_33")}</span>
                  <span className={styles.info}>14%</span>
                  <CommonToolTip tooltipText={`Wagered x 1% x 14%`} />
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles["tier-member-info"]}>
                  <span>{t("affiliate_31")}</span>
                </div>
                <div className={styles["amount-box"]}>
                  <span>
                    {!affiliateData ||
                    !token ||
                    !Number(affiliateData.result.affiliate_bonus_tier2)
                      ? "-"
                      : formatNumber({
                          value: affiliateData.result.affiliate_bonus_tier2,
                        })}
                  </span>
                  <span></span>
                </div>
                <div className={styles["rate-info-row"]}>
                  <span>{t("affiliate_33")}</span>
                  <span className={styles.info}>2%</span>
                  <CommonToolTip tooltipText={`Wagered x 1% x 2%`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["bottom-group"]}>
          <div>
            <div className={styles.top}>
              <span>{t("affiliate_38")}</span>
              <div className={styles["jel-affiliate-box"]}>
                <p>
                  <span
                    className={classNames({
                      [styles.active]:
                        Number(affiliateData?.result.claimable_jel) >= 5,
                    })}
                  >
                    {Number(affiliateData?.result.claimable_jel) === 0
                      ? "-"
                      : affiliateData?.result.claimable_jel || "-"}
                  </span>
                  <span>JEL</span>
                </p>
                {checkMedia !== "mobile" && (
                  <button
                    type={"button"}
                    onClick={() =>
                      mutate(
                        // @ts-ignore
                        {},
                        {
                          onSuccess: data => {
                            openModal({
                              type: "claimBonus",
                              props: {
                                claimType: "AFFILIATE",
                                claimedJel: data.result.jel,
                              },
                            });
                          },
                        },
                      )
                    }
                    disabled={Number(affiliateData?.result.claimable_jel) < 5}
                  >
                    <span>{t("bonus_50")}</span>
                  </button>
                )}
              </div>
            </div>
            {checkMedia === "mobile" && (
              <button
                type={"button"}
                onClick={() =>
                  mutate(
                    // @ts-ignore
                    {},
                    {
                      onSuccess: data => {
                        openModal({
                          type: "claimBonus",
                          props: {
                            claimType: "AFFILIATE",
                            claimedJel: data.result.jel,
                          },
                        });
                      },
                    },
                  )
                }
                disabled={Number(affiliateData?.result.claimable_jel) < 5}
              >
                <span>{t("bonus_50")}</span>
              </button>
            )}
            <p className={styles.bottom}>{t("affiliate_39")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
