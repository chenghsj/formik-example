import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialData from '../data.json'

export interface IInformation {
  id: string;
  age: number;
  first_name: string;
  last_name: string;
  email: string;
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

const filteredIdx = (data: IData[] | IInformation[], id: string) =>   data.findIndex(row => row.id === id)

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    editInfoAction: (state, action: PayloadAction<{ rowId: string, infoId: string, info: IInformation; }>) => {
      const filteredRowIdx = filteredIdx(state, action.payload.rowId)     
      const filteredInfoIdx = filteredIdx(state[filteredRowIdx].information, action.payload.infoId)
      state[filteredRowIdx].information[filteredInfoIdx] = action.payload.info;
    }, 
    deleteInfoAction: (state, action: PayloadAction<{ rowId: string, infoId: string }>) => {
      const filteredRowIdx = filteredIdx(state, action.payload.rowId);
      const filteredInfoIdx = filteredIdx(state[filteredRowIdx].information, action.payload.infoId)
      state[filteredRowIdx].information.splice(filteredInfoIdx, 1)
    },
    editNetAction: (state, action: PayloadAction<{rowId: string, netData: IData}>) => {
      const filteredRowIdx = filteredIdx(state, action.payload.rowId);
      state[filteredRowIdx] = action.payload.netData;
    },
    resetData: (state, action: PayloadAction<{rowId: string, untouchedValues: IData}>) => {
      const filteredRowIdx = filteredIdx(state, action.payload.rowId);
      state[filteredRowIdx] = action.payload.untouchedValues;
    },
  }
});

export const {
  editInfoAction,
  deleteInfoAction,
  editNetAction,
  resetData
} = dataSlice.actions;

export default dataSlice.reducer;