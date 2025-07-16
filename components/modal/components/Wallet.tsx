"use client";

import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useUserStore } from "@/stores/useUser";
import classNames from "classnames";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { isSafari } from "react-device-detect";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles/walletModal.module.scss";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useGetAssetRefer, useGetCommon } from "@/querys/common";
import { useAssetStore } from "@/stores/useAsset";
import { userCommonGnbDataType } from "@/types/user";
import { Updater, useImmer } from "use-immer";

import {
  formatNumber,
  truncateDecimal,
  validateNumberWithDecimal,
} from "@/utils";

import {
  useGetWalletReference,
  usePostRolloverForfeit,
  usePostWalletCreate,
  usePostWalletSwap,
  usePostWalletWithdrawal,
} from "@/querys/wallet";

import CommonButton from "@/components/common/Button";
import CopyButton from "@/components/common/CopyButton";
import CommonInputBox from "@/components/common/InputBox";
import {
  useGetPaymentCurrencies,
  usePostPaymentOffer,
  usePostPaymentOrder,
} from "@/querys/payment";

import { PaymentOfferDataType } from "@/types/payment";
import BigNumber from "bignumber.js";
import QRCode from "react-qr-code";
import { useClickAway, useDebounce } from "react-use";
import CommonToolTip from "@/components/common/ToolTip";
import { useCommonStore } from "@/stores/useCommon";
import { useCookies } from "react-cookie";
import { useGetBonusStatisticsVer2 } from "@/querys/bonus";

dayjs.extend(utc);

export default function Wallet() {
  const t = useDictionary();
  const tabArr = [
    t("modal_395"),
    t("modal_396"),
    t("modal_397"),
    t("modal_398"),
  ];
  const [tab, setTab] = useState(tabArr[0]);
  const searchParams = useSearchParams();

  const param = searchParams.get("modalTab");

  useEffect(() => {
    if (param) {
      setTab(param);
    }
  }, [param]);

  return (
    <div className={styles["wallet-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_436")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["tab-container"]}>
          <ul className={styles["tab-row"]}>
            {tabArr.map(c => {
              return <TabButton key={c} param={tab} text={c} setTab={setTab} />;
            })}
          </ul>
        </div>
        {tab === tabArr[0] && <DepositContainer />}
        {tab === tabArr[1] && <WithdrawalContainer />}
        {tab === tabArr[2] && <SwapContainer />}
        {tab === tabArr[3] && <BuyCryptoContainer />}
      </div>
    </div>
  );
}

