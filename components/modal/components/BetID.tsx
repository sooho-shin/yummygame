"use client";

import { CommonGameKeys } from "@/config/queryKey";
import { useDictionary } from "@/context/DictionaryContext";
import useCommonHook from "@/hooks/useCommonHook";
import useModalHook from "@/hooks/useModalHook";
import { usePostChat } from "@/querys/chat";
import {
  useGetGameDetail,
  useGetGameSeed,
  usePutGameSeed,
} from "@/querys/game/common";
import { useGetUserProfile } from "@/querys/user";
import { useUserStore } from "@/stores/useUser";
import { GameDetailDataType } from "@/types/games/common";
import { CrashGameDetailDataType } from "@/types/games/crash";
import { DiceGameDetailDataType } from "@/types/games/dice";
import { FlipGameDetailDataType } from "@/types/games/flip";
import { MineGameDetailDataType } from "@/types/games/mine";
import { RouletteGameDetailDataType } from "@/types/games/roulette";
import { UltimateDiceGameDetailDataType } from "@/types/games/ultimatedice";
import { WheelGameDetailDataType } from "@/types/games/wheel";
import { validateByte } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styles from "./styles/betIDModal.module.scss";
import { PlinkoGameDetailDataType } from "@/types/games/plinko";
import { LimboGameDetailDataType } from "@/types/games/limbo";

