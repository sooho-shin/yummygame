"use client";

import styles from "./styles/mainWrapper.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Script from "next/script";
import { getCookie } from "@/utils";
import OneTab from "./OneTab";
import MainTop from "./Top";
import MainOriginal from "./Original";
import MainPartners from "./Partners";
import MainGambling from "./Gambling";
import MainBonus from "./Bonus";
import MainAffiliate from "./Affiliate";
import MainFair from "./Fair";
import MainProvider from "./Provider";

export default function MainWrapper() {
  const t = useDictionary();
  //   const t = await useDictionary(lang);

  return (
    <>
      <OneTab />
      <MainTop />
      <div className={styles.wrapper}>
        {/* <MainOriginal /> */}
        <MainProvider />
        {/*<MainPartners />*/}
        {/*<MainGambling />*/}
        {/*<MainBonus />*/}
        {/*<MainAffiliate />*/}
        {/*<MainFair />*/}
      </div>
    </>
  );
}
