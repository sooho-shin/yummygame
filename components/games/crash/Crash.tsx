"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useCommonStore } from "@/stores/useCommon";
import { BetInfo } from "@/types/games/crash";
import classNames from "classnames";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useMeasure } from "react-use";
import styles from "./styles/crash.module.scss";

export default function CrashContainer({
  startTimeStamp,
  resultRate,
  gapTimeStamp,
  betStartTimeStamp,
  status,
  children,
  setCurrentRate,
  winModal,
  qFirst,
  qRemove,
}: {
  startTimeStamp: number;
  resultRate: number;
  gapTimeStamp: number;
  betStartTimeStamp: number;
  children: ReactNode;
  winModal: JSX.Element;
  setCurrentRate: React.Dispatch<React.SetStateAction<string>>;
  status:
    | "Idle"
    | "Create"
    | "BetReady"
    | "Bet"
    | "BetStop"
    | "Play"
    | "PlayEnd"
    | null;
  qFirst: BetInfo;
  qRemove: () => BetInfo;
}) {
  const requestRef = useRef<number>(0);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [rate, setRate] = useState<string | null>(null);
  const [endRate, setEndRate] = useState<string | null>(null);
  const [count, setCount] = useState<string | null>("5.0");
  const [isExit, setIsExit] = useState<boolean>(false);
  const { media } = useCommonStore();
  const { checkMedia } = useCommonHook();
  const [objPoint, setObjPoint] = useState<DOMPoint | null>(null);
  const t = useDictionary();

  const [cookie] = useCookies();

  useEffect(() => {
    if (!qFirst || !objPoint || checkMedia == "mobile") return;
    addImageToSvg(
      qFirst.avatarIdx,
      objPoint.x,
      objPoint.y,
      false,
      qFirst.nickName,
    );
    qRemove();
  }, [qFirst, checkMedia]);

  const readyState = useMemo(() => {
    if (status === "Bet" || status === "BetStop") {
      return "wait";
    }
    if (status === "BetReady" || status === "PlayEnd") {
      return "playEnd";
    }
    return "play";
  }, [status]);

  const timeRate = useCallback((t: number) => {
    const a = 0.257;
    const b = 0.0000001;
    const c = 0.09;
    const d = 1;

    return (a * t ** 3 * (b * t ** 2) + c * t + d).toPrecision(4);
  }, []);

  const pathRef = useRef<SVGPathElement | null>(null);
  const movingImageRef = useRef<SVGImageElement | null>(null);
  const polygonRef = useRef<SVGPolygonElement>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const planetRef = useRef<HTMLDivElement | null>(null);
  const bgWrapperRef = useRef<HTMLDivElement | null>(null);
  const svgContainerRef = useRef<SVGSVGElement | null>(null);

  // 기울기의 각도를 계산하는 함수
  const calculateAngle = useCallback((slope: number) => {
    const radians = Math.atan(slope);
    const degrees = radians * (180 / Math.PI);

    return degrees;
  }, []);

  // 매 초 마다 곡선 좌표 계산
  const getBezierPoint = useCallback((t: number, points: number[][]) => {
    const [P0, P1, P2, P3] = points;

    const x =
      Math.pow(1 - t, 3) * P0[0] +
      3 * Math.pow(1 - t, 2) * t * P1[0] +
      3 * (1 - t) * Math.pow(t, 2) * P2[0] +
      Math.pow(t, 3) * P3[0];
    const y =
      Math.pow(1 - t, 3) * P0[1] +
      3 * Math.pow(1 - t, 2) * t * P1[1] +
      3 * (1 - t) * Math.pow(t, 2) * P2[1] +
      Math.pow(t, 3) * P3[1];
    return { x, y };
  }, []);

  const getBezierSlopeAtPoint = useCallback((points: number[][], t: number) => {
    t = Math.min(1, t);
    const dt = 0.001; // t에 대한 작은 변화량
    const t1 = t - dt;
    const t2 = t + dt;

    const point1 = getBezierPoint(t1, points);
    const point2 = getBezierPoint(t2, points);

    const slope = (point2.y - point1.y) / (point2.x - point1.x);

    return Math.abs(slope);
  }, []);

  function addImageToSvg(
    avatarIdx: number,
    x: number,
    y: number,
    isMyElement: boolean,
    nickName: string,
  ) {
    const svgContainer = svgContainerRef.current;
    const movingImage = movingImageRef.current;

    if (!svgContainer || !movingImage) {
      return false;
    }

    const imageSize: string = isMyElement ? "52" : "16";
    const imageSrc: string = `/images/avatar/img_avatar_${
      avatarIdx || "hidden"
    }.webp`;

    function createSvgElement(elementName: string): Element {
      return document.createElementNS(
        "http://www.w3.org/2000/svg",
        elementName,
      );
    }

    function createImage(
      width: string,
      height: string,
      x: number,
      y: number,
      src: string,
    ): Element {
      const image: Element = createSvgElement("image");
      image.setAttribute("width", width);
      image.setAttribute("height", height);
      image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", src);
      image.setAttribute("x", x.toString());
      image.setAttribute("y", y.toString());
      return image;
    }

    function createText(text: string, x: number, y: number): Element {
      const textElement: Element = createSvgElement("text");
      textElement.textContent = text;
      textElement.setAttribute("x", x.toString());
      textElement.setAttribute("y", y.toString());
      textElement.setAttribute("alignment-baseline", "middle");

      // 스타일 속성 추가
      textElement.setAttribute("font-family", "Pretendard");
      textElement.setAttribute("font-size", "12px");
      textElement.setAttribute("font-weight", "300");
      textElement.setAttribute("fill", "#E3E3E5");

      return textElement;
    }

    const group: Element = createSvgElement("g");

    const image: Element = createImage(imageSize, imageSize, x, y, imageSrc);

    const text: Element = createText(nickName || "Hidden", x, y);

    group.appendChild(image);
    group.appendChild(text);

    if (isMyElement) {
      const imageBubble: Element = createImage(
        "52",
        "52",
        x - Number(imageSize) / 2,
        y,
        imageSrc,
      );

      group.appendChild(imageBubble);
    }

    svgContainer.insertBefore(group, movingImage);

    const targetX: number = x - 60;
    const targetY: number = y + 200;
    const animationDuration: number = 5000;
    const startTime: number = new Date().getTime();

    function animate(): void {
      if (!svgContainer) {
        return;
      }
      const cur: number = new Date().getTime() - gapTimeStamp;

      const progress: number = cur - startTime;
      const ratio: number = progress / animationDuration;

      if (ratio >= 1) {
        svgContainer.removeChild(group);
        return;
      }

      const currentX: number = x + (targetX - x) * ratio;
      const currentY: number = y + (targetY - y) * ratio;

      image.setAttribute("x", currentX.toString());
      image.setAttribute("y", currentY.toString());
      text.setAttribute(
        "x",
        (currentX + 10 + Number(imageSize) / 2).toString(),
      );
      text.setAttribute("y", (currentY + Number(imageSize) / 2).toString());

      if (isMyElement) {
        (image as Element).setAttribute("x", currentX.toString());
        (image as Element).setAttribute("y", currentY.toString());
      }

      if (ratio < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  const [wrapperRef, { width: crashWidth, height: crashHeight }] =
    useMeasure<HTMLDivElement>();
  const getCoordinate = useMemo(() => {
    const points = [
      [0, crashHeight],
      [crashWidth * 0.33, crashHeight * 0.97],
      [crashWidth * 0.73, crashHeight * 0.68],
      [crashWidth, 0],
    ];

    return {
      points: points,
      coordinate: `M${points[0][0]},${points[0][1]} C${points[1][0]},${points[1][1]} ${points[2][0]},${points[2][1]} ${points[3][0]},${points[3][1]}`,
    };
  }, [crashWidth, crashHeight]);

  // 모든 객체들 움직이는 함수
  const moveAlongCurve = (progress: number) => {
    const pathPath = pathRef.current;
    const movingImage = movingImageRef.current;
    const polygon = polygonRef.current;
    const background = backgroundRef.current;
    const planet = planetRef.current;
    const bgWrapper = bgWrapperRef.current;
    if (pathPath && movingImage && polygon) {
      const pathLength = pathRef.current?.getTotalLength();
      const point = pathPath.getPointAtLength(progress * (pathLength ?? 0));
      setObjPoint(point);
      const slope = getBezierSlopeAtPoint(getCoordinate.points, progress);
      if (!background) return false;
      if (!planet) return false;
      if (!bgWrapper) return false;
      planet.style.display = "none";

      movingImage.setAttribute(
        "transform",
        `translate(${
          point.x - Number(movingImage.getAttribute("width")) / 2
        }, ${
          point.y - Number(movingImage.getAttribute("height")) / 2
        }) rotate(-${calculateAngle(slope)} ${
          Number(movingImage.getAttribute("width")) / 2
        } ${Number(movingImage.getAttribute("height")) / 2})`,
      );

      polygon.setAttribute(
        "points",
        `0,${crashHeight} 0,0 ${point.x},0 ${point.x},${crashHeight}`,
      );
      if (checkMedia === "mobile") return false;
      const backgroundPositionY = 100 - progress * progress * 30;
      background.style.backgroundPositionY = `${backgroundPositionY}%`;

      let b = 120;

      if (backgroundPositionY < 0) {
        b = b - progress * progress * 30;
        planet.style.display = "block";
      } else {
        planet.style.display = "none";
      }

      planet.style.backgroundPositionY = `${b}%`;
    } else {
      if (!background) return false;
      if (checkMedia !== "mobile") {
        background.style.backgroundPositionY = `${100}%`;
      }
    }
  };

  function run() {
    const cur = new Date().getTime() - gapTimeStamp;
    switch (status) {
      case "Play": {
        const s = (cur - startTimeStamp) / 1000;
        const cRate = parseFloat(timeRate(s)).toFixed(2);
        const duration = 11000; // 애니메이션 시간 (밀리초 , rate 가 2에 도달하는 시간)
        const progress = (s * 1000) / duration;

        moveAlongCurve(progress);
        setRate(cRate);
        setCurrentRate(cRate);
        break;
      }
      case "PlayEnd": {
        setCount("5.0");
        setEndRate(resultRate.toString());
        setIsExit(false);
        break;
      }

      case "Bet": {
        setRate("1");
        setCurrentRate("1");
        setEndRate(null);
        moveAlongCurve(0);
        const count = betStartTimeStamp - cur + 7000;
        if (count > 0 && count <= 7000) {
          setCount((count / 1000).toFixed(1));
        }
        break;
      }
      default:
    }
    requestRef.current = requestAnimationFrame(run);
  }

  useEffect(() => {
    if (crashWidth > 0) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(run);
    } else {
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [status, crashWidth, crashHeight, isExit]);

  return (
    <>
      <div ref={bgWrapperRef} className={styles.bg}>
        {crashWidth > 0 && (
          <>
            <div ref={backgroundRef} className={styles.background}></div>
            {readyState !== "wait" && status && (
              <div ref={planetRef} className={styles.planet}></div>
            )}
          </>
        )}
      </div>
      <div
        className={classNames(styles["crash-container"], {
          [styles.tablet]: media?.includes("tablet"),
        })}
      >
        <div
          className={classNames(styles["crash-box"], {
            [styles.tablet]: media?.includes("tablet"),
          })}
        >
          {!status && (
            <div className={styles["loading-wrapper"]}>
              <div className={styles["loading-container"]}>
                <span className={styles.loader}></span>
              </div>
            </div>
          )}
          {winModal}
          {readyState === "play" && winModal}
          {readyState === "wait" && (
            <>
              <div
                className={classNames(styles["count-text"], {
                  [styles["not-animation"]]:
                    cookie.disableAnimation === "disable",
                })}
              >
                {status === "BetStop" ? (
                  <span className={styles.aniReady}>{t("modal_301")}</span>
                ) : (
                  <span>{count}</span>
                )}
              </div>
              {(!cookie.disableAnimation ||
                cookie.disableAnimation === "able") &&
                hydrated && (
                  <div
                    className={`${styles["rocket-box"]} ${
                      status === "BetStop" ? styles.ani : ""
                    }`}
                  >
                    <div>
                      <div className={styles.rocket}></div>
                      <div className={styles.fire}></div>
                    </div>
                  </div>
                )}
            </>
          )}
          {readyState === "play" && (
            <div
              className={classNames(styles["rate-text"], {
                [styles["not-animation"]]:
                  cookie.disableAnimation === "disable" && hydrated,
              })}
            >
              {rate && `${rate} x`}
            </div>
          )}

          <div className={styles["svg-wrapper"]} ref={wrapperRef}>
            {crashWidth > 0 &&
              readyState !== "wait" &&
              status &&
              (!cookie.disableAnimation ||
                cookie.disableAnimation === "able") &&
              hydrated && (
                <svg ref={svgContainerRef}>
                  <defs>
                    <linearGradient
                      id="gradient"
                      gradientTransform="rotate(90)"
                    >
                      <stop offset="0%" stopColor="rgba(0, 166, 202, 0.5)" />
                      <stop offset="100%" stopColor="rgba(56, 68, 69, 0.2)" />
                    </linearGradient>
                    <linearGradient
                      id="gradient2"
                      gradientTransform="rotate(90)"
                    >
                      <stop offset="0%" stopColor="rgba(0, 166, 202, 1)" />
                      <stop offset="100%" stopColor="rgba(0, 166, 202, 0.2)" />
                    </linearGradient>
                    <clipPath id="mask">
                      <polygon
                        ref={polygonRef}
                        points={`0,0 0,0 0,0 0,0`}
                        fill="url(#gradient)"
                      />
                    </clipPath>
                  </defs>

                  <g clipPath="url(#mask)">
                    {/* M0,258 C261,241 395,130 416,0 */}
                    <path
                      d={`${getCoordinate.coordinate}L${crashWidth},${crashHeight}`}
                      fill="url(#gradient)"
                      strokeWidth="0"
                    />
                    <path
                      id="curve-path"
                      d={getCoordinate.coordinate}
                      fill="none"
                      stroke="url(#gradient2)"
                      strokeWidth="3"
                      ref={pathRef}
                    />
                  </g>

                  <g
                    ref={movingImageRef}
                    transform={`translate(0,${
                      crashHeight -
                      (hydrated && checkMedia === "mobile" ? 25 : 50)
                    })`}
                    width={hydrated && checkMedia === "mobile" ? "50" : "100"}
                    height={hydrated && checkMedia === "mobile" ? "50" : "100"}
                  >
                    <image
                      xlinkHref="/images/game/crash/img_bomb.gif"
                      width={hydrated && checkMedia === "mobile" ? "70" : "131"}
                      height={
                        hydrated && checkMedia === "mobile" ? "70" : "131"
                      }
                      x={hydrated && checkMedia === "mobile" ? "0" : "-28"}
                      y={hydrated && checkMedia === "mobile" ? "-6" : "0"}
                      opacity={readyState === "playEnd" ? 100 : 0}
                    />
                    <image
                      xlinkHref="/images/game/crash/img_fire.gif"
                      width={hydrated && checkMedia === "mobile" ? "70" : "100"}
                      height={
                        hydrated && checkMedia === "mobile" ? "70" : "100"
                      }
                      x={hydrated && checkMedia === "mobile" ? "-76" : "-118"}
                      y={hydrated && checkMedia === "mobile" ? "-23" : "-18"}
                      opacity={readyState === "playEnd" ? 0 : 100}
                    />
                    <image
                      xlinkHref="/images/game/crash/img_rocket.webp"
                      width={hydrated && checkMedia === "mobile" ? "70" : "100"}
                      height={
                        hydrated && checkMedia === "mobile" ? "70" : "100"
                      }
                      // width="100"
                      // height="100"
                      x={hydrated && checkMedia === "mobile" ? "-20" : "-36"}
                      y={hydrated && checkMedia === "mobile" ? "-11" : "-5"}
                      opacity={readyState === "playEnd" ? 0 : 100}
                    />
                  </g>
                </svg>
              )}
          </div>

          {readyState === "playEnd" && endRate && (
            <>
              <div
                className={classNames(styles["end-text"], {
                  [styles["not-animation"]]:
                    cookie.disableAnimation === "disable" && hydrated,
                })}
              >
                <span>{t("modal_302")}</span>
                <span>{endRate} x</span>
              </div>
            </>
          )}
        </div>

        {hydrated &&
          !(
            (checkMedia === "desktop" && media?.includes("tablet")) ||
            checkMedia !== "desktop"
          ) &&
          children}
      </div>
    </>
  );
}
