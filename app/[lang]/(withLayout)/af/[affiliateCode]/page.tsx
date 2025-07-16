"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

export default function CodePage({
  params,
}: {
  params: { affiliateCode: string };
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [cookies] = useCookies();
  const searchParams = useSearchParams();
  const param = searchParams.get("t");

  useEffect(() => {
    if (hydrated) {
      if (param === "000K") {
        redirect(
          "/providers/?modal=getstarted&modalCode=" + params.affiliateCode,
        );
      } else {
        redirect("/?modal=getstarted&modalCode=" + params.affiliateCode);
      }
    }
  }, [hydrated, cookies]);
  return <></>;
}
