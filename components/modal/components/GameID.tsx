"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import styles from "./styles/gameIDModal.module.scss";
import { useGetGameDataOfRound } from "@/querys/game/common";
import { truncateString } from "@/utils";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import CommonEmptyData from "@/components/common/EmptyData";
import { useDictionary } from "@/context/DictionaryContext";

export default function GameID() {
  dayjs.extend(utc);
  const { closeModal, openModal, props, type } = useModalHook();

  const { data } = useGetGameDataOfRound({
    type:
      props && props.modalGameType
        ? props.modalGameType.toLocaleLowerCase()
        : null,
    round: props && props.modalRound ? Number(props.modalRound) : null,
  });

  const { amountToDisplayFormat } = useCommonHook();
  const t = useDictionary();

  if (!data || !data.result || !props.modalGameType) return <></>;

  return (
    <div className={styles["game-id-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_138")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["game-info"]}>
          <div>
            <span>ID</span>
            <span>{data.result.master_data.round}</span>
          </div>
          <p>
            {dayjs(data.result.master_data.create_date)
              .utc()
              .format("YY/MM/DD HH:mm:ss")}
          </p>
        </div>
        <div className={styles["table-container"]}>
          <table>
            <thead>
              <tr>
                <th align="left">{t("modal_139")}</th>
                <th align="center">{t("modal_140")}</th>
                <th align="center">{t("modal_141")}</th>
                <th align="right">{t("modal_142")}</th>
              </tr>
            </thead>
          </table>
          <div className={styles["table-scroll"]}>
            <table>
              <tbody>
                {data.result.history.length > 0 ? (
                  data.result.history.map((c, i) => {
                    return (
                      <tr key={c.idx}>
                        <td align="left">
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                openModal({
                                  backBtn: true,
                                  type: "betID",
                                  props: {
                                    modalGameType:
                                      props.modalGameType.toLocaleUpperCase(),
                                    modalGameIdx: c.idx.toString(),
                                    modalRound:
                                      data.result.master_data.round.toString(),
                                  },
                                });
                              }}
                            >
                              <span>{c.idx}</span>
                              <span className={styles.arrow}></span>
                            </button>
                          </div>
                        </td>
                        <td align="center">
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                if (c.user_idx) {
                                  openModal({
                                    type: "profile",
                                    props: {
                                      modalUserId: c.user_idx.toString(),
                                    },
                                  });
                                }
                              }}
                              disabled={!c.user_idx}
                            >
                              <span
                                className={styles.avatar}
                                style={{
                                  backgroundImage: `url('/images/avatar/img_avatar_${
                                    c.avatar_idx || "hidden"
                                  }.webp')`,
                                }}
                              ></span>
                              <span>
                                {truncateString({
                                  str: c.nickname || "Hidden",
                                  sliceIndex: 4,
                                })}
                              </span>
                            </button>
                          </div>
                        </td>
                        <td align="center">
                          <div>
                            <span>{c.pay_out} X</span>
                          </div>
                        </td>
                        <td align="right">
                          <div>
                            <span
                              className={
                                c.win_yn === "Y" ? styles.win : styles.lose
                              }
                            >
                              {amountToDisplayFormat(c.profit, c.bet_coin_type)}
                            </span>
                            <span
                              className={`${styles.ico}`}
                              style={{
                                backgroundImage: `url('/images/tokens/img_token_${c.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                              }}
                            ></span>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={styles["btn-row"]}>
        <button
          type="button"
          className={styles["confirm-btn"]}
          onClick={() => {
            // callback && callback();
            closeModal();
          }}
        >
          <span>{t("modal_143")}</span>
        </button>
      </div>
    </div>
  );
}
