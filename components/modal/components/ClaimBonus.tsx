"use client";

import { formatNumber } from "@/utils";
import styles from "./styles/claimBonusModal.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useGetBonusClaim, useGetBonusStatisticsVer2 } from "@/querys/bonus";
import { useEffect, useRef } from "react";
import useCommonHook from "@/hooks/useCommonHook";
import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames";
import { useUserStore } from "@/stores/useUser";
import Confetti from "react-confetti";
import { useImmer } from "use-immer";

export default function ClaimBonus() {
  const { props, closeModal } = useModalHook();
  const t = useDictionary();
  const { token } = useUserStore();
  const { refetch } = useGetBonusStatisticsVer2(token);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetch && refetch();
  }, [refetch]);
  const [modalSize, setModalSize] = useImmer<{
    width: number;
    height: number;
  } | null>(null);
  useEffect(() => {
    if (ref.current) {
      setModalSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, [ref.current]);

  return (
    <div className={styles["claim-bonus-modal"]} ref={ref}>
      <div className={styles.top}>
        <span>{props.claimType === "RAKEBACK" && t("modal_503")}</span>
        <span>{props.claimType === "LEVELUP" && t("modal_504")}</span>
        <span>{props.claimType === "TIERUP" && t("modal_505")}</span>
        <span>{props.claimType === "WEEKLY" && t("modal_506")}</span>
        <span>{props.claimType === "MONTHLY" && t("modal_507")}</span>
        <span>{props.claimType === "AFFILIATE" && t("modal_506")}</span>
        <span>
          {props.claimType === "SP_EVT_WEEKLY_PAYBACK" && t("modal_509")}
        </span>
        <span>
          {props.claimType === "SP_EVT_LUCKY_POUCH" && t("modal_552")}
        </span>
      </div>
      <div className={`${styles.content}`}>
        {modalSize?.width && (
          <Confetti
            width={modalSize?.width}
            height={modalSize?.height - 42}
            // numberOfPieces={500}
            gravity={0.6}
            // wind={0.01}
            recycle={false}
            colors={[
              "#FAD1D1",
              "#FFDCA8",
              "#CDE4F2",
              "#B8E3D8",
              "#F8E6C1",
              "#D3C4E3",
              "#EAEAEA",
              "#FFE2E2",
            ]}
          />
        )}
        <div className={styles.group}>
          <LazyLoadImage
            alt={"img"}
            className={classNames(styles["img-bg"], styles.mo)}
            src={`/images/modal/claim/img_bg_${1}_mo.webp`}
          />
          <LazyLoadImage
            alt={"img"}
            className={classNames(styles["img-bg"])}
            src={`/images/modal/claim/img_bg_${1}.webp`}
          />
          <LazyLoadImage
            alt={"img"}
            className={styles["img-type"]}
            src={`/images/modal/claim/img_${props.claimType.toLocaleLowerCase()}.webp`}
          />
          <LazyLoadImage
            alt={"img"}
            className={styles["img-congratulations"]}
            src={`/images/modal/claim/img_congratulations.webp`}
          />
          <div>
            <LazyLoadImage
              src={"/images/tokens/img_token_jel_circle.svg"}
              alt={"img"}
            />
            <span>{props.claimedJel ?? "0000000000.00"} JEL</span>
          </div>
        </div>
        <button type={"button"} onClick={() => closeModal()}>
          <span>{t("modal_508")}</span>
        </button>
      </div>
    </div>
  );
}
