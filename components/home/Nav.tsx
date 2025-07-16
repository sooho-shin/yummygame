"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetCommon } from "@/querys/common";
import { useCommonStore } from "@/stores/useCommon";
import { useUserStore } from "@/stores/useUser";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useMouse } from "react-use";
import styles from "./styles/nav.module.scss";
import VersionToggle from "./VersionToggle";
import classNames from "classnames";
import { Router } from "next/router";

type nameType =
  | "redeem"
  | "partner"
  | "liveSupport"
  | "notice"
  | "transactions"
  | "setting"
  | "wallet"
  | "profile"
  | "mypage"
  | "casino"
  | "challenges"
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
  | "poker"
  | "baccarat"
  | "card"
  | "providerroulette"
  | "original"
  | "favorites"
  | "recent"
  | "airdrop"
  | "vip"
  | "plinko"
  | "limbo"
  | "provider"
  | "lottery"
  | "mainCasino"
  | "sports"
  | "mybets"
  | "soccer"
  | "basketball"
  | "tennis"
  | "icehockey"
  | "baseball"
  | "volleyball"
  | "handball"
  | "americanfootball"
  | "esports"
  | "tabletennis";

type NavLinkType = {
  title: string;
  href?: string;
  name?: nameType;
  dropdown?: {
    title: string;
    href?: string;
    name?: nameType;
    sub?: string;
    blank?: boolean;
    onClick?: () => void;
    dropdown?: {
      title: string;
      href?: string;
      name?: nameType;
      sub?: string;
      blank?: boolean;
      onClick?: () => void;
    }[];
  }[];
  sub?: string;
  blank?: boolean;
  onClick?: () => void;
};
export default function Nav() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { checkMedia, defaultLang, isTopBanner } = useCommonHook();
  const { token } = useUserStore();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const { openModal } = useModalHook();
  const { swipeState, setSwipeState } = useCommonStore();
  const searchParams = useSearchParams();
  const fullURL = useMemo(() => {
    return `${pathname}${searchParams ? "?" + searchParams.toString() : ""}`;
  }, [pathname, searchParams]);

  // useEffect(() => {
  //   console.log("바뀜");
  // }, [fullURL]);

  useEffect(() => {
    if (checkMedia === "mobile") {
      setSwipeState(false);
    }
  }, [searchParams]);

  const { data: user } = useGetCommon(token);

  const [cookies] = useCookies();

  const t = useDictionary();

  const providerList: NavLinkType[] = [
    { title: t("home_26"), href: "/provider/card", name: "card" },
    {
      title: t("home_27"),
      href: "/provider/providerroulette",
      name: "providerroulette",
    },
    {
      title: t("home_69"),
      href: "/provider/lottery",
      name: "lottery",
    },
    { title: t("home_24"), href: "/provider/poker", name: "poker" },
    // {
    //   title: t("home_62"),
    //   href: "/provider/livecasino",
    //   name: "livecasino",
    // },
  ];

  const gameList: NavLinkType[] = [
    {
      title: t("home_37"),
      href: "/provider/original",
      name: "original",
      dropdown: [
        { title: t("home_11"), href: "/game/crash", name: "crash" },
        { title: t("game_69"), href: "/game/plinko", name: "plinko" },
        { title: t("home_12"), href: "/game/wheel", name: "wheel" },
        { title: t("home_13"), href: "/game/roulette", name: "roulette" },
        { title: t("home_14"), href: "/game/flip", name: "flip" },
        { title: t("home_15"), href: "/game/dice", name: "dice" },
        {
          title: t("home_16"),
          href: "/game/ultimatedice",
          name: "ultimatedice",
        },
        { title: t("home_17"), href: "/game/mine", name: "mine" },
        { title: t("game_74"), href: "/game/limbo", name: "limbo" },
      ],
    },
    { title: t("home_21"), href: "/provider/hotgames", name: "hotgames" },
    { title: t("home_67"), href: "/providers", name: "provider" },
    { title: t("home_22"), href: "/provider/slots", name: "slots" },
    {
      title: t("common_12"),
      href: "/provider/livecasino",
      name: "casino",
      dropdown: providerList,
    },
  ];

  const sportsList: NavLinkType[] = useMemo(() => {
    const commonLinks: NavLinkType[] = [
      { title: t("home_72"), href: "/sports?bt-path=%2Fbets", name: "mybets" },
      {
        title: t("home_73"),
        href: "/sports?bt-path=%2Fsoccer-1",
        name: "soccer",
      },
      {
        title: t("home_74"),
        href: "/sports?bt-path=%2Fbasketball-2",
        name: "basketball",
      },
      {
        title: t("home_75"),
        href: "/sports?bt-path=%2Ftennis-5",
        name: "tennis",
      },
      {
        title: t("home_76"),
        href: "/sports?bt-path=%2Fice-hockey-4",
        name: "icehockey",
      },
      {
        title: t("home_77"),
        href: "/sports?bt-path=%2Ftable-tennis-20",
        name: "tabletennis",
      },
      {
        title: t("home_78"),
        href: "/sports?bt-path=%2Fbaseball-3",
        name: "baseball",
      },
      {
        title: t("home_79"),
        href: "/sports?bt-path=%2Fvolleyball-23",
        name: "volleyball",
      },
      {
        title: t("home_80"),
        href: "/sports?bt-path=%2Fhandball-6",
        name: "handball",
      },
      {
        title: t("home_81"),
        href: "/sports?bt-path=%2Famerican-football-16",
        name: "americanfootball",
      },
      {
        title: t("home_82"),
        href: "/sports?bt-path=%2Fe_sport%2F300",
        name: "esports",
      },
    ];

    if (token) {
      return [
        {
          title: t("home_18"),
          href: "/sports?bt-path=%2Ffavorites",
          name: "favorites",
        },
        ...commonLinks,
      ];
    }

    return commonLinks;
  }, [token]);

  const favoritesList: NavLinkType[] = [
    { title: t("home_18"), href: "/favorites", name: "favorites" },
    { title: t("home_19"), href: "/recent", name: "recent" },
  ];

  const bonusList: NavLinkType[] = useMemo(() => {
    if (
      cookies.tracking === "000K" ||
      (token &&
        user?.result?.userType &&
        user?.result?.userType === "USER_000K")
    ) {
      return [
        { title: t("home_28"), href: "/bonus", name: "bonus" },
        { title: t("home_29"), href: "/affiliate", name: "affiliate" },
      ];
    } else {
      return [
        { title: t("home_28"), href: "/bonus", name: "bonus" },
        { title: t("home_29"), href: "/affiliate", name: "affiliate" },
        { title: t("home_49"), href: "/vip", name: "vip" },
      ];
    }
  }, [cookies.tracking, hydrated, user]);

  const telegramParam = searchParams.get("tg");
  const mypageList: NavLinkType[] = useMemo(() => {
    if (user && user.result?.userInfo?.isPartner) {
      if (telegramParam && telegramParam === "telegram") {
        return [
          {
            title: t("home_38"),
            // href: "/bonus",
            name: "profile",
            onClick: () => openModal({ type: "profile" }),
          },
          {
            title: t("home_39"),
            name: "wallet",
            onClick: () => openModal({ type: "wallet" }),
          },
          {
            title: t("home_63"),
            name: "transactions",
            onClick: () => openModal({ type: "transactions" }),
          },
          {
            title: t("home_59"),
            name: "redeem",
            onClick: () => openModal({ type: "redeem" }),
          },
          {
            title: t("home_45"),
            name: "partner",
            href: process.env.NEXT_PUBLIC_PARTNER_URL,
            blank: true,
          },
          {
            title: t("home_40"),
            name: "setting",
            href: "/accountsetting",
          },
        ];
      } else {
        return [
          {
            title: t("home_38"),
            // href: "/bonus",
            name: "profile",
            onClick: () => openModal({ type: "profile" }),
          },
          {
            title: t("home_39"),
            name: "wallet",
            onClick: () => openModal({ type: "wallet" }),
          },
          {
            title: t("home_63"),
            name: "transactions",
            onClick: () => openModal({ type: "transactions" }),
          },
          {
            title: t("home_59"),
            name: "redeem",
            onClick: () => openModal({ type: "redeem" }),
          },
          {
            title: t("home_45"),
            name: "partner",
            href: process.env.NEXT_PUBLIC_PARTNER_URL,
            blank: true,
          },
        ];
      }
    } else {
      return [
        {
          title: t("home_38"),
          // href: "/bonus",
          name: "profile",
          onClick: () => openModal({ type: "profile" }),
        },
        {
          title: t("home_39"),
          name: "wallet",
          onClick: () => openModal({ type: "wallet" }),
        },
        {
          title: t("home_63"),
          name: "transactions",
          onClick: () => openModal({ type: "transactions" }),
        },
        {
          title: t("home_59"),
          name: "redeem",
          onClick: () => openModal({ type: "redeem" }),
        },
        {
          title: t("home_40"),
          name: "setting",
          href: "/accountsetting",
        },
      ];
    }
  }, [user]);

  // const supportList: NavLinkType[] = [
  //   { title: t("home_49"), href: "/vip", name: "vip" },
  //   { title: t("home_30"), href: "/fairness", name: "fair" },
  //   {
  //     title: t("home_31"),
  //     href: "https://help.yummygame.io/support/solutions",
  //     name: "support",
  //     blank: true,
  //   },
  // ];

  const [isFirstRender, setIsFirstRender] = useState(false);

  useEffect(() => {
    if (isFirstRender) {
      if ((checkMedia === "mobile" || checkMedia === "tablet") && hydrated) {
        setSwipeState(false);
      } else {
        setSwipeState(true);
      }
    } else {
      if (checkMedia === "mobile" && hydrated) {
        setSwipeState(false);
      } else {
        setSwipeState(true);
      }
    }
    if (!isFirstRender && hydrated) {
      setIsFirstRender(true);
    }
  }, [checkMedia, hydrated, pathname]);

  const settingList: NavLinkType[] = [
    {
      title: t("home_32"),
      href: "/test",
      name: "language",
      sub: defaultLang.toLocaleUpperCase(),
      onClick: () =>
        openModal({
          type: "setting",
          props: {
            modalTab: "language",
          },
        }),
    },
    {
      title: t("home_33"),
      href: "/test",
      name: "displayFiat",
      sub: cookies.displayFiat ? cookies.fiat.toString().toUpperCase() : "OFF",
      onClick: () =>
        openModal({
          type: "setting",
          props: {
            modalTab: "displayFiat",
          },
        }),
    },
    {
      title: t("home_65"),
      name: "liveSupport",
      onClick: () => {
        if (window.fcWidget) {
          // window.fcWidget.show();
          window.fcWidget.open();
        }
      },
    },
  ];
  // const { mutate } = useGetUserLogout();
  // const [, , removeCookie] = useCookies();

  // const logOut = async () => {
  //   mutate(
  //     // @ts-ignore
  //     {},
  //     {
  //       onSuccess(data, variables, context) {
  //         if (data.code === 0) {
  //           signOut();
  //           logout();
  //           refetch();
  //           removeCookie("token", CookieOption);
  //           router.refresh();
  //         }
  //       },
  //     },
  //   );
  // };
  const [fixedText, setFixedText] = useState<string | null>(null);
  const { elX, elY } = useMouse(ref);
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <>
      <div className={styles["bottom-nav"]}>
        <button
          type="button"
          onClick={() => setSwipeState(!swipeState)}
          className={swipeState ? styles.active : ""}
        >
          <span>
            <span className={`${styles.menu}`}></span>
          </span>
          <span className={styles.title}>{t("home_34")}</span>
        </button>
        <MobileNavLink
          data={{ title: t("home_28"), href: "/bonus", name: "bonus" }}
        />
        {/*<Link*/}
        {/*  href={`/${defaultLang}`}*/}
        {/*  className={`${*/}
        {/*    pathname ===*/}
        {/*    (cookies?.lang?.toString().toLocaleLowerCase()*/}
        {/*      ? "/" + cookies?.lang?.toString().toLocaleLowerCase()*/}
        {/*      : `/${defaultLang}`)*/}
        {/*      ? styles.active*/}
        {/*      : ""*/}
        {/*  }`}*/}
        {/*>*/}
        {/*  <span>*/}
        {/*    <span className={`${styles.home}`}></span>*/}
        {/*  </span>*/}
        {/*  <span className={`${styles.title} `}>{t("home_35")}</span>*/}
        {/*</Link>*/}

        <MobileNavLink
          data={{
            title: t("home_70"),
            href: "/casino",
            name: "casino",
          }}
        />

        <MobileNavLink
          data={{
            title: t("home_71"),
            href: "/sports",
            name: "sports",
          }}
        />

        <MobileNavLink
          data={{
            title: t("home_61"),
            href: "/airdrop",
            name: "airdrop",
          }}
        />

        {/* <MobileNavLink
          data={{
            title: t("modal_100"),
            // href: "/airdrop",
            onClick() {
              setIsShowNotice(!isShowNotice);
            },
            name: "notice",
          }}
        /> */}
      </div>

      {ref.current &&
        elY > 0 &&
        elX > 0 &&
        elX < ref.current?.clientWidth &&
        checkMedia !== "mobile" &&
        !swipeState && (
          <div
            className={styles["fixed-box"]}
            style={{ left: elX + 10, top: elY + (isTopBanner ? 100 : 60) }}
          >
            {fixedText}
          </div>
        )}

      <div
        className={classNames(styles["nav-wrapper"], {
          [styles.submenu]: showSubmenu,
          [styles.hide]: !swipeState,
        })}
      >
        <div
          className={`${!swipeState ? styles.hide : ""} ${
            isTopBanner && hydrated ? styles.main : ""
          }`}
          ref={ref}
        >
          <div className={styles["banner-group"]}>
            {/*{checkMedia === "mobile" && hydrated && <VersionToggle />}*/}
            <Link href={"/airdrop"}>
              <LazyLoadImage
                alt={"img"}
                onMouseOver={() => setFixedText(t("home_60"))}
                src={"/images/nav/img_yyg_border.webp"}
              />
              <div>
                <p>
                  <span>Yummygame</span> (YYG)
                </p>
                <p>Point Airdrop Event!</p>
              </div>
            </Link>
          </div>
          {/*<div className={styles["banner-group"]}>*/}
          {/*  <button*/}
          {/*    type={"button"}*/}
          {/*    className={styles.spin}*/}
          {/*    onClick={() => openModal({ type: token ? "spin" : "getstarted" })}*/}
          {/*  >*/}
          {/*    <LazyLoadImage*/}
          {/*      alt={"img"}*/}
          {/*      onMouseOver={() => setFixedText(t("home_68"))}*/}
          {/*      src={"/images/nav/ico_spin.webp"}*/}
          {/*    />*/}
          {/*    <p>{t("home_68")}</p>*/}
          {/*  </button>*/}
          {/*</div>*/}
          <nav>
            {/*{token && hydrated && (*/}
            {/*  <ul>*/}
            {/*    {favoritesList.map(c => {*/}
            {/*      return (*/}
            {/*        <NavComponent*/}
            {/*          setFixedText={setFixedText}*/}
            {/*          data={c}*/}
            {/*          key={c.name}*/}
            {/*        />*/}
            {/*      );*/}
            {/*    })}*/}
            {/*  </ul>*/}
            {/*)}*/}
            <ul className={styles["no-padding"]}>
              <NavComponent
                data={{
                  title: t("home_70"),
                  dropdown:
                    token && hydrated
                      ? [...favoritesList, ...gameList]
                      : gameList,
                  name: "mainCasino",
                  href: "/casino",
                }}
                setFixedText={setFixedText}
                // dropdownDefaultState={true}
                setShowSubmenu={setShowSubmenu}
              />
            </ul>
            <ul className={styles["no-padding"]}>
              <NavComponent
                data={{
                  title: t("home_71"),
                  dropdown: sportsList,
                  name: "sports",
                  href: "/sports",
                }}
                setFixedText={setFixedText}
                // dropdownDefaultState={true}
                setShowSubmenu={setShowSubmenu}
              />
            </ul>

            {/*<li>*/}
            {/*  <button*/}
            {/*    type="button"*/}
            {/*    style={{*/}
            {/*      opacity: 0.3,*/}
            {/*      pointerEvents: "none",*/}
            {/*      cursor: "pointer",*/}
            {/*    }}*/}
            {/*    onMouseOver={() => setFixedText(t("home_66"))}*/}
            {/*  >*/}
            {/*    <span>*/}
            {/*      <span className={`${styles.challenges}`}></span>*/}
            {/*    </span>*/}
            {/*    <span className={styles.title}>{t("home_66")}</span>*/}
            {/*  </button>*/}
            {/*</li>*/}
            {/*<NavComponent*/}
            {/*  setFixedText={setFixedText}*/}
            {/*  data={{*/}
            {/*    title: t("home_21"),*/}
            {/*    href: "/provider/hotgames",*/}
            {/*    name: "hotgames",*/}
            {/*  }}*/}
            {/*/>*/}

            {/*<ul className={styles["no-padding"]}>*/}
            {/*  <NavComponent*/}
            {/*    data={{*/}
            {/*      title: t("common_12"),*/}
            {/*      dropdown: providerList,*/}
            {/*      name: "casino",*/}
            {/*    }}*/}
            {/*    setFixedText={setFixedText}*/}
            {/*    // dropdownDefaultState={true}*/}
            {/*  />*/}
            {/*</ul>*/}
            {hydrated && (
              <ul>
                {bonusList.map(c => {
                  return (
                    <NavComponent
                      setFixedText={setFixedText}
                      data={c}
                      key={c.title}
                    />
                  );
                })}
              </ul>
            )}

            <ul>
              {hydrated &&
                settingList.map(c => {
                  return (
                    <NavComponent
                      setFixedText={setFixedText}
                      data={c}
                      key={c.title}
                    />
                  );
                })}
            </ul>
            {user?.result && (
              <ul className={styles["no-padding"]}>
                <NavComponent
                  data={{
                    title: t("home_64"),
                    dropdown: mypageList,
                    name: "mypage",
                  }}
                  setFixedText={setFixedText}
                />
              </ul>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

const NavComponent = ({
  data,
  setFixedText,
  dropdownDefaultState = false,
  setShowSubmenu,
}: {
  data: NavLinkType;
  setFixedText: Dispatch<SetStateAction<string | null>>;
  dropdownDefaultState?: boolean;
  setShowSubmenu?: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullURL = useMemo(() => {
    return `${pathname}${searchParams ? "?" + searchParams.toString() : ""}`;
  }, [pathname, searchParams]);
  const isActive =
    fullURL.includes(data.href || "nothing") && !fullURL.includes("policies");
  const [dropdownState, setDropdownState] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const [firstDropdownState, setFirstDropdownState] =
    useState(dropdownDefaultState);

  const isHrefContains = useCallback(
    (
      arr: {
        title: string;
        href?: string | undefined;
        name?: nameType | undefined;
        sub?: string | undefined;
        blank?: boolean | undefined;
        onClick?: (() => void) | undefined;
        dropdown?: {
          title: string;
          href?: string;
          name?: nameType;
          sub?: string;
          blank?: boolean;
          onClick?: () => void;
          dropdown?: {
            title: string;
            href?: string;
            name?: nameType;
            sub?: string;
            blank?: boolean;
            onClick?: () => void;
          }[];
        }[];
      }[],
      targetString: string,
      test?: boolean,
    ): boolean => {
      return arr.some(obj => {
        if (obj.href && targetString.includes(obj.href)) {
          return true;
        }
        if (obj.dropdown) {
          return isHrefContains(obj.dropdown, targetString);
        }
        return false;
      });
    },
    [],
  );

  const defaultLang = useMemo(() => {
    const segments = pathname.split("/");
    return segments[1];
  }, [pathname]);

  useEffect(() => {
    if (firstDropdownState && pathname === "/" + defaultLang) {
      setDropdownState(true);
      setFirstDropdownState(false);
    } else {
      // console.log(data.title);
      // console.log(fullURL);
      // console.log(data.href);
      if (
        (data.dropdown && isHrefContains(data.dropdown, fullURL)) ||
        (data.href && fullURL.includes(data.href))
      ) {
        setDropdownState(true);
      } else {
        setDropdownState(false);
      }
    }
  }, [pathname]);

  const { checkMedia } = useCommonHook();
  const { swipeState, setSwipeState } = useCommonStore();
  const navRef = useRef(null);
  const { elX, elY } = useMouse(dropRef);
  const router = useRouter();
  const [clickedURL, setClickedURL] = useState<string | null>(fullURL);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    setClickedURL(fullURL);
  }, [fullURL]);

  useEffect(() => {
    if (!pathname.includes("sports")) {
      setClickedURL(null);
    }
  }, [pathname]);

  return (
    <li key={data.name}>
      {data.dropdown ? (
        <div
          className={classNames(styles["dropdown-row"], {
            [styles.active]: dropdownState,
          })}
          ref={dropRef}
        >
          {hydrated && (
            <div
              className={classNames(styles["dropdown-parent"], {
                [styles.active]: dropdownState,
              })}
            >
              <button
                type="button"
                className={
                  dropdownState ||
                  isActive ||
                  isHrefContains(data.dropdown, fullURL)
                    ? styles.active
                    : ""
                }
                onMouseOver={() => setFixedText(data.title)}
                onClick={() => {
                  if (data.href) {
                    router.push(data.href);
                  } else {
                    setDropdownState(!dropdownState);
                  }
                }}
              >
                <span className={styles.ico}>
                  <span
                    className={`${styles[data.name as nameType]} ${
                      isActive ? styles.active : ""
                    }`}
                  ></span>
                </span>
                <span className={styles.title}>{data.title}</span>
                {/*<button type={'button'} className={styles.arrow}></button>*/}
              </button>
              <button
                className={styles.arrow}
                type={"button"}
                onClick={() =>
                  !swipeState
                    ? router.push(data.href ?? "/")
                    : setDropdownState(!dropdownState)
                }
              ></button>
            </div>
          )}
          {dropdownState && (
            <ul style={{ top: dropRef.current?.offsetHeight + "px" }}>
              {data.dropdown.map((c, i) => {
                return (
                  <li key={i}>
                    {c.blank ? (
                      <a
                        href={`${c.href}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`${
                          fullURL.includes(c.href || "nothing")
                            ? styles.active
                            : ""
                        }`}
                        onMouseOver={() => setFixedText(c.title)}
                      >
                        <span className={styles.ico}>
                          <span
                            className={`${styles[c.name as nameType]} ${
                              fullURL.includes(c.href || "nothing")
                                ? styles.active
                                : ""
                            }`}
                          ></span>
                        </span>
                        <span className={styles.title}>{c.title}</span>
                        {c.sub && <span className={styles.sub}>{c.sub}</span>}
                      </a>
                    ) : c.onClick ? (
                      <button
                        onClick={c.onClick}
                        className={`${
                          fullURL.includes(c.href || "nothing")
                            ? styles.active
                            : ""
                        }`}
                        onMouseOver={() => setFixedText(c.title)}
                      >
                        <span className={styles.ico}>
                          <span
                            className={`${styles[c.name as nameType]} ${
                              fullURL.includes(c.href || "nothing")
                                ? styles.active
                                : ""
                            }`}
                          ></span>
                        </span>
                        <span className={styles.title}>{c.title}</span>
                        {c.sub && <span className={styles.sub}>{c.sub}</span>}
                      </button>
                    ) : (
                      //여기 고쳐야함
                      <div
                        // type="button"
                        className={`${
                          (!fullURL.includes("sports") &&
                            fullURL.includes(c.href || "nothing")) ||
                          (c.dropdown &&
                            isHrefContains(c.dropdown, fullURL, true)) ||
                          (fullURL.includes("sports") &&
                            clickedURL &&
                            clickedURL.includes(c.href ?? "nothing"))
                            ? styles.active
                            : ""
                        } ${styles["dropdown-link"]}`}
                        style={{
                          pointerEvents: fullURL.includes(c.href || "nothing")
                            ? "auto"
                            : "auto",
                          cursor: "pointer",
                        }}
                        onMouseOver={() => {
                          c.dropdown && setShowSubmenu && setShowSubmenu(true);
                          setFixedText(c.title);
                        }}
                        onMouseLeave={() => {
                          c.dropdown && setShowSubmenu && setShowSubmenu(false);
                        }}
                        // onClick={() => {
                        //   console.log("????");
                        //   // router.push(c.href ?? "");
                        //   // checkMedia === "mobile" &&
                        //   //   fullURL.includes(c.href || "nothing") &&
                        //   //   setSwipeState(false);
                        // }}
                      >
                        {/*스포츠 고치려면 여기 고쳐야함*/}
                        <CustomLink
                          href={c.href ?? ""}
                          setClickedURL={setClickedURL}
                        >
                          <span className={styles.ico}>
                            <span
                              className={`${styles[c.name as nameType]} ${
                                fullURL.includes(c.href || "nothing")
                                  ? styles.active
                                  : ""
                              }`}
                            ></span>
                          </span>
                          <span
                            className={classNames(styles.title, {
                              [styles.active]:
                                c.dropdown &&
                                isHrefContains(c.dropdown, fullURL),
                            })}
                          >
                            {c.title}
                          </span>
                          {c.sub && <span className={styles.sub}>{c.sub}</span>}
                          {/*{c.}*/}
                          {c.dropdown && <span className={styles.arrow}></span>}
                        </CustomLink>
                        {c.dropdown && (
                          <div
                            className={styles["side-menu"]}
                            // style={{
                            //   left: elX + 10,
                            //   top: elY,
                            // }}
                          >
                            <div>
                              <ul>
                                {c.dropdown.map(c => {
                                  return <SideMenu key={c.title} c={c} />;
                                })}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : data.blank ? (
        <a
          href={`${data.href}`}
          target="_blank"
          rel="noreferrer"
          className={`${isActive ? styles.active : ""}`}
          onMouseOver={() => setFixedText(data.title)}
        >
          <span className={styles.ico}>
            <span
              className={`${styles[data.name as nameType]} ${
                isActive ? styles.active : ""
              }`}
            ></span>
          </span>
          <span className={styles.title}>{data.title}</span>
          {data.sub && <span className={styles.sub}>{data.sub}</span>}
        </a>
      ) : data.onClick ? (
        <button
          onClick={data.onClick}
          className={`${isActive ? styles.active : ""}`}
          onMouseOver={() => setFixedText(data.title)}
        >
          <span className={styles.ico}>
            {" "}
            <span
              className={`${styles[data.name as nameType]} ${
                isActive ? styles.active : ""
              }`}
            ></span>
          </span>
          <span className={styles.title}>{data.title}</span>
          {data.sub && <span className={styles.sub}>{data.sub}</span>}
        </button>
      ) : (
        <Link
          rel="preload"
          href={`${data.href}`}
          className={`${isActive ? styles.active : ""}`}
          style={{
            pointerEvents: isActive ? "auto" : "auto",
            cursor: "pointer",
          }}
          onMouseOver={() => setFixedText(data.title)}
          onClick={() => {
            checkMedia === "mobile" && isActive && setSwipeState(false);
          }}
        >
          <span className={styles.ico}>
            <span
              className={`${styles[data.name as nameType]} ${
                isActive ? styles.active : ""
              }`}
            ></span>
          </span>
          <span className={styles.title}>{data.title}</span>
          {data.sub && <span className={styles.sub}>{data.sub}</span>}
        </Link>
      )}
    </li>
  );
};

const SideMenu = ({
  c,
}: {
  c: {
    title: string;
    href?: string;
    name?: nameType;
    sub?: string;
    blank?: boolean;
    onClick?: () => void;
  };
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullURL = useMemo(() => {
    return `${pathname}${searchParams ? "?" + searchParams.toString() : ""}`;
  }, [pathname, searchParams]);
  const [hovered, setHovered] = useState(false);

  return (
    <li key={c.title}>
      <Link
        href={c.href ?? "/"}
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={event => {
          event.stopPropagation(); // 버튼의 클릭 이벤트가 실행되지 않도록 버블링 방지
        }}
      >
        <LazyLoadImage
          src={`/images/nav/${c.name}_${
            fullURL.includes(c.href ?? "") || hovered ? "r" : "a"
          }.svg`}
        />

        <span
          className={classNames(styles.title, {
            [styles.active]: fullURL.includes(c.href ?? "") || hovered,
          })}
        >
          {c.title}
        </span>
      </Link>
    </li>
  );
};

const MobileNavLink = ({ data }: { data: NavLinkType }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullURL = useMemo(() => {
    return `${pathname}${searchParams ? "?" + searchParams.toString() : ""}`;
  }, [pathname, searchParams]);
  const isActive = fullURL.includes(data.href || "nothing");
  const { isShowChat } = useCommonStore();

  return (
    <>
      {data.onClick ? (
        <button
          type="button"
          className={`${isActive && !isShowChat ? styles.active : ""}`}
          onClick={data.onClick}
        >
          <span
            style={{ backgroundImage: `url(/images/header/ico_notice.svg)` }}
            className={`${styles[data.name as nameType]}`}
          ></span>
          <span className={`${styles.title}`}>{data.title}</span>
        </button>
      ) : (
        <Link
          href={data.href ?? "/"}
          className={`${isActive && !isShowChat ? styles.active : ""}`}
        >
          <span>
            <span className={`${styles[data.name as nameType]}`}></span>
          </span>
          <span className={`${styles.title}`}>{data.title}</span>
        </Link>
      )}
    </>
  );
};

function CustomLink({
  href,
  setClickedURL,
  children,
}: {
  href: string;
  setClickedURL: Dispatch<SetStateAction<string | null>>;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { swipeState, setSwipeState } = useCommonStore();
  const { checkMedia } = useCommonHook();

  const handleClick = (e: any) => {
    if (href.includes("sports") && pathname.includes("sports")) {
      setClickedURL(href);
      e.preventDefault();
      const path = href.split("bt-path=")[1];
      const url = "./sports?bt-path=" + path;
      history.pushState(null, "", url);
      window.dispatchEvent(new Event("popstate"));
      checkMedia === "mobile" && setSwipeState(false);
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
