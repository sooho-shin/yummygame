"use client";

import { useUserStore } from "@/stores/useUser";

import { truncateDecimal } from "@/utils";
import BigNumber from "bignumber.js";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import styles from "./styles/gameInputBox.module.scss";
import useCommonHook from "@/hooks/useCommonHook";
import { BetLimitDataType } from "@/types/games/common";
import CommonToolTip from "./ToolTip";
import { useCommonStore } from "@/stores/useCommon";

export default function InputBox({
  value,
  onChangeFn,
  coin,
  toggleData = null,
  title,
  type,
  topSub,
  toggleActiveVal,
  tooltip = null,
  onToggleFn,
  inputSub,
  placeholder,
  buttonElement,
  disabled = false,
  setAmount, // getLimitAmount,
  limitData,
  disabledUnit = false,
}: {
  value: string | null;
  onChangeFn: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleFn?: (val: string) => void;
  setAmount?: (amount: string) => void;
  coin?: string | null;
  title: string;
  topSub?: string | null;
  toggleData?: { title: string; val: string }[] | null;
  toggleActiveVal?: string;
  type: "amount" | "withToggle" | "withButton" | "minMax" | "wheel";
  inputSub?: string;
  tooltip?: string | null;
  placeholder?: string | null;
  buttonElement?: ReactNode;
  disabled?: boolean;
  limitData: BetLimitDataType | undefined;
  disabledUnit?: boolean;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { displayFiat } = useUserStore();
  const { exchangeRate, getLimitAmount, fiatSymbol, divCoinType } =
    useCommonHook();
  const { tokenList } = useCommonStore();

  if (!hydrated) return <></>;
  return (
    <div className={styles["input-container"]}>
      <div className={styles["input-top"]}>
        <div>
          <span>{title}</span>
          {tooltip && <CommonToolTip tooltipText={tooltip} position="right" />}
        </div>
        {topSub && (
          <div className={styles.sub}>
            <span>{topSub}</span>
          </div>
        )}
      </div>
      <div className={styles["input-row"]}>
        {type === "withToggle" && onToggleFn && (
          <div
            className={`${styles["toggle-box"]} ${
              disabled ? styles.disabled : ""
            }`}
          >
            {toggleData?.map(c => {
              return (
                <button
                  type="button"
                  className={toggleActiveVal === c.val ? styles.active : ""}
                  key={c.title}
                  onClick={() => onToggleFn(c.val)}
                  disabled={disabled}
                >
                  <span>{c.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <div
          className={`${styles["input-box"]} ${
            type === "minMax" ? styles["input-box-minmax"] : ""
          } ${
            disabled ||
            !!(
              type === "withToggle" &&
              toggleData &&
              toggleActiveVal === toggleData[0].val
            )
              ? styles.disabled
              : ""
          }`}
        >
          {!disabledUnit && displayFiat && coin !== "hon" && (
            <span className={styles.unit}>{fiatSymbol}</span>
          )}

          {!disabledUnit && (!displayFiat || coin === "hon") && hydrated && (
            <span
              className={`${styles.ico}`}
              style={{
                backgroundImage: `url('/images/tokens/img_token_${
                  coin ?? "jel"
                }_circle.svg')`,
              }}
            ></span>
          )}

          <input
            type="text"
            placeholder={placeholder ?? "0.00"}
            value={value ?? ""}
            onChange={e => {
              onChangeFn(e);
            }}
            disabled={
              disabled ||
              !!(
                type === "withToggle" &&
                toggleData &&
                toggleActiveVal === toggleData[0].val
              )
            }
          />

          {!disabledUnit && displayFiat && coin !== "hon" && (
            <span
              className={`${styles.ico}`}
              style={{
                backgroundImage: `url('/images/tokens/img_token_${
                  coin ?? "jel"
                }_circle.svg')`,
              }}
            ></span>
          )}

          {inputSub && <span className={styles["input-sub"]}>{inputSub}</span>}

          {type === "withButton" && buttonElement}

          {type === "minMax" && (
            <div className={styles["btn-row"]}>
              <button
                type="button"
                className={styles["minmax-button"]}
                onClick={() => {
                  if (!setAmount) {
                    return false;
                  }
                  if (!value) {
                    setAmount(
                      getLimitAmount({
                        limitType: "min",
                        limitData: limitData,
                      }),
                    );
                    return false;
                  }
                  const c = truncateDecimal({
                    num: new BigNumber(value ?? "0").div(2).toString(),
                    decimalPlaces: displayFiat ? 2 : 7,
                  });

                  if (
                    new BigNumber(c).lte(
                      getLimitAmount({
                        limitType: "min",
                        limitData: limitData,
                      }),
                    )
                  ) {
                    setAmount(
                      getLimitAmount({
                        limitType: "min",
                        limitData: limitData,
                      }),
                    );
                    return false;
                  }

                  setAmount(c.toString());
                }}
              >
                1/2
              </button>
              <button
                type="button"
                className={styles["minmax-button"]}
                onClick={() => {
                  if (!setAmount) {
                    return false;
                  }
                  if (!value) {
                    setAmount(
                      getLimitAmount({
                        limitType: "min",
                        limitData: limitData,
                      }),
                    );
                    return false;
                  }
                  const c = truncateDecimal({
                    num: new BigNumber(value ?? "0").times(2).toString(),
                    decimalPlaces: displayFiat ? 2 : 7,
                  });

                  const amountInMyAsset = divCoinType(
                    tokenList.find(
                      crypto => crypto.name.toLocaleLowerCase() === coin,
                    )?.amount || "0",
                    coin ?? "jel",
                  );

                  const cAmountInMyAsset = displayFiat
                    ? truncateDecimal({
                        num: new BigNumber(amountInMyAsset)
                          .times(exchangeRate)
                          .toString(),
                        decimalPlaces: 2,
                      })
                    : amountInMyAsset;

                  if (new BigNumber(c).gte(cAmountInMyAsset)) {
                    setAmount(cAmountInMyAsset);
                    return false;
                  }

                  if (
                    new BigNumber(c).gte(
                      getLimitAmount({
                        limitType: "max",
                        limitData: limitData,
                      }),
                    )
                  ) {
                    setAmount(
                      getLimitAmount({
                        limitType: "max",
                        limitData: limitData,
                      }),
                    );
                    return false;
                  }
                  setAmount(c.toString());
                }}
              >
                2X
              </button>
            </div>
          )}
        </div>
      </div>
      {type === "wheel" && (
        <div className={styles["minmax-row"]}>
          <button
            type="button"
            className={styles["minmax-button"]}
            onClick={() => {
              if (!setAmount) {
                return false;
              }
              if (!value) {
                setAmount(
                  getLimitAmount({
                    limitType: "min",
                    limitData: limitData,
                  }),
                );
                return false;
              }
              const c = truncateDecimal({
                num: new BigNumber(value ?? "0").div(2).toString(),
                decimalPlaces: displayFiat ? 2 : 7,
              });

              if (
                new BigNumber(c).lte(
                  getLimitAmount({
                    limitType: "min",
                    limitData: limitData,
                  }),
                )
              ) {
                setAmount(
                  getLimitAmount({
                    limitType: "min",
                    limitData: limitData,
                  }),
                );
                return false;
              }

              setAmount(c.toString());
            }}
          >
            1/2
          </button>

          <button
            type="button"
            className={styles["minmax-button"]}
            onClick={() => {
              if (!setAmount) {
                return false;
              }
              if (!value) {
                setAmount(
                  getLimitAmount({
                    limitType: "min",
                    limitData: limitData,
                  }),
                );
                return false;
              }
              const c = truncateDecimal({
                num: new BigNumber(value ?? "0").times(2).toString(),
                decimalPlaces: displayFiat ? 2 : 7,
              });
              if (
                new BigNumber(c).gte(
                  getLimitAmount({
                    limitType: "max",
                    limitData: limitData,
                  }),
                )
              ) {
                setAmount(
                  getLimitAmount({
                    limitType: "max",
                    limitData: limitData,
                  }),
                );
                return false;
              }
              const amountInMyAsset = divCoinType(
                tokenList.find(
                  crypto => crypto.name.toLocaleLowerCase() === coin,
                )?.amount || "0",
                coin ?? "jel",
              );

              const cAmountInMyAsset = displayFiat
                ? truncateDecimal({
                    num: new BigNumber(amountInMyAsset)
                      .times(exchangeRate)
                      .toString(),
                    decimalPlaces: 2,
                  })
                : amountInMyAsset;

              if (new BigNumber(c).gte(cAmountInMyAsset)) {
                setAmount(cAmountInMyAsset);
                return false;
              }

              setAmount(c.toString());
            }}
          >
            2X
          </button>
        </div>
      )}
    </div>
  );
}
