export enum UserKeys {
  COMMON = "getCommon",
  PROFILE = "getUserProfile",
  ACCOUNTSETTING = "getUserAccountSetting",
}

export enum FlipKeys {
  INFO = "getCoinFlipInfo",
}

export enum CommonGameKeys {
  MYHISTORY = "getGameHistoryMy",
  ALLHISTORY = "getGameHistoryAll",
  INFO = "getGameInfo",
  DETAIL = "getGameDetail",
  ISFAVORITE = "getGameInfoFavorite",
  SEED = "getGameSeed",
}

export enum CommonKeys {
  CRYPTOUSD = "getCryptUsd",
  ASSETREFER = "getAssetReference",
}
export enum MineKeys {
  ROUND = "getMineRound",
}

export enum WalletKeys {
  REFERENCE = "getWalletReference",
  TRANSACTIONS = "getWalletTransactions",
}

export enum MainKeys {
  TOPPROFIT = "getMainTopProfit",
  THIRDPARTY = "getMainThirdParty",
  BANNER = "getMainBanner",
}

export enum ChatKeys {
  CHAT = "getChat",
  NOTICE = "getNotice",
  DIRECTMASSAGE = "getDirectMessage",
}

export enum BonusKeys {
  STATISTICS = "getBonusStatistics",
  STATISTICSV2 = "getBonusStatisticsV2",
  HISTORY = "getBonusHistory",
  LEADERBOARD = "getBonusAirdropLeaderboard",
  DEPOSITREFER = "getBonusDepositRefer",
  COUNT = "getBonusClaimCount",
  AFFILIATE = "getAffiliateClaim",
}

export enum AffiliateKeys {
  STATISTICS = "getAffiliateStatistics",
  MEMBER = "getAffiliateMember",
}

export enum ProviderKeys {
  THIRDPARTY = "postProviderList",
  DETAIL = "getThirdPartyDetail",
  MY = "getThirdPartyMy",
  COUNT = "getThirdPartyCount",
  PROVIDERS = "getProviders",
}

export enum BookmarksKeys {
  FAVORITES = "getFavorites",
}

export enum PaymentKeys {
  CURRENCIES = "getCurrencies",
}

export enum TwoFactorKeys {
  AUTH = "getTwoFactorAuth",
}
