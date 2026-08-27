import React, { useState, useMemo } from 'react';
import { useParking } from '../context/ParkingContext';
import { LocationCard } from './LocationCard';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Film, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const MallsTheatresPage: React.FC = () => {
  const { 
    locations, 
    searchQuery, 
    setSearchQuery, 
    typeFilter, 
    setTypeFilter 
  } = useParking();

  const [sortBy, setSortBy] = useState<'distance' | 'availability' | 'rating' | 'price'>('distance');
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [onlyEV, setOnlyEV] = useState<boolean>(false);
  const [onlyHighAvailability, setOnlyHighAvailability] = useState<boolean>(false);

  // Filtered and sorted locations
  const filteredLocations = useMemo(() => {
    return locations
      .filter((loc) => {
        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = loc.name.toLowerCase().includes(q);
          const matchesAddress = loc.address.toLowerCase().includes(q);
          const matchesCity = loc.city.toLowerCase().includes(q);
          if (!matchesName && !matchesAddress && !matchesCity) return false;
        }

        // Type filter
        if (typeFilter !== 'all' && loc.type !== typeFilter) {
          return false;
        }

        // Distance filter
        if (loc.distanceKm > maxDistance) {
          return false;
        }

        // EV Filter
        if (onlyEV && !loc.amenities.some((a) => a.includes('EV'))) {
          return false;
        }

        // High Availability filter (> 30% available)
        if (onlyHighAvailability) {
          const avail = loc.slots.filter((s) => s.status === 'available').length;
          const ratio = avail / loc.slots.length;
          if (ratio < 0.3) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'availability') {
          const aAvail = a.slots.filter((s) => s.status === 'available').length;
          const bAvail = b.slots.filter((s) => s.status === 'available').length;
          return bAvail - aAvail;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'price') {
          return a.vehicleRates['Car'] - b.vehicleRates['Car'];
        }
        return 0;
      });
  }, [locations, searchQuery, typeFilter, sortBy, maxDistance, onlyEV, onlyHighAvailability]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setMaxDistance(10);
    setOnlyEV(false);
    setOnlyHighAvailability(false);
    setSortBy('distance');
  };

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || maxDistance < 10 || onlyEV || onlyHighAvailability;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>Smart Location Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Malls & Theatres Parking
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Select any shopping mall or cinema theatre to view live slot maps and reserve your space.
            </p>
          </div>

          {/* Quick Category Buttons */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs self-start">
            <button
              id="tab-all-venues"
              onClick={() => setTypeFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                typeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All Venues ({locations.length})
            </button>
            <button
              id="tab-malls-venues"
              onClick={() => setTypeFilter('Mall')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                typeFilter === 'Mall'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Shopping Malls
            </button>
            <button
              id="tab-theatres-venues"
              onClick={() => setTypeFilter('Theatre')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                typeFilter === 'Theatre'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Cinemas & Theatres
            </button>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="mt-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="malls-page-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, landmark, or area (e.g. Phoenix, Velachery)..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort selector */}
            <div className="md:col-span-3 flex items-center gap-2">
              <div className="relative w-full">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium appearance-none cursor-pointer"
                >
                  <option value="distance">Sort by: Nearest Distance</option>
                  <option value="availability">Sort by: Most Available Slots</option>
                  <option value="rating">Sort by: Highest Rating</option>
                  <option value="price">Sort by: Lowest Hourly Rate</option>
                </select>
              </div>
            </div>

            {/* Distance slider filter */}
            <div className="md:col-span-3 flex items-center justify-between bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600">Max Range:</span>
              <div className="flex items-center gap-2">
                <input
                  id="distance-range-slider"
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-20 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-900 w-10 text-right">
                  {maxDistance} km
                </span>
              </div>
            </div>

          </div>

          {/* Additional Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="toggle-ev-btn"
                onClick={() => setOnlyEV(!onlyEV)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  onlyEV
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>EV Charging Hubs</span>
              </button>

              <button
                id="toggle-high-availability-btn"
                onClick={() => setOnlyHighAvailability(!onlyHighAvailability)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  onlyHighAvailability
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>High Slot Availability</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                id="clear-all-filters-btn"
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Venues Found</h3>
          <p className="text-xs text-slate-500 mb-6">
            We couldn't find any shopping malls or theatres matching your current search or filter criteria.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};
