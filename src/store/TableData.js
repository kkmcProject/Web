import { create } from "zustand";

const initialState = {
  rows: [],
  checkedRows: [],
  headers: [],
  filteredColumns: [],
  setRows: () => {},
  setCheckedRows: () => {},
  setHeaders: () => {},
  setFilteredColumns: () => {},
};

export const useTableData = create(set => ({
  ...initialState,
  setRows: rows => set({ rows }),
  setCheckedRows: checkedRows => set({ checkedRows }),
  setHeaders: headers => set({headers}),
  setFilteredColumns : filteredColumns => set({filteredColumns}),
}));
