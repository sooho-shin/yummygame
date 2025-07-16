"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetCommon } from "@/querys/common";
import { useAssetStore } from "@/stores/useAsset";
import { useCommonStore } from "@/stores/useCommon";
import { useUserStore } from "@/stores/useUser";
import Image from "next/image";
import { Textfit } from "react-textfit";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useCookies } from "react-cookie";
import { useClickAway, useWindowSize } from "react-use";
import styles from "./styles/asset.module.scss";
import ToggleBtn from "@/components/common/ToggleBtn";
import CommonEmptyData from "@/components/common/EmptyData";
import { motion } from "framer-motion";

import { CookieOption, customConsole, formatNumber } from "@/utils";
import { usePathname } from "next/navigation";

export default function AssetBox() {
  const { token, setUserSetting, firstLogin, setFirstLogin } = useUserStore();
  const { data, refetch } = useGetCommon(token);

  const [dropdownState, setDropdownState] = useState(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  const { coin } = useAssetStore();
  const { amountToDisplayFormat, divCoinType, getAmountByToken, showToast } =
    useCommonHook();

  const {
    isInProviderGame,
    isChangeAssetState,
    tokenList,
    setIsChangeAssetState,
  } = useCommonStore();

  const pathname = usePathname();

  useEffect(() => {
    setIsChangeAssetState(true);
  }, [pathname]);

  const { openModal } = useModalHook();
  const t = useDictionary();

  useEffect(() => {
    if (dropdownState) {
      refetch();
    }
  }, [dropdownState]);

  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });

  const [searchText, setSearchText] = useState<string | null>(null);

  function filterArrayByName(
    arr: { name: string; amount: string }[],
    nameString: string | null,
  ): { name: string; amount: string }[] {
    if (!nameString) {
      return arr;
    }
    // 필터링된 결과를 담을 배열
    const filteredArray: { name: string; amount: string }[] = [];

    // 주어진 배열을 순회하며 조건을 만족하는 객체를 찾음
    for (let i = 0; i < arr.length; i++) {
      // 현재 객체의 name 속성이 주어진 문자열을 포함하면 결과 배열에 추가
      if (arr[i].name.includes(nameString.trim())) {
        filteredArray.push(arr[i]);
      }
    }

    // 필터링된 배열 반환
    return filteredArray;
  }

  const customTokenList = useMemo(() => {
    return filterArrayByName(tokenList, searchText);
  }, [tokenList, searchText]);

  const [cookies, setCookie, removeCookie] = useCookies();

  const { setCoin } = useAssetStore();

  useEffect(() => {
    const usdtObj = tokenList.find(obj => obj.name === "usdt");

    if (firstLogin && tokenList.length > 0) {
      setFirstLogin(false);
      if (usdtObj && Number(usdtObj.amount) > 0 && coin !== "usdt") {
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setFullYear(currentDate.getFullYear() + 100);

        setCoin("usdt");
        setCookie("coin", "usdt", { ...CookieOption, expires: futureDate });
      }
    }
  }, [tokenList]);

  // const [fiatModalState, setFiatModalState] = useState(false);

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
      display: "block",
    },
    exit: {
      opacity: 0.1,
      transition: {
        duration: 0.3,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  return data?.result?.userCryptoInfo ? (
    <div className={styles["asset-box"]}>
      <div className={styles["asset-container"]} ref={dropboxRef}>
        <button
          type="button"
          onClick={() => setDropdownState(!dropdownState)}
          disabled={!isChangeAssetState}
        >
          <span
            className={`${styles.ico}`}
            style={{
              backgroundImage: `url(/images/tokens/img_token_${
                coin ?? "jel"
              }_circle.svg)`,
            }}
          ></span>
          <span className={styles.unit}>{coin?.toUpperCase()}</span>
          {isInProviderGame ? (
            <span className={styles.ingame}>{t("home_1")}</span>
          ) : (
            <span className={styles.amount}>
              <Textfit mode="single" max={14} min={8}>
                {/*123,123,123,123,123,123,123,123,123,123,123,123,123,123,123,123,.123123123*/}
                {coin.toLocaleLowerCase() === "hon"
                  ? formatNumber({
                      value: divCoinType(getAmountByToken(coin), coin),
                    })
                  : amountToDisplayFormat(getAmountByToken(coin), coin)}
              </Textfit>
            </span>
          )}
          <span
            className={`${styles.arrow} ${dropdownState ? styles.active : ""}`}
          ></span>
        </button>

        <motion.div
          className={styles["asset-drop-container"]}
          initial={{
            display: "none",
          }}
          animate={dropdownState ? "enter" : "exit"}
          variants={subMenuAnimate}
        >
          <div className={styles["search-box"]}>
            <div>
              <span></span>
              <input
                type={"text"}
                placeholder={t("home_50")}
                value={searchText || ""}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
          </div>
          {customTokenList.length > 0 ? (
            <ul>
              {customTokenList.map(token => {
                if (
                  token.name !== "jel_lock" &&
                  token.name.toLocaleLowerCase() !== "jel_lock" &&
                  token.name !== "yyg_lock" &&
                  token.name.toLocaleLowerCase() !== "yyg_lock"
                ) {
                  return (
                    <Li
                      key={token.name}
                      token={token}
                      closeDropdown={setDropdownState}
                      lockData={
                        // token.name.toLocaleLowerCase() === "jel"
                        //   ? {
                        //       name: "jel_lock",
                        //       amount:
                        //         tokenList.find(
                        //           crypto =>
                        //             crypto.name.toLocaleLowerCase() ===
                        //             "jel_lock",
                        //         )?.amount || "0",
                        //     }
                        //   :
                        token.name.toLocaleLowerCase() === "yyg"
                          ? {
                              name: "yyg_lock",
                              amount:
                                tokenList.find(
                                  crypto =>
                                    crypto.name.toLocaleLowerCase() ===
                                    "yyg_lock",
                                )?.amount || "0",
                            }
                          : null
                      }
                    />
                  );
                }
              })}
            </ul>
          ) : (
            <ul>
              <li className={styles["empty-data"]}>
                <CommonEmptyData />
              </li>
            </ul>
          )}
          <div className={styles["display-fiat-row"]}>
            <span>{t("home_33")}</span>
            <ToggleBtn
              callback={() => {
                if (cookies.displayFiat) {
                  removeCookie("displayFiat", CookieOption);
                  setUserSetting({ displayFiat: null });
                } else {
                  if (cookies.fiat) {
                    removeCookie("displayFiat", CookieOption);
                    setCookie("displayFiat", "Y", CookieOption);
                    setUserSetting({ displayFiat: cookies.fiat });
                  } else {
                    // setFiatModalState(true);
                    openModal({
                      type: "setting",
                      props: {
                        modalTab: "displayFiat",
                      },
                    });
                  }
                }
              }}
              active={cookies.displayFiat}
            />
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        aria-label="deposit button"
        onClick={() => {
          openModal({
            type: "wallet",
          });
        }}
      >
        <span>{t("home_6")}</span>
      </button>
    </div>
  ) : (
    <></>
  );
}

const Li = ({
  token,
  closeDropdown,
  lockData,
}: {
  token: { name: string; amount: string };
  closeDropdown: Dispatch<SetStateAction<boolean>>;
  lockData: { name: string; amount: string } | null;
}) => {
  const [, setCookie] = useCookies();
  const { setCoin } = useAssetStore();
  const { amountToDisplayFormat, divCoinType, showToast } = useCommonHook();
  const { openModal } = useModalHook();

  if (
    token.name === "jel_lock" ||
    token.name.toLocaleLowerCase() === "jel_lock" ||
    token.name === "yyg_lock" ||
    token.name.toLocaleLowerCase() === "yyg_lock"
  )
    return false;

  return (
    <li>
      <button
        type="button"
        onClick={() => {
          if (token.name.toLocaleLowerCase() !== "yyg") {
            // 현재 날짜를 가져옴
            const currentDate = new Date();

            // 현재 날짜에 100년을 더함
            const futureDate = new Date(currentDate);
            futureDate.setFullYear(currentDate.getFullYear() + 100);

            closeDropdown(false);
            setCoin(token.name.toLocaleLowerCase());

            setCookie("coin", token.name.toLocaleLowerCase(), CookieOption);
          } else {
            showToast("yyg는 선택 할 수 없습니다.");
          }
        }}
      >
        <span className={styles.ico}>
          <Image
            src={`/images/tokens/img_token_${token.name.toLocaleLowerCase()}_circle.svg`}
            alt="ico token"
            width="24"
            height="24"
            priority
          />
        </span>
        <span className={styles.unit}>{token.name}</span>
        {(token.name.toLocaleLowerCase() === "hon" ||
          token.name.toLocaleLowerCase() === "jel" ||
          token.name.toLocaleLowerCase() === "yyg") && (
          <div
            className={styles["info-btn"]}
            onClick={e => {
              openModal({
                type: "aboutToken",
                props: {
                  token: token.name.toLocaleLowerCase(),
                },
              });
              closeDropdown(false);
              e.stopPropagation();
            }}
          ></div>
        )}

        <div className={styles.amount}>
          <span>
            {token.name.toLocaleLowerCase() === "hon" ||
            token.name.toLocaleLowerCase() === "yyg"
              ? formatNumber({ value: divCoinType(token.amount, token.name) })
              : amountToDisplayFormat(token.amount, token.name)}
          </span>
          {lockData && (
            <div>
              <span>
                {amountToDisplayFormat(lockData.amount, lockData.name)}
              </span>
            </div>
          )}
        </div>
      </button>
    </li>
  );
};
