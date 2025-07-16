"use client";

import React, { useMemo, useRef, useState } from "react";
import styles from "./styles/provider.module.scss";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classNames from "classnames";
import { useDictionary } from "@/context/DictionaryContext";
import { useGetProviders } from "@/querys/provider";
import useCommonHook from "@/hooks/useCommonHook";
import { useDebounce } from "react-use";
import _ from "lodash";
import CommonEmptyData from "@/components/common/EmptyData";

const ProviderMain = () => {
  const t = useDictionary();
  const { data } = useGetProviders();
  const { checkMedia } = useCommonHook();
  const [inputActive, setInputActive] = useState(false);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(searchText === "" ? null : searchText);
    },
    300,
    [searchText],
  );

  const providerList = useMemo(() => {
    if (!data || !data.result) return [];
    let list = [
      {
        idx: 0,
        provider_name: "yummygame",
        provider_real_name: "yummygame",
        img_url:
          "https://cdn.softswiss.net/logos/providers/white/1spin4win.svg",
      },
      ...data.result,
    ];
    if (debouncedValue && debouncedValue?.length >= 3) {
      list = _.filter(list, item =>
        _.includes(
          item.provider_real_name?.toLocaleLowerCase() || "",
          debouncedValue.trim().toLocaleLowerCase(),
        ),
      );
    }

    return list;
  }, [debouncedValue, data]);

  return (
    <>
      {/*<div className={styles["prover-main-top"]}>*/}
      {/*  <LazyLoadImage*/}
      {/*    src={`/images/provider/main/img_01.webp`}*/}
      {/*    alt="img side"*/}
      {/*    className={classNames(styles.side, styles.left)}*/}
      {/*  />*/}
      {/*  <LazyLoadImage*/}
      {/*    src={`/images/provider/main/img_02.webp`}*/}
      {/*    alt="img side"*/}
      {/*    className={classNames(styles.side, styles.right)}*/}
      {/*  />*/}
      {/*  <LazyLoadImage*/}
      {/*    src={`/images/provider/main/img_logo.webp`}*/}
      {/*    alt="img logo"*/}
      {/*    className={styles.logo}*/}
      {/*  />*/}
      {/*  <LazyLoadImage*/}
      {/*    src={`/images/provider/main/img_filter.webp`}*/}
      {/*    alt="img filter"*/}
      {/*    className={styles.filter}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className={styles["prover-main-wrapper"]}>
        <div
          className={`${styles["search-box"]} ${
            inputActive ? styles.active : ""
          }`}
        >
          <div className={styles["input-group"]}>
            <div className={styles["input-box"]}>
              <span></span>

              <input
                type="text"
                placeholder={t("provider_15")}
                onFocus={() => setInputActive(true)}
                value={searchText || ""}
                onChange={e => {
                  setSearchText(e.target.value);
                }}
                onBlur={() => {
                  setInputActive(false);
                }}
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText(null)}
                ></button>
              )}
            </div>
          </div>
        </div>
        <h2>PROVIDERS</h2>
        <div
          className={classNames(styles["provider-link-group"], {
            [styles.null]: providerList.length < 1,
          })}
        >
          {providerList.length > 0 ? (
            providerList.map((c, i) => {
              if (c.idx === 0) {
                return (
                  <div key={c.idx}>
                    <Link
                      href={`/provider/original`}
                      // @ts-ignore
                      // className={styles[c]}
                    >
                      <div className={styles.bg}></div>
                      <div className={styles.top}>
                        <LazyLoadImage
                          src={`/images/provider/main/img_provider_yummygame.png`}
                          alt="img event"
                        />
                      </div>
                      <div className={styles.bottom}>
                        <span>{"yummygame"}</span>
                      </div>
                    </Link>
                  </div>
                );
              }
              return (
                <div key={i}>
                  <Link
                    href={`/providers/${c.provider_name}?isProvider=true&name=${
                      c.provider_real_name ?? c.provider_name
                    }`}
                    // @ts-ignore
                    // className={styles[c]}
                  >
                    <div className={styles.bg}></div>
                    <div className={styles.top}>
                      <ProviderImageBox
                        provider_name={c.provider_real_name ?? c.provider_name}
                        img_url={c.img_url}
                      />
                      {/*<>*/}
                      {/*{c.img_url && !imageFailed ? (*/}
                      {/*  <LazyLoadImage*/}
                      {/*    src={c.img_url}*/}
                      {/*    alt="img event"*/}
                      {/*    onError={() => setImageFailed(true)}*/}
                      {/*  />*/}
                      {/*) : (*/}
                      {/*  c.provider_name*/}
                      {/*)}*/}
                      {/*</>*/}
                    </div>
                    <div className={styles.bottom}>
                      <span>{c.provider_real_name ?? c.provider_name}</span>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <CommonEmptyData text={t("provider_14")} />
          )}
        </div>
      </div>
    </>
  );
};

const ProviderImageBox = ({
  img_url,
  provider_name,
}: {
  img_url: string;
  provider_name: string;
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <>
      {img_url && !imageFailed ? (
        <LazyLoadImage
          src={img_url}
          alt="img event"
          onError={() => setImageFailed(true)}
        />
      ) : (
        provider_name.toLocaleUpperCase()
      )}
    </>
  );
};

export default ProviderMain;
