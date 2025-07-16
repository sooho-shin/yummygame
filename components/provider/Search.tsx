"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./styles/search.module.scss";
import { useClickAway, useDebounce } from "react-use";
import {
  usePostThirdParty,
  usePostThirdPartySearch,
  usePostThirdPartySearchTemp,
} from "@/querys/provider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import Link from "next/link";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { truncateDecimal } from "@/utils";
import CommonEmptyData from "../common/EmptyData";
import useCommonHook from "@/hooks/useCommonHook";
import ProviderGameLinkButtonBox from "./GameLinkButtonBox";
import { ThirdPartyGameType } from "@/types/provider";
import { useDictionary } from "@/context/DictionaryContext";

export default function ProviderSearch({
  swipeState,
  setSwipeState,
  providerCode,
}: {
  swipeState: boolean;
  setSwipeState: Dispatch<SetStateAction<boolean>>;
  providerCode?: number | null;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [inputActive, setInputActive] = useState(false);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [typingState, setTypingState] = useState<"end" | "typing">("end");
  const { checkMedia } = useCommonHook();
  const t = useDictionary();

  useClickAway(ref, () => {
    setInputActive(false);
  });

  const {
    mutate: searchMutate,
    isLoading,
    data: searchData,
  } = usePostThirdPartySearch();

  const recommendedSwiperRef = useRef<any>(null);
  const [activeRecommendedSwiperIndex, setActiveRecommendedSwiperIndex] =
    useState<number>(0);

  const searchedSwiperRef = useRef<any>(null);
  const [activeSearchedSwiperIndex, setActiveSearchedSwiperIndex] =
    useState<number>(0);

  const showNumber = 6;

  const { data: recommendedData } = usePostThirdParty({
    categoryCode: ["hot"], // 무조건 핫게임
    providerCodeList: [],
  });

  const [, cancel] = useDebounce(
    () => {
      setTypingState("end");
      setDebouncedValue(searchText === "" ? null : searchText);
    },
    300,
    [searchText],
  );

  useEffect(() => {
    if (debouncedValue && debouncedValue?.length >= 3) {
      const data: { search: string; providerCode?: number } = {
        search: debouncedValue,
      };
      if (providerCode !== null) {
        data.providerCode = providerCode;
      }

      searchMutate(data);
    }
  }, [debouncedValue]);

  useEffect(() => {
    const body = document.querySelector("body") as HTMLElement;
    if (body && window) {
      const scrollPosition = window.scrollY;
      if (checkMedia === "mobile" && swipeState) {
        body.style.overflow = "hidden";
        body.style.top = `-${scrollPosition}px`;
        body.style.left = "0";
        body.style.right = "0";
      } else {
        body.style.removeProperty("overflow");
        body.style.removeProperty("top");
        body.style.removeProperty("left");
        body.style.removeProperty("right");
        window.scrollTo(0, scrollPosition);
      }
    }
  }, [checkMedia, swipeState]);

  if (!hydrated) return <></>;

  return (
    <>
      <div
        className={`${styles["search-box"]} ${
          inputActive ? styles.active : ""
        } ${swipeState ? styles.swipe : ""}`}
        ref={ref}
      >
        <div className={styles["input-group"]}>
          <button
            type="button"
            className={styles["back-btn"]}
            onClick={() => {
              setSwipeState(false);
            }}
          ></button>
          <div className={styles["input-box"]}>
            {checkMedia !== "mobile" && <span></span>}

            <input
              type="text"
              placeholder={t("provider_6")}
              onFocus={() => setInputActive(true)}
              value={searchText || ""}
              onChange={e => {
                setSearchText(e.target.value);
                setTypingState("typing");
              }}
              onBlur={() => {
                checkMedia === "mobile" && setInputActive(false);
              }}
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText(null)}
              ></button>
            )}
          </div>
        </div>

        <div
          className={styles["search-container"]}
          style={{ display: inputActive ? "block" : "none" }}
        >
          <div className={styles["result-box"]}>
            <div className={styles.top}>
              <span>{t("provider_7")}</span>
              {checkMedia === "desktop" && (
                <div className={styles["btn-row"]}>
                  <button
                    type="button"
                    onClick={() => {
                      searchedSwiperRef.current &&
                        searchedSwiperRef.current.swiper.slideTo(
                          activeSearchedSwiperIndex - showNumber,
                        );
                    }}
                    disabled={
                      activeSearchedSwiperIndex === 0 ||
                      !searchData ||
                      !searchText ||
                      searchText.length < 3 ||
                      typingState === "typing" ||
                      isLoading
                    }
                  >
                    <span></span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      searchedSwiperRef.current &&
                        searchedSwiperRef.current.swiper.slideTo(
                          activeSearchedSwiperIndex + showNumber,
                        );
                    }}
                    disabled={
                      !searchData ||
                      !searchData.result.game_list ||
                      activeSearchedSwiperIndex >=
                        searchData.result.game_list.length - showNumber ||
                      !searchText ||
                      searchText.length < 3 ||
                      typingState === "typing" ||
                      isLoading
                    }
                  >
                    <span></span>
                  </button>
                </div>
              )}
            </div>

            {(typingState === "typing" || isLoading) && (
              <div className={styles["loading-container"]}>
                <span className={styles.loader}></span>
              </div>
            )}
            {/* <div className={styles["loading-container"]}>
                  <span className={styles.loader}></span>
                </div> */}

            {(!searchText || searchText.length < 3) &&
              typingState === "end" && (
                <div className={styles["disable-container"]}>
                  <span>{t("provider_8")}</span>
                </div>
              )}
            {typingState === "end" &&
              searchData &&
              searchText &&
              searchText.length >= 3 && (
                <div className={styles["row-swiper-container"]}>
                  {checkMedia !== "desktop" ? (
                    <>
                      {searchData.result.game_list &&
                      searchData.result.game_list.length > 0 ? (
                        searchData.result.game_list.map(
                          (c: ThirdPartyGameType, i: number) => {
                            return (
                              <ProviderGameLinkButtonBox data={c} key={i} />
                            );
                          },
                        )
                      ) : (
                        <div className={styles["no-data-container"]}>
                          <CommonEmptyData text={t("common_1")} />
                        </div>
                      )}
                    </>
                  ) : (
                    <Swiper
                      pagination={false}
                      mousewheel={true}
                      keyboard={true}
                      slidesPerView={7}
                      spaceBetween={16}
                      ref={searchedSwiperRef}
                      onSlideChange={e => {
                        setActiveSearchedSwiperIndex(e.activeIndex);
                      }}
                    >
                      {searchData.result.game_list &&
                      searchData.result.game_list.length > 0 ? (
                        searchData.result.game_list.map(
                          (c: ThirdPartyGameType, i: number) => {
                            return (
                              <SwiperSlide key={i}>
                                <ProviderGameLinkButtonBox data={c} key={i} />
                              </SwiperSlide>
                            );
                          },
                        )
                      ) : (
                        <div className={styles["no-data-container"]}>
                          <CommonEmptyData text={t("common_1")} />
                        </div>
                      )}
                    </Swiper>
                  )}
                </div>
              )}

            <div className={`${styles.top} ${styles["margin-top"]}`}>
              <span>{t("provider_9")}</span>
              {checkMedia === "desktop" && (
                <div className={styles["btn-row"]}>
                  <button
                    type="button"
                    onClick={() => {
                      recommendedSwiperRef.current &&
                        recommendedSwiperRef.current.swiper.slideTo(
                          activeRecommendedSwiperIndex - showNumber,
                        );
                    }}
                    disabled={activeRecommendedSwiperIndex === 0}
                  >
                    <span></span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      recommendedSwiperRef.current &&
                        recommendedSwiperRef.current.swiper.slideTo(
                          activeRecommendedSwiperIndex + showNumber,
                        );
                    }}
                    disabled={
                      !recommendedData ||
                      activeRecommendedSwiperIndex >=
                        recommendedData.pages[0].result.game_list.length -
                          showNumber
                    }
                  >
                    <span></span>
                  </button>
                </div>
              )}
            </div>
            <div className={styles["row-swiper-container"]}>
              {recommendedData ? (
                checkMedia !== "desktop" ? (
                  <>
                    {recommendedData.pages[0].result.game_list.map((c, i) => {
                      return <ProviderGameLinkButtonBox data={c} key={i} />;
                    })}
                  </>
                ) : (
                  <Swiper
                    pagination={false}
                    mousewheel={true}
                    keyboard={true}
                    slidesPerView={7}
                    spaceBetween={16}
                    ref={recommendedSwiperRef}
                    onSlideChange={e => {
                      setActiveRecommendedSwiperIndex(e.activeIndex);
                    }}
                  >
                    {recommendedData.pages[0].result.game_list.map((c, i) => {
                      return (
                        <SwiperSlide key={i}>
                          <ProviderGameLinkButtonBox data={c} key={i} />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )
              ) : (
                <div className={styles["skeleton-container"]}>
                  <div className={styles.skeleton}></div>
                  <div className={styles.skeleton}></div>
                  <div className={styles.skeleton}></div>
                  <div className={styles.skeleton}></div>
                  <div className={styles.skeleton}></div>
                  <div className={styles.skeleton}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {inputActive && <div className={styles["whole-dim"]}></div>}
    </>
  );
}
