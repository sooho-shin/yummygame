import { RouletteBetType } from "@/types/games/roulette";
import { create } from "zustand";

// Type definitions for the store
interface ArrayObject {
  type: RouletteBetType;
  chipAmount: string;
  selectList?: number[];
}
type RouletteStoreType = {
  selectedChipAmount: number;
  setSelectedChipAmount: (chipAmount: number) => void;
  selectedBoardData: ArrayObject[] | [];
  setSelectedBoardData: (arr: ArrayObject[] | []) => void;
};

// Create the socket store using Zustand

const useRouletteStore = create<RouletteStoreType>((set, get) => ({
  selectedChipAmount: 1,
  setSelectedChipAmount: (chipAmount: number) => {
    set({ selectedChipAmount: chipAmount });
  },
  selectedBoardData: [],
  setSelectedBoardData: (arr: ArrayObject[] | []) => {
    set({
      selectedBoardData: arr,
    });
  },
}));

export { useRouletteStore };
