import { type Slice, createSlice } from '@reduxjs/toolkit';

const floorData: Array<Record<string, any>> = [
  { text: 'Ground Floor', id: 1, color: '#cb6bb2' },
  { text: 'First Floor', id: 2, color: '#56ca85' },
  { text: 'Second Floor', id: 3, color: '#df5286' },
  { text: 'Third Floor', id: 4, color: '#df5286' },
  { text: 'Fourth Floor', id: 5, color: '#df5286' },
];

const featuresData: Array<Record<string, any>> = [
  { id: 1, name: 'Television' },
  { id: 2, name: 'Projector' },
  { id: 3, name: 'Balcony' },
  { id: 4, name: 'Whiteboard' },
  { id: 5, name: 'Kitchen' },
  { id: 6, name: 'Internet' },
];

const roomData: Array<Record<string, any>> = [
  {
    text: 'Alpha Room',
    id: 1,
    groupId: 1,
    color: '#FDF4FF',
    price: 500,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
      { id: 6, name: 'Internet' },
    ],
  },
  {
    text: 'Beta Room',
    id: 2,
    groupId: 1,
    color: '#F0FDF4',
    price: 400,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
    ],
  },
  {
    text: 'Delta Room',
    id: 3,
    groupId: 1,
    color: '#ECE7FF',
    price: 250,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
    ],
  },
  {
    text: 'Gamma Room',
    id: 4,
    groupId: 1,
    color: '#ECFEFF',
    price: 150,
    amenities: [{ id: 1, name: 'Television' }],
  },
  {
    text: 'Teta Room',
    id: 5,
    groupId: 2,
    color: '#FDF2F8',
    price: 500,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
      { id: 6, name: 'Internet' },
    ],
  },
  {
    text: 'Zeta Room',
    id: 6,
    groupId: 2,
    color: '#FFF7ED',
    price: 400,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
    ],
  },
  {
    text: 'Alpha Room',
    id: 7,
    groupId: 2,
    color: '#FDF4FF',
    price: 250,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
    ],
  },
  {
    text: 'Beta Room',
    id: 8,
    groupId: 2,
    color: '#ECFEFF',
    price: 150,
    amenities: [{ id: 1, name: 'Television' }],
  },
  {
    text: 'Alpha Room',
    id: 9,
    groupId: 3,
    color: '#FDF4FF',
    price: 500,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
      { id: 6, name: 'Internet' },
    ],
  },
  {
    text: 'Beta Room',
    id: 10,
    groupId: 3,
    color: '#F0FDF4',
    price: 400,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
    ],
  },
  {
    text: 'Delta Room',
    id: 11,
    groupId: 3,
    color: '#ECE7FF',
    price: 250,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
    ],
  },
  {
    text: 'Gamma Room',
    id: 12,
    groupId: 3,
    color: '#ECFEFF',
    price: 150,
    amenities: [{ id: 1, name: 'Television' }],
  },
  {
    text: 'Teta Room',
    id: 13,
    groupId: 4,
    color: '#FDF2F8',
    price: 500,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
      { id: 6, name: 'Internet' },
    ],
  },
  {
    text: 'Zeta Room',
    id: 14,
    groupId: 4,
    color: '#FFF7ED',
    price: 400,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
    ],
  },
  {
    text: 'Alpha Room',
    id: 15,
    groupId: 4,
    color: '#FDF4FF',
    price: 250,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
    ],
  },
  {
    text: 'Beta Room',
    id: 16,
    groupId: 4,
    color: '#ECFEFF',
    price: 150,
    amenities: [{ id: 1, name: 'Television' }],
  },
  {
    text: 'Alpha Room',
    id: 17,
    groupId: 5,
    color: '#FDF4FF',
    price: 500,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
      { id: 6, name: 'Internet' },
    ],
  },
  {
    text: 'Beta Room',
    id: 18,
    groupId: 5,
    color: '#F0FDF4',
    price: 400,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
      { id: 4, name: 'Whiteboard' },
      { id: 5, name: 'Kitchen' },
    ],
  },
  {
    text: 'Delta Room',
    id: 19,
    groupId: 5,
    color: '#ECE7FF',
    price: 250,
    amenities: [
      { id: 1, name: 'Television' },
      { id: 2, name: 'Projector' },
      { id: 3, name: 'Balcony' },
    ],
  },
  {
    text: 'Gamma Room',
    id: 20,
    groupId: 5,
    color: '#ECFEFF',
    price: 150,
    amenities: [{ id: 1, name: 'Television' }],
  },
];

