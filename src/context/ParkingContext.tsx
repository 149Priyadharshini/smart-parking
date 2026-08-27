import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ParkingLocation, 
  ParkingSlot, 
  VehicleType, 
  Booking, 
  UserProfile,
  BookingStatus 
} from '../types';
import { INITIAL_LOCATIONS, INITIAL_USER, INITIAL_BOOKINGS } from '../data/mockData';

interface ParkingContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  currentView: 'login' | 'dashboard' | 'malls-theatres' | 'parking-slot' | 'my-bookings' | 'profile';
  selectedLocationId: string | null;
  locations: ParkingLocation[];
  bookings: Booking[];
  searchQuery: string;
  typeFilter: 'all' | 'Mall' | 'Theatre';
  confirmedBooking: Booking | null;
  viewTicketBooking: Booking | null;
  activeBookingModal: {
    isOpen: boolean;
    type: 'reserved' | 'unreserved';
    location: ParkingLocation;
    preselectedSlot?: ParkingSlot;
    preselectedVehicleType?: VehicleType;
  } | null;

  // Actions
  login: (identifier: string, isOtp: boolean) => boolean;
  logout: () => void;
  setCurrentView: (view: 'login' | 'dashboard' | 'malls-theatres' | 'parking-slot' | 'my-bookings' | 'profile') => void;
  setSelectedLocationId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (filter: 'all' | 'Mall' | 'Theatre') => void;
  openBookingModal: (
    location: ParkingLocation, 
    type: 'reserved' | 'unreserved', 
    preselectedSlot?: ParkingSlot, 
    preselectedVehicleType?: VehicleType
  ) => void;
  closeBookingModal: () => void;
  setConfirmedBooking: (booking: Booking | null) => void;
  setViewTicketBooking: (booking: Booking | null) => void;
  
  // Slot & Booking operations
  createReservation: (params: {
    locationId: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    date: string;
    time: string;
    durationHours: number;
    paymentMethod: string;
    preferredSlotId?: string;
  }) => Booking | null;
  
  createUnreservedCheckIn: (params: {
    locationId: string;
    slotId: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    durationHours: number;
    paymentMethod: string;
  }) => Booking | null;

  cancelBooking: (bookingId: string) => boolean;
  extendBooking: (bookingId: string, extraHours: number) => boolean;
  addSavedVehicle: (vehicle: { type: VehicleType; model: string; plateNumber: string }) => void;
  deleteSavedVehicle: (vehicleId: string) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

