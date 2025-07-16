export interface WalletTransactionsParamsType {
  type: string;
  asset?: string | null;
  limit?: string;
  page?: string | null;
}

export interface WalletReferenceDataType {
  [key: string]: {
    withdrawalMinValue: string;
    withdrawalFee: { [key: string]: number };
    isWithdrawalPossible: boolean;
    isExceededWithdrawalCount: boolean;
    wagerProgress: string;
    swapMinValue: string;
    swapBetweenJelFeePercent: string;
    jelToThisExchangeRate: string;
    toJelExchangeRate: string;
    withdrawalMonthlyCount?: number | null;
    withdrawalWeeklyCount?: number | null;
    depositWalletAddress:
      | {
          address: string | null;
          networkName: string;
          displayName: string;
          chainId?: string;
          tag?: number;
        }[]
      | null;
    depositBonusData: {
      default_data: {
        bonus_multiply?: number;
        max_deposit_dollar?: string;
        min_deposit_dollar?: string;
        roll_over_multiply?: number;
      };
      fiat_to_crypto: {
        max: string;
        min: string;
      };
    };
  };
}

export interface WalletTransactionsDataType {
  code: number;
  message: string;
  result: {
    idx: number;
    user_idx: number;
    asset_type_code: string;
    amount: string;
    txid: string;
    status_code: string;
    create_date: string;
    game_idx: number;
    game_type: string;
    bet_coin_type: string;
    bet_amount: string;
    win_yn: "N" | "Y";
    latest_earn_amount: string;
    latest_earn_dollar: string;
    profit_amount: string;
    profit_dollar: string;
    deposit_amount: string;
    from_amount: string;
    from_coin_type: string;
    to_amount: string;
    to_coin_type: string;
    change_value: string;
  }[];

  pagination: {
    page: number;
    limit: number;
    offset: number;
    totalPage: number;
    totalCount: number;
  };
}
