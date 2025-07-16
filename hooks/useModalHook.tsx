"use client";

import { useModalStore } from "@/stores/useModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useQueue } from "react-use";
import { BetInfo } from "@/types/games/crash";

export default function useModalHook() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    isOpen,
    type,
    callback,
    closeModal: closeModalInStore,
    openModal: openModalInStore,
    props: modalInProps,
    alertData,
    backBtn,
    beforeType,
    setSpin,
  } = useModalStore();

  // type,
  //   callback = undefined,
  //   props = get().props,
  //   alertData = null,
  //   backBtn = false,

  // isOpen: true,
  //   callback: callback,
  //   type: type,
  //   props: props,
  //   alertData: alertData,
  //   backBtn: backBtn,
  //   beforeType: get().type,

  // isOpen: false,
  //   type: null,
  //   callback: undefined,
  //   googleAccessToken: null,
  //   props: null,
  //   alertData: null,
  //   backBtn: false,
  //   beforeType: null,

  interface ModalDataType {
    type: string | null;
    callback?:
      | ((param?: {
          [key: string]: string | number | object | boolean | void;
        }) => void)
      | undefined;
    props?: any;
    alertData?: {
      title: string;
      children: React.ReactNode | React.ReactNode[];
    } | null;
    backBtn?: boolean;
  }

  const {
    add: qAdd,
    first: qFirst,
    last: qLast,
    remove: qRemove,
    size: qSize,
  } = useQueue<ModalDataType>();

  useEffect(() => {
    if (qSize) {
      openModalInStore(qFirst);
    }
  }, [qSize]);
  // const openModal = ({
  //   type: gType,
  //   callback = undefined,
  //   props = modalInProps,
  //   alertData = null,
  //   backBtn = false,
  // }: ModalDataType) => {
  //   qAdd({
  //     type: gType,
  //     callback: callback,
  //     props: props,
  //     alertData: alertData,
  //     backBtn: backBtn,
  //   });
  //   openModalInStore({
  //     type: gType,
  //     callback: callback,
  //     props: props,
  //     alertData: alertData,
  //     backBtn: backBtn,
  //   });
  // };

  const closeModal = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Array.from(current.keys()).forEach(param => {
      if (param.startsWith("modal")) {
        current.delete(param);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
    // qRemove();
    closeModalInStore();
  };

  return {
    isOpen,
    type,
    props: modalInProps,
    callback,
    closeModal,
    openModal: openModalInStore,
    alertData,
    backBtn,
    beforeType,
    setSpin,
  };
}
