"use client";

import { useEffect, useState } from "react";
import styles from "./styles/cookieToast.module.scss";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { CookieOption } from "@/utils";

export default function CookieToast() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [cookie, setCookie] = useCookies();
  if (cookie.isCheckCookie || !hydrated) return <></>;
  return (
    <div className={styles.box}>
      <div>
        <span className={styles.ico}></span>
        <p className={styles.text}>
          <span>We use </span>
          <Link href={"/policies/privacy"}>cookies</Link>
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          // 현재 날짜를 가져옴
          const currentDate = new Date();

          // 현재 날짜에 100년을 더함
          const futureDate = new Date(currentDate);
          futureDate.setFullYear(currentDate.getFullYear() + 100);

          setCookie("isCheckCookie", "Y", {
            ...CookieOption,
            expires: futureDate,
          });
        }}
      ></button>
    </div>
  );
}
