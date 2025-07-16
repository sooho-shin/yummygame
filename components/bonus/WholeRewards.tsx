"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/bonus.module.scss";
import { useUserStore } from "@/stores/useUser";
import { useGetBonusClaim, useGetBonusStatisticsVer2 } from "@/querys/bonus";
import classNames from "classnames";
import useModalHook from "@/hooks/useModalHook";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGetCommon } from "@/querys/common";
import { formatNumber } from "@/utils";
import { useInterval } from "react-use";
import CommonEmptyData from "@/components/common/EmptyData";
import { useDictionary } from "@/context/DictionaryContext";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import { scroller } from "react-scroll";
import useCommonHook from "@/hooks/useCommonHook";
import { useCommonStore } from "@/stores/useCommon";
import { useSearchParams } from "next/navigation";

const WholeRewards = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token } = useUserStore();
  const { data, refetch } = useGetBonusStatisticsVer2(token);
  const { openModal } = useModalHook();
  const { mutate } = useGetBonusClaim();
  const { data: user } = useGetCommon(token);
  const t = useDictionary();
  dayjs.extend(utc);
  const { media } = useCommonStore();

  useEffect(() => {
    refetch();
  }, []);

  const searchParams = useSearchParams();
  const param = searchParams.get("special");

  useEffect(() => {
    if (hydrated && param === "true" && token && data) {
      scroller.scrollTo("special", {
        duration: 300,
        // 모바일 부분 확인 해야함 내일
        offset: -100,
        smooth: "easeInOutQuint",
      });
    }
  }, [hydrated, token, data, param]);

  return (
    <div className={styles["whole-rewards-container"]}>
      <h3 className={styles.title}>{t("bonus_74")}</h3>
      <div className={styles.row}>
        <div>
          <div className={styles.content}>
            <div className={styles.light}></div>

            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/jel.webp"}
              alt={"img bonus type"}
            />

            <p className={styles.subject}>{t("bonus_75")}</p>
            <div className={styles["info-box"]}>
              <div className={classNames(styles["info-row"])}>
                <span>{t("bonus_76")}</span>
                <div>
                  <span>
                    {formatNumber({
                      value:
                        data?.result?.general_rewards?.jel_rakeback?.jel ?? "0",
                    })}
                  </span>
                  <span>JEL</span>
                </div>
              </div>
              <button
                type={"button"}
                disabled={
                  !data?.result?.general_rewards?.jel_rakeback?.available_claim
                }
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
            </div>
          </div>
        </div>
        <div>
          <div className={classNames(styles.content, styles["coming-soon"])}>
            {/*<div className={styles.img}></div>*/}
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/spin.webp"}
              alt={"img bonus type"}
            />
            <p className={styles.subject}>Lucky Spin</p>
            <div className={styles["info-box"]}>
              <div className={classNames(styles["info-row"])}>
                <span>{t("bonus_78")}</span>
                <div>
                  <span>
                    Reach VIP {user?.result?.userInfo?.currentVipLevel ?? "1"}
                  </span>
                  {/*<span></span>*/}
                </div>
              </div>
              <div className={classNames(styles["info-row"])}>
                <span>{t("bonus_79")}</span>
                <div>
                  <span>$0 / $274,155</span>
                  {/*<span></span>*/}
                </div>
              </div>
              <button type={"button"} disabled={true}>
                <span>{t("bonus_80")}</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className={classNames(styles.content, styles["coming-soon"])}>
            {/*<div className={styles.img}></div>*/}
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/lottery.webp"}
              alt={"img bonus type"}
            />
            <p className={styles.subject}>Daily Lottery</p>
            <div className={styles["info-box"]}>
              <div className={classNames(styles["info-row"])}>
                <span>{t("bonus_81")}</span>
                <div>
                  <span>$0</span>
                  {/*<span></span>*/}
                </div>
              </div>
              <button type={"button"} disabled={true}>
                <span>{t("bonus_77")}</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className={classNames(styles.content, styles["coming-soon"])}>
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/quests.webp"}
              alt={"img bonus type"}
            />
            <p className={styles.subject}>{t("bonus_82")}</p>
            <div className={styles["info-box"]}>
              <div className={classNames(styles["info-row"])}>
                <span>{t("bonus_83")}</span>
                <div>
                  <span>0 / 3</span>
                  {/*<span></span>*/}
                </div>
              </div>
              <button type={"button"} disabled={true}>
                <span>{t("bonus_77")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*VIP*/}

      <h3 className={styles.title}>VIP Rewards</h3>
      <div className={styles.row}>
        <div>
          <div className={styles.content}>
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/level-up.webp"}
              alt={"img bonus type"}
            />
            <p className={styles.subject}>{t("bonus_84")}</p>
            <div className={styles["info-box"]}>
              <div className={classNames(styles["info-row"])}>
                <span>
                  {t("bonus_85")}{" "}
                  {data?.result?.vip_rewards?.level_up_rewards
                    ?.next_vip_level ?? "1"}
                  :
                </span>
                <div>
                  <span>
                    {formatNumber({
                      value:
                        data?.result?.vip_rewards?.level_up_rewards
                          ?.current_value ?? "0",
                    })}
                  </span>
                  <span>/</span>
                  <span className={styles.strong}>
                    {formatNumber({
                      value:
                        data?.result?.vip_rewards?.level_up_rewards
                          ?.goal_value ?? "1",
                    })}
                  </span>
                </div>
              </div>
              <button
                type={"button"}
                disabled={
                  !data?.result?.vip_rewards?.level_up_rewards?.available_claim
                }
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
                {data?.result?.vip_rewards?.level_up_rewards?.count &&
                data?.result?.vip_rewards?.level_up_rewards?.count > 0 ? (
                  <span className={styles.count}>
                    {data?.result?.vip_rewards?.level_up_rewards?.count}
                  </span>
                ) : (
                  <></>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.content}>
            {/*<div className={styles.img}></div>*/}
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/tier-up.webp"}
              alt={"img bonus type"}
            />
            <p className={styles.subject}>{t("bonus_86")}</p>
            <div className={styles["info-box"]}>
              <div className={classNames(styles["info-row"])}>
                <span>
                  {t("bonus_87")}{" "}
                  {data?.result?.vip_rewards?.tier_up_rewards?.next_vip_tier ??
                    "Bronze"}
                  :
                </span>
                <div>
                  <span>
                    {formatNumber({
                      value:
                        data?.result?.vip_rewards?.tier_up_rewards
                          ?.current_value ?? "0",
                    })}
                  </span>
                  <span>/</span>
                  <span className={styles.strong}>
                    {formatNumber({
                      value:
                        data?.result?.vip_rewards?.tier_up_rewards
                          ?.goal_value ?? "1",
                    })}
                  </span>
                </div>
              </div>
              <button
                type={"button"}
                disabled={
                  !data?.result?.vip_rewards?.tier_up_rewards?.available_claim
                }
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
                {data?.result?.vip_rewards?.tier_up_rewards?.count &&
                data?.result?.vip_rewards?.tier_up_rewards?.count > 0 ? (
                  <span className={styles.count}>
                    {data?.result?.vip_rewards?.tier_up_rewards?.count}
                  </span>
                ) : (
                  <></>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className={classNames(styles.content, styles["coming-soon"])}>
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/sweetener.webp"}
              alt={"img bonus type"}
            />

            <p className={styles.subject}>{t("bonus_88")}</p>
            <div className={styles["info-box"]}>
              <div className={styles["whole-container"]}>
                <div className={classNames(styles["info-row"])}>
                  <span>{t("bonus_89")}</span>
                  <div>
                    <span>
                      {user?.result?.userInfo?.currentVipGroup ?? "Iron"}
                    </span>
                    <span className={styles.box}>
                      {user?.result?.userInfo?.currentExperience ?? "0"}%
                    </span>
                  </div>
                </div>
                <div className={classNames(styles["info-row"])}>
                  <span>{t("bonus_90")}</span>
                  <div>
                    <span>
                      {user && user.result
                        ? formatNumber({
                            value: user.result.userInfo.currentUserWager,
                          })
                        : "0"}
                    </span>
                    <span>/</span>
                    <span className={styles.strong}>
                      {user && user.result
                        ? formatNumber({
                            value: (
                              Number(user.result.userInfo.currentUserWager) +
                              Number(user.result.userInfo.needLevelUpWager)
                            ).toString(),
                          })
                        : "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.content}>
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/weekly.webp"}
              alt={"img bonus type"}
            />
            <p className={styles.subject}>{t("bonus_91")}</p>
            <div className={styles["info-box"]}>
              {!data?.result?.vip_rewards?.weekly_cashback?.available ? (
                <div className={styles["whole-container"]}>
                  <div className={styles["lock-row"]}>
                    <LazyLoadImage
                      src={"/images/bonus/ico_lock.svg"}
                      alt={"ico lock"}
                    />
                    <span>{t("bonus_92")}</span>
                  </div>
                  <div className={styles["end-box"]}>
                    {data?.result?.vip_rewards?.weekly_cashback?.end_time && (
                      <EndDateBox
                        endDate={
                          data?.result?.vip_rewards?.weekly_cashback?.end_time
                        }
                      />
                    )}
                  </div>
                </div>
              ) : data?.result?.vip_rewards?.weekly_cashback
                  ?.available_claim ? (
                <>
                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_93")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.weekly_cashback?.wager ??
                            "0",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_94")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.weekly_cashback?.jel ??
                            "0",
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    type={"button"}
                    disabled={
                      !data?.result?.vip_rewards?.weekly_cashback
                        ?.available_claim
                    }
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
                    {data?.result?.vip_rewards?.weekly_cashback?.count &&
                    data?.result?.vip_rewards?.weekly_cashback?.count > 0 ? (
                      <span className={styles.count}>
                        {data?.result?.vip_rewards?.weekly_cashback?.count}
                      </span>
                    ) : (
                      <></>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_95")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.weekly_cashback?.wager ??
                            "0",
                        })}
                      </span>
                      <span>/</span>
                      <span className={styles.strong}>$1,000.00</span>
                    </div>
                  </div>
                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_94")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.weekly_cashback?.jel ??
                            "0",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className={classNames(styles["end-box"], styles.ma)}>
                    {data?.result?.vip_rewards?.weekly_cashback?.end_time && (
                      <EndDateBox
                        endDate={
                          data?.result?.vip_rewards?.weekly_cashback?.end_time
                        }
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className={styles.content}>
            <LazyLoadImage
              className={styles.img}
              src={"/images/bonus/monthly.webp"}
              alt={"img bonus type"}
            />
            <p className={styles.subject}>{t("bonus_96")}</p>
            <div className={styles["info-box"]}>
              {!data?.result?.vip_rewards?.monthly_cashback?.available ? (
                <div className={styles["whole-container"]}>
                  <div className={styles["lock-row"]}>
                    <LazyLoadImage
                      src={"/images/bonus/ico_lock.svg"}
                      alt={"ico lock"}
                    />
                    <span>{t("bonus_97")}</span>
                  </div>
                  <div className={styles["end-box"]}>
                    {data?.result?.vip_rewards?.monthly_cashback?.end_time && (
                      <EndDateBox
                        endDate={
                          data?.result?.vip_rewards?.monthly_cashback?.end_time
                        }
                      />
                    )}
                  </div>
                </div>
              ) : data?.result?.vip_rewards?.monthly_cashback
                  ?.available_claim ? (
                <>
                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_93")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.monthly_cashback
                              ?.wager ?? "0",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_94")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.monthly_cashback?.jel ??
                            "0",
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    type={"button"}
                    disabled={
                      !data?.result?.vip_rewards?.monthly_cashback
                        ?.available_claim
                    }
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
                    {data?.result?.vip_rewards?.monthly_cashback?.count &&
                    data?.result?.vip_rewards?.monthly_cashback?.count > 0 ? (
                      <span className={styles.count}>
                        {data?.result?.vip_rewards?.monthly_cashback?.count}
                      </span>
                    ) : (
                      <></>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_95")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.monthly_cashback
                              ?.wager ?? "0",
                        })}
                      </span>
                      <span>/</span>
                      <span className={styles.strong}>$10,000.00</span>
                    </div>
                  </div>

                  <div className={classNames(styles["info-row"])}>
                    <span>{t("bonus_94")}</span>
                    <div>
                      <span>
                        $
                        {formatNumber({
                          value:
                            data?.result?.vip_rewards?.monthly_cashback?.jel ??
                            "0",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className={classNames(styles["end-box"], styles.ma)}>
                    {data?.result?.vip_rewards?.monthly_cashback?.end_time && (
                      <EndDateBox
                        endDate={
                          data?.result?.vip_rewards?.monthly_cashback?.end_time
                        }
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {data?.result &&
        Object.keys(data?.result?.special_rewards).length !== 0 && (
          <h3 className={styles.title} id="special">
            {t("bonus_98")}
          </h3>
        )}
      <div className={styles.row}>
        {data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK && (
          <div>
            <div className={styles.content}>
              <CountDownBatGe
                targetDate={
                  data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                    ?.active_end_date
                }
              />
              <button
                type={"button"}
                className={styles.tooltip}
                onClick={() => {
                  openModal({
                    type: "alert",
                    alertData: {
                      title: t("bonus_154", [
                        data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                          ?.data.payback || "",
                      ]),
                      children: (
                        <pre>
                          {t("bonus_155", [
                            data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                              ?.data.minimum
                              ? formatNumber({
                                  value:
                                    data?.result?.special_rewards
                                      .SP_EVT_WEEKLY_PAYBACK?.data.minimum,
                                })
                              : "",
                          ])}
                        </pre>
                      ),
                    },
                  });
                }}
              ></button>
              <LazyLoadImage
                className={styles.img}
                src={"/images/bonus/payback.webp"}
                alt={"img bonus type"}
              />
              <p className={styles.subject}>
                {t("bonus_145", [
                  data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK?.data
                    .payback || "",
                ])}
              </p>
              <div className={styles["info-box"]}>
                <pre className={styles.text}>
                  {t("bonus_146", [
                    data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK?.data
                      .payback || "",
                    data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK?.data
                      .minimum
                      ? formatNumber({
                          value:
                            data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                              ?.data.minimum,
                        })
                      : "",
                    data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK?.data
                      .maxPayback
                      ? formatNumber({
                          value:
                            data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                              ?.data.maxPayback,
                        })
                      : "",
                  ])}
                </pre>
                {data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                  ?.available_claim ? ( //여기부터
                  <button
                    type={"button"}
                    disabled={
                      !data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                        ?.available_claim
                    }
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
                    {data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                      .count &&
                    data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK.count >
                      0 ? (
                      <span className={styles.count}>
                        {
                          data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                            .count
                        }
                      </span>
                    ) : (
                      <></>
                    )}
                  </button>
                ) : (
                  <p className={styles["end-date-box"]}>
                    {
                      <EndDateBox
                        endDate={
                          data?.result?.special_rewards.SP_EVT_WEEKLY_PAYBACK
                            ?.end_time || ""
                        }
                      />
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {data?.result?.special_rewards.SP_EVT_CASHBACK_ALL && (
          <div>
            <div className={styles.content}>
              <CountDownBatGe
                targetDate={
                  data?.result?.special_rewards.SP_EVT_CASHBACK_ALL
                    .active_end_date
                }
              />
              <LazyLoadImage
                className={styles.img}
                src={"/images/bonus/img_bonus_cashback.webp"}
                alt={"img bonus type"}
              />
              <p className={styles.subject}>{t("bonus_142")}</p>
              <div className={styles["info-box"]}>
                <p className={styles.text}>
                  {t("bonus_143", [
                    data?.result?.special_rewards.SP_EVT_CASHBACK_ALL.data
                      .times || "",
                  ])}
                </p>
                <p className={styles["already-active-box"]}>{t("bonus_144")}</p>
              </div>
            </div>
          </div>
        )}

        {data?.result?.special_rewards.SP_EVT_FIRST_DEPOSIT && (
          <div>
            <div className={styles.content}>
              <CountDownBatGe
                targetDate={
                  data?.result?.special_rewards.SP_EVT_FIRST_DEPOSIT
                    .active_end_date
                }
              />
              <LazyLoadImage
                className={styles.img}
                src={"/images/bonus/img_bonus_newyear.webp"}
                alt={"img bonus type"}
                // style={{ marginTop: 0 }}
              />
              <pre className={styles.subject}>
                {t("bonus_147", [
                  data?.result?.special_rewards.SP_EVT_FIRST_DEPOSIT.data.bonus,
                ])}
              </pre>
              <div className={styles["info-box"]}>
                <pre className={styles.text}>
                  {t("bonus_148", [
                    data?.result?.special_rewards.SP_EVT_FIRST_DEPOSIT.data
                      .bonus,
                  ])}
                </pre>
                <button
                  type={"button"}
                  onClick={() =>
                    openModal({
                      type: "redeem",
                    })
                  }
                >
                  <span>{t("bonus_149")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {data?.result?.special_rewards.SP_EVT_DEPOSIT_BONUS && (
          <div>
            <div className={styles.content}>
              <CountDownBatGe
                targetDate={
                  data?.result?.special_rewards.SP_EVT_DEPOSIT_BONUS
                    .active_end_date
                }
              />
              <LazyLoadImage
                className={styles.img}
                src={"/images/bonus/img_bonus_lucky7.webp"}
                alt={"img bonus type"}
                // style={{ marginTop: 0 }}
              />
              <pre className={styles.subject}>
                {t("bonus_150", [
                  data?.result?.special_rewards.SP_EVT_DEPOSIT_BONUS.data
                    .bonus || "",
                ])}
              </pre>
              <div className={styles["info-box"]}>
                <pre className={styles.text}>
                  {t("bonus_151", [
                    data?.result?.special_rewards.SP_EVT_DEPOSIT_BONUS.data
                      .rolling || "",
                  ])}
                </pre>
                <button
                  type={"button"}
                  onClick={() =>
                    openModal({
                      type: "redeem",
                    })
                  }
                >
                  <span>{t("bonus_149")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {(data?.result?.special_rewards.SP_EVT_NONE_DEPOSIT ||
        data?.result?.special_rewards.SP_EVT_LUCKY_POUCH) && (
        <div className={styles.row}>
          {data?.result?.special_rewards.SP_EVT_NONE_DEPOSIT && (
            <div>
              <div className={styles.content}>
                <CountDownBatGe
                  targetDate={
                    data?.result?.special_rewards.SP_EVT_NONE_DEPOSIT
                      .active_end_date
                  }
                />
                <LazyLoadImage
                  className={styles.img}
                  src={"/images/bonus/noDeposit.webp"}
                  alt={"img bonus type"}
                  style={{ marginTop: 0 }}
                />
                <pre className={styles.subject}>{t("bonus_152")}</pre>
                <div className={styles["info-box"]}>
                  <pre className={styles.text}>
                    {t("bonus_153", [
                      data?.result?.special_rewards.SP_EVT_NONE_DEPOSIT.data
                        .bonus || "0",
                    ])}
                  </pre>
                  <button
                    type={"button"}
                    onClick={() =>
                      openModal({
                        type: "redeem",
                      })
                    }
                  >
                    <span>{t("bonus_149")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {data?.result?.special_rewards.SP_EVT_LUCKY_POUCH && (
            <div>
              <div className={styles.content}>
                <CountDownBatGe
                  targetDate={
                    data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                      .active_end_date
                  }
                />
                <button
                  type={"button"}
                  className={styles.tooltip}
                  onClick={() => {
                    openModal({
                      type: "alert",
                      alertData: {
                        title: t("bonus_160"),
                        children: (
                          <pre>
                            {t("bonus_159", [
                              data?.result?.special_rewards
                                .SP_EVT_WEEKLY_PAYBACK?.data.minimum
                                ? formatNumber({
                                    value:
                                      data?.result?.special_rewards
                                        .SP_EVT_WEEKLY_PAYBACK?.data.minimum,
                                  })
                                : "",
                            ])}
                          </pre>
                        ),
                      },
                    });
                  }}
                ></button>
                <LazyLoadImage
                  className={styles.img}
                  src={"/images/bonus/img_bonus_lucky_pouch.webp"}
                  alt={"img bonus type"}
                  style={{ marginTop: 0 }}
                />
                <pre className={styles.subject}>{t("bonus_164")}</pre>
                <div className={styles["info-box"]}>
                  <pre className={styles.text}>{t("bonus_161")}</pre>
                  {!data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                    ?.available_claim &&
                  !data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                    ?.available_deposit ? (
                    <p className={styles["end-date-box"]}>
                      {
                        <EndDateBox
                          endDate={
                            data?.result?.special_rewards.SP_EVT_LUCKY_POUCH
                              ?.end_date || ""
                          }
                          reset={true}
                        />
                      }
                    </p>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CountDownBatGe = ({ targetDate }: { targetDate: string | undefined }) => {
  const t = useDictionary();

  function getStatusByDate(targetDate: string): {
    text: string;
    className: "d-day" | "d-1" | "d-10" | "d-30" | "d-60" | "end";
  } {
    dayjs.extend(utc);
    // targetDate = "2024-11-28T00:00:00.000Z";

    const now = dayjs().utc().startOf("day"); // 현재 UTC 시간
    const cTargetDate = dayjs.utc(targetDate).startOf("day"); // 목표 UTC 날짜

    const target = dayjs(cTargetDate).utc(); // 목표 날짜 (UTC 기준)
    const daysRemaining = target.diff(now, "day"); // 남은 일수 계산

    switch (true) {
      case daysRemaining < 0:
        return { text: t("bonus_156"), className: "end" };
      case daysRemaining < 1:
        return { text: "D-Day", className: "d-day" };
      case daysRemaining <= 9:
        return { text: `D-${daysRemaining}`, className: "d-1" };
      case daysRemaining <= 29:
        return { text: `D-${daysRemaining}`, className: "d-10" };
      case daysRemaining <= 59:
        return { text: `D-${daysRemaining}`, className: "d-30" };
      case daysRemaining <= 90:
        return { text: `D-${daysRemaining}`, className: "d-60" };
      default:
        return { text: t("bonus_156"), className: "end" };
    }
  }

  if (!targetDate) return <></>;
  return (
    <div
      className={classNames(
        styles["countdown-badge"],
        styles[getStatusByDate(targetDate).className],
      )}
    >
      <span>{getStatusByDate(targetDate).text}</span>
    </div>
  );
};

const EndDateBox = ({
  endDate,
  reset = false,
}: {
  endDate: string;
  reset?: boolean;
}) => {
  dayjs.extend(utc);
  const t = useDictionary();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const targetDate = dayjs(endDate);

  function updateCountdown() {
    const now = dayjs();
    const diff = targetDate.diff(now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setDays(days);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }

  useInterval(() => {
    updateCountdown();
  }, 1000);
  // t("modal_443", [get_point, asset_type])
  if (reset) {
    return (
      <>
        {days > 0
          ? t("bonus_158", [
              days.toString(),
              hours.toString(),
              minutes.toString(),
            ])
          : t("bonus_158", [
              hours.toString(),
              minutes.toString(),
              seconds.toString(),
            ])}
      </>
    );
  }
  return (
    <>
      {days > 0
        ? t("bonus_100", [
            days.toString(),
            hours.toString(),
            minutes.toString(),
          ])
        : t("bonus_101", [
            hours.toString(),
            minutes.toString(),
            seconds.toString(),
          ])}
    </>
  );
};

export default WholeRewards;
