import * as React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import {
  SliderComponent,
  type TooltipDataModel,
  type ChangedEventArgs,
} from '@syncfusion/ej2-react-inputs';
import {
  priceFilter,
  addFeaturesData,
  updatePriceSlider,
} from '../../redux/Room';
import './Filters.css';

const PriceSlider = () => {
  const sliderObj: React.MutableRefObject<any> =
    React.useRef<SliderComponent>(null);
  const tooltip: TooltipDataModel = {
    placement: 'Before',
    isVisible: true,
    showOn: 'Focus',
  };
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const [checkBoxValues, priceRange]: any[][] = useSelector(
    (state: Record<string, any>) => [
      state.roomModifier.value.checkboxes,
      state.roomModifier.value.priceRange,
    ],
    shallowEqual,
  );
  const [initialRendering, setInitialRendering] = React.useState<boolean>(true);
  const [leftHandlePosition, setLeftHandlePosition] = React.useState<number>(0);
  const [rightHandlePosition, setRightHandlePosition] = React.useState<number>(0);
  const [leftHandleValue, setLeftHandleValue] = React.useState<string>('200');
  const [rightHandleValue, setRightHandleValue] = React.useState<string>('300');
  React.useEffect(()=>{ 
    setTimeout(() => { 
    const sliderFirstHandle = document.querySelector('.price-filter-container .e-slider-container .e-slider .e-handle-first');
    const sliderSecondHandle = document.querySelector('.price-filter-container .e-slider-container .e-slider .e-handle-second');
    const firstRect = sliderFirstHandle.getBoundingClientRect();
    const secondRect = sliderSecondHandle.getBoundingClientRect();
    setLeftHandlePosition(firstRect.left-60);
    setRightHandlePosition(secondRect.left-30);
    }, 100);
    
  },[])
  const onSliderChanged = (args: ChangedEventArgs): void => {
    dispatch(addFeaturesData(checkBoxValues));
    dispatch(priceFilter(args.value));
    dispatch(updatePriceSlider(args.value));
    const sliderFirstHandle = document.querySelector('.price-filter-container .e-slider-container .e-slider .e-handle-first');
    const sliderSecondHandle = document.querySelector('.price-filter-container .e-slider-container .e-slider .e-handle-second');
    const rect1 = sliderFirstHandle.getBoundingClientRect();
    const rect2 = sliderSecondHandle.getBoundingClientRect();
    setLeftHandlePosition(rect1.left-50);
    setRightHandlePosition(rect2.left-30);
    setLeftHandleValue(args.value[0]);
    setRightHandleValue(args.value[1]);
  };

  const sliderFirstHandle = document.querySelector('.price-filter-container .e-slider-container .e-slider .e-handle-first');
  sliderFirstHandle?.addEventListener('mousemove', (e: any) => { 
    if(e.buttons !== 1) return;
    const rect = sliderFirstHandle.getBoundingClientRect();
    setLeftHandlePosition(rect.left-60);
  })

  const sliderSecondHandle = document.querySelector('.price-filter-container .e-slider-container .e-slider .e-handle-second');
  sliderSecondHandle?.addEventListener('mousemove', (e: any) => { 
    if(e.buttons !== 1) return;
    const secondRect = sliderSecondHandle.getBoundingClientRect();
    setRightHandlePosition(secondRect.left-40);
  })

  const onSliderCreated = (): void => {
    if (initialRendering) {
      sliderObj.current.reposition();
      setInitialRendering(false);
    }
  };

  return (
    <div className="price-filter-container">
      <div className="slider-price">
        <span className="slider-label-start" style={{position: 'relative',left:`${leftHandlePosition}px`, transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'}}>${leftHandleValue}</span>
        <span className="slider-label-end" style={{position: 'absolute',left:`${rightHandlePosition}px`, transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'}}>${rightHandleValue}</span>
      </div>
      <SliderComponent
        ref={sliderObj}
        cssClass="app-slider"
        value={priceRange}
        type="Range"
        tooltip={tooltip}
        min={0}
        max={500}
        changed={onSliderChanged}
        created={onSliderCreated}
      />
      
    </div>
  );
};

export default PriceSlider;
