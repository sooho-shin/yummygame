import React from "react";
import { create } from "zustand";

// 큐 타입 정의
type ModalQueueItem = {
  type: string | null;
  callback?: () => void | undefined;
  props?: { [key: string]: string | number | boolean | object } | null;
  alertData?: {
    title: string;
    children: React.ReactNode | React.ReactNode[];
  } | null;
  backBtn?: boolean;
};

interface ModalStoreInterface {
  isOpen: boolean;
  type: string | null;
  beforeType: string | null;
  googleAccessToken: string | null;
  props: any;
  callback:
    | ((param?: {
        [key: string]: string | number | object | boolean | void;
      }) => void)
    | undefined;
  closeModal: () => void;
  openModal: (item: ModalQueueItem) => void;
  setGoogleAccessToken: (token: string) => void;
  alertData: {
    title: string;
    children: React.ReactNode | React.ReactNode[];
  } | null;
  backBtn: boolean;
  queue: ModalQueueItem[];
  isSpin: boolean;
  setSpin: (isSpin: boolean) => void;
}

const useModalStore = create<ModalStoreInterface>((set, get) => ({
  isOpen: false,
  type: null,
  callback: undefined,
  googleAccessToken: null,
  props: null,
  alertData: null,
  backBtn: false,
  beforeType: null,
  isSpin: false,
  queue: [],

  closeModal: () => {
    if (!get().isSpin) {
      set(state => {
        const newQueue = [...state.queue];
        newQueue.shift(); // 큐에서 첫 번째 아이템 제거

        return {
          isOpen: false,
          type: null,
          callback: undefined,
          props: null,
          alertData: null,
          backBtn: false,
          queue: newQueue,
          beforeType: get().type,
        };
      });

      // 다음 모달을 400ms 후에 열기
      setTimeout(() => {
        const queue = get().queue;
        if (queue.length > 0) {
          const nextModal = queue[0];
          set({
            isOpen: true,
            type: nextModal.type,
            callback: nextModal.callback,
            props: nextModal.props,
            alertData: nextModal.alertData,
            backBtn: nextModal.backBtn || false,
            // beforeType: get().type,
          });
        }
      }, 400); // 400ms 지연
    }
  },
  openModal: (item: ModalQueueItem) => {
    set(state => {
      const modalIndex = state.queue.findIndex(modalItem => {
        return (
          modalItem.type === item.type &&
          modalItem.props === item.props &&
          modalItem.props
        ); // type과 props가 모두 같은지 확인
      });

      if (modalIndex !== -1) {
        // 같은 type과 props의 모달이 이미 큐에 있는 경우 아무것도 하지 않음
        return {};
      }

      // 같은 type의 모달이 현재 떠있는데 props가 다를떄

      if (state.type === item.type && state.props !== item.props) {
        return { props: item.props };
      }
      // 같은 type의 모달이 있지만 props가 다른 경우 props만 업데이트
      const sameTypeIndex = state.queue.findIndex(
        modalItem => modalItem.type === item.type,
      );

      if (sameTypeIndex !== -1) {
        const updatedQueue = [...state.queue];
        updatedQueue[sameTypeIndex] = {
          ...updatedQueue[sameTypeIndex],
          props: item.props, // 기존 모달의 props만 업데이트
        };
        return { queue: updatedQueue };
      }

      // 같은 type의 모달이 큐에 없는 경우 새로운 모달 추가
      const updatedQueue = [...state.queue, item];
      if (!state.isOpen) {
        const nextModal = updatedQueue[0];
        return {
          isOpen: true,
          type: nextModal.type,
          callback: nextModal.callback,
          props: nextModal.props,
          alertData: nextModal.alertData,
          backBtn: nextModal.backBtn || false,
          // beforeType: state.beforeType,
          queue: updatedQueue,
        };
      }
      return { queue: updatedQueue };
    });
  },

  setGoogleAccessToken: token => {
    set(() => ({ googleAccessToken: token }));
  },
  setSpin: state => {
    set({ isSpin: state });
  },
}));

export { useModalStore };
