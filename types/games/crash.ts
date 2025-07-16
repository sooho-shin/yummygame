export interface BetInfo {
  userIdx: number;
  nickName: string;
  avatarIdx: number;
  betAmount: string;
  betDollar: string;
  betType: string;
  cashOutMultiply50?: string;
  cashOutMultiply100?: string;
  autoCashOut?: string;
  earnAmount50?: string;
  earnAmount100?: string;
  earnDollar50?: string;
  earnDollar100?: string;
  enableTwice: number;
  gameLogIdx?: number;
}

export type CrashGameStatusType =
  | "Idle"
  | "Create"
  | "BetReady"
  | "Bet"
  | "BetStop"
  | "Play"
  | "PlayEnd";
/**
 * crash_history
 */
export interface ICrashHistory {
  /**
   * idx
   */
  idx: number;
  /**
   * 회원 pk
   */
  user_idx: number;
  /**
   * crash 게임 pk
   */
  crash_round: number;
  /**
   * 베팅 코인 타입(ex bnb, fdt ..)
   */
  bet_coin_type: string;
  /**
   * 베팅 금액
   */
  bet_amount: string;
  /**
   * avatar_idx
   */
  avatar_idx?: number;
  /**
   * nickname
   */
  nickname?: string;
  /**
   * bet_dollar
   */
  bet_dollar?: string;
  /**
   * bet_multiply
   */
  cashout_multiply_50?: string;
  cashout_multiply_100?: string;
  /**
   * 보상 금액
   */
  earn_amount_50?: string;
  earn_amount_100?: string;
  /**
   * earn_dollar
   */
  earn_dollar_50?: string;
  earn_dollar_100?: string;
  /**
   * 승패 구분값
   */
  win_yn?: string;
  /**
   * cashout_date
   */
  cashout_date?: Date;
  /**
   * 생성일자
   */
  create_date?: Date;
  /**
   * crash_historycol
   */
  crash_historycol?: string;

  is_hidden?: number;
}
/**
 * crash
 */
export interface ICrash {
  /**
   * idx
   */
  idx: number;
  /**
   * 회차
   */
  round: number;
  /**
   * 시작 시간
   */
  start_date?: string;
  /**
   * 종료 시간
   */
  end_date?: string;
  /**
   * 결과 배당율
   */
  game_result: string;
  /**
   * 서버 시드값
   */
  server_seed?: string;
  /**
   * 서버 시드 해쉬값
   */
  server_seed_hash?: string;
  /**
   * 참여 플레이어 총 합계
   */
  join_player_count?: number;
  /**
   * 승리 플레이어 총 합계
   */
  win_player_count?: number;
  /**
   * 총 베팅 금액 달러
   */
  total_bet_amt_usd?: string;
  /**
   * total_cashout_amt_usd
   */
  total_cashout_amt_usd?: string;
  /**
   * create_date
   */
  create_date?: Date;
}

export interface CrashGameDetailDataType {
  code: number;
  message: string;
  result: {
    idx: number;
    user_idx: number;
    bet_coin_type: string;
    bet_amount: string;
    avatar_idx: number;
    nickname: string;
    bet_dollar: string;
    win_yn: "Y" | "N";
    create_date: string;
    round: number;
    server_seed: string;
    game_result: string;
    bet_result_list:
      | {
          bet_amount: string;
          bet_dollar: string;
          pay_out: string;
          profit: string;
          profit_dollar: string;
          win_yn: "Y" | "N";
        }[]
      | [];
  };
}
