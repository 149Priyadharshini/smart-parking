import React, { useState, useMemo } from 'react';
import { ParkingLocation, ParkingSlot, VehicleType } from '../types';
import { useParking } from '../context/ParkingContext';
import { 
  Zap, 
  Car, 
  Bike, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';

interface UnreservedParkingProps {
  location: ParkingLocation;
}

export const UnreservedParking: React.FC<UnreservedParkingProps> = ({ location }) => {
  const { openBookingModal } = useParking();

  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<string>('all');

  // CRITICAL REQUIREMENT: Show ONLY currently empty parking slots. Occupied/Reserved slots must NOT be displayed!
  const emptySlots = useMemo(() => {
    return location.slots.filter((slot) => {
      // Must be currently empty / available
      if (slot.status !== 'available') return false;

      // Filter by vehicle type
      if (selectedVehicleFilter !== 'all' && slot.vehicleType !== selectedVehicleFilter) {
        return false;
      }

      // Filter by floor
      if (selectedFloorFilter !== 'all' && slot.floorId !== selectedFloorFilter) {
        return false;
      }

      return true;
    });
  }, [location.slots, selectedVehicleFilter, selectedFloorFilter]);

  const handleSelectSlot = (slot: ParkingSlot) => {
    openBookingModal(location, 'unreserved', slot, slot.vehicleType);
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'Two Wheeler':
        return <Bike className="w-4 h-4 text-blue-600" />;
      case 'SUV':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'Other / EV':
        return <Zap className="w-4 h-4 text-cyan-600" />;
      default:
        return <Car className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getVehicleBadgeColor = (type: VehicleType) => {
    switch (type) {
      case 'Two Wheeler':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SUV':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Other / EV':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" /> Instant On-Spot Check-In
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Unreserved Parking (Live Vacant Slots Only)
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-2xl mt-1">
            Displaying only currently empty and vacant slots ready for immediate physical check-in. Occupied slots are automatically hidden.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center shrink-0 self-stretch sm:self-auto">
          <div className="text-xs text-emerald-200 font-medium">Currently Empty Slots</div>
          <div className="text-xl font-black text-white">{emptySlots.length} Ready</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Vehicle Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Vehicle:
          </span>
          <button
            id="filter-all-vehicles-btn"
            onClick={() => setSelectedVehicleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedVehicleFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Empty Slots
          </button>
          <button
            id="filter-two-wheeler-btn"
            onClick={() => setSelectedVehicleFilter('Two Wheeler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedVehicleFilter === 'Two Wheeler'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Two Wheeler
          </button>
          <button
            id="filter-car-btn"
            onClick={() => setSelectedVehicleFilter('Car')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedVehicleFilter === 'Car'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Car
          </button>
          <button
            id="filter-suv-btn"
            onClick={() => setSelectedVehicleFilter('SUV')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedVehicleFilter === 'SUV'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            SUV
          </button>
          <button
            id="filter-ev-btn"
            onClick={() => setSelectedVehicleFilter('Other / EV')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedVehicleFilter === 'Other / EV'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Other / EV
          </button>
        </div>

        {/* Floor Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Floor Level:
          </span>
          <select
            id="floor-filter-select"
            value={selectedFloorFilter}
            onChange={(e) => setSelectedFloorFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Floors (Ground, B1, B2)</option>
            <option value="G">Ground Floor (Zone A)</option>
            <option value="B1">Basement 1 (Zone B)</option>
            <option value="B2">Basement 2 (Zone C)</option>
          </select>
        </div>

      </div>

      {/* List of Available Empty Slots */}
      {emptySlots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {emptySlots.map((slot) => {
            return (
              <div
                key={slot.id}
                id={`unreserved-slot-card-${slot.number}`}
                className="bg-white rounded-2xl border border-emerald-200/80 hover:border-emerald-500 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Slot Code + Vacant Pill */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900 font-mono tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {slot.number}
                      </span>
                    </div>
                    
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available Now
                    </span>
                  </div>

                  {/* Vehicle Type & Floor */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Vehicle Type:</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border ${getVehicleBadgeColor(slot.vehicleType)}`}>
                        {getVehicleIcon(slot.vehicleType)}
                        <span>{slot.vehicleType}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Zone / Floor:</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {slot.floor}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Rate:</span>
                      <span className="text-xs font-bold text-slate-900">
                        ₹{slot.ratePerHour}/hour
                      </span>
                    </div>
                  </div>
                </div>

                {/* Select Slot Button */}
                <button
                  id={`select-slot-btn-${slot.number}`}
                  onClick={() => handleSelectSlot(slot)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Select & Park Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Empty Slots for Selected Filter</h3>
          <p className="text-xs text-slate-500 mb-6">
            All slots for this vehicle type or floor are currently occupied or reserved. Try checking another vehicle category or switch to the advance Reserved section.
          </p>
          <button
            onClick={() => { setSelectedVehicleFilter('all'); setSelectedFloorFilter('all'); }}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Show All Available Slots
          </button>
        </div>
      )}

    </div>
  );
};
