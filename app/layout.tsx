// import { useLocale } from "next-intl";

import FreshDesk from "@/components/home/FreshDesk";
import "@/styles/_font.scss";
import "@/styles/_global.scss";
import "@/styles/_reset.scss";
import "@/styles/_theme.scss";
import "react-toastify/dist/ReactToastify.css";
import ReactQueryProvider from "./ReactQueryProvider";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";
import ErrorComponent from "@/components/error/Error";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? "/"),
  title: {
    template: "YummyGame Casino | %s",
    default:
      "Yummygame - The new decentralized Casino: Experience the future of fair gambling",
  },
  themeColor: "#DB2D59",
  keywords: [
    "Crypto Casino Games",
    "Bitcoin Crash Game",
    "Bitcoin Gambling Games",
    "Crypto Games",
    "Yummygame",
    "yummygame",
    "Crypto Gambling Games",
    "Play Live Casino Online Free",
    "Best Crypto Casino Games",
    "Best Crypto Games",
    "Online Crypto Casino Games",
    "Online Blockchain Games",
    "Online Casino Slot Games",
    "crypto betting",
    "bitcoin betting",
    "ethereum betting",
    "online casino",
    "crypto casino",
    "bitcoin casino",
    "ethereum casino",
    "slots",
    "baccarat",
    "blackjack",
    "roulette",
    "sports betting",
    "crypto sports betting",
    "bitcoin sports betting",
    "ethereum sports betting",
    "online gambling",
    "safe betting",
    "anonymous betting",
    "fast withdrawal",
    "blockchain game",
  ],
  description:
    "Crypto Casino Games, Bitcoin Crash Game, Bitcoin Gambling Games, Crypto Games, Yummygame, yummygame, Crypto Gambling Games, Play Live Casino Online Free, Best Crypto Casino Games, Best Crypto Games, Online Crypto Casino Games, Online Blockchain Games, Online Casino Slot Games",
  openGraph: {
    title: {
      template: "YummyGame Casino | %s",
      default:
        "Yummygame - The new decentralized Casino: Experience the future of fair gambling",
    },

    description:
      "Crypto Casino Games, Bitcoin Crash Game, Bitcoin Gambling Games, Crypto Games, Yummygame, yummygame, Crypto Gambling Games, Play Live Casino Online Free, Best Crypto Casino Games, Best Crypto Games, Online Crypto Casino Games, Online Blockchain Games, Online Casino Slot Games",

    url: "https://www.yummygame.io/",

    images: [
      {
        url: "/images/meta/OG_1200x630.jpg", // Must be an absolute URL
        width: 1200,
        height: 630,
      },
      {
        url: "/images/meta/OG_600x600.jpg", // Must be an absolute URL
        width: 600,
        height: 600,
      },
    ],

    type: "website",
  },

  icons: {
    icon: [{ url: "/images/meta/favicon-32x32.png" }],
    shortcut: ["/images/meta/favicon-16x16.png"],
    apple: [{ url: "/images/meta/apple-touch-icon.png" }],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Yummygame - The new decentralized Casino: Experience the future of fair gambling",

    description:
      "Crypto Casino Games, Bitcoin Crash Game, Bitcoin Gambling Games, Crypto Games, Yummygame, yummygame, Crypto Gambling Games, Play Live Casino Online Free, Best Crypto Casino Games, Best Crypto Games, Online Crypto Casino Games, Online Blockchain Games, Online Casino Slot Games",

    images: [`${process.env.NEXT_PUBLIC_URL ?? ""}/images/meta/OG_600x600.jpg`],
  },
};

export default async function AppLayout({ children }: Props) {
  return (
    <html>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body data-theme="dark">
        <ErrorComponent type={"comingsoon"} />
        {/*<ReactQueryProvider>*/}
        {/*  {children}*/}
        {/*  {process.env.NEXT_PUBLIC_MODE === "production" && <FreshDesk />}*/}
        {/*  /!*<FreshDesk />*!/*/}
        {/*</ReactQueryProvider>*/}
      </body>
    </html>
  );
}
