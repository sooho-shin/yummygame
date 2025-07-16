"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/mainWrapper.module.scss";
import MainTop from "@/components/main/Top";
import ProviderRow from "@/components/main/ProviderRow";
import { useGetMainThirdParty } from "@/querys/main";
import { useDictionary } from "@/context/DictionaryContext";
import HistoryBox from "@/components/games/HistoryBox";
import {
  categoryGameType,
  categoryType,
  gameNameType,
  ThirdPartyParamsType,
} from "@/types/provider";
import { useUserStore } from "@/stores/useUser";
import classNames from "classnames";
import { useDebounce } from "react-use";
import {
  useGetProviders,
  usePostThirdParty,
  usePostThirdPartySearch,
} from "@/querys/provider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CommonEmptyData from "@/components/common/EmptyData";
import { getCategoryCode } from "@/utils";
import GameGridContainer from "@/components/common/GameGridContainer";
import useCommonHook from "@/hooks/useCommonHook";
import { useSearchParams } from "next/navigation";
import ProviderFilterBox from "@/components/provider/ProviderFilterBox";
import ProviderFilterListBox from "@/components/provider/ProviderFilterListBox";

const CasinoMainWrapper = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const t = useDictionary();
  const { token } = useUserStore();
  const searchParams = useSearchParams();
  const { routeWithParams } = useCommonHook();
  const gameGroupArray: {
    title: string;
    name: gameNameType;
    id: categoryType;
  }[] = [
    // {
    //   title: t("home_21"),
    //   name: "hotgames",
    //   id: "hot",
    // },
    {
      title: t("main_4"),
      name: "original",
      id: "0",
    },
    {
      title: t("home_83"),
      name: "provider",
      id: "provider",
    },
    // {
    //   title: t("home_20"),
    //   name: "newReleases",
    //   id: 35,
    // },
    {
      title: t("home_22"),
      name: "slots",
      id: "slots",
    },
    {
      title: t("home_62"),
      name: "livecasino",
      id: "live",
    },
    {
      title: t("home_69"),
      name: "lottery",
      id: "lottery",
    },
    {
      title: t("home_26"),
      name: "card",
      id: "card",
    },
    {
      title: t("home_24"),
      name: "poker",
      id: "poker",
    },

    // {
    //   title: t("home_27"),
    //   name: "providerroulette",
    //   id: "roulette",
    // },
  ];

  const { data: thirdPartyData } = useGetMainThirdParty();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [inputActive, setInputActive] = useState(false);
  const [typingState, setTypingState] = useState<"end" | "typing">("end");
  const [debouncedValue, setDebouncedValue] = useState<string | null>(null);
  const [, cancel] = useDebounce(
    () => {
      setTypingState("end");
      setDebouncedValue(searchText === "" ? null : searchText);
    },
    300,
    [searchText],
  );

  // const [selectedFilter, setSeletedFilter] = useState<
  //   categoryGameType | "lobby"
  // >("lobby");

  const filterArray: { text: string; value: categoryGameType }[] = [
    { text: t("home_37"), value: "original" },
    { text: t("home_22"), value: "slots" },
    { text: t("common_12"), value: "livecasino" },
    { text: t("home_26"), value: "card" },
    { text: t("home_27"), value: "providerroulette" },
    { text: t("home_69"), value: "lottery" },
    { text: t("home_24"), value: "poker" },
  ];

  const sortDirectParam = searchParams.get("sortDirect");
  const categoryCodeParam = searchParams.get("categoryCode");
  const sortTypeParam = searchParams.get("sortType");
  const providerCodeListParam = searchParams.get("providerCodeList");
  const providerCategoryListParam = searchParams.get("providerCategoryList");
  const limitParam = searchParams.get("limit");
  const realName = searchParams.get("name");
  const thirdPartyListParamType = useMemo<ThirdPartyParamsType>(() => {
    const data: ThirdPartyParamsType = {
      categoryCode: [(categoryCodeParam ?? "list") as categoryType],
      providerCodeList: [],
    };

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
      data.providerCodeList = JSON.parse(providerCodeListParam);
    }

    return data;
  }, [
    categoryCodeParam,
    sortDirectParam,
    sortTypeParam,
    providerCodeListParam,
  ]);

  const {
    data: filteredThirdPartyData,
    fetchNextPage,
    hasNextPage,
  } = usePostThirdParty(thirdPartyListParamType);
  const [clickShowMore, setClickShowMore] = useState(false);

  const {
    mutate: searchMutate,
    isLoading,
    data: searchData,
  } = usePostThirdPartySearch();

  useEffect(() => {
    if (debouncedValue && debouncedValue?.length >= 3) {
      const data: {
        search: string;
        providerCode?: number;
        producerName?: string;
        categoryCode?: string;
      } = {
        search: debouncedValue,
      };

      if (categoryCodeParam) {
        data.categoryCode = categoryCodeParam;
      }

      if (providerCodeListParam) {
        data.producerName = JSON.parse(providerCodeListParam);
      }
      // if (providerCode !== null) {
      //   data.providerCode = providerCode;
      // }

      searchMutate(data);
    }
  }, [debouncedValue, categoryCodeParam, providerCodeListParam]);

  const providerList: {
    systemId: string;
    merchantName: string;
    count: number;
  }[] = useMemo(() => {
    let list = filteredThirdPartyData?.pages[0].result.provider_list;

    if (debouncedValue && debouncedValue.length > 2 && list) {
      list = list.map(aItem => {
        const matchedBItem = searchData?.result.provider_list.find(
          (bItem: { systemId: string; merchantName: string; count: number }) =>
            bItem.systemId === aItem.systemId,
        );
        return {
          ...aItem,
          count: matchedBItem ? matchedBItem.count : 0,
        };
      });
    }

    return list ?? [];
  }, [debouncedValue, searchData, filteredThirdPartyData]);

  return (
    <div className={styles["casino-main-wrapper"]}>
      <MainTop />
      <div className={styles["main-provider-wrapper"]}>
        <ProviderRow
          title={t("home_21")}
          name={"hotgames"}
          categoryCode={"hot"}
          providerData={thirdPartyData?.result["hot"]}
        />
        <div className={styles["search-container"]}>
          <div
            className={classNames(styles["search-box"], {
              [styles.active]: inputActive,
            })}
          >
            <div>
              <span></span>
              <input
                type={"text"}
                placeholder={t("home_84")}
                value={searchText || ""}
                onChange={e => {
                  setTypingState("typing");
                  setSearchText(e.target.value);
                }}
                onFocus={() => setInputActive(true)}
                onBlur={() => {
                  setInputActive(false);
                }}
              />
            </div>
          </div>
          <div className={styles["filter-row"]}>
            <button
              type={"button"}
              className={classNames({
                [styles.active]: !categoryCodeParam,
              })}
              onClick={() => {
                routeWithParams({
                  deleteParams: ["categoryCode"],
                  replace: true,
                });
              }}
            >
              <LazyLoadImage
                src={"/images/nav/lobby_a.svg"}
                alt={"ico lobby"}
              />
              <span>Lobby</span>
            </button>
            {filterArray.map(c => {
              return (
                <button
                  key={c.value}
                  type={"button"}
                  className={classNames({
                    [styles.active]:
                      categoryCodeParam === getCategoryCode(c.value),
                  })}
                  onClick={() => {
                    routeWithParams({
                      deleteParams: ["providerCodeList"],
                      paramArray: [
                        {
                          paramName: "categoryCode",
                          value: getCategoryCode(c.value) ?? "live",
                        },
                      ],
                      replace: true,
                    });
                  }}
                >
                  <LazyLoadImage
                    src={`/images/nav/${c.value}_a.svg`}
                    alt={"ico lobby"}
                  />
                  <span>{c.text}</span>
                </button>
              );
            })}
          </div>
          {categoryCodeParam && (
            <div className={styles["filter-box"]}>
              <ProviderFilterBox
                categoryCode={(categoryCodeParam ?? "live") as categoryType}
                providerList={providerList}
                disableSort={!!(debouncedValue && debouncedValue.length > 0)}
              />
              <ProviderFilterListBox providerList={providerList} />
            </div>
          )}
          {((debouncedValue && debouncedValue.length > 2) ||
            categoryCodeParam) && (
            <>
              <p className={styles.title}>Result</p>
              <div className={styles["list-container"]}>
                {(categoryCodeParam ||
                  (!categoryCodeParam && debouncedValue)) &&
                  (debouncedValue ? (
                    debouncedValue.length > 2 ? (
                      <>
                        {searchData?.result?.game_list.length > 0 ||
                        isLoading ? (
                          <GameGridContainer
                            thirdPartyData={searchData?.result?.game_list ?? []}
                            isLoading={isLoading}
                          />
                        ) : (
                          <div className={styles["empty-container"]}>
                            <CommonEmptyData text={t("home_85")} />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className={styles["error-container"]}>
                          <p>{t("home_86")}</p>
                        </div>
                      </>
                    )
                  ) : (
                    <>
                      <GameGridContainer
                        thirdPartyData={filteredThirdPartyData}
                        clickShowMore={clickShowMore}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        setClickShowMore={setClickShowMore}
                      />
                    </>
                  ))}
              </div>
            </>
          )}
        </div>

        {!categoryCodeParam &&
        !(debouncedValue && debouncedValue.length > 2) ? (
          gameGroupArray.map(
            (c: { title: string; name: string; id: categoryType }) => {
              return (
                <ProviderRow
                  key={c.id}
                  title={c.title}
                  providerData={thirdPartyData?.result[c.id] ?? null}
                  name={c.name as gameNameType}
                  categoryCode={c.id as categoryType}
                />
              );
            },
          )
        ) : (
          <ProviderRow
            key={"provider"}
            title={t("home_83")}
            providerData={null}
            name={"provider"}
            categoryCode={"provider"}
          />
        )}
      </div>
      <div className={styles["history-container"]}>
        <HistoryBox
          refetchDelay={100}
          type="provider"
          myHistoryData={[]}
          onlyAll={true}
          margin={40}
          full={true}
        />
      </div>
    </div>
  );
};

export default CasinoMainWrapper;
