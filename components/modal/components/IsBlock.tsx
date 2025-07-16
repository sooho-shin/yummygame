"use client";

import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles/isBlockModal.module.scss";

export default function IsBlock() {
  const t = useDictionary();

  return (
    <div className={styles["isBlock-modal"]}>
      <div className={styles.top}>{/* <span>asdf</span> */}</div>
      <div className={styles.content}>
        <LazyLoadImage
          src="/images/error/img_blocked.png"
          alt="img crypto"
          width={"54px"}
        />
        <div className={styles["text-content"]}>
          <h5>{`Yummygame isn't in your area yet.`}</h5>
          <p>
            {`According to the rules of the gaming license, we can't welcome players from your area right now. But don't fret! Our goal is to bring the delightful world of Yummygame to as many players as possible.`}
          </p>
          <p>
            Contact us{" "}
            <a href="mailto:support@yummygame.io">support@yummygame.io.</a> if
            you have questions. Keep looking for fun!
          </p>
        </div>
      </div>
    </div>
  );
}
