"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/airdrop.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatNumber } from "@/utils";
import classNames from "classnames";
import Link from "next/link";
import { useGetBonusLeaderBoard } from "@/querys/bonus";
import { useUserStore } from "@/stores/useUser";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const AirdropChallenge = () => {
  dayjs.extend(utc);
  const t = useDictionary();
  const tabArr = [
    { text: t("airdrop_9"), value: "dashboard" },
    // { text: t("airdrop_80"), value: "free" },
    { text: t("airdrop_10"), value: "special" },
  ];

  const { token } = useUserStore();
  const { openModal } = useModalHook();

  const [tab, setTab] = useState(tabArr[0].value);

  const { data: leaderboardData, refetch } = useGetBonusLeaderBoard();
  useEffect(() => {
    refetch();
  }, [token]);

  const dashboardListArray = useMemo(() => {
    if (!leaderboardData) return [];
    return [
      {
        title: t("airdrop_13"),
        sub: t("airdrop_14"),
        tooltipText: t("airdrop_31"),
        ptsText: t("airdrop_52"),
        accumulatePts:
          leaderboardData.result.personal_quest_board_data
            ?.game_betting_point ?? null,
      },
      {
        title: t("airdrop_15"),
        sub: t("airdrop_16"),
        tooltipText: t("airdrop_32"),
        ptsText: t("airdrop_53"),
        accumulatePts:
          leaderboardData.result.personal_quest_board_data?.deposit_point ??
          null,
      },
      {
        title: t("airdrop_17"),
        sub: t("airdrop_18"),
        tooltipText: t("airdrop_33"),
        ptsText: t("airdrop_54"),
        randomPointPercent:
          leaderboardData.result.personal_quest_board_data.random_point_percent,
        accumulatePts:
          leaderboardData.result.personal_quest_board_data?.random_point ??
          null,
      },
      {
        title: t("airdrop_65"),
        sub: t("airdrop_66"),
        tooltipText: t("airdrop_68"),
        ptsText: t("airdrop_67"),
        accumulatePts:
          leaderboardData.result.personal_quest_board_data
            ?.referral_signup_point ?? null,
      },
      {
        title: t("airdrop_19"),
        sub: t("airdrop_20"),
        tooltipText: t("airdrop_34"),
        ptsText: t("airdrop_55"),
        accumulatePts:
          leaderboardData.result.personal_quest_board_data?.referral_point ??
          null,
      },
      // {
      //   title: t("airdrop_21"),
      //   sub: t("airdrop_22"),
      //   tooltipText: t("airdrop_35"),
      //   ptsText: t("airdrop_56"),
      //   accumulatePts:
      //     leaderboardData.result.personal_quest_board_data?.race_point ?? null,
      // },
    ];
  }, [leaderboardData]);

  const honPlayArray = useMemo(() => {
    if (!leaderboardData) return [];
    return [
      {
        title: t("airdrop_76"),
        sub: t("airdrop_77"),
        tooltipText: t("airdrop_78"),
        ptsText: t("airdrop_79"),
        accumulatePts:
          leaderboardData.result.personal_quest_board_data
            ?.hon_game_betting_point ?? null,
      },
      {
        title: t("airdrop_72"),
        sub: t("airdrop_73"),
        tooltipText: t("airdrop_74"),
        ptsText: t("airdrop_75"),
        accumulatePts:
          leaderboardData.result.personal_quest_board_data?.big_win ?? null,
      },
      {
        title: t("airdrop_81"),
        sub: t("airdrop_82"),
        tooltipText: t("airdrop_83"),
        ptsText: t("airdrop_84"),
        accumulatePts: 0,
      },
    ];
  }, [leaderboardData]);

  if (!leaderboardData) return <></>;

  return (
    <div className={styles["challenge-wrapper"]} id="airdrop">
      <div className={styles.content}>
        <div className={styles.title}>
          <span>{t("airdrop_11")}</span>
        </div>
        <div className={styles["content-box"]}>
          <p className={styles.day}>
            {dayjs().utc().format("dddd").toUpperCase()} (UTC+0)
          </p>
          <div className={styles["total-reward-box"]}>
            <p className={styles["reward-title"]}>{t("airdrop_12")}</p>
            <div className={styles["point-row"]}>
              <span>
                {leaderboardData.result.personal_quest_board_data.total_point
                  ? formatNumber({
                      value:
                        leaderboardData.result.personal_quest_board_data
                          .total_point,
                      maxDigits: 20,
                    })
                  : "0"}{" "}
                {t("airdrop_61")}
              </span>
            </div>
          </div>
          {/*<ul className={styles["tab-row"]}>*/}
          {/*  {tabArr.map((c: { text: string; value: string }) => {*/}
          {/*    return (*/}
          {/*      <li key={c.value}>*/}
          {/*        <button*/}
          {/*          type="button"*/}
          {/*          className={classNames({ [styles.active]: tab === c.value })}*/}
          {/*          onClick={() => setTab(c.value)}*/}
          {/*        >*/}
          {/*          <span>{c.text}</span>*/}
          {/*        </button>*/}
          {/*      </li>*/}
          {/*    );*/}
          {/*  })}*/}
          {/*  <li className={styles.border}></li>*/}
          {/*</ul>*/}
          <div className={styles["tab-content"]}>
            {tab === "dashboard" && (
              <ul className={styles["dashboard-content"]}>
                {dashboardListArray.map((c, i) => {
                  return (
                    <DashboardListComponent
                      key={i}
                      title={c.title}
                      sub={c.sub}
                      tooltipText={c.tooltipText}
                      ptsText={c.ptsText}
                      accumulatePts={c.accumulatePts}
                      randomPointPercent={c.randomPointPercent ?? undefined}
                      index={i}
                    />
                  );
                })}

                <SpecialListComponent
                  title={t("airdrop_23")}
                  sub={t("airdrop_24")}
                  href={"/provider/hotgames"}
                  maxCount={1}
                  count={
                    leaderboardData.result.personal_quest_board_data
                      ?.daily_count ?? 0
                  }
                  ptsText={t("airdrop_57")}
                  tooltipText={t("airdrop_36")}
                />
                <SpecialListComponent
                  title={t("airdrop_113")}
                  sub={t("airdrop_114")}
                  onClick={() => openModal({ type: "accountSetting" })}
                  maxCount={1}
                  count={
                    leaderboardData.result.personal_quest_board_data?.kyc_count
                  }
                  ptsText={t("airdrop_115")}
                  // tooltipText={"KYC 레벨 2달성시 5,000포인트 지급"}
                />
              </ul>
            )}
            {tab === "free" && (
              <ul className={styles["dashboard-content"]}>
                {honPlayArray.map((c, i) => {
                  return (
                    <DashboardListComponent
                      key={i}
                      title={c.title}
                      sub={c.sub}
                      tooltipText={c.tooltipText}
                      ptsText={c.ptsText}
                      accumulatePts={c.accumulatePts}
                      index={i + 6}
                    />
                  );
                })}
              </ul>
            )}

            {tab === "special" && (
              <ul className={styles["special-content"]}>
                <SpecialListComponent
                  title={t("airdrop_23")}
                  sub={t("airdrop_24")}
                  href={"/provider/hotgames"}
                  maxCount={1}
                  count={
                    leaderboardData.result.personal_quest_board_data
                      ?.daily_count ?? 0
                  }
                  ptsText={t("airdrop_57")}
                  tooltipText={t("airdrop_36")}
                />
                {/*<SpecialListComponent*/}
                {/*  title={t("airdrop_25")}*/}
                {/*  sub={t("airdrop_26")}*/}
                {/*  href={"/provider/hotgames"}*/}
                {/*  maxCount={7}*/}
                {/*  count={*/}
                {/*    leaderboardData.result.personal_quest_board_data*/}
                {/*      ?.weekly_count ?? 0*/}
                {/*  }*/}
                {/*  ptsText={t("airdrop_58")}*/}
                {/*  tooltipText={t("airdrop_37")}*/}
                {/*/>*/}
                {/*<SpecialListComponent*/}
                {/*  title={t("airdrop_27")}*/}
                {/*  sub={t("airdrop_28")}*/}
                {/*  href={*/}
                {/*    "https://bitcointalk.org/index.php?topic=5476032.msg63245088#msg63245088"*/}
                {/*  }*/}
                {/*  blank={true}*/}
                {/*  maxCount={1}*/}
                {/*  count={*/}
                {/*    leaderboardData.result.personal_quest_board_data*/}
                {/*      ?.forum_count ?? 0*/}
                {/*  }*/}
                {/*  ptsText={t("airdrop_59")}*/}
                {/*  tooltipText={t("airdrop_38")}*/}
                {/*/>*/}
                <SpecialListComponent
                  title={t("airdrop_29")}
                  sub={t("airdrop_30")}
                  href={
                    "https://gleam.io/K6501/yummygame-points-airdrop-social-media-event"
                  }
                  blank={true}
                  // https://gleam.io/ZWubK/yummygame-social-media-quest-for-points-airdrop
                  maxCount={1}
                  count={
                    leaderboardData.result.personal_quest_board_data
                      .social_count
                  }
                  ptsText={t("airdrop_60")}
                  tooltipText={t("airdrop_39")}
                />
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardListComponent = ({
  title,
  sub,
  tooltipText,
  ptsText,
  accumulatePts,
  randomPointPercent,
  index,
}: {
  title: string;
  sub: string;
  ptsText: string;
  accumulatePts: number | null;
  tooltipText?: string;
  randomPointPercent?: number;
  index: number;
}) => {
  const { openModal } = useModalHook();
  const t = useDictionary();
  return (
    <li>
      <div>
        <LazyLoadImage
          src={`/images/airdrop/img_dashboard_${index + 1}.webp`}
          alt="img coin"
          width={62}
        />
        <div className={styles["point-info-group"]}>
          <div className={styles["point-info-title"]}>
            <span className={styles.text}>{title}</span>
            {tooltipText && (
              <button
                className={styles.tooltip}
                onClick={() => {
                  openModal({
                    type: "alert",
                    alertData: {
                      title: t("airdrop_64"),
                      children: (
                        <pre className={styles["tooltip-text"]}>
                          {tooltipText}
                        </pre>
                      ),
                    },
                  });
                }}
              ></button>
            )}
          </div>
          <p>{sub}</p>
          <div className={styles["point-info"]}>
            <span>{ptsText}</span>
          </div>
        </div>
        <div className={`${styles["current-point-box"]} ${styles.pc}`}>
          <div className={`${styles["current-point"]} ${styles.pc}`}>
            <span>
              {accumulatePts
                ? formatNumber({
                    value: accumulatePts.toString(),
                    maxDigits: 20,
                  })
                : "0"}{" "}
              {t("airdrop_61")}
            </span>
          </div>
          {(randomPointPercent || randomPointPercent === 0) && (
            <div className={styles["progress-group"]}>
              <div className={styles["progress-box"]}>
                <div
                  style={{
                    width: randomPointPercent + "%",
                  }}
                ></div>
              </div>
              <span>{randomPointPercent}%</span>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles["current-point-box"]} ${styles.mobile}`}>
        <div className={`${styles["current-point"]} ${styles.mobile}`}>
          <span>
            {accumulatePts
              ? formatNumber({
                  value: accumulatePts.toString(),
                  maxDigits: 20,
                })
              : "0"}{" "}
            {t("airdrop_61")}
          </span>
        </div>
        {(randomPointPercent || randomPointPercent === 0) && (
          <div className={styles["progress-group"]}>
            <div className={styles["progress-box"]}>
              <div
                style={{
                  width: randomPointPercent + "%",
                }}
              ></div>
            </div>
            <span>{randomPointPercent}%</span>
          </div>
        )}
      </div>
    </li>
  );
};

const SpecialListComponent = ({
  count,
  maxCount,
  title,
  sub,
  ptsText,
  href,
  tooltipText,
  blank,
  onClick,
}: {
  count: number;
  maxCount: number;
  title: string;
  sub: string;
  ptsText: string;
  href?: string;
  tooltipText?: string;
  blank?: boolean;
  onClick?: () => void;
}) => {
  const { openModal } = useModalHook();
  const { token } = useUserStore();
  const t = useDictionary();
  return (
    <li>
      <div>
        <div className={styles.donut}>
          <svg>
            <filter id="glow">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="1"
                result="blur"
              />
              <feFlood floodColor="#00ff99" result="glowColor" />
              <feComposite
                in="glowColor"
                in2="blur"
                operator="in"
                result="softGlow_colored"
              />
              <feMerge>
                <feMergeNode in="softGlow_colored" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <circle cx="35" cy="35" r="30"></circle>
            <circle
              cx="35"
              cy="35"
              r="30"
              style={{
                strokeDashoffset: `calc(190px - (190px * ${
                  !count ? 0 : (count / maxCount) * 100
                }) / 100)`,
                opacity: !count ? 0 : 1,
              }}
              filter="url(#glow)"

              // style="--percent: 30"
            ></circle>
          </svg>
          {/*<div className={styles.mask}></div>*/}
          <p className={styles.text}>
            {count}/{maxCount}
          </p>
        </div>

        <div className={styles["point-info-group"]}>
          <div className={styles["point-info-title"]}>
            <span className={styles.text}>{title}</span>
            {tooltipText && (
              <button
                className={styles.tooltip}
                onClick={() => {
                  openModal({
                    type: "alert",
                    alertData: {
                      title: t("airdrop_64"),
                      children: (
                        <pre className={styles["tooltip-text"]}>
                          {tooltipText}
                        </pre>
                      ),
                    },
                  });
                }}
              ></button>
            )}
          </div>
          <p>{sub}</p>
          <div className={styles["point-info"]}>
            <span>{ptsText}</span>
          </div>
        </div>
        {maxCount === count ? (
          <div className={`${styles.complete} ${styles.pc}`}>
            <span>{t("airdrop_40")}</span>
          </div>
        ) : token ? (
          onClick ? (
            <button
              type={"button"}
              className={`${styles.go} ${styles.pc}`}
              onClick={() => onClick()}
            >
              <span>{t("airdrop_41")}</span>
            </button>
          ) : blank ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={href ?? "/"}
              className={`${styles.go} ${styles.pc}`}
            >
              <span>{t("airdrop_41")}</span>
            </a>
          ) : (
            <Link href={href ?? "/"} className={`${styles.go} ${styles.pc}`}>
              <span>{t("airdrop_41")}</span>
            </Link>
          )
        ) : (
          <button
            type={"button"}
            className={`${styles.go} ${styles.pc}`}
            onClick={() => openModal({ type: "getstarted" })}
          >
            <span>{t("airdrop_41")}</span>
          </button>
        )}
      </div>
      {maxCount === count ? (
        <div className={`${styles.complete} ${styles.mobile}`}>
          <span>{t("airdrop_40")}</span>
        </div>
      ) : token ? (
        onClick ? (
          <button
            type={"button"}
            className={`${styles.go} ${styles.mobile}`}
            onClick={() => onClick()}
          >
            <span>{t("airdrop_41")}</span>
          </button>
        ) : blank ? (
          <a
            target="_blank"
            rel="noreferrer"
            href={href ?? ""}
            className={`${styles.go} ${styles.mobile}`}
          >
            <span>{t("airdrop_41")}</span>
          </a>
        ) : (
          <Link href={href ?? "/"} className={`${styles.go} ${styles.mobile}`}>
            <span>{t("airdrop_41")}</span>
          </Link>
        )
      ) : (
        <button type={"button"} className={`${styles.go} ${styles.mobile}`}>
          <span>{t("airdrop_41")}</span>
        </button>
      )}
    </li>
  );
};

export default AirdropChallenge;
