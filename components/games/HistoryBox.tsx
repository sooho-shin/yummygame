"use client";

import CommonTable from "@/components/common/Table";
import { useGetCommon } from "@/querys/common";
import { useUserStore } from "@/stores/useUser";

import classNames from "classnames";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useMemo, useState } from "react";
import tableStyles from "../common/styles/table.module.scss";
import styles from "./styles/history.module.scss";
// import { useStompStore } from "@/stores/useStomp";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetHistoryAll } from "@/querys/game/common";
import { useSocketStore } from "@/stores/useSocket";
import { GameType } from "@/types/games/common";
import * as _ from "lodash";
import { useImmer } from "use-immer";
import CommonEmptyData from "../common/EmptyData";

const TABS: { ALL: "all" | "my"; MY: "all" | "my" } = {
  ALL: "all",
  MY: "my",
};

export type MyHistoryDataType = {
  avatar_idx: number | null | string;
  bet_amount: string;
  bet_coin_type: string;
  bet_dollar: string;
  create_date: string;
  expect_pay_out?: string;
  idx: number;
  input_number?: number;
  nickname: string | null;
  pay_out: string;
  profit_amount: string;
  profit_dollar: string;
  result_number?: number;
  user_idx?: number | null | string;
  win_yn: string;
  game_idx: string;
  game_type?: string;
  latest_earn_amount?: string;
  latest_earn_dollar?: string;
};

