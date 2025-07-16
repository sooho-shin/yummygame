"use client";

import { useGetUserProfile } from "@/querys/user";
import { useUserStore } from "@/stores/useUser";
import Script from "next/script";
import { useGetCommon } from "@/querys/common";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FreshDesk() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const { token } = useUserStore();
  const { data } = useGetUserProfile(token);
  const { data: user, refetch } = useGetCommon(token);
  const [cookies] = useCookies();
  if (!hydrated) <></>;
  return (
    <>
      <Script
        type="text/javascript"
        src="//fw-cdn.com/10978270/3732804.js"
        data-chat="true"
        id="freshDesk1"
        // @ts-ignore
        widgetId={
          ""
          // cookies.tracking === "000K" ||
          // (token && user?.result.userType === "USER_000K")
          //   ? "11d73d39-d60d-42a0-924d-a76a408418fa"
          //   :
          // ?
        }
      />
      {data && data?.result && (
        <>
          <Script id="freshDesk2">
            {`
                window.fwcrm.on("user:created", function () {
                  window.fcWidget.setExternalId("${data?.result.idx}");
                  window.fcWidget.user.setFirstName("${data?.result.nickname}");
                  window.fcWidget.user.setEmail("${data?.result.email}");
                });
              `}
          </Script>
        </>
      )}
    </>
  );
}
