"use client";

import { useUserStore } from "@/stores/useUser";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles/mainWrapper.module.scss";
import { useCookies } from "react-cookie";
// import required modules
// Import Swiper styles
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetMainBanner } from "@/querys/main";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "swiper/swiper-bundle.css";
import "./styles/topSwiper.css";
import { Autoplay, Pagination } from "swiper/modules";
import { useCommonStore } from "@/stores/useCommon";

export default function MainTop() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { openModal, isOpen } = useModalHook();
  const { token } = useUserStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const { checkMedia } = useCommonHook();
  const swiperRef = useRef<any>(null);
  const [cookies] = useCookies();

  const { data, refetch } = useGetMainBanner({
    languageCode: cookies.lang ? cookies.lang.toUpperCase() : "EN",
  });
  const slidesToShow = useMemo(() => {
    return checkMedia === "mobile"
      ? 1
      : checkMedia === "tablet" || checkMedia === "middle"
        ? 2
        : 3;
  }, [checkMedia]);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token]);

  useEffect(() => {
    if (data?.result?.attendance && hydrated) {
      openModal({
        type: "honDropEvent",
        props: {
          strikeCount: data?.result?.attendance.strikeCount,
          todayGetHon: data?.result?.attendance.todayGetHon,
        },
      });
      refetch();
    }
  }, [data, hydrated]);

  // useEffect(() => {
  //   if (data?.result?.spin.isPossibleSpin && hydrated && cookies.spin !== "Y") {
  //     openModal({ type: "spin" });
  //   }
  // }, [data, hydrated]);

  return (
    <div className={styles["main-top-wrapper"]}>
      {hydrated && data ? (
        <div
          className={styles["slider-container"]}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={styles.dim}></div>
          <div className={`${styles.dim} ${styles.left}`}></div>
          {data.result &&
            slidesToShow !== data.result.bannerList.length &&
            hovered && (
              <>
                <button
                  type="button"
                  className={styles.prev}
                  // disabled={activeIndex === 0}
                  onClick={() => {
                    if (!data.result) {
                      return false;
                    }
                    if (activeIndex === 0) {
                      swiperRef.current.swiper.slideTo(
                        data.result.bannerList.length,
                      );
                    } else {
                      swiperRef.current.swiper.slideTo(activeIndex - 1);
                    }
                  }}
                ></button>
                <button
                  type="button"
                  className={styles.next}
                  onClick={() => {
                    if (data.result) {
                      const totalSlides = data.result.bannerList.length;

                      const lastVisibleIndex = activeIndex + slidesToShow - 1;

                      const nextIndex =
                        lastVisibleIndex >= totalSlides - 1
                          ? 0
                          : activeIndex + slidesToShow;

                      swiperRef.current.swiper.slideTo(nextIndex);
                    }
                  }}
                ></button>
              </>
            )}
          <Swiper
            slidesPerView={slidesToShow}
            spaceBetween={
              checkMedia === "mobile" ? 8 : checkMedia === "tablet" ? 20 : 20
            }
            ref={swiperRef}
            pagination={{
              clickable: true,
            }}
            onSlideChange={e => {
              setActiveIndex(e.activeIndex);
            }}
            autoplay={{ delay: 3000 }}
            modules={[Autoplay, Pagination]}
            className={"banner-slide"}
            // pagination={true}
          >
            {data.result &&
              data.result.bannerList.map((c, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div className={styles.content} key={i}>
                      {c.is_blank === "1" ? (
                        <a
                          className={styles["img-bg"]}
                          style={{
                            backgroundImage: `url(${c.image_url})`,
                            pointerEvents: !c.link_url ? "none" : "auto",
                          }}
                          href={c.link_url ?? "/"}
                          target={"_blank"}
                          rel="noreferrer"
                        ></a>
                      ) : (
                        <Link
                          className={styles["img-bg"]}
                          href={c.link_url ? c.link_url : "/"}
                          style={{
                            backgroundImage: `url(${c.image_url})`,
                            pointerEvents: !c.link_url ? "none" : "auto",
                          }}
                        ></Link>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      ) : (
        <div className={styles["top-skeleton-container"]}>
          {Array.from({ length: 3 }).map((c, i) => {
            return (
              <div key={i}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
