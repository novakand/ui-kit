export interface ISearchHotelOptions {

  paymentMethod: 'account' | 'hotel';
  destination: string;
  hotelName: string;
  nationality: string;
  checkInDate: Date;
  checkOutDate: Date;
  nightsCount: number;
  roomCount: number;

  tags: String[];
  priceFrom: number;
  priceTo: number;
  rating: number;
  facilities: String[];
  carbonFootprint: String[];
  suppliers: String[];
}
