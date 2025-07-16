import { truncateDecimal } from "@/utils";
import styles from "./styles/gameLinkButtonBox.module.scss";
import Link from "next/link";
import { SportsLinkType, ThirdPartyGameType } from "@/types/provider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type providerListType = {
  idx: number;
  provider_name: string;
  provider_real_name: string | null;
  img_url: string;
};
export default function ProviderGameLinkButtonBox({
  data,
  className, // categoryCode,
  itemKey,
  pageNum,
  temp,
}: {
  data: ThirdPartyGameType | SportsLinkType | providerListType;
  className?: string;
  itemKey?: number;
  pageNum?: number;
  // categoryCode: string;
  temp?: boolean;
}) {
  // crash
  // wheel
  // roulette
  // flip
  // dice
  // ultimatedice
  // mine


  const getOriginalGameHref = useCallback(
    (gameId: string) => {
      switch (gameId) {
        case "1":
          return "crash";
        case "2":
          return "wheel";
        case "3":
          return "roulette";
        case "4":
          return "flip";
        case "5":
          return "dice";
        case "6":
          return "ultimatedice";
        case "7":
          return "mine";
        case "8":
          return "plinko";
        case "9":
          return "limbo";
        default:
          return "crash";
      }
    },
    [data],
  );

  const isSportsLinkType = (
    data: ThirdPartyGameType | SportsLinkType,
  ): data is SportsLinkType => {
    return "href" in data; // Replace 'category' with an actual unique key in SportsLinkType
  };

  const isProviderListType = (
    data: ThirdPartyGameType | SportsLinkType | providerListType,
  ): data is providerListType => {
    return "img_url" in data; // Replace 'category' with an actual unique key in providerListType
  };
  // useEffect(() => {
  //   const preloadImages = () => {
  //     const preloadSrcs = [
  //       originalGameList[prevIndex]?.image_full_path,
  //       originalGameList[nextIndex]?.image_full_path,
  //     ].filter(Boolean); // 유효한 경로만 남김
  //
  //     preloadSrcs.forEach(src => {
  //       const img = new Image();
  //       img.src = src;
  //     });
  //   };
  // }, []);
  if (isProviderListType(data)) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: (itemKey ?? 0) * 0.03 + (pageNum ? pageNum * 35 * 0.03 : 0),
          type: "spring",
        }}
        className={`${className && className} ${styles.box}`}
      >
        <div className={styles["provider-box"]}>
          <Link
            href={`/providers/${data.provider_name}?isProvider=true&name=${
              data.provider_real_name ?? data.provider_name
            }`}
          >
            <LazyLoadImage
              alt={"img sports"}
              src={data.img_url}
            ></LazyLoadImage>
          </Link>
        </div>
      </motion.div>
    );
  }
  if (isSportsLinkType(data)) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: (itemKey ?? 0) * 0.03 + (pageNum ? pageNum * 35 * 0.03 : 0),
          type: "spring",
        }}
        className={`${className && className} ${styles.box}`}
      >
        <div className={styles["sports-box"]}>
          <Link href={data.href}>
            <LazyLoadImage
              alt={"img sports"}
              src={`/images/sports/${data.name}.webp`}
            ></LazyLoadImage>
          </Link>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: (itemKey ?? 0) * 0.03 + (pageNum ? pageNum * 35 * 0.03 : 0),
          type: "spring",
        }}
        className={`${className && className} ${styles.box}`}
      >
        <Link
          href={
            data.game_type === "original"
              ? `/game/${getOriginalGameHref(data.game_id)}`
              : `/${
                  temp ? "providerTemp" : "provider"
                }/game?systemCode=${encodeURIComponent(
                  data.system ?? "",
                )}&pageCode=${encodeURIComponent(
                  data.page_code ?? "",
                )}&gameType=real`
          }
          className={styles.play}
          prefetch={false}
        >
          {data.game_type === "original"
            ? getOriginalGameHref(data.game_id)
            : data.system ?? 0}
        </Link>

        <div className={styles["hover-content"]}>
          <div className={styles.content}>
            <p className={styles.name}>
              {data.game_name}
              {/* {data.provider_name} */}
            </p>
            {data.rtp && data.rtp !== "0" && (
              <div className={styles["rtp-info"]}>
                <span>RTP</span>
                <span>
                  {truncateDecimal({
                    decimalPlaces: 2,
                    num: data.rtp,
                  })}
                  %
                </span>
              </div>
            )}
            <Link
              href={
                data.game_type === "original"
                  ? `/game/${getOriginalGameHref(data.game_id)}`
                  : `/${
                      temp ? "providerTemp" : "provider"
                    }/game?systemCode=${encodeURIComponent(
                      data.system ?? "",
                    )}&pageCode=${encodeURIComponent(
                      data.page_code ?? "",
                    )}&gameType=real`
              }
              className={styles.play}
              prefetch={false}
            >
              {data.game_type === "original"
                ? getOriginalGameHref(data.game_id)
                : data.system ?? 0}

            </Link>

            <div className={styles["fun-play"]}>
              {data.has_demo === "1" && (
                <Link
                  prefetch={false}
                  href={`/${
                    temp ? "providerTemp" : "provider"
                  }/game?systemCode=${encodeURIComponent(
                    data.system ?? "",
                  )}&pageCode=${encodeURIComponent(
                    data.page_code ?? "",
                  )}&gameType=fun`}
                >
                  <span>Fun Play</span>
                  <span></span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={styles.img}>
          <ProviderImage
            image_change_path={data.image_change_path}
            game_id={data.game_id}
            image_full_path={data.image_full_path}
            game_name={data.game_name}
            provider_name={data.provider_name}
          />
          {/*<div*/}
          {/*  className={styles.gradient}*/}
          {/*  style={{*/}
          {/*    background: `linear-gradient(180deg, transparent 0%, ${data.dark_color_code} 100%)`,*/}
          {/*  }}*/}
          {/*></div>*/}
        </div>
        {/*<div className={styles["dim-group"]}>*/}
        {/*  <div className={styles.content}>*/}
        {/*    <p>{data.game_name}</p>*/}
        {/*    <span>{data.provider_name}</span>*/}
        {/*    <div*/}
        {/*      className={styles.dim}*/}
        {/*      style={{ backgroundColor: data.dark_color_code }}*/}
        {/*    ></div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </motion.div>
    );
  }
}

const ProviderImage = ({
  image_change_path,
  image_full_path,
  game_id,
  game_name,
  provider_name,
}: {
  game_id: string;
  image_change_path: string | null;
  image_full_path: string | null;
  game_name: string;
  provider_name: string;
}) => {
  const [isImageLoad, setisImageLoad] = useState<boolean>(true);

  if (isImageLoad) {
    return (
      <LazyLoadImage
        visibleByDefault
        width={"100%"}
        height={"100%"}
        alt={`${game_name}, ${provider_name}`}
        src={
          image_change_path ||
          image_full_path ||
          `/images/provider/original/${game_id}.webp`
        }
        onError={() => setisImageLoad(false)}
      />
    );
  } else {
    return (
      <div className={styles.temp}>
        <div
          className={styles["img-box"]}
          style={{ backgroundImage: `url(/images/temp/provider_temp.webp)` }}
        ></div>
        <p className={styles.title}>{game_name}</p>
        <p className={styles["provider-name"]}>{provider_name}</p>
      </div>
    );
  }
};
