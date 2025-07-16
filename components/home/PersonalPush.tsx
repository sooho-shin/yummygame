"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useSocketStore } from "@/stores/useSocket";
import { useUserStore } from "@/stores/useUser";
import BigNumber from "bignumber.js";
import { useEffect } from "react";

export default function PersonalPush() {
  const { token } = useUserStore();
  const { cacheStreamSocket, streamSocket } = useSocketStore();
  const t = useDictionary();
  useEffect(() => {
    streamSocket(token);
  }, [token]);
  const { showToast, divCoinType } = useCommonHook();
  const { refetch } = useGetCommon(token);
  const { data: assetReferData } = useGetAssetRefer();
  useEffect(() => {
    if (!cacheStreamSocket || !assetReferData) return () => false;
    if (!cacheStreamSocket.connected) {
      cacheStreamSocket.connect();
    }

    cacheStreamSocket.on(
      "crypto.deposit",
      (socket: { data: { amount: string; assetType: string } }) => {
        const humanAmount = divCoinType(
          socket.data.amount,
          socket.data.assetType.toLowerCase(),
        );
        showToast(
          <p>{`${socket.data.assetType} ${new BigNumber(
            humanAmount,
          ).toFormat()} ${t("home_48")}`}</p>,
        );
        refetch();
      },
    );
    const emitPing = () => {
      const fullUrl = window.location.href;
      const url = new URL(fullUrl);
      const path = url.pathname + url.search; // 경로 + 쿼리 문자열
      cacheStreamSocket.emit("networkPing", { url: path });
    };
    emitPing();
    const interval = setInterval(emitPing, 20 * 1000);
    return () => {
      clearInterval(interval);
      cacheStreamSocket.removeAllListeners();
      cacheStreamSocket.disconnect();
    };
  }, [cacheStreamSocket, assetReferData]);

  return <></>;
}
