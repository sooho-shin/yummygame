import { getCookie } from "@/utils";
import { create } from "zustand";

// Type definitions for the store
type UserStoreType = {
  coin: string;
  setCoin: (coin: string) => void;
};

// Create the socket store using Zustand
const useAssetStore = create<UserStoreType>(set => ({
  coin: (getCookie("coin") as string) ?? "hon",
  setCoin: (coin: string) => {
    set({ coin: coin });
  },
}));

export { useAssetStore };
