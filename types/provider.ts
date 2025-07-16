export type gameNameType =
  | "crash"
  | "wheel"
  | "roulette"
  | "flip"
  | "dice"
  | "ultimatedice"
  | "mine"
  | "bonus"
  | "affiliate"
  | "fair"
  | "support"
  | "language"
  | "displayFiat"
  | "newReleases"
  | "hotgames"
  | "slots"
  | "livecasino"
  | "providerroulette"
  | "original"
  | "lottery"
  | "poker"
  | "card"
  | "sports"
  | "provider";

export type categoryType =
  | "0"
  | "1"
  | "slots"
  | "card"
  | "roulette"
  | "poker"
  | "live"
  | "hot"
  | "live_lottery"
  | "sports"
  | "lottery"
  | "provider"
  | "yummygame";

export type categoryGameType =
  | "original"
  | "yummygame"
  | "slots"
  | "hotgames"
  | "poker"
  | "card"
  | "providerroulette"
  | "livecasino"
  | "lottery";

export interface ThirdPartyParamsType {
  categoryCode: categoryType[];
  providerCodeList: string[];
  sortDirect?: "desc" | "asc";
  sortType?: string;
  // 정렬 타입(default=popular)(not required)('popular', 'gameName'만 허용)
  limit?: string;
  page?: string;
}

export interface ThirdPartyGameType {
  system: string | null; // provider code
  sub_system: null | string; // provider sub code
  page_code: string | null; // 화면을 띄우기 위한 page code
  game_id: string; // 해당 게임의 고유값(/my 리스트 호출시 gameCode로 사용됨)
  mobile_page_code: string | null; // 모바일용 page code
  rtp: string; // RTP
  game_name: string; // 게임 이름
  image_full_path: string | null; // 게임 썸네일 이미지
  status: string; // 상태
  game_status: string; // 상태
  has_demo: string | null; // 데모게임 보유 여부
  provider_name: string; // 프로바이더 업체 이름
  game_type: string;
  bright_color_code?: string;
  dark_color_code?: string;
  image_change_path: string | null;
}

export interface SportsLinkType {
  href: string;
  name: string;
}

export interface ThirdPartyDataType {
  code: number;
  message: string;
  result: {
    game_list: ThirdPartyGameType[];
    provider_list: {
      systemId: string; // 해당 값이 providerCode로 쓰임
      merchantName: string; // 프로바이더 이름
      count: number; // 해당 프로바이더가 가지고 있는 게임 수
    }[];
  };
  pagination: {
    page: number;
    limit: number;
    offset: number;
    totalPage: number;
    totalCount: number;
  };
}

export interface ThirdPartySearchDataType {
  code: number;
  message: string;
  result: {
    system: string;
    sub_system: null | string;
    page_code: string;
    game_id: string;
    mobile_page_code: string;
    rtp: string;
    game_name: string;
    image_full_path: string;
    status: string;
    game_status: string;
    has_demo: string;
    provider_name: string;
  }[];
}

export interface ThirdPartyDetailData {
  code: number;
  message: string;
  result: {
    idx: number;
    system: string;
    sub_system: null | string;
    page_code: string;
    game_id: string;
    mobile_page_code: string;
    rtp: string;
    game_name: string;
    image_full_path: string;
    status: string;
    game_status: string;
    has_demo: string;
    provider_name: string;
    description: null | string;
    categories: string[];
    aspect_ratio?: string;
    image_change_path: string | null;
    limit_info: {
      bnb_max: string;
      bnb_min: string;
      btc_max: string;
      btc_min: string;
      eth_max: string;
      eth_min: string;
      hon_max: string;
      hon_min: string;
      jel_max: string;
      jel_min: string;
      xrp_max: string;
      xrp_min: string;
      usdc_max: string;
      usdc_min: string;
      usdt_max: string;
      usdt_min: string;
      max_profit: string;
      max_profit_fiat: {
        usd: string;
        eur: string;
        jpy: string;
        gbp: string;
        aud: string;
        cad: string;
        cny: string;
        krw: string;
      };
    };
  };
}

export interface ThirdPartyMyData {
  code: number;
  message: string;
  result: {
    idx: number;
    user_idx: null | string;
    nickname: null | string;
    avatar_idx: null | string;
    pay_out: string;
    bet_coin_type: string;
    bet_amount: string;
    bet_dollar: string;
    win_yn: string;
    create_date: string;
    profit_amount: string;
    profit_dollar: string;
    game_idx: string;
  }[];
}

export interface ThirdPartyCountData {
  code: 0;
  message: string;
  result: { [key: string]: number };
}

export interface ProviderData {
  code: 0;
  message: string;
  result: {
    idx: number;
    provider_name: string;
    provider_real_name: string | null;
    img_url: string;
  }[];
}
