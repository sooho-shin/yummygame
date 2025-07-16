import { useGetBonusClaimCount } from "@/querys/bonus";

export interface BonusClaimCountData {
  code: number;
  message: string;
  result: number;
}

export interface AffiliateClaimData {
  code: number;
  message: string;
  result: {
    jel: string;
  };
}

export interface BonusStatisticsDataVer2Type {
  code: number;
  message: string;
  result: {
    total_bonus_received: string;
    total_general_rewards: string;
    total_vip_rewards: string;
    total_special_rewards: string;
    deposit_bonus:
      | Record<string, never>
      | {
          max_bet_ratio: number;
          bonus_multiply: number;
          max_bet_dollar: string;
          max_deposit_dollar: string;
          min_deposit_dollar: string;
          roll_over_multiply: number;
          up_to_dollar: string;
          max_bet_percent: number;
          deposit_bonus_type: 0 | 1 | 2 | 3;
          general_deposit_round: 0 | 1 | 2 | 3 | 4;
          end_date?: string;
          is_processing_deposit_bonus?: boolean;
          deposit_bonus_info?: {
            max_bet_ratio: number;
            bonus_multiply: number;
            max_deposit_dollar: string;
            min_deposit_dollar: string;
            roll_over_multiply: number;
          }[];
        };
    general_rewards: {
      jel_rakeback: {
        jel: string;
        available_claim: boolean;
      };
      // lucky_spin: {
      //   vip_spin: {
      //     reach_vip_level: 0;
      //     daily_spin: {
      //       current_value: string;
      //       goal_value: string;
      //     };
      //   };
      //   daily_spin: {};
      //   available_spin: boolean;
      // };
    };
    vip_rewards: {
      level_up_rewards: {
        next_vip_level: number;
        current_value: string;
        jel: string;
        goal_value: string;
        available_claim: boolean;
        count: number;
      };
      tier_up_rewards: {
        next_vip_tier: string;
        current_value: string;
        jel: string;
        goal_value: string;
        available_claim: boolean;
        count: number;
      };
      weekly_cashback: {
        available: boolean;
        jel: string;
        wager: string;
        end_time: string;
        available_claim: boolean;
        count: number;
      };
      monthly_cashback: {
        available: boolean;
        jel: string;
        wager: string;
        end_time: string;
        available_claim: boolean;
        count: number;
      };
    };
    special_rewards: {
      SP_EVT_CASHBACK_ALL?: {
        data: {
          times: string;
        };
        view_end_date: string;
        view_start_date: string;
        active_end_date: string;
        active_start_date: string;
      };
      SP_EVT_WEEKLY_PAYBACK?: {
        data: {
          minimum: string;
          payback: string;
          maxPayback: string;
        };
        view_end_date: string;
        view_start_date: string;
        active_end_date: string;
        active_start_date: string;
        jel: string;
        end_time: string;
        count: number;
        available_claim: false;
      };
      SP_EVT_FIRST_DEPOSIT?: {
        data: {
          bonus: string;
        };
        view_end_date: string;
        view_start_date: string;
        active_end_date: string;
        active_start_date: string;
      };
      SP_EVT_DEPOSIT_BONUS?: {
        data: {
          bonus: string;
          rolling: string;
        };
        view_end_date: string;
        view_start_date: string;
        active_end_date: string;
        active_start_date: string;
      };
      SP_EVT_NONE_DEPOSIT?: {
        data: {
          bonus: string;
        };
        view_end_date: string;
        view_start_date: string;
        active_end_date: string;
        active_start_date: string;
      };
      SP_EVT_LUCKY_POUCH?: {
        data: object;
        view_end_date: string;
        view_start_date: string;
        active_end_date: string;
        active_start_date: string;
        available_claim: boolean;
        available_deposit: boolean;
        count: number;
        end_date?: string;
      };
    };
  };
}

export interface BonusStatisticsDataType {
  code: number;
  message: string;
  result: {
    vip_bonus: string;
    claimed: string;
    general_bonus: string;
    jackpot_bonus: string;
    affiliate_bonus_total: string;
    wager_tier1: string;
    wager_tier2: string;
    claimable_jel: string;
    lock_jel: string;
    deposit_bonus_status: number;
    deposit_bonus_data: {
      is_partner_code: boolean;
      default_data:
        | {
            reset_bonus: number;
            max_bet_ratio: number;
            bonus_multiply: number;
            max_deposit_dollar: string;
            min_deposit_dollar: string;
            roll_over_multiply: number;
            up_to_dollar: number;
            max_bet_percent: number | null;
            max_bet_dollar: string;
          }
        | Record<string, never>;
      fiat_to_crypto: {
        btc: {
          max: string;
          min: string;
        };
        eth: {
          max: string;
          min: string;
        };
        bnb: {
          max: string;
          min: string;
        };
        xrp: {
          max: string;
          min: string;
        };
        usdt: {
          max: string;
          min: string;
        };
        usdc: {
          max: string;
          min: string;
        };
        trx: {
          max: string;
          min: string;
        };
        sol: {
          max: string;
          min: string;
        };
      };
      reset_bonus: 4;
    };
  };
}

export interface BonusHistoryDataType {
  code: number;
  message: string;
  result: {
    idx: number;
    asset_type_code: "JEL";
    change_value: string;
    change_code: string;
    create_date: string;
  }[];
  pagination: {
    page: number;
    limit: number;
    offset: number;
    totalPage: number;
    totalCount: number;
  };
}

export interface AirdropLeaderboardDataType {
  code: number;
  message: string;
  result: {
    personal_quest_board_data: {
      total_point: string;
      game_betting_point: number;
      deposit_point: number;
      random_point: number;
      referral_point: number;
      race_point: number;
      weekly_count: number;
      daily_count: number;
      forum_count: number;
      social_count: number;
      random_point_percent: number;
      referral_signup_point: number;

      hon_game_betting_point: number;
      big_win: number;
      kyc_count: 1 | 0;
    };
    airdrop_leaderboard: {
      ranking: number;
      email: string;
      point: string;
      daily_point: string;
      weekly_point: string;
    }[];
    airdrop_leaderboard_personal_ranking: {
      ranking: number | null;
      email: string;
      point: string;
      daily_point: string;
      weekly_point: string;
      hon_ranking: number | undefined;
      hon_amount: number | undefined;
    };
    weekly_race_leaderboard:
      | {
          ranking: number;
          weekly_point: string;
          email: string;
          wager: string;
        }[]
      | null;
    hon_leaderboard:
      | {
          ranking: number;
          email: string;
          hon: string;
        }[]
      | null;
  };
}

export interface DepositReferDataType {
  code: number;
  message: string;
  result: {
    deposit_bonus_data: {
      max_bet_ratio: number;
      bonus_multiply: number;
      max_bet_dollar: string;
      max_deposit_dollar: string;
      min_deposit_dollar: string;
      roll_over_multiply: number;
      up_to_dollar: string;
      max_bet_percent: number;
    };
  };
}
