import { LanguageType } from "@/types/common";
import "server-only";

const dictionaries = {
  ko: () => import("@/dictionaries/ko.json").then(module => module.default),
  en: () => import("@/dictionaries/en.json").then(module => module.default),
  vi: () => import("@/dictionaries/vi.json").then(module => module.default),
  ms: () => import("@/dictionaries/ms.json").then(module => module.default),
  id: () => import("@/dictionaries/id.json").then(module => module.default),
  th: () => import("@/dictionaries/th.json").then(module => module.default),
  es: () => import("@/dictionaries/es.json").then(module => module.default),
  de: () => import("@/dictionaries/de.json").then(module => module.default),
  pt: () => import("@/dictionaries/pt.json").then(module => module.default),
  ja: () => import("@/dictionaries/ja.json").then(module => module.default),
  cn: () => import("@/dictionaries/cn.json").then(module => module.default),
  ru: () => import("@/dictionaries/ru.json").then(module => module.default),
  tr: () => import("@/dictionaries/tr.json").then(module => module.default),
  fr: () => import("@/dictionaries/fr.json").then(module => module.default),
  it: () => import("@/dictionaries/it.json").then(module => module.default),
  ar: () => import("@/dictionaries/ar.json").then(module => module.default),
  hu: () => import("@/dictionaries/hu.json").then(module => module.default),
  gr: () => import("@/dictionaries/gr.json").then(module => module.default),
  pl: () => import("@/dictionaries/pl.json").then(module => module.default),
  dev: () => import("@/dictionaries/dev.json").then(module => module.default),
};

export const getDictionary = async (locale: LanguageType) =>
  dictionaries[locale]();

export const useDictionary = async (locale: LanguageType) => {
  const dictionary = await getDictionary(locale);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (key: string) => dictionary[key] || key;
};
