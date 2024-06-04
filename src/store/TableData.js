import { create } from "zustand";

const initialState = {
  rows: [],
  checkedRows: [],
  headers: [],
  setRows: () => {},
  setCheckedRows: () => {},
  setHeaders: () => {},
};

export const useTableData = create(set => ({
  ...initialState,
  setRows: rows => set({ rows }),
  setCheckedRows: checkedRows => set({ checkedRows }),
  setHeaders: headers => set({headers}),
}));
