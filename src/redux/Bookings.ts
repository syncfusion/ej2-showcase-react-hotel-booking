import { type Slice, createSlice } from '@reduxjs/toolkit';

const generateStaticEvents = (
  start: Date,
  floor: number,
  resCount: number,
  overlapCount: number,
): Array<Record<string, any>> => {
  const data: Array<Record<string, any>> = [];
  let id: number = 1;
  for (let i: number = 0, f: number = floor; i < resCount; i++, f++) {
    const randomCollection: number[] = [];
    let random: number = 0;
    for (let j: number = 0; j < overlapCount; j++) {
      random = Math.floor(Math.random() * 30);
      random = random === 0 ? 1 : random;
      if (
        randomCollection.includes(random) ||
        randomCollection.includes(random + 2) ||
        randomCollection.includes(random - 2)
      ) {
        random += Math.max.apply(null, randomCollection) + 10;
      }
      for (let k: number = 1; k <= 2; k++) {
        randomCollection.push(random + k);
      }
      const startDate: Date = new Date(
        start.getFullYear(),
        start.getMonth(),
        random,
      );
      const endDate: Date = new Date(
        startDate.getTime() + (1440 + 30) * (1000 * 60),
      );
      let dateDifference: number = 0;
      const timeDifference: number = endDate.getTime() - startDate.getTime();
      const differenceInDays: number = timeDifference / (1000 * 60 * 60 * 24);
      dateDifference = differenceInDays;
      const nights: number = Math.floor(dateDifference);
      const adult: number = Math.floor(Math.random() * 4) + 1;
      const child: number = Math.floor(Math.random() * 5);
      let floor = 0;
      const roomsInFloor = 4;
      if (i >= 1 * roomsInFloor) {
        floor += 1;
      }
      if (i >= 2 * roomsInFloor) {
        floor += 1;
      }
      if (i >= 3 * roomsInFloor) {
        floor += 1;
      }
      if (i >= 4 * roomsInFloor) {
        floor += 1;
      }
      data.push({
        Id: id,
        GuestName: `Steve Smith`,
        CheckIn: startDate.toISOString(),
        CheckOut: endDate.toISOString(),
        IsAllDay: !(id % 10),
        Floor: floor + 1,
        Room: i + 1,
        Nights: nights,
        Adults: adult,
        Child: child,
        Purpose: 'Vacation',
        ContactNumber: '',
        Email: '',
        Price: 500,
        Proof: '',
        ProofNumber: '',
        EndTimezone: null,
        RecurrenceException: null,
        RecurrenceID: null,
        RecurrenceRule: null,
        StartTimezone: null,
      });
      id++;
    }
  }
  return data;
};

const randomDataSource: Array<Record<string, any>> = generateStaticEvents(
  new Date(),
  5,
  20,
  30,
);

export const dateSlice: Slice<any> = createSlice({
  name: 'bookingData',
  initialState: {
    value: {
      bookingData: randomDataSource,
      nights: 0,
      startDate: null,
      endDate: null,
    },
  },
  reducers: {
    addData: (state, action) => {
      state.value.bookingData.push(action.payload);
    },
    deleteData: (state, action) => {
      const index = state.value.bookingData.findIndex(
        (x: Record<string, number>) => x.Id === action.payload.Id,
      );
      state.value.bookingData.splice(index, 1);
    },
    updateData: (state, action) => {
      const index = state.value.bookingData.findIndex(
        (x: Record<string, number>) => x.Id === action.payload.Id,
      );
      state.value.bookingData[index] = action.payload;
    },
  },
});

export const { addData, deleteData, updateData } = dateSlice.actions;

export default dateSlice.reducer;
