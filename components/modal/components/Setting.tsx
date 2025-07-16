"use client";

import ToggleBtn from "@/components/common/ToggleBtn";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useUserStore } from "@/stores/useUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./styles/settingModal.module.scss";
import CommonButton from "@/components/common/Button";
import { CookieOption } from "@/utils";
// import { useRouter } from "next/router";

export default function Setting() {
  const searchParams = useSearchParams();
  const { routeWithParams, showToast, defaultLang } = useCommonHook();
  const router = useRouter();
  const t = useDictionary();
  const { setUserSetting } = useUserStore();
  const pathName = usePathname();
  const { props } = useModalHook();

  const locales =
    process.env.NEXT_PUBLIC_MODE === "production"
      ? [
          "en",
          "cn",
          "de",
          "es",
          "id",
          "ja",
          "ko",
          "ms",
          "pt",
          "ru",
          "th",
          "vi",
          "tr",
          "fr",
          "it",
          "ar",
          "hu",
          "gr",
          "pl",
          // "dev",
        ]
      : [
          "en",
          "cn",
          "de",
          "es",
          "id",
          "ja",
          "ko",
          "ms",
          "pt",
          "ru",
          "th",
          "vi",
          "tr",
          "fr",
          "it",
          "ar",
          "hu",
          "gr",
          "pl",
          "dev",
        ];
  const fiats: string[] = [
    "usd",
    "eur",
    "jpy",
    "gbp",
    "aud",
    "cad",
    "cny",
    "krw",
  ];

  const getBtnText = (text: string) => {
    switch (text) {
      case "ko":
        return "KO (대한민국)";
      case "en":
        return "EN (English)";
      case "vi":
        return "VI (Tiếng Việt)";
      case "ms":
        return "MS (بهاس ملايو)";
      case "id":
        return "ID (Bahasa Indonesia)";
      case "th":
        return "TH (ภาษาไทย)";
      case "es":
        return "ES (Español)";
      case "de":
        return "DE (Deutsch)";
      case "pt":
        return "PT (Português)";
      case "ja":
        return "JA (日本語)";
      case "cn":
        return "CN (中文)";
      case "ru":
        return "RU (ру́сский язы́к)";
      case "tr":
        return "TR (Türkçe)";
      case "fr":
        return "FR (Français)";
      case "it":
        return "IT (Italiano)";
      case "ar":
        return "AR (العربية)";
      case "hu":
        return "HU (Magyar)";
      case "gr":
        return "GR (Ελληνικά)";
      case "pl":
        return "PL (Polski)";

      case "dev":
        return "DEV";

      case "usd":
        return "USD ($)";
      case "eur":
        return "EUR (€)";
      case "jpy":
        return "JPY (¥)";
      case "gbp":
        return "GBP (£)";
      case "aud":
        return "AUD ($)";
      case "cad":
        return "CAD ($)";
      case "cny":
        return "CNY (¥)";
      case "krw":
        return "KRW (₩)";
    }
  };

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    // console.log("window.location.pathname === ", window.location.pathname);
    // if (segments.join("/").includes("sports")) {
    //   current.set("forceRefresh", "true");
    // }
    segments[1] = locale;
    return segments.join("/") + (current ? `?${current}` : "");
  };

  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedFiat, setSelectedFiat] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies();

  const { closeModal, openModal } = useModalHook();

  const [fiatState, setFiatState] = useState(cookies.displayFiat);
  const [fiatChangeState, setFiatChangeState] = useState(false);

  useEffect(() => {
    !fiatState && setSelectedFiat(cookies?.fiat ?? fiats[0]);
  }, [fiatState]);

  const [languageLoadingState, setLanguageLoadingState] = useState(false);

  if (!props) return <></>;

  return (
    <div className={styles["setting-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_247")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["tab-row"]}>
          <button
            type="button"
            className={`${styles["tab-btn"]} ${
              props.modalTab === "language" ? styles.active : ""
            }`}
            onClick={() =>
              openModal({
                type: "setting",
                props: {
                  modalTab: "language",
                },
              })
            }
          >
            <span>{t("modal_248")}</span>
          </button>
          <button
            type="button"
            className={`${styles["tab-btn"]} ${
              props.modalTab === "displayFiat" ? styles.active : ""
            }`}
            onClick={() =>
              openModal({
                type: "setting",
                props: {
                  modalTab: "displayFiat",
                },
              })
            }
          >
            <span>{t("modal_249")}</span>
          </button>
        </div>
        <div className={styles["tab-content"]}>
          {props.modalTab === "language" ? (
            <>
              <p>{t("modal_1")}</p>
              <div className={styles["lang-choice-box"]}>
                {locales.map((c, i) => {
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setSelectedLang(c);
                      }}
                      className={
                        selectedLang
                          ? selectedLang === c
                            ? styles.active
                            : ""
                          : defaultLang === c
                            ? styles.active
                            : ""
                      }
                    >
                      <span>{getBtnText(c)}</span>
                      <span className={styles.check}></span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p>{t("modal_250")}</p>
              <div className={styles["fiat-choice-box"]}>
                <div className={styles["fiat-top"]}>
                  <p>{t("modal_249")}</p>
                  <ToggleBtn
                    active={fiatState}
                    callback={() => {
                      setFiatState(!fiatState);
                      setFiatChangeState(true);
                    }}
                  />
                </div>
                {fiatState && (
                  <div className={styles["btn-group"]}>
                    {fiats.map((c, i) => {
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() => {
                            setFiatChangeState(true);
                            setSelectedFiat(c);
                          }}
                          className={
                            selectedFiat
                              ? selectedFiat === c
                                ? styles.active
                                : ""
                              : cookies.fiat === c
                                ? styles.active
                                : ""
                          }
                        >
                          <span>{getBtnText(c)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {props.modalTab === "language" ? (
        <>
          <CommonButton
            text={t("modal_251")}
            isPending={languageLoadingState}
            className={`${styles["btn-submit"]} ${
              selectedLang ? styles.active : ""
            }`}
            onClick={() => {
              if (!selectedLang) {
                return false;
              }
              setCookie("lang", selectedLang, CookieOption);
              document.cookie =
                "sportsRendered=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

              // router.refresh();
              // }
              window.location.reload();
            }}
          />
        </>
      ) : (
        <button
          type="button"
          className={`${styles["btn-submit"]} ${
            fiatChangeState ? styles.active : ""
          }`}
          onClick={() => {
            if (!fiatChangeState) {
              return false;
            }
            if (fiatState && selectedFiat) {
              setCookie("fiat", selectedFiat, CookieOption);
              setCookie("displayFiat", "Y", CookieOption);
              setUserSetting({ displayFiat: selectedFiat });
            } else {
              // removeFiatCookie("fiat", CookieOption);
              removeCookie("displayFiat", CookieOption);
              setUserSetting({ displayFiat: null });
            }

            showToast(t("modal_252"));
            closeModal();
          }}
        >
          <span>{t("modal_251")}</span>
        </button>
      )}
    </div>
  );
}
