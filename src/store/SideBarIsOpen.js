import { create } from "zustand";

const initialState = {
  isOpen: false,
  setIsOpen: () => {},
};

// eslint-disable-next-line import/prefer-default-export
export const useSideBarIsOpen = create(set => ({
  ...initialState,
  setIsOpen: isOpen => set({ isOpen }),
}));
