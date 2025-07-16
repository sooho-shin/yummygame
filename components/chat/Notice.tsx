"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetDirectMessage, useGetNotice } from "@/querys/chat";
import { useCommonStore } from "@/stores/useCommon";
import { useSocketStore } from "@/stores/useSocket";
import { NoticeData } from "@/types/chat";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useImmer } from "use-immer";
import styles from "./styles/chat.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CookieOption } from "@/utils";
import useModalHook from "@/hooks/useModalHook";
import { useUserStore } from "@/stores/useUser";
import { useGetCommon } from "@/querys/common";
import {
  useGetBonusClaimCount,
  useGetBonusStatisticsVer2,
} from "@/querys/bonus";
import { usePathname } from "next/navigation";

export default function Notice() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  dayjs.extend(utc);
  const { isShowNotice, isShowChat, setIsShowNotice } = useCommonStore();
  const { data: noticeListData } = useGetNotice();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [, setCookie, removeCookie] = useCookies();
  const { isTopBanner, showToast } = useCommonHook();
  const t = useDictionary();
  const { token } = useUserStore();
  const { refetch: refetchDirectMassageData } = useGetDirectMessage(token);
  const { isOpen, type } = useModalHook();
  const { refetch: refetchUserData } = useGetCommon(token);
  const { refetch: refetchCountBonusData } = useGetBonusClaimCount(token);
  const { refetch: refetchBonusData } = useGetBonusStatisticsVer2(token);

  const freshDesk = useMemo(() => {
    if (!hydrated) return;
    return document ? document.getElementById("fc_frame") : null;
  }, [hydrated]);

  useEffect(() => {
    if (freshDesk) {
      if (isShowNotice || isShowChat) {
        freshDesk.style.right = "364px";
      } else {
        freshDesk.style.right = "40px";
      }
    }
  }, [isShowNotice, isShowChat]);

  const { cacheStreamSocket } = useSocketStore();
  const [customList, setCustomList] = useImmer<NoticeData[]>([]);
  useEffect(() => {
    if (noticeListData && noticeListData.result) {
      setCustomList(noticeListData.result);
    }
  }, [noticeListData]);

  useEffect(() => {
    if (!cacheStreamSocket) return () => false;

    if (!cacheStreamSocket.connected) {
      cacheStreamSocket.connect();
    }

    // notification 공지사항

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cacheStreamSocket.on("notification", (socket: any) => {
      // 현재 날짜를 가져옴
      const currentDate = new Date();

      // 현재 날짜에 100년을 더함
      const futureDate = new Date(currentDate);
      futureDate.setFullYear(currentDate.getFullYear() + 100);
      if (!isShowNotice) {
        setCookie("newNotice", "new", CookieOption);
      }
      setCustomList(data => {
        if (customList.length >= 100) {
          data.pop();
        }
        data.unshift(socket);
      });
    });

    cacheStreamSocket.on("direct.message", () => {
      if (token) {
        refetchDirectMassageData();
        refetchUserData();
      }
    });

    cacheStreamSocket.on("reward.fetch", () => {
      if (token) {
        showToast(t("toast_16"));
        refetchCountBonusData();
        refetchBonusData();
      }
    });

    cacheStreamSocket.on("sports.bet", () => {
      if (token) {
        refetchUserData();
      }
    });

    return () => {
      cacheStreamSocket.off("notification");
    };
  }, [cacheStreamSocket, isShowNotice]);
  const [sortedArray, setSortedArray] = useState<NoticeData[]>([]);

  useEffect(() => {
    const arr = customList.concat();

    setSortedArray(arr);
  }, [customList]);
  useEffect(() => {
    if (isShowNotice) {
      removeCookie("newNotice", CookieOption);
    }
  }, [isShowNotice]);

  return (
    <div
      className={`${styles.wrapper} ${isShowNotice ? styles.active : ""} ${
        isTopBanner ? styles.main : ""
      }`}
    >
      <div className={styles.top}>
        <button
          className={styles["close-btn"]}
          type="button"
          onClick={() => {
            setIsShowNotice(false);
          }}
        ></button>
        <span>{t("chat_15")}</span>
      </div>
      <div
        className={styles.scroll}
        ref={scrollContainerRef}
        id="scrollNotice"
        onScroll={e => {
          e.stopPropagation();
        }}
      >
        {sortedArray.map((c, i) => {
          return (
            <div className={styles["notice-box"]} key={i}>
              <p className={styles.date}>
                {dayjs(c.create_date).utc().format("YY/MM/DD HH:mm:ss")}
              </p>
              <p className={styles.title}>{c.title}</p>
              {c.image_url && (
                <div className={styles.img}>
                  <LazyLoadImage
                    width={"100%"}
                    alt="img notice"
                    src={c.image_url}
                  />
                </div>
              )}
              <pre>{c.content}</pre>
              {c.link && (
                <Link href={c.link}>
                  <span>{t("chat_16")}</span>
                  <span></span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
