import React from "react";
import styles from "./styles/airdrop.module.scss";
import AirdropTop from "@/components/airdrop/Top";
import WhatIs from "@/components/airdrop/WhatIs";
import AirdropChallenge from "@/components/airdrop/Challenge";
import AirDropLeaderboard from "@/components/airdrop/Leaderboard";
import FAQ from "./FAQ";
import ComingSoon from "@/components/airdrop/ComingSoon";
import CountDown from "@/components/airdrop/CountDown";

const AirdropWrapper = () => {
  return (
    <div className={styles.wrapper}>
      <>
        {/*<ComingSoon />*/}
        <AirdropTop />
        <CountDown />
        <WhatIs />
        <AirdropChallenge />
        <AirDropLeaderboard />
        <FAQ />
      </>
    </div>
  );
};

export default AirdropWrapper;
