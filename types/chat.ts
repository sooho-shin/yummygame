import { useGetDirectMessage } from "@/querys/chat";

export interface ChatParamType {
  messageType: "GENERAL" | "BET_INFO";
  betId?: number;
  betGameType?:
    | "CRASH"
    | "MINES"
    | "ROULETTE"
    | "CLASSIC_DICE"
    | "ULTIMATE_DICE"
    | "COIN_FLIP"
    | "WHEEL";

  message?: string;
}

export interface ChatData {
  idx: number | null;
  user_idx: number | null;
  nickname: string | null;
  avatar_idx: number;
  message_type: "GENERAL" | "BET_INFO";
  message: string;
  bet_info:
    | number
    | null
    | {
        bet_id: 1;
        win_yn: "Y" | "N";
        game_id: string;
        pay_out: string;
        game_name: string;
        game_type: "original" | "provider";
        game_image_url: string;
        page_code: string;
        system_code: string;
        bet_coin_type: string;
        profit_amount: string;
        profit_amount_usd: string;
      }[];
  create_date: string;
}

export interface ChatDataListType {
  code: number;
  message: string;
  result: ChatData[] | null;
}
export interface NoticeData {
  idx: number;
  title: string;
  content: null | string;
  image_url: null | string;
  link: string | null;
  create_date: string;
}

export interface NoticeDataListType {
  code: number;
  message: string;
  result: NoticeData[] | null;
}

export interface DirectMessageType {
  code: number;
  message: string;
  result:
    | {
        idx: number;
        to_user_idx: number;
        read_yn: string;
        title: string;
        content: string;
        create_date: string;
        date_string: string;
      }[]
    | null;
}
