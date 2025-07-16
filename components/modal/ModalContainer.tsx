"use client";

// import { useModalStore } from "@/stores/useModal";
import useModalHook from "@/hooks/useModalHook";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import AboutToken from "./components/AboutToken";
import AccountSetting from "./components/AccountSetting";
import Alert from "./components/Alert";
import AutoBet from "./components/AutoBet";
import BetID from "./components/BetID";
import BonusHistory from "./components/BonusHistory";
import ClaimBonus from "./components/ClaimBonus";
import Fairness from "./components/Fairness";
import GameID from "./components/GameID";
import GetStarted from "./components/GetStarted";
import HalfCashOut from "./components/HalfCashOut";
import IsBlock from "./components/IsBlock";
import Jackpot from "./components/Jackpot";
import Partner from "./components/Partner";
import Profile from "./components/Profile";
import Rule from "./components/Rule";
import SelfExclusion from "./components/SelfExclusion";
import Setting from "./components/Setting";
import Transactions from "./components/Transactions";
import Wallet from "./components/Wallet";
import WithdrawAccount from "./components/WithdrawAccount";
import styles from "./styles/modalcontainer.module.scss";
import EnableTwoFactor from "./components/EnableTwoFactor";
import DisableTwoFactor from "./components/DisableTwoFactor";
import DepositBonus from "./components/DepositBonus";
import DepositBonusPromotion from "./components/DepositBonusPromotion";
import Redeem from "@/components/modal/components/Redeem";
import { useKeyPressEvent } from "react-use";
import YummyToken from "@/components/modal/components/YummyToken";
import Sports from "@/components/modal/components/Sports";
import { motion, AnimatePresence } from "framer-motion";
import HonDropEvent from "./components/HonDropEvent";
import DirectMassage from "./components/DirectMassage";
import Spin from "@/components/modal/components/Spin";
import Trend from "@/components/modal/components/Trend";
import Vip from "@/components/modal/components/Vip";
import SpecialDepositBonus from "@/components/modal/components/SpecialDepositBonus";
import Snowfall from "react-snowfall";
import ForgetAccount from "@/components/modal/components/ForgetAccount";
import ResetPassword from "@/components/modal/components/ResetPassword";
import BonusUsagePolicy from "@/components/modal/components/BonusUsagePolicy";

const ModalComponent = ({ type }: { type: string }) => {
  switch (type) {
    case "alert":
      return <Alert />;
    case "gameID":
      return <GameID />;
    case "betID":
      return <BetID />;
    case "getstarted":
      return <GetStarted />;
    case "wallet":
      return <Wallet />;
    case "profile":
      return <Profile />;
    case "setting":
      return <Setting />;
    case "bonusHistory":
      return <BonusHistory />;
    case "claimBonus":
      return <ClaimBonus />;
    case "accountSetting":
      return <AccountSetting />;
    case "exclusion":
      return <SelfExclusion />;
    case "withdrawAccount":
      return <WithdrawAccount />;
    case "partner":
      return <Partner />;
    case "transactions":
      return <Transactions />;
    case "fairness":
      return <Fairness />;
    case "rules":
      return <Rule />;
    case "autobet":
      return <AutoBet />;
    case "halfCashOut":
      return <HalfCashOut />;
    case "jackpot":
      return <Jackpot />;
    case "aboutToken":
      return <AboutToken />;
    case "isBlock":
      return <IsBlock />;
    case "enableTwoFactor":
      return <EnableTwoFactor />;
    case "disableTwoFactor":
      return <DisableTwoFactor />;
    case "depositBonus":
      return <DepositBonus />;
    case "depositBonusPromotion":
      return <DepositBonusPromotion />;
    case "redeem":
      return <Redeem />;
    case "token":
      return <YummyToken />;
    case "sports":
      return <Sports />;
    case "honDropEvent":
      return <HonDropEvent />;
    case "directMassage":
      return <DirectMassage />;
    case "spin":
      return <Spin />;
    case "trend":
      return <Trend />;
    case "vip":
      return <Vip />;
    case "specialDepositBonus":
      return <SpecialDepositBonus />;
    case "bonusUsagePolicy":
      return <BonusUsagePolicy />;
    case "forgetAccount":
      return <ForgetAccount />;
    case "resetPassword":
      return <ResetPassword />;
    default:
      break;
  }

  return <></>;
};

export default function ModalContainer({ isBlock }: { isBlock: boolean }) {
  const { isOpen, openModal, closeModal, type, backBtn, beforeType } =
    useModalHook();

  const searchParams = useSearchParams();

  const param = searchParams.get("modal");

  useKeyPressEvent("Escape", () => {
    closeModal();
  });

  useEffect(() => {
    if (isBlock && !param) {
      openModal({
        type: "isBlock",
      });
    } else if (param) {
      openModal({
        type: param,
        backBtn,
      });
    } else {
      closeModal();
    }
  }, [param, isBlock]);

  if (!isOpen || !type) return <></>;

  return (
    <AnimatePresence>
      <div className={styles.wrapper}>
        <motion.div
          className={classNames(
            styles["modal-content"],
            //   , {
            //   [styles.full]: type === "spin",
            // }
          )}
          initial={{
            opacity: 0,
            scale: 0.75,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              ease: "easeOut",
              duration: 0.15,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.75,
            transition: {
              ease: "easeIn",
              duration: 0.15,
            },
          }}
        >
          {backBtn && (
            <button
              type="button"
              className={styles["back-btn"]}
              onClick={() => {
                closeModal();
                openModal({
                  type: beforeType,
                });
              }}
            ></button>
          )}
          <button
            type="button"
            className={`${styles["close-btn"]} ${backBtn ? styles.right : ""}`}
            onClick={() => closeModal()}
          ></button>
          <ModalComponent type={type || ""} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
