import { getCookie } from "@/utils";
import { create } from "zustand";

// Type definitions for the store
type ProviderStoreType = {
  gameData: {
    div: string;
    script: string;
    id: string;
  };
  setGameData: (data: { div: string; script: string; id: string }) => void;
};

// Create the socket store using Zustand

const useProviderStore = create<ProviderStoreType>(set => ({
  gameData: { div: "", script: "", id: "" },

  setGameData: (data: { div: string; script: string; id: string }) => {
    set({ gameData: data });
  },
}));

export { useProviderStore };
