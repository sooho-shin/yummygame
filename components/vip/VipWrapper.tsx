"use client";

import styles from "./styles/vip.module.scss";
import VipInfoContainer from "@/components/vip/VipInfoContainer";

export default function VipWrapper() {
  return (
    <div className={styles.wrapper}>
      <VipInfoContainer />
    </div>
  );
}
