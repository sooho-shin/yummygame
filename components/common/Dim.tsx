"use client";

import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useCommonStore } from "@/stores/useCommon";
import classNames from "classnames";
import styles from "./styles/dim.module.scss";
// import { useLockBodyScroll, useToggle } from "react-use";
import { useEffect, useState } from "react";
import Snowfall from "@/components/event/Snow";
// import Snowfall from "react-snowfall";

export default function Dim() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { isOpen, closeModal, type } = useModalHook();
  const {
    swipeState,
    isShowChat,
    setIsShowChat,
    isShowNotice,
    setSwipeState,
    setIsShowNotice,
  } = useCommonStore();
  const { checkMedia } = useCommonHook();

  useEffect(() => {
    const body = document.querySelector("body") as HTMLElement;
    if (body && window) {
      const scrollPosition = window.scrollY;
      if (
        (isOpen && type) ||
        ((checkMedia === "tablet" || checkMedia === "mobile") &&
          (swipeState || isShowChat || isShowNotice))
      ) {
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
  }, [isOpen, type, checkMedia, isShowChat, swipeState, isShowNotice]);
  const [state, setState] = useState(false);
  useEffect(() => {
    setState(false);
    return () => {
      setState(false);
    };
  }, []);

  // useEffect(() => {
  //   if (!state) {
  //     setTimeout(() => {
  //       setState(true);
  //     }, 500);
  //   }
  // }, [state]);

  return (
    <div
      style={{ zIndex: isOpen && type ? 6000 : 5500 }}
      className={classNames(styles.dim, {
        [styles.active]:
          (isOpen && type) ||
          (checkMedia === "tablet" &&
            (swipeState || isShowChat || isShowNotice)),
      })}
      onClick={() => {
        if (isOpen) {
          closeModal();
        } else {
          setIsShowChat(false);
          setIsShowNotice(false);
          setSwipeState(false);
        }
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      ></div>
    </div>
  );
}
