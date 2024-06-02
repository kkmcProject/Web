import { create } from "zustand";

const initialState = {
  rows: [],
  checkedRows: [],
  rowRefs: [],
  setRows: () => {},
  setCheckedRows: () => {},
  setRowRefs: () => {},
};

export const useTableData = create(set => ({
  ...initialState,
  setRows: rows => set({ rows }),
  setCheckedRows: checkedRows => set({ checkedRows }),
  setRowRefs: rowRefs => set({ rowRefs }),
}));
