"use client";

import styles from "./styles/bonus.module.scss";
import BonusTop from "@/components/bonus/BonusTop";
import BonusRewards from "@/components/bonus/BonusRewards";
import WholeRewards from "@/components/bonus/WholeRewards";
import Notice from "@/components/bonus/Notice";
import { useUserStore } from "@/stores/useUser";
import BonusTopBeforeLogin from "@/components/bonus/BonusTopBeforeLogin";
import HowCanReceiveBonus from "@/components/bonus/HowCanReceiveBonus";
import BonusAdvantages from "@/components/bonus/BonusAdvantages";
import BonusBanner from "@/components/bonus/bonusBanner";
import React, { useEffect, useState } from "react";

export default function BonusWrapper() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token } = useUserStore();
  if (!hydrated) return <></>;
  return (
    <div className={styles.wrapper}>
      {token ? (
        <>
          <BonusTop />
          <BonusRewards />
          <WholeRewards />
        </>
      ) : (
        <>
          <BonusTopBeforeLogin />
          <HowCanReceiveBonus />
          <BonusAdvantages />
          <BonusBanner />
        </>
      )}
      <Notice />
    </div>
  );
}
