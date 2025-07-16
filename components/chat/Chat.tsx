"use client";

import { useCommonStore } from "@/stores/useCommon";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import styles from "./styles/chat.module.scss";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetChat, usePostChat } from "@/querys/chat";
import { useGetCommon } from "@/querys/common";
import { useSocketStore } from "@/stores/useSocket";
import { useUserStore } from "@/stores/useUser";
import { ChatData } from "@/types/chat";
import { CookieOption, validateByte } from "@/utils";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { animateScroll } from "react-scroll";
import TextareaAutosize from "react-textarea-autosize";
import { useScroll } from "react-use";
import { useImmer } from "use-immer";

export default function Chat() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  dayjs.extend(utc);
  const t = useDictionary();

  const { isShowChat, setIsShowChat, isShowNotice } = useCommonStore();
  const { token } = useUserStore();
  const { data: user } = useGetCommon(token);
  const [text, setText] = useState<string | null>(null);
  const { mutate: postChat } = usePostChat();
  const { data: chatListData } = useGetChat();
  const [customList, setCustomList] = useImmer<ChatData[]>([]);
  const { openModal } = useModalHook();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [, setCookie, removeCookie] = useCookies();
  const { isTopBanner } = useCommonHook();

  useEffect(() => {
    if (chatListData && chatListData.result) {
      setCustomList(chatListData.result);
    }
  }, [chatListData]);

  // fc_frame

  useEffect(() => {
    const freshDesk = document.getElementById("fc_frame");
    if (freshDesk) {
      if (isShowNotice || isShowChat) {
        freshDesk.style.right = "364px";
      } else {
        freshDesk.style.right = "40px";
      }
    }
  }, [isShowNotice, isShowChat]);

  const { cacheStreamSocket } = useSocketStore();
  const { showErrorMessage } = useCommonHook();

  useEffect(() => {
    if (!cacheStreamSocket) return () => false;

    if (!cacheStreamSocket.connected) {
      cacheStreamSocket.connect();
    }

    // notification 공지사항

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cacheStreamSocket.on("chat", (socket: any) => {
      // 현재 날짜를 가져옴
      const currentDate = new Date();

      // 현재 날짜에 100년을 더함
      const futureDate = new Date(currentDate);
      futureDate.setFullYear(currentDate.getFullYear() + 100);
      if (!isShowChat) {
        setCookie("newChat", "new", { ...CookieOption, expires: futureDate });
      }
      setCustomList(data => {
        if (customList.length >= 100) {
          data.pop();
        }
        data.unshift(socket);
      });
    });

    return () => {
      cacheStreamSocket.off("chat");
    };
  }, [cacheStreamSocket, isShowChat]);

  useEffect(() => {
    !token && setText(null);
  }, [token]);

  const [enterPressState, setEnterPressState] = useState(true);

  useEffect(() => {
    if (!enterPressState) {
      setTimeout(() => {
        setEnterPressState(true);
      }, 3100);
    }
  }, [enterPressState]);

  const scrollToBottom = () => {
    // animateScroll 모듈을 사용하여 스크롤을 맨 아래로 내림
    animateScroll.scrollToBottom({
      containerId: "scroll", // 스크롤을 적용할 컨테이너의 ID
      duration: 0, // 스크롤 애니메이션의 지속 시간 (밀리초)
      delay: 0, // 애니메이션 시작 전의 딜레이 (밀리초)
      // smooth: "easeInOutQuint", // 애니메이션 이징 설정
    });
  };
  const sendChat = () => {
    if (!text || !enterPressState) {
      return false;
    }

    postChat(
      {
        messageType: "GENERAL",
        message: text?.trim(),
      },
      {
        onSuccess(data) {
          showErrorMessage(data.code);
          if (data.code === 0) {
            setText(null);
            scrollToBottom();
          }
        },
      },
    );
  };

  const { y } = useScroll(scrollContainerRef);

  useEffect(() => {
    if (isShowChat && y === 0) {
      removeCookie("newChat", CookieOption);
    }
  }, [isShowChat, y]);

  return (
    <div
      className={`${styles.wrapper} ${isShowChat ? styles.active : ""} ${
        isTopBanner ? styles.main : ""
      }`}
    >
      <div className={styles.top}>
        <button
          className={styles["close-btn"]}
          type="button"
          onClick={() => {
            setIsShowChat(false);
          }}
        ></button>
        <span>{t("chat_1")}</span>
      </div>
      <div
        className={`${styles.scroll} ${styles.chat}`}
        id="scroll"
        ref={scrollContainerRef}
        onScroll={e => {
          e.stopPropagation();
        }}
      >
        {customList.map(c => {
          return <ChatBox key={c.idx} data={c} />;
        })}
      </div>
      <div className={styles["chat-input-container"]}>
        <div className={styles["input-box"]}>
          <div
            className={`${styles["input-area"]} ${
              text?.trim() ? styles.active : ""
            } ${
              !token ||
              !user ||
              !(
                user &&
                user.result &&
                user.result.userInfo.currentVipLevel >= 2
              )
                ? styles.disabled
                : ""
            }`}
          >
            {hydrated && (
              <TextareaAutosize
                maxRows={4}
                placeholder={
                  !token ||
                  !user ||
                  !(
                    user &&
                    user.result &&
                    user.result.userInfo.currentVipLevel >= 2
                  )
                    ? t("chat_2")
                    : t("chat_3")
                }
                // style={{ height: !text ? 21 : 0 }}
                value={text ?? ""}
                disabled={
                  !token ||
                  !user ||
                  !(
                    user &&
                    user.result &&
                    user.result.userInfo.currentVipLevel >= 2
                  )
                }
                onKeyDown={e => {
                  if (e.keyCode === 13 && e.shiftKey === false) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
                onChange={e => {
                  if (!e.target.value) {
                    setText(null);
                    return false;
                  }

                  if (!validateByte(e.target.value, 300)) {
                    setText(text);
                  } else {
                    setText(e.target.value);
                  }
                }}
              />
            )}
            <button
              type="button"
              className={`${styles["send-btn"]}`}
              onClick={() => {
                sendChat();
              }}
              disabled={
                !text ||
                !enterPressState ||
                !token ||
                !user ||
                !(
                  user &&
                  user.result &&
                  user.result.userInfo.currentVipLevel >= 2
                )
              }
            ></button>
          </div>
          <div className={styles["rules-row"]}>
            <div className={styles["popup-box"]}>
              <span className={styles.text}>{t("chat_4")}</span>
              <button
                type="button"
                className={styles["btn-tooltip"]}
                onClick={() => {
                  openModal({
                    type: "alert",
                    alertData: {
                      title: t("chat_4"),
                      children: (
                        <>
                          <ul className={styles["chat-rules-box"]}>
                            <li>
                              <span>{t("chat_5")}</span>
                            </li>
                            <li>
                              <span>{t("chat_6")}</span>
                            </li>
                            <li>
                              <span>{t("chat_7")}</span>
                            </li>
                            <li>
                              <span>{t("chat_8")}</span>
                            </li>
                            <li>
                              <span>{t("chat_9")}</span>
                            </li>
                            <li>
                              <span>{t("chat_10")}</span>
                            </li>
                            <li>
                              <span>{t("chat_11")}</span>
                            </li>
                            <li>
                              <span>{t("chat_12")}</span>
                            </li>
                          </ul>
                        </>
                      ),
                    },
                  });
                }}
              ></button>
            </div>
            <div className={styles["text-length-box"]}>
              {validateByte(text?.trim() ?? "", 300) ?? 300} / 300
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatBox = ({ data }: { data: ChatData }) => {
  const { amountToDisplayFormat } = useCommonHook();
  const ref = useRef<HTMLDivElement>(null);
  const { openModal } = useModalHook();
  const t = useDictionary();

  const getGameHref = (gameType: string): string => {
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
      case "mines":
        return "mine";
      case "coin_flip":
        return "flip";
      default:
        return gameType;
    }
  };

  function getGameName(gameName: string): string {
    switch (gameName) {
      case "coin_flip":
        return "coin flip";
      case "classic_dice":
        return "dice";
      case "ultimate_dice":
        return "ultimate dice";
      case "mines":
        return "mine";
      default:
        return gameName;
    }
  }

  const getOriginalGameHref = useCallback(
    (gameId: string) => {
      switch (gameId) {
        case "1":
          return "crash";
        case "2":
          return "wheel";
        case "3":
          return "roulette";
        case "4":
          return "flip";
        case "5":
          return "dice";
        case "6":
          return "ultimatedice";
        case "7":
          return "mine";
        default:
          return "crash";
      }
    },
    [data],
  );

  if (
    data.message_type === "BET_INFO" &&
    Array.isArray(data.bet_info) &&
    data.bet_info
  )
    return (
      <div className={styles["chat-box"]} ref={ref}>
        <button
          className={`${styles["user-info"]}`}
          type="button"
          disabled={!data.nickname}
          onClick={() => {
            if (data.user_idx) {
              openModal({
                type: "profile",
                props: {
                  modalUserId: data.user_idx.toString(),
                },
              });
            }
          }}
        >
          <span
            className={styles.avatar}
            style={{
              backgroundImage: `url('/images/avatar/img_avatar_${
                data.avatar_idx ?? "hidden"
              }.webp')`,
            }}
          ></span>
          <span className={styles.nickname}>{data.nickname || "Hidden"}</span>
        </button>
        <div className={styles["chat-content"]}>
          <div>
            <div className={styles["share-container"]}>
              <p>{t("chat_13")}</p>
              <div className={styles.content}>
                <div className={styles.light}></div>
                <div className={styles.logo}></div>
                <div className={styles.dim}></div>
                <div
                  className={styles["game-image"]}
                  style={{
                    backgroundImage: `url(${data.bet_info[0].game_image_url})`,
                  }}
                ></div>
                <Link
                  href={
                    data.bet_info[0].game_type === "original"
                      ? `/game/${getOriginalGameHref(data.bet_info[0].game_id)}`
                      : `/provider/game?systemCode=${data.bet_info[0].system_code}&pageCode=${data.bet_info[0].page_code}&gameType=real`
                  }
                  className={`${styles["goto-btn"]}`}
                  style={{
                    backgroundImage: `url('/images/nav/${getGameHref(
                      data.bet_info[0].game_type.toLocaleLowerCase(),
                    )}_a.svg')`,
                  }}
                ></Link>
                <div className={styles["info-box"]}>
                  <div className={styles["name-row"]}>
                    <span>
                      {getGameName(
                        data.bet_info[0].game_name.toLocaleLowerCase(),
                      )}
                    </span>
                    {data.bet_info.length > 1 && (
                      <div>
                        <span>{t("chat_14")}</span>
                      </div>
                    )}
                  </div>
                  {data.bet_info.map((c, i) => {
                    return (
                      <div className={styles["bet-info-box"]} key={i}>
                        <span className={styles["pay-out"]}>{c.pay_out} x</span>
                        <div className={styles["amount-box"]}>
                          <span
                            className={
                              c.win_yn === "Y" ? styles.win : styles.lose
                            }
                          >
                            {amountToDisplayFormat(
                              c.profit_amount,
                              c.bet_coin_type,
                            )}
                          </span>
                          <span
                            className={`${styles.ico}`}
                            style={{
                              backgroundImage: `url('/images/tokens/img_token_${(
                                c.bet_coin_type ?? "eth"
                              ).toLocaleLowerCase()}_circle.svg')`,
                            }}
                          ></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.date}>
          {dayjs(data.create_date).utc().format("YY/MM/DD HH:mm:ss")}
        </div>
      </div>
    );
  return (
    <div className={styles["chat-box"]} ref={ref}>
      <button
        className={`${styles["user-info"]}`}
        type="button"
        disabled={!data.nickname}
        onClick={() => {
          if (data.user_idx) {
            openModal({
              type: "profile",
              props: {
                modalUserId: data.user_idx.toString(),
              },
            });
          }
        }}
      >
        <span
          className={styles.avatar}
          style={{
            backgroundImage: `url('/images/avatar/img_avatar_${
              data.avatar_idx ?? "hidden"
            }.webp')`,
          }}
        ></span>
        <span className={styles.nickname}>{data.nickname || "Hidden"}</span>
      </button>
      <div className={styles["chat-content"]}>
        <div>
          <pre>{data.message}</pre>
        </div>
      </div>
      <div className={styles.date}>
        {dayjs(data.create_date).utc().format("YY/MM/DD HH:mm:ss")}
      </div>
    </div>
  );
};
