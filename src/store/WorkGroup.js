import { create } from "zustand";

const initialState = {
  workGroup: '전체',
  groups: [],
  setWorkGroup: () => {},
  setGroups: () => {},
};

export const useWorkGroup = create(set => ({
  ...initialState,
  setWorkGroup: workGroup => set({ workGroup}),
  setGroups: groups => set({ groups }),
}));