const colorMappings: Record<string, string> = {
  '1_1': '#E879F9',
  '2_1': '#4ADE80',
  '3_1': '#6F47FF',
  '4_1': '#22D3EE',
  '5_2': '#F472B6',
  '6_2': '#FDBA74',
  '7_2': '#C084FC',
  '8_2': '#22D3EE',
  '9_3': '#E879F9',
  '10_3': '#4ADE80',
  '11_3': '#6F47FF',
  '12_3': '#22D3EE',
  '13_4': '#F472B6',
  '14_4': '#FDBA74',
  '15_4': '#C084FC',
  '16_4': '#22D3EE',
  '17_5': '#E879F9',
  '18_5': '#4ADE80',
  '19_5': '#6F47FF',
  '20_5': '#22D3EE',
};

export const roomSlice: Slice<any> = createSlice({
  name: 'Rooms',
  initialState: {
    value: {
      floorData: [
        { text: 'Ground Floor', id: 1, color: '#cb6bb2' },
        { text: 'First Floor', id: 2, color: '#56ca85' },
      ],
      roomData,
      priceRange: [200, 300],
      roomPrice: 0,
      checkboxes: [],
      floors: floorData,
      features: featuresData,
      isMobile: null,
      borderColor: colorMappings,
    },
  },
  reducers: {
    addRoomData: (state, action) => {
      const filteredFloor: any = floorData.find(
        (item: Record<string, any>) => item.id === action.payload + 1,
      );
      state.value.floorData.splice(action.payload, 0, filteredFloor);
    },
    addRoomAllData: state => {
      state.value.floorData = floorData;
    },
    removeRoomData: (state, action) => {
      const index: number = state.value.floorData.findIndex(
        (x: Record<string, any>) => x.id === action.payload + 1,
      );
      state.value.floorData.splice(index, 1);
    },
    removeRoomAllData: state => {
      state.value.floorData = [];
    },
    addFeaturesData: (state, action) => {
      state.value.roomData = [];
      state.value.checkboxes = action.payload;
      const filteredRoomAmities: Array<Record<string, any>> = roomData.filter(
        (room: Record<string, any>) =>
          action.payload.every((amenityId: number) =>
            room.amenities.some(
              (amenity: Record<string, any>) => amenity.id === amenityId + 1,
            ),
          ),
      );
      filteredRoomAmities.forEach((item: Record<string, any>) =>
        state.value.roomData.push(item),
      );
    },
    priceFilter: (state, action) => {
      const roomsToFilter = state.value.roomData;
      state.value.roomData = [];
      roomsToFilter.forEach((item: Record<string, any>) => {
        if (
          item.price >= action.payload[0] &&
          item.price <= action.payload[1]
        ) {
          state.value.roomData.push(item);
        }
      });
    },
    searchFilter: (state, action) => {
      const roomsToFilter = state.value.roomData;
      state.value.roomData = [];
      roomsToFilter.forEach((item: Record<string, any>) => {
        if (item.text.toLowerCase().includes(action.payload.toLowerCase())) {
          state.value.roomData.push(item);
        }
      });
    },
    resetRoomData: state => {
      state.value.roomData = roomData;
    },
    updatePriceSlider: (state, action) => {
      state.value.priceRange = action.payload;
    },
  },
});

export const {
  addRoomData,
  addRoomAllData,
  removeRoomData,
  removeRoomAllData,
  addFeaturesData,
  priceFilter,
  searchFilter,
  resetRoomData,
  updatePriceSlider,
} = roomSlice.actions;

export default roomSlice.reducer;