// 여기 해야됨
const BuyCryptoContainer = () => {
  const [amountFrom, setAmountFrom] = useState<string | null>(null);
  const [currencyFrom, setCurrencyFrom] = useState<{
    icoPath?: string;
    text: string | null;
  } | null>({
    icoPath: `/images/currency/usd.png`,
    text: "USD",
  });

  const { closeModal } = useModalHook();
  const { showErrorMessage } = useCommonHook();

  const [currencyTo, setCurrencyTo] = useState<{
    icoPath?: string;
    text: string | null;
  } | null>({
    icoPath: `/images/tokens/img_token_eth_circle.svg`,
    text: "ETH",
  });

  const { data: currencyData } = useGetPaymentCurrencies({
    providerCode: "moonpay",
  });

  const { mutate: postPaymentOffer, isLoading: paymentOfferLoading } =
    usePostPaymentOffer();

  const [min, setMin] = useState<string | null>(null);

  const [amountErrorMessage, setAmountErrorMessage] = useState<string | null>(
    null,
  );

  const [paymentOfferData, setPaymentOfferData] =
    useState<PaymentOfferDataType | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "apple_pay" | null
  >(null);

  const [,] = useDebounce(
    () => {
      if (!currencyFrom || !currencyTo) {
        return false;
      }

      if (!amountFrom || amountFrom === "0") {
        setAmountErrorMessage(null);
        setPaymentOfferData(null);

        return false;
      }

      postPaymentOffer(
        {
          providerCode: "moonpay",
          currencyFrom: (currencyFrom.text || "USD") as string,
          currencyTo: currencyTo.text || "USDT",
          amountFrom: amountFrom,
          paymentMethod,
        },
        {
          onSuccess(data) {
            if (data.code === 0) {
              setPaymentOfferData(data.result);
              setAmountErrorMessage(null);
            } else if (data.code === -14700) {
              setAmountErrorMessage(
                (data.result.cause === "min" ? "Min" : "Max") +
                  ". " +
                  data.result.value +
                  " " +
                  currencyFrom.text,
              );
              setPaymentOfferData(null);
            }
          },
        },
      );
    },
    300,
    [amountFrom],
  );

  useEffect(() => {
    if (currencyFrom && currencyTo && amountFrom && amountFrom !== "0") {
      postPaymentOffer(
        {
          providerCode: "moonpay",
          currencyFrom: (currencyFrom.text || "USD") as string,
          currencyTo: currencyTo.text || "USDT",
          amountFrom: amountFrom,
          paymentMethod: paymentMethod,
        },
        {
          onSuccess(data) {
            if (data.code === 0) {
              setPaymentOfferData(data.result);
              setAmountErrorMessage(null);
            } else if (data.code === -14700) {
              setAmountErrorMessage(
                (data.result.cause === "min" ? "Min" : "Max") +
                  ". " +
                  data.result.value +
                  " " +
                  currencyFrom.text,
              );
            }
          },
        },
      );
    }
  }, [currencyTo, currencyFrom, paymentMethod]);

  useEffect(() => {
    // 최초
    if (currencyData) {
      setCurrencyFrom({
        icoPath: `/images/currency/${currencyData.result.country.fiat.toLocaleLowerCase()}.png`,
        text: currencyData.result.country.fiat,
      });

      setCurrencyTo({
        icoPath: `/images/tokens/img_token_${currencyData.result.crypto[0].toLocaleLowerCase()}_circle.svg`,
        text: currencyData.result.crypto[0],
      });
    }
  }, [currencyData]);

  useEffect(() => {
    // 최초
    if (currencyData) {
      postPaymentOffer(
        {
          providerCode: "moonpay",
          currencyFrom: (currencyFrom?.text ||
            currencyData.result.country.fiat) as string,
          currencyTo: currencyTo?.text || currencyData.result.crypto[0],
          amountFrom: "0",
          paymentMethod: "card",
        },
        {
          onSuccess(data) {
            data.result.value && setMin(data.result.value);
          },
        },
      );
    }
  }, [currencyFrom, currencyTo]);

  const { mutate: postPaymentOrder, isLoading: paymentOrderLoading } =
    usePostPaymentOrder();

  const handleOrder = () => {
    if (!currencyFrom || !currencyTo) {
      return false;
    }

    if (!amountFrom || amountFrom === "0") {
      return false;
    }
    let winOpen: Window | null = null;
    if (isSafari) winOpen = window.open();
    // const winOpen = window.open();

    postPaymentOrder(
      {
        providerCode: "moonpay",
        currencyFrom: (currencyFrom.text || "USD") as string,
        currencyTo: currencyTo.text || "USDT",
        amountFrom: amountFrom,
        paymentMethod,
      },
      {
        onSuccess(data) {
          showErrorMessage(data.code);
          if (data.code === 0) {
            // window.open(data.result.redirectUrl);
            if (winOpen) winOpen.location = data.result.redirectUrl;
            else window.open(data.result.redirectUrl);
            closeModal();
          }
        },
      },
    );
  };

  const currencyArray = useMemo(() => {
    const array: {
      icoPath: string;
      text: string;
    }[] = [];
    if (!currencyData) {
      return array;
    }
    for (const fiat of currencyData.result.fiat) {
      array.push({
        icoPath: `/images/currency/${fiat.toLocaleLowerCase()}.png`,
        text: fiat.toLocaleUpperCase(),
      });
    }
    return array;
  }, [currencyData]);

  const cryptoArray = useMemo(() => {
    const array: {
      icoPath: string;
      text: string;
    }[] = [];
    if (!currencyData) {
      return array;
    }
    for (const crypto of currencyData.result.crypto) {
      array.push({
        icoPath: `/images/tokens/img_token_${crypto.toLocaleLowerCase()}_circle.svg`,
        text: crypto,
      });
    }
    return array;
  }, [currencyData]);

  const [isAgree, setIsAgree] = useState(false);

  const [isShowDetail, setIsShowDetail] = useState(true);
  const t = useDictionary();

  return (
    <>
      <div className={styles["content-area"]}>
        {!min ? (
          Array.from({ length: 3 }).map((c, i) => {
            return <div key={i} className={styles["skeleton-input-row"]}></div>;
          })
        ) : (
          <>
            <CommonInputBox
              title={t("modal_270")}
              selectWithInput={true}
              placeholder={min ? `${t("modal_271")} ${min}.` : ""}
              value={amountFrom}
              small={true}
              align="right"
              className={styles["input-row"]}
              errorData={{ text: amountErrorMessage }}
              // onChange={e => {
              //   setAmountFrom(e.target.value);
              // }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (!e.target.value) {
                  setAmountFrom(null);
                } else {
                  const val = validateNumberWithDecimal(e.target.value, {
                    maxDecimal: 2,
                    maxInteger: 10000000,
                  });
                  val && setAmountFrom(val);
                }
              }}
              dropdownData={{
                selectedValue: currencyFrom,
                dropDownArray: currencyArray,
                setSelectedValue: (data: {
                  icoPath?: string;
                  text: string | null;
                }) => {
                  setCurrencyFrom(data);
                },
              }}
            />

            <CommonInputBox
              title={t("modal_272")}
              selectWithInput={true}
              placeholder="0"
              value={
                paymentOfferData ? "~ " + paymentOfferData.amountExpectedTo : ""
              }
              small={true}
              align="right"
              className={styles["input-row"]}
              readonly={true}
              required={false}
              isLoading={paymentOfferLoading}
              dropdownData={{
                selectedValue: currencyTo,
                dropDownArray: cryptoArray,
                setSelectedValue: (data: {
                  icoPath?: string;
                  text: string | null;
                }) => setCurrencyTo(data),
              }}
            />
            {paymentOfferData &&
              (paymentOfferLoading ? (
                Array.from({ length: 3 }).map((c, i) => {
                  return (
                    <div key={i} className={styles["skeleton-input-row"]}></div>
                  );
                })
              ) : (
                <>
                  <PaymentBox
                    data={paymentOfferData.paymentMethodOffer}
                    currencyTo={currencyTo?.text ?? "eth"}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                  <div
                    className={classNames(
                      styles["offer-box"],
                      styles["input-row"],
                    )}
                  >
                    <div className={styles.top}>{t("modal_273")}</div>
                    <div className={styles["offer-content"]}>
                      <LazyLoadImage
                        alt="img notice"
                        src="/images/modal/wallet/ico_moonpay.svg"
                      />
                      <p>
                        <span>{paymentOfferData.amountExpectedTo}</span>
                        <span> {currencyTo?.text}</span>
                      </p>
                    </div>
                  </div>

                  <div className={styles["agree-box"]}>
                    <div className={styles["checkbox-row"]}>
                      <input
                        type="checkbox"
                        id={"agree"}
                        onChange={({ target: { checked } }) => {
                          setIsAgree(checked);
                        }}
                        checked={isAgree}
                      />
                      <label htmlFor={"agree"}>
                        <p>{t("modal_274")}</p>
                      </label>
                    </div>
                    <ul>
                      <li>
                        <a
                          href="https://changelly.com/terms-of-use"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{t("modal_275")}</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://changelly.com/privacy-policy"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{t("modal_276")}</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://changelly.com/aml-kyc"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>AML/KYC</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles["detail-box"]}>
                    <button
                      type="button"
                      className={styles.top}
                      onClick={() => setIsShowDetail(!isShowDetail)}
                    >
                      <span>{t("modal_277")}</span>
                      <Image
                        src="/images/common/ico_arrow_g.svg"
                        alt="img arrow"
                        width="24"
                        height="24"
                        priority
                        style={{
                          transform: `rotate(${isShowDetail ? "180" : "0"}deg)`,
                        }}
                      />
                    </button>
                    {isShowDetail && (
                      <div className={styles["detail-content"]}>
                        <div className={styles.row}>
                          <div>
                            <span className={styles.title}>
                              {t("modal_272")}
                            </span>
                          </div>

                          <div>
                            <span className={styles.amount}>
                              ~{" "}
                              {formatNumber({
                                value: paymentOfferData.amountExpectedTo,
                                maxDigits: 20,
                              })}
                            </span>
                            <span className={styles.unit}>
                              {currencyTo?.text}
                            </span>
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div>
                            <span className={styles.title}>
                              {t("modal_278")}
                            </span>
                          </div>
                          <div>
                            <span className={styles.amount}>{1} </span>
                            <span className={styles.unit}>
                              {currencyTo?.text}
                            </span>

                            <span className={styles.amount}>
                              ~{" "}
                              {formatNumber({
                                value: paymentOfferData.rate,
                                maxDigits: 8,
                              })}
                            </span>
                            <span className={styles.unit}>
                              {currencyFrom?.text}
                            </span>
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div>
                            <span className={styles.title}>
                              {t("modal_279")}
                            </span>
                          </div>
                          <div>
                            <span className={styles.amount}>
                              {formatNumber({
                                value: paymentOfferData.fee,
                                maxDigits: 20,
                              })}
                            </span>
                            <span className={styles.unit}>
                              {currencyFrom?.text}
                            </span>
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div>
                            <span className={styles.title}>
                              {t("modal_280")}
                            </span>
                          </div>
                          <div>
                            <span className={styles.amount}>
                              {formatNumber({
                                value: amountFrom || "0",
                                maxDigits: 20,
                              })}
                            </span>
                            <span className={styles.unit}>
                              {currencyFrom?.text}
                            </span>
                          </div>
                        </div>
                        <div className={styles.row}>
                          <div>
                            <span className={styles.title}>
                              {t("modal_281")}
                            </span>
                          </div>
                          <div>
                            <span className={styles.amount}>
                              {/* paymentMethod */}
                              {paymentMethod
                                ? findObjectByMethod(
                                    paymentOfferData.paymentMethodOffer,
                                    paymentMethod,
                                  ).methodName
                                : paymentOfferData.paymentMethodOffer[0]
                                    .methodName}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ))}
          </>
        )}
      </div>

      <CommonButton
        className={styles["confirm-btn"]}
        onClick={() => {
          // handleWithdrawal();
          handleOrder();
        }}
        text={t("modal_404")}
        isPending={paymentOfferLoading || paymentOrderLoading}
        disabled={
          !paymentOfferData ||
          paymentOfferLoading ||
          !isAgree ||
          paymentOrderLoading
        }
      />
    </>
  );
};

