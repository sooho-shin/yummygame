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

export default function ProviderFilterListBox({
  providerList,
  mb = 20,
}: {
  providerList?:
    | { systemId: string; merchantName: string; count: number }[]
    | null;
  mb?: number;
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

  const { closeModal } = useModalHook();
  useEffect(() => {
    closeModal();
  }, []);

  const isProviderParam = searchParams.get("isProvider");
  const providerCodeListParam = searchParams.get("providerCodeList");
  const providerCategoryListParam = searchParams.get("providerCategoryList");

  const providerCodeList: string[] = useMemo(() => {
    return providerCodeListParam ? JSON.parse(providerCodeListParam) : [];
  }, [providerCodeListParam]);

  const providerCategoryList = useMemo(() => {
    return providerCategoryListParam
      ? JSON.parse(providerCategoryListParam)
      : [];
  }, [providerCategoryListParam]);

  // useEffect(() => {
  //   if (providerList && providerList.length && providerCodeList.length) {
  //     const newProviderParam = providerCodeList.filter(categoryItem =>
  //       providerList.some(
  //         providerItem => providerItem.systemId === categoryItem,
  //       ),
  //     );
  //
  //     if (newProviderParam.length === 0) {
  //       routeWithParams({
  //         deleteParams: ["providerCodeList"],
  //       });
  //     } else {
  //       routeWithParams({
  //         paramArray: [
  //           {
  //             paramName: "providerCodeList",
  //             value: JSON.stringify(newProviderParam),
  //           },
  //         ],
  //         replace: true,
  //       });
  //     }
  //   }

  // }, [providerList, providerCodeList]);
  const isProvider = useMemo(() => isProviderParam, [isProviderParam]);

  return (
    <>
      {(providerCodeList.length > 0 || providerCategoryList.length > 0) &&
        providerList && (
          <div
            className={styles["filter-row"]}
            style={{ marginBottom: mb + "px" }}
          >
            <div className={styles["filter-box"]}>
              {isProvider
                ? providerCategoryList.map((c: string, i: number) => {
                    const foundObject = categoryList.find(
                      item => item.value.toString() === c,
                    );

                    let newProviderCategoryList = providerCategoryList;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          newProviderCategoryList =
                            newProviderCategoryList.filter(
                              (item: string) => item !== c,
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
                        }}
                      >
                        <span>{foundObject?.text}</span>
                        <span></span>
                      </button>
                    );
                  })
                : providerCodeList.map((c: string, i: number) => {
                    const foundObject = providerList.find(
                      item => item.systemId === c,
                    );

                    let newProviderCodeList = providerCodeList;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          newProviderCodeList = newProviderCodeList.filter(
                            (item: string) => item !== c,
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
                        }}
                      >
                        <span>{foundObject?.merchantName}</span>
                        <span></span>
                      </button>
                    );
                  })}
            </div>
            <button
              type="button"
              onClick={() => {
                routeWithParams({
                  deleteParams: ["providerCodeList"],
                });
              }}
            >
              <span>Clear All</span>
            </button>
          </div>
        )}
    </>
  );
}
