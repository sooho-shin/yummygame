"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCommonStore } from "@/stores/useCommon";
import { usePathname } from "next/navigation";

export default function LicenceBox() {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { licenseClick, setLicenseClick } = useCommonStore();
  const pathname = usePathname();
  const handleMutation = useCallback(
    (mutationsList: MutationRecord[]) => {
      const aTags = divRef.current?.querySelector<HTMLAnchorElement>("a");
      mutationsList.forEach(mutation => {
        if (
          mutation.type === "childList" &&
          mutation.addedNodes.length > 0 &&
          licenseClick
        ) {
          if (aTags) {
            window.open(aTags.href, "_blank"); // 새 창으로 열기
          }
        }
      });
    },
    [licenseClick],
  );

  useEffect(() => {
    if (divRef.current) {
      const observer = new MutationObserver(handleMutation);
      observer.observe(divRef.current, { childList: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [licenseClick]); // 의존성 배열이 비어있어 한 번만 실행

  useEffect(() => {
    handleCreateLicenseScript(false);
  }, [pathname]);

  const handleCreateLicenseScript = (click: boolean = false) => {
    click ? setLicenseClick(true) : setLicenseClick(false);

    const existingScript = document.querySelector(
      'script[src="https://dc654b4f-93ed-4f7b-abae-886cbe86056a.snippet.anjouangaming.org/anj-seal.js"]',
    );

    const children = divRef.current?.children;

    // 첫 번째 자식 요소가 있을 경우 제거합니다.
    if (children && children.length > 0) {
      children[0].remove();
    }

    // 기존 스크립트가 있으면 제거
    if (existingScript) {
      existingScript.remove();
    }

    // 새로운 스크립트 요소를 생성
    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src =
      "https://dc654b4f-93ed-4f7b-abae-886cbe86056a.snippet.anjouangaming.org/anj-seal.js";

    // body에 스크립트 요소를 추가
    document.body.appendChild(script);
  };

  const box = useMemo(() => {
    return (
      <button
        type={"button"}
        onClick={event => {
          handleCreateLicenseScript(true);

          event.preventDefault();
          // event.stopPropagation();
        }}
      >
        <div
          ref={divRef}
          id="anj-dc654b4f-93ed-4f7b-abae-886cbe86056a"
          data-anj-seal-id="dc654b4f-93ed-4f7b-abae-886cbe86056a"
          data-anj-image-size="32"
          data-anj-image-type="basic-small"
        ></div>
      </button>
    );
  }, []);
  return { box, handleCreateLicenseScript };
}
