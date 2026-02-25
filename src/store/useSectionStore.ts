import { create } from "zustand";

interface SectionState {
  activeSection: string;
  setSection: (s: string) => void;
}

export const useSectionStore = create<SectionState>((set) => ({
  activeSection: "hero",
  setSection: (s) => set({ activeSection: s }),
}));
