"use client";

import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetAssetRefer,
  useGetCommon,
  useGetCryptoUsd,
} from "@/querys/common";
import { useAssetStore } from "@/stores/useAsset";
import { useUserStore } from "@/stores/useUser";
import { BetLimitDataType } from "@/types/games/common";
import BigNumber from "bignumber.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useWindowScroll, useWindowSize } from "react-use";
import useModalHook from "./useModalHook";
import { useGetGameInfo } from "@/querys/game/common";
import { preloadImage } from "@/utils/imagePreload";
import { useCommonStore } from "@/stores/useCommon";
import { formatNumber } from "@/utils";
import { useImmer } from "use-immer";
import ReactGA from "react-ga4";
import Format from "string-format";

interface CoinObject {
  [key: string]: string;
}

interface TransformedCoin {
  name: string;
  amount: string;
}

export default function useCommonHook() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const { openModal, closeModal } = useModalHook();
  const { setWholeLoadingState, tokenList, setTokenList } = useCommonStore();

  const t = useDictionary();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { displayFiat, token } = useUserStore();
  const { data: commonData } = useGetCommon(token);
  const { data: exchangeData } = useGetCryptoUsd();
  const { data: assetReferData } = useGetAssetRefer();
  const coin = useAssetStore(state => state.coin);

  useEffect(() => {
    if (
      commonData &&
      commonData?.result &&
      !commonData?.result.isReceiveDepositBonus
    ) {
      openModal({
        type: "depositBonusPromotion",
        props: {
          totalBonusAmount: commonData.result.depositBonusData.totalBonusAmount,
          assetType: commonData.result.depositBonusData.assetType,
          wagerMultiply: commonData.result.depositBonusData.wagerMultiply,
        },
      });
    }
  }, [commonData]);

  const divCoinType = (amount: string, coin: string) => {
    if (
      !assetReferData ||
      !assetReferData.result.assetInfo[coin.toUpperCase()]
    ) {
      return "0";
    }

    const div = assetReferData.result.assetInfo[coin.toUpperCase()].division;

    return new BigNumber(amount).div(div).toFixed();
  };

  const timesCoinType = (amount: string, coin: string) => {
    if (!assetReferData || !assetReferData.result.assetInfo[coin.toUpperCase()])
      return "0";

    const div = assetReferData.result.assetInfo[coin.toUpperCase()].division;

    return new BigNumber(amount).times(div).toFixed();
  };

  // 쿼리스트링 전달
  const routeWithParams = ({
    paramArray,
    deleteParams,
    reset,
    replace,
  }: {
    paramArray?: { paramName: string; value: string }[];
    deleteParams?: string[] | null;
    reset?: boolean;
    replace?: boolean;
  }) => {
    let current = new URLSearchParams(Array.from(searchParams.entries()));

    if (reset) {
      // reset 프로퍼티가 true이면 URLSearchParams를 초기화합니다.
      current = new URLSearchParams();
    }
    if (deleteParams) {
      for (let index = 0; index < deleteParams.length; index++) {
        const element = deleteParams[index];
        current.delete(element);
      }
    }

    if (paramArray) {
      for (let i = 0; i < paramArray.length; i++) {
        if (current.has(paramArray[i].paramName)) {
          current.set(paramArray[i].paramName, paramArray[i].value);
          // paramName 쿼리 매개변수가 이미 존재하면 값을 교체합니다.
        } else {
          current.append(paramArray[i].paramName, paramArray[i].value);
          // paramName 쿼리 매개변수가 존재하지 않으면 추가합니다.
        }
      }
    }
    const url = `${pathname}?${current.toString()}`;
    // 수정된 URL을 생성합니다.
    if (replace) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url, { scroll: false });
    }
  };

  // 환율
  // const exchangeRate = useMemo<string | undefined>(() => {
  const exchangeRate = useMemo(() => {
    if (exchangeData && exchangeData.result) {
      return coin === "hon"
        ? "1"
        : exchangeData.result.cryptoToFiat[coin ?? "jel"][displayFiat || "usd"];
    } else {
      return "1";
    }
  }, [exchangeData, coin, displayFiat]);

  //토스트 먹고싶다
  const showToast = useCallback((text: string | React.ReactNode) => {
    toast(text, {
      hideProgressBar: true,
    });
    // if (typeof text !== "string") {
    //   toast(text, {
    //     hideProgressBar: true,
    //   });
    // } else {
    //   toast(Format(text, ...formatData), {
    //     hideProgressBar: true,
    //   });
    // }
  }, []);

  // 서버 코드에 따른 에러메세지 error message
  const showErrorMessage = (code: number) => {
    if (code === 0) {
      return true;
    }

    if (code === -12033) {
      openModal({
        type: "alert",
        alertData: {
          title: t("modal_406"),
          children: <span style={{ color: "#e3e3e5" }}>{t("modal_407")}</span>,
        },
        callback: () => {
          router.push("/provider/hotgames");
        },
      });

      return false;
    }

    const key = `error_${Math.abs(code).toString()}`;

    const value = t(key);

    if (key === value) {
      showToast(`Error Code ${code}`);
    } else {
      showToast(value);
    }
  };

  const transformObject = useCallback((inputObject: CoinObject) => {
    const transformedArray: TransformedCoin[] = [];
    for (const key in inputObject) {
      if (Object.prototype.hasOwnProperty.call(inputObject, key)) {
        if (key !== "jel_lock") {
          transformedArray.push({
            name: key as string,
            amount: inputObject[key],
          });
        }
      }
    }

    return transformedArray;
  }, []);

  useEffect(() => {
    commonData
      ? setTokenList(transformObject(commonData?.result?.userCryptoInfo))
      : setTokenList([]);
  }, [commonData]);

  //특정 코인 잔액 찾기
  function getAmountByToken(token: string) {
    for (let i = 0; i < tokenList.length; i++) {
      if (tokenList[i].name.toLocaleLowerCase() === token.toLocaleLowerCase()) {
        // return divCoinType(tokenList[i].amount, token);
        return tokenList[i].amount;
      }
    }

    // 해당 name을 찾지 못한 경우, 원하는 처리를 수행하거나 에러를 처리할 수 있습니다.

    return "Name을 찾을 수 없습니다."; // 예를 들어, 기본값이나 에러 메시지를 반환합니다.
  }

  const amountToDisplayFormat = useCallback(
    (
      amount: string | null,
      coin: string,
      dollar?: string | null,
      appendCoinType = false,
      toFixedLength: number | null = null,
      isShowSymbol = true,
    ) => {
      if (!exchangeData?.result) return "0";

      const _coin =
        coin.toLowerCase() === "jel_lock"
          ? "jel"
          : coin.toLowerCase() === "yyg_lock"
            ? "yyg"
            : coin.toLowerCase();
      let resultBN: BigNumber | null = null;
      let forceSymbol = "";
      if ((dollar && displayFiat) || (!amount && dollar)) {
        const ex =
          exchangeData.result.cryptoToFiat["jel"][displayFiat ?? "usd"];
        resultBN = new BigNumber(dollar).times(ex);

        if (!amount && dollar && !displayFiat && isShowSymbol)
          forceSymbol = "$";
      } else if (displayFiat && amount) {
        const ex = exchangeData.result.cryptoToFiat[_coin][displayFiat];
        resultBN = BigNumber(divCoinType(amount, _coin)).times(ex);
      } else if (amount) {
        resultBN = BigNumber(divCoinType(amount, _coin));
      }

      if (!resultBN) resultBN = new BigNumber("0");
      const formatResult = (
        bn: BigNumber,
        dp: number,
        length: number | null,
      ) => {
        const formatted = bn.decimalPlaces(dp, BigNumber.ROUND_DOWN);
        return length ? formatted.toFormat(length) : formatted.toFormat();
      };

      const formattedAmount = toFixedLength
        ? formatResult(resultBN, displayFiat ? 2 : 7, toFixedLength)
        : formatResult(resultBN, displayFiat ? 2 : 7, null);

      return `${
        displayFiat && isShowSymbol ? fiatSymbol + " " : ""
      }${forceSymbol}${formattedAmount}${
        appendCoinType && !displayFiat ? " " + coin.toUpperCase() : ""
      }`;
    },
    [exchangeData, displayFiat, divCoinType],
  );

  const fiatSymbol = useMemo(() => {
    switch (displayFiat) {
      case "usd":
        return "$";
      case "eur":
        return "€";
      case "jpy":
        return "¥";
      case "gbp":
        return "£";
      case "aud":
        return "$";
      case "cad":
        return "$";
      case "cny":
        return "¥";
      case "krw":
        return "₩";
      default:
        return "$"; // 지원하지 않는 국가 코드일 경우 빈 문자열 반환
    }
  }, [displayFiat]);

  const calculateBetAmount = (amount: string | null) => {
    if (!amount || !coin) return null;

    return displayFiat
      ? timesCoinType(new BigNumber(amount).div(exchangeRate).toString(), coin)
      : timesCoinType(amount, coin);
  };

  const getLimitAmount = useCallback(
    ({
      limitType,
      limitData,
      crypto,
    }: {
      limitType: "min" | "max";
      limitData: BetLimitDataType | undefined;
      crypto?: boolean;
    }) => {
      if (!limitData) {
        return "0";
      }

      let limitAmount = divCoinType(limitData[`${coin}_${limitType}`], coin);

      if (displayFiat && !crypto && limitAmount) {
        limitAmount = new BigNumber(limitAmount)
          .times(exchangeRate)
          .decimalPlaces(
            2,
            limitType === "min" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_DOWN,
          )
          .toString();
      }

      // return (Math.ceil(Number(limitAmount) * 100) / 100).toString();
      return limitAmount ?? "0";
    },
    [displayFiat, exchangeRate, coin, assetReferData],
  );

  const commonValidateGameBet = useCallback(
    ({
      amount,
      autoBetState,
      playing,
      limitData,
      maxBetAmount,
    }: {
      amount: string | null;
      autoBetState: boolean;
      playing: boolean;
      limitData: BetLimitDataType | undefined;
      maxBetAmount: string | null;
    }) => {
      const calculatedAmount = calculateBetAmount(amount);

      if (!amount || amount == "0") {
        return showToast(t("error_12004"));
      }

      if (!calculatedAmount) {
        return showToast(t("error_12004"));
      }

      if (!token) {
        openModal({ type: "getstarted" });
        // 로그인 모달 띄운다
        return false;
      }

      // 최초에 max bet amount 가 bet amount 보다 작을때
      if (maxBetAmount && new BigNumber(maxBetAmount).lt(amount)) {
        showToast(t("error_12003"));
        return false;
      }

      if (!autoBetState && playing) {
        return false;
      }

      if (new BigNumber(calculatedAmount).gt(getAmountByToken(coin))) {
        showToast(t("error_12002"));
        return false;
      }

      if (
        new BigNumber(calculatedAmount).lt(
          timesCoinType(
            getLimitAmount({
              limitType: "min",
              limitData: limitData,
              crypto: true,
            }),
            coin,
          ),
        )
      ) {
        showToast(t("error_12004"));
        return false;
      }

      if (
        new BigNumber(calculatedAmount).gt(
          timesCoinType(
            getLimitAmount({
              limitType: "max",
              limitData: limitData,
              crypto: true,
            }),
            coin,
          ),
        )
      ) {
        showToast(t("error_12003"));
        return false;
      }

      return calculatedAmount;
    },
    [coin, getLimitAmount, token, getAmountByToken, showToast],
  );

  const { width } = useWindowSize();

  const checkMedia = useMemo<"mobile" | "tablet" | "desktop" | "middle">(() => {
    // if(!hydrated){
    //
    // }
    if (width < 600) {
      return "mobile";
    }

    if (width < 900) {
      return "middle";
    }

    if (width < 1280) {
      return "tablet";
    }

    return "desktop";
  }, [width, hydrated]);

  const pathName = usePathname();
  const [cookies] = useCookies();
  const defaultLang = useMemo(() => {
    if (cookies.lang) {
      // closeModal();
      return cookies.lang;
    }
    const segments = pathName.split("/");
    return segments[1];
  }, [pathName, cookies]);

  const { x, y } = useWindowScroll();
  const isTopBanner = useMemo(() => {
    // return pathName.includes("affiliate") && hydrated && y === 0;
    return false;
  }, [pathname, cookies, hydrated, y]);

  // 현재 서비스중인 코인 or 토큰 목록

  const currentCoinList = useMemo(() => {
    if (!assetReferData) return null;

    const lowercaseWords = Object.keys(assetReferData.result.assetInfo).map(
      word => word.toLowerCase(),
    );

    return lowercaseWords;
  }, [assetReferData]);

  // 이미지 프리로드
  const loadingPreloadImages = (imageList: string[]) => {
    setWholeLoadingState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagesPromiseList: Promise<any>[] = [];
    for (const i of imageList) {
      imagesPromiseList.push(preloadImage(i));
    }
    const loadCall = async () => {
      await Promise.all(imagesPromiseList);
      setWholeLoadingState(false);
    };
    loadCall();
  };

  const gaEventTrigger = ({
    category,
    action,
    label,
    value,
  }: {
    category: "Betting";
    action: string;
    label?: string;
    value?: number;
  }) => {
    if (process.env.NODE_ENV === "production") {
      const data: {
        category: string;
        action: string;
        label?: string;
        value?: number;
      } = {
        category,
        action,
      };
      if (label) {
        data.label = label;
      }
      if (value) {
        data.value = value;
      }

      ReactGA.event(data);
    }
  };

  return {
    divCoinType,
    timesCoinType,
    routeWithParams,
    checkMedia,
    exchangeRate,
    showToast,
    getAmountByToken,
    showErrorMessage,
    fiatSymbol,
    calculateBetAmount,
    getLimitAmount,
    commonValidateGameBet,
    amountToDisplayFormat,
    defaultLang,
    isTopBanner,
    currentCoinList,
    loadingPreloadImages,
    transformObject,
    gaEventTrigger,
  };
}
