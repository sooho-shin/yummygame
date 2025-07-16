"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetCryptoUsd } from "@/querys/common";
import { formatNumber } from "@/utils";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles/footer.module.scss";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCommonStore } from "@/stores/useCommon";
import LicenceBox from "@/components/common/LicenceBox";
import classNames from "classnames";

export default function Footer() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { data } = useGetCryptoUsd();
  const { checkMedia } = useCommonHook();
  const t = useDictionary();

  const { box } = LicenceBox();
  const pathname = usePathname();

  // const handleLinkClick = (event: Event) => {
  //   event.preventDefault();
  //   // 여기서 추가적인 로직을 수행할 수 있습니다.
  // };
  // useEffect(() => {
  //   const aTag = divRef.current?.querySelector<HTMLAnchorElement>("a");
  //
  //   const handleLinkClick = (event: MouseEvent) => {
  //     event.preventDefault();
  //   };
  //
  //   if (aTag) {
  //     aTag.addEventListener("click", handleLinkClick);
  //   }
  //
  //   // Clean up the event listener on component unmount
  //   return () => {
  //     if (aTag) {
  //       aTag.removeEventListener("click", handleLinkClick);
  //     }
  //   };
  // }, []);

  return (
    <footer className={classNames(styles["footer-wrapper"])}>
      <div className={styles["link-group"]}>
        <div className={styles.box}>
          <p className={styles.top}>{t("common_2")}</p>
          <div className={styles.group}>
            <Link href={`/game/crash`}>{t("common_3")}</Link>
            <Link href={`/game/plinko`}>{t("game_69")}</Link>
            <Link href={`/game/wheel`}>{t("common_4")}</Link>
            <Link href={`/game/roulette`}>{t("common_8")}</Link>
            <Link href={`/game/flip`}>{t("common_5")}</Link>
            <Link href={`/game/dice`}>{t("common_6")}</Link>
            <Link href={`/game/ultimatedice`}>{t("common_7")}</Link>
            <Link href={`/game/mine`}>{t("common_9")}</Link>
            <Link href={`/game/limbo`}>{t("game_74")}</Link>
          </div>
        </div>
        <div className={styles.box}>
          <p className={styles.top}>{t("common_10")}</p>
          <div className={styles.group}>
            <Link href={`/provider/slots`}>{t("common_11")}</Link>
            <Link href={`/provider/livecasino`}>{t("common_12")}</Link>
            <Link href={`/provider/card`}>{t("common_13")}</Link>
            <Link href={`/provider/poker`}>{t("common_14")}</Link>
            <Link href={`/provider/providerroulette`}>{t("common_16")}</Link>
          </div>
        </div>
        <div className={styles.box}>
          <p className={styles.top}>{t("common_17")}</p>

          <div className={styles.group}>
            <Link href={`/bonus`}>{t("common_18")}</Link>
            <Link href={`/affiliate`}>{t("common_19")}</Link>
          </div>

          {checkMedia !== "desktop" && hydrated && (
            <>
              <p className={styles.top}>{t("common_20")}</p>
              <div className={styles.group}>
                <a
                  href="https://help.yummygame.io/support/solutions/153000051588"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("common_21")}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (window.fcWidget) {
                      window.fcWidget.open();
                    }
                  }}
                >
                  {t("common_22")}
                </button>
                <a
                  href="https://drive.google.com/drive/folders/1FBPY6CMnuWL93hHzgOCsJMYBx5ckt8Nl?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("common_58")}
                </a>
              </div>
            </>
          )}
        </div>
        <div className={styles.box}>
          <p className={styles.top}>{t("common_23")}</p>
          <div className={styles.group}>
            <Link href={`/policies`}>{t("common_24")}</Link>
            <Link href={`/policies/gamble`}>{t("common_25")}</Link>
            <Link href={`/policies/aml`}>{t("common_26")}</Link>
            <Link href={`/policies/underage`}>{t("common_27")}</Link>
            <Link href={`/policies/responsible`}>{t("common_28")}</Link>
            <Link href={`/policies/kyc`}>{t("common_29")}</Link>
            <Link href={`/policies/exclusion`}>{t("common_30")}</Link>
            <Link href={`/policies/privacy`}>{t("common_31")}</Link>
            <Link href={`/policies/bonus`}>{t("common_48")}</Link>
            <Link href={`/policies/betting`}>{t("common_49")}</Link>
            <Link href={`/policies/sportsbook`}>{t("common_57")}</Link>
            <Link href={`/fairness`}>{t("common_50")}</Link>
          </div>
        </div>

        {checkMedia === "desktop" && hydrated && (
          <div className={styles.box}>
            <p className={styles.top}>{t("common_32")}</p>
            <div className={styles.group}>
              <>
                <a
                  href="https://help.yummygame.io/support/solutions/153000051588"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("common_32")}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (window.fcWidget) {
                      window.fcWidget.open();
                    }
                  }}
                >
                  {t("common_33")}
                </button>
              </>

              <a
                href="https://drive.google.com/drive/folders/1FBPY6CMnuWL93hHzgOCsJMYBx5ckt8Nl?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                {t("common_58")}
              </a>
            </div>
          </div>
        )}
      </div>

      {/*<div className={styles["partner-group"]}>*/}
      {/*  <div>*/}
      {/*    {Array.from({ length: 12 }).map((c, i) => {*/}
      {/*      return (*/}
      {/*        <div key={i}>*/}
      {/*          <LazyLoadImage*/}
      {/*            alt={"img"}*/}
      {/*            src={"/images/footer/partner_" + (i + 1) + ".webp"}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className={styles["crypto-group"]}>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage src="/images/footer/bit.png" alt="img crypto" />
        </a>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage src="/images/footer/eth.png" alt="img crypto" />
        </a>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage src="/images/footer/bnb.png" alt="img crypto" />
        </a>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage src="/images/footer/the.png" alt="img crypto" />
        </a>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage src="/images/footer/rip.png" alt="img crypto" />
        </a>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage src="/images/footer/cir.png" alt="img crypto" />
        </a>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage
            src="/images/footer/tron.png"
            alt="img crypto"
            style={{ width: "69px" }}
          />
        </a>
        <a
          href="https://accounts.binance.com/register?ref=810613245"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage
            src="/images/footer/solana.png"
            alt="img crypto"
            style={{ width: "96px" }}
          />
        </a>
      </div>
      <div className={styles["crypto-group"]}>
        <a
          href="https://www.gamblingtherapy.org/"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage
            src="/images/footer/gordon_moody.png"
            alt="img crypto"
          />
        </a>
        <a
          href="https://www.gamblersanonymous.org.uk/"
          target="_blank"
          rel="noreferrer"
        >
          <LazyLoadImage src="/images/footer/ga.png" alt="img crypto" />
        </a>
      </div>

      <div className={styles["bottom-group"]}>
        <div className={styles["logo-group"]}>
          <LazyLoadImage
            src="/images/common/img_logo_b.webp"
            alt="img logo black"
            width={"100%"}
            // height={"100%"}
          />
          <div className={styles["sns-group"]}>
            <a
              href="https://t.me/yummygame_global"
              className={styles.telegram}
              rel="noreferrer"
              target="_blank"
            ></a>
            <a
              href="https://www.instagram.com/yummygameofficial"
              className={styles.instagram}
              rel="noreferrer"
              target="_blank"
            ></a>
            <a
              href="https://www.facebook.com/yummygameOfficial"
              className={styles.facebook}
              target="_blank"
              rel="noreferrer"
            />
            <a
              href="https://x.com/YummygameCasino"
              className={styles.twitter}
              target="_blank"
              rel="noreferrer"
            ></a>
            <a
              href="https://medium.com/@yummygame"
              className={styles.medium}
              target="_blank"
              rel="noreferrer"
            ></a>
            <a
              href="https://bitcointalk.org/index.php?topic=5476032.msg63245088#msg63245088"
              className={styles.forum}
              target="_blank"
              rel="noreferrer"
            ></a>
            <a
              href="https://www.youtube.com/@yummygameOfficial"
              className={styles.youtube}
              target="_blank"
              rel="noreferrer"
            ></a>
          </div>
        </div>
        <div className={styles["text-group"]}>
          <div>
            <div className={styles["link-group"]}>
              <Link href="/policies/underage" className={styles.age}>
                18+
              </Link>
              {box}
            </div>
            <pre className={styles.text}>{t("common_46")}</pre>
          </div>
          <div>
            <pre className={styles.text}>
              {t("common_47")}
              <a
                href="mailto:support@yummygame.io"
                target="_blank"
                rel="noreferrer"
              >
                support@yummygame.io.
              </a>{" "}
              © 2023 Yummygame. All rights reserved
            </pre>
          </div>
          <div>
            <div className={styles["exchange-box"]}>
              <span></span>
              <span>
                1 BTC = $
                {data
                  ? formatNumber({
                      value: data?.result.cryptoToFiat.btc.usd,
                      maxDigits: 7,
                    })
                  : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
