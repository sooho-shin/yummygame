export interface MainTopProfitDataType {
  code: number;
  message: string;
  result: {
    mines: {
      user_idx: number | null;
      nickname: string | null;
      avatar_idx: number | null;
      max_dollar: string | null;
      max_amount: string | null;
      bet_coin_type: string | null;
    };
    coin_flip: {
      user_idx: number | null;
      nickname: string | null;
      avatar_idx: number | null;
      max_dollar: string | null;
      max_amount: string | null;
      bet_coin_type: string | null;
    };
    classic_dice: {
      user_idx: number | null;
      nickname: string | null;
      avatar_idx: number | null;
      max_dollar: string | null;
      max_amount: string | null;
      bet_coin_type: string | null;
    };
    ultimate_dice: {
      user_idx: number | null;
      nickname: string | null;
      avatar_idx: number | null;
      max_dollar: string | null;
      max_amount: string | null;
      bet_coin_type: string | null;
    };
    roulette: {
      user_idx: number | null;
      nickname: string | null;
      avatar_idx: number | null;
      max_dollar: string | null;
      max_amount: string | null;
      bet_coin_type: string | null;
    };
    crash: {
      user_idx: number | null;
      nickname: string | null;
      avatar_idx: number | null;
      max_dollar: string | null;
      max_amount: string | null;
      bet_coin_type: string | null;
    };
    wheel: {
      user_idx: number | null;
      nickname: string | null;
      avatar_idx: number | null;
      max_dollar: string | null;
      max_amount: string | null;
      bet_coin_type: string | null;
    };
  };
}

export interface MainThirdPartyDataType {
  code: 0;
  message: "success";
  result: {
    [key in string]: ProviderDataType[];
  };
}

export interface ProviderDataType {
  system: string;
  sub_system: string;
  page_code: string;
  mobile_page_code: string;
  rtp: string;
  game_name: string;
  image_full_path: string;
  status: string;
  game_status: string;
  has_demo: string;
  provider_name: string;
  game_id: string;
  game_type: "provider" | "original";
  bright_color_code: string;
  dark_color_code: string;
  image_change_path: string | null;
}

export interface MainBannerDataType {
  code: number;
  message: string;
  result: {
    bannerList: {
      title: string;
      title_vi: string;
      content1: string;
      content1_vi: string;
      content2: string;
      content2_vi: string;
      link_title: string;
      link_title_vi: string;
      link_url: string;
      start_date: string;
      end_date: string;
      is_active: string;
      sort: string;
      side_color: string;
      image_url: string;
      original_name: string;
      update_date: number;
      create_date: number;
      is_blank: "1" | "0";
    }[];
    attendance?:
      | {
          strikeCount: number;
          todayGetHon: number;
        }
      | undefined
      | null;

    spin: {
      isPossibleSpin: true;
      availableLevel: "BRONZE 4";
      spinStructure: {
        assetType: string;
        amount: string;
      }[];
    };
  } | null;
}
