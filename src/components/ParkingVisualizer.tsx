import React, { useState } from 'react';
import { ParkingLocation, ParkingSlot, VehicleType, SlotStatus } from '../types';
import { useParking } from '../context/ParkingContext';
import { 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  Lock, 
  Layers, 
  CheckCircle2, 
  Info,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface ParkingVisualizerProps {
  location: ParkingLocation;
}

export const ParkingVisualizer: React.FC<ParkingVisualizerProps> = ({ location }) => {
  const { openBookingModal } = useParking();

  const [activeFloor, setActiveFloor] = useState<'G' | 'B1' | 'B2'>('G');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<ParkingSlot | null>(null);

  const floorSlots = location.slots.filter((s) => s.floorId === activeFloor);

  // Group slots into rows
  const row1 = floorSlots.filter((s) => s.row === 1);
  const row2 = floorSlots.filter((s) => s.row === 2);
  const row3 = floorSlots.filter((s) => s.row === 3);
  const row4 = floorSlots.filter((s) => s.row === 4);

  const selectedSlot = location.slots.find((s) => s.id === selectedSlotId);

  const getVehicleIcon = (type: VehicleType, status: SlotStatus) => {
    const isOccupied = status === 'occupied';
    const isReserved = status === 'reserved';
    const isSelected = selectedSlotId !== null && location.slots.find(s => s.id === selectedSlotId)?.vehicleType === type;

    let colorClass = 'text-slate-600';
    if (isOccupied) {
      colorClass = 'text-slate-500';
    } else if (isReserved) {
      colorClass = 'text-white';
    } else {
      colorClass = 'text-slate-700';
    }

    switch (type) {
      case 'Two Wheeler':
        return <Bike className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClass}`} />;
      case 'SUV':
        return <Truck className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClass}`} />;
      case 'Other / EV':
        return <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClass}`} />;
      default:
        return <Car className={`w-4 h-4 sm:w-5 sm:h-5 ${colorClass}`} />;
    }
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlotId(slot.id);
  };

  const handleBookSelectedSlot = (mode: 'reserved' | 'unreserved') => {
    if (!selectedSlot || selectedSlot.status !== 'available') return;
    openBookingModal(location, mode, selectedSlot, selectedSlot.vehicleType);
  };

  return (
    <div className="space-y-6">
      
      {/* Visualizer Header with Floor Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Interactive Visual Parking Deck Layout</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Click on any available slot in the layout map to inspect details or reserve directly.
          </p>
        </div>

        {/* Floor selector tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch sm:self-auto">
          <button
            id="floor-btn-g"
            onClick={() => { setActiveFloor('G'); setSelectedSlotId(null); }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFloor === 'G'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ground (Zone A)
          </button>
          <button
            id="floor-btn-b1"
            onClick={() => { setActiveFloor('B1'); setSelectedSlotId(null); }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFloor === 'B1'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Basement 1 (Zone B)
          </button>
          <button
            id="floor-btn-b2"
            onClick={() => { setActiveFloor('B2'); setSelectedSlotId(null); }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFloor === 'B2'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Basement 2 (Zone C)
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">Map Legend:</span>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-white border-2 border-slate-300 inline-block shadow-xs" />
            <span className="text-slate-600 font-bold">Empty ({floorSlots.filter((s) => s.status === 'available').length})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-700 inline-block" />
            <span className="text-slate-600 font-bold">Occupied ({floorSlots.filter((s) => s.status === 'occupied').length})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-500 border border-amber-400 inline-block" />
            <span className="text-slate-600 font-bold">Reserved ({floorSlots.filter((s) => s.status === 'reserved').length})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-blue-600 border-2 border-blue-400 ring-2 ring-blue-300 inline-block" />
            <span className="text-slate-900 font-bold">Selected</span>
          </div>

        </div>
      </div>

      {/* Main Parking Floor Map Stage */}
      <div className="bg-slate-200 p-5 sm:p-7 rounded-2xl border border-slate-300 shadow-inner relative overflow-hidden">
        
        {/* Entrance / Exit Indicators */}
        <div className="flex items-center justify-between px-6 mb-5 h-12 bg-slate-300/70 items-center rounded-xl border border-slate-300/50 text-xs font-bold text-slate-600 uppercase tracking-wider select-none">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-slate-600" />
            <span>DRIVEWAY ENTRANCE</span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-700 hidden sm:block">
            {activeFloor === 'G' ? 'LEVEL G • MAIN DECK' : activeFloor === 'B1' ? 'LOWER BASEMENT • LEVEL 1 (LB-01)' : 'BASEMENT • LEVEL 2 (LB-02)'}
          </div>
          <div className="flex items-center gap-2">
            <span>DRIVEWAY EXIT</span>
            <ArrowRight className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Parking Grid Container */}
        <div className="space-y-5 max-w-4xl mx-auto">
          
          {/* North Parking Bay (Row 1 & Row 2) */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono font-bold text-slate-600 tracking-wider">
              NORTH PARKING BAY (BAY A)
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {row1.map((slot) => renderSlotButton(slot))}
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {row2.map((slot) => renderSlotButton(slot))}
            </div>
          </div>

          {/* Central Driveway / Driving Lane */}
          <div className="h-12 bg-slate-300/70 rounded-xl border border-dashed border-slate-400/60 flex items-center justify-between px-6 text-slate-600 text-xs font-mono font-bold select-none">
            <span className="flex items-center gap-2">
              ◄ ONE-WAY TRAFFIC LANE
            </span>
            <span className="hidden sm:inline-block text-slate-500 font-semibold tracking-wider text-[11px]">
              MAX SPEED 10 KM/H
            </span>
            <span className="flex items-center gap-2">
              LIFT LOBBY ACCESS ►
            </span>
          </div>

          {/* South Parking Bay (Row 3 & Row 4) */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono font-bold text-slate-600 tracking-wider">
              SOUTH PARKING BAY (BAY B)
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {row3.map((slot) => renderSlotButton(slot))}
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {row4.map((slot) => renderSlotButton(slot))}
            </div>
          </div>

        </div>

      </div>

      {/* Weekend Special / Promo Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">
            🎁
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white">Weekend Special Discount</p>
            <p className="text-[11px] text-slate-300">Get 20% off on advance bookings above 3 hours</p>
          </div>
        </div>
        <span className="text-xs font-black text-cyan-400 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 tracking-wider">
          CODE: PK20
        </span>
      </div>

      {/* Selected Slot Detailed Action Panel */}
      {selectedSlot && (
        <div className="bg-white rounded-2xl border border-blue-200 p-5 sm:p-6 shadow-lg animate-in fade-in slide-in-from-bottom-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black font-mono shrink-0 shadow-inner ${
              selectedSlot.status === 'available'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : selectedSlot.status === 'reserved'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {selectedSlot.number}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-extrabold text-slate-900">
                  Slot {selectedSlot.number} – {selectedSlot.vehicleType}
                </h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                  selectedSlot.status === 'available'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : selectedSlot.status === 'reserved'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  Status: {selectedSlot.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Located on {selectedSlot.floor} • Rate: <span className="font-bold text-slate-900">₹{selectedSlot.ratePerHour}/hour</span>
                {selectedSlot.hasEVCharging && ' • Equipped with Fast EV Charger'}
              </p>
            </div>
          </div>

          {/* Booking Action Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedSlot.status === 'available' ? (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  id="book-selected-reserved-btn"
                  onClick={() => handleBookSelectedSlot('reserved')}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-xs"
                >
                  Reserve in Advance
                </button>
                <button
                  id="book-selected-unreserved-btn"
                  onClick={() => handleBookSelectedSlot('unreserved')}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide uppercase transition-colors shadow-xs"
                >
                  Instant Park Now
                </button>
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-4 py-2.5 rounded-xl">
                {selectedSlot.status === 'reserved' ? 'Slot is already pre-booked' : 'Slot currently occupied by vehicle'}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );

  function renderSlotButton(slot: ParkingSlot) {
    const isSelected = selectedSlotId === slot.id;
    const isAvailable = slot.status === 'available';
    const isOccupied = slot.status === 'occupied';
    const isReserved = slot.status === 'reserved';

    let cardStyle = '';
    if (isSelected) {
      cardStyle = 'bg-blue-600 border-2 border-blue-400 text-white shadow-md ring-2 ring-blue-300 scale-[1.02] cursor-pointer';
    } else if (isAvailable) {
      cardStyle = 'bg-white border-2 border-slate-300 text-slate-800 shadow-xs hover:border-blue-500 hover:scale-[1.02] cursor-pointer';
    } else if (isReserved) {
      cardStyle = 'bg-amber-500 border border-amber-400 text-white shadow-xs hover:bg-amber-600 cursor-pointer';
    } else {
      cardStyle = 'bg-slate-800 border border-slate-700 text-white/40 shadow-xs opacity-90 cursor-not-allowed';
    }

    return (
      <button
        key={slot.id}
        id={`slot-visual-${slot.number}`}
        type="button"
        onClick={() => handleSlotClick(slot)}
        onMouseEnter={() => setHoveredSlot(slot)}
        onMouseLeave={() => setHoveredSlot(null)}
        className={`p-3 rounded-xl transition-all duration-150 flex flex-col justify-between h-24 sm:h-28 text-left relative group select-none ${cardStyle}`}
      >
        {/* Top line: Slot Number & EV/Lock Badge */}
        <div className="flex items-center justify-between w-full">
          <span className={`font-mono text-sm sm:text-base font-black tracking-wider ${
            isSelected || isReserved ? 'text-white' : isOccupied ? 'text-white/60' : 'text-slate-900'
          }`}>
            {slot.number}
          </span>

          <div className="flex items-center gap-1">
            {slot.hasEVCharging && (
              <Zap className={`w-3.5 h-3.5 ${
                isSelected || isReserved ? 'text-white fill-white' : isOccupied ? 'text-white/40 fill-white/40' : 'text-emerald-600 fill-emerald-600'
              }`} title="EV Fast Charger" />
            )}
            {isReserved && (
              <Lock className="w-3.5 h-3.5 text-white" title="Reserved Slot" />
            )}
          </div>
        </div>

        {/* Center: Vehicle Icon */}
        <div className="my-auto flex items-center justify-center">
          {getVehicleIcon(slot.vehicleType, isSelected ? 'reserved' : slot.status)}
        </div>

        {/* Bottom line: Type snippet & status */}
        <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] font-bold">
          <span className={`truncate max-w-[60%] ${
            isSelected || isReserved ? 'text-white/90' : isOccupied ? 'text-white/40' : 'text-slate-500'
          }`}>
            {slot.vehicleType === 'Two Wheeler' ? 'Bike' : slot.vehicleType === 'Other / EV' ? 'EV' : slot.vehicleType}
          </span>

          <span className={`font-extrabold uppercase text-[10px] ${
            isSelected ? 'text-white' : isAvailable ? 'text-emerald-600' : isReserved ? 'text-white' : 'text-white/40'
          }`}>
            {isSelected ? 'SELECTED' : isAvailable ? 'EMPTY' : isReserved ? 'RSVD' : 'PARKED'}
          </span>
        </div>
      </button>
    );
  }
};
