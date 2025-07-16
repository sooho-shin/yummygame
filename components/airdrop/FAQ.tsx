"use client";

import React, { useMemo, useState } from "react";
import styles from "./styles/airdrop.module.scss";
import classNames from "classnames";
import { useDictionary } from "@/context/DictionaryContext";
import LicenceBox from "@/components/common/LicenceBox";

function FAQ() {
  const t = useDictionary();
  const { handleCreateLicenseScript } = LicenceBox();
  const arr = useMemo(() => {
    return [
      {
        question: t("airdrop_94"),
        answer: t("airdrop_98"),
      },
      {
        question: t("airdrop_95"),
        answer: t("airdrop_99"),
        buttonData: {
          text: "bit.ly/4cJPQMQ",
          onClick: () => {
            handleCreateLicenseScript(true);
          },
        },
      },
      // { question: t("airdrop_96"), answer: t("airdrop_100") },
      {
        question: t("airdrop_97"),
        answer: t("airdrop_101"),
        link: {
          text: "bit.ly/3xENEY1",
          href: "https://x.com/yummygameHere/status/1806612878570455389",
        },
      },
    ];
  }, [t]);

  const [openIndex, setOpenIndex] = useState<null | number>(null);

  return (
    <div className={styles["faq-container"]} id="faq">
      <h3>FAQ</h3>
      <div className={styles["faq-group"]}>
        {arr.map((c, i) => (
          <Box
            key={c.question}
            question={c.question}
            answer={c.answer}
            index={i}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
            link={c.link}
            buttonData={c.buttonData}
          />
        ))}
      </div>
    </div>
  );
}

const Box = ({
  question,
  answer,
  index,
  openIndex,
  setOpenIndex,
  link,
  buttonData,
}: {
  question: string;
  answer: string;
  index: number;
  openIndex: null | number;
  setOpenIndex: React.Dispatch<React.SetStateAction<number | null>>;
  link?: {
    text: string;
    href: string;
  };
  buttonData?: {
    onClick: () => void;
    text: string;
  };
}) => {
  return (
    <div
      className={classNames(styles["box"], {
        [styles.active]: index === openIndex,
      })}
    >
      <button
        type="button"
        className={classNames({ [styles.active]: index === openIndex })}
        onClick={() => {
          if (index === openIndex) {
            setOpenIndex(null);
          } else {
            setOpenIndex(index);
          }
        }}
      >
        <span>{question}</span>
      </button>
      <div>
        <pre>{answer}</pre>
        {link && (
          <a href={link.href} target="_blank" rel="noreferrer">
            {link.text}
          </a>
        )}

        {buttonData && (
          <button type={"button"} onClick={buttonData.onClick}>
            {buttonData.text}
          </button>
        )}
      </div>
    </div>
  );
};

export default FAQ;
