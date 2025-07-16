import { create } from "zustand";
type DeviceType = "desktop" | "tablet" | "mobile";
type DeviceTypeArray = DeviceType[];
// Type definitions for the store
type CommonStoreType = {
  isShowChat: boolean;
  setIsShowChat: (state: boolean) => void;
  isShowNotice: boolean;
  setIsShowNotice: (state: boolean) => void;
  isInProviderGame: boolean;
  setIsInProviderGame: (state: boolean) => void;
  swipeState: boolean | null;
  setSwipeState: (state: boolean) => void;
  media: DeviceTypeArray | null;
  setMedia: (state: DeviceTypeArray) => void;
  wholeLoadingState: boolean;
  setWholeLoadingState: (state: boolean) => void;
  isChangeAssetState: boolean;
  setIsChangeAssetState: (state: boolean) => void;
  tokenList: {
    name: string;
    amount: string;
  }[];
  setTokenList: (
    lift: {
      name: string;
      amount: string;
    }[],
  ) => void;
  licenseClick: boolean;
  setLicenseClick: (state: boolean) => void;

  // contentScrollPosition: { x: number; y: number };
  // setContentScrollPosition: (data: { x: number; y: number }) => void;
};

const useCommonStore = create<CommonStoreType>((set, get) => ({
  media: null,
  setMedia: (media: DeviceTypeArray) => {
    set({ media: media });
  },
  isShowChat: false,
  setIsShowChat: (state: boolean) => {
    set({ isShowChat: state });
  },
  isShowNotice: false,
  setIsShowNotice: (state: boolean) => {
    set({ isShowNotice: state });
  },
  isInProviderGame: false,
  setIsInProviderGame: (state: boolean) => {
    set({ isInProviderGame: state });
  },
  swipeState: null,
  setSwipeState: (state: boolean) => {
    set({ swipeState: state });
  },
  wholeLoadingState: false,
  setWholeLoadingState: (state: boolean) => {
    set({ wholeLoadingState: state });
  },
  isChangeAssetState: true,
  setIsChangeAssetState: (state: boolean) => {
    set({ isChangeAssetState: state });
  },
  tokenList: [],
  setTokenList: (
    list: {
      name: string;
      amount: string;
    }[],
  ) => {
    set({ tokenList: list });
  },
  licenseClick: false,
  setLicenseClick: (state: boolean) => {
    set({ licenseClick: state });
  },
}));

export { useCommonStore };
