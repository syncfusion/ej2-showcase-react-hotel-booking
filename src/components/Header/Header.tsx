import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import { Browser, Internationalization } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
  type EJ2Instance,
  addDays,
  resetTime,
  type ScheduleComponent,
  setTime,
} from '@syncfusion/ej2-react-schedule';
import Plus from '../../assets/images/plus.svg';
import Filter from '../../assets/images/filter.svg';
import { updateCurrentDate } from '../../redux/CurrentDate';
import { resetRoomData, searchFilter } from '../../redux/Room';
import './Header.css';

const Header = (props: Record<string, any>): React.JSX.Element => {
  const intl: Internationalization = new Internationalization();
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const currentDate: Record<string, number> = useSelector(
    (state: Record<string, any>) => state.dateModifier.value,
  );

  const handleClick = (): void => {
    props.onButtonClick();
  };

  const handleOpenEditor = (): void => {
    if(props.showSchedule) { 
      const scheduler = document.querySelector<HTMLElement>('.app-scheduler');
    const scheduleObj: ScheduleComponent = (scheduler as EJ2Instance)
      ?.ej2_instances[0] as ScheduleComponent;
    const selectedCells: Element[] =
      scheduleObj?.getSelectedCells() as Element[];
    const cellDetails = scheduleObj?.getCellDetails(selectedCells);
    const details = scheduleObj?.getResourcesByIndex(
      (cellDetails?.groupIndex as number) ?? 1,
    );
    const cellData: Record<string, any> = {
      CheckIn: cellDetails?.startTime ?? resetTime(new Date()),
      CheckOut: cellDetails?.endTime ?? addDays(resetTime(new Date()), 1),
      IsAllDay: cellDetails?.isAllDay ?? false,
      ...(details.groupData as any),
      Price: details.resourceData.price,
    };
    scheduleObj?.openEditor(cellData, 'Add', true);
    }
  };

  const onMonthChange = (direction: string): void => {
    dispatch(
      updateCurrentDate({
        year: currentDate.year,
        month:
          direction === 'next' ? currentDate.month + 1 : currentDate.month - 1,
        day: currentDate.day,
      }),
    );
  };

  const onSearchChange = (event: Record<string, string>): void => {
    const searchFieldString: string = event.value.toLocaleLowerCase();
    if (searchFieldString === '') {
      dispatch(resetRoomData(''));
    } else {
      dispatch(searchFilter(searchFieldString));
    }
  };

  return (
    <React.Fragment>
      {!Browser.isDevice && (
        <div className="search-container">
          <TextBoxComponent
            cssClass="app-search"
            placeholder="Search Room"
            width={200}
            onChange={onSearchChange}
            showClearButton = {true}
          />
        </div>
      )}
      <div className="navigation-container">
        <div className="e-btn-group e-outline">
          <ButtonComponent
            iconCss="e-icons e-chevron-left"
            onClick={onMonthChange.bind(null, 'prev')}
          />
          <ButtonComponent
            content={intl.formatDate(
              new Date(currentDate.year, currentDate.month, currentDate.day),
              { format: 'MMMM y' },
            )}
            readOnly={true}
          />
          <ButtonComponent
            iconCss="e-icons e-chevron-right"
            onClick={onMonthChange.bind(null, 'next')}
          />
        </div>
      </div>
      <div className="button-container">
        <ButtonComponent className="filter-button" onClick={handleClick}>
          <img src={Filter}></img>
        </ButtonComponent>
        <ButtonComponent className="new-button" onClick={handleOpenEditor}>
          <img src={Plus}></img>
          <div className={Browser.isDevice ? 'e-device' : ''}>New Booking</div>
        </ButtonComponent>
      </div>
    </React.Fragment>
  );
};

export default Header;
