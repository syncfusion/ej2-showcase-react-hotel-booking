import * as React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { type AnyAction } from '@reduxjs/toolkit';
import {
  Browser,
  isNullOrUndefined,
  L10n,
  Internationalization,
} from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { DateTimePickerComponent, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import {
  DropDownListComponent,
  type ChangeEventArgs,
} from '@syncfusion/ej2-react-dropdowns';
import {
  NumericTextBoxComponent,
  TextBoxComponent,
} from '@syncfusion/ej2-react-inputs';
import {
  ScheduleComponent,
  Inject,
  TimelineMonth,
  ResourcesDirective,
  ResourceDirective,
  ViewsDirective,
  ViewDirective,
  type EventRenderedArgs,
  type EventSettingsModel,
  type ActionEventArgs,
  type EJ2Instance,
  type ResourceDetails,
  type PopupCloseEventArgs,
  type PopupOpenEventArgs,
  setTime,
  addDays,
} from '@syncfusion/ej2-react-schedule';
import { addData, deleteData, updateData } from '../../redux/Bookings';
import SvgIcon from './SvgIcon';
import './Schedule.css';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';

L10n.load({
  'en-US': {
    schedule: {
      newEvent: 'New Booking Details',
    },
  },
});

const Schedule = (props: Record<string, any>): React.JSX.Element => {
  const dispatch: React.Dispatch<AnyAction> = useDispatch();
  const [reduxDate, floorData, roomData, bookingData, borderColor]: any =
    useSelector(
      (state: Record<string, any>) => [
        state.dateModifier.value,
        state.roomModifier.value.floorData,
        state.roomModifier.value.roomData,
        state.bookingModifier.value.bookingData,
        state.roomModifier.value.borderColor,
      ]
    );
  const currentDate: Date = new Date(
    reduxDate.year,
    reduxDate.month,
    reduxDate.day,
  );
  const checkInRef: React.MutableRefObject<any> = React.useRef<any>(null);
  const checkOutRef: React.MutableRefObject<any> = React.useRef<any>(null);
  const nightRef: React.MutableRefObject<any> = React.useRef<any>(null);
  const priceRef: React.MutableRefObject<any> = React.useRef<any>(null);
  const roomsRef: React.MutableRefObject<any> = React.useRef<any>(null);
  const scheduleObj = React.useRef<ScheduleComponent>(null);
  const intl: Internationalization = new Internationalization();
  const toastObj = React.useRef<ToastComponent>(null);
  const toastWidth = Browser.isDevice ? "300px" : "580px";
  const position: Record<string, any> = { X: "Right", Y: "Bottom" };
  const eventSettings: EventSettingsModel = {
    dataSource: bookingData,
    fields: {
      subject: { name: 'GuestName' },
      startTime: { name: 'CheckIn' },
      endTime: { name: 'CheckOut' },
    },
  };

  const proofData: Record<string, any>[] = [
    { Name: 'Passport', Value: '0' },
    { Name: 'Driving License', Value: '1' }
  ];
  const proofFields: Record<string, any> = { text: 'Name', value: 'Value' };

  const getDateHeaderDay = (value: Date): string =>
    intl.formatDate(value, { skeleton: 'E' });
  const getDateHeaderDate = (value: Date): string =>
    intl.formatDate(value, { skeleton: 'd' });
  const dateHeaderTemplate = (props: any): React.JSX.Element => {
    return (
      <React.Fragment>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getDateHeaderDay(props.date)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {getDateHeaderDate(props.date)}
        </div>
      </React.Fragment>
    );
  };

  const getPrice = (index: number): number => {
    return scheduleObj.current?.getResourcesByIndex(index)?.resourceData?.price;
  };

  const cellTemplate = (data: Record<string, any>): React.JSX.Element => {
    if (data.type === 'monthCells') {
      return (
        <div className="template-wrap">
          <span className="price-tag">{`$${getPrice(data.groupIndex)}`}</span>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const onCellRendered = (args: any): void => {
    const today = new Date();
    today.setDate(today.getDate() - 1); 
    if(args.elementType === "monthCells") {
      if(args.date < today) { 
        args.element.classList.add('past-cell');
      }
    }
  }

  const eventTemplate = (data: Record<string, any>): React.JSX.Element => {
    const imageColor: string = getBorderColor(data.Room, data.Floor);
    return (
      <div className="template-wrap">
        <SvgIcon
          color={imageColor}
          subject={data.GuestName}
          child={data.Child}
          adult={data.Adults}
          night={data.Nights}
        />
      </div>
    );
  };

  const onPopupOpen = (args: PopupOpenEventArgs): void => {
    if ((args.target && !args.target.classList.contains('e-appointment') && (args.type === 'QuickInfo')) || (args.type === 'Editor')) {
      args.cancel = onEventCheck(args);
      if(args.cancel) {
        return;
      }
    }
    const popupType: string[] = ['Editor', 'RecurrenceAlert', 'DeleteAlert'];
    if (popupType.includes(args.type)) {
      const target = ['DeleteAlert', 'RecurrenceAlert'].includes(args.type)
        ? args.element
        : args.target;
      if (target?.classList.contains('e-work-cells')) {
        args.cancel =
          target.classList.contains('e-read-only-cells') ||
          !scheduleObj.current?.isSlotAvailable(
            args.data as Record<string, any>,
          );
      }
      const errorTarget: HTMLElement = document.getElementById(
        'EventType_Error',
      ) as HTMLElement;
      if (!isNullOrUndefined(errorTarget)) {
        errorTarget.style.display = 'none';
        errorTarget.style.left = '351px';
      }
      setTimeout(() => {
        const formElement = args.element.querySelector('.e-schedule-form');
        if (formElement == null) return;
        const validator = (formElement as EJ2Instance).ej2_instances[0];
        validator.addRules('guestName', { required: true });
        validator.addRules('child', { required: true });
        validator.addRules('adults', { required: true });
        validator.addRules('purpose', { required: true });
        validator.addRules('proofNumber', { required: true });
        validator.addRules('email', { required: true });
        validator.addRules('guestProof', { required: true });
        validator.addRules('contactNumber', { required: true , minLength: [minValidation, 'Please enter a valid phone number.'] });
      }, 100);
    }
  };

  const minValidation = (args: any) => {
    return args['value'].length >= 10;
  };

  const onPopupClose = (args: PopupCloseEventArgs): void => {
    if (args.type === 'Editor' && args.data) {
      const formElement: any = args.element.querySelectorAll(
        '.custom-event-editor .e-lib[data-name]',
      );
      const elements: HTMLElement[] = Array.from<HTMLElement>(formElement);
      const eventObj: Record<string, any> = args.data as Record<string, any>;
      for (const element of elements) {
        const fieldName: string = element.dataset.name as string;
        const instance: any = (element as EJ2Instance).ej2_instances[0];
        if (instance) {
          eventObj[fieldName] = instance.value;
        }
      }
      args.data = eventObj;
    }
  };

  const timeChanged = (): void => {
    if (checkInRef.current.value && checkOutRef.current.value) {
      if(checkInRef.current.value > checkOutRef.current.value) { 
        checkOutRef.current.value = addDays(checkInRef.current.value, 1)
      }
      const noOfNights: number = calculateNights(
        checkInRef.current.value,
        checkOutRef.current.value,
      );
      let roomPrice: number = priceRef.current.value;
      if (noOfNights >= 1) {
        roomPrice = getPrice(roomsRef.current.value) * noOfNights;
      }
      nightRef.current.value = noOfNights;
      priceRef.current.value = roomPrice;
    }
  };

  const getRoomIndex = (id: number, name: string): number => {
    const roomIndex: number = scheduleObj.current?.getIndexFromResourceId(
      id,
      name,
    ) as number;
    return roomIndex;
  };

  const onFloorsChange = (args: ChangeEventArgs): void => {
      roomsRef.current.query = new Query().where('groupId', 'equal', args.value as string | number);
    const rooms: Array<Record<string, any>> =
      scheduleObj.current?.getResourceCollections()[1].dataSource as any;
    const data = rooms.find(
      (room: Record<string, any>) => room.groupId === args.value,
    ) as Record<string, any>;
    roomsRef.current.value = data.id;
    priceRef.current.value = data.price;
  };

  const onRoomsChange = (args: ChangeEventArgs): void => {
    const roomIndex: number = getRoomIndex(args.value as number, 'Rooms');
    const priceData: ResourceDetails = scheduleObj.current?.getResourcesByIndex(
      roomIndex,
    ) as ResourceDetails;
    priceRef.current.value =
      priceData?.resourceData?.price * nightRef.current.value;
  };

  const calculateNights = (checkIn: Date, checkOut: Date): number => {
    let noOfNights: number = 0;
    if (checkIn && checkOut) {
      const timeDifference: number = checkOut.getTime() - checkIn.getTime();
      const differenceInDays: number = timeDifference / (1000 * 60 * 60 * 24);
      noOfNights = Math.ceil(differenceInDays);
    }
    return noOfNights;
  };

  const disabledDate = (args: RenderDayCellEventArgs): void => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
        if(args.date < today) {
          args.isDisabled = true;
        }
  }

  const checkOutValidation = (args: any): void => { 
    const checkIn: Date = checkInRef.current.value;
    if(checkIn) { 
      if(args.date < checkIn) { 
        args.isDisabled = true;
      }
    }
  }

  const editorTemplate = (data: Record<string, any>): React.JSX.Element => {
    const noOfNights: number = calculateNights(data.CheckIn, data.CheckOut);
    const roomIndex: number = getRoomIndex(data.Room, 'Rooms');
    const priceData: ResourceDetails = scheduleObj.current?.getResourcesByIndex(
      roomIndex,
    ) as ResourceDetails;
    const roomPrice: any = priceData?.resourceData?.price;
    const checkInTime = setTime(
      data.CheckIn instanceof Date 
        ? data.CheckIn 
        : new Date(data.CheckIn as string | number), 
      12*60*60*1000
    );
    const checkOutTime = setTime(
      data.CheckOut instanceof Date 
        ? data.CheckOut 
        : new Date(data.CheckOut as string | number), 
      12*60*60*1000
    );
    const childCount: any = data.Child;
    const adultCount: number = data.Adults;
    return (
      <div
        className={`custom-event-editor ${Browser.isDevice ? 'e-device' : ''}`}>
        <div className="flex-prop">
          <TextBoxComponent
            id="guestName"
            floatLabelType="Always"
            placeholder="Guest Name *"
            data-name="GuestName"
            type="text"
            value={data.GuestName || ''}
          />
        </div>
        <div className="flex-prop">
          <DateTimePickerComponent
            ref={checkInRef}
            id="checkIn"
            placeholder="Check In *"
            floatLabelType="Always"
            data-name="CheckIn"
            format="dd/MM/yy hh:mm a"
            value={ checkInTime }
            change={timeChanged}
            renderDayCell={disabledDate}
            showClearButton={false}
          />
        </div>
        <div className="flex-prop">
          <DropDownListComponent
            id="floorNumber"
            placeholder="Select Floor *"
            floatLabelType="Always"
            data-name="Floor"
            dataSource={floorData}
            fields={{ text: 'text', value: 'id' }}
            value={data.Floor}
            change={onFloorsChange}
          />
        </div>
        <div className="flex-prop">
          <DropDownListComponent
            ref={roomsRef}
            id="roomNumber"
            placeholder="Select Property *"
            floatLabelType="Always"
            data-name="Room"
            dataSource={roomData}
            query={new Query().where('groupId', 'equal', data.Floor)}
            fields={{ text: 'text', value: 'id' }}
            value={data.Room}
            change={onRoomsChange}
          />
        </div>
        <div className="flex-prop">
          <TextBoxComponent
            ref={priceRef}
            id="roomPrice"
            placeholder="Price per night (USD) *"
            floatLabelType="Always"
            data-name="Price"
            type="Number"
            disabled={true}
            value={roomPrice}
          />
        </div>
        <div className="flex-prop">
          <NumericTextBoxComponent
            ref={nightRef}
            id="nights"
            placeholder="Nights *"
            floatLabelType="Always"
            data-name="Nights"
            format="###.##"
            disabled={true}
            min={1}
            max={9}
            value={data.Nights || noOfNights}
          />
        </div>
        <div className="flex-prop">
          <NumericTextBoxComponent
            id="adults"
            placeholder="Adults *"
            floatLabelType="Always"
            data-name="Adults"
            format="###.##"
            min={1}
            max={30}
            value={adultCount}
          />
        </div>
        <div className="flex-prop">
          <NumericTextBoxComponent
            id="child"
            placeholder="Children *"
            floatLabelType="Always"
            data-name="Child"
            format="###.##"
            min={0}
            max={10}
            value={childCount}
          />
        </div>
        <div className="flex-prop">
          <DateTimePickerComponent
            ref={checkOutRef}
            id="checkOut"
            placeholder="Check Out *"
            floatLabelType="Always"
            data-name="CheckOut"
            format="dd/MM/yy hh:mm a"
            change={timeChanged}
            value={checkOutTime}
            renderDayCell={checkOutValidation}
            showClearButton={false}
          />
        </div>
        <div className="flex-prop">
          <TextBoxComponent
            id="purpose"
            floatLabelType="Always"
            placeholder="Purpose"
            data-name="Purpose"
            type="text"
            value={data.Purpose || ''}
          />
        </div>
        <div className="flex-prop">
          <DropDownListComponent
            id="guestProof"
            data-name="Proof"
            floatLabelType="Always"
            placeholder="Proof of Guest"
            dataSource={proofData}
            fields={proofFields}
            value={data.Proof || ''}
          />
        </div>
        <div className="flex-prop">
          <TextBoxComponent
            id="proofNumber"
            floatLabelType="Always"
            placeholder="Proof Number"
            data-name="ProofNumber"
            type="text"
            value={data.ProofNumber || ''}
          />
        </div>
        <div className="flex-prop">
          <TextBoxComponent
            id="email"
            floatLabelType="Always"
            placeholder="Email"
            data-name="Email"
            type="email"
            value={data.Email || ''}
          />
        </div>
        <div className="flex-prop">
          <TextBoxComponent
            id="contactNumber"
            floatLabelType="Always"
            placeholder="Contact Number"
            data-name="ContactNumber"
            type="number"
            value={data.ContactNumber || ''}
          />
        </div>
      </div>
    );
  };

  const onEventRendered = (args: EventRenderedArgs): void => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    if(args.data.CheckOut < today) { 
      args.element.classList.add('e-read-only');
    }
    applyCategoryColor(args);
    const workCell: Element = scheduleObj.current?.element.querySelector(
      '.e-work-cells:not(.e-resource-group-cells)',
    ) as Element;
    setTimeout(() => {
      args.element.style.height = `${workCell.clientHeight - 4}px`;
    }, 100);
  };

  const applyCategoryColor = (args: EventRenderedArgs): void => {
    const roomId: number = args.data.Room;
    const floorId: number = args.data.Floor;
    const borderColor = getBorderColor(roomId, floorId);
    args.element.style.setProperty(
      'border',
      `1px solid ${borderColor}`,
      'important',
    );
  };

  const getBorderColor = (roomId: number, floorId: number): string => {
    const key: string = `${roomId}_${floorId}`;
    return borderColor[key] || '#000';
  };

  const onActionBegin = (args: ActionEventArgs): void => {
    let slotAvail: boolean = false;
    if (
      ['eventCreate', 'eventChange', 'eventRemove'].includes(args.requestType)
    ) {
      args.cancel = true;
      switch (args.requestType) {
        case 'eventCreate':
          args.addedRecords?.forEach((data: Record<string, any>) => {
            if (scheduleObj.current?.isSlotAvailable(data)) {
              slotAvail = true;
              data.CheckIn = data.CheckIn.toISOString();
              data.CheckOut = data.CheckOut.toISOString();
              dispatch(addData(data));
              toastObj.current.content = "Booking has been created successfully.";
              toastObj.current.cssClass = "e-toast-success";
              toastObj.current.show();
            }
          });
          break;
        case 'eventChange':
          args.changedRecords?.forEach((data: Record<string, any>) => {
            if (scheduleObj.current?.isSlotAvailable(data)) {
              slotAvail = true;
              data.CheckIn = data.CheckIn.toISOString();
              data.CheckOut = data.CheckOut.toISOString();
              dispatch(updateData(data));
              toastObj.current.content = "Booking has been updated successfully.";
              toastObj.current.cssClass = "e-toast-success";
              toastObj.current.show();
            }
          });
          break;
        case 'eventRemove':
          args.deletedRecords?.forEach((data: Record<string, any>) => {
            slotAvail = true;
            data.CheckIn = data.CheckIn.toISOString();
            data.CheckOut = data.CheckOut.toISOString();
            dispatch(deleteData(data));
            toastObj.current.content = "Booking has been deleted successfully.";
            toastObj.current.cssClass = "e-toast-success";
            toastObj.current.show();
          });
          break;
      }
      if(!slotAvail) {
        toastObj.current.content = "Room not available for booking on the selected Dates.";
        toastObj.current.cssClass = "e-toast-warning";
        toastObj.current.show();
      }
    }
    
  };

  const onEventCheck = (args: Record<string, any>): boolean => {
    let eventObj: Record<string, any> = args.data instanceof Array ? args.data[0] : args.data;
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return (eventObj.CheckIn < today);
  }

  return (
    <div>
    <ScheduleComponent
      ref={scheduleObj}
      cssClass="app-scheduler"
      width="100%"
      height={`${window.innerHeight - 160}px`}
      selectedDate={currentDate}
      workDays={[0, 1, 2, 3, 4, 5, 6]}
      eventSettings={eventSettings}
      group={{
        resources: ['Floors', 'Rooms'],
        enableCompactView: false,
      }}
      dateHeaderTemplate={dateHeaderTemplate}
      cellTemplate={cellTemplate}
      timeScale={{ enable: false }}
      rowAutoHeight={true}
      editorTemplate={editorTemplate}
      eventRendered={onEventRendered}
      actionBegin={onActionBegin}
      popupOpen={onPopupOpen}
      popupClose={onPopupClose}
      showQuickInfo={Browser.isDevice ? true : false}
      allowDragAndDrop={false}
      showHeaderBar={false}
      renderCell={onCellRendered}
      >
      <ResourcesDirective>
        <ResourceDirective
          field="Floor"
          title="Floors"
          name="Floors"
          dataSource={floorData}
          textField="text"
          idField="id"
          colorField="color"
        />
        <ResourceDirective
          field="Room"
          title="Rooms"
          name="Rooms"
          dataSource={roomData}
          textField="text"
          idField="id"
          groupIDField="groupId"
          colorField="color"
        />
      </ResourcesDirective>
      <ViewsDirective>
        <ViewDirective option="TimelineMonth" eventTemplate={eventTemplate} />
      </ViewsDirective>
      <Inject services={[TimelineMonth]} />
    </ScheduleComponent>
    <ToastComponent
      ref={toastObj}
      position={position}
      width={toastWidth}
      height="70px"
      showCloseButton={true}
    ></ToastComponent>
    </div>
  );
};

export default Schedule;
