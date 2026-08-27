import { ParkingLocation, ParkingSlot, VehicleType, Booking, UserProfile } from '../types';

// Helper to generate realistic slot layout
const generateSlotsForLocation = (locationPrefix: string, seed: number): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];
  const floors: { id: 'G' | 'B1' | 'B2'; name: string; prefix: string }[] = [
    { id: 'G', name: 'Ground Floor (Zone A)', prefix: 'A' },
    { id: 'B1', name: 'Basement 1 (Zone B)', prefix: 'B' },
    { id: 'B2', name: 'Basement 2 (Zone C)', prefix: 'C' },
  ];

  floors.forEach((floor, floorIdx) => {
    // 16 slots per floor (4 rows x 4 cols)
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 4; c++) {
        const slotIdx = (r - 1) * 4 + c;
        const slotNumber = `${floor.prefix}${slotIdx < 10 ? '0' + slotIdx : slotIdx}`;
        const slotId = `${locationPrefix}-${floor.id}-${slotNumber}`;
        
        // Assign vehicle types logically
        let vehicleType: VehicleType = 'Car';
        if (floor.id === 'G' && (slotIdx <= 4 || slotIdx === 9 || slotIdx === 10)) {
          vehicleType = 'Two Wheeler';
        } else if (floor.id === 'B2' && (slotIdx >= 13)) {
          vehicleType = 'Other / EV';
        } else if (slotIdx % 3 === 0) {
          vehicleType = 'SUV';
        }

        // Determine rate
        const rate = vehicleType === 'Two Wheeler' ? 20 : vehicleType === 'Car' ? 50 : vehicleType === 'SUV' ? 70 : 60;

        // Deterministic pseudo-random status based on seed, floor, and slot
        const pseudoVal = (seed * 17 + floorIdx * 31 + slotIdx * 13) % 100;
        let status: 'available' | 'occupied' | 'reserved' = 'available';
        if (pseudoVal < 42) {
          status = 'occupied';
        } else if (pseudoVal < 65) {
          status = 'reserved';
        } else {
          status = 'available';
        }

        slots.push({
          id: slotId,
          number: slotNumber,
          floor: floor.name,
          floorId: floor.id,
          vehicleType,
          status,
          ratePerHour: rate,
          row: r,
          col: c,
          isCovered: floor.id !== 'G' || slotIdx > 8,
          hasEVCharging: vehicleType === 'Other / EV' || (slotIdx === 1 && floor.id === 'B1'),
        });
      }
    }
  });

  return slots;
};

