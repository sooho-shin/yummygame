"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ProviderDataType } from "@/types/main";
import { categoryType, gameNameType } from "@/types/provider";
import { useDictionary } from "@/context/DictionaryContext";
import { preloadImage } from "@/utils/imagePreload";
import styles from "@/components/main/styles/mainWrapper.module.scss";
import classNames from "classnames";
// import styles from "./styles/mainWrapper.module.scss";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import ProviderGameLinkButtonBox from "@/components/provider/GameLinkButtonBox";
import { useGetProviders } from "@/querys/provider";

const ProviderRow = ({
  providerData,
  title,
  name,
  categoryCode,
}: {
  providerData?: ProviderDataType[] | undefined | null;
  title?: string;
  name: gameNameType;
  categoryCode: categoryType;
}) => {
  const swiperRef = useRef<any>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState<number>(0);
  const showNumber = 8;
  const t = useDictionary();
  // const intersectionRef = React.useRef(null);

  const originalGameList: (
    | "crash"
    | "wheel"
    | "classic_dice"
    | "roulette"
    | "ultimate_dice"
    | "mines"
    | "coin_flip"
    | "plinko"
    | "limbo"
  )[] = [
    "crash",
    "plinko",
    "wheel",
    "classic_dice",
    "roulette",
    "ultimate_dice",
    "mines",
    "coin_flip",
    "limbo",
  ];
  const { data: provider } = useGetProviders();

  const providerList = useMemo(() => {
    if (!provider || !provider.result) return [];
    return [
      {
        idx: 0,
        provider_name: "yummygame",
        provider_real_name: "yummygame",
        img_url: "/images/provider/main/img_provider_yummygame.png",
      },
      ...provider.result,
    ];
  }, [provider]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (providerData) {
      const imagesPromiseList: Promise<any>[] = [];
      for (const data of providerData) {
        // image_change_path ||
        // image_full_path ||
        // `/images/provider/original/${game_id}.webp`
        imagesPromiseList.push(
          preloadImage(
            data.image_change_path ||
              data.image_full_path ||
              `/images/provider/original/${data.game_id}.webp`,
          ),
        );
      }
      const loadCall = async () => {
        await Promise.all(imagesPromiseList);
        // console.log(imagesPromiseList);
        // setWholeLoadingState(false);
      };
      loadCall();
    }
  }, [providerData]);

  const getGameHref = useCallback((gameType: string): string => {
    switch (gameType.toLocaleLowerCase()) {
      case "crash":
        return "crash";
      case "wheel":
        return "wheel";
      case "roulette":
        return "roulette";
      case "classic_dice":
        return "dice";
      case "ultimate_dice":
        return "ultimatedice";
      // case "mines":
      //   return "mine";
      case "mines":
        return "mine";
      case "coin_flip":
        return "flip";
      default:
        return gameType;
    }
  }, []);
  const gameInfoData = {
    crash: {
      label: t("home_11"),
      hash: [t("home_53"), t("home_54")],
    },
    plinko: {
      label: t("game_69"),
      hash: [],
    },
    wheel: {
      label: t("home_12"),
      hash: [t("home_55"), t("home_56"), t("home_57")],
    },
    roulette: {
      label: t("home_13"),
      hash: [t("home_58")],
    },
    classic_dice: {
      label: t("home_15"),
      hash: [],
    },
    ultimate_dice: {
      label: t("home_16"),
      hash: [],
    },
    mines: {
      label: t("home_17"),
      hash: [],
    },
    coin_flip: {
      label: t("home_14"),
      hash: [],
    },
    limbo: {
      label: t("game_74"),
      hash: [],
    },
  };

  const originalData = [
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "1",
      mobile_page_code: null,
      rtp: "99.0000",
      game_name: "Crash",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_crash.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_crash.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "2",
      mobile_page_code: null,
      rtp: "97.0000",
      game_name: "Wheel",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_wheel.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_wheel.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "3",
      mobile_page_code: null,
      rtp: "97.3000",
      game_name: "Roulette",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_roulette.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_roulette.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "4",
      mobile_page_code: null,
      rtp: "99.0000",
      game_name: "Coin Flip",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_coin-flip.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_coin-flip.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "5",
      mobile_page_code: null,
      rtp: "99.0000",
      game_name: "Dice",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_dice.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_dice.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "6",
      mobile_page_code: null,
      rtp: "99.0000",
      game_name: "Ultimate Dice",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_ultimate-dice.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_ultimate-dice.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "7",
      mobile_page_code: null,
      rtp: "99.0000",
      game_name: "Mines",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_mines.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_mines.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "8",
      mobile_page_code: null,
      rtp: "99.0000",
      game_name: "Plinko",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_plinko.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_plinko.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
    {
      system: null,
      sub_system: null,
      page_code: null,
      game_id: "9",
      mobile_page_code: null,
      rtp: "99.0000",
      game_name: "Limbo",
      image_full_path:
        "https://cdn.yummygame.io/original-img/img_original_limbo.webp",
      image_change_path:
        "https://cdn.yummygame.io/original-img/img_original_limbo.webp",
      status: "1",
      game_status: "1",
      has_demo: null,
      provider_name: "Yummy Original",
      game_type: "original",
    },
  ];

  const sportsData = [
    {
      href: "/sports?bt-path=%2Fsoccer-1",
      name: "soccer",
    },
    {
      href: "/sports?bt-path=%2Fbasketball-2",
      name: "basketball",
    },
    {
      href: "/sports?bt-path=%2Fice-hockey-4",
      name: "icehockey",
    },
    {
      href: "/sports?bt-path=%2Ftennis-5",
      name: "tennis",
    },
    {
      href: "/sports?bt-path=%2Fbaseball-3",
      name: "baseball",
    },
    {
      href: "/sports?bt-path=%2Ftable-tennis-20",
      name: "tabletennis",
    },
    {
      href: "/sports?bt-path=%2Famerican-football-16",
      name: "americanfootball",
    },
    {
      href: "/sports?bt-path=%2Fvolleyball-23",
      name: "volleyball",
    },
    {
      href: "/sports?bt-path=%2Fe_sport%2F300",
      name: "esports",
    },
    {
      href: "/sports?bt-path=%2Fdarts-22",
      name: "dart",
    },
    {
      href: "/sports?bt-path=%2Fcricket-21",
      name: "cricket",
    },
    {
      href: "/sports?bt-path=%2Fhandball-6",
      name: "handball",
    },
  ];

  // E-sports / Dart / Cricket / Handball

  if (categoryCode === "provider") {
    return (
      <div className={styles.row} id={name} ref={rowRef}>
        <div className={classNames(styles.top, styles["original-top"])}>
          <div className={styles["title-with-info"]}>
            <div className={`${styles.title}`}>
              <span
                style={{ backgroundImage: `url(/images/nav/${name}_r.svg)` }}
              ></span>
              <span>{title}</span>
            </div>
            {/*<p className={styles.info}>{t("main_5")}</p>*/}
          </div>
          <div className={styles.navigation}>
            <Link href={`/providers`} className={styles["view-all-btn"]}>
              <span>{t("main_3")}</span>
            </Link>

            <div className={styles["btn-group"]}>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex - showNumber,
                    );
                }}
                disabled={activeSwiperIndex === 0}
              ></button>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex + showNumber,
                    );
                }}
                disabled={activeSwiperIndex >= providerList.length - showNumber}
              ></button>
            </div>
          </div>
        </div>

        <div className={styles["row-swiper-container"]}>
          <Swiper
            // cssMode={true}

            pagination={false}
            mousewheel={true}
            keyboard={true}
            slidesPerView={showNumber}
            spaceBetween={8}
            ref={swiperRef}
            className={styles["slider-area"]}
            onSlideChange={e => {
              setActiveSwiperIndex(e.activeIndex);
            }}
          >
            {providerList.map((c, i) => {
              return (
                <SwiperSlide key={i}>
                  <ProviderGameLinkButtonBox
                    data={c}
                    key={i}
                    className={styles.box}
                    itemKey={i}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className={styles["scroll-area"]}>
            <div>
              {providerList.map((c, i) => {
                return (
                  <ProviderGameLinkButtonBox
                    data={c}
                    key={i}
                    className={styles.box}
                    itemKey={i}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categoryCode === "sports") {
    return (
      <div className={styles.row} id={name} ref={rowRef}>
        <div className={classNames(styles.top, styles["original-top"])}>
          <div className={styles["title-with-info"]}>
            <div className={`${styles.title}`}>
              <span
                style={{ backgroundImage: `url(/images/nav/${name}_r.svg)` }}
              ></span>
              <span>{title}</span>
            </div>
            {/*<p className={styles.info}>{t("main_5")}</p>*/}
          </div>
          <div className={styles.navigation}>
            {/*<Link href={`/sports`} className={styles["view-all-btn"]}>*/}
            {/*  <span>{t("main_3")}</span>*/}
            {/*</Link>*/}

            <div className={styles["btn-group"]}>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex - showNumber,
                    );
                }}
                disabled={activeSwiperIndex === 0}
              ></button>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex + showNumber,
                    );
                }}
                disabled={activeSwiperIndex >= sportsData.length - showNumber}
              ></button>
            </div>
          </div>
        </div>

        <div className={styles["row-swiper-container"]}>
          <Swiper
            // cssMode={true}

            pagination={false}
            mousewheel={true}
            keyboard={true}
            slidesPerView={showNumber}
            spaceBetween={8}
            ref={swiperRef}
            className={styles["slider-area"]}
            onSlideChange={e => {
              setActiveSwiperIndex(e.activeIndex);
            }}
          >
            {sportsData.map((c, i) => {
              return (
                <SwiperSlide key={i}>
                  <ProviderGameLinkButtonBox
                    data={c}
                    key={i}
                    className={styles.box}
                    itemKey={i}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className={styles["scroll-area"]}>
            <div>
              {sportsData.map((c, i) => {
                return (
                  <ProviderGameLinkButtonBox
                    data={c}
                    key={i}
                    className={styles.box}
                    itemKey={i}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categoryCode === "0") {
    return (
      <div className={styles.row} id={name} ref={rowRef}>
        <div className={classNames(styles.top, styles["original-top"])}>
          <div className={styles["title-with-info"]}>
            <div className={`${styles.title}`}>
              <span
                style={{ backgroundImage: `url(/images/nav/${name}_r.svg)` }}
              ></span>
              <span>{title}</span>
            </div>
            {/*<p className={styles.info}>{t("main_5")}</p>*/}
          </div>
          <div className={styles.navigation}>
            <Link
              href={`/provider/original`}
              className={styles["view-all-btn"]}
            >
              <span>{t("main_3")}</span>
            </Link>

            <div className={styles["btn-group"]}>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex - showNumber,
                    );
                }}
                disabled={activeSwiperIndex === 0}
              ></button>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex + showNumber,
                    );
                }}
                disabled={
                  activeSwiperIndex >= originalGameList.length - showNumber
                }
              ></button>
            </div>
          </div>
        </div>

        <div className={styles["row-swiper-container"]}>
          <Swiper
            // cssMode={true}

            pagination={false}
            mousewheel={true}
            keyboard={true}
            slidesPerView={showNumber}
            spaceBetween={8}
            ref={swiperRef}
            className={styles["slider-area"]}
            onSlideChange={e => {
              setActiveSwiperIndex(e.activeIndex);
            }}
          >
            {originalData.map((c, i) => {
              return (
                <SwiperSlide key={i}>
                  <ProviderGameLinkButtonBox
                    data={c}
                    key={i}
                    className={styles.box}
                    itemKey={i}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className={styles["scroll-area"]}>
            <div>
              {originalData.map((c, i) => {
                return (
                  <ProviderGameLinkButtonBox
                    data={c}
                    key={i}
                    className={styles.box}
                    itemKey={i}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.row} id={name} ref={rowRef}>
        <div className={styles.top}>
          <div className={styles.title}>
            <span
              style={{ backgroundImage: `url(/images/nav/${name}_r.svg)` }}
            ></span>
            <span>{title}</span>
          </div>
          <div className={styles.navigation}>
            <Link
              href={`/provider/${categoryCode.toString()}`}
              className={styles["view-all-btn"]}
            >
              <span>{t("main_3")}</span>
            </Link>

            <div className={styles["btn-group"]}>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex - showNumber,
                    );
                }}
                disabled={activeSwiperIndex === 0}
                aria-label="이전 슬라이드로 이동"
              ></button>
              <button
                type="button"
                onClick={() => {
                  swiperRef.current &&
                    swiperRef.current.swiper.slideTo(
                      activeSwiperIndex + showNumber,
                    );
                }}
                disabled={
                  !providerData ||
                  activeSwiperIndex >= providerData.length - showNumber
                }
                aria-label="이후 슬라이드로 이동"
              ></button>
            </div>
          </div>
        </div>
        <div className={styles["row-swiper-container"]}>
          {providerData ? (
            <>
              <Swiper
                // cssMode={true}
                mousewheel={true}
                pagination={false}
                keyboard={true}
                slidesPerView={showNumber}
                spaceBetween={8}
                ref={swiperRef}
                className={styles["slider-area"]}
                speed={500} // 슬라이드 전환 애니메이션 시간 (밀리초)
                onSlideChange={e => {
                  setActiveSwiperIndex(e.activeIndex);
                }}
              >
                {providerData.map((c, i) => {
                  return (
                    <SwiperSlide key={i}>
                      <ProviderGameLinkButtonBox
                        data={c}
                        key={i}
                        className={styles.box}
                        itemKey={i}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <div className={styles["scroll-area"]}>
                <div>
                  {providerData.map((c, i) => {
                    return (
                      <ProviderGameLinkButtonBox
                        data={c}
                        key={i}
                        className={styles.box}
                        itemKey={i}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className={styles["skeleton-container"]}>
              <div>
                <div className={styles.skeleton}></div>
                <div className={styles.skeleton}></div>
                <div className={styles.skeleton}></div>
                <div className={styles.skeleton}></div>
                <div className={styles.skeleton}></div>
                <div className={styles.skeleton}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default ProviderRow;
