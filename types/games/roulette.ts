export type RouletteBetType =
  | "straight"
  | "split"
  | "street"
  | "square"
  | "doubleStreet"
  | "column1"
  | "column2"
  | "column3"
  | "dozen1"
  | "dozen2"
  | "dozen3"
  | "low"
  | "high"
  | "odd"
  | "even"
  | "black"
  | "red";

export interface ArrayObject {
  type: RouletteBetType;
  chipAmount: string;
  selectList?: number[];
}

export interface ResultArrayObject {
  type: RouletteBetType;
  betAmount: string;
  selectList?: number[];
}

export interface RouletteGameDetailDataType {
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
    input: {
      type: string;
      betAmount: string;
      selectList?: number[];
    }[];
    win_yn: "N" | "Y";
    pay_out: string;
    server_seed_aes: null | string;
    server_seed_hash: string;
    server_iv: null | string;
    client_seed: string;
    nonce: number;
    create_date: string;
    server_seed: string;
  };
}
