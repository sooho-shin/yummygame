"use client";

import HistoryBox from "@/components/games/HistoryBox";
import { useGetBookmark } from "@/querys/bookmark";
import { usePostThirdParty } from "@/querys/provider";
import { useUserStore } from "@/stores/useUser";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import CommonEmptyData from "../common/EmptyData";
import ProviderGameLinkButtonBox from "../provider/GameLinkButtonBox";
import ProviderSearch from "../provider/Search";
import styles from "../provider/styles/provider.module.scss";
import { useDictionary } from "@/context/DictionaryContext";

export default function BookmarkWrapper({
  categoryCode,
}: {
  categoryCode: "favorite" | "recent";
}) {
  const t = useDictionary();
  const { token } = useUserStore();
  const { data: bookmarkData, isFetching } = useGetBookmark(
    categoryCode,
    token,
  );

  const [swipeState, setSwipeState] = useState(false);

  return (
    <div className={styles["provider-wrapper"]}>
      <ProviderSearch setSwipeState={setSwipeState} swipeState={swipeState} />
      <div className={styles.top}>
        <div className={styles["title-row"]}>
          <span>
            {(categoryCode === "favorite"
              ? t("game_64")
              : t("game_65")
            ).toLocaleUpperCase()}
          </span>
          <button
            type="button"
            onClick={() => {
              setSwipeState(true);
            }}
          ></button>
        </div>
      </div>

      <div className={styles["game-grid-container"]}>
        {!isFetching && bookmarkData ? (
          bookmarkData.result.length > 0 ? (
            bookmarkData.result.map((c, i) => {
              return <ProviderGameLinkButtonBox data={c} key={i} itemKey={i} />;
            })
          ) : (
            <div className={styles["not-data-box"]}>
              <CommonEmptyData />
            </div>
          )
        ) : (
          Array.from({ length: 12 }).map((_c, i) => {
            return <div className={styles.skeleton} key={i}></div>;
          })
        )}
      </div>

      <HistoryBox
        refetchDelay={100}
        type="provider"
        myHistoryData={[]}
        onlyAll={true}
        margin={32}
        full={true}
      />

      <RecommendedRow />
    </div>
  );
}

const RecommendedRow = () => {
  const swiperRef = useRef<SwiperRef>(null);
  const [activeSwiperIndex, setActiveSwiperIndex] = useState<number>(0);
  const showNumber = 6;
  const { data: recommendedData } = usePostThirdParty({
    categoryCode: ["hot"], // 무조건 핫게임
    providerCodeList: [],
  });

  return (
    <div className={styles["recommended-row"]}>
      <div className={styles.top}>
        <div className={styles.title}>
          <span>{"Recommended"}</span>
        </div>
        <div className={styles.navigation}>
          <div className={styles["btn-group"]}>
            <button
              type="button"
              onClick={() => {
                swiperRef.current &&
                  swiperRef.current.swiper.slideTo(
                    activeSwiperIndex - showNumber,
                  );
              }}
              disabled={activeSwiperIndex === 0}
            ></button>
            <button
              type="button"
              onClick={() => {
                swiperRef.current &&
                  swiperRef.current.swiper.slideTo(
                    activeSwiperIndex + showNumber,
                  );
              }}
              disabled={
                !recommendedData ||
                activeSwiperIndex >=
                  recommendedData.pages[0].result.game_list.length - showNumber
              }
            ></button>
          </div>
        </div>
      </div>
      <div className={styles["row-swiper-container"]}>
        {recommendedData && recommendedData.pages[0].result.game_list ? (
          <>
            <Swiper
              cssMode={true}
              pagination={false}
              mousewheel={true}
              keyboard={true}
              slidesPerView={6}
              spaceBetween={16}
              ref={swiperRef}
              className={styles["slider-area"]}
              onSlideChange={e => {
                setActiveSwiperIndex(e.activeIndex);
              }}
            >
              {recommendedData.pages[0].result.game_list.map((c, i) => {
                return (
                  <SwiperSlide key={i}>
                    <ProviderGameLinkButtonBox data={c} key={i} itemKey={i} />;
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className={styles["scroll-area"]}>
              <div>
                {recommendedData.pages[0].result.game_list.map((c, i) => {
                  return (
                    <ProviderGameLinkButtonBox data={c} key={i} itemKey={i} />
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className={styles["skeleton-container"]}>
            <div>
              <div className={styles.skeleton}></div>
              <div className={styles.skeleton}></div>
              <div className={styles.skeleton}></div>
              <div className={styles.skeleton}></div>
              <div className={styles.skeleton}></div>
              <div className={styles.skeleton}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
