"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/gameWrapper.module.scss";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import {
  usePostThirdPartyStart,
  usePostThirdPartyStartTemp,
} from "@/querys/provider";
import useCommonHook from "@/hooks/useCommonHook";
import { useUserStore } from "@/stores/useUser";
import useModalHook from "@/hooks/useModalHook";
import { useCookies } from "react-cookie";

function TempMobileGameWrapper() {
  const searchParams = useSearchParams();
  const assetType = searchParams.get("assetType");
  const currency = searchParams.get("currency");
  const demo = searchParams.get("demo");
  const page = searchParams.get("page");
  const system = searchParams.get("system");
  const isMobile = searchParams.get("isMobile");
  const { mutate, isLoading } = usePostThirdPartyStartTemp();
  const { showToast, showErrorMessage } = useCommonHook();
  const { token } = useUserStore();
  const [cookies] = useCookies();
  const [script, setScript] = useState("");

  const { openModal } = useModalHook();

  useEffect(() => {
    // Script 생성
    const script = document.createElement("script");
    script.src = "https://cdn.launcher.a8r.games/connector.js";
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      // setGameData({
      //   div: "",
      //   id: "",
      //   script: "",
      // });
    };
  }, []);

  useEffect(() => {
    if (!token) {
      openModal({ type: "getstarted" });
    }
    if (
      assetType &&
      currency &&
      (demo === "1" || demo === "0") &&
      page &&
      system
    ) {
      mutate(
        {
          assetType: assetType,
          currency: currency,
          demo: demo,
          page: page,
          system: system,
          isMobile: "1",
          lang: cookies.lang || "en",
        },
        {
          onSuccess(data) {
            showErrorMessage(data.code);
            if (data.code === 0) {
              setScript(`
                (function() {
                  const launcher = new GameLauncher('game_wrapper');
                  launcher.run(${JSON.stringify(
                    data.result.script,
                  )}); <!-- Replace '<server response>' with actual server response -->  
                })()`);
            } else {
              showToast(data.result.script);
            }
          },
        },
      );
    }
  }, [assetType, currency, demo, page, system, isMobile, token]);

  return (
    <>
      {script && script !== "" && (
        <Script id={Date.now().toString()} type="text/javascript">
          {script}
        </Script>
      )}
      {/* {!div && <CommonLoading hasParent={true} />} */}
      <>
        <div
          className={`${styles["loading-back-container"]} ${styles.mobile}`}
        ></div>
        <div className={`${styles["game-play-area"]} ${styles.mobile}`}>
          <div
            id="game_wrapper"
            className={styles["provider-game-content"]}
          ></div>
        </div>
      </>
    </>
  );
}

export default TempMobileGameWrapper;
