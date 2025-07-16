"use client";

import React, { useMemo, useState } from "react";
import styles from "./styles/bonus.module.scss";
import { useUserStore } from "@/stores/useUser";
import { useGetBonusStatisticsVer2 } from "@/querys/bonus";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import { formatNumber } from "@/utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { facebookProvider, googleProvider } from "@/lib/firebase";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useInterval } from "react-use";

const BonusRewards = () => {
  const { token } = useUserStore();
  const { data } = useGetBonusStatisticsVer2(token);
  const { openModal } = useModalHook();
  const t = useDictionary();
  dayjs.extend(utc);

  if (!data) return <></>;
  return (
    <div className={styles["bonus-rewards-container"]}>
      <p>{t("bonus_63")}</p>
      <div>
        <div className={styles["total-bonus-box"]}>
          <p className={styles.title}>{t("bonus_64")}</p>
          <p className={styles["total-bonus"]}>
            $
            {data && data.result
              ? formatNumber({ value: data.result.total_bonus_received })
              : "0"}
          </p>
          <div className={styles["reward-box-group"]}>
            <div className={styles.box}>
              <span>{t("bonus_65")}</span>
              <span>
                $
                {data && data.result
                  ? formatNumber({ value: data.result.total_general_rewards })
                  : "0"}
              </span>
            </div>
            <div className={styles.border}></div>
            <div className={styles.box}>
              <span>{t("bonus_66")}</span>
              <span>
                $
                {data && data.result
                  ? formatNumber({ value: data.result.total_vip_rewards })
                  : "0"}
              </span>
            </div>
            <div className={styles.border}></div>
            <div className={styles.box}>
              <span>{t("bonus_67")}</span>
              <span>
                $
                {data && data.result
                  ? formatNumber({ value: data.result.total_special_rewards })
                  : "0"}
              </span>
            </div>
          </div>
          <p className={styles["deposit-info-text"]}>{t("bonus_68")}</p>
          <button
            type={"button"}
            onClick={() => {
              openModal({
                type: "wallet",
              });
            }}
          >
            <span>{t("bonus_69")}</span>
          </button>
        </div>
        <div className={styles["special-bonus-box"]}>
          {data.result.deposit_bonus.is_processing_deposit_bonus && (
            <div className={styles["lock-container"]}>
              <LazyLoadImage
                alt={"img lock"}
                src={"/images/bonus/img_bonus_lock.webp"}
              />
              <p>{t("bonus_174")}</p>
            </div>
          )}
          {data.result.deposit_bonus.deposit_bonus_type === 2 && (
            <button
              type={"button"}
              className={styles.tooltip}
              onClick={() => {
                if (
                  (data.result.deposit_bonus.deposit_bonus_type === 2 &&
                    data.result.deposit_bonus.general_deposit_round === 0) ||
                  data.result.deposit_bonus.deposit_bonus_type !== 2
                ) {
                  openModal({
                    type: "bonusUsagePolicy",
                  });
                } else {
                  openModal({
                    type: "specialDepositBonus",
                  });
                }
              }}
            ></button>
          )}

          {/*deposit_bonus_type*/}
          {/*0 : 로그인 하지 않았을 경우*/}
          {/*1 : 초대코드에 의한 입금 보너스 수령 가능 상태*/}
          {/*2 : 일반 입금 보너스 수령 가능 상태*/}
          {/*3 : 리딤코드에 의한 입금 보너스 수령 가능 상태*/}
          {/*general_deposit_round*/}
          {/*0 : 일반 입금 보너스를 받지 않은 상태(default)*/}
          {/*1 : 1단계 수령 완료*/}
          {/*2 : 2단계 수령 완료*/}
          {/*3 : 3단계 수령 완료*/}
          {/*4 : 4단계 수령 완료*/}
          {data.result.deposit_bonus.deposit_bonus_type === 2 ? (
            <>
              {data.result.deposit_bonus.general_deposit_round === 0 ? (
                <div className={styles["deposit-bonus-step-1"]}>
                  <div className={styles.top}>
                    <div className={styles["text-group"]}>
                      <span>
                        {t("bonus_167", [
                          data.result.deposit_bonus.deposit_bonus_info?.[0]
                            ?.bonus_multiply
                            ? (
                                data.result.deposit_bonus
                                  .deposit_bonus_info?.[0]?.bonus_multiply * 100
                              ).toString()
                            : "0",
                        ])}
                      </span>
                      <span>{t("bonus_168")}</span>
                    </div>
                    <button
                      type={"button"}
                      onClick={() => {
                        openModal({
                          type: "wallet",
                        });
                      }}
                    >
                      <span>{t("bonus_169")}</span>
                    </button>
                  </div>
                  <p className={styles.bottom}>{t("bonus_170")}</p>
                </div>
              ) : (
                <div className={styles["deposit-bonus-step-2"]}>
                  {data.result.deposit_bonus.general_deposit_round === 4 && (
                    <div className={styles["completion-all-bonus"]}>
                      <LazyLoadImage
                        src={"/images/bonus/img_bonus_confetti.webp"}
                        alt={"img confetti"}
                      />
                      <p>{t("bonus_171")}</p>
                      <div className={styles["reset-box"]}>
                        <p>
                          <span>Bonus reset</span>{" "}
                          <span>
                            {data.result.deposit_bonus.end_date && (
                              <EndDateBox
                                endDate={data.result.deposit_bonus.end_date}
                              />
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  <p>{t("bonus_172")}</p>
                  <div className={styles["step-row"]}>
                    <div className={styles["step-bar"]}>
                      <div className={styles["bar-container"]}>
                        <div
                          className={styles.bar}
                          style={{
                            opacity:
                              data.result.deposit_bonus.general_deposit_round >=
                              1
                                ? 1
                                : 0,
                          }}
                        ></div>
                        <div
                          className={styles.bar}
                          style={{
                            opacity:
                              data.result.deposit_bonus.general_deposit_round >=
                              2
                                ? 1
                                : 0,
                          }}
                        ></div>
                        <div
                          className={styles.bar}
                          style={{
                            opacity:
                              data.result.deposit_bonus.general_deposit_round >=
                              3
                                ? 1
                                : 0,
                          }}
                        ></div>
                      </div>
                    </div>
                    {Array.from({ length: 4 }).map((_, i) => {
                      return (
                        <StepBox
                          step={i + 1}
                          currentStep={
                            data.result.deposit_bonus.general_deposit_round
                          }
                          key={i}
                        />
                      );
                    })}
                  </div>
                  <div className={styles["btn-row"]}>
                    {data.result.deposit_bonus.general_deposit_round !== 4 && (
                      <>
                        <div className={styles["date-box"]}>
                          <span>{t("bonus_173")}</span>
                          {data.result.deposit_bonus.end_date && (
                            <span>
                              <EndDateBox
                                endDate={data.result.deposit_bonus.end_date}
                              />
                            </span>
                          )}
                        </div>
                        <button
                          type={"button"}
                          onClick={() => {
                            openModal({
                              type: "wallet",
                            });
                          }}
                        >
                          <span>{t("bonus_169")}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles["special-box"]}>
                <p className={styles.title}>{t("bonus_70")}</p>
                <div className={styles["collect-up-text"]}>
                  <span>{t("bonus_71")}</span>{" "}
                  <span>{data.result.deposit_bonus.up_to_dollar} USD</span>
                </div>
                <div className={styles["button-row"]}>
                  <div className={styles["percent-text"]}>
                    <span>{data.result.deposit_bonus.bonus_multiply}</span>
                    <span>%</span>
                  </div>
                  <button
                    type={"button"}
                    onClick={() => {
                      openModal({
                        type: "wallet",
                      });
                    }}
                  >
                    <span>{t("bonus_72")}</span>
                  </button>
                </div>
                <p className={styles["info-text"]}>{t("bonus_73")}</p>
              </div>
            </>
          )}
          {/*{data.result.deposit_bonus.up_to_dollar ? (*/}
          {/*  <>*/}
          {/*    <div className={styles["collect-up-text"]}>*/}
          {/*      <span>{t("bonus_71")}</span> <span>1,500 USD</span>*/}
          {/*    </div>*/}
          {/*    <div className={styles["button-row"]}>*/}
          {/*      <div className={styles["percent-text"]}>*/}
          {/*        <span>150</span>*/}
          {/*        <span>%</span>*/}
          {/*      </div>*/}
          {/*      <button*/}
          {/*        type={"button"}*/}
          {/*        onClick={() => {*/}
          {/*          openModal({*/}
          {/*            type: "wallet",*/}
          {/*          });*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <span>{t("bonus_72")}</span>*/}
          {/*      </button>*/}
          {/*    </div>*/}
          {/*    <p className={styles["info-text"]}>{t("bonus_73")}</p>*/}
          {/*  </>*/}
          {/*) : (*/}
          {/*  <div className={styles["not-bonus-box"]}>*/}
          {/*    <LazyLoadImage*/}
          {/*      src={"/images/bonus/img_bonus_box.webp"}*/}
          {/*      alt={"img bonus"}*/}
          {/*    />*/}
          {/*    <span>{t("bonus_141")}</span>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      </div>
    </div>
  );
};

const EndDateBox = ({ endDate }: { endDate: string }) => {
  dayjs.extend(utc);
  const t = useDictionary();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const targetDate = dayjs(endDate).utc();

  function updateCountdown() {
    const now = dayjs().utc();
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
  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) return <></>;
  return (
    <>
      {days > 0
        ? t("bonus_165", [
            days.toString(),
            hours.toString(),
            minutes.toString(),
          ])
        : t("bonus_166", [
            hours.toString(),
            minutes.toString(),
            seconds.toString(),
          ])}
    </>
  );
};

const StepBox = ({
  step,
  currentStep,
}: {
  step: number;
  currentStep: number;
}) => {
  const completeStep = useMemo(() => {
    if (step === currentStep || step < currentStep) {
      return "done";
    }
    if (step === currentStep + 1) {
      return "open";
    }
    return "close";
  }, [step, currentStep]);

  const text = useMemo(() => {
    switch (step) {
      case 1:
        return "Complete";
      case 2:
        return "Max 100 USD+";
      case 3:
        return "Max 400 USD+";
      case 4:
        return "Max 900 USD+";
      default:
        "Complete";
    }
  }, [step]);
  return (
    <div className={styles.box}>
      <LazyLoadImage
        src={`/images/bonus/img_bonus_${step}_box_${completeStep}.webp`}
        alt={"img gift"}
      />
      <div
        className={styles.point}
        style={{
          backgroundImage: `url('/images/bonus/ico_step_${completeStep}.svg')`,
        }}
      ></div>
      <span className={styles[completeStep]}>{text}</span>
    </div>
  );
};

export default BonusRewards;
