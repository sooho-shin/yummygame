"use client";

import CommonButton from "@/components/common/Button";
import CommonEmptyData from "@/components/common/EmptyData";
import ToggleBtn from "@/components/common/ToggleBtn";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { useGetUserProfile, usePutUser } from "@/querys/user";
import { useUserStore } from "@/stores/useUser";
import { formatNumber } from "@/utils";
import classNames from "classnames";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useClickAway, useCopyToClipboard } from "react-use";
import styles from "./styles/profileModal.module.scss";

dayjs.extend(utc);

type GameType =
  | "crash"
  | "dice"
  | "flip"
  | "mine"
  | "roulette"
  | "ultimatedice"
  | "wheel"
  | "another";

export default function Profile() {
  // const param = searchParams.get("modalUserId");
  const { props } = useModalHook();
  const { token } = useUserStore();
  const { data: profileData, refetch } = useGetUserProfile(
    token,
    props && props.modalUserId ? Number(props.modalUserId) : null,
  );
  const [state, copyToClipboard] = useCopyToClipboard();
  const { closeModal } = useModalHook();
  const { showToast, amountToDisplayFormat } = useCommonHook();
  const [editState, setEditState] = useState(false);
  const [detailState, setDetailState] = useState(false);
  const t = useDictionary();

  useEffect(() => {
    if (profileData) {
      refetch();
    }
  }, []);

  useEffect(() => {
    state.value && showToast(t("modal_190"));
  }, [state]);

  useEffect(() => {
    !token && closeModal();
  }, [token]);

  const getGrade = (
    vip_category: string,
  ): "bronze" | "silver" | "gold" | "platinum" | "diamond" => {
    const categories = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
    for (const category of categories) {
      if (vip_category.includes(category)) {
        return category.toLowerCase() as
          | "bronze"
          | "silver"
          | "gold"
          | "platinum"
          | "diamond";
      }
    }
    return "bronze";
  };

  if (!profileData?.result) return <></>;

  return (
    <>
      <div className={classNames(styles["profile-modal"])}>
        <div className={styles.top}>
          <span>{t("modal_191")}</span>
        </div>
        <div className={styles.content}>
          <div className={styles["content-top"]}>
            <button
              type="button"
              className={styles["avatar-box"]}
              onClick={() => {
                if (!props || !props.modalUserId) {
                  setEditState(true);
                }
              }}
              style={{
                cursor: props && props.modalUserId ? "default" : "pointer",
              }}
            >
              <span
                className={styles.avatar}
                style={{
                  backgroundImage: `url('/images/avatar/img_avatar_${profileData.result.avatar_idx}.webp')`,
                }}
              ></span>
              {(!props || !props.modalUserId) && (
                <span
                  className={`${styles.locker} ${
                    profileData.result.is_hidden ? styles.lock : ""
                  }`}
                ></span>
              )}
            </button>
            <div className={styles["info-box"]}>
              <div className={styles["nickname-row"]}>
                <span className={styles.nickname}>
                  {profileData.result.nickname}
                </span>
                <div className={styles["grade-box"]}>
                  <span className={styles.level}>
                    VIP Lv. {profileData.result.vip_level}
                  </span>
                  <span
                    className={`${styles.grade} ${
                      styles[getGrade(profileData.result.vip_category)]
                    }`}
                  ></span>
                </div>
              </div>

              <div className={styles["user-id-row"]}>
                <span>{t("modal_192")}</span>
                <span>{profileData.result.platform_uid}</span>
                <button
                  type="button"
                  className={styles.copy}
                  onClick={() => {
                    copyToClipboard(profileData.result.platform_uid.toString());
                  }}
                ></button>
              </div>

              {(!props || !props.modalUserId) && (
                <div className={styles["email-row"]}>
                  <span className={styles.ico}></span>
                  <span className={styles.email}>
                    {profileData.result.email}
                  </span>
                </div>
              )}
            </div>

            {(!props || !props.modalUserId) && (
              <button
                type="button"
                className={styles.edit}
                onClick={() => setEditState(true)}
              ></button>
            )}
          </div>

          <div className={styles["statistics-box"]}>
            <p className={styles.title}>{t("modal_193")}</p>
            <div className={styles["summary-content"]}>
              <div className={styles.top}>
                <span>{t("modal_194")}</span>
                {profileData.result.statics.summary.total_bets > 0 && (
                  <button type="button" onClick={() => setDetailState(true)}>
                    <span>{t("modal_195")}</span>
                    <p></p>
                  </button>
                )}
              </div>
              <div className={styles["content-group"]}>
                <div className={styles.content}>
                  <div className={`${styles.ico} ${styles.bet}`}></div>
                  <span>{t("modal_196")}</span>
                  <p>
                    {profileData.result.statics.summary.total_bets
                      ? formatNumber({
                          value:
                            profileData.result.statics.summary.total_bets.toString(),
                        })
                      : "0"}
                  </p>
                </div>
                <div className={styles.division}></div>
                <div className={styles.content}>
                  <div className={`${styles.ico} ${styles.win}`}></div>
                  <span>{t("modal_197")}</span>
                  <p>
                    {profileData.result.statics.summary.total_wins
                      ? formatNumber({
                          value:
                            profileData.result.statics.summary.total_wins.toString(),
                        })
                      : "0"}
                  </p>
                </div>
                <div className={styles.division}></div>
                <div className={styles.content}>
                  <div className={`${styles.ico} ${styles.wager}`}></div>
                  <span>{t("modal_198")}</span>
                  <p>
                    {amountToDisplayFormat(
                      null,
                      "jel",
                      profileData.result.statics.summary.total_wagered || "0",
                      false,
                      2,
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles["top-player-box"]}>
              <p className={styles.title}>{t("modal_199")}</p>
              <div className={styles["content-group"]}>
                {Object.keys(profileData.result.statics.top_played_game)
                  .length > 0 ? (
                  Object.keys(profileData.result.statics.top_played_game).map(
                    key => {
                      function getGameType(gameType: string): string {
                        switch (gameType) {
                          case "coin_flip":
                            return "flip";
                          case "classic_dice":
                            return "dice";
                          case "ultimate_dice":
                            return "ultimatedice";
                          case "mines":
                            return "mine";
                          default:
                            return "another";
                        }
                      }

                      function getGameName(gameType: string): string {
                        switch (gameType) {
                          case "coin_flip":
                            return "coin flip";
                          case "classic_dice":
                            return "dice";
                          case "ultimate_dice":
                            return "ultimate dice";
                          case "mines":
                            return "mine";
                          default:
                            return gameType;
                        }
                      }

                      return (
                        <div key={key} className={styles.content}>
                          <div className={styles["name-box"]}>
                            <span
                              className={`${styles.ico} ${
                                styles[getGameType(key) as GameType]
                              }`}
                            ></span>
                            <span className={styles.name}>
                              {getGameName(key)}
                            </span>
                          </div>
                          <div className={styles["amount-box"]}>
                            <span>{t("modal_200")}</span>
                            <span>
                              {amountToDisplayFormat(
                                null,
                                "jel",
                                profileData.result.statics.top_played_game[key],
                                false,
                                2,
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    },
                  )
                ) : (
                  <CommonEmptyData />
                )}
              </div>
            </div>
          </div>
          {(!props || !props.modalUserId) && (
            <p className={styles["created-date-row"]}>
              {t("modal_201")}{" "}
              {dayjs(profileData.result.create_date).utc().format("YYYY.MM.DD")}
            </p>
          )}
        </div>
      </div>
      <EditContainer editState={editState} setEditState={setEditState} />
      <DetailContainer
        detailState={detailState}
        setDetailState={setDetailState}
      />
    </>
  );
}

const DetailContainer = ({
  detailState,
  setDetailState,
}: {
  detailState: boolean;
  setDetailState: Dispatch<SetStateAction<boolean>>;
}) => {
  const { closeModal, props } = useModalHook();
  // const searchParams = useSearchParams();
  // const param = searchParams.get("modalUserId");
  const { token } = useUserStore();
  const { data: profileData, refetch } = useGetUserProfile(
    token,
    props && props.modalUserId ? Number(props.modalUserId) : null,
  );
  // const dropDownList = [
  //   "All Game",
  //   "Crash",
  //   "Wheel",
  //   "Roulette",
  //   "Dice",
  //   "Ultimate Dice",
  //   "Mine",
  //   "Coin Flip",
  // ];

  useEffect(() => {
    detailState && refetch();
  }, [detailState]);
  const { amountToDisplayFormat } = useCommonHook();

  const dropDownList = useMemo(() => {
    let arr: string[] = [];

    if (profileData?.result.statics.statics_detail) {
      const keys = Object.keys(profileData.result.statics.statics_detail);
      arr = keys.reverse();
    }

    const filtered = arr.filter(element => element !== "total_rtp");

    return filtered;
  }, [profileData?.result.statics.statics_detail]);

  const [game, setGame] = useState<string | null>(null);

  useEffect(() => {
    dropDownList.length && setGame(dropDownList[0]);
  }, [dropDownList]);
  const [dropdownState, setDropdownState] = useState(false);
  const dropboxRef = useRef<HTMLDivElement>(null);
  const t = useDictionary();

  useClickAway(dropboxRef, () => {
    setDropdownState(false);
  });

  function getGameName(gameType: string): string {
    switch (gameType) {
      case "all_game":
        return "All Game";
      case "crash":
        return "Crash";
      case "wheel":
        return "Wheel";
      case "roulette":
        return "Roulette";
      case "classic_dice":
        return "Dice";
      case "ultimate_dice":
        return "Ultimate Dice";
      case "mines":
        return "Mine";
      case "coin_flip":
        return "Coin Flip";
      default:
        return gameType;
    }
  }

  const { currentCoinList } = useCommonHook();

  const cryptoArr = useMemo(() => {
    if (!currentCoinList) {
      return [];
    }

    return currentCoinList.filter(str => str !== "jel_lock");
  }, [currentCoinList]);

  if (!profileData || !profileData.result || !game) return <></>;
  // return <></>;
  // return <></>;
  return (
    <div
      className={`${styles["detail-container"]} ${
        detailState ? styles.active : ""
      }`}
    >
      <div className={styles.top}>
        <span>{t("modal_202")}</span>
        <button
          type="button"
          className={styles["back-btn"]}
          onClick={() => setDetailState(false)}
        ></button>
        <button
          type="button"
          className={styles["close-btn"]}
          onClick={() => closeModal()}
        ></button>
      </div>

      <div className={styles["content-group"]}>
        <div className={styles["input-box"]} ref={dropboxRef}>
          <div
            className={`${styles["input-area-dropdown"]} ${
              dropdownState ? styles.active : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setDropdownState(!dropdownState)}
              className={`${styles["select-btn"]}`}
            >
              {/* <span className={`${locale ? styles.active : ""}`}> */}
              <span>{getGameName(game)}</span>
              <Image
                src="/images/common/ico_arrow_g.svg"
                alt="img arrow"
                width="24"
                height="24"
                priority
              />
            </button>
          </div>
          {dropdownState && (
            <div className={styles["drop-box-container"]}>
              <ul>
                {dropDownList.map(c => {
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() => {
                          setGame(c);
                          setDropdownState(false);
                        }}
                      >
                        <span>{getGameName(c)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className={styles["summary-group"]}>
          <div className={styles.content}>
            <div className={`${styles.ico} ${styles.bet}`}></div>
            <span>{t("modal_196")}</span>
            <p>
              {game === dropDownList[0]
                ? formatNumber({
                    value:
                      profileData.result.statics.summary.total_bets?.toString() ||
                      "0",
                  })
                : formatNumber({
                    value:
                      profileData.result.statics.statics_detail[
                        game
                      ].bet_count?.toString() || "0",
                  })}
            </p>
          </div>
          <div className={styles.division}></div>
          <div className={styles.content}>
            <div className={`${styles.ico} ${styles.win}`}></div>
            <span>{t("modal_197")}</span>
            <p>
              {game === dropDownList[0]
                ? formatNumber({
                    value:
                      profileData.result.statics.summary.total_wins.toString(),
                  })
                : formatNumber({
                    value:
                      profileData.result.statics.statics_detail[
                        game
                      ].win_count?.toString() || "0",
                  })}
            </p>
          </div>
          <div className={styles.division}></div>
          <div className={styles.content}>
            <div className={`${styles.ico} ${styles.wager}`}></div>
            <span>{t("modal_198")}</span>
            <p>
              {amountToDisplayFormat(
                null,
                "jel",
                game === dropDownList[0]
                  ? profileData.result.statics.summary.total_wagered
                  : profileData.result.statics.statics_detail[game].wager ||
                      "0",
              )}
              {/* {amountFormatter({
                val: dropDownList[0]
                  ? Number(profileData.result.statics.summary.total_wagered)
                  : Number(
                      profileData.result.statics.statics_detail[game].wager ||
                        "0",
                    ),
                withDecimal: 2,
              })} */}
            </p>
          </div>
        </div>

        <div className={styles["table-container"]}>
          <table>
            <thead>
              <tr>
                <th align="left">{t("modal_203")}</th>
                <th align="right">{t("modal_204")}</th>
                <th align="right">{t("modal_205")}</th>
                <th align="right">{t("modal_206")}</th>
              </tr>
            </thead>
            <tbody>
              {cryptoArr.map((c, i) => {
                if (
                  Object.hasOwnProperty.call(
                    profileData.result.statics.statics_detail[game],
                    c,
                  )
                ) {
                  const data: any =
                    profileData.result.statics.statics_detail[game];

                  const extractedObject = data[c];

                  return (
                    <tr key={i}>
                      <td align="left" valign="top">
                        <div>
                          <span
                            className={`${styles.ico}`}
                            style={{
                              backgroundImage: `url('/images/tokens/img_token_${c}_circle.svg')`,
                            }}
                          ></span>
                          <span className={styles.unit}>
                            {c.toLocaleUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td align="right">
                        <div>
                          <span>
                            {formatNumber({
                              value: extractedObject.bet_count || "0",
                              decimal: 0,
                              maxDigits: 2,
                            })}
                          </span>
                        </div>
                      </td>
                      <td align="right">
                        <div>
                          <span>
                            {formatNumber({
                              value: extractedObject.win_count || "0",
                              decimal: 0,
                              maxDigits: 2,
                            })}
                          </span>
                        </div>
                      </td>
                      <td align="right">
                        <div>
                          {/* <span>$ {extractedObject.wager || "0"}</span> */}
                          <span>
                            {amountToDisplayFormat(
                              null,
                              "jel",
                              extractedObject.wager || "0",
                              false,
                              2,
                            )}
                            {/* {truncateDecimal({
                              num: formatNumber({
                                value: extractedObject.wager || "0",
                                decimal: 0,
                                maxDigits: 2,
                              }),
                              decimalPlaces: 2,
                            })} */}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return <React.Fragment key={i}></React.Fragment>;
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const EditContainer = ({
  editState,
  setEditState,
}: {
  editState: boolean;
  setEditState: Dispatch<SetStateAction<boolean>>;
}) => {
  const { closeModal } = useModalHook();
  const searchParams = useSearchParams();
  const param = searchParams.get("modalUserId");
  const { token } = useUserStore();
  const { data: profileData, refetch } = useGetUserProfile(
    token,
    param ? Number(param) : null,
  );
  const [avatarState, setAvatarState] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(
    profileData?.result.avatar_idx || "1",
  );
  useEffect(() => {
    editState && refetch();
  }, [editState]);
  const [isHidden, setIsHidden] = useState<boolean>(
    profileData?.result.is_hidden === 0 ? false : true,
  );
  const { showToast, showErrorMessage } = useCommonHook();
  const { mutate: putUser, isLoading } = usePutUser();

  const [nickName, setNickname] = useState<string | null>(null);
  const t = useDictionary();
  const changed = useMemo(() => {
    if (!profileData?.result) return false;
    if (nickName && (nickName.length <= 3 || nickName.length >= 13)) {
      return false;
    }
    if (profileData?.result.avatar_idx != currentAvatar) {
      return true;
    }
    if (profileData?.result.is_hidden != (isHidden ? 1 : 0)) {
      return true;
    }
    if (nickName && profileData?.result.nickname != nickName) {
      return true;
    }
    return false;
  }, [profileData, currentAvatar, isHidden, nickName]);

  return (
    <div
      className={`${styles["edit-container"]} ${
        editState ? styles.active : ""
      }`}
    >
      <div className={styles.top}>
        <span>{t("modal_207")}</span>
        <button
          type="button"
          className={styles["back-btn"]}
          onClick={() => setEditState(false)}
        ></button>
        <button
          type="button"
          className={styles["close-btn"]}
          onClick={() => closeModal()}
        ></button>
      </div>

      <div className={styles["content-group"]}>
        <div className={styles["avatar-container"]}>
          <p className={`${styles.title} ${avatarState ? styles.active : ""}`}>
            {t("modal_208")}
          </p>
          <div className={styles["avatar-choice-group"]}>
            <div
              className={`${styles["my-avatar"]}`}
              style={{
                backgroundImage: `url('/images/avatar/img_avatar_${currentAvatar}.webp')`,
              }}
            ></div>
            <div className={styles["avatar-group"]}>
              {Array.from({ length: 10 }).map((c, i) => {
                return (
                  <div key={i} className={styles.box}>
                    {currentAvatar === i && (
                      <div className={styles.check}></div>
                    )}
                    <button
                      type="button"
                      style={{
                        backgroundImage: `url('/images/avatar/img_avatar_${i}.webp')`,
                      }}
                      onClick={() => setCurrentAvatar(i)}
                      onFocus={() => {
                        setAvatarState(true);
                      }}
                      onBlur={() => {
                        setAvatarState(false);
                      }}
                    ></button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles["input-box"]}>
          <p className={`${styles.title}`}>{t("modal_209")}</p>
          <div className={styles["input-area"]}>
            <input
              type="text"
              placeholder={profileData?.result.nickname}
              // value={referralCode ?? ""}
              onChange={e => {
                setNickname(e.target.value);
                // setReferralCode(e.target.value);
              }}
            />
          </div>
          {/* <p className={styles.error}>Enter a valid code.</p> */}
        </div>

        <div className={styles["hidden-container"]}>
          <div className={styles["text-area"]}>
            <p className={styles["text-area-title"]}>{t("modal_210")}</p>
            <p className={styles["text-area-text"]}>{t("modal_211")}</p>
          </div>
          <ToggleBtn
            callback={() => {
              setIsHidden(!isHidden);
            }}
            active={isHidden}
          />
        </div>
      </div>

      <CommonButton
        className={`${styles.submit} ${
          !nickName || (nickName?.length > 3 && nickName?.length < 13)
            ? styles.active
            : ""
        }`}
        onClick={() => {
          const data: {
            avatarIdx: number;
            nickName?: string | null;
            isHidden: 0 | 1;
          } = {
            avatarIdx: Number(currentAvatar) || 0,
            isHidden: isHidden === true ? 1 : 0,
          };

          if (nickName) {
            data.nickName = nickName;
          }

          putUser(data, {
            onSuccess(data) {
              showErrorMessage(data.code);
              if (data.code === 0) {
                showToast(t("toast_12"));
                setNickname(null);
                setEditState(false);
              }
            },
          });
        }}
        disabled={!changed}
        isPending={isLoading}
        text={t("modal_212")}
      />
    </div>
  );
};
