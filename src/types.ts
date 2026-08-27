export type VehicleType = 'Two Wheeler' | 'Car' | 'SUV' | 'Other / EV';

export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'selected';

export interface ParkingSlot {
  id: string; // e.g., "A-01"
  number: string; // "A01"
  floor: string; // "Ground Floor (Zone A)", "Basement 1 (Zone B)", etc.
  floorId: 'G' | 'B1' | 'B2';
  vehicleType: VehicleType;
  status: SlotStatus;
  ratePerHour: number;
  row: number;
  col: number;
  isCovered?: boolean;
  hasEVCharging?: boolean;
  currentBookingId?: string;
}

export interface LocationCategory {
  id: string;
  name: string;
}

export interface ParkingLocation {
  id: string;
  name: string;
  type: 'Mall' | 'Theatre';
  image: string;
  coverImage?: string;
  address: string;
  city: string;
  distanceKm: number;
  rating: number;
  totalReviews: number;
  openingHours: string;
  description: string;
  amenities: string[];
  vehicleRates: {
    'Two Wheeler': number;
    'Car': number;
    'SUV': number;
    'Other / EV': number;
  };
  slots: ParkingSlot[];
}

export type BookingStatus = 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  bookingNumber: string; // e.g., "PRK-94821"
  locationId: string;
  locationName: string;
  locationAddress: string;
  slotNumber: string;
  floor: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationHours: number;
  exitTime: string;
  ratePerHour: number;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  isReservedCategory: boolean; // true = reserved advance, false = unreserved on-spot check-in
  bookingStatus: BookingStatus;
  createdAt: string;
  paymentMethod: string;
  userPhone?: string;
  userEmail?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  savedVehicles: {
    id: string;
    type: VehicleType;
    model: string;
    plateNumber: string;
    isDefault?: boolean;
  }[];
  walletBalance: number;
  totalBookingsCount: number;
}
