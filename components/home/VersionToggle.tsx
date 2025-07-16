"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/versionToggle.module.scss";
import classNames from "classnames";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";
import { usePathname, useRouter } from "next/navigation";

const VersionToggle = () => {
  const t = useDictionary();
  const versionArr = [
    {
      name: t("main_84"),
      value: "casino",
    },
    {
      name: t("main_85"),
      value: "sports",
    },
  ];
  const { openModal } = useModalHook();
  const [version, setVersion] = useState(versionArr[0].value);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("sports")) {
      setVersion("sports");
    } else {
      setVersion("casino");
    }
  }, [pathname]);

  return (
    <div className={styles["version-toggle-box"]}>
      {versionArr.map(c => {
        return (
          <button
            type={"button"}
            key={c.value}
            className={classNames(styles[c.value as "casino" | "sports"], {
              [styles.active]: version === c.value,
            })}
            onClick={() => {
              if (c.value === "sports") {
                router.push("/sports");
                // if (process.env.NEXT_PUBLIC_MODE === "production") {
                //   openModal({
                //     type: "sports",
                //   });
                // } else {
                // }
              } else {
                router.push("/");
              }
            }}
          >
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default VersionToggle;
