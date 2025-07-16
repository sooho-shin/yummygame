"use client";

import useModalHook from "@/hooks/useModalHook";
import styles from "./styles/aboutToken.module.scss";
// import { useRouter } from "next/router";
import { useDictionary } from "@/context/DictionaryContext";

export default function AboutToken() {
  const t = useDictionary();

  // props.token = 토큰 이름
  const {
    props,
  }: {
    props: {
      token: "hon" | "jel" | "yyg";
    };
  } = useModalHook();

  const token = props.token;

  return (
    <div className={styles["setting-modal"]}>
      <div className={styles.top}>
        <span>About {token.toLocaleUpperCase()}</span>
      </div>
      <div className={styles.content}>
        <div
          className={styles["top-img-container"]}
          style={{
            backgroundImage: `url('/images/modal/aboutToken/img_top_${token}.png')`,
          }}
        >
          {token === "jel" && <span>1 JEL = 1 USD</span>}

          <div
            className={styles.coin}
            style={{
              backgroundImage: `url('/images/tokens/img_token_${token}_circle.svg')`,
            }}
          ></div>
        </div>
        <div className={styles["text-group"]}>
          {token === "jel" ? (
            <>
              <div className={styles.group}>
                <h5>{t("modal_2")}</h5>
                <p>{t("modal_3")}</p>
              </div>
              <div className={styles.group}>
                <h5>{t("modal_4")}</h5>
                <p>{t("modal_5")}</p>
              </div>
              {/*<div className={styles.group}>*/}
              {/*  <h5>{t("modal_6")}</h5>*/}
              {/*  <p>{t("modal_7")}</p>*/}
              {/*</div>*/}
            </>
          ) : token === "yyg" ? (
            <>
              <div className={styles.group}>
                <h5>{t("modal_460")}</h5>
                <p>{t("modal_461")}</p>
              </div>
              <div className={styles.group}>
                <h5>{t("modal_462")}</h5>
                <pre>{t("modal_463")}</pre>
              </div>
            </>
          ) : (
            <>
              <div className={styles.group}>
                <h5>{t("modal_8")}</h5>
                <p>{t("modal_9")}</p>
              </div>
              <div className={styles.group}>
                <h5>{t("modal_10")}</h5>
                <p>{t("modal_11")}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
