/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
/* eslint-enable @typescript-eslint/no-var-requires */

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://www.yummygame.io", // 기본 사이트 URL
  generateRobotsTxt: true, // robots.txt 생성
  sitemapSize: 5000, // 한 파일에 포함할 최대 URL 수
  outDir: "./public", // 생성된 파일 저장 위치
  generateIndexSitemap: false, // Sitemap index 비활성화
  exclude: ["/404"], // 동적 경로 제외
  transform: async (config, path) => {
    // 동적 라우팅 경로를 제외
    if (path.includes("[") || path.includes("]")) {
      return null; // null 반환 시 해당 경로는 Sitemap에서 제외
    }
    return {
      loc: path, // 경로
      changefreq: "weekly", // 변경 빈도
      priority: path === "/" ? 1 : 0.8, // 루트 경로는 우선순위를 높게 설정
      lastmod: new Date().toISOString(), // 마지막 수정일
    };
  },
  additionalPaths: async config => {
    const languages = [
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
    ]; // 지원 언어 목록
    const basePath = path.resolve(__dirname, "app/[lang]/(withLayout)"); // 언어별 페이지가 있는 디렉토리
    const dynamicPaths = [];

    // 디렉토리 구조를 재귀적으로 탐색하는 함수
    const getPathsRecursively = dir => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      return entries.flatMap(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return getPathsRecursively(fullPath);
        } else if (entry.isFile() && entry.name === "page.tsx") {
          const relativePath = path.relative(basePath, fullPath);
          const cleanPath = relativePath
            .replace(/\\/g, "/") // Windows 경로 지원
            .replace("/page.tsx", ""); // 파일명 제거
          return `/${cleanPath}`;
        }
        return [];
      });
    };

    // 동적으로 탐색하여 경로 생성
    const staticPaths = getPathsRecursively(basePath);

    languages.forEach(lang => {
      staticPaths.forEach(staticPath => {
        if (!staticPath.includes("[") && !staticPath.includes("]")) {
          dynamicPaths.push({
            loc: `/${lang}${staticPath}`,
            changefreq: "weekly",
            priority: 0.7,
          });
        }
      });
    });

    return dynamicPaths;
  },
};

module.exports = config;