export default function HistoryBox({
  refetchDelay,
  myHistoryData,
  type,
  onlyAll,
  margin,
  full,
}: {
  refetchDelay: number;
  myHistoryData: MyHistoryDataType[] | null;
  type: GameType;
  onlyAll?: boolean;
  margin?: number;
  full?: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const t = useDictionary();

  dayjs.extend(utc);

  const { token } = useUserStore();

  const { refetch: refetchCommonData } = useGetCommon(token);
  const { data: allHistoryData, refetch: refetchAllHistoryData } =
    useGetHistoryAll();

  const [tabStatus, setTabStatus] = useState<"all" | "my">(
    type === "plinko" ? TABS.MY : TABS.ALL,
  );
  const [tab, setTab] = useState<"all" | "my">(
    type === "plinko" ? TABS.MY : TABS.ALL,
  );

  const [showMoreState, setShowMoreState] = useState(false);
  const [myHistoryDataCustom, setMyHistoryDataCustom] = useImmer<
    MyHistoryDataType[]
  >([]);
  const [allHistoryDataCustom, setAllHistoryDataCustom] = useImmer<
    MyHistoryDataType[]
  >([]);

  const { cacheStreamSocket } = useSocketStore();

  useEffect(() => {
    if (!cacheStreamSocket) return () => false;
    if (!cacheStreamSocket.connected) {
      cacheStreamSocket.connect();
    }

    cacheStreamSocket.on("game.log", (socket: MyHistoryDataType) => {
      const cloneData = _.cloneDeep(socket);

      setTimeout(() => {
        setAllHistoryDataCustom(data => {
          if (allHistoryDataCustom.length >= 100) {
            data.pop();
          }
          data.unshift(cloneData);
        });
      }, refetchDelay);
    });

    cacheStreamSocket.on(
      "provider.my.game.log",
      (socket: MyHistoryDataType) => {
        const cloneData = _.cloneDeep(socket);
        if (type === "provider") {
          setTimeout(() => {
            refetchCommonData();
            setMyHistoryDataCustom(data => {
              if (myHistoryData && myHistoryData.length >= 100) {
                data.pop();
              }
              data.unshift(cloneData);
            });
          }, refetchDelay);
        }
      },
    );
    return () => {
      cacheStreamSocket.off("game.log");
      cacheStreamSocket.off("provider.my.game.log");
    };
  }, [cacheStreamSocket]);

  useEffect(() => {
    // const serverData = tab === TABS.ALL ? allHistoryData : myHistoryData;
    if (tab === TABS.ALL) {
      allHistoryData && setAllHistoryDataCustom(allHistoryData.result);
    }
    if (tab === TABS.MY) {
      myHistoryData && setMyHistoryDataCustom(myHistoryData);
    }
  }, [allHistoryData]);

  useEffect(() => {
    if (tabStatus === TABS.ALL || type === "plinko") {
      refetchAllHistoryData().then(data => {
        setAllHistoryDataCustom(data.data.result);
        setTab(tabStatus);
      });
    } else {
      setTab(tabStatus);
    }
  }, [tabStatus]);

  useEffect(() => {
    if (myHistoryDataCustom !== myHistoryData && hydrated) {
      customMyHistoryData(myHistoryData);
    }
  }, [myHistoryData, hydrated]);

  const customMyHistoryData = (myHistoryData: MyHistoryDataType[] | null) => {
    if (myHistoryData) {
      setMyHistoryDataCustom(draft => {
        let newHistoryData = [];
        if (myHistoryDataCustom.length >= 100) {
          newHistoryData = [
            ...myHistoryData,
            ...draft.slice(0, draft.length - myHistoryData.length),
          ];
        } else {
          if (draft === myHistoryData) {
            newHistoryData = myHistoryData;
          } else {
            newHistoryData = [...myHistoryData, ...draft];
          }
        }
        draft = newHistoryData;
        return draft;
      });
    }
  };

  const wrapperStyles = useMemo(() => {
    const style: {
      marginTop?: number;
      padding?: string;
    } = {};

    if (margin) {
      style.marginTop = margin;
    }

    if (full) {
      style.padding = "0";
    }

    return style;
  }, [margin, full]);

  return (
    <div className={styles.wrapper} style={wrapperStyles}>
      <div className={styles["tab-box"]}>
        <ul>
          <li>
            <button
              type="button"
              className={classNames({
                [styles.active]: tab === TABS.ALL,
                [styles.only]: onlyAll,
              })}
              onClick={() => setTabStatus(TABS.ALL)}
            >
              {t("game_47")}
            </button>
          </li>

          {token && hydrated && !onlyAll && allHistoryDataCustom.length > 0 && (
            <li>
              <button
                type="button"
                className={classNames({
                  [styles.active]: tab === TABS.MY,
                })}
                onClick={() => setTabStatus(TABS.MY)}
              >
                {t("game_48")}
              </button>
            </li>
          )}
        </ul>
      </div>
      <CommonTable>
        <table>
          <thead>
            <tr>
              <th align="left">
                {tab === TABS.ALL ? t("game_49") : t("game_50")}
              </th>
              <th align="center">
                {tab === TABS.ALL ? t("game_51") : t("game_52")}
              </th>
              <th align="center">{t("game_53")}</th>
              <th align="center">{t("game_54")}</th>
              <th align="right">{t("game_55")}</th>
            </tr>
          </thead>
          {tab === TABS.ALL ? (
            <tbody>
              {allHistoryDataCustom &&
                (allHistoryDataCustom.length > 0 ? (
                  allHistoryDataCustom
                    .slice(0, showMoreState ? 100 : 10)
                    .map((c: MyHistoryDataType, index) => {
                      return (
                        <BetRow key={index} data={c} tab={tab} type={type} />
                      );
                    })
                ) : (
                  <tr className={tableStyles["not-data"]}>
                    <td colSpan={5}>
                      <CommonEmptyData />
                    </td>
                  </tr>
                ))}
            </tbody>
          ) : (
            <tbody>
              {myHistoryDataCustom &&
                (myHistoryDataCustom.length > 0 ? (
                  myHistoryDataCustom
                    .slice(0, showMoreState ? 100 : 10)
                    .map((c: MyHistoryDataType, index) => {
                      return (
                        // <></>
                        <BetRow key={index} data={c} tab={tab} type={type} />
                      );
                    })
                ) : (
                  <tr className={tableStyles["not-data"]}>
                    <td colSpan={5}>
                      <CommonEmptyData />
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </CommonTable>
      {((tab === TABS.ALL && allHistoryDataCustom.length > 10) ||
        (tab === TABS.MY &&
          myHistoryDataCustom &&
          myHistoryDataCustom.length > 10)) && (
        <div className={tableStyles["show-more-btn-row"]}>
          <button
            type="button"
            onClick={() => setShowMoreState(!showMoreState)}
            className={showMoreState ? tableStyles.active : ""}
          >
            <span>{showMoreState ? t("game_56") : t("game_57")}</span>
            <span className={tableStyles.ico}></span>
          </button>
        </div>
      )}
    </div>
  );
}

function getGameType(input: string): string {
  // WHEN game_type = 'COIN_FLIP' THEN 'Coin Flip'
  // WHEN game_type = 'ROULETTE' THEN 'Roulette'
  // WHEN game_type = 'CLASSIC_DICE' THEN 'Dice'
  // WHEN game_type = 'ULTIMATE_DICE' THEN 'Ultimate Dice'
  // WHEN game_type = 'MINES' THEN 'Mines'
  if (
    input !== "Coin Flip" &&
    input !== "Roulette" &&
    input !== "Dice" &&
    input !== "Ultimate Dice" &&
    input !== "Mines" &&
    input !== "Plinko" &&
    input !== "Limbo"
  ) {
    return "another";
  } else {
    return input;
  }
}

const BetRow = ({
  data,
  tab,
  type,
}: {
  data: MyHistoryDataType;
  tab: "all" | "my";
  type: GameType;
}) => {
  const { routeWithParams, fiatSymbol, amountToDisplayFormat } =
    useCommonHook();

  const { openModal } = useModalHook();

  return (
    <tr key={tab === TABS.ALL ? data.game_idx : data.idx}>
      <td align="left">
        <div>
          <button
            type="button"
            style={{ cursor: TABS.ALL === tab ? "default" : "pointer" }}
            disabled={TABS.ALL === tab}
            onClick={() => {
              const props: {
                modalGameType: string;
                modalGameIdx: string;
              } = {
                modalGameType: type.toLocaleUpperCase(),
                modalGameIdx:
                  type === "provider"
                    ? data.idx.toString()
                    : data.game_idx.toString(),
              };
              openModal({
                type: "betID",
                props: props,
              });
            }}
          >
            {tab === TABS.ALL ? (
              <span
                className={`${tableStyles["game-img"]} ${
                  tableStyles[
                    getGameType(data.game_type ?? "another")
                      .toLocaleLowerCase()
                      .replace(/ /g, "_") as
                      | "crash"
                      | "wheel"
                      | "dice"
                      | "roulette"
                      | "ultimate_dice"
                      | "mines"
                      | "coin_flip"
                      | "plinko"
                      | "limbo"
                      | "another"
                  ]
                }`}
              ></span>
            ) : (
              <></>
            )}
            <>
              <span className={tableStyles["has-max-width"]}>
                {tab === TABS.ALL ? data.game_type : data.idx}
              </span>
              {tab === TABS.MY && <span className={tableStyles.arrow}></span>}
            </>
          </button>
          {/* <span>{data.game_idx}</span> */}
        </div>
      </td>
      <td align="center">
        <div>
          {tab === TABS.ALL ? (
            <button
              type="button"
              className={tableStyles["avatar-btn"]}
              disabled={!data.user_idx}
              onClick={() => {
                openModal({
                  type: "profile",
                  props: {
                    modalUserId: data.user_idx ? data.user_idx.toString() : "0",
                  },
                });
              }}
            >
              <>
                <span
                  className={`${tableStyles.avatar}`}
                  style={{
                    backgroundImage: `url('/images/avatar/img_avatar_${
                      data.avatar_idx ?? "hidden"
                    }.webp')`,
                  }}
                ></span>
                <span>{data.nickname ?? "Hidden"}</span>
              </>
            </button>
          ) : (
            <>
              <span>
                {amountToDisplayFormat(data.bet_amount, data.bet_coin_type)}
              </span>
              <span
                className={`${tableStyles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </>
          )}
        </div>
      </td>
      <td align="center">
        <div>
          <span>{data.pay_out} x</span>
        </div>
      </td>
      <td align="center">
        <div>
          <span
            className={data.win_yn === "Y" ? tableStyles.win : tableStyles.lose}
          >
            {amountToDisplayFormat(
              data["profit_amount"],
              data.bet_coin_type,
              // data["profit_dollar"],
            )}
          </span>
          <span
            className={`${tableStyles.ico}`}
            style={{
              backgroundImage: `url('/images/tokens/img_token_${data.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
            }}
          ></span>
        </div>
      </td>
      <td align="right">
        <div>
          <span>
            {dayjs(data.create_date).utc().format("YY/MM/DD HH:mm:ss")}
          </span>
        </div>
      </td>
    </tr>
  );
};
