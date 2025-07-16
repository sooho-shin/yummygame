"use client";

import React, { useMemo } from "react";
import styles from "./styles/gameGridContainer.module.scss";
import ProviderGameLinkButtonBox from "@/components/provider/GameLinkButtonBox";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/query-core";
import {
  SportsLinkType,
  ThirdPartyDataType,
  ThirdPartyGameType,
} from "@/types/provider";

const GameGridContainer = ({
  thirdPartyData,
  clickShowMore,
  fetchNextPage,
  setClickShowMore,
  hasNextPage,
  isLoading,
}: {
  thirdPartyData:
    | InfiniteData<ThirdPartyDataType>
    | undefined
    | ThirdPartyGameType[];
  clickShowMore?: boolean;
  fetchNextPage?: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<ThirdPartyDataType, unknown>>;
  setClickShowMore?: React.Dispatch<React.SetStateAction<boolean>>;
  hasNextPage?: boolean | undefined;
  isLoading?: boolean;
}) => {
  const isThirdPartyListType = (
    data: InfiniteData<ThirdPartyDataType> | undefined | ThirdPartyGameType[],
  ): data is InfiniteData<ThirdPartyDataType> => {
    return !!(data && "pages" in data);
  };

  const Container = useMemo(() => {
    return (
      <>
        <div className={styles["game-grid-container"]}>
          {isLoading &&
            Array.from({ length: 12 }).map((c, i) => {
              return <div className={styles.skeleton} key={i}></div>;
            })}
          {isThirdPartyListType(thirdPartyData)
            ? thirdPartyData && !isLoading
              ? thirdPartyData.pages.map((j, ji) => {
                  return j.result.game_list.map((c, i) => {
                    return (
                      <ProviderGameLinkButtonBox
                        data={c}
                        key={i}
                        itemKey={i}
                        pageNum={clickShowMore ? 0 : ji}
                      />
                    );
                  });
                })
              : Array.from({ length: 12 }).map((c, i) => {
                  return <div className={styles.skeleton} key={i}></div>;
                })
            : thirdPartyData
              ? thirdPartyData.map((c: ThirdPartyGameType, i: number) => {
                  return <ProviderGameLinkButtonBox data={c} key={i} />;
                })
              : Array.from({ length: 12 }).map((c, i) => {
                  return <div className={styles.skeleton} key={i}></div>;
                })}
        </div>
        {fetchNextPage &&
          setClickShowMore &&
          isThirdPartyListType(thirdPartyData) && (
            <div className={styles["show-more-row"]}>
              <button
                type="button"
                onClick={() => {
                  fetchNextPage();
                  setClickShowMore(true);
                }}
                disabled={!hasNextPage}
              >
                <p>
                  {!hasNextPage ? "No More" : "Show More"}{" "}
                  <span>
                    ({thirdPartyData?.pages.length ?? 1}/
                    {thirdPartyData
                      ? thirdPartyData.pages[0].pagination.totalPage ?? 1
                      : 1}
                    )
                  </span>
                </p>
              </button>
            </div>
          )}
      </>
    );
  }, [thirdPartyData]);
  return Container;
};

export default GameGridContainer;
