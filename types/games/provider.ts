export interface ProviderGameDetailDataType {
  code: number;
  message: string;
  result: {
    idx: number;
    user_idx: number | null;
    nickname: string | null;
    avatar_idx: number | null;
    bet_coin_type: string;
    bet_amount: string;
    bet_dollar: string;
    profit_amount: string;
    profit_dollar: string;
    win_yn: "Y" | "N";
    pay_out: string;
    server_seed_aes: null | string;
    server_seed_hash: string;
    server_iv: null | string;
    client_seed: string;
    nonce: number;
    create_date: string;
    server_seed: string | null;
    is_playing: number;
    result_list: number[];
    select_list: number[];
    boom_count: number;
  };
}
