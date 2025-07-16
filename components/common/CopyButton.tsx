"use client";

import { useEffect, useState } from "react";
import styles from "./styles/copyButton.module.scss";
import { useCopyToClipboard } from "react-use";
import classNames from "classnames";

export default function CopyButton({
  callback,
  disabled,
  copyValue,
}: {
  callback?: () => void;
  disabled: boolean;
  copyValue: string;
}) {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copyState, setCopyState] = useState(false);

  useEffect(() => {
    if (state.value) {
      setCopyState(true);
      setTimeout(() => {
        setCopyState(false);
      }, 2000);
    }
  }, [state]);

  return (
    <button
      className={classNames(styles["copy-button"], {
        [styles.complete]: copyState,
      })}
      disabled={disabled || copyState}
      onClick={() => {
        copyToClipboard(copyValue);
        callback && callback();
      }}
    >
      <span>{copyState ? "Copied" : "Copy"}</span>
    </button>
  );
}
