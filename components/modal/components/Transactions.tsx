"use client";

import CommonEmptyData from "@/components/common/EmptyData";
import CommonInputBox from "@/components/common/InputBox";
import Pagination from "@/components/common/Pagination";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetWalletTransactions } from "@/querys/wallet";
import { useUserStore } from "@/stores/useUser";
import { WalletTransactionsParamsType } from "@/types/wallet";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles/transactionsModal.module.scss";
import { useImmer } from "use-immer";

export default function Transactions() {
  const searchParams = useSearchParams();
  const { token } = useUserStore();
  const { routeWithParams, amountToDisplayFormat } = useCommonHook();
  const { closeModal, openModal } = useModalHook();
  const t = useDictionary();

  const [type, setType] = useState<string | null>(null);
  const [asset, setAsset] = useState<string | null>(null);
  const [page, setPage] = useState<string | null>(null);

  const typeParam = searchParams.get("modalType");
  const assetParam = searchParams.get("modalAsset");
  const pageParam = searchParams.get("modalPage");
  useEffect(() => {
    typeParam && typeParam !== type && setType(typeParam);
  }, [typeParam]);
  useEffect(() => {
    assetParam && assetParam !== asset && setType(assetParam);
  }, [assetParam]);
  useEffect(() => {
    pageParam && assetParam !== page && setType(pageParam);
  }, [pageParam]);

  const typeArray = [
    { text: t("modal_253") },
    { text: t("modal_254") },
    { text: t("modal_255") },
    { text: t("modal_256") },
    { text: t("modal_257") },
    { text: t("modal_258") },
  ];

  const { currentCoinList } = useCommonHook();

  const cryptoArr = useMemo(() => {
    if (!currentCoinList) {
      return [];
    }

    return currentCoinList.filter(str => str !== "jel_lock");
  }, [currentCoinList]);

  const paramType = useMemo(() => {
    dayjs.extend(utc);
    if (type === typeArray[0].text) {
      return "deposit";
    }
    if (type === typeArray[1].text) {
      return "withdrawal";
    }
    if (type === typeArray[2].text) {
      return "swap";
    }
    if (type === typeArray[3].text) {
      return "betting";
    }
    if (type === typeArray[4].text) {
      return "jelClaim";
    }
    if (type === typeArray[5].text) {
      return "buyCrypto";
    }

    return "deposit";
  }, [type]);

  const transactionParam = useMemo<WalletTransactionsParamsType>(() => {
    const data: WalletTransactionsParamsType = {
      type: paramType,
    };

    if (asset && asset.toLocaleLowerCase() !== "all") {
      data.asset = asset.toUpperCase();
    }

    if (page) {
      data.page = page;
    }

    if (paramType !== "betting") {
      data.limit = "7";
    } else {
      data.limit = "5";
    }
    return data;
  }, [asset, page, paramType]);

  const {
    data: walletTransactionsData,
    isFetching,
    refetch,
  } = useGetWalletTransactions(transactionParam, token);

  useEffect(() => {
    refetch();
  }, [transactionParam, token]);

  const selectedType = useMemo(() => {
    return type || typeArray[0].text;
  }, [type]);

  const assetsArray = useMemo(() => {
    if (type === typeArray[3].text) {
      return [
        { text: "All" },
        ...cryptoArr.map(item => {
          return { text: item.toUpperCase() };
        }),
      ];
    }
    if (type === typeArray[2].text) {
      return [
        { text: "All" },
        ...cryptoArr
          .filter(item => item !== "hon")
          .map(item => {
            return { text: item.toUpperCase() };
          }),
      ];
    }
    return [
      { text: "All" },
      ...cryptoArr
        .filter(item => item !== "hon" && item !== "jel")
        .map(item => {
          return { text: item.toUpperCase() };
        }),
    ];
  }, [type]);

  const selectedAsset = useMemo(() => {
    return asset || "All";
  }, [asset]);

  // return <></>;
  return (
    <div className={styles["transactions-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_259")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["dropbox-row"]}>
          <CommonInputBox
            title="Type"
            required={false}
            dropdownData={{
              dropDownArray: typeArray,
              setSelectedValue: (data: {
                icoPath?: string | undefined;
                text?: string | null;
              }) => {
                if (data.text) {
                  setType(data.text);
                  setAsset(null);
                  setPage(null);
                  routeWithParams({
                    paramArray: [
                      {
                        paramName: "modalType",
                        value: data.text,
                      },
                    ],
                    deleteParams: ["modalAsset", "modalPage"],
                  });
                }
              },
              selectedValue: { text: selectedType },
            }}
          />
          {paramType !== "jelClaim" && (
            <CommonInputBox
              title="Assets"
              required={false}
              dropdownData={{
                dropDownArray: assetsArray,
                selectedValue: { text: selectedAsset },
                setSelectedValue: (data: {
                  icoPath?: string | undefined;
                  text?: string | null;
                }) => {
                  if (data.text) {
                    setAsset(data.text);
                    setType(null);
                    setPage(null);
                    routeWithParams({
                      paramArray: [
                        {
                          paramName: "modalAsset",
                          value: data.text,
                        },
                      ],
                      deleteParams: ["modalPage"],
                    });
                  }
                },
              }}
            />
          )}
        </div>

        {paramType !== "betting" &&
          paramType !== "swap" &&
          paramType !== "jelClaim" && (
            <div className={styles["history-box"]}>
              <table>
                <thead>
                  <tr>
                    <th align="left">
                      <span>{t("modal_260")}</span>
                    </th>
                    <th align="right">
                      <span>{t("modal_261")}</span>
                    </th>
                    <th align="right">
                      <span>{t("modal_262")}</span>
                    </th>
                    <th align="right">
                      <span>{t("modal_259")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isFetching ? (
                    <>
                      {Array.from({
                        length: 3,
                      }).map((c, i) => {
                        return (
                          <tr key={i}>
                            <td className={styles["not-padding"]} colSpan={4}>
                              <div className={styles.skeleton}></div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    walletTransactionsData &&
                    selectedType &&
                    (walletTransactionsData?.result.length > 0 ? (
                      Array.from({
                        length: 7,
                      }).map((c, i) => {
                        if (!walletTransactionsData?.result[i])
                          return <tr key={i}></tr>;
                        return (
                          <tr key={i}>
                            <td align="left">
                              <div>
                                <span
                                  className={`${styles.type} ${styles[paramType]}`}
                                ></span>
                                <span>{selectedType}</span>
                              </div>
                            </td>
                            <td align="right">
                              <div>
                                <span
                                  className={`${styles["amount-type"]} ${styles[paramType]}`}
                                >
                                  {amountToDisplayFormat(
                                    walletTransactionsData?.result[i][
                                      paramType === "deposit"
                                        ? "deposit_amount"
                                        : "amount"
                                    ],
                                    walletTransactionsData?.result[i]
                                      .asset_type_code,
                                  )}
                                </span>
                                <span
                                  className={`${styles.coin} `}
                                  style={{
                                    backgroundImage: `url('/images/tokens/img_token_${walletTransactionsData?.result[
                                      i
                                    ].asset_type_code.toLocaleLowerCase()}_circle.svg')`,
                                  }}
                                ></span>
                              </div>
                            </td>
                            <td align="right">
                              <div>
                                <span className={styles.date}>
                                  {dayjs(
                                    walletTransactionsData?.result[i]
                                      .create_date,
                                  )
                                    .utc()
                                    .format("YY/MM/DD HH:mm:ss")}
                                </span>
                              </div>
                            </td>
                            <td align="right">
                              <div>
                                <span className={styles.status}>
                                  {
                                    walletTransactionsData?.result[i]
                                      .status_code
                                  }
                                </span>
                                {/*<button*/}
                                {/*  type="button"*/}
                                {/*  className={styles.link}*/}
                                {/*></button>*/}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        {paramType === "jelClaim" && (
          <div className={styles["history-box"]}>
            <table>
              <thead>
                <tr>
                  <th align="left">
                    <span>{t("modal_260")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_261")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_262")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <>
                    {Array.from({
                      length: 3,
                    }).map((c, i) => {
                      return (
                        <tr key={i}>
                          <td className={styles["not-padding"]} colSpan={4}>
                            <div className={styles.skeleton}></div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  walletTransactionsData &&
                  selectedType &&
                  (walletTransactionsData?.result.length > 0 ? (
                    Array.from({ length: 7 }).map((c, i) => {
                      if (!walletTransactionsData?.result[i])
                        return <tr key={i}></tr>;
                      return (
                        <tr key={i}>
                          <td align="left">
                            <div>
                              <span
                                className={`${styles.type} ${styles[paramType]}`}
                              ></span>
                              <span>{selectedType}</span>
                            </div>
                          </td>
                          <td align="right">
                            <div>
                              <span>
                                {amountToDisplayFormat(
                                  walletTransactionsData?.result[i]
                                    .change_value,
                                  "jel",
                                )}
                              </span>
                              <span
                                className={`${styles.coin} ${styles.jel}`}
                              ></span>
                            </div>
                          </td>
                          <td align="right">
                            <div>
                              <span className={styles.date}>
                                {dayjs(
                                  walletTransactionsData?.result[i].create_date,
                                )
                                  .utc()
                                  .format("YY/MM/DD HH:mm:ss")}
                              </span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {paramType === "swap" && (
          <div className={styles["history-box"]}>
            <table>
              <thead>
                <tr>
                  <th align="left">
                    <span>{t("modal_260")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_264")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_265")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_262")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <>
                    {Array.from({
                      length: 3,
                    }).map((c, i) => {
                      return (
                        <tr key={i}>
                          <td className={styles["not-padding"]} colSpan={4}>
                            <div className={styles.skeleton}></div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  walletTransactionsData &&
                  selectedType &&
                  (walletTransactionsData?.result.length > 0 ? (
                    Array.from({ length: 7 }).map((c, i) => {
                      if (!walletTransactionsData?.result[i])
                        return <tr key={i}></tr>;
                      return (
                        <tr key={i}>
                          <td align="left">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              <span
                                className={`${styles.type} ${styles[paramType]}`}
                              ></span>
                              <span>{selectedType}</span>
                            </div>
                          </td>
                          <td align="right">
                            <div>
                              <span>
                                {amountToDisplayFormat(
                                  walletTransactionsData?.result[i].from_amount,
                                  walletTransactionsData?.result[i]
                                    .from_coin_type,
                                )}
                              </span>
                              <span
                                className={`${styles.coin}`}
                                style={{
                                  backgroundImage: `url('/images/tokens/img_token_${walletTransactionsData?.result[
                                    i
                                  ].from_coin_type.toLocaleLowerCase()}_circle.svg')`,
                                }}
                              ></span>
                            </div>
                          </td>
                          <td align="right">
                            <div>
                              <span className={`${styles.win}`}>
                                {amountToDisplayFormat(
                                  walletTransactionsData?.result[i].to_amount,
                                  walletTransactionsData?.result[i]
                                    .to_coin_type,
                                )}
                              </span>
                              <span
                                className={`${styles.coin}`}
                                style={{
                                  backgroundImage: `url('/images/tokens/img_token_${walletTransactionsData?.result[
                                    i
                                  ].to_coin_type.toLocaleLowerCase()}_circle.svg')`,
                                }}
                              ></span>
                            </div>
                          </td>
                          <td align="right">
                            <div>
                              <span className={styles.date}>
                                {dayjs(
                                  walletTransactionsData?.result[i].create_date,
                                )
                                  .utc()
                                  .format("YY/MM/DD HH:mm:ss")}
                              </span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {paramType === "betting" && (
          <div className={styles["history-box"]}>
            <table>
              <thead>
                <tr>
                  <th align="left">
                    <span>{t("modal_260")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_266")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_267")}</span>
                  </th>
                  <th align="right">
                    <span>{t("modal_262")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <>
                    {Array.from({
                      length: 3,
                    }).map((c, i) => {
                      return (
                        <tr key={i}>
                          <td className={styles["not-padding"]} colSpan={4}>
                            <div className={styles.skeleton}></div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  walletTransactionsData &&
                  selectedType &&
                  (walletTransactionsData?.result.length > 0 ? (
                    Array.from({ length: paramType !== "betting" ? 7 : 5 }).map(
                      (c, i) => {
                        if (!walletTransactionsData?.result[i])
                          return <tr key={i}></tr>;

                        // bet_amount: "1000000000000000";
                        // bet_coin_type: "ETH";
                        // bet_dollar: "1.5779566";
                        // create_date: "2023-10-18T09:18:21.000Z";
                        // game_idx: 6;
                        // game_type: "COIN_FLIP";
                        // idx: 106;
                        // latest_earn_amount: "1980000000000000";
                        // latest_earn_dollar: "3.124354068";
                        // profit_amount: "980000000000000";
                        // profit_dollar: "1.546397468";
                        // win_yn: "Y";

                        const gameName = () => {
                          switch (walletTransactionsData?.result[i].game_type) {
                            case "CRASH":
                              return "Crash";
                            case "WHEEL":
                              return "Wheel";
                            case "ROULETTE":
                              return "Roulette";
                            case "COIN_FLIP":
                              return "Coin Flip";
                            case "CLASSIC_DICE":
                              return "Dice";
                            case "ULTIMATE_DICE":
                              return "Ultimate Dice";
                            case "MINES":
                              return "Mines";
                            default:
                              return walletTransactionsData?.result[i]
                                .game_type;
                            // break;
                          }
                        };

                        const isProvider = () => {
                          switch (walletTransactionsData?.result[i].game_type) {
                            case "CRASH":
                              return false;
                            case "WHEEL":
                              return false;
                            case "ROULETTE":
                              return false;
                            case "COIN_FLIP":
                              return false;
                            case "CLASSIC_DICE":
                              return false;
                            case "ULTIMATE_DICE":
                              return false;
                            case "MINES":
                              return false;
                            case "LIMBO":
                              return false;
                            case "PLINKO":
                              return false;
                            default:
                              return true;
                          }
                        };

                        return (
                          <tr key={i} className={styles.betting}>
                            <td align="left">
                              <button
                                type="button"
                                className={styles["double-line"]}
                                onClick={() => {
                                  // closeModal();

                                  const props: {
                                    modalGameType: string;
                                    modalGameIdx: string;
                                  } = {
                                    modalGameType: isProvider()
                                      ? "PROVIDER"
                                      : walletTransactionsData?.result[i]
                                          .game_type,
                                    modalGameIdx:
                                      walletTransactionsData?.result[
                                        i
                                      ].game_idx.toString(),
                                  };
                                  closeModal();
                                  openModal({
                                    backBtn: true,
                                    type: "betID",
                                    props: props,
                                  });
                                }}
                              >
                                <div>
                                  <span
                                    className={`${styles.type} ${styles[paramType]}`}
                                  ></span>
                                  <span>{selectedType}</span>
                                  {/* //수호  */}
                                  <span className={styles.arrow}></span>
                                </div>
                                <div>
                                  <span className={styles["game-name"]}>
                                    {gameName()}
                                  </span>
                                </div>
                              </button>
                            </td>
                            <td align="right">
                              <div>
                                <span>
                                  {amountToDisplayFormat(
                                    walletTransactionsData?.result[i]
                                      .bet_amount,
                                    walletTransactionsData?.result[i]
                                      .bet_coin_type,
                                  )}
                                </span>
                                <span
                                  className={`${styles.coin}`}
                                  style={{
                                    backgroundImage: `url('/images/tokens/img_token_${walletTransactionsData?.result[
                                      i
                                    ].bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                                  }}
                                ></span>
                              </div>
                            </td>
                            <td align="right">
                              <div>
                                <span
                                  className={`${
                                    walletTransactionsData?.result[i].win_yn ===
                                    "Y"
                                      ? styles.win
                                      : styles.lose
                                  }`}
                                >
                                  {amountToDisplayFormat(
                                    walletTransactionsData?.result[i]
                                      .profit_amount,
                                    walletTransactionsData?.result[i]
                                      .bet_coin_type,
                                  )}
                                </span>
                                <span
                                  className={`${styles.coin}`}
                                  style={{
                                    backgroundImage: `url('/images/tokens/img_token_${walletTransactionsData?.result[
                                      i
                                    ].bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                                  }}
                                ></span>
                              </div>
                            </td>
                            <td align="right">
                              <div>
                                <span className={styles.date}>
                                  {dayjs(
                                    walletTransactionsData?.result[i]
                                      .create_date,
                                  )
                                    .utc()
                                    .format("YY/MM/DD HH:mm:ss")}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      },
                    )
                  ) : (
                    <tr className={styles["not-data"]}>
                      <td colSpan={4}>
                        <CommonEmptyData />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {walletTransactionsData &&
          walletTransactionsData?.result.length > 0 && (
            <Pagination
              paginationData={walletTransactionsData.pagination}
              page={page || "1"}
              setPage={setPage}
            />
          )}

        <div className={styles["notice-group"]}>
          <div className={styles.title}>
            <span>{t("modal_268")}</span>
          </div>
          <ul>
            <li>
              <span>{t("modal_269")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
