// bnb_max: string;
// bnb_min: string;
// btc_max: string;
// btc_min: string;
// eth_max: string;
// eth_min: string;
// hon_max: string;
// hon_min: string;
// jel_max: string;
// jel_min: string;
// xrp_max: string;
// xrp_min: string;
// usdt_max: string;
// usdt_min: string;
// usdc_max: string;
// usdc_min: string;
// trx_max: string;
// trx_min: string;
// sol_max: string;
// sol_min: string;
// max_profit: string;
// max_profit_fiat: {
//   usd: string;
//   eur: string;
//   jpy: string;
//   gbp: string;
//   aud: string;
//   cad: string;
//   cny: string;
//   krw: string;
// };

export interface BetLimitDataType {
  [key: string]: string;
}

export type GameType =
  | "all_game"
  | "crash"
  | "wheel"
  | "classic_dice"
  | "roulette"
  | "ultimate_dice"
  | "mines"
  | "coin_flip"
  | "provider"
  | "plinko"
  | "limbo";

export interface GameMasterDataType {
  code: number;
  message: string;
  result: {
    master_data: {
      round: number;
      create_date: string;
    };
    history:
      | {
          idx: number;
          user_idx: number | null;
          bet_coin_type: string;
          avatar_idx: number | null;
          nickname: string | null;
          pay_out: string;
          profit: string;
          profit_dollar: string;
          win_yn: "Y" | "N";
        }[]
      | [];
  };
}

export interface GameDetailDataType {
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
    game_idx: string;

    // Crash
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

    // Wheel
    bet_multiply: "2" | "3" | "5" | "50";
    profit: string;
    profit_dollar: string;
    success_multiply: 2 | 3 | 5 | 50;

    // Roulette
    profit_amount: string;
    result_number: number;
    input: {
      type: string;
      betAmount: string;
      selectList?: number[];
    }[];
    pay_out: string;
    server_seed_aes: null | string;
    server_seed_hash: string;
    server_iv: null | string;
    client_seed: string;
    nonce: number;

    // Flip
    input_number: number;
    expect_pay_out: string;

    // Dice
    direction: number;

    // Ultimate Dice
    input_start_number: number;
    input_end_number: number;

    //mine
    is_playing: number;
    result_list: number[];
    select_list: number[];
    boom_count: number;

    //Plinko
    risk: string;
    row_count: number;
  };
}

export interface GetInfoFavoriteDataType {
  code: number;
  message: string;
  result: {
    is_favorite: boolean;
  };
}
