"use client";

import useCommonHook from "@/hooks/useCommonHook";
import { useGetThirdPartyCount, usePostThirdParty } from "@/querys/provider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useClickAway } from "react-use";
import ProviderSearch from "./Search";
import styles from "./styles/provider.module.scss";
import {
  ThirdPartyParamsType,
  categoryType,
  categoryGameType,
} from "@/types/provider";
import { truncateDecimal } from "@/utils";
import HistoryBox from "@/components/games/HistoryBox";
import ProviderGameLinkButtonBox from "./GameLinkButtonBox";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import GameGridContainer from "@/components/common/GameGridContainer";
import ProviderFilterBox from "@/components/provider/ProviderFilterBox";
import ProviderFilterListBox from "@/components/provider/ProviderFilterListBox";
import classNames from "classnames";

export default function ProviderWrapper({
  categoryCode,
}: {
  categoryCode: categoryType;
}) {
  const searchParams = useSearchParams();
  const { routeWithParams } = useCommonHook();
  const t = useDictionary();

  const getCategoryName = (categoryCode: categoryType) => {
    switch (categoryCode) {
      case "0":
        return "yummygame";

      case "1":
        return "yummygame";

      case "hot":
        return t("home_21");

      case "live":
        return t("home_62");

      case "roulette":
        return t("home_27");

      case "card":
        return t("home_26");

      case "poker":
        return t("home_24");

      case "live_lottery":
        return t("home_69");

      default:
        return categoryCode;
    }
  };

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

  const {
    data: thirdPartyData,
    fetchNextPage,
    hasNextPage,
  } = usePostThirdParty(thirdPartyListParamType);

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
    <div className={styles["provider-wrapper"]}>
      <ProviderSearch
        setSwipeState={setSwipeState}
        swipeState={swipeState}
        providerCode={isProvider ? Number(categoryCode) : null}
      />
      <div
        className={classNames(styles.top, {
          [styles["no-padding-bottom"]]:
            providerCodeList.length > 0 || providerCategoryList.length > 0,
        })}
      >
        <div className={styles["title-row"]}>
          <span>{realName ?? getCategoryName(categoryCode).toUpperCase()}</span>
          {/*<span>{getCategoryName(categoryCode).toUpperCase()}</span>*/}
          <button
            type="button"
            onClick={() => {
              setSwipeState(true);
            }}
          ></button>
        </div>

        <ProviderFilterBox
          categoryCode={categoryCode}
          providerList={thirdPartyData?.pages[0].result.provider_list}
        />
      </div>

      <ProviderFilterListBox
        providerList={thirdPartyData?.pages[0].result.provider_list}
        mb={16}
      />
      {categoryCode === "live" && (
        <div className={styles["link-row"]}>
          {[
            { title: t("home_26"), href: "/provider/card", name: "card" },
            {
              title: t("home_27"),
              href: "/provider/providerroulette",
              name: "providerroulette",
            },
            {
              title: t("home_69"),
              href: "/provider/lottery",
              name: "lottery",
            },
            { title: t("home_24"), href: "/provider/poker", name: "poker" },
            // {
            //   title: t("home_62"),
            //   href: "/provider/livecasino",
            //   name: "livecasino",
            // },
          ].map(c => {
            return (
              <Link key={c.name} href={c.href}>
                <LazyLoadImage src={`/images/nav/${c.name}_a.svg`} />

                <span>{c.title}</span>
              </Link>
            );
          })}
        </div>
      )}

      <GameGridContainer
        thirdPartyData={thirdPartyData}
        clickShowMore={clickShowMore}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        setClickShowMore={setClickShowMore}
      />

      <HistoryBox
        refetchDelay={100}
        type="provider"
        myHistoryData={[]}
        onlyAll={true}
        margin={32}
        full={true}
      />
    </div>
  );
}
