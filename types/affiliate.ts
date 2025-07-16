export interface AffiliateStatisticsDataType {
  code: number;
  message: string;
  result: {
    wager_tier1: string;
    wager_tier2: string;
    total_wager: string;
    affiliate_bonus_tier1: string;
    affiliate_bonus_tier2: string;
    total_affiliate_bonus: string;
    affiliate_code: string;
    tier1_count: number;
    tier2_count: number;
    claimable_jel: string;
  };
}

export interface AffiliateMemberDataType {
  code: number;
  message: string;
  result: {
    idx: number;
    user_idx: number;
    nickname: string;
    avatar_idx: number;
    tier: "1" | "2";
    total_wager: null | string;
    last_sign_in_date: string;
    total_bonus: string;
    is_hidden: 0 | 1;
  }[];

  pagination: {
    page: number;
    limit: number;
    offset: number;
    totalPage: number;
    totalCount: number;
  };
}
