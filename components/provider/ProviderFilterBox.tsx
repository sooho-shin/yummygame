"use client";

import useCommonHook from "@/hooks/useCommonHook";
import { useGetThirdPartyCount, usePostThirdParty } from "@/querys/provider";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";
import styles from "./styles/providerFilterBox.module.scss";
import { ThirdPartyParamsType, categoryType } from "@/types/provider";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";

export default function ProviderFilterBox({
  categoryCode,
  providerList,
  disableSort,
  isNotTopPadding,
}: {
  categoryCode: categoryType;
  providerList?:
    | { systemId: string; merchantName: string; count: number }[]
    | null;
  disableSort?: boolean;
  isNotTopPadding?: boolean;
}) {
  const searchParams = useSearchParams();
  const { routeWithParams } = useCommonHook();
  const t = useDictionary();

  const categoryList = [
    { text: "Slots", value: "slots" },
    { text: "Card", value: "card" },
    { text: "Roulette", value: "roulette" },
    { text: "Poker", value: "poker" },
    { text: "Video Poker", value: "video_poker" },
    { text: "Crash", value: "crash" },
    { text: "Casual", value: "casual" },
    { text: "Lottery", value: "lottery" },
    { text: "Virtual Sports", value: "virtual_sports" },
    { text: "Mines", value: "mines" },
    { text: "Scratch", value: "scratch" },
    { text: "Fishing", value: "fishing" },
  ];

  const [providerDropDownState, setProviderDropDownState] = useState(false);
  const providerFilterRef = useRef<HTMLDivElement>(null);

  useClickAway(providerFilterRef, () => {
    setProviderDropDownState(false);
  });

  const { closeModal } = useModalHook();
  useEffect(() => {
    closeModal();
  }, []);

  const [sortDropDownState, setSortDropDownState] = useState(false);
  const sortFilterRef = useRef<HTMLDivElement>(null);
  useClickAway(sortFilterRef, () => {
    setSortDropDownState(false);
  });

  const sortDirectParam = searchParams.get("sortDirect");
  const isProviderParam = searchParams.get("isProvider");
  const sortTypeParam = searchParams.get("sortType");
  const providerCodeListParam = searchParams.get("providerCodeList");
  const providerCategoryListParam = searchParams.get("providerCategoryList");
  const limitParam = searchParams.get("limit");
  const realName = searchParams.get("name");

  const providerCodeList = useMemo(() => {
    return providerCodeListParam ? JSON.parse(providerCodeListParam) : [];
  }, [providerCodeListParam]);

  const providerCategoryList = useMemo(() => {
    return providerCategoryListParam
      ? JSON.parse(providerCategoryListParam)
      : [];
  }, [providerCategoryListParam]);

  const isProvider = useMemo(() => isProviderParam, [isProviderParam]);

  const { data: countData } = useGetThirdPartyCount({
    providerCode: categoryCode,
  });

  const thirdPartyListParamType = useMemo<ThirdPartyParamsType>(() => {
    let data: ThirdPartyParamsType = {
      categoryCode: [categoryCode],
      providerCodeList: [],
    };

    if (isProvider) {
      data = {
        categoryCode: [...providerCategoryList],
        providerCodeList: [categoryCode],
      };
    }

    if (limitParam) {
      data.limit = limitParam;
    } else {
      data.limit = "35";
    }

    if (sortDirectParam) {
      data.sortDirect = sortDirectParam as "desc" | "asc";
    }

    if (sortTypeParam) {
      data.sortType = sortTypeParam as string;
    }

    if (providerCodeListParam) {
      data.providerCodeList = isProvider
        ? [categoryCode, ...JSON.parse(providerCodeListParam)]
        : JSON.parse(providerCodeListParam);
    }

    return data;
  }, [
    categoryCode,
    sortDirectParam,
    sortTypeParam,
    providerCodeListParam,
    providerCategoryList,
  ]);

  const sortName = useMemo(() => {
    if (sortTypeParam === "popular") {
      return "Popular";
    }

    if (sortDirectParam === "desc") {
      return "Z-A";
    }

    if (sortDirectParam === "asc") {
      return "A-Z";
    }

    return "Popular";
  }, [sortDirectParam, sortTypeParam]);

  const [swipeState, setSwipeState] = useState(false);

  const [clickShowMore, setClickShowMore] = useState(false);

  return (
    <>
      <div className={styles["filter-box"]}>
        <div
          className={`${styles["provider-filter-box"]}`}
          ref={providerFilterRef}
        >
          <button
            type="button"
            className={providerDropDownState ? styles.active : ""}
            onClick={() => setProviderDropDownState(!providerDropDownState)}
          >
            <span>{isProvider ? "All Categories" : "Provider"}</span>
            {(providerCodeList.length > 0 ||
              providerCategoryList.length > 0) && (
              <span className={styles.count}>
                {isProvider
                  ? providerCategoryList.length
                  : providerCodeList.length}
              </span>
            )}
            <span className={styles.arrow}></span>
          </button>
          {providerDropDownState && (
            <ul className={styles["provider-filter-dropbox"]}>
              {providerList &&
                !isProvider &&
                providerList.map((c, i) => {
                  let newProviderCodeList = providerCodeListParam
                    ? JSON.parse(providerCodeListParam)
                    : [];
                  return (
                    <li key={i}>
                      <input
                        type="checkbox"
                        id={c.systemId}
                        onChange={({ target: { checked } }) => {
                          if (checked) {
                            newProviderCodeList.push(c.systemId);
                            routeWithParams({
                              paramArray: [
                                {
                                  paramName: "providerCodeList",
                                  value: JSON.stringify(newProviderCodeList),
                                },
                              ],
                              replace: true,
                            });
                          } else {
                            newProviderCodeList = newProviderCodeList.filter(
                              (item: string) => item !== c.systemId,
                            );
                            if (newProviderCodeList.length === 0) {
                              routeWithParams({
                                deleteParams: ["providerCodeList"],
                              });
                            } else {
                              routeWithParams({
                                paramArray: [
                                  {
                                    paramName: "providerCodeList",
                                    value: JSON.stringify(newProviderCodeList),
                                  },
                                ],
                                replace: true,
                              });
                            }
                          }
                        }}
                        checked={providerCodeList.includes(c.systemId)}
                      />
                      <label htmlFor={c.systemId}>
                        <span>{c.merchantName}</span>
                        <span className={styles.count}>{c.count}</span>
                      </label>
                    </li>
                  );
                })}
              {isProvider &&
                // providerCategoryList
                categoryList.map(c => {
                  let newProviderCategoryList = providerCategoryListParam
                    ? JSON.parse(providerCategoryListParam)
                    : [];
                  return (
                    <li key={c.value}>
                      <input
                        type="checkbox"
                        id={c.value.toString()}
                        onChange={({ target: { checked } }) => {
                          if (checked) {
                            newProviderCategoryList.push(c.value.toString());
                            routeWithParams({
                              paramArray: [
                                {
                                  paramName: "providerCategoryList",
                                  value: JSON.stringify(
                                    newProviderCategoryList,
                                  ),
                                },
                              ],
                              replace: true,
                            });
                          } else {
                            newProviderCategoryList =
                              newProviderCategoryList.filter(
                                (item: string) => item !== c.value.toString(),
                              );
                            if (newProviderCategoryList.length === 0) {
                              routeWithParams({
                                deleteParams: ["providerCategoryList"],
                              });
                            } else {
                              routeWithParams({
                                paramArray: [
                                  {
                                    paramName: "providerCategoryList",
                                    value: JSON.stringify(
                                      newProviderCategoryList,
                                    ),
                                  },
                                ],
                                replace: true,
                              });
                            }
                          }
                        }}
                        checked={providerCategoryList.includes(
                          c.value.toString(),
                        )}
                      />
                      <label htmlFor={c.value.toString()}>
                        <span>{c.text}</span>
                        {countData && (
                          <span className={styles.count}>
                            {countData.result[c.value.toString()] ?? "0"}
                          </span>
                        )}
                      </label>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
        {!disableSort && (
          <div className={`${styles["sort-filter-box"]}`} ref={sortFilterRef}>
            <button
              type="button"
              className={sortDropDownState ? styles.active : ""}
              onClick={() => setSortDropDownState(!sortDropDownState)}
            >
              <span>{sortName}</span>
              <span className={styles.arrow}></span>
            </button>
            {sortDropDownState && (
              <ul className={styles["drop-box"]}>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      routeWithParams({
                        deleteParams: ["sortDirect"],
                        paramArray: [
                          {
                            paramName: "sortType",
                            value: "popular",
                          },
                          {
                            paramName: "sortDirect",
                            value: "asc",
                          },
                        ],
                        replace: true,
                      });
                      setSortDropDownState(false);
                    }}
                  >
                    <span>Popular</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      routeWithParams({
                        // deleteParams: ["sortType"],
                        paramArray: [
                          {
                            paramName: "sortDirect",
                            value: "asc",
                          },
                          {
                            paramName: "sortType",
                            value: "gameName",
                          },
                        ],
                        replace: true,
                      });
                      setSortDropDownState(false);
                    }}
                  >
                    <span>A-Z</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      routeWithParams({
                        // deleteParams: ["sortType"],
                        paramArray: [
                          {
                            paramName: "sortDirect",
                            value: "desc",
                          },
                          {
                            paramName: "sortType",
                            value: "gameName",
                          },
                        ],
                        replace: true,
                      });
                      setSortDropDownState(false);
                    }}
                  >
                    <span>Z-A</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
