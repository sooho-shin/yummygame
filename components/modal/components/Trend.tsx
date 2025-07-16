"use client";

import styles from "./styles/trendModal.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
import classNames from "classnames";

export default function Trend() {
  const t = useDictionary();
  return (
    <div className={styles["trend-modal"]}>
      <div className={styles.top}>
        <span>{t("game_76")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["info-row"]}>
          <div className={styles["info-content"]}>
            <span className={`${styles.ball} ${styles.blue}`}></span>
            <span>≥2×</span>
          </div>
          <div className={styles["info-content"]}>
            <span className={`${styles.ball} ${styles.purple}`}></span>
            <span>{"<2×"}</span>
          </div>
          <div className={styles["info-content"]}>
            <span className={`${styles.ball} ${styles.pink}`}></span>
            <span>≥10×</span>
          </div>
        </div>
        <div className={styles["roadmap-row"]} style={{ marginBottom: "8px" }}>
          <div className={styles["roadmap-content"]}>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.blue)}></div>
              </div>
              <div>
                <div className={classNames(styles.ball, styles.pink)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.purple)}></div>
              </div>
              <div>
                <div className={classNames(styles.ball, styles.purple)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.blue)}></div>
              </div>
              <div>
                <div className={classNames(styles.ball, styles.blue)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.purple)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.pink)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          <div className={styles["info-text-group"]}>
            <p>{t("game_77")}</p>
            <div className={styles["step-container"]}>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.blue)}>
                  7.13
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.pink)}>
                  265.98
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.purple)}>
                  1.36
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.purple)}>
                  1.01
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.blue)}>
                  9.02
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.blue)}>
                  2.79
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.purple)}>
                  1.75
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.pink)}>
                  41.25
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames(styles["roadmap-row"])}>
          <div className={styles["roadmap-content"]}>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.blue)}></div>
              </div>
              <div>
                <div className={classNames(styles.ball, styles.blue)}></div>
              </div>
              <div>
                <div className={classNames(styles.ball, styles.pink)}></div>
              </div>
              <div>
                <div className={classNames(styles.ball, styles.blue)}></div>
              </div>
              <div>
                <div className={classNames(styles.ball, styles.blue)}></div>
              </div>
              <div></div>
            </div>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.purple)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.pink)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div>
                <div className={classNames(styles.ball, styles.purple)}></div>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          <div className={styles["info-text-group"]}>
            <p>{t("game_77")}</p>
            <div className={styles["step-container"]}>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.blue)}>
                  2.56
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.blue)}>
                  7.24
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.pink)}>
                  24.36
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.blue)}>
                  3.89
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.blue)}>
                  7.11
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.purple)}>
                  1.34
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.pink)}>
                  2.75
                </span>
                <span className={styles.arrow}>{"->"}</span>
              </div>
              <div className={styles.box}>
                <span className={classNames(styles.text, styles.purple)}>
                  1.98
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
