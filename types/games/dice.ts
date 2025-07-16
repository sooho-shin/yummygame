export interface DiceGameDetailDataType {
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
    result_number: number;
    input_number: number;
    direction: number;
    win_yn: "Y" | "N";
    expect_pay_out: string;
    pay_out: string;
    server_seed_aes: null | string;
    server_seed_hash: string;
    server_iv: null | string;
    client_seed: string;
    nonce: number;
    create_date: string;
    server_seed: string | null;
  };
}
