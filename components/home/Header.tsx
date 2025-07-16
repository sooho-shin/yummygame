"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./styles//header.module.scss";
import LoginButton from "./LoginButton";
import AssetBox from "./AssetBox";
import { useUserStore } from "@/stores/useUser";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
// import { useStompStore } from "@/stores/useStomp";
import { useCommonStore } from "@/stores/useCommon";
import { usePathname, useRouter } from "next/navigation";
import { useWindowScroll, useInterval, useClickAway } from "react-use";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useCommonHook from "@/hooks/useCommonHook";
import { useDictionary } from "@/context/DictionaryContext";
import classNames from "classnames";
import { scroller } from "react-scroll";
import VersionToggle from "./VersionToggle";
import useModalHook from "@/hooks/useModalHook";
import { useGetCommon } from "@/querys/common";
import { motion } from "framer-motion";
import {
  useGetBonusClaim,
  useGetBonusClaimCount,
  useGetBonusStatisticsVer2,
} from "@/querys/bonus";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { customConsole, formatNumber } from "@/utils";

export default function Header() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  const t = useDictionary();

  const { setIsShowChat, setIsShowNotice, isShowChat, isShowNotice } =
    useCommonStore();
  const { openModal } = useModalHook();
  const [cookies] = useCookies();

  const { token } = useUserStore();
  useEffect(() => {
    customConsole("store token === ", token);
  }, [token]);
  useEffect(() => {
    customConsole("cookies token === ", cookies.token);
  }, [cookies]);
  const { data: user } = useGetCommon(token);

  const { swipeState, setSwipeState } = useCommonStore();

  const { checkMedia, isTopBanner, showToast } = useCommonHook();

  const [rollingState, setRollingState] = useState(0);

  useEffect(() => {
    if (user && user?.result?.isExistDirectMessage) {
      showToast(t("toast_15"));
    }
  }, [user, user?.result?.isExistDirectMessage]);

  useInterval(() => {
    if (rollingState === 0) {
      setRollingState(1);
    } else {
      setRollingState(0);
    }
  }, 3000);

  // useEffect(() => {
  //   setTimeout(() => {
  //     openModal({ type: "redeem" });
  //   }, 1000);
  //   setTimeout(() => {
  //     openModal({ type: "getstarted" });
  //   }, 3000);
  // }, [openModal]);

  return (
    <>
      <header
        className={styles.header}
        style={{ top: isTopBanner ? "34px" : "0" }}
      >
        {((checkMedia === "mobile" && !token) || checkMedia !== "mobile") &&
          hydrated && (
            <div className={styles.left}>
              <button
                type="button"
                className={`${styles.menu} ${swipeState ? styles.open : ""}`}
                onClick={() => setSwipeState(!swipeState)}
              ></button>
              {/*{checkMedia !== "mobile" && <VersionToggle />}*/}
              <Link
                href={`/`}
                className={classNames(styles.logo, {
                  [styles["not-login"]]: !token,
                })}
              ></Link>
            </div>
          )}
        {checkMedia === "mobile" && token && hydrated && (
          <div className={styles.left}>
            <Link href={`/`} className={classNames(styles.logo)}></Link>
          </div>
        )}
        <AssetBox />

        <ul>
          {token && hydrated && (
            <>
              <li>
                <GiftBox />
              </li>
              {checkMedia !== "mobile" && (
                <li>
                  <button
                    type="button"
                    className={styles.message}
                    onClick={() => {
                      openModal({ type: "directMassage" });
                    }}
                  >
                    {user && user.result?.isExistDirectMessage && (
                      <div className={styles.new}>
                        <span></span>
                      </div>
                    )}
                  </button>
                </li>
              )}
            </>
          )}
          {!(token && checkMedia === "mobile") && hydrated && (
            <li>
              <button
                type="button"
                className={`${styles.notice} ${
                  isShowNotice ? styles.active : ""
                }`}
                onClick={() => {
                  const freshDesk = document.getElementById("fc_frame");
                  if (freshDesk?.style.right) {
                    setIsShowNotice(!isShowNotice);
                    setIsShowChat(false);
                  }
                }}
              >
                {cookies.newNotice && hydrated && (
                  <div className={styles.new}>
                    <span></span>
                  </div>
                )}
              </button>
            </li>
          )}
          <li>
            <LoginButton />
          </li>
        </ul>
      </header>
    </>
  );
}

