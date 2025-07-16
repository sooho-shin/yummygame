"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./styles/policy.module.scss";
import Link from "next/link";
import Terms from "./contents/Terms";
import Gamble from "./contents/Gamble";
import Aml from "./contents/Aml";
import Underage from "./contents/Underage";
import Responsible from "./contents/Responsible";
import Kyc from "./contents/Kyc";
import Self from "./contents/Self";
import Privacy from "./contents/Privacy";
import Image from "next/image";
import { useClickAway } from "react-use";
import Bonus from "./contents/Bonus";
import Betting from "./contents/Betting";
import { useDictionary } from "@/context/DictionaryContext";
import SportsBook from "@/components/policy/contents/SportsBook";
// import Terms from "./contents/Terms";

const tabArray = [
  "terms",
  "gamble",
  "aml",
  "underage",
  "responsible",
  "kyc",
  "exclusion",
  "privacy",
  "bonus",
  "betting",
  "sportsbook",
];

export default function PolicyWrapper({
  tab,
}: {
  tab:
    | "terms"
    | "gamble"
    | "aml"
    | "underage"
    | "responsible"
    | "kyc"
    | "exclusion"
    | "privacy"
    | "bonus"
    | "betting"
    | "fairness"
    | "sportsbook";
}) {
  const t = useDictionary();
  const getTabName = useCallback(
    (
      tab:
        | "terms"
        | "gamble"
        | "aml"
        | "underage"
        | "responsible"
        | "kyc"
        | "exclusion"
        | "privacy"
        | "bonus"
        | "betting"
        | "fairness"
        | "sportsbook",
    ) => {
      switch (tab) {
        case "terms":
          return t("policy_1");
        case "gamble":
          return t("policy_2");
        case "aml":
          return t("policy_3");
        case "underage":
          return t("policy_4");
        case "responsible":
          return t("policy_5");
        case "kyc":
          return t("policy_6");
        case "exclusion":
          return t("policy_7");
        case "privacy":
          return t("policy_8");
        case "bonus":
          return t("policy_9");
        case "betting":
          return t("policy_10");
        case "fairness":
          return t("common_42");
        case "sportsbook":
          return t("common_57");
        default:
          return null;
      }
    },
    [tab],
  );

  const getTitleName = useCallback(
    (
      tab:
        | "terms"
        | "gamble"
        | "aml"
        | "underage"
        | "responsible"
        | "kyc"
        | "exclusion"
        | "privacy"
        | "bonus"
        | "betting"
        | "fairness"
        | "sportsbook",
    ) => {
      switch (tab) {
        case "terms":
          return t("policy_11");
        case "gamble":
          return t("policy_12");
        case "aml":
          return t("policy_13");
        case "underage":
          return t("policy_14");
        case "responsible":
          return t("policy_15");
        case "kyc":
          return t("policy_16");
        case "exclusion":
          return t("policy_17");
        case "privacy":
          return t("policy_18");
        case "bonus":
          return t("policy_19");
        case "betting":
          return t("policy_20");
        case "sportsbook":
          return t("common_57");
        default:
          return null;
      }
    },
    [tab],
  );

  const dropboxRef = useRef<HTMLDivElement>(null);
  const [dropdownState, setDropdownState] = useState(false);
  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });

  if (!getTabName(tab)) return <></>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Policies</h2>
      <div className={styles.content}>
        <div className={styles["policies-nav"]} ref={dropboxRef}>
          <button
            type="button"
            onClick={() => setDropdownState(!dropdownState)}
            // className={styles["select-btn"]}
            className={dropdownState ? styles.active : ""}
          >
            <span>
              {getTabName(
                tab as
                  | "terms"
                  | "gamble"
                  | "aml"
                  | "underage"
                  | "responsible"
                  | "kyc"
                  | "exclusion"
                  | "privacy",
              )}
            </span>
            <Image
              src="/images/common/ico_arrow_w.svg"
              alt="img arrow"
              width="24"
              height="24"
              priority
            />
          </button>
          <ul className={dropdownState ? styles.active : ""}>
            {tabArray.map((c, i) => {
              return (
                <li key={c}>
                  <Link
                    href={`/policies/${c}`}
                    className={c === tab ? styles.active : ""}
                  >
                    <span>
                      {getTabName(
                        c as
                          | "terms"
                          | "gamble"
                          | "aml"
                          | "underage"
                          | "responsible"
                          | "kyc"
                          | "exclusion"
                          | "privacy"
                          | "fairness"
                          | "sportsbook",
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles["policies-content"]}>
          <div className={styles.top}>
            <span>{getTitleName(tab)}</span>
            <span>Last updated: 02/09/2024</span>
          </div>
          {tab === tabArray[0] && <Terms />}
          {tab === tabArray[1] && <Gamble />}
          {tab === tabArray[2] && <Aml />}
          {tab === tabArray[3] && <Underage />}
          {tab === tabArray[4] && <Responsible />}
          {tab === tabArray[5] && <Kyc />}
          {tab === tabArray[6] && <Self />}
          {tab === tabArray[7] && <Privacy />}
          {tab === tabArray[8] && <Bonus />}
          {tab === tabArray[9] && <Betting />}
          {tab === tabArray[10] && <SportsBook />}
        </div>
      </div>
    </div>
  );
}
