import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import {
  CheckBoxComponent,
  type ChangeEventArgs,
} from '@syncfusion/ej2-react-buttons';
import { addFeaturesData } from '../../redux/Room';
import './Filters.css';

const FeaturesFilter = () => {
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const roomData: Array<Record<string, any>> = useSelector(
    (state: Record<string, any>) => state.roomModifier.value.features,
  );
  const initialCheckboxStates: boolean[] = roomData.map(
    (_data: Record<string, any>, index: number) => index === 0,
  );
  const [checkboxStates, setCheckboxStates] = React.useState<boolean[]>(
    initialCheckboxStates,
  );

  const onCheckboxChange = (args: ChangeEventArgs, index: number): void => {
    const newCheckboxStates: boolean[] = [...checkboxStates];
    newCheckboxStates[index] = args.checked as boolean;
    setCheckboxStates(newCheckboxStates);
    const selectedIndex: number[] = newCheckboxStates.reduce(
      (acc: number[], value: boolean, index: number) => {
        if (value) {
          acc.push(index);
        }
        return acc;
      },
      [],
    );
    dispatch(addFeaturesData(selectedIndex));
  };

  return (
    <div className="checkbox-filter-container">
      {roomData.map((item: Record<string, any>, index: number) => (
        <div className="filter-checkbox" key={item.id}>
          <CheckBoxComponent
            label={item.name}
            checked={checkboxStates[index]}
            change={args => {
              onCheckboxChange(args, index);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturesFilter;
