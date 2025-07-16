"use client";

import styles from "./styles/toggleBtn.module.scss";

export default function ToggleBtn({
  callback,
  active = false,
  theme = false,
}: {
  callback: () => void;
  active?: boolean;
  theme?: boolean;
}) {
  return (
    <button
      className={`${styles["toggle-box"]} ${active ? styles.active : ""} ${
        theme ? styles.theme : ""
      }`}
      onClick={() => {
        callback();
      }}
      type="button"
    >
      <span></span>
    </button>
  );
}
