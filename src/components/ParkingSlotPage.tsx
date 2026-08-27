import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { ReservedParking } from './ReservedParking';
import { UnreservedParking } from './UnreservedParking';
import { ParkingVisualizer } from './ParkingVisualizer';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  Navigation2, 
  Layers, 
  CalendarCheck, 
  Zap, 
  Car, 
  Building2, 
  Film,
  Sparkles
} from 'lucide-react';

export const ParkingSlotPage: React.FC = () => {
  const { 
    selectedLocationId, 
    locations, 
    setCurrentView, 
    setSelectedLocationId 
  } = useParking();

  const [activeTab, setActiveTab] = useState<'reserved' | 'unreserved' | 'visualizer'>('reserved');

  const location = locations.find((l) => l.id === selectedLocationId) || locations[0];

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Location not found.</p>
          <button
            onClick={() => setCurrentView('malls-theatres')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  // Calculate live slot stats
  const totalSlots = location.slots.length;
  const availableSlots = location.slots.filter((s) => s.status === 'available').length;
  const occupiedSlots = location.slots.filter((s) => s.status === 'occupied').length;
  const reservedSlots = location.slots.filter((s) => s.status === 'reserved').length;
  const unreservedAvailableSlots = availableSlots; // Unreserved available pool

  const handleBack = () => {
    setSelectedLocationId(null);
    setCurrentView('malls-theatres');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Top Banner with cover image & location details */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={location.coverImage || location.image}
            alt={location.name}
            className="w-full h-full object-cover opacity-25 filter blur-xs"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          
          {/* Back button */}
          <button
            id="back-to-locations-btn"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Locations</span>
          </button>

          {/* Location Hero Info */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  location.type === 'Mall' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {location.type === 'Mall' ? 'Shopping Mall' : 'Cinema Multiplex'}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1">
                  <Navigation2 className="w-3 h-3" />
                  {location.distanceKm} km from your live location
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{location.rating}</span>
                  <span className="text-slate-400 font-normal">({location.totalReviews} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {location.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {location.address}, {location.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {location.openingHours}
                </span>
              </div>
            </div>

            {/* Quick Amenities Chips */}
            <div className="flex flex-wrap items-center gap-1.5 max-w-md">
              {location.amenities.map((amenity, idx) => (
                <span key={idx} className="text-[11px] font-medium bg-white/10 text-blue-200 px-2.5 py-1 rounded-lg border border-white/10">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Mandatory Slot Statistics Bar (Total, Available, Occupied, Reserved, Unreserved) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          {/* Total Slots */}
          <div className="px-2">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Slots
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans mt-0.5">
              {totalSlots}
            </div>
            <div className="text-[11px] text-slate-600 font-medium">Full Capacity</div>
          </div>

          {/* Available Slots */}
          <div className="px-2 pt-2 sm:pt-0">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Available Slots
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-sans mt-0.5">
              {availableSlots}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">Ready to Park</div>
          </div>

          {/* Occupied Slots */}
          <div className="px-2 pt-2 sm:pt-0">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Occupied Slots
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-700 font-sans mt-0.5">
              {occupiedSlots}
            </div>
            <div className="text-[11px] text-slate-600 font-medium">Currently Parked</div>
          </div>

          {/* Reserved Slots */}
          <div className="px-2 pt-2 sm:pt-0">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Reserved Slots
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-sans mt-0.5">
              {reservedSlots}
            </div>
            <div className="text-[11px] text-blue-700 font-medium">Pre-Booked</div>
          </div>

          {/* Unreserved Available Slots */}
          <div className="px-2 pt-2 sm:pt-0 col-span-2 sm:col-span-1">
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Unreserved Slots
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-600 font-sans mt-0.5">
              {unreservedAvailableSlots}
            </div>
            <div className="text-[11px] text-teal-700 font-medium">Instant Check-In</div>
          </div>

        </div>
      </div>

      {/* Main Content Category Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-8">
          
          <div className="flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/60 w-full sm:w-auto shadow-inner">
            <button
              id="tab-reserved-parking-btn"
              onClick={() => setActiveTab('reserved')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'reserved'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/60'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>A. Reserved Parking</span>
            </button>

            <button
              id="tab-unreserved-parking-btn"
              onClick={() => setActiveTab('unreserved')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'unreserved'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>B. Unreserved (Empty Only)</span>
            </button>

            <button
              id="tab-visualizer-btn"
              onClick={() => setActiveTab('visualizer')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Visual Floor Layout</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden md:block">
            Location Code: <span className="font-mono font-bold text-slate-700">{location.id.toUpperCase()}</span>
          </div>

        </div>

        {/* Tab Content Display */}
        {activeTab === 'reserved' && (
          <ReservedParking location={location} />
        )}

        {activeTab === 'unreserved' && (
          <UnreservedParking location={location} />
        )}

        {activeTab === 'visualizer' && (
          <ParkingVisualizer location={location} />
        )}

      </div>

    </div>
  );
};
