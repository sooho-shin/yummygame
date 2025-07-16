"use client";

import CommonTable from "@/components/common/Table";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetCommon } from "@/querys/common";
import { useUserStore } from "@/stores/useUser";

import { userCommonGnbDataType } from "@/types/user";
import classNames from "classnames";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useCallback, useEffect, useMemo, useState } from "react";
import tableStyles from "../common/styles/table.module.scss";
import styles from "./styles/history.module.scss";
// import { useStompStore } from "@/stores/useStomp";
import { useDictionary } from "@/context/DictionaryContext";
import useModalHook from "@/hooks/useModalHook";
import { ICrash, ICrashHistory } from "@/types/games/crash";
import { IWheel, IWheelHistory } from "@/types/games/wheel";
import { useImmer } from "use-immer";
import CommonEmptyData from "../common/EmptyData";

const TABS: { ALL: "all" | "my"; MY: "all" | "my" } = {
  ALL: "all",
  MY: "my",
};

export default function HistoryBoxOfRound({
  myHistoryData,
  allHistoryData,
  type,
}: {
  refetchDelay: number;
  myHistoryData: IWheelHistory[] | ICrashHistory[] | null;
  allHistoryData: IWheel[] | ICrash[] | null;
  type: "wheel" | "crash";
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const t = useDictionary();

  dayjs.extend(utc);

  const { token, displayFiat } = useUserStore();

  const { data: commonData } = useGetCommon(token);
  const [tabStatus, setTabStatus] = useState<"all" | "my">(TABS.ALL);
  const [tab, setTab] = useState<"all" | "my">(TABS.ALL);

  const [showMoreState, setShowMoreState] = useState(false);

  // const [historyData, setHistoryData] = useState<DataType[]>([]);
  const [myHistoryDataCustom, setMyHistoryDataCustom] = useImmer<
    IWheelHistory[] | ICrashHistory[]
  >([]);
  const [allHistoryDataCustom, setAllHistoryDataCustom] = useImmer<
    IWheel[] | ICrash[]
  >([]);

  useEffect(() => {
    allHistoryData && setAllHistoryDataCustom(allHistoryData);
  }, [allHistoryData]);

  useEffect(() => {
    myHistoryData && setMyHistoryDataCustom(myHistoryData);
  }, [myHistoryData]);

  useEffect(() => {
    if (tabStatus === TABS.ALL) {
      setTab(tabStatus);
    } else {
      setTab(tabStatus);
    }
  }, [tabStatus]);

  return (
    <div className={styles.wrapper}>
      <div className={styles["tab-box"]}>
        <ul>
          <li>
            <button
              type="button"
              className={classNames({
                [styles.active]: tab === TABS.ALL,
              })}
              onClick={() => setTabStatus(TABS.ALL)}
            >
              {t("game_47")}
            </button>
          </li>
          {token && hydrated && (
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
            {type === "wheel" &&
              (tab === TABS.ALL ? (
                <tr>
                  <th align="left">{t("game_58")}</th>
                  <th align="center">{t("game_59")}</th>
                  <th align="right">{t("game_60")}</th>
                </tr>
              ) : (
                <tr>
                  <th align="left">{t("game_50")}</th>
                  <th align="center">{t("game_52")}</th>
                  <th align="center">{t("game_53")}</th>
                  <th align="center">{t("game_54")}</th>
                  <th align="right">{t("game_55")}</th>
                </tr>
              ))}

            {type === "crash" &&
              (tab === TABS.ALL ? (
                <tr>
                  <th align="left">{t("game_58")}</th>
                  <th align="center">{t("game_59")}</th>
                  <th align="right">{t("game_60")}</th>
                </tr>
              ) : (
                <tr>
                  <th align="left">{t("game_50")}</th>
                  <th align="center">{t("game_52")}</th>
                  <th align="center">{t("game_53")}</th>
                  <th align="center">{t("game_54")}</th>
                  <th align="right">{t("game_55")}</th>
                </tr>
              ))}
          </thead>
          {tab === TABS.ALL ? (
            <tbody>
              {allHistoryDataCustom &&
                (allHistoryDataCustom.length > 0 ? (
                  allHistoryDataCustom
                    .slice(0, showMoreState ? 100 : 10)
                    .map((c: IWheel, index) => {
                      return (
                        <AllhistoryDataTr
                          key={c.idx}
                          data={c}
                          commonData={commonData ? commonData.result : null}
                          displayFiat={displayFiat}
                          type={type}
                        />
                      );
                    })
                ) : (
                  <></>
                ))}
            </tbody>
          ) : (
            <tbody>
              {myHistoryDataCustom &&
                (myHistoryDataCustom.length > 0 ? (
                  myHistoryDataCustom
                    .slice(0, showMoreState ? 100 : 10)
                    .map((c: IWheelHistory | ICrashHistory, index) => {
                      return (
                        <MyhistoryDataTr
                          key={c.idx}
                          data={c}
                          commonData={commonData ? commonData.result : null}
                          displayFiat={displayFiat}
                          type={type}
                        />
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
      </CommonTable>
    </div>
  );
}

const AllhistoryDataTr = ({
  data,
  type,
}: {
  data: IWheel | ICrash;
  displayFiat: string | null;
  commonData: userCommonGnbDataType | null;
  type: "wheel" | "crash";
}) => {
  const { openModal } = useModalHook();
  const crashRate = useMemo(() => {
    if (Number(data.game_result) < 2) {
      return "rate-1";
    }
    if (Number(data.game_result) >= 2 && Number(data.game_result) < 10) {
      return "rate-2";
    }

    if (Number(data.game_result) >= 10) {
      return "rate-10";
    }
  }, [data.game_result]);

  return (
    <tr key={data.idx}>
      <td align="left">
        <div>
          {type === "wheel" && (
            <span
              className={`${tableStyles["wheel-payout-circle"]} ${
                tableStyles[
                  `payout-${
                    (data as IWheel).success_multiply as 2 | 3 | 5 | 50
                  }`
                ]
              }`}
            ></span>
          )}
          {type === "crash" && (
            <span
              className={`${tableStyles["wheel-payout-circle"]} ${
                tableStyles[crashRate as "rate-1" | "rate-2" | "rate-10"]
              }`}
            ></span>
          )}
          <button
            type="button"
            onClick={() => {
              openModal({
                type: "gameID",
                props: {
                  modalGameType: type,
                  modalRound: data.round.toString(),
                },
              });
            }}
          >
            <span>{data.round}</span>
          </button>
        </div>
      </td>
      <td align="center">
        <div>
          <span>
            {type === "wheel" && (data as IWheel).success_multiply}
            {type === "crash" && (data as ICrash).game_result} x
          </span>
        </div>
      </td>
      <td align="right">
        <div>
          <pre>{data.server_seed}</pre>
          <a
            href={`https://codepen.io/dev-yummy/pen/${
              type === "crash" ? "ExMyNbj" : "GReqNyy"
            }?hash=${data.server_seed}`}
            className={tableStyles.hash}
            target="_blank"
            rel="noreferrer"
          ></a>
        </div>
      </td>
    </tr>
  );
};
const MyhistoryDataTr = ({
  data,
  type,
}: {
  data: IWheelHistory | ICrashHistory;
  displayFiat: string | null;
  commonData: userCommonGnbDataType | null;
  type: "wheel" | "crash";
}) => {
  const { amountToDisplayFormat } = useCommonHook();
  const crashPayout = useCallback((data: ICrashHistory) => {
    return data.cashout_multiply_100 ?? data.cashout_multiply_50 ?? "0";
  }, []);
  const { openModal } = useModalHook();

  return (
    <tr>
      <td align="left">
        <div>
          <button
            type="button"
            onClick={() => {
              openModal({
                type: "betID",
                props: {
                  modalGameType: type.toLocaleUpperCase(),
                  modalGameIdx: data.idx.toString(),
                },
              });
            }}
          >
            <span>{data.idx}</span>
            <div className={tableStyles.arrow} />
          </button>
        </div>
      </td>
      <td align="center">
        <div>
          <span>
            {amountToDisplayFormat(data.bet_amount, data.bet_coin_type)}
          </span>
          <span
            className={`${tableStyles.ico}`}
            style={{
              backgroundImage: `url('/images/tokens/img_token_${data.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
            }}
          ></span>
        </div>
      </td>
      <td align="center">
        <div>
          <span>
            {type === "wheel" &&
              (data.win_yn === "Y"
                ? (data as IWheelHistory).bet_multiply
                : "0")}
            {type === "crash" && crashPayout(data as ICrashHistory)} x
          </span>
        </div>
      </td>
      <td align="center">
        <div>
          <span
            className={data.win_yn === "Y" ? tableStyles.win : tableStyles.lose}
          >
            {type === "wheel" &&
              amountToDisplayFormat(
                data.win_yn === "Y"
                  ? (data as IWheelHistory).earn_amount ?? "0"
                  : data.bet_amount,
                data.bet_coin_type,
              )}

            {type === "crash" &&
              amountToDisplayFormat(
                (data as ICrashHistory).earn_amount_100 ??
                  (data as ICrashHistory).earn_amount_50 ??
                  "0",
                data.bet_coin_type,
                (data as ICrashHistory).earn_dollar_100 ??
                  (data as ICrashHistory).earn_dollar_50 ??
                  "0",
              )}
          </span>
          <span
            className={`${tableStyles.ico} `}
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
