export type LanguageType =
  | "ko"
  | "en"
  | "vi"
  | "ms"
  | "id"
  | "th"
  | "es"
  | "de"
  | "pt"
  | "ja"
  | "cn"
  | "ru"
  | "dev";

export interface AssetReferType {
  code: number;
  message: string;
  result: {
    assetInfo: {
      [key: string]: {
        division: number;
        networks:
          | {
              networkName: string;
              chainId: string | null;
            }[]
          | [];
      };
    };
    cryptoToFiat: {
      [key: string]: string | { [fiat: string]: string };
    };
  };
}
