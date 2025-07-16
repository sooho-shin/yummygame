"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/airdrop.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSpring, animated } from "react-spring";
import { useInterval } from "react-use";
import { useImmer } from "use-immer";
import { useDictionary } from "@/context/DictionaryContext";

const CountDown = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const t = useDictionary();

  const targetDate = "2025-03-28T23:59:59Z"; // UTC+0 날짜
  const [days, setDays] = useImmer<number>(0);
  const [hours, setHours] = useImmer<number>(0);
  const [minutes, setMinutes] = useImmer<number>(0);
  const [seconds, setSeconds] = useImmer<number>(0);

  const [beforeDays, setBeforeDays] = useImmer<number>(0);
  const [beforeHours, setBeforeHours] = useImmer<number>(0);
  const [beforeMinutes, setBeforeMinutes] = useImmer<number>(0);
  const [beforeSeconds, setBeforeSeconds] = useImmer<number>(0);

  useInterval(() => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    } = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    days !== timeLeft.days && setDays(timeLeft.days);
    hours !== timeLeft.hours && setHours(timeLeft.hours);
    minutes !== timeLeft.minutes && setMinutes(timeLeft.minutes);
    seconds !== timeLeft.seconds && setSeconds(timeLeft.seconds);
  }, 1000);

  useEffect(() => {
    setTimeout(() => {
      setBeforeDays(days);
      setBeforeHours(hours);
      setBeforeMinutes(minutes);
      setBeforeSeconds(seconds);
    }, 900);
  }, [days, hours, minutes, seconds]);
  return (
    <div className={styles["countdown-wrapper"]}>
      <div className={styles["img-title-row"]}>
        <LazyLoadImage src={"/images/airdrop/img_airdrop_token.webp"} />
        <pre className={styles["countdown-title"]}>{t("airdrop_116")}</pre>
      </div>
      <p className={styles["info-text"]}>{t("airdrop_117")}</p>
      <div className={styles["count-down-box"]}>
        <div className={styles["info-title"]}>
          <p>{t("airdrop_118")}</p>
          <p dangerouslySetInnerHTML={{ __html: t("airdrop_119") }}></p>
        </div>
        {hydrated && (
          <div className={styles["count-down-container"]}>
            <AnimatedBox
              value={days}
              beforeValue={beforeDays}
              label={t("airdrop_102")}
            />
            <div className={styles.division}>:</div>
            <AnimatedBox
              value={hours}
              beforeValue={beforeHours}
              label={t("airdrop_103")}
            />
            <div className={styles.division}>:</div>
            <AnimatedBox
              value={minutes}
              beforeValue={beforeMinutes}
              label={t("airdrop_104")}
            />
            <div className={styles.division}>:</div>
            <AnimatedBox
              value={seconds}
              beforeValue={beforeSeconds}
              label={t("airdrop_105")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface AnimatedBoxProps {
  value: number; // 현재 값
  beforeValue: number;
  label: string;
}

const AnimatedBox: React.FC<AnimatedBoxProps> = ({
  value,
  beforeValue,
  label,
}) => {
  const springBefore = useSpring({
    from: {
      transform: `translateY(${beforeValue !== value ? -100 : 0}%)`,
      opacity: 1,
    },
    to: { transform: "translateY(0%)", opacity: 1 },
    reset: true,
  });
  const springProps = useSpring({
    from: {
      transform: "translateY(0%)",
      opacity: beforeValue !== value ? 1 : 0,
    },
    to: {
      transform: `translateY(100}%)`,
      opacity: beforeValue !== value ? 1 : 0,
    },
    reset: true,
  });

  return (
    <div className={styles["whole-count-box"]}>
      <div className={styles["count-box"]}>
        <animated.div style={springBefore}>
          {value < 10 ? `0${value}` : `${value}`}
        </animated.div>
        {beforeValue !== value && (
          <animated.div style={springProps}>
            {value + 1 < 10 ? `0${value + 1}` : `${value + 1}`}
          </animated.div>
        )}
        <span></span>
      </div>
      <span>{label}</span>
    </div>
  );
};

export default CountDown;
