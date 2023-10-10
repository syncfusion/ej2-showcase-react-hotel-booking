import * as React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import {
  CheckBoxComponent,
  type ChangeEventArgs,
} from '@syncfusion/ej2-react-buttons';
import {
  addRoomData,
  addRoomAllData,
  removeRoomData,
  removeRoomAllData,
} from '../../redux/Room';
import Availability from './Availability';
import './Filters.css';

const FloorsFilter = () => {
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const [floorData, floors]: Array<Array<Record<string, any>>> = useSelector(
    (state: any) => [
      state.roomModifier.value.floors,
      state.roomModifier.value.floorData,
    ],
    shallowEqual,
  );
  const initialCheckboxStates: boolean[] = floorData.map(
    (data: Record<string, any>) => !!floors.find(floor => floor.id === data.id),
  );
  const [checkboxAllState, setCheckboxAllState] =
    React.useState<boolean>(false);
  const [checkboxStates, setCheckboxStates] = React.useState<boolean[]>(
    initialCheckboxStates,
  );

  const onCheckboxChange = (args: ChangeEventArgs, index: number): void => {
    const newCheckboxStates: boolean[] = [...checkboxStates];
    newCheckboxStates[index] = args.checked as boolean;
    setCheckboxStates(newCheckboxStates);
    const allChecked: boolean = newCheckboxStates.every(
      (data: boolean) => data,
    );
    if (allChecked !== checkboxAllState) {
      setCheckboxAllState(allChecked);
    }
    dispatch(
      args.checked === true ? addRoomData(index) : removeRoomData(index),
    );
  };

  const onCheckboxChangeAll = (args: ChangeEventArgs): void => {
    const newCheckboxStates: boolean[] = [...checkboxStates];
    newCheckboxStates.forEach((_data: boolean, index: number) => {
      newCheckboxStates[index] = args.checked as boolean;
    });
    setCheckboxStates(newCheckboxStates);
    setCheckboxAllState(args.checked as boolean);
    dispatch(
      args.checked === true ? addRoomAllData(true) : removeRoomAllData(false),
    );
  };

  return (
    <div className="checkbox-filter-container">
      <div className="floor-filter">
        <div className="filter-checkbox">
          <CheckBoxComponent
            label="Select All"
            checked={checkboxAllState}
            change={onCheckboxChangeAll}
          />
        </div>
      </div>
      {floorData.map((item: Record<string, any>, index: number) => (
        <div className="floor-filter" key={item.id}>
          <div className="filter-checkbox">
            <CheckBoxComponent
              label={item.text}
              checked={checkboxStates[index]}
              change={args => {
                onCheckboxChange(args, index);
              }}
            />
          </div>
          <Availability item={item}></Availability>
        </div>
      ))}
    </div>
  );
};

export default FloorsFilter;
