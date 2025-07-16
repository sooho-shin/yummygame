"use client";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetAffiliateMembers } from "@/querys/bonus";
import { useUserStore } from "@/stores/useUser";
import { formatNumber } from "@/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import CommonEmptyData from "../common/EmptyData";
import Pagination from "../common/Pagination";
import styles from "./styles/affiliate.module.scss";

export default function AffiliateMemberHistory() {
  dayjs.extend(utc);
  const [dropdownState, setDropdownState] = useState(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  const filterParamArr = ["all", "tier1", "tier2"];
  const { routeWithParams, amountToDisplayFormat } = useCommonHook();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const filter = searchParams.get("filter");
  const { token } = useUserStore();
  const { openModal } = useModalHook();
  const t = useDictionary();

  const { data: membersData } = useGetAffiliateMembers(
    {
      page: page ? Number(page) : 1,
      filter: filter || filterParamArr[0],
    },
    token,
  );

  const [selectedFilter, setSelectedFilter] = useState<string>(
    filter ? filter : filterParamArr[0],
  );

  const getFilterName = (filter: string) => {
    switch (filter) {
      case filterParamArr[0]:
        return t("affiliate_1");
      case filterParamArr[1]:
        return t("affiliate_2");
      case filterParamArr[2]:
        return t("affiliate_3");

      default:
        break;
    }
  };

  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });
  return (
    <div className={styles["affiliate-member-wrapper"]}>
      <p className={styles.title}>{t("affiliate_4")}</p>
      <div className={styles["filter-row"]}>
        <div className={styles.total}>
          <span>{t("affiliate_5")}</span>
          <span>{!membersData ? "0" : membersData.pagination.totalCount}</span>
        </div>
        <div className={styles["filter-box"]} ref={dropboxRef}>
          <button
            type="button"
            className={dropdownState ? styles.active : ""}
            onClick={() => {
              setDropdownState(!dropdownState);
            }}
          >
            <span>{getFilterName(selectedFilter)}</span>
            <span></span>
          </button>
          {dropdownState && (
            <div className={styles.dropbox}>
              {filterParamArr.map(c => {
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => {
                      setSelectedFilter(c);
                      setDropdownState(false);
                      routeWithParams({
                        paramArray: [{ paramName: "filter", value: c }],
                      });
                    }}
                  >
                    <span>{getFilterName(c)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th align="left">{t("affiliate_6")}</th>
              <th align="left">{t("affiliate_7")}</th>
              <th align="right">{t("affiliate_8")}</th>
              <th align="right">{t("affiliate_9")}</th>
              <th align="right">{t("affiliate_10")}</th>
            </tr>
          </thead>
          <tbody>
            {!token || !membersData || membersData?.result.length === 0 ? (
              <>
                <tr className={styles["not-data"]}>
                  <td colSpan={5}>
                    <CommonEmptyData />
                  </td>
                </tr>
              </>
            ) : (
              membersData.result.map((c, i) => {
                return (
                  <tr key={i}>
                    <td align="left">
                      <div>
                        <button
                          type="button"
                          style={{
                            cursor: c.is_hidden ? "default" : "pointer",
                          }}
                          onClick={() => {
                            if (c.is_hidden) {
                              return false;
                            } else {
                              openModal({
                                type: "profile",
                                props: {
                                  modalUserId: c.user_idx.toString(),
                                },
                              });
                            }
                          }}
                        >
                          <span
                            className={styles.avatar}
                            style={{
                              backgroundImage: `url('/images/avatar/img_avatar_${
                                c.is_hidden ? "hidden" : c.avatar_idx
                              }.webp')`,
                            }}
                          ></span>
                          <span>{c.nickname}</span>
                        </button>
                      </div>
                    </td>

                    <td align="left">
                      <div>
                        <span>{c.tier}</span>
                      </div>
                    </td>

                    <td align="right">
                      <div>
                        <span>
                          {amountToDisplayFormat(
                            null,
                            "jel",
                            c.total_wager ?? "0",
                          )}
                        </span>
                      </div>
                    </td>

                    <td align="right">
                      <div>
                        <span className={styles.win}>
                          {formatNumber({ value: c.total_bonus })}
                        </span>
                        <span
                          className={`${styles.ico}`}
                          style={{
                            backgroundImage: `url('/images/tokens/img_token_jel_circle.svg')`,
                          }}
                        ></span>
                      </div>
                    </td>

                    <td align="right">
                      <div>
                        <span>
                          {dayjs(c.last_sign_in_date)
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
      </div>
      <Pagination
        page={page || "1"}
        paginationData={membersData?.pagination}
        visiblePages={5}
        paramName="page"
      />
    </div>
  );
}
