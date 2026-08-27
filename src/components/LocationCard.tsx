import React from 'react';
import { ParkingLocation } from '../types';
import { useParking } from '../context/ParkingContext';
import { 
  MapPin, 
  Navigation2, 
  Star, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Car, 
  Bike, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LocationCardProps {
  location: ParkingLocation;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const { setSelectedLocationId, setCurrentView } = useParking();

  // Compute live statistics from the location's slots
  const totalSlots = location.slots.length;
  const availableSlots = location.slots.filter((s) => s.status === 'available').length;
  const occupiedSlots = location.slots.filter((s) => s.status === 'occupied').length;
  const reservedSlots = location.slots.filter((s) => s.status === 'reserved').length;
  
  const availabilityPercent = Math.round((availableSlots / totalSlots) * 100);

  // Status color logic
  let availabilityColorClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let badgeText = `${availableSlots} Slots Free`;
  if (availabilityPercent < 20) {
    availabilityColorClass = 'text-rose-600 bg-rose-50 border-rose-200';
    badgeText = `Fast Filling (${availableSlots} Left)`;
  } else if (availabilityPercent < 50) {
    availabilityColorClass = 'text-amber-600 bg-amber-50 border-amber-200';
  }

  const handleViewParking = () => {
    setSelectedLocationId(location.id);
    setCurrentView('parking-slot');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      id={`location-card-${location.id}`}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Top Image Container with badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
            location.type === 'Mall'
              ? 'bg-blue-600 text-white'
              : 'bg-purple-600 text-white'
          }`}>
            {location.type === 'Mall' ? 'Shopping Mall' : 'Cinema Theatre'}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
            <Navigation2 className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            <span>{location.distanceKm} km away</span>
          </span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{location.rating}</span>
          <span className="text-slate-600 font-normal">({location.totalReviews})</span>
        </div>

        {/* Bottom overlay in image: availability indicator */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-extrabold text-white drop-shadow-sm line-clamp-1">
              {location.name}
            </h3>
            <p className="text-xs text-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{location.openingHours}</span>
            </p>
          </div>
          
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md ${availabilityColorClass}`}>
            {badgeText}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Address */}
        <div>
          <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{location.address}, {location.city}</span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {location.description}
          </p>
        </div>

        {/* Live Slot Status Bar */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Live Capacity:</span>
            <span className="text-slate-900 font-bold">
              {availableSlots} Available <span className="text-slate-600 font-normal">/ {totalSlots} Total</span>
            </span>
          </div>
          
          {/* Segmented capacity meter */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 transition-all duration-500" 
              style={{ width: `${(availableSlots / totalSlots) * 100}%` }}
              title={`Available: ${availableSlots}`}
            />
            <div 
              className="bg-blue-500 transition-all duration-500" 
              style={{ width: `${(reservedSlots / totalSlots) * 100}%` }}
              title={`Reserved: ${reservedSlots}`}
            />
            <div 
              className="bg-slate-400 transition-all duration-500" 
              style={{ width: `${(occupiedSlots / totalSlots) * 100}%` }}
              title={`Occupied: ${occupiedSlots}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {availableSlots} Open
            </span>
            <span className="flex items-center gap-1 text-blue-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              {reservedSlots} Reserved
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              {occupiedSlots} Parked
            </span>
          </div>
        </div>

        {/* Pricing rates snippet */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Bike className="w-3.5 h-3.5 text-slate-600" />
              ₹{location.vehicleRates['Two Wheeler']}/h
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Car className="w-3.5 h-3.5 text-slate-600" />
              ₹{location.vehicleRates['Car']}/h
            </span>
          </div>

          {location.amenities.some((a) => a.includes('EV')) && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Zap className="w-3 h-3 text-emerald-600" /> EV Bay
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          id={`view-parking-btn-${location.id}`}
          onClick={handleViewParking}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs tracking-wide uppercase transition-colors duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-xs"
        >
          <span>View Parking Slots</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};
