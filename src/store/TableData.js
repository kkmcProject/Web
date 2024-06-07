import { create } from "zustand";

const initialState = {
  rows: [],
  checkedRows: [],
  headers: [],
  filteredColumns: [],
  currentFilename: '',
  setRows: () => {},
  setCheckedRows: () => {},
  setHeaders: () => {},
  setFilteredColumns: () => {},
  setCurrentFilename: () => {},
};

export const useTableData = create(set => ({
  ...initialState,
  setRows: rows => set({ rows }),
  setCheckedRows: checkedRows => set({ checkedRows }),
  setHeaders: headers => set({headers}),
  setFilteredColumns : filteredColumns => set({filteredColumns}),
  setCurrentFilename: currentFilename => set({currentFilename}),
}));
