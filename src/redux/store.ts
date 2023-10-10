import { configureStore } from '@reduxjs/toolkit';
import dateReducer from './CurrentDate';
import roomReducer from './Room';
import bookingReducer from './Bookings';

export const store = configureStore({
  reducer: {
    dateModifier: dateReducer,
    roomModifier: roomReducer,
    bookingModifier: bookingReducer,
  },
});
