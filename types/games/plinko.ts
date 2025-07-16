export interface PlinkoGameDetailDataType {
  code: number;
  message: string;
  result: {
    idx: number;
    user_idx: number;
    nickname: string;
    avatar_idx: number;
    bet_coin_type: string;
    bet_amount: string;
    bet_dollar: string;
    profit_amount: string;
    profit_dollar: string;
    result_number: number;
    risk: string;
    row_count: number;
    win_yn: string;
    pay_out: string;
    server_seed_aes: string | null;
    server_seed_hash: string;
    server_iv: string | null;
    client_seed: string;
    nonce: number;
    create_date: string;
    game_idx: string;
    server_seed: string | null;
  };
}
