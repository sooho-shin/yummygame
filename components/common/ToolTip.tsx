"use client";

import { useState } from "react";
import styles from "./styles/tooltip.module.scss";
import classNames from "classnames";

export default function CommonToolTip({
  tooltipText,
  position = "left",
  className,
}: {
  tooltipText: string;
  position?: "left" | "right";
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={classNames(styles["tooltip-wrapper"], className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span></span>

      {hovered && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          <div className={styles["tooltip-content"]}>
            <pre>{tooltipText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