const LOCATIONS_STORAGE_KEY = 'smart_parking_locations_v1';
const BOOKINGS_STORAGE_KEY = 'smart_parking_bookings_v1';
const USER_STORAGE_KEY = 'smart_parking_user_v1';
const AUTH_STORAGE_KEY = 'smart_parking_auth_v1';

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : true; // Default to logged in for smooth immediate exploration, but user can log out/in anytime
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [locations, setLocations] = useState<ParkingLocation[]>(() => {
    const saved = localStorage.getItem(LOCATIONS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'malls-theatres' | 'parking-slot' | 'my-bookings' | 'profile'>('dashboard');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Mall' | 'Theatre'>('all');
  const [activeBookingModal, setActiveBookingModal] = useState<ParkingContextType['activeBookingModal']>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [viewTicketBooking, setViewTicketBooking] = useState<Booking | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // Auth Handlers
  const login = (identifier: string, _isOtp: boolean) => {
    setIsAuthenticated(true);
    if (!user) {
      setUser({
        ...INITIAL_USER,
        email: identifier.includes('@') ? identifier : 'user@smartpark.com',
        phone: identifier.includes('@') ? '+91 98765 43210' : identifier,
      });
    }
    // Redirect to Malls & Theatres page as specified in requirement 1
    setCurrentView('malls-theatres');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const openBookingModal = (
    location: ParkingLocation,
    type: 'reserved' | 'unreserved',
    preselectedSlot?: ParkingSlot,
    preselectedVehicleType?: VehicleType
  ) => {
    setActiveBookingModal({
      isOpen: true,
      type,
      location,
      preselectedSlot,
      preselectedVehicleType,
    });
  };

  const closeBookingModal = () => {
    setActiveBookingModal(null);
  };

  // Helper to calculate exit time
  const calculateExitTime = (startTimeStr: string, durationHours: number) => {
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationHours * 60;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  // 1. Reserved Parking Flow
  const createReservation = ({
    locationId,
    vehicleType,
    vehicleNumber,
    date,
    time,
    durationHours,
    paymentMethod,
    preferredSlotId,
  }: {
    locationId: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    date: string;
    time: string;
    durationHours: number;
    paymentMethod: string;
    preferredSlotId?: string;
  }): Booking | null => {
    const targetLoc = locations.find((l) => l.id === locationId);
    if (!targetLoc) return null;

    // Find a slot to reserve (either the preferred one or the first available for that vehicle type)
    let chosenSlot: ParkingSlot | undefined;
    if (preferredSlotId) {
      chosenSlot = targetLoc.slots.find((s) => s.id === preferredSlotId && s.status === 'available');
    }
    if (!chosenSlot) {
      chosenSlot = targetLoc.slots.find((s) => s.vehicleType === vehicleType && s.status === 'available');
    }
    if (!chosenSlot) {
      // Any available slot
      chosenSlot = targetLoc.slots.find((s) => s.status === 'available');
    }

    if (!chosenSlot) {
      alert('Sorry, no parking slots are currently available for this vehicle type.');
      return null;
    }

    const rate = targetLoc.vehicleRates[vehicleType] || 50;
    const baseAmount = rate * durationHours;
    const taxAmount = Math.round(baseAmount * 0.18 * 10) / 10;
    const totalAmount = Math.round((baseAmount + taxAmount) * 10) / 10;
    const bookingNumber = `PRK-${Math.floor(10000 + Math.random() * 90000)}`;
    const exitTime = calculateExitTime(time, durationHours);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber,
      locationId: targetLoc.id,
      locationName: targetLoc.name,
      locationAddress: targetLoc.address,
      slotNumber: chosenSlot.number,
      floor: chosenSlot.floor,
      vehicleType,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      date,
      time,
      durationHours,
      exitTime,
      ratePerHour: rate,
      baseAmount,
      taxAmount,
      totalAmount,
      isReservedCategory: true,
      bookingStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
      paymentMethod,
      userEmail: user?.email,
      userPhone: user?.phone,
    };

    // Update the slot status to 'reserved' in the location
    setLocations((prevLocations) =>
      prevLocations.map((loc) => {
        if (loc.id !== locationId) return loc;
        return {
          ...loc,
          slots: loc.slots.map((slot) => {
            if (slot.id === chosenSlot!.id) {
              return {
                ...slot,
                status: 'reserved',
                currentBookingId: newBooking.id,
              };
            }
            return slot;
          }),
        };
      })
    );

    // Append new booking
    setBookings((prev) => [newBooking, ...prev]);

    // Update user stats
    if (user) {
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              totalBookingsCount: prevUser.totalBookingsCount + 1,
            }
          : null
      );
    }

    closeBookingModal();
    setConfirmedBooking(newBooking);
    return newBooking;
  };

  // 2. Unreserved Instant Check-In Flow
  const createUnreservedCheckIn = ({
    locationId,
    slotId,
    vehicleType,
    vehicleNumber,
    durationHours,
    paymentMethod,
  }: {
    locationId: string;
    slotId: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    durationHours: number;
    paymentMethod: string;
  }): Booking | null => {
    const targetLoc = locations.find((l) => l.id === locationId);
    if (!targetLoc) return null;

    const chosenSlot = targetLoc.slots.find((s) => s.id === slotId && s.status === 'available');
    if (!chosenSlot) {
      alert('Selected slot is no longer available. Please select another slot.');
      return null;
    }

    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const todayDateStr = now.toISOString().split('T')[0];

    const rate = targetLoc.vehicleRates[vehicleType] || chosenSlot.ratePerHour || 50;
    const baseAmount = rate * durationHours;
    const taxAmount = Math.round(baseAmount * 0.18 * 10) / 10;
    const totalAmount = Math.round((baseAmount + taxAmount) * 10) / 10;
    const bookingNumber = `CHK-${Math.floor(10000 + Math.random() * 90000)}`;
    const exitTime = calculateExitTime(currentTimeStr, durationHours);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber,
      locationId: targetLoc.id,
      locationName: targetLoc.name,
      locationAddress: targetLoc.address,
      slotNumber: chosenSlot.number,
      floor: chosenSlot.floor,
      vehicleType,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      date: todayDateStr,
      time: currentTimeStr,
      durationHours,
      exitTime,
      ratePerHour: rate,
      baseAmount,
      taxAmount,
      totalAmount,
      isReservedCategory: false,
      bookingStatus: 'Active',
      createdAt: new Date().toISOString(),
      paymentMethod,
      userEmail: user?.email,
      userPhone: user?.phone,
    };

    // Update slot status to 'occupied' in location
    setLocations((prevLocations) =>
      prevLocations.map((loc) => {
        if (loc.id !== locationId) return loc;
        return {
          ...loc,
          slots: loc.slots.map((slot) => {
            if (slot.id === chosenSlot!.id) {
              return {
                ...slot,
                status: 'occupied',
                currentBookingId: newBooking.id,
              };
            }
            return slot;
          }),
        };
      })
    );

    setBookings((prev) => [newBooking, ...prev]);

    if (user) {
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              totalBookingsCount: prevUser.totalBookingsCount + 1,
            }
          : null
      );
    }

    closeBookingModal();
    setConfirmedBooking(newBooking);
    return newBooking;
  };

  // Cancel Booking and dynamically free slot
  const cancelBooking = (bookingId: string): boolean => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, bookingStatus: 'Cancelled' as BookingStatus };
        }
        return b;
      })
    );

    // Free the slot in the location
    setLocations((prev) =>
      prev.map((loc) => {
        if (loc.id !== booking.locationId) return loc;
        return {
          ...loc,
          slots: loc.slots.map((slot) => {
            if (slot.number === booking.slotNumber || slot.currentBookingId === bookingId) {
              return {
                ...slot,
                status: 'available',
                currentBookingId: undefined,
              };
            }
            return slot;
          }),
        };
      })
    );

    return true;
  };

  // Extend booking
  const extendBooking = (bookingId: string, extraHours: number): boolean => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const newDuration = b.durationHours + extraHours;
          const newExit = calculateExitTime(b.time, newDuration);
          const addedBase = b.ratePerHour * extraHours;
          const addedTax = Math.round(addedBase * 0.18 * 10) / 10;
          return {
            ...b,
            durationHours: newDuration,
            exitTime: newExit,
            baseAmount: b.baseAmount + addedBase,
            taxAmount: b.taxAmount + addedTax,
            totalAmount: Math.round((b.totalAmount + addedBase + addedTax) * 10) / 10,
          };
        }
        return b;
      })
    );
    return true;
  };

  const addSavedVehicle = (vehicle: { type: VehicleType; model: string; plateNumber: string }) => {
    if (!user) return;
    const newVeh = {
      id: `veh-${Date.now()}`,
      type: vehicle.type,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber.toUpperCase().trim(),
      isDefault: user.savedVehicles.length === 0,
    };
    setUser({
      ...user,
      savedVehicles: [...user.savedVehicles, newVeh],
    });
  };

  const deleteSavedVehicle = (vehicleId: string) => {
    if (!user) return;
    setUser({
      ...user,
      savedVehicles: user.savedVehicles.filter((v) => v.id !== vehicleId),
    });
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  return (
    <ParkingContext.Provider
      value={{
        isAuthenticated,
        user,
        currentView,
        selectedLocationId,
        locations,
        bookings,
        searchQuery,
        typeFilter,
        activeBookingModal,
        confirmedBooking,
        viewTicketBooking,
        login,
        logout,
        setCurrentView,
        setSelectedLocationId,
        setSearchQuery,
        setTypeFilter,
        openBookingModal,
        closeBookingModal,
        setConfirmedBooking,
        setViewTicketBooking,
        createReservation,
        createUnreservedCheckIn,
        cancelBooking,
        extendBooking,
        addSavedVehicle,
        deleteSavedVehicle,
        updateUserProfile,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
