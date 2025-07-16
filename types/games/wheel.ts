export interface IWheel {
  /**
   * idx
   */
  idx?: number;
  /**
   * 회차
   */
  round: number;
  /**
   * 랜던값
   */
  game_result?: string;
  /**
   * 결과 배달유당
   */
  success_multiply?: number;
  /**
   * 서버 시드값
   */
  server_seed?: string;
  /**
   * create_date
   */
  create_date?: Date;

  start_timestamp?: number;
}

export interface IWheelHistory {
  /**
   * idx
   */
  idx: number;
  /**
   * 회원 pk
   */
  user_idx: number;
  /**
   * 게임 pk
   */
  round: number;
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
  bet_multiply: string;
  /**
   * 보상 금액
   */
  earn_amount?: string;
  /**
   * earn_dollar
   */
  earn_dollar?: string;
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
}

export type WheelStatusType =
  | "Bet"
  | "StopBet"
  | "Idle"
  | "Create"
  | "BetStop"
  | null;

export interface BetInfo {
  userIdx: number;
  nickName: string;
  avatarIdx: number;
  betAmount: string;
  betDollar: string;
  betType: string;
  betMultiply: number;
  earnAmount?: string;
  earnDollar?: string;
  ownData?: number;
}

export interface BetResult {
  userIdx: number;
  winYn: "Y" | "N";
  profit: string;
  multiply: string;
  jackpotJel?: string;
  betCoinType: string;
  profitDollar: string;
}

export interface WheelGameDetailDataType {
  code: number;
  message: string;
  result: {
    idx: number;
    game_result: string;
    round: number;
    server_seed: string;
    success_multiply: 2 | 5 | 3 | 50;
    user_idx: number | null;
    avatar_idx: number | null;
    nickname: string | null;
    bet_coin_type: string;
    bet_multiply: "2" | "5" | "3" | "50";
    bet_amount: string;
    bet_dollar: string;
    win_yn: "N" | "Y";
    create_date: string;
    profit: string;
    profit_dollar: string;
  };
}