export default function BetID() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { closeModal, props } = useModalHook();
  // const searchParams = useSearchParams();
  const { token } = useUserStore();
  const { mutate: postChat } = usePostChat();
  const { data: userData } = useGetUserProfile(token);
  const t = useDictionary();
  // const { refet } = useQuery();
  const queryClient = useQueryClient();
  // const modalGameType = searchParams.get("modalGameType");
  // const modalGameIdx = searchParams.get("modalGameIdx");

  const { mutate: putGameSeed } = usePutGameSeed();

  const [settingState, setSettingState] = useState(false);
  const [changeState, setChangeState] = useState(false);

  function generateRandomString(minByte: number, maxByte: number): string {
    if (minByte < 10 || maxByte > 32 || minByte > maxByte) {
      throw new Error(t("modal_53"));
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    let currentByte = 0;

    while (currentByte < minByte) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const charByte = Buffer.from(characters.charAt(randomIndex)).length;

      if (currentByte + charByte <= maxByte) {
        result += characters.charAt(randomIndex);
        currentByte += charByte;
      }
    }

    return result;
  }

  const { data, refetch } = useGetGameDetail({
    type: props.modalGameType || null,
    GameIdx:
      props.modalGameType.toLocaleUpperCase() === "PROVIDER"
        ? props.modalGameIdx
        : Number(props.modalGameIdx) || null,
  });

  const { data: seedData, refetch: seedDataRefetch } = useGetGameSeed({
    gameType: props.modalGameType || "CRASH",
  });

  useEffect(() => {
    refetch();
    seedDataRefetch();
  }, []);

  const [seed, setSeed] = useState<string | null>(null);

  const { showToast, showErrorMessage } = useCommonHook();

  const [shareState, setShareState] = useState(false);

  // const handleShare = () => {
  //   if (!props.modalGameIdx || !props.modalGameType) return false;
  //   postChat(
  //     {
  //       messageType: "BET_INFO",
  //       betId: Number(props.modalGameIdx),
  //       betGameType: props.modalGameType.toLocaleUpperCase() as
  //         | "CRASH"
  //         | "MINES"
  //         | "ROULETTE"
  //         | "CLASSIC_DICE"
  //         | "ULTIMATE_DICE"
  //         | "COIN_FLIP"
  //         | "WHEEL"
  //         | "PLINKO",
  //     },
  //     {
  //       onSuccess(data) {
  //         showErrorMessage(data.code);
  //         if (data.code === 0) {
  //           showToast(t("modal_52"));
  //           setShareState(false);
  //         }
  //       },
  //     },
  //   );
  // };

  if (!data || !data.result)
    return (
      <>
        <div className={styles["bet-id-modal"]}>
          <div className={styles.top}>
            <span>{t("modal_54")}</span>
          </div>
        </div>
      </>
    );

  //   return <></>;
  return (
    <div className={styles["bet-id-modal"]}>
      <div className={styles.top}>
        <span>{t("modal_54")}</span>
      </div>
      <div className={styles.content}>
        <div className={styles["user-info"]}>
          <div>
            <span
              className={`${styles.avatar}`}
              style={{
                backgroundImage: `url('/images/avatar/img_avatar_${
                  data.result.avatar_idx || "hidden"
                }.webp')`,
              }}
            ></span>
            <span className={styles.nickname}>
              {data.result.nickname || "Hidden"}
            </span>
          </div>
          <p>
            {dayjs(data.result.create_date).utc().format("YY/MM/DD HH:mm:ss")}
          </p>
        </div>
        <div className={styles["id-row"]}>
          <span>ID</span>
          <span className={styles.id}>{data.result.idx}</span>

          {/*{userData?.result.idx === data.result.user_idx && (*/}
          {/*  <button type="button" onClick={() => setShareState(true)}></button>*/}
          {/*)}*/}
        </div>

        {props.modalGameType === "CRASH" && <CrashContainer data={data} />}
        {props.modalGameType === "WHEEL" && <WheelContainer data={data} />}
        {props.modalGameType === "ROULETTE" && (
          <RouletteContainer data={data} setSettingState={setSettingState} />
        )}
        {props.modalGameType === "COIN_FLIP" && (
          <FlipContainer data={data} setSettingState={setSettingState} />
        )}
        {props.modalGameType === "CLASSIC_DICE" && (
          <DiceContainer data={data} setSettingState={setSettingState} />
        )}
        {props.modalGameType === "ULTIMATE_DICE" && (
          <UltimateDiceContainer
            data={data}
            setSettingState={setSettingState}
          />
        )}
        {props.modalGameType === "MINES" && (
          <MineContainer data={data} setSettingState={setSettingState} />
        )}
        {props.modalGameType === "PROVIDER" && (
          <ProviderContainer data={data} />
        )}
        {props.modalGameType === "PLINKO" && (
          <PlinkoContainer data={data} setSettingState={setSettingState} />
        )}
        {props.modalGameType === "LIMBO" && (
          <LimboContainer data={data} setSettingState={setSettingState} />
        )}
      </div>
      <div className={styles["btn-row"]}>
        <button
          type="button"
          className={styles["confirm-btn"]}
          onClick={() => {
            closeModal();
          }}
        >
          <span>{t("modal_55")}</span>
        </button>
      </div>
      {/*{shareState && (*/}
      {/*  <div className={styles["share-box"]}>*/}
      {/*    <p className={styles.title}>{t("modal_56")}</p>*/}
      {/*    <p className={styles.text}>{t("modal_57")}</p>*/}
      {/*    <div className={styles["btn-row"]}>*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        onClick={() => {*/}
      {/*          setShareState(false);*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <span>{t("modal_58")}</span>*/}
      {/*      </button>*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        onClick={() => {*/}
      {/*          handleShare();*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <span>{t("modal_59")}</span>*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      <div
        className={`${styles["setting-container"]} ${
          settingState ? styles.active : ""
        }`}
      >
        <div className={styles.top}>
          <span>{t("modal_60")}</span>
          <button
            type="button"
            className={styles["back-btn"]}
            onClick={() => setSettingState(false)}
          ></button>
          <button
            type="button"
            className={styles["close-btn"]}
            onClick={() => closeModal()}
          ></button>
        </div>
        <div className={styles.content}>
          <p className={styles["sub-title"]}>{t("modal_61")}</p>
          <div className={styles["current-seed-box"]}>
            <p className={styles.title}>{t("modal_62")}</p>
            <div className={styles.box}>
              <div className={styles.row}>
                <span>{t("modal_63")}</span>
                <span>{seedData?.result.current_server_seed_hash}</span>
              </div>
              <div className={styles.row}>
                <span>{t("modal_64")}</span>
                <span>{seedData?.result.current_client_seed}</span>
              </div>
              <div className={styles.row}>
                <span>{t("modal_65")}</span>
                <span>{seedData?.result.nonce}</span>
              </div>
            </div>
          </div>

          <div className={styles["new-seed-box"]}>
            <p className={styles.title}>{t("modal_66")}</p>
            <div className={styles.box}>
              <div className={styles["hash-box"]}>
                <p className={styles.title}>{t("modal_67")}</p>
                <div className={styles["input-box"]}>
                  <input
                    type="input"
                    readOnly
                    value={seedData?.result.next_server_seed_hash}
                  ></input>
                </div>
              </div>
              <div className={styles.row}>
                <div>
                  <p className={styles.title}>{t("modal_68")}</p>
                  <div className={styles["input-box"]}>
                    <input
                      type="text"
                      value={changeState ? seed ?? "" : data.result.client_seed}
                      onChange={e => {
                        setSeed(e.target.value);
                        setChangeState(true);
                      }}
                    />
                    <button
                      type="button"
                      className={styles["refresh-btn"]}
                      onClick={() => {
                        setChangeState(true);
                        setSeed(generateRandomString(15, 25));
                      }}
                    ></button>
                  </div>
                </div>
                <div>
                  <p className={styles.title}>{t("modal_65")}</p>
                  <div className={`${styles["input-box"]} ${styles.disabled}`}>
                    <input type="text" readOnly value={"0"} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.info}>{t("modal_69")}</p>
        </div>
        <button
          type="button"
          className={`${styles["submit-btn"]} ${
            validateByte(seed ?? "", 32, 10) && changeState ? styles.active : ""
          }`}
          disabled={!(validateByte(seed ?? "", 32, 10) && changeState)}
          onClick={() => {
            putGameSeed(
              { clientSeed: seed ?? "", gameType: props.modalGameType ?? "" },
              {
                onSuccess(data) {
                  showErrorMessage(data.code);
                  if (data.code === 0) {
                    showToast(t("modal_70"));
                    setSettingState(false);
                    refetch();
                    queryClient.invalidateQueries([
                      `${
                        CommonGameKeys.MYHISTORY
                      }${props.modalGameType?.toLocaleUpperCase()}`,
                    ]);
                  }
                },
              },
            );
          }}
        >
          <span>{t("modal_71")}</span>
        </button>
      </div>
    </div>
  );
}

const CrashContainer = ({ data }: { data: CrashGameDetailDataType }) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const { routeWithParams } = useCommonHook();
  const { openModal } = useModalHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>
        {data.result.bet_result_list.length > 0 ? (
          data.result.bet_result_list.map((c, i) => {
            return (
              <div className={styles.box} key={i}>
                <div className={styles.row}>
                  <span>{t("modal_73")}</span>
                  <div className={styles.amount}>
                    <span>
                      {amountToDisplayFormat(
                        c.bet_amount,
                        data.result.bet_coin_type,
                      )}
                    </span>
                    <span
                      className={`${styles.ico}`}
                      style={{
                        backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                      }}
                    ></span>
                  </div>
                </div>
                <div className={styles.row}>
                  <span>{t("modal_74")}</span>
                  <div className={styles.amount}>
                    <span>{c.pay_out}</span>
                    <span
                      className={`${styles.ico}`}
                      style={{ height: "auto" }}
                    >
                      x
                    </span>
                  </div>
                </div>
                <div className={styles.row}>
                  <span>{t("modal_75")}</span>
                  <div className={`${styles.amount}`}>
                    <span
                      className={`${
                        c.win_yn === "Y" ? styles.win : styles.lose
                      }`}
                    >
                      {amountToDisplayFormat(
                        c.profit,
                        data.result.bet_coin_type,
                      )}
                    </span>
                    <span
                      className={`${styles.ico}`}
                      style={{
                        backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.box}>
            <div className={styles.row}>
              <span>{t("modal_73")}</span>
              <div className={styles.amount}>
                <span>
                  {amountToDisplayFormat(
                    data.result.bet_amount,
                    data.result.bet_coin_type,
                  )}
                </span>
                <span
                  className={`${styles.ico}`}
                  style={{
                    backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                  }}
                ></span>
              </div>
            </div>
            <div className={styles.row}>
              <span>{t("modal_74")}</span>
              <div className={styles.amount}>
                <span>0</span>
                <span className={`${styles.ico}`}>x</span>
              </div>
            </div>
            <div className={styles.row}>
              <span>{t("modal_75")}</span>
              <div className={`${styles.amount}`}>
                <span className={styles.lose}>
                  {amountToDisplayFormat(
                    data.result.bet_amount,
                    data.result.bet_coin_type,
                  )}
                </span>
                <span
                  className={`${styles.ico}`}
                  style={{
                    backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                  }}
                ></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.box}>
          <span>{t("modal_77")}</span>
          <span>{data.result.game_result} x</span>
        </div>
      </div>
      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_79")}</span>
            <span>{data.result.round}</span>
          </div>
          <div className={styles.row}>
            <span>{t("modal_80")}</span>
            <span>{data.result.server_seed}</span>
          </div>
          <div className={styles["verify-row"]}>
            <button
              type="button"
              className={styles["game-id"]}
              onClick={() => {
                openModal({
                  backBtn: true,
                  type: "gameID",
                  props: {
                    modalGameType: "crash",
                    modalRound: data.result.round.toString(),
                  },
                });
              }}
            >
              <span>{t("modal_81")}</span>
            </button>
            <a
              href={`https://codepen.io/dev-yummy/pen/ExMyNbj?hash=${data.result.server_seed}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const WheelContainer = ({ data }: { data: WheelGameDetailDataType }) => {
  // useEffect()
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const { openModal } = useModalHook();
  const t = useDictionary();
  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>
                {data.result.win_yn === "Y"
                  ? data.result.success_multiply
                  : "0"}
              </span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.row}>
          <div className={styles.box}>
            <span>{t("modal_83")}</span>
            <span className={styles[`payout-${data.result.bet_multiply}`]}>
              {data.result.bet_multiply} x
            </span>
          </div>
          <div className={styles.box}>
            <span>{t("modal_84")}</span>
            <span className={styles[`payout-${data.result.success_multiply}`]}>
              {data.result.success_multiply} x
            </span>
          </div>
        </div>
      </div>
      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_79")}</span>
            <span>{data.result.round}</span>
          </div>
          <div className={styles.row}>
            <span>{t("modal_80")}</span>
            <span>{data.result.server_seed}</span>
          </div>
          <div className={styles["verify-row"]}>
            <button
              type="button"
              className={styles["game-id"]}
              onClick={() => {
                openModal({
                  backBtn: true,
                  type: "gameID",
                  props: {
                    modalGameType: "wheel",
                    modalRound: data.result.round.toString(),
                  },
                });
              }}
            >
              <span>{t("modal_81")}</span>
            </button>
            <a
              href={`https://codepen.io/dev-yummy/pen/GReqNyy?hash=${data.result.server_seed}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const RouletteContainer = ({
  data,
  setSettingState,
}: {
  data: RouletteGameDetailDataType;
  setSettingState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // useEffect()
  const { amountToDisplayFormat, divCoinType, showToast } = useCommonHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.box}>
          <span>{t("modal_84")}</span>
          <span>{data.result.result_number}</span>
        </div>
        <div className={styles.box}>
          <table>
            <colgroup>
              <col width={"33.33%"} />
              <col width={"33.33%"} />
              <col width={"33.33%"} />
            </colgroup>
            <thead>
              <tr>
                <th align="left">
                  <span>{t("modal_85")}</span>
                </th>
                <th>
                  <span>{t("modal_86")}</span>
                </th>
                <th align="right">
                  <span>{t("modal_87")}</span>
                </th>
              </tr>
            </thead>
          </table>
          <div className={styles["table-scroll"]}>
            <table>
              <colgroup>
                <col width={"33.33%"} />
                <col width={"33.33%"} />
                <col width={"33.33%"} />
              </colgroup>
              <tbody>
                {data.result.input.map((c, i) => {
                  return (
                    <tr key={i}>
                      <td align="left">
                        <span>{c.type}</span>
                      </td>

                      <td align="center">
                        {c.selectList && c.selectList.length > 0 ? (
                          <span>
                            {c.selectList.map((j, i) => {
                              return c.selectList?.length === i + 1 ? (
                                <React.Fragment key={i}>{j}</React.Fragment>
                              ) : (
                                <React.Fragment
                                  key={i}
                                >{`${j},`}</React.Fragment>
                              );
                            })}
                          </span>
                        ) : (
                          <span>-</span>
                        )}
                      </td>

                      <td align="right">
                        <span>
                          {divCoinType(c.betAmount, data.result.bet_coin_type)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_88")}</span>
            <span className={data.result.server_seed ? "" : styles.disabled}>
              {data.result.server_seed ?? t("modal_425")}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_89")}</span>
            <span className={styles.overflow}>
              {data.result.server_seed_hash}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_90")}</span>
            <span className={styles.overflow}>{data.result.client_seed}</span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_91")}</span>
            <span>{data.result.nonce}</span>
          </div>

          <div className={styles["verify-row"]}>
            {/* <div>
              <span>Game ID</span>
            </div> */}

            {!data.result.server_seed && (
              <button
                type="button"
                className={styles.setting}
                onClick={() => setSettingState(true)}
              >
                <span>{t("modal_92")}</span>
              </button>
            )}

            <a
              href={`https://codepen.io/dev-yummy/pen/abMZBLv?serverSeed=${data.result.server_seed}&clientSeed=${data.result.client_seed}&nonce=${data.result.nonce}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto" }}
              onClick={e => {
                if (!data.result.server_seed) {
                  e.preventDefault();
                  showToast(t("modal_93"));
                }
              }}
            >
              <span>{t("modal_82")}</span>
            </a>

            {/* {data.result.server_seed ? (
            ) : (
              <button type="button">
                <span>{t('modal_82')}</span>
              </button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

const FlipContainer = ({
  data,
  setSettingState,
}: {
  data: FlipGameDetailDataType;
  setSettingState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.row}>
          <div className={styles.box}>
            <span>{t("modal_83")}</span>
            <span
              className={
                styles[`${data.result.input_number === 0 ? "head" : "tail"}`]
              }
            >
              {data.result.input_number === 0 ? "Head" : "Tail"}
            </span>
          </div>
          <div className={styles.box}>
            <span>{t("modal_84")}</span>
            <span
              className={
                styles[`${data.result.result_number === 0 ? "head" : "tail"}`]
              }
            >
              {data.result.result_number === 0 ? "Head" : "Tail"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_88")}</span>
            <span className={data.result.server_seed ? "" : styles.disabled}>
              {data.result.server_seed ?? t("modal_425")}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_89")}</span>
            <span className={styles.overflow}>
              {data.result.server_seed_hash}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_90")}</span>
            <span className={styles.overflow}>{data.result.client_seed}</span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_91")}</span>
            <span>{data.result.nonce}</span>
          </div>

          <div className={styles["verify-row"]}>
            {/* <div>
              <span>Game ID</span>
            </div> */}

            {!data.result.server_seed && (
              <button
                type="button"
                className={styles.setting}
                onClick={() => setSettingState(true)}
              >
                <span>{t("modal_92")}</span>
              </button>
            )}

            <a
              href={`https://codepen.io/dev-yummy/pen/vYPKyeZ?serverSeed=${data.result.server_seed}&clientSeed=${data.result.client_seed}&nonce=${data.result.nonce}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto" }}
              onClick={e => {
                if (!data.result.server_seed) {
                  e.preventDefault();
                  showToast(t("modal_92"));
                }
              }}
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const DiceContainer = ({
  data,
  setSettingState,
}: {
  data: DiceGameDetailDataType;
  setSettingState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.row}>
          <div className={styles.box}>
            <span>{t("modal_83")}</span>
            <span className={styles.opacity}>
              {data.result.direction === 0 ? "<" : ">"}
              {data.result.input_number}
            </span>
          </div>
          <div className={styles.box}>
            <span>{t("modal_84")}</span>
            <span
            // className={
            //   styles[`${data.result.input_number === 1 ? "head" : "tail"}`]
            // }
            >
              {data.result.result_number}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_88")}</span>
            <span className={data.result.server_seed ? "" : styles.disabled}>
              {data.result.server_seed ?? t("modal_425")}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_89")}</span>
            <span className={styles.overflow}>
              {data.result.server_seed_hash}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_90")}</span>
            <span className={styles.overflow}>{data.result.client_seed}</span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_91")}</span>
            <span>{data.result.nonce}</span>
          </div>

          <div className={styles["verify-row"]}>
            {!data.result.server_seed && (
              <button
                type="button"
                className={styles.setting}
                onClick={() => setSettingState(true)}
              >
                <span>{t("modal_92")}</span>
              </button>
            )}

            <a
              href={`https://codepen.io/dev-yummy/pen/JjzKbrX?serverSeed=${data.result.server_seed}&clientSeed=${data.result.client_seed}&nonce=${data.result.nonce}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto" }}
              onClick={e => {
                if (!data.result.server_seed) {
                  e.preventDefault();
                  showToast(t("modal_92"));
                }
              }}
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const UltimateDiceContainer = ({
  data,
  setSettingState,
}: {
  data: UltimateDiceGameDetailDataType;
  setSettingState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.row}>
          <div className={styles.box}>
            <span>{t("modal_83")}</span>
            <span className={styles.opacity}>
              {/* {data.result.direction === 0 ? "<" : ">"} */}
              {/* {data.result.input_number} */}
              {`${data.result.direction === 0 ? "≥" : "≤"}${
                data.result.input_start_number
              }, ${data.result.direction === 0 ? "≤" : "≥"}${
                data.result.input_end_number
              }`}
            </span>
          </div>
          <div className={styles.box}>
            <span>{t("modal_84")}</span>
            <span
            // className={
            //   styles[`${data.result.input_number === 1 ? "head" : "tail"}`]
            // }
            >
              {data.result.result_number}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_88")}</span>
            <span className={data.result.server_seed ? "" : styles.disabled}>
              {data.result.server_seed ?? t("modal_425")}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_89")}</span>
            <span className={styles.overflow}>
              {data.result.server_seed_hash}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_90")}</span>
            <span className={styles.overflow}>{data.result.client_seed}</span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_91")}</span>
            <span>{data.result.nonce}</span>
          </div>

          <div className={styles["verify-row"]}>
            {!data.result.server_seed && (
              <button
                type="button"
                className={styles.setting}
                onClick={() => setSettingState(true)}
              >
                <span>{t("modal_92")}</span>
              </button>
            )}

            <a
              href={`https://codepen.io/dev-yummy/pen/JjzKbrX?serverSeed=${data.result.server_seed}&clientSeed=${data.result.client_seed}&nonce=${data.result.nonce}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto" }}
              onClick={e => {
                if (!data.result.server_seed) {
                  e.preventDefault();
                  showToast(t("modal_92"));
                }
              }}
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const MineContainer = ({
  data,
  setSettingState,
}: {
  data: MineGameDetailDataType;
  setSettingState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.box}>
          <span>{t("modal_83")}</span>
          <span className={styles.opacity}>
            {data.result.select_list.map((j, i) => {
              return data.result.select_list.length === i + 1 ? (
                <React.Fragment key={i}>{j}</React.Fragment>
              ) : (
                <React.Fragment key={i}>{`${j}, `}</React.Fragment>
              );
            })}
          </span>
        </div>
        <div className={styles.box}>
          <div className={styles["result-row"]}>
            <span>{t("modal_94")}</span>
            <span>
              {data.result.result_list
                .slice(0, data.result.boom_count)
                .map((j, i) => {
                  return data.result.result_list.slice(
                    0,
                    data.result.boom_count,
                  ).length ===
                    i + 1 ? (
                    <React.Fragment key={i}>{j}</React.Fragment>
                  ) : (
                    <React.Fragment key={i}>{`${j}, `}</React.Fragment>
                  );
                })}
            </span>
          </div>
          <div className={styles["result-row"]}>
            <span>{t("modal_95")}</span>
            <span>
              {data.result.result_list
                .slice(data.result.boom_count)
                .map((j, i) => {
                  return data.result.result_list.slice(data.result.boom_count)
                    .length ===
                    i + 1 ? (
                    <React.Fragment key={i}>{j}</React.Fragment>
                  ) : (
                    <React.Fragment key={i}>{`${j}, `}</React.Fragment>
                  );
                })}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_88")}</span>
            <span className={data.result.server_seed ? "" : styles.disabled}>
              {data.result.server_seed ?? t("modal_425")}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_89")}</span>
            <span className={styles.overflow}>
              {data.result.server_seed_hash}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_90")}</span>
            <span className={styles.overflow}>{data.result.client_seed}</span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_91")}</span>
            <span>{data.result.nonce}</span>
          </div>

          <div className={styles["verify-row"]}>
            {!data.result.server_seed && (
              <button
                type="button"
                className={styles.setting}
                onClick={() => setSettingState(true)}
              >
                <span>{t("modal_92")}</span>
              </button>
            )}

            <a
              href={`https://codepen.io/dev-yummy/pen/BabzQdx?serverSeed=${data.result.server_seed}&clientSeed=${data.result.client_seed}&nonce=${data.result.nonce}&boomCount=${data.result.boom_count}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto" }}
              onClick={e => {
                if (!data.result.server_seed) {
                  e.preventDefault();
                  showToast(t("modal_92"));
                }
              }}
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
const ProviderContainer = ({ data }: { data: GameDetailDataType }) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PlinkoContainer = ({
  data,
  setSettingState,
}: {
  data: PlinkoGameDetailDataType;
  setSettingState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const t = useDictionary();

  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.row}>
          <div className={styles.box}>
            <span>{t("modal_420")}</span>
            <span style={{ textTransform: "capitalize" }}>
              {data.result.risk}
            </span>
          </div>
          <div className={styles.box}>
            <span>{t("modal_421")}</span>
            <span>{data.result.row_count}</span>
          </div>
          <div className={styles.box}>
            <span>{t("modal_422")}</span>
            <span
              className={
                Number(data.result.pay_out) >= 1
                  ? styles["payout-5"]
                  : styles["payout-3"]
              }
            >
              {Number(data.result.pay_out).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_88")}</span>
            <span className={data.result.server_seed ? "" : styles.disabled}>
              {data.result.server_seed ?? t("modal_425")}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_89")}</span>
            <span className={styles.overflow}>
              {data.result.server_seed_hash}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_90")}</span>
            <span className={styles.overflow}>{data.result.client_seed}</span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_91")}</span>
            <span>{data.result.nonce}</span>
          </div>

          <div className={styles["verify-row"]}>
            {/* <div>
              <span>Game ID</span>
            </div> */}

            {!data.result.server_seed && (
              <button
                type="button"
                className={styles.setting}
                onClick={() => setSettingState(true)}
              >
                <span>{t("modal_92")}</span>
              </button>
            )}

            <a
              href={`https://codepen.io/dev-yummy/pen/qBGVLjx?serverSeed=${data.result.server_seed}&clientSeed=${data.result.client_seed}&nonce=${data.result.nonce}&rowCount=${data.result.row_count}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto" }}
              onClick={e => {
                if (!data.result.server_seed) {
                  e.preventDefault();
                  showToast(t("modal_92"));
                }
              }}
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const LimboContainer = ({
  data,
  setSettingState,
}: {
  data: LimboGameDetailDataType;
  setSettingState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { amountToDisplayFormat, showToast } = useCommonHook();
  const t = useDictionary();
  return (
    <>
      <div className={styles["bet-result-box"]}>
        <p className={styles.title}>{t("modal_72")}</p>

        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_73")}</span>
            <div className={styles.amount}>
              <span>
                {amountToDisplayFormat(
                  data.result.bet_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_74")}</span>
            <div className={styles.amount}>
              <span>{data.result.pay_out}</span>
              <span className={`${styles.ico}`} style={{ height: "auto" }}>
                x
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <span>{t("modal_75")}</span>
            <div className={`${styles.amount}`}>
              <span
                className={`${
                  data.result.win_yn === "Y" ? styles.win : styles.lose
                }`}
              >
                {amountToDisplayFormat(
                  data.result.profit_amount,
                  data.result.bet_coin_type,
                )}
              </span>
              <span
                className={`${styles.ico}`}
                style={{
                  backgroundImage: `url('/images/tokens/img_token_${data.result.bet_coin_type.toLocaleLowerCase()}_circle.svg')`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["game-detail-box"]}>
        <p className={styles.title}>{t("modal_76")}</p>
        <div className={styles.row}>
          <div className={styles.box}>
            <span>{t("modal_83")}</span>
            <span
            // className={
            //   styles[`${data.result.result_number === 1 ? "head" : "tail"}`]
            // }
            >
              {data.result.input_number}
            </span>
          </div>
          <div className={styles.box}>
            <span>{t("modal_84")}</span>
            <span
              className={`${
                data.result.win_yn === "Y" ? styles.win : styles.lose
              }`}
            >
              {data.result.result_number}
            </span>
          </div>
        </div>
      </div>

      <div className={styles["fair-box"]}>
        <p className={styles.title}>{t("modal_78")}</p>
        <div className={styles.box}>
          <div className={styles.row}>
            <span>{t("modal_88")}</span>
            <span className={data.result.server_seed ? "" : styles.disabled}>
              {data.result.server_seed ?? t("modal_425")}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_89")}</span>
            <span className={styles.overflow}>
              {data.result.server_seed_hash}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_90")}</span>
            <span className={styles.overflow}>{data.result.client_seed}</span>
          </div>

          <div className={styles.row}>
            <span>{t("modal_91")}</span>
            <span>{data.result.nonce}</span>
          </div>

          <div className={styles["verify-row"]}>
            {/* <div>
              <span>Game ID</span>
            </div> */}

            {!data.result.server_seed && (
              <button
                type="button"
                className={styles.setting}
                onClick={() => setSettingState(true)}
              >
                <span>{t("modal_92")}</span>
              </button>
            )}

            <a
              href={`https://codepen.io/dev-yummy/pen/dyExMjW?serverSeed=${data.result.server_seed}&clientSeed=${data.result.client_seed}&nonce=${data.result.nonce}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "auto" }}
              onClick={e => {
                if (!data.result.server_seed) {
                  e.preventDefault();
                  showToast(t("modal_92"));
                }
              }}
            >
              <span>{t("modal_82")}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
