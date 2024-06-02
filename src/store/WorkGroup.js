import { create } from "zustand";

const initialState = {
  workGroup: '전체',
  setWorkGroup: () => {},
};

export const useWorkGroup = create(set => ({
  ...initialState,
  setWorkGroup: workGroup => set({ workGroup}),
}));
