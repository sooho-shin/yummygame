"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/airdrop.module.scss";
import { formatNumber } from "@/utils";
import { useUserStore } from "@/stores/useUser";
import { useGetBonusLeaderBoard } from "@/querys/bonus";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGetUserProfile } from "@/querys/user";
import CommonEmptyData from "@/components/common/EmptyData";
import { useDictionary } from "@/context/DictionaryContext";
import useModalHook from "@/hooks/useModalHook";

const AirDropLeaderboard = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const t = useDictionary();
  const tabArray = [
    { text: t("airdrop_69"), value: "airdrop" },
    // { text: t("airdrop_70"), value: "weekly" },
    { text: t("airdrop_71"), value: "race" },
  ];
  const { openModal } = useModalHook();

  const { token } = useUserStore();

  const [tab] = useState(tabArray[0].value);
  const { data: leaderboardData, refetch } = useGetBonusLeaderBoard();
  const { data: userData } = useGetUserProfile(token);

  useEffect(() => {
    refetch();
  }, [token]);

  if (!leaderboardData) return <></>;

  return (
    <div className={styles["leaderboard-wrapper"]}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t("airdrop_42")}</h2>
        {/*<ul className={styles["tab-row"]}>*/}
        {/*  {tabArray.map(c => {*/}
        {/*    return (*/}
        {/*      <li key={c.value}>*/}
        {/*        <button*/}
        {/*          className={classNames({ [styles.active]: tab === c.value })}*/}
        {/*          type={"button"}*/}
        {/*          onClick={() => setTab(c.value)}*/}
        {/*        >*/}
        {/*          <span>{c.text}</span>*/}
        {/*        </button>*/}
        {/*      </li>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*  <div className={styles.border}></div>*/}
        {/*</ul>*/}
        <div className={styles["tab-content"]}>
          <div className={styles["info-content"]}>
            {tab === "airdrop"
              ? t("airdrop_87")
              : tab === "weekly"
                ? t("airdrop_88")
                : t("airdrop_89")}
            <button
              className={styles.tooltip}
              onClick={() => {
                openModal({
                  type: "alert",
                  alertData: {
                    title: t("airdrop_86"),
                    children: (
                      <pre className={styles["tooltip-text"]}>
                        {tab === "airdrop"
                          ? t("airdrop_90")
                          : tab === "weekly"
                            ? t("airdrop_91")
                            : t("airdrop_92")}
                      </pre>
                    ),
                  },
                });
              }}
            ></button>
          </div>
          <table>
            <thead>
              {tab === "airdrop" && (
                <tr>
                  <th align={"left"}>
                    <span>{t("airdrop_43")}</span>
                  </th>
                  <th align={"left"}>
                    <span>{t("airdrop_44")}</span>
                  </th>
                  {/*<th align={"right"}>*/}
                  {/*  <span>{t("airdrop_45")}</span>*/}
                  {/*</th>*/}
                  {/*<th align={"right"}>*/}
                  {/*  <span>{t("airdrop_46")}</span>*/}
                  {/*</th>*/}
                  <th align={"right"}>
                    <span>{t("airdrop_47")}</span>
                  </th>
                </tr>
              )}

              {tab === "weekly" && (
                <tr>
                  <th align={"left"}>
                    <span>{t("airdrop_48")}</span>
                  </th>
                  <th align={"left"}>
                    <span>{t("airdrop_49")}</span>
                  </th>
                  <th align={"right"}>
                    <span>{t("airdrop_50")}</span>
                  </th>
                  <th align={"right"}>
                    <span>{t("airdrop_51")}</span>
                  </th>
                  <th align={"right"}>
                    <span>{t("airdrop_93")}</span>
                  </th>
                </tr>
              )}
              {tab === "race" && (
                <tr>
                  <th align={"left"}>
                    <span>{t("airdrop_48")}</span>
                  </th>
                  <th align={"left"}>
                    <span>{t("airdrop_49")}</span>
                  </th>
                  <th align={"right"}>
                    <span>{t("airdrop_85")}</span>
                  </th>
                  <th align={"right"}>
                    <span>{t("airdrop_51")}</span>
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {tab === "airdrop" && hydrated && (
                <>
                  {token && userData && (
                    <tr className={styles.my}>
                      <td align={"left"}>
                        <div>
                          <span>
                            {leaderboardData.result
                              .airdrop_leaderboard_personal_ranking.ranking ??
                              "-"}
                          </span>
                        </div>
                      </td>
                      <td align={"left"}>
                        <div>
                          <span>{userData.result.email}</span>
                        </div>
                      </td>
                      {/*<td align={"right"}>*/}
                      {/*  <div>*/}
                      {/*    <span>*/}
                      {/*      {formatNumber({*/}
                      {/*        value:*/}
                      {/*          leaderboardData.result*/}
                      {/*            .airdrop_leaderboard_personal_ranking*/}
                      {/*            .daily_point,*/}
                      {/*      })}*/}
                      {/*    </span>*/}
                      {/*  </div>*/}
                      {/*</td>*/}
                      {/*<td align={"right"}>*/}
                      {/*  <div>*/}
                      {/*    <span>*/}
                      {/*      {formatNumber({*/}
                      {/*        value:*/}
                      {/*          leaderboardData.result*/}
                      {/*            .airdrop_leaderboard_personal_ranking*/}
                      {/*            .weekly_point,*/}
                      {/*      })}*/}
                      {/*    </span>*/}
                      {/*  </div>*/}
                      {/*</td>*/}
                      <td align={"right"}>
                        <div>
                          <span>
                            {formatNumber({
                              value:
                                leaderboardData.result
                                  .airdrop_leaderboard_personal_ranking.point,
                            })}
                          </span>
                          <LazyLoadImage
                            src={"/images/airdrop/ico_point.svg"}
                            alt="img rank"
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}

              {tab === "race" && hydrated && (
                <>
                  {token && userData && (
                    <tr className={styles.my}>
                      <td align={"left"}>
                        <div>
                          <span>
                            {!leaderboardData.result
                              .airdrop_leaderboard_personal_ranking
                              .hon_ranking ||
                            leaderboardData.result
                              .airdrop_leaderboard_personal_ranking
                              .hon_ranking === 0
                              ? "-"
                              : leaderboardData.result
                                  .airdrop_leaderboard_personal_ranking
                                  .hon_ranking}
                          </span>
                        </div>
                      </td>
                      <td align={"left"}>
                        <div>
                          <span>{userData.result.email}</span>
                        </div>
                      </td>
                      <td align={"right"}>
                        <div>
                          <span>
                            {leaderboardData.result
                              .airdrop_leaderboard_personal_ranking
                              .hon_amount &&
                            leaderboardData.result
                              .airdrop_leaderboard_personal_ranking.hon_amount >
                              0
                              ? formatNumber({
                                  value:
                                    leaderboardData.result.airdrop_leaderboard_personal_ranking.hon_amount?.toString() ||
                                    "0",
                                })
                              : "-"}
                          </span>
                          <LazyLoadImage
                            src={"/images/tokens/img_token_hon_circle.svg"}
                            alt="img hon"
                          />
                        </div>
                      </td>
                      <td align={"right"}>
                        <div>
                          <span>
                            {leaderboardData.result
                              .airdrop_leaderboard_personal_ranking
                              .hon_ranking &&
                            leaderboardData.result
                              .airdrop_leaderboard_personal_ranking
                              .hon_ranking > 0
                              ? formatNumber({
                                  value:
                                    racePointList[
                                      leaderboardData.result
                                        .airdrop_leaderboard_personal_ranking
                                        .hon_ranking - 1
                                    ].toString(),
                                })
                              : "-"}
                          </span>
                          <LazyLoadImage
                            src={"/images/airdrop/ico_point.svg"}
                            alt="img rank"
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}

              {tab === "airdrop" && hydrated && (
                <>
                  {leaderboardData.result.airdrop_leaderboard.length > 0 ? (
                    leaderboardData.result.airdrop_leaderboard.map(c => {
                      return (
                        <tr key={c.ranking}>
                          <td align={"left"}>
                            <div>
                              <span>
                                {c.ranking === 1 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_gold.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : c.ranking === 2 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_silver.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : c.ranking === 3 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_bronze.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : (
                                  c.ranking
                                )}
                              </span>
                            </div>
                          </td>
                          <td align={"left"}>
                            <div>
                              <span>{c.email}</span>
                            </div>
                          </td>
                          {/*<td align={"right"} className={styles.opacity}>*/}
                          {/*  <div>*/}
                          {/*    <span>*/}
                          {/*      {formatNumber({ value: c.daily_point })}*/}
                          {/*    </span>*/}
                          {/*  </div>*/}
                          {/*</td>*/}
                          {/*<td align={"right"} className={styles.opacity}>*/}
                          {/*  <div>*/}
                          {/*    <span>*/}
                          {/*      {formatNumber({ value: c.weekly_point })}*/}
                          {/*    </span>*/}
                          {/*  </div>*/}
                          {/*</td>*/}
                          <td align={"right"}>
                            <div>
                              <span>{formatNumber({ value: c.point })}</span>
                              <LazyLoadImage
                                src={"/images/airdrop/ico_point.svg"}
                                alt="img rank"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className={styles["not-data"]}>
                      <td colSpan={5}>
                        <CommonEmptyData />
                      </td>
                    </tr>
                  )}
                </>
              )}

              {tab === "weekly" && hydrated && (
                <>
                  {leaderboardData.result.weekly_race_leaderboard &&
                  leaderboardData.result.weekly_race_leaderboard.length > 0 ? (
                    leaderboardData.result.weekly_race_leaderboard.map(c => {
                      return (
                        <tr key={c.ranking}>
                          <td align={"left"}>
                            <div>
                              <span>
                                {c.ranking === 1 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_gold.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : c.ranking === 2 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_silver.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : c.ranking === 3 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_bronze.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : (
                                  c.ranking
                                )}
                              </span>
                            </div>
                          </td>
                          <td align={"left"}>
                            <div>
                              <span>{c.email}</span>
                            </div>
                          </td>
                          <td align={"right"} className={styles.opacity}>
                            <div>
                              <span>{formatNumber({ value: c.wager })}</span>
                            </div>
                          </td>
                          <td align={"right"}>
                            <div>
                              <span>
                                {formatNumber({ value: c.weekly_point })}
                              </span>
                              <LazyLoadImage
                                src={"/images/airdrop/ico_point.svg"}
                                alt="img rank"
                              />
                            </div>
                          </td>
                          <td align={"right"}>
                            <div>
                              <span>
                                {leaderboardData.result
                                  .airdrop_leaderboard_personal_ranking
                                  .hon_ranking &&
                                leaderboardData.result
                                  .airdrop_leaderboard_personal_ranking
                                  .hon_ranking > 0
                                  ? formatNumber({
                                      value:
                                        weeklyPointList[
                                          c.ranking - 1
                                        ].toString(),
                                    })
                                  : "-"}
                              </span>
                              <LazyLoadImage
                                src={"/images/airdrop/ico_point.svg"}
                                alt="img rank"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className={styles["not-data"]}>
                      <td colSpan={5}>
                        <CommonEmptyData />
                      </td>
                    </tr>
                  )}
                </>
              )}
              {tab === "race" && hydrated && (
                <>
                  {leaderboardData.result.hon_leaderboard &&
                  leaderboardData.result.hon_leaderboard.length > 0 ? (
                    leaderboardData.result.hon_leaderboard.map(c => {
                      return (
                        <tr key={c.ranking}>
                          <td align={"left"}>
                            <div>
                              <span>
                                {c.ranking === 1 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_gold.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : c.ranking === 2 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_silver.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : c.ranking === 3 ? (
                                  <LazyLoadImage
                                    src={"/images/airdrop/ico_rank_bronze.png"}
                                    alt="img rank"
                                    className={styles.rank}
                                  />
                                ) : (
                                  c.ranking
                                )}
                              </span>
                            </div>
                          </td>
                          <td align={"left"}>
                            <div>
                              <span>{c.email}</span>
                            </div>
                          </td>
                          <td align={"right"} className={styles.opacity}>
                            <div>
                              <span>{formatNumber({ value: c.hon })}</span>
                              <LazyLoadImage
                                src={"/images/tokens/img_token_hon_circle.svg"}
                                alt="img hon"
                              />
                            </div>
                          </td>
                          <td align={"right"} className={styles.opacity}>
                            <div>
                              <span>
                                {formatNumber({
                                  value:
                                    racePointList[c.ranking - 1].toString(),
                                })}
                              </span>
                              <LazyLoadImage
                                src={"/images/airdrop/ico_point.svg"}
                                alt="img rank"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className={styles["not-data"]}>
                      <td colSpan={4}>
                        <CommonEmptyData />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AirDropLeaderboard;

const racePointList = [
  1000000, 950000, 900000, 850000, 800000, 750000, 700000, 650000, 600000,
  550000, 540000, 530000, 520000, 510000, 500000, 495000, 490000, 485000,
  480000, 475000, 470000, 465000, 460000, 455000, 450000, 445000, 440000,
  435000, 430000, 425000, 420000, 415000, 410000, 405000, 400000, 395000,
  390000, 385000, 380000, 375000, 370000, 365000, 360000, 355000, 350000,
  345000, 340000, 335000, 330000, 325000, 320000, 315000, 310000, 305000,
  300000, 295000, 290000, 285000, 280000, 275000, 270000, 265000, 260000,
  255000, 250000, 245000, 240000, 235000, 230000, 225000, 220000, 215000,
  210000, 205000, 200000, 195000, 190000, 185000, 180000, 175000, 170000,
  165000, 160000, 155000, 150000, 145000, 140000, 135000, 130000, 125000,
  120000, 115000, 110000, 105000, 100000, 95000, 90000, 85000, 80000, 75000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000, 70000,
  70000, 70000, 70000, 70000, 70000, 70000, 70000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000,
  60000, 60000, 60000,
];

const weeklyPointList = [
  1000000, 950000, 900000, 850000, 800000, 750000, 700000, 650000, 600000,
  550000,
];
