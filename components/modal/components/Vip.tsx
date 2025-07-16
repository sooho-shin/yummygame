"use client";

import { useDictionary } from "@/context/DictionaryContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles/vipModal.module.scss";
import useModalHook from "@/hooks/useModalHook";
import classNames from "classnames";

export default function Vip() {
  const t = useDictionary();

  const {
    props,
  }: {
    props: {
      type:
        | "sweetener"
        | "weeklyCashback"
        | "monthlyCashback"
        | "noFeeWithdrawalInfo";
    };
  } = useModalHook();

  const monthlyCashbackTableData = [
    {
      tier: "gold",
      level: "31",
      qualification: "wager * 1% * 3%",
      sweetenerRate: "0.03",
    },
    {
      tier: "platinum",
      level: "41",
      qualification: "wager * 1% * 4%",
      sweetenerRate: "0.04",
    },
    {
      tier: "diamond",
      level: "51",
      qualification: "wager * 1% * 5%",
      sweetenerRate: "0.05",
    },
    {
      tier: "challenger",
      level: "61",
      qualification: "wager * 1% * 6%",
      sweetenerRate: "0.06",
    },
    {
      tier: "elite",
      level: "81",
      qualification: "wager * 1% * 8%",
      sweetenerRate: "0.08",
    },
    {
      tier: "master",
      level: "101",
      qualification: "wager * 1% * 10%",
      sweetenerRate: "0.10",
    },
    {
      tier: "grandmaster",
      level: "121",
      qualification: "wager * 1% * 12%",
      sweetenerRate: "0.12",
    },
    {
      tier: "legend",
      level: "141",
      qualification: "wager * 1% * 15%",
      sweetenerRate: "0.15",
    },
  ];

  const weeklyCashbackTableData = [
    {
      tier: "silver",
      level: "21",
      qualification: "wager * 1% * 2%",
      sweetenerRate: "0.02",
    },
    {
      tier: "gold",
      level: "31",
      qualification: "wager * 1% * 3%",
      sweetenerRate: "0.03",
    },
    {
      tier: "platinum",
      level: "41",
      qualification: "wager * 1% * 4%",
      sweetenerRate: "0.04",
    },
    {
      tier: "diamond",
      level: "51",
      qualification: "wager * 1% * 5%",
      sweetenerRate: "0.05",
    },
    {
      tier: "challenger",
      level: "61",
      qualification: "wager * 1% * 6%",
      sweetenerRate: "0.06",
    },
    {
      tier: "elite",
      level: "81",
      qualification: "wager * 1% * 8%",
      sweetenerRate: "0.08",
    },
    {
      tier: "master",
      level: "101",
      qualification: "wager * 1% * 10%",
      sweetenerRate: "0.10",
    },
    {
      tier: "grandmaster",
      level: "121",
      qualification: "wager * 1% * 12%",
      sweetenerRate: "0.12",
    },
    {
      tier: "legend",
      level: "141",
      qualification: "wager * 1% * 15%",
      sweetenerRate: "0.15",
    },
  ];

  const sweetenerTableData = [
    {
      tier: "bronze",
      level: "11",
      qualification: "wager * 1% * 1%",
      sweetenerRate: "0.01",
    },
    {
      tier: "silver",
      level: "21",
      qualification: "wager * 1% * 2%",
      sweetenerRate: "0.02",
    },
    {
      tier: "gold",
      level: "31",
      qualification: "wager * 1% * 3%",
      sweetenerRate: "0.03",
    },
    {
      tier: "platinum",
      level: "41",
      qualification: "wager * 1% * 4%",
      sweetenerRate: "0.04",
    },
    {
      tier: "diamond",
      level: "51",
      qualification: "wager * 1% * 5%",
      sweetenerRate: "0.05",
    },
    {
      tier: "challenger",
      level: "61",
      qualification: "wager * 1% * 6%",
      sweetenerRate: "0.06",
    },
    {
      tier: "elite",
      level: "81",
      qualification: "wager * 1% * 8%",
      sweetenerRate: "0.08",
    },
    {
      tier: "master",
      level: "101",
      qualification: "wager * 1% * 10%",
      sweetenerRate: "0.10",
    },
    {
      tier: "grandmaster",
      level: "121",
      qualification: "wager * 1% * 12%",
      sweetenerRate: "0.12",
    },
    {
      tier: "legend",
      level: "141",
      qualification: "wager * 1% * 15%",
      sweetenerRate: "0.15",
    },
  ];

  return (
    <div className={styles["vip-modal"]}>
      <div className={styles.top}>
        <span>
          {props.type === "sweetener" && t("modal_464")}
          {props.type === "weeklyCashback" && t("modal_465")}
          {props.type === "monthlyCashback" && t("modal_466")}
          {props.type === "noFeeWithdrawalInfo" && t("modal_467")}
        </span>
      </div>
      <div className={styles.content}>
        {props.type === "noFeeWithdrawalInfo" && (
          <>
            <div className={styles["text-group"]}>
              <p className={styles["sub-title"]}>{t("modal_468")}</p>
              <p className={styles["info-text"]}>
                <span>{t("modal_469")}</span>
              </p>
              <p className={styles["info-text"]}>{t("modal_470")}</p>
              <p className={styles["info-text"]}>
                <span>{t("modal_471")}</span>
              </p>
              <p className={styles["info-text"]}>{t("modal_472")}</p>
            </div>
          </>
        )}
        {props.type === "monthlyCashback" && (
          <>
            <div className={styles["text-group"]}>
              <pre className={styles["top-text"]}>{t("modal_473")}</pre>
              <p className={styles["sub-title"]}>{t("modal_468")}</p>
              <p className={styles["info-text"]}>
                <span>{t("modal_474")}</span> {t("modal_475")}
              </p>
              <p className={styles["info-text"]}>
                <span>{t("modal_476")}</span> {t("modal_477")}
              </p>
              <p className={styles["info-text"]}>
                <span>{t("modal_478")}</span> {t("modal_479")}
              </p>
              <p className={classNames(styles["info-text"], styles["mb"])}>
                <span>{t("modal_480")}</span> {t("modal_481")}
              </p>
              <p className={styles["sub-title"]}>{t("modal_482")}</p>
              <p className={classNames(styles["info-text"])}>
                {t("modal_483")}
              </p>
            </div>
            <div className={styles["table-container"]}>
              <table>
                <thead>
                  <tr>
                    <th align={"left"}>{t("modal_484")}</th>
                    <th align={"right"}>{t("modal_485")}</th>
                    <th align={"right"}>{t("modal_486")}</th>
                    <th
                      align={"right"}
                      dangerouslySetInnerHTML={{ __html: t("modal_487") }}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyCashbackTableData.map(data => {
                    return (
                      <tr key={data.tier}>
                        <td align={"left"}>
                          <div>
                            <LazyLoadImage
                              src={`/images/vip/grade/${data.tier}.webp`}
                              alt={"img grade"}
                            />
                            <span className={styles.tier}>{data.tier}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>VIP {data.level}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>{data.qualification}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>{data.sweetenerRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {props.type === "weeklyCashback" && (
          <>
            <div className={styles["text-group"]}>
              <p className={styles["sub-title"]}>{t("modal_468")}</p>

              <p className={styles["info-text"]}>
                <span>{t("modal_474")}</span> {t("modal_475")}
              </p>
              <p className={styles["info-text"]}>
                <span>{t("modal_476")}</span> {t("modal_477")}
              </p>
              <p className={styles["info-text"]}>
                <span>{t("modal_478")}</span> {t("modal_479")}
              </p>
              <p className={classNames(styles["info-text"], styles["mb"])}>
                <span>{t("modal_480")}</span> {t("modal_481")}
              </p>
              <p className={styles["sub-title"]}>{t("modal_488")}</p>
              <p className={classNames(styles["info-text"])}>
                {t("modal_489")}
              </p>
            </div>
            <div className={styles["table-container"]}>
              <table>
                <thead>
                  <tr>
                    <th align={"left"}>{t("modal_484")}</th>
                    <th align={"right"}>{t("modal_485")}</th>
                    <th align={"right"}>{t("modal_486")}</th>
                    <th
                      align={"right"}
                      dangerouslySetInnerHTML={{ __html: t("modal_487") }}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyCashbackTableData.map(data => {
                    return (
                      <tr key={data.tier}>
                        <td align={"left"}>
                          <div>
                            <LazyLoadImage
                              src={`/images/vip/grade/${data.tier}.webp`}
                              alt={"img grade"}
                            />
                            <span className={styles.tier}>{data.tier}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>VIP {data.level}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>{data.qualification}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>{data.sweetenerRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {props.type === "sweetener" && (
          <>
            <div className={styles["text-group"]}>
              <pre className={styles["top-text"]}>{t("modal_490")}</pre>
              <p className={styles["sub-title"]}>{t("modal_491")}</p>
              <p className={styles["info-text"]}>
                <span>{t("modal_492")}</span>
              </p>
              <p className={styles["info-text"]}>{t("modal_493")}</p>
              <p className={styles["info-text"]}>
                <span>{t("modal_494")}</span>
              </p>
              <p className={classNames(styles["info-text"], styles["mb"])}>
                {t("modal_495")}
              </p>
              <p className={styles["sub-title"]}>{t("modal_496")}</p>
              <p className={classNames(styles["info-text"], styles["mb"])}>
                {t("modal_497")}
              </p>

              <p className={styles["sub-title"]}>{t("modal_498")}</p>
              <p className={classNames(styles["info-text"])}>
                {t("modal_499")}
              </p>
            </div>
            <div className={styles["table-container"]}>
              <table>
                <thead>
                  <tr>
                    <th align={"left"}>{t("modal_484")}</th>
                    <th align={"right"}>{t("modal_485")}</th>
                    <th align={"right"}>{t("modal_486")}</th>
                    <th
                      align={"right"}
                      dangerouslySetInnerHTML={{ __html: t("modal_487") }}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {sweetenerTableData.map(data => {
                    return (
                      <tr key={data.tier}>
                        <td align={"left"}>
                          <div>
                            <LazyLoadImage
                              src={`/images/vip/grade/${data.tier}.webp`}
                              alt={"img grade"}
                            />
                            <span className={styles.tier}>{data.tier}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>VIP {data.level}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>{data.qualification}</span>
                          </div>
                        </td>
                        <td align={"right"}>
                          <div>
                            <span>{data.sweetenerRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
