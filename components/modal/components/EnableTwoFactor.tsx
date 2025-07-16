"use client";

import CommonButton from "@/components/common/Button";
import styles from "./styles/enableModal.module.scss";
import { customConsole } from "@/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "./styles/enableSwiper.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { LegacyRef, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { QRCodeSVG } from "qrcode.react";
import { useGetTwoFactorAuth, usePostTwoFactorAuth } from "@/querys/twoFactoe";
import CopyButton from "@/components/common/CopyButton";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import Image from "next/image";
// Install Swiper modules

export default function EnableTwoFactor() {
  const [tutorialOn, setTutorialOn] = useState(false);
  const { closeModal } = useModalHook();

  const { data, refetch } = useGetTwoFactorAuth();
  const { showErrorMessage, showToast } = useCommonHook();

  const { mutate, isLoading } = usePostTwoFactorAuth();

  const [passcode, setPassCode] = useState<string | null>("");

  const [focusState, setFocusState] = useState(false);
  const t = useDictionary();

  useEffect(() => {
    refetch();
  }, []);

  const handleSubmit = () => {
    if (passcode?.length === 6) {
      mutate(
        { passcode },
        {
          onSuccess(data) {
            showErrorMessage(data.code);
            if (data.code === 0) {
              closeModal();
              showToast(t("toast_13"));
            }
          },
        },
      );
    }
  };

  useEffect(() => {
    if (passcode && passcode.length === 6) {
      mutate(
        { passcode },
        {
          onSuccess(data) {
            showErrorMessage(data.code);
            if (data.code === 0) {
              closeModal();
              showToast(t("toast_13"));
              setPassCode("");
            }
          },
        },
      );
    }
  }, [passcode]);

  if (!data) return <></>;

  return (
    <div className={styles["enable-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_334")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["link-container"]}>
          <p>{t("modal_335")}</p>
          <div className={styles["swiper-container"]}>
            <Swiper
              spaceBetween={16}
              slidesPerView={"auto"}
              centeredSlides={true}
              draggable={true}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              onSlideChange={c => {
                if (c.activeIndex === 1) {
                  setTutorialOn(true);
                } else {
                  setTutorialOn(false);
                }
              }}
            >
              <SwiperSlide style={{ width: "250px" }}>
                <div className={styles["slide-box"]}>
                  <div className={styles.content}>
                    <div className={styles["auth-container"]}>
                      <LazyLoadImage
                        alt={"img"}
                        src={
                          "/images/modal/enable/img_google_authenticator.webp"
                        }
                      />
                      <div className={styles["text-row"]}>
                        <span>{t("modal_336")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "250px" }}>
                <div className={styles["slide-box"]}>
                  <div className={styles.content}>
                    <div
                      className={classNames(styles["tutorial-container"], {
                        [styles.active]: tutorialOn,
                      })}
                    >
                      <div className={styles["info-container"]}>
                        <div className={styles.row}>
                          <div className={styles.ico}>
                            <Image
                              alt={"img"}
                              src={"/images/modal/enable/ico_camera.svg"}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className={styles["text-group"]}>
                            <span>{t("modal_337")}</span>
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div className={styles.ico}>
                            <Image
                              alt={"img"}
                              src={"/images/modal/enable/ico_keyboard.svg"}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className={styles["text-group"]}>
                            <span>{t("modal_338")}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles["plus-container"]}>
                        <LazyLoadImage
                          alt={"img"}
                          src={
                            "/images/modal/enable/ico_plus_authenticator.webp"
                          }
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className={styles["download-group"]}>
            <a
              href="https://apps.apple.com/kr/app/google-authenticator/id388497605"
              target="_blank"
              rel="noreferrer"
            ></a>
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&pli=1"
              target="_blank"
              rel="noreferrer"
            ></a>
          </div>
        </div>
        <div className={styles["qrcode-container"]}>
          <div className={styles.top}>
            <span>{t("modal_337")}</span>
          </div>
          <div className={styles["qrcode-area"]}>
            <div className={styles["qrcode-box"]}>
              <QRCodeSVG value={data.result.url} size={96} />
            </div>
          </div>
        </div>
        <div className={styles["secret-container"]}>
          <div className={styles.top}>
            <span>{t("modal_339")}</span>
          </div>
          <div className={styles["copy-box"]}>
            <input value={data.result.secret} readOnly />
            <CopyButton copyValue={data.result.secret} disabled={false} />
          </div>
          <pre>{t("modal_340")}</pre>
        </div>
        <div className={styles["verification-container"]}>
          <div className={styles.top}>
            <span>{t("modal_341")}</span>
          </div>
          <input
            type="text"
            onChange={e => {
              const regex = /^[0-9]*$/; // 숫자만 체크
              if (regex.test(e.target.value)) {
                setPassCode(e.target.value);
                return true;
              } else {
                return false;
              }
            }}
            value={passcode ?? ""}
            maxLength={6}
            id="code"
            onFocus={() => setFocusState(true)}
            onBlur={() => setFocusState(false)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <label className={styles["code-input-group"]} htmlFor="code">
            {Array.from({ length: 6 }).map((c, i) => {
              return (
                <div
                  className={classNames(styles.box, {
                    [styles.focus]:
                      focusState &&
                      (passcode?.length === i ||
                        (i === 5 && passcode?.length === 6)),
                  })}
                  key={i}
                >
                  <span>{passcode?.slice(i, i + 1)}</span>
                </div>
              );
            })}
          </label>
        </div>
      </div>

      <CommonButton
        isPending={isLoading}
        text="Enable"
        onClick={() => handleSubmit()}
        disabled={passcode?.length !== 6}
      />
    </div>
  );
}
