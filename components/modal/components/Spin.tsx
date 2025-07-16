"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/spin.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames";
import { useDictionary } from "@/context/DictionaryContext";
import JSConfetti from "js-confetti";
import useModalHook from "@/hooks/useModalHook";
import { useGetMainBanner } from "@/querys/main";
import useCommonHook from "@/hooks/useCommonHook";
import { usePostBonusSpinDo } from "@/querys/bonus";
import { useUserStore } from "@/stores/useUser";
import { useGetCommon } from "@/querys/common";
import { useCookies } from "react-cookie";
import { CookieOption } from "@/utils";
import { preloadImage } from "@/utils/imagePreload";

interface SpinItem {
  token: string;
  amount: string;
}

const Spin: React.FC = () => {
  const [rotation, setRotation] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [winModalState, setWinModalState] = useState(false);
  const { setSpin } = useModalHook();
  const t = useDictionary();
  const [cookies, setCookie] = useCookies();
  const { data: bannerData, refetch } = useGetMainBanner({
    languageCode: cookies.lang ? cookies.lang.toUpperCase() : "EN",
  });
  const { showToast, showErrorMessage } = useCommonHook();
  const { token } = useUserStore();
  const { data: userData, refetch: refetchUserData } = useGetCommon(token);

  const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);

  useEffect(() => {
    const imageList = [
      "/images/modal/spin/token/btc.png",
      "/images/modal/spin/token/bnb.png",
      "/images/modal/spin/token/eth.png",
      "/images/modal/spin/token/usdc.png",
      "/images/modal/spin/token/usdt.png",
      "/images/modal/spin/token/sol.png",
      "/images/modal/spin/token/xrp.png",
      "/images/modal/spin/token/jel.png",
      "/images/modal/spin/img_selected.png",
      "/images/modal/spin/img_banner.webp",
      "/images/modal/spin/img_winmodal.webp",
      "/images/modal/spin/img_board.webp",
      "/images/modal/spin/spin_light_b.webp",
      "/images/modal/spin/spin_light_a.webp",
      "/images/modal/spin/img_button.webp",
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagesPromiseList: Promise<any>[] = [];
    for (const i of imageList) {
      imagesPromiseList.push(preloadImage(i));
    }
    const loadCall = async () => {
      await Promise.all(imagesPromiseList);
      setImagesPreloaded(true);
    };
    loadCall();
  }, []);

  const [spinStructure, setSpinStructure] = useState<
    { assetType: string; amount: string }[] | null
  >(null);

  useEffect(() => {
    if (bannerData?.result?.spin.spinStructure) {
      setSpinStructure(bannerData?.result?.spin.spinStructure);
    }
  }, [bannerData]);

  // 각도를 아이템 수에 맞게 균등하게 나눕니다.
  const angleStep = useMemo(() => {
    if (spinStructure && spinStructure.length > 0) {
      return 360 / spinStructure.length;
    } else {
      return 0;
    }
  }, [spinStructure]);

  const rotateCount = 5;
  const time = 3000;

  const [canvasRef, setCanvasRef] = useState<JSConfetti | null>(null);
  useEffect(() => {
    const canvas = document.getElementById("friction") as HTMLCanvasElement;
    setCanvasRef(new JSConfetti({ canvas }));
  }, []);
  //색종이 커스터마이징
  const handleClick = () => {
    if (canvasRef) {
      canvasRef.addConfetti({
        confettiColors: [
          "#ff0a54",
          "#ff477e",
          "#ff7096",
          "#ff85a1",
          "#fbb1bd",
          "#f9bec7",
        ],
        confettiRadius: 5,
        confettiNumber: 500,
      });
    }
  };

  const { mutate } = usePostBonusSpinDo();
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [assetTypeCode, setAssetTypeCode] = useState<string | null>(null);

  const startSpin = () => {
    if (!bannerData?.result?.spin.isPossibleSpin) {
      showToast(t("modal_455"));
      return false;
    }
    if (spinning) return;

    mutate(
      // @ts-ignore
      {},
      {
        onSuccess(data) {
          showErrorMessage(data.code);
          if (data.code === 0) {
            setSpinning(true);
            setSpin(true);
            const targetIndex = data.result.resultIndex;

            // 원하는 아이템 인덱스 설정 (예: 5번째 아이템을 위로)
            const target = targetIndex;
            const targetAngle = 360 - target * angleStep; // 위쪽으로 오게 할 각도 계산

            // 총 회전 각도: 5바퀴 + 목표 각도 (1800도 + 목표 각도)
            const totalRotation = rotateCount * 360 + targetAngle;

            // 회전 각도 설정
            setRotation(totalRotation);

            refetch();
            // 5초 후에 애니메이션 종료
            setTimeout(() => {
              setWinAmount(data.result.amount);
              setAssetTypeCode(data.result.assetTypeCode);
              setSpinning(false);
              setSpin(false);
              setRotation(targetAngle);
              setWinModalState(true);
              handleClick();
              refetchUserData();
            }, time);
          }
        },
      },
    );
  };

  useEffect(() => {
    if (!winModalState && canvasRef) {
      canvasRef.clearCanvas();
    }

    return () => {
      // cookies
      const now = new Date();
      const tomorrow = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
      );

      cookies.spin !== "Y" &&
        setCookie("spin", "Y", {
          ...CookieOption,
          expires: tomorrow,
          maxAge: undefined,
        });
      return canvasRef?.clearCanvas();
    };
  }, [winModalState]);

  function formatNumber(input: string): string {
    // 입력값을 숫자로 변환
    const number = parseFloat(input);

    // 변환이 실패한 경우 원래 문자열 반환
    if (isNaN(number)) {
      return input;
    }

    // 숫자를 문자열로 변환하여 정수부와 소수부 분리
    const numberString = number.toString();
    const [integerPart, fractionalPart = ""] = numberString.split(".");

    // 정수부와 소수부의 길이 계산
    const integerLength = integerPart.length;
    const fractionalLength = fractionalPart.length;

    // 정수부가 6자리 이상인 경우, 정수부만 잘라 반환
    if (integerLength >= 6) {
      return integerPart.slice(0, 6);
    }

    // 소수부의 길이 계산 (6 - 정수부 길이)
    const remainingLength = 6 - integerLength;

    // 소수부를 자릿수만큼 잘라서 붙임, 부족하면 0으로 채움
    const formattedNumber =
      integerPart +
      "." +
      fractionalPart.padEnd(remainingLength, "0").slice(0, remainingLength);

    return formattedNumber;
  }
  function capitalize(str: string) {
    return str
      .toLowerCase() // 모든 문자를 소문자로 변환
      .split(" ") // 문자열을 공백을 기준으로 나누어 배열로 변환
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 각 단어의 첫 글자만 대문자로 변환
      .join(" "); // 배열을 다시 문자열로 변환
  }

  return (
    <div className={styles["spin-modal-container"]}>
      <div className={styles.content}>
        <div className={styles["spin-title"]}>
          <span>{t("modal_450")}</span>
        </div>
        <div className={styles.available}>
          <p>
            {t("modal_454", [
              "VIP",
              capitalize(bannerData?.result?.spin.availableLevel ?? "Bronze 1"),
            ])}
          </p>
        </div>
        <div className={styles["board-container"]}>
          <div
            className={styles.board}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${time}ms cubic-bezier(0.33, 1, 0.68, 1)`
                : "none",
            }}
          >
            <div className={styles.light}></div>
            {spinStructure &&
              spinStructure.map((item, index) => {
                const angle = angleStep * index;
                const transform = `rotate(${angle}deg) translate(94px)`;

                return (
                  <div
                    key={index}
                    className={styles["spin-item"]}
                    style={{ transform }}
                  >
                    <span className={styles["amount"]}>
                      {formatNumber(item.amount)}
                    </span>
                    <LazyLoadImage
                      src={`/images/modal/spin/token/${item.assetType.toLocaleLowerCase()}.png`}
                      alt={"img token"}
                    />
                  </div>
                );
              })}
          </div>
          <button
            className={styles["spin-btn"]}
            type="button"
            onClick={startSpin}
          >
            <span>
              {t("modal_451")}
              <br />
              {t("modal_452")}
            </span>
          </button>

          <LazyLoadImage
            src={`/images/modal/spin/img_selected.png`}
            alt={"img selected"}
            className={styles.selected}
          />
        </div>
        <LazyLoadImage
          src={`/images/modal/spin/img_banner.webp`}
          alt={"img banner"}
          className={styles.banner}
        />
        <div
          className={classNames(styles["win-modal-container"], {
            [styles.active]: winModalState,
          })}
        >
          <div
            className={styles.dim}
            onClick={() => setWinModalState(false)}
          ></div>
          <div
            className={classNames(styles["win-modal"], {
              [styles.active]: winModalState,
            })}
          >
            <div>
              <span>{winAmount && formatNumber(winAmount.toString())}</span>
              {assetTypeCode && (
                <LazyLoadImage
                  src={`/images/modal/spin/token/${assetTypeCode?.toLocaleLowerCase()}.png`}
                  alt={"img token"}
                />
              )}
            </div>
          </div>
          <canvas
            id={"friction"}
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              zIndex: 9999,
              width: "100%",
              height: "100%",
            }}
          ></canvas>
        </div>
        <button type={"button"} className={styles.spin} onClick={startSpin}>
          <span>{t("modal_453")}</span>
        </button>
      </div>
    </div>
  );
};

export default Spin;
