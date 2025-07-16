import useCommonHook from "@/hooks/useCommonHook";
import styles from "./styles/pagination.module.scss";
import { Dispatch, SetStateAction } from "react";

export default function Pagination({
  paginationData,
  page,
  visiblePages = 3,
  paramName = "modalPage",
  setPage,
}: {
  paginationData:
    | {
        page: number;
        limit: number;
        offset: number;
        totalPage: number;
        totalCount: number;
      }
    | undefined;
  page: string;
  visiblePages?: number;
  paramName?: string;
  setPage?: Dispatch<SetStateAction<string | null>>;
}) {
  function generatePagination(
    currentPage: string,
    totalPages: string,
    visiblePages: number,
  ): number[] {
    const halfVisible = Math.floor(visiblePages / 2);
    const startPage = Math.max(1, Number(currentPage) - halfVisible);
    const endPage = Math.min(Number(totalPages), startPage + visiblePages - 1);

    const pageNumbers: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }

  const { routeWithParams } = useCommonHook();

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={`${styles.left} ${styles.double}`}
        disabled={!page || Number(page) < visiblePages}
        onClick={() => {
          if (page) {
            setPage &&
              setPage(
                (
                  Number(page) - (visiblePages === 3 ? 3 : visiblePages)
                ).toString(),
              );
            routeWithParams({
              paramArray: [
                {
                  value: (
                    Number(page) - (visiblePages === 3 ? 3 : visiblePages)
                  ).toString(),
                  paramName: paramName,
                },
              ],
            });
          }
        }}
      ></button>
      <button
        type="button"
        className={`${styles.left} ${styles.single}`}
        disabled={!page || Number(page) === 1}
        onClick={() => {
          setPage && setPage((Number(page) - 1).toString());
          routeWithParams({
            paramArray: [
              {
                value: (Number(page) - 1).toString(),
                paramName: paramName,
              },
            ],
          });
        }}
      ></button>
      <div>
        {!paginationData || !paginationData.totalPage ? (
          <button
            type="button"
            disabled={true}
            style={{ cursor: "default" }}
            onClick={() => {
              setPage && setPage("1");
              routeWithParams({
                paramArray: [
                  {
                    value: "1",
                    paramName: paramName,
                  },
                ],
              });
            }}
          >
            1
          </button>
        ) : (
          generatePagination(
            page || "1",
            paginationData.totalPage.toString(),
            visiblePages,
          ).map(c => {
            return (
              <button
                key={c}
                type="button"
                className={(page || "1") === c.toString() ? styles.active : ""}
                onClick={() => {
                  setPage && setPage(c.toString());
                  routeWithParams({
                    paramArray: [
                      {
                        value: c.toString(),
                        paramName: paramName,
                      },
                    ],
                  });
                }}
              >
                {c}
              </button>
            );
          })
        )}
      </div>
      <button
        type="button"
        className={`${styles.right} ${styles.single}`}
        disabled={
          !paginationData ||
          !paginationData.totalPage ||
          paginationData.totalPage === Number(page || 1)
        }
        onClick={() => {
          setPage && setPage((Number(page) + 1).toString());
          routeWithParams({
            paramArray: [
              {
                value: (Number(page) + 1).toString(),
                paramName: paramName,
              },
            ],
          });
        }}
      ></button>
      <button
        type="button"
        className={`${styles.right} ${styles.double}`}
        disabled={
          !paginationData ||
          !paginationData.totalPage ||
          paginationData.totalPage === Number(page || 1) + 1
        }
        onClick={() => {
          const value = visiblePages;
          if (paginationData?.totalPage) {
            setPage &&
              setPage(
                (Number(page) + value > paginationData.totalPage
                  ? paginationData.totalPage
                  : Number(page) + value
                ).toString(),
              );
            routeWithParams({
              paramArray: [
                {
                  value: (Number(page) + value > paginationData.totalPage
                    ? paginationData.totalPage
                    : Number(page) + value
                  ).toString(),
                  paramName: paramName,
                },
              ],
            });
          }
        }}
      ></button>
    </div>
  );
}
