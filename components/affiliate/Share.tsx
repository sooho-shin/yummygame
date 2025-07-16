"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetAffiliateStatistics } from "@/querys/bonus";
import { useUserStore } from "@/stores/useUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import CopyButton from "../common/CopyButton";
import styles from "./styles/affiliate.module.scss";

export default function AffiliateShare() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token } = useUserStore();
  const { data: affiliateData } = useGetAffiliateStatistics(token);
  const { checkMedia } = useCommonHook();
  const t = useDictionary();

  return (
    <div className={styles["affiliate-share-wrapper"]}>
      <h2 className={styles.title}>{t("affiliate_20")}</h2>
      <div className={styles["content-group"]}>
        <div className={styles["info-box"]}>
          <p className={styles.title}>{t("affiliate_21")}</p>
          {checkMedia !== "mobile" && hydrated && (
            <pre>{t("affiliate_22")}</pre>
          )}
        </div>
        <div className={styles["input-group"]}>
          <div className={styles["input-area"]}>
            <p>{t("affiliate_23")}</p>
            <div className={styles["input-box"]}>
              <input
                type="text"
                readOnly
                value={
                  !token || !affiliateData
                    ? "-"
                    : affiliateData.result.affiliate_code
                }
              ></input>
              {hydrated && (
                <CopyButton
                  copyValue={affiliateData?.result.affiliate_code ?? "nothing"}
                  disabled={!token}
                />
              )}
            </div>
          </div>

          <div className={styles["input-area"]}>
            <p>{t("affiliate_24")}</p>
            <div className={styles["input-box"]}>
              <input
                type="text"
                readOnly
                value={
                  !token || !affiliateData
                    ? "-"
                    : process.env.NEXT_PUBLIC_URL +
                      "/af/" +
                      affiliateData.result.affiliate_code
                }
              ></input>
              {hydrated && (
                <CopyButton
                  copyValue={
                    affiliateData?.result.affiliate_code
                      ? process.env.NEXT_PUBLIC_URL +
                        "/af/" +
                        affiliateData.result.affiliate_code
                      : "nothing"
                  }
                  disabled={!token}
                />
              )}
            </div>
          </div>

          {hydrated && (
            <Link href="https://cdn.yummygame.io/file/Yummygame-Banner-Assets.zip">
              <span>{t("affiliate_26")}</span>
            </Link>
          )}
        </div>
        {checkMedia === "mobile" && hydrated && <pre>{t("affiliate_27")}</pre>}
      </div>
    </div>
  );
}
