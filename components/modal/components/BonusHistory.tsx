"use client";

import CommonEmptyData from "@/components/common/EmptyData";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetBonusHistory } from "@/querys/bonus";
import { useUserStore } from "@/stores/useUser";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Pagination from "../../common/Pagination";
import styles from "./styles/bonusHistoryModal.module.scss";

export default function BonusHistory() {
  dayjs.extend(utc);
  const searchParams = useSearchParams();
  const { token } = useUserStore();
  const page = searchParams.get("modalPage");
  const { routeWithParams, fiatSymbol, amountToDisplayFormat } =
    useCommonHook();
  const { isOpen } = useModalHook();
  const t = useDictionary();

  const { data, refetch } = useGetBonusHistory(
    { page: page ? Number(page) : 1 },
    token,
  );

  useEffect(() => {
    refetch();
  }, []);

  if (!data) return <></>;
  return (
    <div className={styles["bonus-history-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_96")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["table-container"]}>
          <table>
            <thead>
              <tr>
                <th align="left">{t("modal_97")}</th>
                <th align="right">{t("modal_98")}</th>
                <th align="right">{t("modal_99")}</th>
              </tr>
            </thead>
            <tbody>
              {!data?.result || data?.result.length === 0 ? (
                <tr className={styles["not-data"]}>
                  <td colSpan={3}>
                    <CommonEmptyData />
                  </td>
                </tr>
              ) : (
                Array.from({ length: 7 }).map((c, i) => {
                  if (!data?.result[i]) return <tr key={i}></tr>;
                  return (
                    <tr key={i}>
                      <td align="left" valign="top">
                        <div>
                          <span className={`${styles.dollar}`}></span>
                          <span>{data?.result[i].change_code}</span>
                        </div>
                      </td>
                      <td align="right">
                        <div>
                          <span className={styles.amount}>
                            {amountToDisplayFormat(
                              data?.result[i].change_value,
                              data?.result[i].asset_type_code,
                            )}
                          </span>
                          <span
                            className={`${styles.ico} ${styles.jel}`}
                          ></span>
                        </div>
                      </td>
                      <td align="right">
                        <div>
                          {/* <span>$ {extractedObject.wager || "0"}</span> */}
                          <span className={styles.date}>
                            {dayjs(data.result[i].create_date)
                              .utc()
                              .format("YY/MM/DD HH:mm:ss")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <Pagination page={page || "1"} paginationData={data.pagination} />
          <div className={styles["notice-group"]}>
            <p className={styles.title}>{t("modal_100")}</p>
            <ul>
              <li>
                <span>{t("modal_101")}</span>
              </li>
              <li>
                <span>{t("modal_102")}</span>
              </li>
              <li>
                <span>{t("modal_103")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
