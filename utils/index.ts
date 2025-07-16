import { categoryGameType, categoryType } from "@/types/provider";
import { BigNumber } from "bignumber.js";
import { CookieSetOptions } from "universal-cookie";

BigNumber.config({ ROUNDING_MODE: 6 });

/*
  쿠키 가져오기
*/
export function getCookie(name: string) {
  if (typeof window === "undefined") {
    return null;
  }
  const cookies = document ? document.cookie.split(";") : ""; // 모든 쿠키를 세미콜론으로 구분하여 배열로 변환
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); // 앞뒤 공백 제거
    if (cookie.indexOf(name + "=") === 0) {
      return cookie.substring(name.length + 1, cookie.length); // 쿠키 값을 반환
    }
  }
  return null; // 해당 이름의 쿠키를 찾지 못한 경우 null 반환
}

/*
  넘버 포맷팅
  value : 포맷팅할 숫자
  decimal : 나눌 10자리수 ex ) eth 18
  maxDigits : 최대 소수점 자리
*/
export function formatNumber({
  value,
  decimal = 0,
  maxDigits = 20,
}: {
  value: string;
  decimal?: number;
  maxDigits?: number;
}) {
  return new BigNumber(value)
    .div(10 ** decimal)
    .decimalPlaces(maxDigits, BigNumber.ROUND_DOWN)
    .toFormat();
}

/*
  숫자만 밸리데이션 (소수점 포함)
*/
export const validateNumberWithDecimal = (
  amount: string,
  {
    maxInteger = null,
    maxDecimal = null,
  }: { maxInteger?: number | null; maxDecimal?: number | null },
) => {
  const value = amount.replace(/,/g, "");
  const regExp = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

  const parts = value.split(".");

  if (parts[0] && maxInteger && parts[0].length > maxInteger) {
    return false;
  }
  if (parts[1] && maxDecimal && parts[1].length > maxDecimal) {
    return false;
  }
  return regExp.test(value) && value;
};

/*
  input amount 코인별 계산
*/

/*
  자산 계산
*/

/*
  소수점 버림 함수
*/

interface TruncateOptions {
  num: string;
  decimalPlaces: number;
}

export const truncateDecimal = (options: TruncateOptions) => {
  const { num, decimalPlaces } = options;

  return new BigNumber(num)
    .decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN)
    .toFixed();
};

/**
 * 기수를 서수로 치환합니다.
 * @param num
 * @returns
 */

export const setOrdinalNumber = (num: number) => {
  if (num > 3 && num < 21) return `${num}th`;
  switch (num % 10) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};

/**
 * 숫자 단위 세팅
 * @param val
 * @returns
 */
export const amountFormatter = ({
  val,
  withDecimal,
}: {
  val: string | number;
  withDecimal: false | number;
}) => {
  let unit = "";
  const K = 1000;
  const M = 1000000;
  const B = 1000000000;

  let amount = new BigNumber(val);

  if (amount.lt(K) && withDecimal) {
    return amount.toFixed(withDecimal);
  }

  if (amount.gte(K) && amount.lt(M)) {
    amount = amount.div(K);
    unit = "K";
    // } else if (amount.gte(M) && amount.lt(B)) {
  } else if (amount.gte(M)) {
    amount = amount.div(M);
    unit = "M";
  } else if (amount.gte(B)) {
    amount = amount.div(B);
    unit = "B";
  }

  return amount.isInteger()
    ? `${amount}${unit}`
    : `${truncateDecimal({
        num: amount.toFixed(withDecimal ? withDecimal : 0),
        decimalPlaces: withDecimal ? withDecimal : 0,
      })}${unit}`;
};

/**
 * 닉네임 유효성을 검사합니다.
 * @param nickname
 * @returns
 */
export const validateNickname = (nickname: string) => {
  const regExp = /^[A-Za-z0-9]*$/;
  const length = nickname.length;
  const result = regExp.test(nickname);

  if (length >= 3 && length < 17) {
    return result;
  } else {
    return false;
  }
};

// 문자열 바이트 정규식
export const validateByte = (str: string, byte: number, minByte?: number) => {
  // 문자열을 UTF-8로 인코딩하고 바이트 수를 계산합니다.
  const byteCount = new TextEncoder().encode(str).length;

  if (byteCount > byte) {
    return false;
  }

  if (minByte && byteCount < minByte) {
    return false;
  }

  return byteCount;
};

// 말줄임
export const truncateString = ({
  str,
  sliceIndex,
}: {
  str: string;
  sliceIndex: number;
}) => {
  if (str.length >= 7) {
    return str.slice(0, sliceIndex) + "...";
  } else {
    return str;
  }
};

const cookieOption: CookieSetOptions = { path: "/" };

cookieOption.maxAge = 60 * 60 * 24 * 365;

if (process.env.NEXT_PUBLIC_COOKIE_DOMAIN)
  cookieOption.domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;

// 프로바이더 게임 이름 입력하면 코드로 나오는 함수
export const getCategoryCode: (
  categoryGameName: categoryGameType,
) => categoryType | null = (categoryGameName: categoryGameType) => {
  switch (categoryGameName) {
    case "original":
      return "yummygame";

    case "yummygame":
      return "yummygame";

    case "hotgames":
      return "hot";

    case "livecasino":
      return "live";

    case "providerroulette":
      return "roulette";

    case "lottery":
      return "live_lottery";

    default:
      return categoryGameName;
  }
};

// 프로바이더 코드 입력하면 href로 나오는 함수
export const getCategoryHrefName: (
  categoryGameName: categoryType,
) => categoryGameType | null = (categoryGameName: categoryType) => {
  switch (categoryGameName) {
    case "card":
      return "card";

    case "slots":
      return "slots";

    default:
      return null;
  }
};

export const CookieOption = cookieOption;

// production 에서는 console 안됨

export const customConsole = (message?: any, ...optionalParams: any[]) => {
  if (process.env.NEXT_PUBLIC_MODE === "production") {
    return false;
  } else {
    // eslint-disable-next-line no-console
    return console.log(message, optionalParams);
  }
};
