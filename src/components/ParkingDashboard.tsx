import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { LocationCard } from './LocationCard';
import { 
  Search, 
  MapPin, 
  Car, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Ticket, 
  ChevronRight,
  Navigation,
  Layers,
  CheckCircle2,
  CalendarDays,
  Building2,
  Film
} from 'lucide-react';

export const ParkingDashboard: React.FC = () => {
  const { 
    locations, 
    setCurrentView, 
    setSelectedLocationId,
    setSearchQuery,
    setTypeFilter 
  } = useParking();

  const [localSearch, setLocalSearch] = useState('');

  // Calculate live aggregate stats
  const totalLocations = locations.length;
  const allSlots = locations.flatMap((l) => l.slots);
  const totalSlotsCount = allSlots.length;
  const availableSlotsCount = allSlots.filter((s) => s.status === 'available').length;
  const reservedSlotsCount = allSlots.filter((s) => s.status === 'reserved').length;
  const occupiedSlotsCount = allSlots.filter((s) => s.status === 'occupied').length;

  const malls = locations.filter((l) => l.type === 'Mall');
  const theatres = locations.filter((l) => l.type === 'Theatre');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('malls-theatres');
    }
  };

  const handleQuickFilter = (type: 'all' | 'Mall' | 'Theatre') => {
    setTypeFilter(type);
    setCurrentView('malls-theatres');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Hero Section: "Find Parking Before You Reach" */}
      <section className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Smart City Real-Time Parking System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Find Parking <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Before You Reach</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Check real-time slot occupancy across top shopping malls and cinema theatres. Guarantee your reserved bay or check in instantly.
          </p>

          {/* Prominent Search Box */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white p-2 rounded-2xl sm:rounded-full shadow-2xl shadow-blue-900/40 border border-white/20 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 flex-1 w-full px-4 py-2">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                id="hero-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for a mall or theatre (e.g. Phoenix, PVR, VR Mall)..."
                className="w-full text-slate-800 text-sm sm:text-base font-medium placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="hero-search-btn"
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Search Slots</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Filter Tag Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 text-xs font-semibold">
            <span className="text-slate-400 hidden sm:inline">Popular:</span>
            <button
              id="filter-all-btn"
              onClick={() => handleQuickFilter('all')}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
            >
              All Locations ({totalLocations})
            </button>
            <button
              id="filter-malls-btn"
              onClick={() => handleQuickFilter('Mall')}
              className="px-3 py-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Shopping Malls ({malls.length})
            </button>
            <button
              id="filter-theatres-btn"
              onClick={() => handleQuickFilter('Theatre')}
              className="px-3 py-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 transition-colors flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              Cinemas & Theatres ({theatres.length})
            </button>
          </div>

        </div>

      </section>

      {/* Live System Stats Ticker / Summary Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 sm:divide-x divide-slate-100">
          
          <div className="flex items-center gap-3.5 sm:px-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                {availableSlotsCount}
              </div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Available Slots Live
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:px-4 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                {reservedSlotsCount}
              </div>
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Pre-Reserved Slots
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:px-4 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                {occupiedSlotsCount}
              </div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Currently Parked
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:px-4 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                {totalLocations}
              </div>
              <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Connected Venues
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Two Modes Explanation Banner: Reserved vs Unreserved */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Reserved Parking Card Overview */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-6 text-white border border-blue-800 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
                <CalendarDays className="w-3.5 h-3.5" /> Category A: Advance Booking
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Reserved Parking (Vehicle-Wise Rates)</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
                Plan ahead and guarantee your spot for movies, shopping, or dining. Pick your vehicle type (Two Wheeler ₹20/h, Car ₹50/h, SUV ₹70/h), choose arrival time, and receive an instant digital QR pass.
              </p>
            </div>
            <button
              id="explore-reserved-btn"
              onClick={() => {
                setTypeFilter('all');
                setCurrentView('malls-theatres');
              }}
              className="relative z-10 w-fit inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <span>Explore Reserved Venues</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Unreserved Parking Card Overview */}
          <div className="bg-gradient-to-br from-emerald-950 to-teal-950 rounded-2xl p-6 text-white border border-emerald-800 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5" /> Category B: On-Spot Check-In
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unreserved Parking (Live Vacant Slots Only)</h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
                Already arrived at the mall or theatre? The unreserved section displays exclusively currently empty slots (e.g. A01 – Car, B05 – Two Wheeler). Tap to check in on the spot with zero waiting.
              </p>
            </div>
            <button
              id="explore-unreserved-btn"
              onClick={() => {
                setTypeFilter('all');
                setCurrentView('malls-theatres');
              }}
              className="relative z-10 w-fit inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <span>View Live Empty Slots</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Section 1: Nearby Shopping Malls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Nearby Shopping Malls
              </h2>
              <p className="text-xs text-slate-600">
                Multi-level automated parking with real-time slot occupancy
              </p>
            </div>
          </div>

          <button
            id="view-all-malls-btn"
            onClick={() => {
              setTypeFilter('Mall');
              setCurrentView('malls-theatres');
            }}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>View All Malls</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {malls.slice(0, 3).map((mall) => (
            <LocationCard key={mall.id} location={mall} />
          ))}
        </div>
      </section>

      {/* Section 2: Nearby Cinema Theatres */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Nearby Cinema Theatres
              </h2>
              <p className="text-xs text-slate-600">
                Showtime-synced parking with guaranteed moviegoer slots
              </p>
            </div>
          </div>

          <button
            id="view-all-theatres-btn"
            onClick={() => {
              setTypeFilter('Theatre');
              setCurrentView('malls-theatres');
            }}
            className="text-xs sm:text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
          >
            <span>View All Theatres</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theatres.slice(0, 3).map((theatre) => (
            <LocationCard key={theatre.id} location={theatre} />
          ))}
        </div>
      </section>

    </div>
  );
};
