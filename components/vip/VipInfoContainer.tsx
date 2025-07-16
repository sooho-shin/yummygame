"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import styles from "./styles/vip.module.scss";
import classNames from "classnames";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import { useGetCommon } from "@/querys/common";
import { useUserStore } from "@/stores/useUser";
import { customConsole, formatNumber } from "@/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import BigNumber from "bignumber.js";

import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useCommonHook from "@/hooks/useCommonHook";

type gradeType =
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "challenger"
  | "elite"
  | "master"
  | "grandmaster"
  | "legend";
const VipInfoContainer = () => {
  const grades: gradeType[] = [
    "iron",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "challenger",
    "elite",
    "master",
    "grandmaster",
    "legend",
  ];

  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<boolean>(false);

  const handleSwiper = (swiper: any) => {
    swiperRef.current = swiper;
    setSwiperInstance(true);
    // Swiper 시작 및 끝 이벤트 리스너 설정
    swiper.on("reachBeginning", () => setIsBeginning(true));
    swiper.on("reachEnd", () => setIsEnd(true));
    swiper.on("fromEdge", () => {
      setIsBeginning(false);
      setIsEnd(false);
    });
  };

  const t = useDictionary();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { checkMedia } = useCommonHook();
  const { token } = useUserStore();
  const { data: user } = useGetCommon(token);
  const [selectedGrade, setSelectedGrade] = useState<gradeType>(grades[0]);

  useEffect(() => {
    if (user && user.result) {
      const grade =
        user.result.userInfo?.currentVipGroup?.toLocaleLowerCase() as gradeType;
      setSelectedGrade(grade);

      const gradeIndex = grades.findIndex(g => g === grade);

      if (gradeIndex !== -1 && swiperInstance) {
        swiperRef.current.slideTo(gradeIndex); // Swiper 인스턴스를 통해 슬라이드 이동
      }
    }
  }, [user, swiperInstance]);

  const slidesToShow = useMemo(() => {
    return checkMedia === "mobile"
      ? 3
      : checkMedia === "middle"
        ? 4
        : checkMedia === "tablet"
          ? 5
          : 8;
  }, [checkMedia]);

  return (
    <div className={styles["vip-info-container"]}>
      <div className={styles.bg}>
        <div className={styles["gift-box"]}></div>
      </div>
      <div className={styles["info-content"]}>
        <VipBox />
        <div className={styles["text-group"]}>
          <p className={styles["title"]}>{t("vip_1")}</p>
          <pre>{t("vip_2")}</pre>
          <Link href={"/"}>
            {t("vip_3")}{" "}
            <LazyLoadImage
              src={"/images/common/ico_arrow_w.svg"}
              alt={"ico arrow"}
            />
          </Link>
        </div>
      </div>
      <div className={styles["overview-container"]}>
        <p className={styles.title}>{t("vip_4")}</p>
        <p className={styles.sub}>{t("vip_5")}</p>
        <div className={styles["benefit-container"]}>
          {hydrated && (
            <div className={styles["tab-group"]}>
              <button
                type={"button"}
                className={classNames(styles.prev)}
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
              ></button>
              <div>
                {/*5 4 3 */}
                {selectedGrade && (
                  <Swiper
                    mousewheel={true}
                    slidesPerView={slidesToShow}
                    spaceBetween={16}
                    cssMode={true}
                    // ref={swiperRef}
                    onSwiper={handleSwiper}
                  >
                    {grades.map(grade => {
                      return (
                        <SwiperSlide key={grade}>
                          <button
                            type={"button"}
                            key={grade}
                            className={classNames(
                              styles["grade-btn"],
                              styles[grade],
                              {
                                [styles.active]: grade === selectedGrade,
                              },
                            )}
                            onClick={() => setSelectedGrade(grade)}
                          >
                            <LazyLoadImage
                              src={`/images/vip/grade/${grade}.webp`}
                            />
                            <span
                              className={classNames(styles[grade], {
                                [styles.active]: grade === selectedGrade,
                              })}
                            >
                              {grade}
                            </span>
                          </button>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
              </div>
              <button
                type={"button"}
                className={classNames(styles.next)}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
              ></button>
            </div>
          )}
          {selectedGrade && <TabContent selectedGrade={selectedGrade} />}
        </div>
      </div>
      <LevelUpDetailContainer />
    </div>
  );
};

const LevelUpDetailContainer = () => {
  const grades: gradeType[] = [
    "iron",
    "bronze",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "challenger",
    "elite",
    "master",
    "grandmaster",
    "legend",
  ];

  const t = useDictionary();

  return (
    <>
      <h2 className={styles["level-up-detail-title"]}>{t("vip_69")}</h2>
      <div className={styles["detail-box-container"]}>
        {grades.map((grade, i) => {
          return (
            <LevelBox
              index={i}
              key={grade}
              array={gradeData[grade]}
              grade={grade}
            />
          );
        })}
      </div>
    </>
  );
};

const LevelBox = ({
  grade,
  array,
  index,
}: {
  grade: gradeType;
  array: {
    grade: string;
    level: string;
    requiredBettingDollar: string;
    levelUpBonus: string;
  }[];
  index: number;
}) => {
  const { token } = useUserStore();
  const { data: user } = useGetCommon(token);
  const [dropDownState, setDropDownState] = useState(false);
  const t = useDictionary();

  const vipStep = useMemo(() => {
    switch (grade) {
      case "iron":
        return "VIP 1-10";
      case "bronze":
        return "VIP 11-20";
      case "silver":
        return "VIP 21-30";
      case "gold":
        return "VIP 31-40";
      case "platinum":
        return "VIP 41-50";
      case "diamond":
        return "VIP 51-60";
      case "challenger":
        return "VIP 61-80";
      case "elite":
        return "VIP 81-100";
      case "master":
        return "VIP 101-120";
      case "grandmaster":
        return "VIP 121-140";
      case "legend":
        return "VIP 141-160";
      default:
        return "VIP";
    }
  }, [grade]);

  useEffect(() => {
    if (
      user &&
      user.result &&
      user.result.userInfo.currentVipGroup.toLowerCase() === grade
    ) {
      setDropDownState(true);
    }
  }, [user]);

  // user.result?.userInfo.currentVipGroup

  return (
    <div className={styles["level-box"]}>
      <button type={"button"} onClick={() => setDropDownState(!dropDownState)}>
        <LazyLoadImage
          src={`/images/vip/grade/${grade}.webp`}
          className={styles.tier}
        />
        <span>
          {grade} {vipStep}
        </span>
        <span
          className={classNames(styles.arrow, {
            [styles.active]: dropDownState,
          })}
        ></span>
      </button>

      <motion.div
        className={styles["table-container"]}
        initial={{ height: 0, opacity: 0, marginTop: 0 }}
        animate={{
          height: dropDownState ? "auto" : 0,
          opacity: dropDownState ? 1 : 0,
          // marginTop: dropDownState ? 16 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <table>
          <thead>
            <tr>
              <th align={"left"}>
                <span>{t("vip_70")}</span>
              </th>
              <th align={"left"}>
                <span>{t("vip_71")}</span>
              </th>
              <th align={"left"}>
                <span>{t("vip_72")}</span>
              </th>
              <th align={"left"}>
                <span>{t("vip_73")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {array.map((item, i) => (
              <tr key={item.grade}>
                <td>
                  <div>
                    <LazyLoadImage src={`/images/vip/grade/${grade}.webp`} />
                    <span>
                      {grade} {i + 1}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>{item.level}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>{item.requiredBettingDollar}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span>{item.levelUpBonus}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

const TabContent = ({ selectedGrade }: { selectedGrade: gradeType }) => {
  const { openModal } = useModalHook();
  const t = useDictionary();
  const vipStep = useMemo(() => {
    switch (selectedGrade) {
      case "iron":
        return "VIP 1-10";
      case "bronze":
        return "VIP 11-20";
      case "silver":
        return "VIP 21-30";
      case "gold":
        return "VIP 31-40";
      case "platinum":
        return "VIP 41-50";
      case "diamond":
        return "VIP 51-60";
      case "challenger":
        return "VIP 61-80";
      case "elite":
        return "VIP 81-100";
      case "master":
        return "VIP 101-120";
      case "grandmaster":
        return "VIP 121-140";
      case "legend":
        return "VIP 141-160";
      default:
        return "VIP";
    }
  }, [selectedGrade]);
  return (
    <div className={styles["tab-content"]}>
      <div className={classNames(styles["grade-bar"], styles[selectedGrade])}>
        <span>{vipStep}</span>
        <span className={styles[selectedGrade]}>{selectedGrade}</span>
        {selectedGrade !== "iron" && <span>{t("vip_6")}</span>}
      </div>
      {selectedGrade === "iron" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>3.44 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div className={styles.comingsoon}>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_10")}
              </p>
              <p className={styles.info}>{t("vip_11")}</p>
            </div>
          </li>
          <li>
            <div className={styles.comingsoon}>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_12")}
              </p>
              <p className={styles.info}>{t("vip_13")}</p>
            </div>
          </li>
        </ul>
      )}
      {selectedGrade === "bronze" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>14.50 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_16"),
                }}
              ></p>
            </div>
          </li>
        </ul>
      )}
      {selectedGrade === "silver" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>66 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div className={styles.comingsoon}>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                Quest
              </p>
              <p className={styles.info}>{t("vip_17")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_18"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_21"),
                }}
              ></p>
            </div>
          </li>
        </ul>
      )}
      {selectedGrade === "gold" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>245 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_22"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_23"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_25"),
                }}
              ></p>
            </div>
          </li>
        </ul>
      )}

      {selectedGrade === "platinum" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>950 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_26"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_27"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_28"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div className={styles.comingsoon}>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_29")}
              </p>
              <p className={styles.info}>{t("vip_30")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_31")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "noFeeWithdrawalInfo",
                      },
                    });
                  }}
                ></button>
              </p>
              <p className={styles.info}>{t("vip_32")}</p>
            </div>
          </li>
        </ul>
      )}

      {selectedGrade === "diamond" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>2,050 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_33"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_34"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_35"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_31")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "noFeeWithdrawalInfo",
                      },
                    });
                  }}
                ></button>
              </p>
              <p className={styles.info}>{t("vip_36")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_37")}
              </p>
              <p className={styles.info}>{t("vip_38")}</p>
            </div>
          </li>
        </ul>
      )}

      {selectedGrade === "challenger" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>24,150 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_39"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_40"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_41"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_31")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "noFeeWithdrawalInfo",
                      },
                    });
                  }}
                ></button>
              </p>
              <p className={styles.info}>{t("vip_36")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_37")}
              </p>
              <p className={styles.info}>{t("vip_42")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_43")}
              </p>
              <p className={styles.info}>{t("vip_44")}</p>
            </div>
          </li>
        </ul>
      )}

      {selectedGrade === "elite" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>145,900 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_45"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_46"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_47"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_31")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "noFeeWithdrawalInfo",
                      },
                    });
                  }}
                ></button>
              </p>
              <p className={styles.info}>{t("vip_36")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_37")}
              </p>
              <p className={styles.info}>{t("vip_48")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_49")}
              </p>
              <p className={styles.info}>{t("vip_50")}</p>
            </div>
          </li>
        </ul>
      )}

      {selectedGrade === "master" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>975,000 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_51"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_52"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_53"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_31")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "noFeeWithdrawalInfo",
                      },
                    });
                  }}
                ></button>
              </p>
              <p className={styles.info}>{t("vip_36")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_37")}
              </p>
              <p className={styles.info}>{t("vip_54")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_55")}
              </p>
              <p className={styles.info}>{t("vip_56")}</p>
            </div>
          </li>
        </ul>
      )}

      {selectedGrade === "grandmaster" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>5,800,000 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_57"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_58"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_59"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_31")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "noFeeWithdrawalInfo",
                      },
                    });
                  }}
                ></button>
              </p>
              <p className={styles.info}>{t("vip_36")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_37")}
              </p>
              <p className={styles.info}>{t("vip_54")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_60")}
              </p>
              <p className={styles.info}>{t("vip_61")}</p>
            </div>
          </li>
        </ul>
      )}

      {selectedGrade === "legend" && (
        <ul>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_7")}
              </p>
              <p className={styles.info}>{t("vip_8")}</p>
              <p className={styles.info}>
                {t("vip_9")} <span>2,120,000 JEL</span>
              </p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_14")}
              </p>
              <p className={styles.info}>{t("vip_15")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_19")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "sweetener",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_62"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_20")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "weeklyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_63"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_24")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "monthlyCashback",
                      },
                    });
                  }}
                ></button>
              </p>
              <p
                className={styles.info}
                dangerouslySetInnerHTML={{
                  __html: t("vip_64"),
                }}
              ></p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_31")}{" "}
                <button
                  type={"button"}
                  className={styles["tooltip-btn"]}
                  onClick={() => {
                    openModal({
                      type: "vip",
                      props: {
                        type: "noFeeWithdrawalInfo",
                      },
                    });
                  }}
                ></button>
              </p>
              <p className={styles.info}>{t("vip_36")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_37")}
              </p>
              <p className={styles.info}>{t("vip_54")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_60")}
              </p>
              <p className={styles.info}>{t("vip_61")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_65")}
              </p>
              <p className={styles.info}>{t("vip_66")}</p>
            </div>
          </li>
          <li>
            <div>
              <p className={classNames(styles.title, styles[selectedGrade])}>
                {t("vip_67")}
              </p>
              <p className={styles.info}>{t("vip_68")}</p>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

const VipBox = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token } = useUserStore();
  const { data: user } = useGetCommon(token);
  const t = useDictionary();
  const { openModal } = useModalHook();

  if (!hydrated) return <></>;
  if (!token) {
    return (
      <div className={styles["vip-box-not-login"]}>
        <LazyLoadImage
          src={"/images/vip/img_vip_login.webp"}
          alt={"img vip login"}
        />
        <pre className={styles.title}>{t("vip_75")}</pre>
        <p className={styles["info-text"]}>{t("vip_76")}</p>
        <button
          type={"button"}
          onClick={() => openModal({ type: "getstarted" })}
        >
          <span>{t("vip_77")}</span>
        </button>
      </div>
    );
  }
  return (
    <div
      className={classNames(
        styles["vip-box"],
        // styles[
        //   (user && user.result
        //     ? user.result.userInfo.currentVipGroup.toLowerCase()
        //     : "iron") as gradeType
        // ],
      )}
    >
      <div className={styles["img-grade"]}>
        <div>
          <LazyLoadImage
            src={`/images/vip/grade/${
              user && user.result
                ? user.result.userInfo.currentVipGroup.toLowerCase()
                : "iron"
            }.webp`}
            alt="img grade"
          />
          <div className={styles.dim}></div>
        </div>
      </div>
      <p className={styles["grade-title"]}>
        VIP {user && user.result ? user.result.userInfo.currentVipLevel : "0"}
      </p>
      <p className={styles.experience}>
        {user && user.result
          ? formatNumber({
              value: user.result.userInfo.currentUserWager,
              maxDigits: 0,
            })
          : "0"}{" "}
        XP /{" "}
        {user && user.result
          ? formatNumber({
              value: (
                Number(user.result.userInfo.currentUserWager) +
                Number(user.result.userInfo.needLevelUpWager)
              ).toString(),
              maxDigits: 0,
            })
          : "0"}{" "}
        XP
      </p>
      <div className={styles["progress-bar"]}>
        <div
          className={styles.bar}
          style={{
            width:
              user && user.result
                ? user.result.userInfo.currentExperience + "%"
                : "0" + "%",
          }}
        ></div>
      </div>
      <div className={styles.until}>
        <span>
          ${" "}
          {formatNumber({
            value:
              user && user.result ? user.result.userInfo.needLevelUpWager : "0",
          })}{" "}
          {t("vip_74")}
        </span>{" "}
        <span>
          VIP {user && user.result ? user.result.userInfo.nextVipLevel : "1"}
        </span>
      </div>
    </div>
  );
};

export default VipInfoContainer;

const gradeData = {
  iron: [
    {
      grade: "Iron 1",
      level: "VIP 01",
      requiredBettingDollar: "0",
      levelUpBonus: "0.00",
    },
    {
      grade: "Iron 2",
      level: "VIP 02",
      requiredBettingDollar: "100",
      levelUpBonus: "0.04",
    },
    {
      grade: "Iron 3",
      level: "VIP 03",
      requiredBettingDollar: "200",
      levelUpBonus: "0.05",
    },
    {
      grade: "Iron 4",
      level: "VIP 04",
      requiredBettingDollar: "1,000",
      levelUpBonus: "0.10",
    },
    {
      grade: "Iron 5",
      level: "VIP 05",
      requiredBettingDollar: "2,000",
      levelUpBonus: "0.20",
    },
    {
      grade: "Iron 6",
      level: "VIP 06",
      requiredBettingDollar: "3,000",
      levelUpBonus: "0.30",
    },
    {
      grade: "Iron 7",
      level: "VIP 07",
      requiredBettingDollar: "4,000",
      levelUpBonus: "0.35",
    },
    {
      grade: "Iron 8",
      level: "VIP 08",
      requiredBettingDollar: "5,000",
      levelUpBonus: "0.70",
    },
    {
      grade: "Iron 9",
      level: "VIP 09",
      requiredBettingDollar: "7,000",
      levelUpBonus: "0.80",
    },
    {
      grade: "Iron 10",
      level: "VIP 10",
      requiredBettingDollar: "9,000",
      levelUpBonus: "0.90",
    },
  ],
  bronze: [
    {
      grade: "Bronze 1",
      level: "VIP 11",
      requiredBettingDollar: "11,000",
      levelUpBonus: "1.00",
    },
    {
      grade: "Bronze 2",
      level: "VIP 12",
      requiredBettingDollar: "13,000",
      levelUpBonus: "1.10",
    },
    {
      grade: "Bronze 3",
      level: "VIP 13",
      requiredBettingDollar: "15,000",
      levelUpBonus: "1.20",
    },
    {
      grade: "Bronze 4",
      level: "VIP 14",
      requiredBettingDollar: "17,000",
      levelUpBonus: "1.30",
    },
    {
      grade: "Bronze 5",
      level: "VIP 15",
      requiredBettingDollar: "21,000",
      levelUpBonus: "1.40",
    },
    {
      grade: "Bronze 6",
      level: "VIP 16",
      requiredBettingDollar: "25,000",
      levelUpBonus: "1.50",
    },
    {
      grade: "Bronze 7",
      level: "VIP 17",
      requiredBettingDollar: "29,000",
      levelUpBonus: "1.60",
    },
    {
      grade: "Bronze 8",
      level: "VIP 18",
      requiredBettingDollar: "33,000",
      levelUpBonus: "1.70",
    },
    {
      grade: "Bronze 9",
      level: "VIP 19",
      requiredBettingDollar: "37,000",
      levelUpBonus: "1.80",
    },
    {
      grade: "Bronze 10",
      level: "VIP 20",
      requiredBettingDollar: "41,000",
      levelUpBonus: "1.90",
    },
  ],
  silver: [
    {
      grade: "Silver 1",
      level: "VIP 21",
      requiredBettingDollar: "45,000",
      levelUpBonus: "2",
    },
    {
      grade: "Silver 2",
      level: "VIP 22",
      requiredBettingDollar: "49,000",
      levelUpBonus: "3",
    },
    {
      grade: "Silver 3",
      level: "VIP 23",
      requiredBettingDollar: "59,000",
      levelUpBonus: "4",
    },
    {
      grade: "Silver 4",
      level: "VIP 24",
      requiredBettingDollar: "69,000",
      levelUpBonus: "5",
    },
    {
      grade: "Silver 5",
      level: "VIP 25",
      requiredBettingDollar: "79,000",
      levelUpBonus: "6",
    },
    {
      grade: "Silver 6",
      level: "VIP 26",
      requiredBettingDollar: "89,000",
      levelUpBonus: "7",
    },
    {
      grade: "Silver 7",
      level: "VIP 27",
      requiredBettingDollar: "99,000",
      levelUpBonus: "8",
    },
    {
      grade: "Silver 8",
      level: "VIP 28",
      requiredBettingDollar: "109,000",
      levelUpBonus: "9",
    },
    {
      grade: "Silver 9",
      level: "VIP 29",
      requiredBettingDollar: "119,000",
      levelUpBonus: "10",
    },
    {
      grade: "Silver 10",
      level: "VIP 30",
      requiredBettingDollar: "129,000",
      levelUpBonus: "12",
    },
  ],
  gold: [
    {
      grade: "Gold 1",
      level: "VIP 31",
      requiredBettingDollar: "153,000",
      levelUpBonus: "14",
    },
    {
      grade: "Gold 2",
      level: "VIP 32",
      requiredBettingDollar: "177,000",
      levelUpBonus: "16",
    },
    {
      grade: "Gold 3",
      level: "VIP 33",
      requiredBettingDollar: "201,000",
      levelUpBonus: "18",
    },
    {
      grade: "Gold 4",
      level: "VIP 34",
      requiredBettingDollar: "225,000",
      levelUpBonus: "20",
    },
    {
      grade: "Gold 5",
      level: "VIP 35",
      requiredBettingDollar: "249,000",
      levelUpBonus: "22",
    },
    {
      grade: "Gold 6",
      level: "VIP 36",
      requiredBettingDollar: "273,000",
      levelUpBonus: "24",
    },
    {
      grade: "Gold 7",
      level: "VIP 37",
      requiredBettingDollar: "297,000",
      levelUpBonus: "26",
    },
    {
      grade: "Gold 8",
      level: "VIP 38",
      requiredBettingDollar: "321,000",
      levelUpBonus: "30",
    },
    {
      grade: "Gold 9",
      level: "VIP 39",
      requiredBettingDollar: "377,000",
      levelUpBonus: "35",
    },
    {
      grade: "Gold 10",
      level: "VIP 40",
      requiredBettingDollar: "433,000",
      levelUpBonus: "40",
    },
  ],
  platinum: [
    {
      grade: "Platinum 1",
      level: "VIP 41",
      requiredBettingDollar: "489,000",
      levelUpBonus: "50",
    },
    {
      grade: "Platinum 2",
      level: "VIP 42",
      requiredBettingDollar: "545,000",
      levelUpBonus: "60",
    },
    {
      grade: "Platinum 3",
      level: "VIP 43",
      requiredBettingDollar: "601,000",
      levelUpBonus: "70",
    },
    {
      grade: "Platinum 4",
      level: "VIP 44",
      requiredBettingDollar: "657,000",
      levelUpBonus: "80",
    },
    {
      grade: "Platinum 5",
      level: "VIP 45",
      requiredBettingDollar: "713,000",
      levelUpBonus: "90",
    },
    {
      grade: "Platinum 6",
      level: "VIP 46",
      requiredBettingDollar: "769,000",
      levelUpBonus: "100",
    },
    {
      grade: "Platinum 7",
      level: "VIP 47",
      requiredBettingDollar: "897,000",
      levelUpBonus: "110",
    },
    {
      grade: "Platinum 8",
      level: "VIP 48",
      requiredBettingDollar: "1,025,000",
      levelUpBonus: "120",
    },
    {
      grade: "Platinum 9",
      level: "VIP 49",
      requiredBettingDollar: "1,153,000",
      levelUpBonus: "130",
    },
    {
      grade: "Platinum 10",
      level: "VIP 50",
      requiredBettingDollar: "1,281,000",
      levelUpBonus: "140",
    },
  ],
  diamond: [
    {
      grade: "Diamond 1",
      level: "VIP 51",
      requiredBettingDollar: "1,409,000",
      levelUpBonus: "150",
    },
    {
      grade: "Diamond 2",
      level: "VIP 52",
      requiredBettingDollar: "1,537,000",
      levelUpBonus: "160",
    },
    {
      grade: "Diamond 3",
      level: "VIP 53",
      requiredBettingDollar: "1,665,000",
      levelUpBonus: "170",
    },
    {
      grade: "Diamond 4",
      level: "VIP 54",
      requiredBettingDollar: "1,793,000",
      levelUpBonus: "180",
    },
    {
      grade: "Diamond 5",
      level: "VIP 55",
      requiredBettingDollar: "2,081,000",
      levelUpBonus: "190",
    },
    {
      grade: "Diamond 6",
      level: "VIP 56",
      requiredBettingDollar: "2,369,000",
      levelUpBonus: "200",
    },
    {
      grade: "Diamond 7",
      level: "VIP 57",
      requiredBettingDollar: "2,657,000",
      levelUpBonus: "220",
    },
    {
      grade: "Diamond 8",
      level: "VIP 58",
      requiredBettingDollar: "2,945,000",
      levelUpBonus: "240",
    },
    {
      grade: "Diamond 9",
      level: "VIP 59",
      requiredBettingDollar: "3,233,000",
      levelUpBonus: "260",
    },
    {
      grade: "Diamond 10",
      level: "VIP 60",
      requiredBettingDollar: "3,521,000",
      levelUpBonus: "280",
    },
  ],
  challenger: [
    {
      grade: "Challenger 1",
      level: "VIP 61",
      requiredBettingDollar: "3,809,000",
      levelUpBonus: "300",
    },
    {
      grade: "Challenger 2",
      level: "VIP 62",
      requiredBettingDollar: "4,097,000",
      levelUpBonus: "350",
    },
    {
      grade: "Challenger 3",
      level: "VIP 63",
      requiredBettingDollar: "4,737,000",
      levelUpBonus: "400",
    },
    {
      grade: "Challenger 4",
      level: "VIP 64",
      requiredBettingDollar: "5,377,000",
      levelUpBonus: "450",
    },
    {
      grade: "Challenger 5",
      level: "VIP 65",
      requiredBettingDollar: "6,017,000",
      levelUpBonus: "500",
    },
    {
      grade: "Challenger 6",
      level: "VIP 66",
      requiredBettingDollar: "6,657,000",
      levelUpBonus: "550",
    },
    {
      grade: "Challenger 7",
      level: "VIP 67",
      requiredBettingDollar: "7,297,000",
      levelUpBonus: "600",
    },
    {
      grade: "Challenger 8",
      level: "VIP 68",
      requiredBettingDollar: "7,937,000",
      levelUpBonus: "700",
    },
    {
      grade: "Challenger 9",
      level: "VIP 69",
      requiredBettingDollar: "8,577,000",
      levelUpBonus: "800",
    },
    {
      grade: "Challenger 10",
      level: "VIP 70",
      requiredBettingDollar: "9,217,000",
      levelUpBonus: "1,200",
    },
    {
      grade: "Challenger 11",
      level: "VIP 71",
      requiredBettingDollar: "10,625,000",
      levelUpBonus: "1,300",
    },
    {
      grade: "Challenger 12",
      level: "VIP 72",
      requiredBettingDollar: "12,033,000",
      levelUpBonus: "1,400",
    },
    {
      grade: "Challenger 13",
      level: "VIP 73",
      requiredBettingDollar: "13,441,000",
      levelUpBonus: "1,500",
    },
    {
      grade: "Challenger 14",
      level: "VIP 74",
      requiredBettingDollar: "14,849,000",
      levelUpBonus: "1,600",
    },
    {
      grade: "Challenger 15",
      level: "VIP 75",
      requiredBettingDollar: "16,257,000",
      levelUpBonus: "1,700",
    },
    {
      grade: "Challenger 16",
      level: "VIP 76",
      requiredBettingDollar: "17,665,000",
      levelUpBonus: "1,800",
    },
    {
      grade: "Challenger 17",
      level: "VIP 77",
      requiredBettingDollar: "19,073,000",
      levelUpBonus: "2,000",
    },
    {
      grade: "Challenger 18",
      level: "VIP 78",
      requiredBettingDollar: "20,481,000",
      levelUpBonus: "2,200",
    },
    {
      grade: "Challenger 19",
      level: "VIP 79",
      requiredBettingDollar: "23,553,000",
      levelUpBonus: "2,300",
    },
    {
      grade: "Challenger 20",
      level: "VIP 80",
      requiredBettingDollar: "26,625,000",
      levelUpBonus: "2,500",
    },
  ],
  elite: [
    {
      grade: "Elite 1",
      level: "VIP 81",
      requiredBettingDollar: "29,697,000",
      levelUpBonus: "2,600",
    },
    {
      grade: "Elite 2",
      level: "VIP 82",
      requiredBettingDollar: "32,769,000",
      levelUpBonus: "2,700",
    },
    {
      grade: "Elite 3",
      level: "VIP 83",
      requiredBettingDollar: "35,841,000",
      levelUpBonus: "2,800",
    },
    {
      grade: "Elite 4",
      level: "VIP 84",
      requiredBettingDollar: "38,913,000",
      levelUpBonus: "3,000",
    },
    {
      grade: "Elite 5",
      level: "VIP 85",
      requiredBettingDollar: "41,985,000",
      levelUpBonus: "3,200",
    },
    {
      grade: "Elite 6",
      level: "VIP 86",
      requiredBettingDollar: "45,057,000",
      levelUpBonus: "3,600",
    },
    {
      grade: "Elite 7",
      level: "VIP 87",
      requiredBettingDollar: "51,713,000",
      levelUpBonus: "4,000",
    },
    {
      grade: "Elite 8",
      level: "VIP 88",
      requiredBettingDollar: "58,369,000",
      levelUpBonus: "4,500",
    },
    {
      grade: "Elite 9",
      level: "VIP 89",
      requiredBettingDollar: "65,025,000",
      levelUpBonus: "5,000",
    },
    {
      grade: "Elite 10",
      level: "VIP 90",
      requiredBettingDollar: "71,681,000",
      levelUpBonus: "5,500",
    },
    {
      grade: "Elite 11",
      level: "VIP 91",
      requiredBettingDollar: "78,337,000",
      levelUpBonus: "6,000",
    },
    {
      grade: "Elite 12",
      level: "VIP 92",
      requiredBettingDollar: "84,993,000",
      levelUpBonus: "7,000",
    },
    {
      grade: "Elite 13",
      level: "VIP 93",
      requiredBettingDollar: "91,649,000",
      levelUpBonus: "8,000",
    },
    {
      grade: "Elite 14",
      level: "VIP 94",
      requiredBettingDollar: "98,305,000",
      levelUpBonus: "9,000",
    },
    {
      grade: "Elite 15",
      level: "VIP 95",
      requiredBettingDollar: "112,641,000",
      levelUpBonus: "10,000",
    },
    {
      grade: "Elite 16",
      level: "VIP 96",
      requiredBettingDollar: "126,977,000",
      levelUpBonus: "11,000",
    },
    {
      grade: "Elite 17",
      level: "VIP 97",
      requiredBettingDollar: "141,313,000",
      levelUpBonus: "12,000",
    },
    {
      grade: "Elite 18",
      level: "VIP 98",
      requiredBettingDollar: "155,649,000",
      levelUpBonus: "13,000",
    },
    {
      grade: "Elite 19",
      level: "VIP 99",
      requiredBettingDollar: "169,985,000",
      levelUpBonus: "15,000",
    },
    {
      grade: "Elite 20",
      level: "VIP 100",
      requiredBettingDollar: "184,321,000",
      levelUpBonus: "18,000",
    },
  ],
  master: [
    {
      grade: "Master 1",
      level: "VIP 101",
      requiredBettingDollar: "198,657,000",
      levelUpBonus: "20,000",
    },
    {
      grade: "Master 2",
      level: "VIP 102",
      requiredBettingDollar: "212,993,000",
      levelUpBonus: "23,000",
    },
    {
      grade: "Master 3",
      level: "VIP 103",
      requiredBettingDollar: "243,713,000",
      levelUpBonus: "26,000",
    },
    {
      grade: "Master 4",
      level: "VIP 104",
      requiredBettingDollar: "274,433,000",
      levelUpBonus: "28,000",
    },
    {
      grade: "Master 5",
      level: "VIP 105",
      requiredBettingDollar: "305,153,000",
      levelUpBonus: "31,000",
    },
    {
      grade: "Master 6",
      level: "VIP 106",
      requiredBettingDollar: "335,873,000",
      levelUpBonus: "35,000",
    },
    {
      grade: "Master 7",
      level: "VIP 107",
      requiredBettingDollar: "366,593,000",
      levelUpBonus: "38,000",
    },
    {
      grade: "Master 8",
      level: "VIP 108",
      requiredBettingDollar: "397,313,000",
      levelUpBonus: "40,000",
    },
    {
      grade: "Master 9",
      level: "VIP 109",
      requiredBettingDollar: "428,033,000",
      levelUpBonus: "42,000",
    },
    {
      grade: "Master 10",
      level: "VIP 110",
      requiredBettingDollar: "458,753,000",
      levelUpBonus: "45,000",
    },
    {
      grade: "Master 11",
      level: "VIP 111",
      requiredBettingDollar: "524,289,000",
      levelUpBonus: "48,000",
    },
    {
      grade: "Master 12",
      level: "VIP 112",
      requiredBettingDollar: "589,825,000",
      levelUpBonus: "50,000",
    },
    {
      grade: "Master 13",
      level: "VIP 113",
      requiredBettingDollar: "655,361,000",
      levelUpBonus: "53,000",
    },
    {
      grade: "Master 14",
      level: "VIP 114",
      requiredBettingDollar: "720,897,000",
      levelUpBonus: "56,000",
    },
    {
      grade: "Master 15",
      level: "VIP 115",
      requiredBettingDollar: "786,433,000",
      levelUpBonus: "60,000",
    },
    {
      grade: "Master 16",
      level: "VIP 116",
      requiredBettingDollar: "851,969,000",
      levelUpBonus: "65,000",
    },
    {
      grade: "Master 17",
      level: "VIP 117",
      requiredBettingDollar: "917,505,000",
      levelUpBonus: "70,000",
    },
    {
      grade: "Master 18",
      level: "VIP 118",
      requiredBettingDollar: "983,041,000",
      levelUpBonus: "75,000",
    },
    {
      grade: "Master 19",
      level: "VIP 119",
      requiredBettingDollar: "1,122,305,000",
      levelUpBonus: "80,000",
    },
    {
      grade: "Master 20",
      level: "VIP 120",
      requiredBettingDollar: "1,261,569,000",
      levelUpBonus: "90,000",
    },
  ],
  grandmaster: [
    {
      grade: "Grandmaster 1",
      level: "VIP 121",
      requiredBettingDollar: "1,400,833,000",
      levelUpBonus: "100,000",
    },
    {
      grade: "Grandmaster 2",
      level: "VIP 122",
      requiredBettingDollar: "1,540,097,000",
      levelUpBonus: "120,000",
    },
    {
      grade: "Grandmaster 3",
      level: "VIP 123",
      requiredBettingDollar: "1,679,361,000",
      levelUpBonus: "140,000",
    },
    {
      grade: "Grandmaster 4",
      level: "VIP 124",
      requiredBettingDollar: "1,818,625,000",
      levelUpBonus: "160,000",
    },
    {
      grade: "Grandmaster 5",
      level: "VIP 125",
      requiredBettingDollar: "1,957,889,000",
      levelUpBonus: "180,000",
    },
    {
      grade: "Grandmaster 6",
      level: "VIP 126",
      requiredBettingDollar: "2,097,153,000",
      levelUpBonus: "200,000",
    },
    {
      grade: "Grandmaster 7",
      level: "VIP 127",
      requiredBettingDollar: "2,392,065,000",
      levelUpBonus: "220,000",
    },
    {
      grade: "Grandmaster 8",
      level: "VIP 128",
      requiredBettingDollar: "2,686,977,000",
      levelUpBonus: "240,000",
    },
    {
      grade: "Grandmaster 9",
      level: "VIP 129",
      requiredBettingDollar: "2,981,889,000",
      levelUpBonus: "260,000",
    },
    {
      grade: "Grandmaster 10",
      level: "VIP 130",
      requiredBettingDollar: "3,276,801,000",
      levelUpBonus: "280,000",
    },
    {
      grade: "Grandmaster 11",
      level: "VIP 131",
      requiredBettingDollar: "3,571,713,000",
      levelUpBonus: "300,000",
    },
    {
      grade: "Grandmaster 12",
      level: "VIP 132",
      requiredBettingDollar: "3,866,625,000",
      levelUpBonus: "320,000",
    },
    {
      grade: "Grandmaster 13",
      level: "VIP 133",
      requiredBettingDollar: "4,161,537,000",
      levelUpBonus: "340,000",
    },
    {
      grade: "Grandmaster 14",
      level: "VIP 134",
      requiredBettingDollar: "4,456,449,000",
      levelUpBonus: "360,000",
    },
    {
      grade: "Grandmaster 15",
      level: "VIP 135",
      requiredBettingDollar: "5,079,041,000",
      levelUpBonus: "380,000",
    },
    {
      grade: "Grandmaster 16",
      level: "VIP 136",
      requiredBettingDollar: "5,701,633,000",
      levelUpBonus: "400,000",
    },
    {
      grade: "Grandmaster 17",
      level: "VIP 137",
      requiredBettingDollar: "6,324,225,000",
      levelUpBonus: "420,000",
    },
    {
      grade: "Grandmaster 18",
      level: "VIP 138",
      requiredBettingDollar: "6,946,817,000",
      levelUpBonus: "440,000",
    },
    {
      grade: "Grandmaster 19",
      level: "VIP 139",
      requiredBettingDollar: "7,569,409,000",
      levelUpBonus: "460,000",
    },
    {
      grade: "Grandmaster 20",
      level: "VIP 140",
      requiredBettingDollar: "8,192,001,000",
      levelUpBonus: "480,000",
    },
  ],
  legend: [
    {
      grade: "Legend 1",
      level: "VIP 141",
      requiredBettingDollar: "8,814,593,000",
      levelUpBonus: "500,000",
    },
    {
      grade: "Legend 2",
      level: "VIP 142",
      requiredBettingDollar: "9,437,185,000",
      levelUpBonus: "520,000",
    },
    {
      grade: "Legend 3",
      level: "VIP 143",
      requiredBettingDollar: "10,747,905,000",
      levelUpBonus: "540,000",
    },
    {
      grade: "Legend 4",
      level: "VIP 144",
      requiredBettingDollar: "12,058,625,000",
      levelUpBonus: "560,000",
    },
  ],
};