export const INITIAL_LOCATIONS: ParkingLocation[] = [
  {
    id: 'loc-phoenix',
    name: 'Phoenix Marketcity',
    type: 'Mall',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1600&auto=format&fit=crop&q=80',
    address: '142 Velachery Main Road, Indira Gandhi Nagar',
    city: 'Chennai, TN',
    distanceKm: 1.8,
    rating: 4.8,
    totalReviews: 2450,
    openingHours: '10:00 AM – 11:30 PM',
    description: 'Premier mega shopping mall with high-speed automated multi-level parking, EV charging hubs, and seamless valet drop-off.',
    amenities: ['EV Supercharger', 'Valet Parking', 'Car Wash Bay', 'Disabled Access', 'CCTV 24/7', 'Covered Parking'],
    vehicleRates: {
      'Two Wheeler': 20,
      'Car': 50,
      'SUV': 70,
      'Other / EV': 60,
    },
    slots: generateSlotsForLocation('PHX', 3),
  },
  {
    id: 'loc-vr-mall',
    name: 'VR Mall & Central Hub',
    type: 'Mall',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1600&auto=format&fit=crop&q=80',
    address: 'Jawaharlal Nehru Road, Anna Nagar West',
    city: 'Chennai, TN',
    distanceKm: 3.4,
    rating: 4.7,
    totalReviews: 1890,
    openingHours: '10:00 AM – 11:00 PM',
    description: 'Ultra-modern lifestyle center offering sensor-guided smart parking decks with reserved advance booking privileges.',
    amenities: ['Fast RFID Entry', 'EV Fast Charging', 'Covered Parking', 'Security Escort', 'Tire Pressure Check'],
    vehicleRates: {
      'Two Wheeler': 25,
      'Car': 55,
      'SUV': 75,
      'Other / EV': 65,
    },
    slots: generateSlotsForLocation('VRM', 7),
  },
  {
    id: 'loc-express-avenue',
    name: 'Express Avenue Mall',
    type: 'Mall',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop&q=80',
    address: 'Club House Road, Mount Road, Royapettah',
    city: 'Chennai, TN',
    distanceKm: 4.6,
    rating: 4.6,
    totalReviews: 3120,
    openingHours: '10:00 AM – 10:30 PM',
    description: 'Downtown retail icon featuring multi-tier subterranean parking slots equipped with real-time occupancy indicator LEDs.',
    amenities: ['Covered Basement', 'Valet Parking', 'Automated Pay Booths', 'Disabled Parking', '24/7 Surveillance'],
    vehicleRates: {
      'Two Wheeler': 20,
      'Car': 50,
      'SUV': 70,
      'Other / EV': 60,
    },
    slots: generateSlotsForLocation('EA', 12),
  },
  {
    id: 'loc-pvr-cinemas',
    name: 'PVR Superplex Cinemas',
    type: 'Theatre',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    address: 'Grand Square, Velachery Bypass Road',
    city: 'Chennai, TN',
    distanceKm: 2.1,
    rating: 4.9,
    totalReviews: 1420,
    openingHours: '08:30 AM – 01:30 AM',
    description: '10-Screen luxury cinema destination with guaranteed reserved parking for moviegoers, rapid QR ticket gate clearance.',
    amenities: ['Dedicated Moviegoer Lane', 'Pre-book Guarantee', 'Covered Decks', 'EV Charge Points', '24/7 Security'],
    vehicleRates: {
      'Two Wheeler': 20,
      'Car': 45,
      'SUV': 65,
      'Other / EV': 55,
    },
    slots: generateSlotsForLocation('PVR', 5),
  },
  {
    id: 'loc-inox-theatre',
    name: 'INOX Megaplex & IMAX',
    type: 'Theatre',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop&q=80',
    address: 'City Centre Mall, Dr. Radhakrishnan Salai',
    city: 'Chennai, TN',
    distanceKm: 5.2,
    rating: 4.7,
    totalReviews: 980,
    openingHours: '09:00 AM – 01:00 AM',
    description: 'Premium laser IMAX theatre complex with spacious underground parking lanes and reserved slots synced to show timings.',
    amenities: ['Showtime Sync Booking', 'Valet Service', 'CCTV Monitored', 'Wheelchair Ramp', 'Luggage Assistance'],
    vehicleRates: {
      'Two Wheeler': 20,
      'Car': 50,
      'SUV': 70,
      'Other / EV': 60,
    },
    slots: generateSlotsForLocation('INX', 9),
  },
  {
    id: 'loc-forum-mall',
    name: 'Nexus Vijaya Mall & SPI Cinemas',
    type: 'Mall',
    image: 'https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?w=1600&auto=format&fit=crop&q=80',
    address: '183 Arcot Road, Vadapalani',
    city: 'Chennai, TN',
    distanceKm: 6.0,
    rating: 4.6,
    totalReviews: 2100,
    openingHours: '10:00 AM – 11:00 PM',
    description: 'Integrated mega mall and theatre multiplex with 3 basement parking zones and intelligent vacant-slot indicators.',
    amenities: ['3-Tier Basement', 'Direct Mall Lift Access', 'EV Quick Charging', 'Staff Assisted Parking', 'Fire Safety Systems'],
    vehicleRates: {
      'Two Wheeler': 20,
      'Car': 50,
      'SUV': 70,
      'Other / EV': 60,
    },
    slots: generateSlotsForLocation('NXV', 15),
  },
  {
    id: 'loc-spi-palazzo',
    name: 'SPI Palazzo Theatres',
    type: 'Theatre',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&auto=format&fit=crop&q=80',
    address: 'The Forum Vijaya, Arcot Road',
    city: 'Chennai, TN',
    distanceKm: 6.2,
    rating: 4.9,
    totalReviews: 1650,
    openingHours: '09:00 AM – 02:00 AM',
    description: 'European architectural style cinema palace with priority reserved parking zones for pre-booked patrons.',
    amenities: ['VIP Reserved Bays', 'Express Valet', 'Automated Number Plate Recognition', 'Covered Decks'],
    vehicleRates: {
      'Two Wheeler': 25,
      'Car': 60,
      'SUV': 80,
      'Other / EV': 70,
    },
    slots: generateSlotsForLocation('PLZ', 21),
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-9021',
  name: 'Priyadharshini',
  email: '149priyadharshini@gmail.com',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  walletBalance: 450,
  totalBookingsCount: 3,
  savedVehicles: [
    {
      id: 'veh-1',
      type: 'Car',
      model: 'Honda City (Pearl White)',
      plateNumber: 'TN 09 BX 4289',
      isDefault: true,
    },
    {
      id: 'veh-2',
      type: 'Two Wheeler',
      model: 'Ather 450X (Space Grey)',
      plateNumber: 'TN 07 CA 9102',
      isDefault: false,
    },
    {
      id: 'veh-3',
      type: 'SUV',
      model: 'Hyundai Creta (Deep Forest)',
      plateNumber: 'TN 10 DY 5511',
      isDefault: false,
    },
  ],
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    bookingNumber: 'PRK-84920',
    locationId: 'loc-phoenix',
    locationName: 'Phoenix Marketcity',
    locationAddress: '142 Velachery Main Road, Indira Gandhi Nagar, Chennai',
    slotNumber: 'B08',
    floor: 'Basement 1 (Zone B)',
    vehicleType: 'Car',
    vehicleNumber: 'TN 09 BX 4289',
    date: '2026-08-27',
    time: '18:00',
    durationHours: 3,
    exitTime: '21:00',
    ratePerHour: 50,
    baseAmount: 150,
    taxAmount: 27,
    totalAmount: 177,
    isReservedCategory: true,
    bookingStatus: 'Confirmed',
    createdAt: '2026-08-27T04:30:00Z',
    paymentMethod: 'UPI (GPay)',
    userPhone: '+91 98765 43210',
    userEmail: '149priyadharshini@gmail.com',
  },
  {
    id: 'bk-100',
    bookingNumber: 'PRK-71239',
    locationId: 'loc-pvr-cinemas',
    locationName: 'PVR Superplex Cinemas',
    locationAddress: 'Grand Square, Velachery Bypass Road, Chennai',
    slotNumber: 'A03',
    floor: 'Ground Floor (Zone A)',
    vehicleType: 'Two Wheeler',
    vehicleNumber: 'TN 07 CA 9102',
    date: '2026-08-25',
    time: '19:30',
    durationHours: 3,
    exitTime: '22:30',
    ratePerHour: 20,
    baseAmount: 60,
    taxAmount: 10.8,
    totalAmount: 70.8,
    isReservedCategory: true,
    bookingStatus: 'Completed',
    createdAt: '2026-08-25T14:10:00Z',
    paymentMethod: 'Smart Wallet',
    userPhone: '+91 98765 43210',
    userEmail: '149priyadharshini@gmail.com',
  },
];
