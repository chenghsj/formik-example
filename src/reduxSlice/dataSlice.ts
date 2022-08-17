import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialData from '../data.json'

export interface IInformation {
  id: string;
  age: number;
  first_name: string;
  last_name: string;
  email: string;
  job_title?: string;
  company?: string;
  income_source?: string;
}

export interface IData {
  row: number;
  id: string;
  ip_address: string;
  domain_name: string;
  mac_address: string;
  information: IInformation[];
}

const initialState: IData[] = initialData;

const filteredIdx = (data: IData[] | IInformation[], id: string) => data.findIndex(row => row.id === id)

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateRowDataAction: (state, action: PayloadAction<{ rowId: string, rowData: IData }>) => {
      const filteredRowIdx = filteredIdx(state, action.payload.rowId);
      state[filteredRowIdx] = action.payload.rowData;
    },
  }
});

export const {
  updateRowDataAction,
} = dataSlice.actions;

export default dataSlice.reducer;