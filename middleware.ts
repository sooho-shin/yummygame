import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { TCountryCode, countries } from "countries-list";

// 번역

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = [
  "en",
  "ko",
  "vi",
  "ms",
  "id",
  "th",
  "es",
  "de",
  "pt",
  "ja",
  "cn",
  "ru",
  "dev",
  "tr",
  "fr",
  "it",
  "ar",
  "hu",
  "gr",
  "pl",
];

const defaultLocale = locales[0];

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  if (negotiatorHeaders["cloudfront-viewer-country"]) {
    const cloudfrontCountry = negotiatorHeaders[
      "cloudfront-viewer-country"
    ] as TCountryCode;
    const languages = countries[cloudfrontCountry].languages;
    return matchLocale(languages, locales, defaultLocale);
  }
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const pathname = request.nextUrl.pathname;
  const query = request.nextUrl.search; // 쿼리스트링 가져오기

  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  const lang = request.cookies.get("lang")?.value;

  const segments = pathname.split("/");

  if (lang && lang !== segments[1] && !pathnameIsMissingLocale) {
    segments[1] = lang;
    const resultString = segments.join("/");
    const newUrl = new URL(resultString, request.url);
    newUrl.search = query; // 현재 쿼리스트링 추가

    return NextResponse.redirect(newUrl);
  }

  if (pathnameIsMissingLocale) {
    // aws 즉 production 으로 빌드 했을때 이슈때문에 try catch
    try {
      const locale = getLocale(request);

      // 현재 쿼리스트링을 유지한 채로 새로운 URL을 생성
      const newUrl = new URL(`/${lang ?? locale}${pathname}`, request.url);
      newUrl.search = query; // 현재 쿼리스트링 추가

      return NextResponse.redirect(newUrl);
    } catch (error) {
      const newUrl = new URL(`/en${pathname}`, request.url);
      return NextResponse.redirect(newUrl);
    }
  }

  // sports 부분
  const sportsRendered = request.cookies.get("navigationtype")?.value;
  const referer = request.headers.get("referer");
  // console.log(`referer: ${referer}`);
  // console.log(`sportsRendered: ${sportsRendered}`);
  // console.log(`sports match: ${pathname.match(/^\/\w+\/sports/)}`);
  const isSportsPath = pathname.match(/^\/\w+\/sports/);
  if (isSportsPath) {
    const navigationCookie = request.cookies.get("navigationtype")?.value;

    if (navigationCookie?.startsWith("popstate-")) {
      const timestamp = parseInt(navigationCookie.split("-")[1]);
      const now = Date.now();
      // 1초 이내의 요청만 popstate로 인정
      if (now - timestamp < 1000) {
        // popstate 처리 로직
        return new NextResponse(null, { status: 204 });
      } else {
        response.headers.set(
          "Set-Cookie",
          "navigationtype=; Max-Age=0; Path=/; SameSite=Strict",
        );
      }
    }
  }
  
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
