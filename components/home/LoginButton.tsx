"use client";

import { signOut } from "@/lib/firebase";
// import { useModalStore } from "@/stores/useModal";
import { useUserStore } from "@/stores/useUser";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import styles from "./styles/header.module.scss";

import useModalHook from "@/hooks/useModalHook";
import { useClickAway } from "react-use";
// import { userCommonGnbDataType } from "@/types/user";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetCommon } from "@/querys/common";
import { useGetUserLogout } from "@/querys/user";
import { CookieOption } from "@/utils";
import { useCookies } from "react-cookie";
import CommonToolTip from "../common/ToolTip";
import { motion } from "framer-motion";
import { usePostBonusSpinDo } from "@/querys/bonus";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useCommonStore } from "@/stores/useCommon";

export default function LoginButton() {
  const router = useRouter();
  // const { openModal } = useModalHook();
  const { logout, token } = useUserStore();
  const [dropdownState, setDropdownState] = useState(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  const { amountToDisplayFormat, checkMedia } = useCommonHook();

  const { data: user, refetch } = useGetCommon(token);
  const { openModal } = useModalHook();
  const { mutate } = useGetUserLogout();
  const [, , removeCookie] = useCookies();
  const t = useDictionary();
  const { setIsShowChat, setIsShowNotice, isShowChat, isShowNotice } =
    useCommonStore();

  const searchParams = useSearchParams();
  const telegramParam = searchParams.get("tg");
  const logOut = async () => {
    mutate(undefined, {
      onSuccess(data) {
        if (data.code === 0) {
          signOut();
          logout();
          refetch();
          removeCookie("token", CookieOption);
          router.refresh();
        }
      },
    });
  };
  const userDropDownLiList = useMemo<
    {
      title: string;
      class: string;
      href?: string;
      target?: string;
      onClick?: () => void;
      division?: boolean;
    }[]
  >(() => {
    const commonItems = [
      { title: t("home_4"), class: "profile", href: "profile" },
      { title: t("home_5"), class: "transactions", href: "transactions" },
      { title: t("home_6"), class: "wallet", href: "wallet" },
      { title: t("home_59"), class: "redeem", href: "redeem", division: true },
      { title: t("home_7"), class: "bonus", href: "/bonus" },
      {
        title: t("home_8"),
        class: "affiliate",
        href: "/affiliate",
        division: !(user && user.result?.userInfo?.isPartner),
      },
      {
        title: t("home_45"),
        class: "partner",
        href: process.env.NEXT_PUBLIC_PARTNER_URL,
        target: "_blank",
        division: !!(user && user.result?.userInfo?.isPartner),
      },
      { title: t("home_9"), class: "settings", href: "/accountsetting" },
    ];

    const mobileOnlyItems = [
      { title: "Direct Message", class: "message", href: "directMassage" },
      {
        title: "Notification",
        class: "notification",
        onClick: () => setIsShowNotice(true),
      },
    ];

    return checkMedia === "mobile"
      ? [...commonItems, ...mobileOnlyItems]
      : commonItems;
  }, [checkMedia, user]);

  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });

  const getGradeClassName = () => {
    if (!user) {
      return "bronze";
    }
    const string = user.result.userInfo.currentVipGroup;
    if (string?.includes("BRONZE")) {
      return "bronze";
    }
    if (string?.includes("SILVER")) {
      return "silver";
    }
    if (string?.includes("GOLD")) {
      return "gold";
    }
    if (string?.includes("PLATINUM")) {
      return "platinum";
    }
    if (string?.includes("DIAMOND")) {
      return "diamond";
    }
    return "bronze";
  };

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      // rotateX: 0,
      transition: {
        duration: 0.3,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      // rotateX: -15,
      transition: {
        duration: 0.3,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  return (
    <>
      <div className={styles["user-container"]} ref={dropboxRef}>
        <button
          className={`${styles.user} ${
            user && user.result ? styles.active : styles["not-login"]
          }`}
          type="button"
          onClick={() => {
            if (!user || !user.result) {
              openModal({
                type: "getstarted",
              });
            } else {
              setDropdownState(!dropdownState);
            }
          }}
        >
          {user && user.result ? (
            <span
              style={{
                backgroundImage: `url('/images/avatar/img_avatar_${user.result.userInfo.avatarIdx}.webp')`,
              }}
              className={styles.avatar}
            ></span>
          ) : (
            <div className={styles["login-btn"]}>
              <span>{t("common_51")}</span>
            </div>
          )}
        </button>
        {user && user.result && (
          <motion.div
            className={styles["user-container-detail"]}
            initial={{
              display: "none",
            }}
            animate={dropdownState ? "enter" : "exit"}
            variants={subMenuAnimate}
          >
            <div className={styles.top}>
              <div className={styles["user-info"]}>
                <span className={styles.avatar}>
                  <span
                    style={{
                      backgroundImage: `url('/images/avatar/img_avatar_${user.result.userInfo.avatarIdx}.webp')`,
                    }}
                  ></span>
                </span>
                <span className={styles.name}>
                  {user.result.userInfo.nickname}
                </span>
                {/* <span className={styles.level}>
                  Lv.{user.result.userInfo.currentVipLevel}
                </span> */}
              </div>
              <div className={styles["user-grade"]}>
                <div>
                  <span
                    className={`${styles.ico} ${
                      // @ts-ignore
                      styles[user.result.userInfo.currentVipGroup.toLowerCase()]
                    }`}
                  ></span>
                  <span className={styles.grade}>
                    {user.result.userInfo.currentVipGroup}
                  </span>
                  <span className={styles.level}>
                    Lv.{user.result.userInfo.currentVipLevel}
                  </span>
                </div>

                <div>
                  <span className={styles.percent}>
                    {user.result.userInfo.currentExperience}%
                  </span>
                  <CommonToolTip
                    tooltipText={`${amountToDisplayFormat(
                      null,
                      "jel",
                      user.result.userInfo.needLevelUpWager,
                    )} until Lv.${user.result.userInfo.nextVipLevel}`}
                  />
                </div>
              </div>
              <div className={styles["grade-progress-bar"]}>
                <div
                  className={styles.bar}
                  style={{
                    width: user.result.userInfo.currentExperience + "%",
                  }}
                ></div>
              </div>
              <div className={styles["next-level-row"]}>
                <span>
                  {amountToDisplayFormat(
                    null,
                    "jel",
                    user.result.userInfo.currentUserWager,
                  )}
                </span>
              </div>
            </div>
            <ul>
              {userDropDownLiList.map(c => {
                if (c.target) {
                  if (user && user.result.userInfo?.isPartner) {
                    return (
                      <Li
                        data={c}
                        key={c.title}
                        onClick={() => {
                          setDropdownState(false);
                        }}
                      />
                    );
                  } else {
                    <></>;
                  }
                } else {
                  return (
                    <Li
                      data={c}
                      key={c.title}
                      onClick={() => {
                        setDropdownState(false);
                      }}
                    />
                  );
                }
              })}
            </ul>

            {!(telegramParam && telegramParam === "telegram") && (
              <button
                type="button"
                onClick={() => {
                  logOut();
                  setDropdownState(false);
                }}
                className={styles.logout}
              >
                <LazyLoadImage
                  src={"/images/nav/logout.svg"}
                  alt={"img logout"}
                />
                <span>{t("home_10")}</span>
              </button>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}

type IcoClassNameType =
  | "profile"
  | "wallet"
  | "bonus"
  | "affiliate"
  | "settings"
  | "transactions"
  | "logout"
  | "redeem";

const Li = ({
  data,
  onClick,
}: {
  data: {
    title: string;
    class: string;
    href?: string | undefined;
    target?: string | null | undefined;
    onClick?: () => void;
    division?: boolean;
  };
  onClick: () => void;
}) => {
  function startsWithQuestionMark(input: string): boolean {
    return input.length > 0 && input.charAt(0) !== "/";
  }

  const { routeWithParams } = useCommonHook();
  const { openModal } = useModalHook();

  // if (!data.href) return <></>;
  return (
    <li onClick={onClick}>
      {data.target ? (
        <a href={data.href} target="_blank" rel="noreferrer">
          <span className={styles[data.class as IcoClassNameType]}></span>
          <span>{data.title}</span>
        </a>
      ) : startsWithQuestionMark(data.href ?? "") || data.onClick ? (
        <button
          type="button"
          onClick={() => {
            data.onClick
              ? data.onClick()
              : openModal({
                  type: data.href ?? "getstarted",
                });
          }}
        >
          <span className={styles[data.class as IcoClassNameType]}></span>
          <span>{data.title}</span>
        </button>
      ) : (
        <Link href={data.href ?? "/"}>
          <span className={styles[data.class as IcoClassNameType]}></span>
          <span>{data.title}</span>
        </Link>
      )}
      {data.division && (
        <div className={styles.division}>
          <span></span>
        </div>
      )}
    </li>
  );
};