const PaymentBox = ({
  data,
  currencyTo,
  paymentMethod,
  setPaymentMethod,
}: {
  data: {
    amountExpectedTo: string;
    method: "card" | "apple_pay";
    methodName: "Visa / Mastercard" | "Apple Pay / Google Pay";
    rate: string;
    invertedRate: string;
    fee: string;
  }[];
  currencyTo: string;
  paymentMethod: "card" | "apple_pay" | null;
  setPaymentMethod: Dispatch<SetStateAction<"card" | "apple_pay" | null>>;
}) => {
  const [dropdownState, setDropdownState] = useState(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });
  const t = useDictionary();

  return (
    <div
      className={classNames(styles["payment-box"], styles["input-row"], {
        [styles.active]: dropdownState,
      })}
    >
      <div className={styles.top}>{t("modal_281")}</div>
      <div className={styles["dropbox-box"]} ref={dropboxRef}>
        <button
          type="button"
          onClick={() => {
            setDropdownState(!dropdownState);
          }}
        >
          <div>
            {/* arr.find(obj => obj.method === targetMethod) */}
            <span className={styles.text}>
              {paymentMethod && data.length > 0
                ? findObjectByMethod(data, paymentMethod).methodName
                : data[0].methodName}
            </span>
          </div>
          <div>
            {!paymentMethod || paymentMethod === "card" ? (
              <>
                <LazyLoadImage
                  alt="img notice"
                  src="/images/modal/wallet/ico_visa.svg"
                />
                <LazyLoadImage
                  alt="img notice"
                  src="/images/modal/wallet/ico_master.svg"
                />
              </>
            ) : (
              <>
                <LazyLoadImage
                  alt="img notice"
                  src="/images/modal/wallet/ico_apple.svg"
                />
                <LazyLoadImage
                  alt="img notice"
                  src="/images/modal/wallet/ico_google.svg"
                />
              </>
            )}
            <Image
              src="/images/common/ico_arrow_g.svg"
              alt="img arrow"
              width="24"
              height="24"
              priority
              style={{
                transform: `rotate(${dropdownState ? "180" : "0"}deg)`,
              }}
            />
          </div>
        </button>
        {dropdownState && (
          <div className={styles["dropbox-container"]}>
            <ul>
              {data.map((c, i) => {
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod(c.method);
                        setDropdownState(false);
                      }}
                      className={
                        paymentMethod === c.method ||
                        (!paymentMethod && i === 0)
                          ? styles.active
                          : ""
                      }
                    >
                      <span>{c.methodName}</span>
                      <div>
                        <span>{t("modal_305")}</span>
                        <span>
                          {c.amountExpectedTo} {currencyTo}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p>{t("modal_282")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DepositContainer = () => {
  const { coin } = useAssetStore();
  const { token } = useUserStore();
  const { data: walletReferenceData, refetch: walletReferenceDataRefetch } =
    useGetWalletReference(token);
  const { tokenList } = useCommonStore();
  const { divCoinType } = useCommonHook();
  const { data: assetReferData } = useGetAssetRefer();
  const {
    data,
  }: {
    data: { result: userCommonGnbDataType } | undefined;
  } = useGetCommon(token);
  const { mutate: postWalletCreate, isLoading: postWalletCreateLoading } =
    usePostWalletCreate();

  useEffect(() => {
    walletReferenceDataRefetch();
  }, []);

  const firstCoinData = useMemo(() => {
    const cCoin =
      coin === "jel" || coin === "hon" || coin === "yyg"
        ? "btc"
        : (coin as string);
    return {
      coin: cCoin,
      amount: divCoinType(data?.result.userCryptoInfo[cCoin] || "0", cCoin),
    };
  }, [data]);

  const [selectedCoinData, setSelectedCoinData] = useImmer<null | {
    coin: string;
    amount: string;
  }>(null);

  const [selectedNetwork, setSelectedNetwork] = useState<string>("Nothing");

  const customCoin = useMemo(() => {
    return selectedCoinData ? selectedCoinData.coin : firstCoinData.coin;
  }, [selectedCoinData, firstCoinData]);

  const networkList = useMemo(() => {
    if (!walletReferenceData) return [];
    const array = walletReferenceData.result[
      customCoin
    ].depositWalletAddress?.map(item => item.displayName);
    if (!array) return [];
    return array;
  }, [customCoin, walletReferenceData]);

  const depositAddress = useMemo(() => {
    const foundItem = walletReferenceData?.result[
      customCoin
    ].depositWalletAddress?.find(item => item.displayName === selectedNetwork);

    return foundItem ? foundItem.address : null;
  }, [customCoin, walletReferenceData, networkList, selectedNetwork]);

  const networkName = useMemo(() => {
    if (!walletReferenceData) return null;

    const obj = walletReferenceData.result[
      customCoin
    ].depositWalletAddress?.find(c => c.displayName === selectedNetwork);
    return obj ? obj.networkName : null;
  }, [selectedNetwork]);

  const [changeAbleState, setChangeAbleState] = useState(true);
  useEffect(() => {
    if (changeAbleState) {
      networkList && setSelectedNetwork(networkList[0]);
    } else {
      setChangeAbleState(true);
    }
  }, [customCoin, networkList]);

  const coinArr = useMemo<[] | { coin: string; amount: string }[]>(() => {
    if (!data) return [];
    const arr: {
      coin: string;
      amount: string;
    }[] = [];

    tokenList.map(c => {
      if (
        c.name === "jel" ||
        c.name === "hon" ||
        c.name === "jel_lock" ||
        c.name === "yyg" ||
        c.name === "yyg_lock"
      ) {
        return false;
      } else {
        arr.push({
          coin: c.name,
          amount: truncateDecimal({
            num: divCoinType(c.amount, c.name),
            decimalPlaces: 7,
          }),
        });
      }
    });

    return arr;
  }, [data]);

  const createWallerAddress = () => {
    const createWalletParams: { coinType: string; chainId?: string } = {
      coinType: customCoin,
    };

    const currentNetwork = assetReferData?.result.assetInfo[
      customCoin.toUpperCase()
    ].networks.find(network => network.networkName === networkName);
    if (currentNetwork?.chainId) {
      createWalletParams.chainId = currentNetwork?.chainId;
    }

    postWalletCreate(createWalletParams, {
      onSuccess: data => {
        if (data.code === 0) {
          setChangeAbleState(false);
          walletReferenceDataRefetch();
        }
      },
    });
  };

  const t = useDictionary();
  const [cookies] = useCookies();
  const { data: user, refetch } = useGetCommon(token);

  if (!walletReferenceData || !customCoin || !selectedNetwork) return <></>;

  return (
    <div className={styles["content-area"]}>
      {postWalletCreateLoading && (
        <div className={styles["loading-container"]}>
          <div className={styles.loader}></div>
        </div>
      )}
      {!walletReferenceData?.result[
        selectedCoinData?.coin ?? firstCoinData.coin
      ].isWithdrawalPossible && <RemoveWagerContainer />}

      <InputGroup
        type="choiceCoin"
        title={t("modal_283")}
        choiceCoinData={{
          selectedCoinData: selectedCoinData || firstCoinData,
          setSelectedCoinData: setSelectedCoinData,
          coinArr: coinArr,
        }}
      />
      {networkList.length > 0 && selectedNetwork && (
        <InputGroup
          title={t("modal_284")}
          type="choiceNetwork"
          choiceNetworkData={{
            networkName: selectedNetwork,
            selectedCoinData: selectedCoinData || firstCoinData,
            setSelectedNetwork: setSelectedNetwork,
            networkList: networkList,
          }}
        />
      )}

      {customCoin === "xrp" &&
        walletReferenceData?.result &&
        walletReferenceData.result.xrp.depositWalletAddress &&
        depositAddress && (
          <InputGroup
            title={t("modal_306")}
            type="default"
            defaultData={{
              copy: true,
              readOnly: true,
              value:
                walletReferenceData.result.xrp.depositWalletAddress[0].tag?.toString() ??
                "",
            }}
          />
        )}
      {(selectedCoinData || firstCoinData) &&
        walletReferenceData?.result[
          ((selectedCoinData && selectedCoinData.coin) ||
            firstCoinData.coin) as string
        ].depositBonusData.default_data.bonus_multiply && (
          <div className={styles["bonus-info"]}>
            <p>
              {t("modal_412")}{" "}
              <span>
                {
                  walletReferenceData?.result[
                    ((selectedCoinData && selectedCoinData.coin) ||
                      firstCoinData.coin) as string
                  ].depositBonusData.fiat_to_crypto.min
                }{" "}
                {(selectedCoinData && selectedCoinData.coin.toUpperCase()) ||
                  firstCoinData.coin.toUpperCase()}
              </span>{" "}
              {t("modal_413")}{" "}
              <span>
                {
                  walletReferenceData?.result[
                    ((selectedCoinData && selectedCoinData.coin) ||
                      firstCoinData.coin) as string
                  ].depositBonusData.default_data.bonus_multiply
                }
                %
              </span>{" "}
              {t("modal_414")}
            </p>
            <CommonToolTip
              tooltipText={`${walletReferenceData?.result[
                ((selectedCoinData && selectedCoinData.coin) ||
                  firstCoinData.coin) as string
              ].depositBonusData.default_data.bonus_multiply}%
${t("modal_412")} ${walletReferenceData?.result[
                ((selectedCoinData && selectedCoinData.coin) ||
                  firstCoinData.coin) as string
              ].depositBonusData.fiat_to_crypto.min} ${
                (selectedCoinData && selectedCoinData.coin.toUpperCase()) ||
                firstCoinData.coin.toUpperCase()
              }
${t("modal_415")} ${walletReferenceData?.result[
                ((selectedCoinData && selectedCoinData.coin) ||
                  firstCoinData.coin) as string
              ].depositBonusData.fiat_to_crypto.max} ${
                (selectedCoinData && selectedCoinData.coin.toUpperCase()) ||
                firstCoinData.coin.toUpperCase()
              }`}
            />
          </div>
        )}
      <div className={styles["qrcode-group"]}>
        <div>
          {depositAddress ? (
            <div className={styles["qrcode-box"]}>
              <QRCode
                style={{ height: "100%", width: "100%" }}
                value={depositAddress ?? ""}
                // viewBox={`0 0 256 256`}
              />
            </div>
          ) : (
            <div className={styles["create-address-box"]}>
              <button type="button" onClick={() => createWallerAddress()}>
                +
              </button>
              <pre>{t("modal_405")}</pre>
            </div>
          )}

          {depositAddress && walletReferenceData?.result && (
            <div className={styles["address-box"]}>
              <p>{t("modal_285")}</p>
              <div className={styles.row}>
                <p>{depositAddress}</p>

                <CopyButton copyValue={depositAddress} disabled={false} />
                {/*<button type={"button"}></button>*/}
              </div>
            </div>
          )}
        </div>
        <p className={styles["limit-info"]}>{t("modal_416")}</p>
      </div>
      <div className={styles["notice-group"]}>
        <div className={styles.title}>
          <span>{t("modal_349")}</span>
        </div>
        <ul>
          {cookies.tracking === "000K" ||
          (token &&
            user?.result?.userType &&
            user?.result?.userType === "USER_000K") ? (
            <></>
          ) : (
            <>
              {" "}
              <li>
                <span>{t("modal_376")}</span>
              </li>
              <li>
                <span>
                  {t("modal_377")}
                  <a
                    href="https://www.yummygame.io/policies/bonus"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("modal_378")}
                  </a>
                </span>
              </li>
            </>
          )}
          <li>
            <span>{t("modal_379")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const RemoveWagerContainer = () => {
  const [agree, setAgree] = useState(false);
  const { token } = useUserStore();
  const { refetch: walletReferenceDataRefetch } = useGetWalletReference(token);
  const { refetch } = useGetCommon(token);

  const { mutate: postRolloverForfeit, isLoading: isLoadingRolloverForfeit } =
    usePostRolloverForfeit();
  const { showToast, showErrorMessage, divCoinType, timesCoinType } =
    useCommonHook();
  const t = useDictionary();
  const { refetch: refetchBonus } = useGetBonusStatisticsVer2(token);

  return (
    <div className={styles["remove-wager-container"]}>
      <p className={styles["wager-title"]}>{t("modal_438")}</p>
      <div className={styles["info-text"]}>{t("modal_439")}</div>
      <div className={styles["input-area"]}>
        <input
          type="checkbox"
          id="checkAgree"
          onChange={({ target: { checked } }) => setAgree(checked)}
        />
        <label htmlFor="checkAgree">
          <span>{t("modal_440")}</span>
        </label>
      </div>
      <CommonButton
        text={t("modal_441")}
        isPending={isLoadingRolloverForfeit}
        disabled={!agree}
        onClick={() => {
          postRolloverForfeit(
            // @ts-ignore
            {},
            {
              onSuccess(data) {
                if (data.code === 0) {
                  walletReferenceDataRefetch();
                  refetch();
                  showToast(t("modal_437"));
                  refetchBonus();
                }
                showErrorMessage(data.code);
              },
            },
          );
        }}
      />
    </div>
  );
};

const WithdrawalContainer = () => {
  const { coin } = useAssetStore();

  const [selectedNetwork, setSelectedNetwork] = useState<string>("Nothing");

  const [withdrawalAddress, setWithdrawalAddress] = useState<null | string>("");
  const [withdrawalAmount, setWithdrawalAmount] = useState<null | string>("");
  const [destinationTag, setDestinationTag] = useState<null | string>("");
  const { token } = useUserStore();
  const { data: walletReferenceData } = useGetWalletReference(token);

  const [twoFactorState, setTwoFactorState] = useState(false);

  const { tokenList } = useCommonStore();
  const { showToast, showErrorMessage, divCoinType, timesCoinType } =
    useCommonHook();

  const { data, refetch: refetchCommonData } = useGetCommon(token);

  const t = useDictionary();
  const { mutate: postWalletWithdrawal, isLoading: isLoadingWithdrawal } =
    usePostWalletWithdrawal();

  const firstCoinData = useMemo(() => {
    const cCoin =
      coin === "jel" || coin === "hon" || coin === "yyg"
        ? "btc"
        : (coin as string);

    return {
      coin: cCoin,
      amount: divCoinType(data?.result.userCryptoInfo[cCoin] || "0", cCoin),
    };
  }, [data, divCoinType]);

  const [selectedCoinData, setSelectedCoinData] = useImmer<null | {
    coin: string;
    amount: string;
  }>(null);

  useEffect(() => {
    setWithdrawalAddress("");
    setWithdrawalAmount("");
  }, [selectedCoinData]);

  const customCoin = useMemo(() => {
    return selectedCoinData ? selectedCoinData.coin : firstCoinData.coin;
  }, [selectedCoinData, firstCoinData]);

  const networkList = useMemo(() => {
    if (!walletReferenceData) return [];
    const array = walletReferenceData.result[
      customCoin
    ].depositWalletAddress?.map(item => item.displayName);
    if (!array) return [];
    return array;
  }, [customCoin, walletReferenceData]);

  useEffect(() => {
    walletReferenceData &&
      walletReferenceData.result[customCoin].depositWalletAddress &&
      setSelectedNetwork(networkList[0]);
  }, [customCoin, walletReferenceData]);

  const networkName = useMemo(() => {
    if (!walletReferenceData) return null;

    const obj = walletReferenceData.result[
      customCoin
    ].depositWalletAddress?.find(c => c.displayName === selectedNetwork);
    return obj ? obj.networkName : null;
  }, [selectedNetwork]);

  const handleWithdrawal = () => {
    setTwoFactorState(false);
    if (!withdrawalAmount) {
      showToast(t("modal_293"));
      return false;
    }

    if (!customCoin) {
      showToast(t("modal_294"));
      return false;
    }

    if (!selectedNetwork || !networkName) {
      showToast(t("modal_295"));
      return false;
    }

    if (!withdrawalAddress) {
      showToast(t("modal_296"));
      return false;
    }

    const withdrawalData: {
      withdrawalAddress: string;
      chainNetwork: string;
      destinationTag?: string;
      amount: string;
      coinType: string;
      passcode?: string;
    } = {
      withdrawalAddress: withdrawalAddress,
      chainNetwork: networkName,
      amount: timesCoinType(withdrawalAmount, customCoin),
      coinType: customCoin.toLocaleUpperCase(),
    };

    if (destinationTag) {
      withdrawalData.destinationTag = destinationTag;
    }

    if (passcode?.length === 6) {
      withdrawalData.passcode = passcode;
    }

    postWalletWithdrawal(withdrawalData, {
      onSuccess(data) {
        if (data.code === 1) {
          setTwoFactorState(true);

          return false;
        }
        if (data.code === 0) {
          showToast(t("modal_333"));
          setTwoFactorState(false);
          setDestinationTag(null);
          setWithdrawalAddress(null);
          setWithdrawalAmount(null);
          refetchCommonData();
          return false;
        }

        showErrorMessage(data.code);
        setPassCode(null);
      },
    });
  };

  const coinArr = useMemo<[] | { coin: string; amount: string }[]>(() => {
    if (!data) return [];
    const arr: {
      coin: string;
      amount: string;
    }[] = [];

    tokenList.map(c => {
      if (
        c.name === "jel" ||
        c.name === "hon" ||
        c.name === "jel_lock" ||
        c.name === "yyg" ||
        c.name === "yyg_lock"
      ) {
        return false;
      } else {
        arr.push({
          coin: c.name,
          amount: truncateDecimal({
            num: divCoinType(c.amount, c.name),
            decimalPlaces: 7,
          }),
        });
      }
    });

    return arr;
  }, [data]);

  const [passcode, setPassCode] = useState<string | null>("");
  const [focusState, setFocusState] = useState(false);
  useEffect(() => {
    if (passcode && passcode.length === 6) {
      handleWithdrawal();
    }
  }, [passcode]);

  if (
    !walletReferenceData?.result[selectedCoinData?.coin ?? firstCoinData.coin]
      .isWithdrawalPossible
  ) {
    return (
      <>
        <div className={styles["content-area"]}>
          <div className={styles["withdrawal-progress-container"]}>
            <p className={styles["progress-title"]}>{t("modal_399")}</p>
            <div className={styles["progress-group"]}>
              <p className={styles["percent-info"]}>
                {
                  walletReferenceData?.result[
                    selectedCoinData?.coin ?? firstCoinData.coin
                  ].wagerProgress
                }
                %
              </p>
              <div className={styles["bar-group"]}>
                <div
                  className={styles.bar}
                  style={{
                    width:
                      walletReferenceData?.result[
                        selectedCoinData?.coin ?? firstCoinData.coin
                      ].wagerProgress + "%",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles["notice-group"]}>
            <div className={styles.title}>
              <span>{t("modal_318")}</span>
            </div>
            <ul>
              <li>
                <span>{t("modal_400")}</span>
              </li>
              <li>
                <span>{t("modal_401")}</span>
              </li>
              <li>
                <span>{t("modal_402")}</span>
              </li>
            </ul>
          </div>
        </div>
        <CommonButton
          className={styles["confirm-btn"]}
          onClick={() => {
            handleWithdrawal();
          }}
          text={t("modal_403")}
          isPending={isLoadingWithdrawal || twoFactorState}
          disabled={
            !withdrawalAmount ||
            !(selectedCoinData ? selectedCoinData.coin : firstCoinData.coin) ||
            !selectedNetwork ||
            !withdrawalAddress
          }
        />
      </>
    );
  }

  return (
    <>
      <div className={styles["content-area"]}>
        {walletReferenceData.result[customCoin].withdrawalMonthlyCount !==
          null &&
          walletReferenceData.result[customCoin].withdrawalWeeklyCount !==
            null && (
            <div className={styles["withdral-progress-bar"]}>
              <div className={styles.row}>
                <span
                  className={styles["step-title"]}
                  style={{
                    color:
                      walletReferenceData.result[customCoin]
                        .withdrawalWeeklyCount === 3
                        ? "#E9819B"
                        : "#e3e3e5",
                  }}
                >
                  {t("modal_444")}
                </span>
                <div className={styles["progress-bar"]}>
                  <div
                    style={{
                      width: `${
                        ((walletReferenceData.result[customCoin]
                          .withdrawalWeeklyCount ?? 0) /
                          3) *
                        100
                      }%`,
                    }}
                    className={styles.bar}
                  ></div>
                </div>
                <span className={styles.step}>
                  {walletReferenceData.result[customCoin].withdrawalWeeklyCount}
                  /3
                </span>
              </div>
              <div className={styles.row}>
                <span
                  className={styles["step-title"]}
                  style={{
                    color:
                      walletReferenceData.result[customCoin]
                        .withdrawalWeeklyCount === 10
                        ? "#E9819B"
                        : "#e3e3e5",
                  }}
                >
                  {t("modal_445")}
                </span>
                <div className={styles["progress-bar"]}>
                  <div
                    style={{
                      width: `${
                        walletReferenceData.result[customCoin]
                          .withdrawalMonthlyCount
                          ? ((walletReferenceData.result[customCoin]
                              .withdrawalMonthlyCount ?? 0) /
                              10) *
                            100
                          : 0
                      }%`,
                    }}
                    className={styles.bar}
                  ></div>
                </div>
                <span className={styles.step}>
                  {
                    walletReferenceData.result[customCoin]
                      .withdrawalMonthlyCount
                  }
                  /10
                </span>
              </div>
            </div>
          )}
        <InputGroup
          type="choiceCoin"
          title={t("modal_307")}
          choiceCoinData={{
            selectedCoinData: selectedCoinData || firstCoinData,
            setSelectedCoinData: setSelectedCoinData,
            coinArr: coinArr,
          }}
        />

        {selectedNetwork && (
          <InputGroup
            title={t("modal_308")}
            type="choiceNetwork"
            choiceNetworkData={{
              networkName: selectedNetwork,
              selectedCoinData: selectedCoinData || firstCoinData,
              setSelectedNetwork: setSelectedNetwork,
              networkList: networkList,
            }}
          />
        )}

        <InputGroup
          title={t("modal_309")}
          type="default"
          defaultData={{
            copy: false,
            value: withdrawalAddress || "",
            placeholder: t("modal_310"),
            onChangeFn: value => {
              if (!value) {
                setWithdrawalAddress(null);
              }

              if (value.length < 51) {
                setWithdrawalAddress(value);
              }
            },
          }}
        />
        {customCoin === "xrp" && (
          <InputGroup
            title={t("modal_311")}
            type="default"
            defaultData={{
              copy: false,
              value: destinationTag || "",
              placeholder: t("modal_312"),
              onChangeFn: value => {
                if (!value) {
                  setDestinationTag(null);
                }

                const check = /^[0-9]+$/;

                if (check.test(value) && value.length < 11) {
                  setDestinationTag(value);
                }
              },
            }}
          />
        )}

        <InputGroup
          title={t("modal_313")}
          type="default"
          defaultData={{
            copy: false,
            value: withdrawalAmount || "",
            placeholder: t("modal_314"),
            readOnly: false,
            onChangeFn: value => {
              if (!value) {
                setWithdrawalAmount(null);
              } else {
                const val = validateNumberWithDecimal(value, {
                  maxDecimal: 7,
                  maxInteger: 15,
                });
                val && setWithdrawalAmount(val);
              }
            },
          }}
          subTitleNode={
            <div className={styles["sub-info"]}>
              <span>{t("modal_315")}</span>
            </div>
          }
          maxBtnFn={() => {
            setWithdrawalAmount(
              truncateDecimal({
                num: divCoinType(
                  data?.result.userCryptoInfo[
                    selectedCoinData
                      ? selectedCoinData.coin
                      : firstCoinData.coin
                  ] || "0",
                  selectedCoinData ? selectedCoinData.coin : firstCoinData.coin,
                ),
                decimalPlaces: 7,
              }),
            );
          }}
        />

        <div className={styles["fee-group"]}>
          <div className={styles.row}>
            <span>{t("modal_316")}</span>
            <div>
              <span>
                {selectedNetwork &&
                  networkName &&
                  truncateDecimal({
                    num: divCoinType(
                      walletReferenceData?.result[
                        selectedCoinData?.coin ?? firstCoinData.coin
                      ].withdrawalFee[networkName]?.toString() || "9999",

                      selectedCoinData
                        ? selectedCoinData.coin
                        : firstCoinData.coin,
                    ),
                    decimalPlaces: 7,
                  })}
              </span>
              <span>
                {selectedCoinData
                  ? selectedCoinData.coin.toLocaleUpperCase()
                  : firstCoinData.coin.toLocaleUpperCase()}
              </span>
            </div>
          </div>
          {/*<div className={styles.row}>*/}
          {/*  <span>Test</span>*/}
          {/*  <div>*/}
          {/*    <span>*/}
          {/*    </span>*/}
          {/*    <span>asdf</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className={styles.row}>
            <span>{t("modal_317")}</span>
            <div>
              {selectedNetwork && networkName && (
                <span
                  className={
                    Number(
                      walletReferenceData?.result[
                        selectedCoinData
                          ? selectedCoinData.coin
                          : firstCoinData.coin
                      ].withdrawalFee[networkName],
                    ) >
                    Number(
                      timesCoinType(
                        withdrawalAmount || "0",
                        selectedCoinData
                          ? selectedCoinData.coin
                          : firstCoinData.coin,
                      ),
                    )
                      ? styles.disabled
                      : ""
                  }
                >
                  {withdrawalAmount
                    ? Number(
                        walletReferenceData?.result[
                          selectedCoinData?.coin ?? firstCoinData.coin
                        ].withdrawalFee[networkName],
                      ) >
                      Number(
                        timesCoinType(
                          withdrawalAmount || "0",
                          selectedCoinData
                            ? selectedCoinData.coin
                            : firstCoinData.coin,
                        ),
                      )
                      ? "-"
                      : truncateDecimal({
                          num: divCoinType(
                            (
                              Number(
                                timesCoinType(
                                  withdrawalAmount || "0",
                                  selectedCoinData
                                    ? selectedCoinData.coin
                                    : firstCoinData.coin,
                                ),
                              ) -
                              Number(
                                walletReferenceData?.result[
                                  selectedCoinData
                                    ? selectedCoinData.coin
                                    : firstCoinData.coin
                                ].withdrawalFee[networkName] || "0",
                              )
                            ).toString(),
                            selectedCoinData
                              ? selectedCoinData.coin
                              : firstCoinData.coin,
                          ),
                          decimalPlaces: 7,
                        })
                    : "-"}
                </span>
              )}
              <span>
                {selectedCoinData
                  ? selectedCoinData.coin.toLocaleUpperCase()
                  : firstCoinData.coin.toLocaleUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles["notice-group"]}>
          <div className={styles.title}>
            <span>{t("modal_318")}</span>
          </div>
          <ul>
            <li>
              <span>{t("modal_319")}</span>
            </li>
            <li>
              <span>{t("modal_320")}</span>
            </li>
            <li>
              <span>{t("modal_332")}</span>
            </li>
          </ul>
        </div>
      </div>

      <CommonButton
        className={styles["confirm-btn"]}
        onClick={() => {
          handleWithdrawal();
        }}
        text={t("modal_403")}
        isPending={isLoadingWithdrawal || twoFactorState}
        disabled={
          !withdrawalAmount ||
          !(selectedCoinData ? selectedCoinData.coin : firstCoinData.coin) ||
          !selectedNetwork ||
          !withdrawalAddress ||
          walletReferenceData?.result[
            selectedCoinData?.coin ?? firstCoinData.coin
          ].isExceededWithdrawalCount
        }
      />
      {twoFactorState && (
        <div className={styles["verification-wrapper"]}>
          <div className={styles["verification-content"]}>
            <div className={styles.dim}></div>
            <div className={styles["code-confirm-box"]}>
              <p className={styles.title}>{t("modal_344")}</p>
              <pre>{t("modal_345")}</pre>
              <div className={styles["verification-container"]}>
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
                    if (e.key === "Enter" && passcode?.length === 6) {
                      handleWithdrawal();
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
              <div className={styles["btn-row"]}>
                <button type="button" onClick={() => setTwoFactorState(false)}>
                  <span>{t("modal_346")}</span>
                </button>
                <button
                  type="button"
                  disabled={passcode?.length !== 6}
                  onClick={() => handleWithdrawal()}
                >
                  <span>{t("modal_347")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SwapContainer = () => {
  // const dropdownArray = ["btc", "eth", "bnb"];

  // const tempMyJelAmount = 123;

  const [swapState] = useState<"CryptoToJel" | "JelToCrypto">("JelToCrypto");
  const {
    showToast,
    showErrorMessage,
    timesCoinType,
    divCoinType,
    currentCoinList,
  } = useCommonHook();
  const { token } = useUserStore();
  const { data: walletReferenceData } = useGetWalletReference(token);
  const { data, refetch: refetchCommonData } = useGetCommon(token);

  const { mutate: postWalletSwap, isLoading: isLoadingSwap } =
    usePostWalletSwap();
  const t = useDictionary();

  const dropdownArray: string[] = useMemo(() => {
    if (!currentCoinList) {
      return [];
    }
    return currentCoinList.filter(
      word =>
        word !== "hon" &&
        word !== "jel" &&
        word !== "jel_lock" &&
        word !== "yyg" &&
        word !== "yyg_lock",
    );
  }, [currentCoinList]);

  // const [dropdownState, setDropdownState] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string>("btc");
  const [jelAmount, setJelAmount] = useState<string>("");
  const [cryptoAmount, setCryptoAmount] = useState<string>("");

  const fromAmount = useMemo<string | null>(() => {
    if (
      (swapState === "JelToCrypto" && !jelAmount) ||
      (swapState !== "JelToCrypto" && !cryptoAmount)
    ) {
      return null;
    }
    return timesCoinType(
      swapState === "JelToCrypto" ? jelAmount : cryptoAmount,
      swapState === "JelToCrypto" ? "jel" : selectedCoin,
    );
  }, [swapState, jelAmount, cryptoAmount, selectedCoin]);

  const handleSwap = () => {
    // swapState === "JelToCrypto"
    const fromCoinType = swapState === "JelToCrypto" ? "JEL" : selectedCoin;
    const toCoinType = swapState === "JelToCrypto" ? selectedCoin : "jel";
    if (!fromAmount) {
      showToast(t("modal_322"));
      return false;
    }
    postWalletSwap(
      {
        fromCoinType: fromCoinType.toLocaleUpperCase(),
        fromAmount,
        toCoinType: toCoinType.toLocaleUpperCase(),
      },
      {
        onSuccess(data) {
          showErrorMessage(data.code);
          if (data.code === 0) {
            refetchCommonData();
            showToast(t("modal_321"));
            setJelAmount("");
            setCryptoAmount("");
          }
        },
      },
    );
  };

  if (!walletReferenceData || !data) return <></>;

  return (
    <>
      <div className={styles["content-area"]}>
        <div
          className={styles["swap-content"]}
          style={{
            flexDirection:
              swapState === "JelToCrypto" ? "column" : "column-reverse",
          }}
        >
          <InputGroup
            title={
              swapState === "JelToCrypto" ? t("modal_323") : t("modal_324")
            }
            type="swap"
            swapData={{
              // dropdownArray: dropdownArray,
              otherSideAmount: cryptoAmount,
              selectedCoin: selectedCoin,
              setSelectedCoin: setSelectedCoin,
              setThisAmount: setJelAmount,
              swapState: swapState,
              thisAmount: jelAmount,
              toState: swapState === "CryptoToJel",
              currentAmount: divCoinType(data.result.userCryptoInfo.jel, "jel"),
            }}
            maxBtnFn={() => {
              setJelAmount(divCoinType(data.result.userCryptoInfo.jel, "jel"));
            }}
          />
          <button
            type="button"
            className={styles["btn-swap"]}
            onClick={() => {
              // const [swapState, setSwapState] = useState<"CryptoToJel" | "JelToCrypto">(
              //   "JelToCrypto",
              // );
              // if (swapState === "CryptoToJel") {
              //   setSwapState("JelToCrypto");
              // } else {
              //   setSwapState("CryptoToJel");
              // }
            }}
          ></button>
          {/* 분기 */}
          <InputGroup
            title={
              swapState === "CryptoToJel" ? t("modal_323") : t("modal_324")
            }
            type="swap"
            swapData={{
              dropdownArray: dropdownArray,
              otherSideAmount: jelAmount,
              selectedCoin: selectedCoin,
              setSelectedCoin: setSelectedCoin,
              setThisAmount: setCryptoAmount,
              swapState: swapState,
              thisAmount: cryptoAmount,
              toState: swapState === "JelToCrypto",
              currentAmount: divCoinType(
                data.result.userCryptoInfo[selectedCoin],
                selectedCoin,
              ),
            }}
            maxBtnFn={() => {
              setCryptoAmount(
                divCoinType(
                  data.result.userCryptoInfo[selectedCoin],
                  selectedCoin,
                ),
              );
            }}
          />
        </div>
        <div className={styles["fee-group"]}>
          <div className={styles.row}>
            <span>{t("modal_325")}</span>
            <div>
              <span>
                {truncateDecimal({
                  num: new BigNumber(
                    swapState === "JelToCrypto"
                      ? jelAmount || "0"
                      : cryptoAmount || "0",
                  )
                    .times(
                      walletReferenceData.result[selectedCoin]
                        .swapBetweenJelFeePercent,
                    )
                    .div(100)
                    .toString(),
                  decimalPlaces: 7,
                })}
              </span>
              <span>
                {swapState === "JelToCrypto"
                  ? "JEL"
                  : selectedCoin.toLocaleUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <div className={styles["notice-group"]}>
          <div className={styles.title}>
            <span>{t("modal_326")}</span>
          </div>
          <ul>
            <li>
              <span>{t("modal_327")}</span>
            </li>
          </ul>
        </div>
      </div>
      <CommonButton
        className={styles["confirm-btn"]}
        onClick={() => handleSwap()}
        text={t("modal_328")}
        disabled={!fromAmount}
        isPending={isLoadingSwap}
      />
      {/* <button
        type="button"
        className={styles["confirm-btn"]}
        onClick={() => handleSwap()}
      >
        <span>Swap</span>
      </button> */}
    </>
  );
};

const TabButton = ({
  text,
  param,
  setTab,
}: {
  text: string;
  param: string;
  setTab: Dispatch<SetStateAction<string>>;
}) => {
  const { routeWithParams } = useCommonHook();
  return (
    <li>
      <button
        type="button"
        className={text === param ? styles.active : ""}
        onClick={() => {
          // routeWithParams({
          //   paramArray: [
          //     {
          //       paramName: "modalTab",
          //       value: text,
          //     },
          //   ],
          //   deleteParams: ["modalPage"],
          // });
          setTab(text);
        }}
      >
        <span>{text}</span>
      </button>
    </li>
  );
};

const InputGroup = ({
  type,
  title,
  choiceCoinData,
  choiceNetworkData,
  defaultData,
  subNode,
  subTitleNode,
  maxBtnFn,
  swapData,
  dropboxData,
}: {
  type: "choiceCoin" | "choiceNetwork" | "default" | "swap" | "dropdown";
  title: string;
  choiceCoinData?: {
    selectedCoinData: {
      coin: string;
      amount: string;
    };
    setSelectedCoinData: Updater<{
      coin: string;
      amount: string;
    } | null>;
    coinArr:
      | []
      | {
          coin: string;
          amount: string;
        }[];
  };
  choiceNetworkData?: {
    selectedCoinData: {
      coin: string;
      amount: string;
    };
    networkName: string;
    networkList: string[];
    setSelectedNetwork: Dispatch<SetStateAction<string>>;
  };
  defaultData?: {
    readOnly?: boolean;
    value: string;
    copy: boolean;
    placeholder?: string;
    onChangeFn?: (value: string) => void;
  };
  swapData?: {
    selectedCoin: string;
    dropdownArray?: string[];
    setSelectedCoin: Dispatch<SetStateAction<string>>;
    otherSideAmount: string;
    toState: boolean;
    swapState: "CryptoToJel" | "JelToCrypto";
    thisAmount: string;
    setThisAmount: Dispatch<SetStateAction<string>>;
    currentAmount: string;
  };
  dropboxData?: {
    dropboxArray: string[];
    value: string;
    type: "modalType" | "modalAsset";
  };
  subNode?: React.ReactNode;
  subTitleNode?: React.ReactNode;
  maxBtnFn?: () => void;
}) => {
  const dropboxRef = useRef<HTMLDivElement>(null);
  const { displayFiat, token } = useUserStore();
  const { data: walletReferenceData } = useGetWalletReference(token);
  const [dropdownState, setDropdownState] = useState(false);
  const { routeWithParams, amountToDisplayFormat, divCoinType } =
    useCommonHook();
  const t = useDictionary();

  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });

  const {
    data,
  }: {
    data: { result: userCommonGnbDataType } | undefined;
  } = useGetCommon(token);

  const [inputGroupActiveState, setInputGroupActiveState] = useState(false);

  useEffect(() => {
    setInputGroupActiveState(dropdownState);
  }, [dropdownState]);

  return (
    <div className={styles["input-group"]}>
      <div
        className={`${styles.title} ${
          inputGroupActiveState ? styles.active : ""
        }`}
      >
        <span>{title}</span>
        {subTitleNode && subTitleNode}
        {type === "swap" &&
          swapData &&
          walletReferenceData &&
          (swapData.toState ? (
            <div className={styles.sub}>
              <span>
                1{" "}
                {swapData.swapState === "JelToCrypto"
                  ? "JEL"
                  : swapData.selectedCoin.toUpperCase()}{" "}
                ={" "}
                {truncateDecimal({
                  num: walletReferenceData.result[swapData.selectedCoin][
                    swapData.swapState === "JelToCrypto"
                      ? "jelToThisExchangeRate"
                      : "toJelExchangeRate"
                  ].toString(),
                  decimalPlaces: 7,
                })}{" "}
                {swapData.swapState === "JelToCrypto"
                  ? swapData.selectedCoin.toUpperCase()
                  : "JEL"}
              </span>
            </div>
          ) : (
            <div className={styles.sub}>
              <span>
                {t("modal_329")}{" "}
                {swapData.swapState === "JelToCrypto"
                  ? "1"
                  : divCoinType(
                      walletReferenceData.result[swapData.selectedCoin]
                        .swapMinValue,
                      swapData.selectedCoin,
                    )}
              </span>
            </div>
          ))}
      </div>

      {type === "swap" && swapData && walletReferenceData ? (
        <>
          <div
            className={`${styles["wallet-input-box"]} ${
              inputGroupActiveState ? styles.active : ""
            }`}
            ref={dropboxRef}
          >
            <button
              type="button"
              className={styles["dropdown-btn"]}
              onClick={() => {
                setDropdownState(!dropdownState);
              }}
            >
              <span
                className={`${styles.coin}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${
                    swapData.dropdownArray ? swapData.selectedCoin : "jel"
                  }_circle.svg')`,
                }}
              ></span>
              <span className={styles["coin-name"]}>
                {swapData.dropdownArray
                  ? swapData.selectedCoin.toLocaleUpperCase()
                  : "JEL"}
              </span>
              {!swapData.toState && (
                <input
                  type="text"
                  className={styles["text-right"]}
                  readOnly
                  value={swapData.currentAmount}
                />
              )}
              {swapData.dropdownArray && (
                <div
                  className={`${styles["arrow-btn"]} ${
                    dropdownState ? styles.active : ""
                  }`}
                  style={{ marginLeft: "auto" }}
                ></div>
              )}
            </button>
            {dropdownState &&
              walletReferenceData &&
              swapData.dropdownArray &&
              data && (
                <div className={`${styles.dropbox}`}>
                  {swapData.dropdownArray.map(c => {
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => {
                          swapData.setSelectedCoin(c);
                          setDropdownState(false);
                        }}
                      >
                        <span
                          className={`${styles.coin}`}
                          style={{
                            backgroundImage: `url('/images/tokens/img_token_${c}_circle.svg')`,
                          }}
                        ></span>
                        <span className={styles["coin-name"]}>
                          {c.toLocaleUpperCase()}
                        </span>
                        <div className={styles["coin-amount-box"]}>
                          {displayFiat && !swapData.toState && (
                            <span>
                              {amountToDisplayFormat(
                                data.result.userCryptoInfo[c],
                                c,
                              )}
                            </span>
                          )}

                          <span>
                            {/* {swapData.otherSideAmount ?? "123"} */}
                            {swapData.toState
                              ? swapData.otherSideAmount
                                ? truncateDecimal({
                                    num: new BigNumber(swapData.otherSideAmount)
                                      .times(
                                        100 -
                                          Number(
                                            walletReferenceData.result[c]
                                              .swapBetweenJelFeePercent,
                                          ),
                                      )
                                      .div(100)
                                      .times(
                                        walletReferenceData.result[
                                          c
                                        ].jelToThisExchangeRate.toString(),
                                      )
                                      .toString(),
                                    decimalPlaces: 7,
                                  })
                                : "0"
                              : divCoinType(data.result.userCryptoInfo[c], c)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
          <div className={styles["wallet-input-box"]}>
            <input
              type="text"
              placeholder={t("modal_330")}
              readOnly={swapData.toState}
              value={
                swapData.toState
                  ? swapData.otherSideAmount
                    ? truncateDecimal({
                        num: new BigNumber(swapData.otherSideAmount)
                          .times(
                            100 -
                              Number(
                                walletReferenceData.result[
                                  swapData.selectedCoin
                                ].swapBetweenJelFeePercent,
                              ),
                          )
                          .div(100)
                          .times(
                            walletReferenceData.result[swapData.selectedCoin][
                              swapData.swapState === "JelToCrypto"
                                ? "jelToThisExchangeRate"
                                : "toJelExchangeRate"
                            ].toString(),
                          )
                          .toString(),
                        decimalPlaces: 7,
                      })
                    : "0"
                  : swapData.thisAmount || ""
              }
              onChange={e => {
                if (!e.target.value) {
                  swapData.setThisAmount("");
                } else {
                  const val = validateNumberWithDecimal(e.target.value, {
                    maxDecimal: 7,
                    maxInteger: 15,
                  });

                  val && swapData.setThisAmount(val);
                }
              }}
            />

            {maxBtnFn && !swapData.toState && (
              <button
                type="button"
                className={styles["min-max-btn"]}
                onClick={() => maxBtnFn()}
              >
                <span>{t("modal_331")}</span>
              </button>
            )}
          </div>
        </>
      ) : (
        <div
          className={`${styles["wallet-input-box"]} ${
            inputGroupActiveState ? styles.active : ""
          }`}
          ref={dropboxRef}
        >
          {type === "dropdown" && dropboxData && (
            <>
              <button
                type="button"
                className={styles["dropdown-btn"]}
                onClick={() => {
                  setDropdownState(!dropdownState);
                }}
              >
                <input type="text" readOnly value={dropboxData.value} />
                <div
                  className={`${styles["arrow-btn"]} ${
                    dropdownState ? styles.active : ""
                  }`}
                ></div>
              </button>
              {dropdownState && (
                <div className={`${styles.dropbox}`}>
                  {dropboxData.dropboxArray.map(c => {
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => {
                          routeWithParams({
                            paramArray: [
                              {
                                paramName: dropboxData.type,
                                value: c,
                              },
                            ],
                            deleteParams:
                              dropboxData.type === "modalType"
                                ? ["modalAsset", "modalPage"]
                                : ["modalPage"],
                          });
                          setDropdownState(false);
                        }}
                      >
                        <span className={styles["dropbox-content"]}>{c}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
          {type === "default" && defaultData && (
            <>
              <input
                type="text"
                readOnly={defaultData.readOnly}
                value={defaultData.value}
                placeholder={defaultData.placeholder}
                onChange={e =>
                  defaultData.onChangeFn &&
                  defaultData.onChangeFn(e.target.value)
                }
                onFocus={() => {
                  setInputGroupActiveState(true);
                }}
                onBlur={() => {
                  setInputGroupActiveState(false);
                }}
              />
              {defaultData.copy && (
                <CopyButton copyValue={defaultData.value} disabled={false} />
              )}
              {maxBtnFn && (
                <button
                  type="button"
                  className={styles["min-max-btn"]}
                  onClick={() => maxBtnFn()}
                >
                  <span>{t("modal_331")}</span>
                </button>
              )}
            </>
          )}
          {type === "choiceNetwork" && choiceNetworkData && (
            <>
              <button
                type="button"
                className={styles["dropdown-btn"]}
                onClick={() => {
                  setDropdownState(!dropdownState);
                }}
                disabled={choiceNetworkData.networkList.length === 1}
              >
                <input
                  type="text"
                  readOnly
                  value={choiceNetworkData.networkName}
                />
                {!(choiceNetworkData.networkList.length === 1) && (
                  <div
                    className={`${styles["arrow-btn"]} ${
                      dropdownState ? styles.active : ""
                    }`}
                  ></div>
                )}
              </button>
              {dropdownState && (
                <div className={styles.dropbox}>
                  {choiceNetworkData.networkList.map((c, i) => {
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          choiceNetworkData.setSelectedNetwork(c);
                          setDropdownState(false);
                        }}
                      >
                        <span className={styles["coin-name"]}>{c}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
          {type === "choiceCoin" && choiceCoinData && (
            <>
              <button
                className={`${styles["currency-btn"]}`}
                type="button"
                onClick={() => {
                  setDropdownState(!dropdownState);
                }}
              >
                <span
                  className={`${styles.coin}`}
                  style={{
                    backgroundImage: `url('/images/tokens/img_token_${choiceCoinData.selectedCoinData.coin}_circle.svg')`,
                  }}
                ></span>
                <span className={styles["coin-name"]}>
                  {choiceCoinData.selectedCoinData.coin.toLocaleUpperCase()}
                </span>
                <div className={styles["coin-amount-box"]}>
                  {/* <span>{choiceCoinData.selectedCoinData.amount}</span> */}
                  <span>
                    {data &&
                      truncateDecimal({
                        num: divCoinType(
                          data.result.userCryptoInfo[
                            choiceCoinData.selectedCoinData.coin.toLocaleLowerCase() as string
                          ],
                          choiceCoinData.selectedCoinData.coin.toLocaleUpperCase(),
                        ),
                        decimalPlaces: 7,
                      })}
                  </span>
                </div>
                <div
                  className={`${styles["arrow-btn"]} ${
                    dropdownState ? styles.active : ""
                  }`}
                ></div>
              </button>
              {dropdownState && choiceCoinData && (
                <div className={`${styles.dropbox}`}>
                  {choiceCoinData.coinArr &&
                    choiceCoinData.coinArr.map(c => {
                      return (
                        <button
                          type="button"
                          key={c.coin}
                          onClick={() => {
                            choiceCoinData.setSelectedCoinData({
                              coin: c.coin,
                              amount: c.amount,
                            });
                            setDropdownState(false);
                            // setNetworkDropdownState(false);
                          }}
                        >
                          <span
                            className={`${styles.coin}`}
                            style={{
                              backgroundImage: `url('/images/tokens/img_token_${c.coin}_circle.svg')`,
                            }}
                          ></span>
                          <span
                            className={classNames(
                              styles["coin-name"],
                              styles.uppercase,
                            )}
                          >
                            {c.coin}
                          </span>
                          <div className={styles["coin-amount-box"]}>
                            <span>{c.amount}</span>
                            <span>
                              {data &&
                                displayFiat &&
                                amountToDisplayFormat(
                                  data.result.userCryptoInfo[c.coin],
                                  c.coin,
                                )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </>
          )}
        </div>
      )}
      {subNode}
    </div>
  );
};

function findObjectByMethod(
  arr: {
    amountExpectedTo: string;
    method: "card" | "apple_pay";
    methodName: "Visa / Mastercard" | "Apple Pay / Google Pay";
    rate: string;
    invertedRate: string;
    fee: string;
  }[],
  targetMethod: string,
) {
  const result = arr.find(obj => obj.method === targetMethod);
  if (!result) {
    throw new Error(`Object with method '${targetMethod}' not found.`);
  }
  return result;
}
