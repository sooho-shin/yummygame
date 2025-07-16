"use client";

import { usePostThirdParty, usePostThirdPartySearch } from "@/querys/provider";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/provider.module.scss";
import HistoryBox from "@/components/games/HistoryBox";
import ProviderGameLinkButtonBox from "./GameLinkButtonBox";
import useModalHook from "@/hooks/useModalHook";
import { ThirdPartyGameType } from "@/types/provider";
import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import GameGridContainer from "@/components/common/GameGridContainer";

export default function OriginalWrapper() {
  const t = useDictionary();

  const { mutate, isLoading, data: searchData } = usePostThirdPartySearch();

  useEffect(() => {
    mutate({ search: "yummy", producerName: "yummygame" });
  }, []);

  const { closeModal } = useModalHook();
  useEffect(() => {
    closeModal();
  }, []);

  return (
    <div className={styles["provider-wrapper"]}>
      <div className={styles.top}>
        <div className={styles["title-row"]}>
          <span>{t("home_37")}</span>
        </div>
      </div>

      <GameGridContainer thirdPartyData={searchData?.result.game_list} />

      <HistoryBox
        refetchDelay={100}
        type="provider"
        myHistoryData={[]}
        onlyAll={true}
        margin={32}
        full={true}
      />
    </div>
  );
}
