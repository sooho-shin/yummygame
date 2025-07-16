"use client";

import styles from "./styles/mainWrapper.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Marquee from "react-fast-marquee";
import { useWindowSize } from "react-use";
import { useMemo } from "react";

export default function MainPartners() {
  const { width, height } = useWindowSize();

  const MarqueeContainer = useMemo(() => {
    return (
      <Marquee>
        {/* <Marquee> */}
        <div className={styles.content}>
          {Array.from({ length: 120 }).map((c, i) => {
            return (
              <div key={i}>
                <LazyLoadImage
                  alt={"img"}
                  src={"/images/footer/partner_" + ((i % 12) + 1) + ".webp"}
                />
              </div>
            );
          })}
        </div>
      </Marquee>
    );
  }, [width]);

  return (
    <div className={styles["main-partners-wrapper"]}>{MarqueeContainer}</div>
  );
}