const GiftBox = () => {
  const { openModal, isOpen } = useModalHook();
  const { token } = useUserStore();
  const { data, refetch } = useGetBonusStatisticsVer2(token);
  const { mutate } = useGetBonusClaim();
  const router = useRouter();

  const [dropDownState, setDropDownState] = useState(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  const t = useDictionary();

  const { data: countData } = useGetBonusClaimCount(token);

  useEffect(() => {
    if (dropDownState) {
      refetch();
    }
  }, [dropDownState]);

  useClickAway(dropboxRef, () => {
    if (!isOpen) {
      setDropDownState(false);
    }
  });
  const count = useMemo(() => {
    if (countData && data?.result) {
      return (
        Number(countData?.result) +
        (data?.result?.special_rewards.SP_EVT_LUCKY_POUCH?.available_deposit
          ? 1
          : 0)
      );
    } else {
      return 0;
    }
  }, [countData, data]);

  // useEffect(() => {
  //   console.log("count === ", count);
  // }, [count]);

  useEffect(() => {
    if (count === 0) {
      setDropDownState(false);
    }
  }, [count]);

  if (!data || !data.result) return <></>;

  return (
    <div className={styles.gift} ref={dropboxRef}>
      <button
        type={"button"}
        className={classNames({ [styles.active]: dropDownState })}
        onClick={() => {
          count > 0 ? setDropDownState(!dropDownState) : router.push("/bonus");
        }}
      >
        {count > 0 && (
          <div className={styles.new}>
            {count > 0 && <span>{count > 9 ? `9+` : count}</span>}
          </div>
        )}
      </button>

      <motion.div
        className={styles.dropbox}
        initial={{ height: 0, opacity: 0, marginTop: 0 }}
        animate={{
          height: dropDownState ? "auto" : 0,
          opacity: dropDownState ? 1 : 0,
          // marginTop: dropDownState ? 16 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={styles.scroll}>
          <ul>
            {data?.result?.general_rewards?.jel_rakeback?.available_claim && (
              <li>
                <LazyLoadImage
                  src={"/images/bonus/jel.webp"}
                  alt={"img bonus type"}
                />

                <div className={styles["info-row"]}>
                  <span>{t("bonus_75")}</span>
                  <span>
                    +
                    {formatNumber({
                      value: data?.result?.general_rewards?.jel_rakeback?.jel,
                      maxDigits: 2,
                    })}{" "}
                    JEL
                  </span>
                </div>
                <button
                  type={"button"}
                  onClick={() =>
                    mutate(
                      { bonusType: "RAKEBACK" },
                      {
                        onSuccess: data => {
                          openModal({
                            type: "claimBonus",
                            props: {
                              claimType: "RAKEBACK",
                              claimedJel: data.result.jel,
                            },
                          });
                        },
                      },
                    )
                  }
                >
                  <span>{t("bonus_77")}</span>
                </button>
              </li>
            )}

            {data?.result?.vip_rewards?.level_up_rewards?.available_claim && (
              <li>
                <LazyLoadImage
                  src={"/images/bonus/level-up.webp"}
                  alt={"img bonus type"}
                />

                <div className={styles["info-row"]}>
                  <span>{t("bonus_84")}</span>
                  <span>
                    +
                    {formatNumber({
                      value: data?.result?.vip_rewards?.level_up_rewards.jel,
                      maxDigits: 2,
                    })}{" "}
                    JEL
                  </span>
                </div>

                {data?.result?.vip_rewards?.level_up_rewards?.count &&
                data?.result?.vip_rewards?.level_up_rewards?.count > 0 ? (
                  <div className={styles.count}>
                    <span>
                      {data?.result?.vip_rewards?.level_up_rewards?.count}
                    </span>
                  </div>
                ) : (
                  <></>
                )}
                <button
                  type={"button"}
                  onClick={() =>
                    mutate(
                      { bonusType: "LEVELUP" },
                      {
                        onSuccess: data => {
                          openModal({
                            type: "claimBonus",
                            props: {
                              claimType: "LEVELUP",
                              claimedJel: data.result.jel,
                            },
                          });
                        },
                      },
                    )
                  }
                >
                  <span>{t("bonus_77")}</span>
                </button>
              </li>
            )}

            {data?.result?.vip_rewards?.tier_up_rewards?.available_claim && (
              <li>
                <LazyLoadImage
                  src={"/images/bonus/tier-up.webp"}
                  alt={"img bonus type"}
                />

                <div className={styles["info-row"]}>
                  <span>{t("bonus_86")}</span>
                  <span>
                    +
                    {formatNumber({
                      value: data?.result?.vip_rewards?.tier_up_rewards.jel,
                      maxDigits: 2,
                    })}{" "}
                    JEL
                  </span>
                </div>

                {data?.result?.vip_rewards?.tier_up_rewards?.count &&
                data?.result?.vip_rewards?.tier_up_rewards?.count > 0 ? (
                  <div className={styles.count}>
                    <span>
                      {data?.result?.vip_rewards?.tier_up_rewards?.count}
                    </span>
                  </div>
                ) : (
                  <></>
                )}
                <button
                  type={"button"}
                  onClick={() =>
                    mutate(
                      { bonusType: "TIERUP" },
                      {
                        onSuccess: data => {
                          openModal({
                            type: "claimBonus",
                            props: {
                              claimType: "TIERUP",
                              claimedJel: data.result.jel,
                            },
                          });
                        },
                      },
                    )
                  }
                >
                  <span>{t("bonus_77")}</span>
                </button>
              </li>
            )}

            {data?.result?.vip_rewards?.weekly_cashback?.available_claim && (
              <li>
                <LazyLoadImage
                  src={"/images/bonus/weekly.webp"}
                  alt={"img bonus type"}
                />

                <div className={styles["info-row"]}>
                  <span>{t("bonus_91")}</span>
                  <span>
                    +
                    {formatNumber({
                      value: data?.result?.vip_rewards?.weekly_cashback.jel,
                      maxDigits: 2,
                    })}{" "}
                    JEL
                  </span>
                </div>

                {data?.result?.vip_rewards?.weekly_cashback?.count &&
                data?.result?.vip_rewards?.weekly_cashback?.count > 0 ? (
                  <div className={styles.count}>
                    <span>
                      {data?.result?.vip_rewards?.weekly_cashback?.count}
                    </span>
                  </div>
                ) : (
                  <></>
                )}
                <button
                  type={"button"}
                  onClick={() =>
                    mutate(
                      { bonusType: "WEEKLY" },
                      {
                        onSuccess: data => {
                          openModal({
                            type: "claimBonus",
                            props: {
                              claimType: "WEEKLY",
                              claimedJel: data.result.jel,
                            },
                          });
                        },
                      },
                    )
                  }
                >
                  <span>{t("bonus_77")}</span>
                </button>
              </li>
            )}

            {data?.result?.vip_rewards?.monthly_cashback?.available_claim && (
              <li>
                <LazyLoadImage
                  src={"/images/bonus/monthly.webp"}
                  alt={"img bonus type"}
                />

                <div className={styles["info-row"]}>
                  <span>{t("bonus_96")}</span>
                  <span>
                    +
                    {formatNumber({
                      value: data?.result?.vip_rewards?.monthly_cashback.jel,
                      maxDigits: 2,
                    })}{" "}
                    JEL
                  </span>
                </div>

                {data?.result?.vip_rewards?.monthly_cashback?.count &&
                data?.result?.vip_rewards?.monthly_cashback?.count > 0 ? (
                  <div className={styles.count}>
                    <span>
                      {data?.result?.vip_rewards?.monthly_cashback?.count}
                    </span>
                  </div>
                ) : (
                  <></>
                )}
                <button
                  type={"button"}
                  onClick={() =>
                    mutate(
                      { bonusType: "MONTHLY" },
                      {
                        onSuccess: data => {
                          openModal({
                            type: "claimBonus",
                            props: {
                              claimType: "MONTHLY",
                              claimedJel: data.result.jel,
                            },
                          });
                        },
                      },
                    )
                  }
                >
                  <span>{t("bonus_77")}</span>
                </button>
              </li>
            )}

            {data?.result?.special_rewards?.SP_EVT_WEEKLY_PAYBACK
              ?.available_claim && (
              <li>
                <LazyLoadImage
                  src={"/images/bonus/payback.webp"}
                  alt={"img bonus type"}
                />

                <div className={styles["info-row"]}>
                  <span>
                    {t("bonus_145", [
                      data?.result?.special_rewards?.SP_EVT_WEEKLY_PAYBACK.data
                        .payback,
                    ])}
                  </span>
                </div>

                {data?.result?.special_rewards?.SP_EVT_WEEKLY_PAYBACK?.count &&
                data?.result?.special_rewards?.SP_EVT_WEEKLY_PAYBACK?.count >
                  0 ? (
                  <div className={styles.count}>
                    <span>
                      {
                        data?.result?.special_rewards?.SP_EVT_WEEKLY_PAYBACK
                          ?.count
                      }
                    </span>
                  </div>
                ) : (
                  <></>
                )}
                <button
                  type={"button"}
                  onClick={() =>
                    mutate(
                      { bonusType: "SP_EVT_WEEKLY_PAYBACK" },
                      {
                        onSuccess: data => {
                          openModal({
                            type: "claimBonus",
                            props: {
                              claimType: "SP_EVT_WEEKLY_PAYBACK",
                              claimedJel: data.result.jel,
                            },
                          });
                        },
                      },
                    )
                  }
                >
                  <span>{t("bonus_77")}</span>
                </button>
              </li>
            )}
            {!(
              !data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                ?.available_claim &&
              !data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                ?.available_deposit
            ) && (
              <li>
                <LazyLoadImage
                  src={"/images/bonus/img_bonus_lucky_pouch.webp"}
                  alt={"img bonus type"}
                />

                <div className={styles["info-row"]}>
                  <span>{t("bonus_162")}</span>
                  <span>{t("bonus_163")}</span>
                </div>

                {data?.result?.special_rewards?.SP_EVT_LUCKY_POUCH?.count &&
                data?.result?.special_rewards?.SP_EVT_LUCKY_POUCH?.count > 0 ? (
                  <div className={styles.count}>
                    <span>
                      {data?.result?.special_rewards?.SP_EVT_LUCKY_POUCH?.count}
                    </span>
                  </div>
                ) : (
                  <></>
                )}
                <button
                  type={"button"}
                  onClick={() => {
                    if (
                      data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                        ?.available_deposit
                    ) {
                      openModal({
                        type: "wallet",
                      });
                    } else {
                      mutate(
                        { bonusType: "SP_EVT_LUCKY_POUCH" },
                        {
                          onSuccess: data => {
                            openModal({
                              type: "claimBonus",
                              props: {
                                claimType: "SP_EVT_LUCKY_POUCH",
                                claimedJel: data.result.jel,
                              },
                            });
                          },
                        },
                      );
                    }
                  }}
                >
                  <span>
                    {data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                      .available_deposit
                      ? t("main_47")
                      : t("main_55")}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>
        <Link href={"/bonus"}>
          <span>{t("bonus_139")}</span>
        </Link>
      </motion.div>
    </div>
  );
};
