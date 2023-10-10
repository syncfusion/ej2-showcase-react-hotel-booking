import * as React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import {
  CalendarComponent,
  type ChangeEventArgs,
  type RenderDayCellEventArgs,
} from '@syncfusion/ej2-react-calendars';
import { updateCurrentDate } from '../../redux/CurrentDate';
import './Calendar.css';

const Calendar = () => {
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const calendarRef = React.useRef<CalendarComponent>(null);
  const reduxDate: Record<string, any> = useSelector(
    (state: Record<string, any>) => state.dateModifier.value,
  );
  const currentDate: Date = new Date(
    reduxDate.year,
    reduxDate.month,
    reduxDate.day,
  );
  const [bookingData, roomData]: Array<Array<Record<string, any>>> =
    useSelector(
      (state: any) => [
        state.bookingModifier.value.bookingData,
        state.roomModifier.value.roomData,
      ],
      shallowEqual,
    );

    React.useEffect(()=>{ 
     calendarRef.current?.refresh();
    },[bookingData])

  const onDateChange = (args: ChangeEventArgs): void => {
    const dateObject: Date = new Date(args.value as Date);
    const year: number = dateObject.getFullYear();
    const month: number = dateObject.getMonth();
    const day: number = dateObject.getDate();
    dispatch(updateCurrentDate({ year, month, day }));
  };

  const onCellRendered = (args: RenderDayCellEventArgs): void => {
    const target: HTMLElement = args.element as HTMLElement;
    if (!target.classList.contains('e-other-month')) {
      const roomsBooked = bookingData.filter((item: any) => {
        let checkIn = new Date(item.CheckIn);
        let checkOut = new Date(item.CheckOut);
        checkIn.setHours(0,0,0,0);
        checkOut.setHours(0,0,0,0);
        if(args.date >= checkIn && args.date <= checkOut) {
          return item;
        }
      });
      if(target) {
        target.classList.remove('available', 'not-available', 'almost-full');
      }
      if (roomsBooked.length < roomData.length / 2) {
        target.classList.add('available');
      }
      else if (roomsBooked.length === roomData.length) {
        target.classList.add('not-available');
      }
      else if (roomsBooked.length >= roomData.length / 2) {
        target.classList.add('almost-full');
      }
    }
    if(args.date.getMonth() < new Date().getMonth()) {
      target.classList.remove('available', 'not-available', 'almost-full');
    }
  };

  return (
    <CalendarComponent
      cssClass="app-calendar"
      change={onDateChange}
      value={currentDate}
      renderDayCell={onCellRendered}
      ref={calendarRef}
    />
  );
};

export default Calendar;
