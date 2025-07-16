"use client";

import Script from "next/script";

interface FreshDeskScriptsProps {
  widgetId: string;
  userData: {
    id: number;
    firstName: string;
    email: string;
  };
}

export default function FreshDeskScripts({
  widgetId,
  userData,
}: FreshDeskScriptsProps) {
  return (
    <>
      <Script
        type="text/javascript"
        src="//fw-cdn.com/10978270/3732804.js"
        data-chat="true"
        id="freshDesk1"
        // @ts-ignore
        widgetId={widgetId}
      />
      <Script id="freshDesk2">
        {`
          window.fwcrm.on("user:created", function () {
            window.fcWidget.setExternalId("${userData.id}");
            window.fcWidget.user.setFirstName("${userData.firstName}");
            window.fcWidget.user.setEmail("${userData.email}");
          });
        `}
      </Script>
    </>
  );
}
