import { create } from "zustand";

const initialState = {
  workGroup: '전체',
  groups: [],
  workGroupCounts: {}, // 추가
  setWorkGroup: () => {},
  setGroups: () => {},
};

export const useWorkGroup = create(set => ({
  ...initialState,
  setWorkGroup: workGroup => set({ workGroup}),
  setGroups: groups => set({ groups }),
  setWorkGroupCounts: () => {},
}));
