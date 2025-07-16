import { getCookie } from "@/utils";
import { create } from "zustand";

// Type definitions for the store
type UserStoreType = {
  token: string | null;
  displayFiat: string | null;
  login: (token: string) => void;
  firstLogin: boolean;
  logout: () => void;
  setUserSetting: ({ displayFiat }: { displayFiat: string | null }) => void;
  setFirstLogin: (state: boolean) => void;
};

// Create the socket store using Zustand

const useUserStore = create<UserStoreType>(set => ({
  token: getCookie("token"),
  firstLogin: false,
  displayFiat: getCookie("displayFiat") ? (getCookie("fiat") as string) : null,

  login: (token: string) => {
    set({ token: token });
  },

  logout: () => {
    set({ token: null });
  },

  setUserSetting: ({ displayFiat }) => {
    set({ displayFiat });
  },

  setFirstLogin: (state: boolean) => {
    set({ firstLogin: state });
  },
}));

export { useUserStore };
