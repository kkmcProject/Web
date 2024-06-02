import { create } from "zustand";

const initialState = {
  rows: [],
  checkedRows: [],
  setRows: () => {},
  setCheckedRows: () => {},
};

export const useTableData = create(set => ({
  ...initialState,
  setRows: rows => set({ rows }),
  setCheckedRows: checkedRows => set({ checkedRows }),
}));
