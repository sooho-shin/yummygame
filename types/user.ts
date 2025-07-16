import { UserCryptoInfo } from "./asset";
import { GameType } from "./games/common";

export interface userCommonGnbDataType {
  isExistChat: boolean;
  isExistNotification: boolean;
  isDoneFreeSpin: boolean;
  isExistRakeBackOverFiveDollar: boolean;
  personalNotiTopicName: string;
  isReceiveDepositBonus: boolean;
  userType: "USER_000K" | "USER_NORMAL";
  isExistDirectMessage: boolean;
  depositBonusData: {
    totalBonusAmount: string;
    assetType: string;
    wagerMultiply: string;
  };
  userInfo: {
    avatarIdx: number;
    nickname: string;
    currentVipLevel: number;
    nextVipLevel: number;
    currentExperience: number;
    currentVipGroup: string;
    currentUserWager: string;
    nextVipWager: string;
    needLevelUpWager: string;
    isPartner?: boolean | null;
  };
  userCryptoInfo: UserCryptoInfo;
  cryptoToFiat: {
    eth: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
    bnb: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
    btc: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
    xrp: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
    jel: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
    usdt: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
    usdc: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
    hon: {
      usd: string;
      eur: string;
      jpy: string;
      gbp: string;
      aud: string;
      cad: string;
      cny: string;
      krw: string;
    };
  };
  settingInfo: null;
}

export interface userUserProfileType {
  code: number;
  message: string;
  result: {
    idx: number;
    avatar_idx: number;
    vip_level: number;
    platform_type: string;
    email: string;
    nickname: string;
    create_date: string;
    is_hidden: number;
    vip_category: string;
    platform_uid: string;
    statics: {
      summary: {
        total_bets: number;
        total_wins: number;
        total_wagered: string;
      };
      top_played_game: {
        [key: string]: string;
      };
      statics_detail: {
        [key: string]: {
          btc?: {
            wager: string;
            bet_count: number;
            win_count: number;
          };
          eth?: {
            wager: string;
            bet_count: number;
            win_count: number;
          };
          bnb?: {
            wager: string;
            bet_count: number;
            win_count: number;
          };
          usdt?: {
            wager: string;
            bet_count: number;
            win_count: number;
          };
          usdc?: {
            wager: string;
            bet_count: number;
            win_count: number;
          };
          xrp?: {
            wager: string;
            bet_count: number;
            win_count: number;
          };
          jel?: {
            wager: string;
            bet_count: number;
            win_count: number;
          };
          wager?: string;
          bet_count?: number;
          win_count?: number;
        };
      };
    };
  };
}

export interface UserAccountSettingDataType {
  code: number;
  message: string;
  result: {
    is_hidden: number;
    kyc_level: number;
    is_processing: number;
    is_two_factor_enable: number;
  };
}

export interface UserAccountSettingKYC1Type {
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  occupation: string | null;
  proofOfIdentityFront: File | null;
  proofOfIdentityBack: File | null;
  phoneNumber: string | null;
  socialMediaType: string | null;
  socialMediaId: string | null;
}

export interface UserAccountSettingKYC2Type {
  proofOfAddress: File | null;
}

export interface UserAccountSettingKYC3Type {
  sourceOfFunds: File | null;
}
