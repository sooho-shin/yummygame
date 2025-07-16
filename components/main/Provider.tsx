"use client";

import { useDictionary } from "@/context/DictionaryContext";
import { useGetMainThirdParty } from "@/querys/main";
import { ProviderDataType } from "@/types/main";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles/mainWrapper.module.scss";
// Import Swiper styles
import { categoryGameType, categoryType } from "@/types/provider";
import { getCategoryHrefName } from "@/utils";
import classNames from "classnames";
import { scroller } from "react-scroll";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useImmer } from "use-immer";
import ProviderGameLinkButtonBox from "../provider/GameLinkButtonBox";
import MainOriginal from "./Original";
import { useWindowScroll } from "react-use";
import { customConsole } from "@/utils";
import useModalHook from "@/hooks/useModalHook";
import { preloadImage } from "@/utils/imagePreload";
import ProviderRow from "@/components/main/ProviderRow";
import { useUserStore } from "@/stores/useUser";
import useCommonHook from "@/hooks/useCommonHook";

export default function MainProvider() {
  const { data: thirdPartyData } = useGetMainThirdParty();
  const [hydrated, setHydrated] = useState(false);
  const { token } = useUserStore();

  useEffect(() => setHydrated(true), []);
  const t = useDictionary();

  const naviBtnArray: {
    title: string;
    name:
      | "original"
      | "hotgames"
      | "slots"
      | "livecasino"
      | "poker"
      | "card"
      | "providerroulette";
    id: categoryType;
  }[] = [
    {
      title: t("home_21"),
      name: "hotgames",
      id: "hot",
    },
    {
      title: t("main_4"),
      name: "original",
      id: "0",
    },
    // {
    //   title: t("home_20"),
    //   name: "newReleases",
    //   id: 35,
    // },
    // {
    //   title: t("home_22"),
    //   name: "slots",
    //   id: "slots",
    // },
    // {
    //   title: t("home_24"),
    //   name: "poker",
    //   id: "poker",
    // },
    // {
    //   title: t("home_25"),
    //   name: "baccarat",
    //   id: 1364,
    // },
    // {
    //   title: t("home_62"),
    //   name: "livecasino",
    //   id: "live",
    // },
    // {
    //   title: t("home_26"),
    //   name: "card",
    //   id: "card",
    // },
    // {
    //   title: t("home_27"),
    //   name: "providerroulette",
    //   id: "roulette",
    // },
  ];
  const { checkMedia } = useCommonHook();

  return (
    <div className={styles["main-provider-wrapper"]}>
      <ProviderRow
        title={t("home_21")}
        name={"hotgames"}
        categoryCode={"hot"}
        providerData={thirdPartyData?.result["hot"]}
      />
      <div className={styles["link-group-container"]}>
        <div className={styles.top}>
          <div className={classNames(styles.flex, styles.division)}>
            <Link
              href={"/casino"}
              style={{
                backgroundImage: `url('/images/main/link/casino.webp')`,
              }}
              className={styles["link-content"]}
            >
              <p>CASINO GAMES</p>
              <div>
                <p>
                  Enjoy the thrill of slots, live casino, and original games!
                </p>
              </div>
            </Link>
          </div>
          <div className={classNames(styles.flex, styles.division)}>
            <Link
              href={"/sports"}
              style={{
                backgroundImage: `url('/images/main/link/sports.webp')`,
              }}
              className={styles["link-content"]}
            >
              <p>SPORT GAMES</p>
              <div>
                <p>Feel the thrill of sports betting now on YummyGame!</p>
              </div>
            </Link>
          </div>
        </div>
        {checkMedia === "desktop" ? (
          <div className={styles.bottom}>
            {hydrated && (
              <div className={classNames(styles["fix-width"], styles.division)}>
                {token ? (
                  <>
                    <Link
                      href={"/favorites"}
                      style={{
                        backgroundImage: `url('/images/main/link/favorite.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>FAVORITES</p>
                    </Link>
                    <Link
                      href={"/vip"}
                      style={{
                        backgroundImage: `url('/images/main/link/vip_s.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>VIP PROGRAMS</p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/vip"}
                      style={{
                        backgroundImage: `url('/images/main/link/vip.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p>VIP PROGRAMS</p>
                    </Link>
                  </>
                )}
              </div>
            )}
            {hydrated && (
              <div className={classNames(styles["fix-width"], styles.division)}>
                {token ? (
                  <>
                    <Link
                      href={"/recent"}
                      style={{
                        backgroundImage: `url('/images/main/link/recent.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>RECENT</p>
                    </Link>
                    <Link
                      href={"/bonus"}
                      style={{
                        backgroundImage: `url('/images/main/link/bonus.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>BONUS</p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/affiliate"}
                      style={{
                        backgroundImage: `url('/images/main/link/affiliate.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>AFFILIATE</p>
                    </Link>
                    <Link
                      href={"/bonus"}
                      style={{
                        backgroundImage: `url('/images/main/link/bonus.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>BONUS</p>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.bottom}>
            {hydrated && (
              <div
                className={classNames(styles["fix-width"], styles.division, {
                  [styles.flex]: !token,
                })}
              >
                {token ? (
                  <>
                    <Link
                      href={"/favorites"}
                      style={{
                        backgroundImage: `url('/images/main/link/favorite.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>FAVORITES</p>
                    </Link>
                    <Link
                      href={"/vip"}
                      style={{
                        backgroundImage: `url('/images/main/link/vip_s.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>VIP PROGRAMS</p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/vip"}
                      style={{
                        backgroundImage: `url('/images/main/link/vip_s.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p>VIP PROGRAMS</p>
                    </Link>
                  </>
                )}
                {token ? (
                  <>
                    <Link
                      href={"/recent"}
                      style={{
                        backgroundImage: `url('/images/main/link/recent.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>RECENT</p>
                    </Link>
                    <Link
                      href={"/bonus"}
                      style={{
                        backgroundImage: `url('/images/main/link/bonus.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>BONUS</p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/affiliate"}
                      style={{
                        backgroundImage: `url('/images/main/link/affiliate.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>AFFILIATE</p>
                    </Link>
                    <Link
                      href={"/bonus"}
                      style={{
                        backgroundImage: `url('/images/main/link/bonus.webp')`,
                      }}
                      className={styles["link-content"]}
                    >
                      <p className={styles.small}>BONUS</p>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <ProviderRow
        title={"TRENDING SPORTS"}
        name={"sports"}
        categoryCode={"sports"}
      />
      <ProviderRow title={t("main_4")} name={"original"} categoryCode={"0"} />
      );
      {/*{naviBtnArray.map(*/}
      {/*  (c: { title: string; name: string; id: categoryType }) => {*/}
      {/*    if (c.id === "0") {*/}
      {/*    }*/}
      {/*    return (*/}
      {/*      <Row*/}
      {/*        key={c.id}*/}
      {/*        title={c.title}*/}
      {/*        providerData={thirdPartyData?.result[c.id]}*/}
      {/*        name={c.name as nameType}*/}
      {/*        categoryCode={c.id as categoryType}*/}
      {/*      />*/}
      {/*    );*/}
      {/*  },*/}
      {/*)}*/}
    </div>
  );
}

type nameType =
  | "crash"
  | "wheel"
  | "roulette"
  | "flip"
  | "dice"
  | "ultimatedice"
  | "mine"
  | "bonus"
  | "affiliate"
  | "fair"
  | "support"
  | "language"
  | "displayFiat"
  | "newReleases"
  | "hotgames"
  | "slots"
  | "livecasino"
  | "providerroulette"
  | "original";
