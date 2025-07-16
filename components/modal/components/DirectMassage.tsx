"use client";

import styles from "./styles/directMassageModal.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import {
  useDeleteDirectMassage,
  useGetDirectMessage,
  usePostDirectMassage,
} from "@/querys/chat";
import CommonEmptyData from "@/components/common/EmptyData";
import { useGetCommon } from "@/querys/common";
import { useUserStore } from "@/stores/useUser";
import { useImmer } from "use-immer";

export default function DirectMassage() {
  const t = useDictionary();
  const [selectedRoom, setSelectedRoom] = useState<null | number>(null);
  const { mutate } = usePostDirectMassage();
  const { token } = useUserStore();
  const { data, refetch } = useGetDirectMessage(token);
  const { refetch: refetchUserData } = useGetCommon(token);

  return (
    <div className={styles["direct-massage-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_449")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["room-list"]}>
          {data?.result && data.result.length > 0 ? (
            data.result.map((c, i) => {
              return (
                <button
                  key={i}
                  type={"button"}
                  className={classNames(styles.room, {
                    [styles["active"]]: c.idx === selectedRoom,
                  })}
                  onClick={() => {
                    mutate(
                      {
                        messageIdx: c.idx.toString(),
                      },
                      {
                        onSuccess: data => {
                          if (data.code === 0) {
                            setSelectedRoom(c.idx);
                            refetchUserData();
                            refetch();
                          }
                        },
                      },
                    );
                  }}
                >
                  <LazyLoadImage
                    src={"/images/modal/dm/img_yummy.webp"}
                    alt="img yummy"
                  />
                  <div className={styles["dm-content"]}>
                    <div className={styles["dm-title"]}>
                      <span>{c.title}</span>
                      {c.read_yn === "N" && <div className={styles.new}></div>}
                    </div>
                    <p className={styles["dm-content"]}>{c.content}</p>
                    <p className={styles["dm-time"]}>{c.date_string}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className={styles["empty-box"]}>
              <CommonEmptyData text={t("modal_448")} />
            </div>
          )}
        </div>
        <div
          className={classNames(styles["message-container"], {
            [styles.active]: selectedRoom !== null,
          })}
        >
          {selectedRoom !== null && data?.result && data?.result.length > 0 ? (
            <MessageBox
              messageData={data.result.find(obj => obj.idx === selectedRoom)}
              setSelectedRoom={setSelectedRoom}
            />
          ) : (
            <div className={styles["empty-container"]}>
              <p>{t("modal_447")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const LinkifyPre = ({ contents }: { contents: string }) => {
  // 정규식을 사용해 링크를 감지
  const parts = contents.split(/(https?:\/\/[^\s]+)/g);

  return (
    <pre>
      {parts.map((part, index) =>
        part.match(/https?:\/\/[^\s]+/) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {part}
          </a>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </pre>
  );
};

const MessageBox = ({
  messageData,
  setSelectedRoom,
}: {
  messageData:
    | {
        idx: number;
        to_user_idx: number;
        read_yn: string;
        title: string;
        content: string;
        create_date: string;
        date_string: string;
      }
    | undefined;
  setSelectedRoom: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [deleteOpenState, setDeleteOpenState] = useState(false);
  const { mutate: deleteMessage } = useDeleteDirectMassage();
  const { token } = useUserStore();
  const { data, refetch } = useGetDirectMessage(token);
  const { data: userData, refetch: refetchUserData } = useGetCommon(token);
  const t = useDictionary();

  const scrollbarRef = useRef<null | HTMLDivElement>(null);
  const preRef = useRef<null | HTMLPreElement>(null);

  const [isScrollState, setIsScrollState] = useImmer({
    top: false,
    bottom: false,
  });

  const checkScrollState = () => {
    if (scrollbarRef.current && preRef.current) {
      const scrollEl = scrollbarRef.current;
      const preEl = preRef.current;

      const scrollHeight = scrollEl.clientHeight;
      const contentHeight = preEl.scrollHeight;
      if (contentHeight <= scrollHeight) {
        setIsScrollState(draft => {
          draft.top = false;
          draft.bottom = false;
          return draft;
        });
      } else if (scrollEl.scrollTop === 0) {
        setIsScrollState(draft => {
          draft.top = false;
          draft.bottom = true;
          return draft;
        });
      } else if (scrollEl.scrollTop + scrollHeight >= contentHeight) {
        setIsScrollState(draft => {
          draft.top = true;
          draft.bottom = false;
          return draft;
        });
      } else {
        setIsScrollState(draft => {
          draft.top = true;
          draft.bottom = true;
          return draft;
        });
      }
    }
  };

  useEffect(() => {
    // messageData가 변경될 때도 체크
    checkScrollState();
  }, [messageData, scrollbarRef?.current, preRef?.current]);

  useEffect(() => {
    const scrollEl = scrollbarRef.current;
    if (!scrollEl) return;

    // 스크롤 시 이벤트
    const onScroll = () => {
      checkScrollState();
    };

    scrollEl.addEventListener("scroll", onScroll);
    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
    };
  }, [scrollbarRef.current]);

  if (!messageData) return <></>;

  return (
    <div className={styles["massage-detail-container"]}>
      <p className={styles.date}>{messageData.date_string}</p>
      <div className={styles["detail-content"]}>
        <button
          type={"button"}
          className={styles["back-btn"]}
          onClick={() => setSelectedRoom(null)}
        ></button>
        <LazyLoadImage
          src={"/images/modal/dm/img_yummy.webp"}
          alt="img yummy"
        />
        <div className={styles.content}>
          <p className={styles.title}>{messageData.title}</p>
          <div className={styles["scroll-parent-box"]}>
            {isScrollState && (
              <>
                {isScrollState.top && <div className={styles["dim-top"]}></div>}
                {isScrollState.bottom && (
                  <div className={styles["dim-bottom"]}></div>
                )}
              </>
            )}
            <div className={styles["scroll-area"]} ref={scrollbarRef}>
              <pre ref={preRef}>{messageData.content}</pre>
            </div>
          </div>
        </div>
        <div className={styles["delete-container"]}>
          {deleteOpenState ? (
            <>
              <button
                type={"button"}
                className={styles["cancel-text-btn"]}
                onClick={() => setDeleteOpenState(false)}
              >
                {t("modal_391")}
              </button>
              <button
                type={"button"}
                className={styles["delete-text-btn"]}
                onClick={() => {
                  deleteMessage(
                    { messageIdx: messageData.idx.toString() },
                    {
                      onSuccess: () => {
                        setDeleteOpenState(false);
                        setSelectedRoom(null);
                        refetch();
                        refetchUserData();
                      },
                    },
                  );
                }}
              >
                {t("modal_446")}
              </button>
            </>
          ) : (
            <button
              type={"button"}
              className={styles["delete-btn"]}
              onClick={() => setDeleteOpenState(true)}
            ></button>
          )}
        </div>
      </div>
      <button
        type={"button"}
        className={styles["live-chat"]}
        onClick={() => {
          if (window.fcWidget) {
            window.fcWidget.open();
          }
        }}
      >
        <span>Live chat</span>
      </button>
    </div>
  );
};
