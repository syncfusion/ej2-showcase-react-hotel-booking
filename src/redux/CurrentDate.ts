import { type Slice, createSlice } from '@reduxjs/toolkit';

const currentDate: Date = new Date();
const year: number = currentDate.getFullYear();
const month: number = currentDate.getMonth();
const day: number = currentDate.getDate();

export const dateSlice: Slice<any> = createSlice({
  name: 'currentDate',
  initialState: {
    value: { year, month, day },
  },
  reducers: {
    updateCurrentDate: (state, action): void => {
      state.value.year = action.payload.year;
      state.value.month = action.payload.month;
      state.value.day = action.payload.day;
    },
  },
});

export const { updateCurrentDate } = dateSlice.actions;

export default dateSlice.reducer;
