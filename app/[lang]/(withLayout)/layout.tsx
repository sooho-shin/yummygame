// import { useLocale } from "next-intl";

import Nav from "@/components/home/Nav";

import { getDictionary } from "@/app/[lang]/(withLayout)/dictionaries";
import Chat from "@/components/chat/Chat";
import Notice from "@/components/chat/Notice";
import { ContentWrapper } from "@/components/common/ContentWrapper";
import Dim from "@/components/common/Dim";
import Footer from "@/components/common/Footer";
import CookieToast from "@/components/home/CookieToast";
import Header from "@/components/home/Header";
import PersonalPush from "@/components/home/PersonalPush";
import ModalContainer from "@/components/modal/ModalContainer";
import { DictionaryProvider } from "@/context/DictionaryContext";
import { LanguageType } from "@/types/common";
import fetchDataServer from "@/utils/fetchServer";
import { headers } from "next/headers";
import "react-toastify/dist/ReactToastify.css";
import requestIp from "request-ip";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    lang: LanguageType;
  };
};

export default async function LocaleLayout({
  children,
  params: { lang },
}: Props) {
  const headersList = headers();
  const headerMap: { [key: string]: string } = {};
  headersList.forEach((value, key) => {
    headerMap[key] = value;
  });
  const ip = requestIp.getClientIp({ headers: headerMap });
  const res = await fetchDataServer({
    url: "/user/country",
    method: "get",
    data: { ip },
  });

  const dictionary = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dictionary}>
      <Header />
      <main>
        <>
          <Nav />
          {/* 서버사이드 번역
              {t("test_1")} */}
          <ContentWrapper>
            <>
              {children}
              <Footer />
            </>
          </ContentWrapper>
          <Chat />
          <Notice />
          <CookieToast />
          <PersonalPush />
        </>
      </main>
      <ModalContainer isBlock={res.result.isBlock} />
      <Dim />
    </DictionaryProvider>
  );
}
