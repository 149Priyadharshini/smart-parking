import React from 'react';
import { ParkingLocation, VehicleType } from '../types';
import { useParking } from '../context/ParkingContext';
import { 
  Bike, 
  Car, 
  Truck, 
  Zap, 
  CalendarCheck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ReservedParkingProps {
  location: ParkingLocation;
}

export const ReservedParking: React.FC<ReservedParkingProps> = ({ location }) => {
  const { openBookingModal } = useParking();

  const vehicleCategories: {
    type: VehicleType;
    icon: React.ReactNode;
    title: string;
    rate: number;
    description: string;
    features: string[];
    bgAccent: string;
    borderAccent: string;
    buttonColor: string;
  }[] = [
    {
      type: 'Two Wheeler',
      icon: <Bike className="w-6 h-6 text-blue-600" />,
      title: 'Two Wheeler / Bike',
      rate: location.vehicleRates['Two Wheeler'],
      description: 'Dedicated marked motorcycle & scooter parking bays on Ground & B1 zones.',
      features: ['Helmet locker points', 'CCTV monitored bays', 'Immediate ramp entry'],
      bgAccent: 'from-blue-50/50 to-indigo-50/30',
      borderAccent: 'border-blue-200 hover:border-blue-400',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      type: 'Car',
      icon: <Car className="w-6 h-6 text-emerald-600" />,
      title: 'Standard Car / Sedan / Hatchback',
      rate: location.vehicleRates['Car'],
      description: 'Spacious standard sedan & hatchback bays with ample door-opening clearance.',
      features: ['Wide 2.5m bays', 'Direct mall lift access', 'Undercover weather-safe'],
      bgAccent: 'from-emerald-50/50 to-teal-50/30',
      borderAccent: 'border-emerald-200 hover:border-emerald-400',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      type: 'SUV',
      icon: <Truck className="w-6 h-6 text-amber-600" />,
      title: 'SUV & Luxury Vehicles',
      rate: location.vehicleRates['SUV'],
      description: 'Extra-wide premium bays engineered for larger wheelbase SUVs and premium cars.',
      features: ['3.0m extra wide bays', 'High headroom clearance', 'Priority security patrol'],
      bgAccent: 'from-amber-50/50 to-orange-50/30',
      borderAccent: 'border-amber-200 hover:border-amber-400',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
    },
    {
      type: 'Other / EV',
      icon: <Zap className="w-6 h-6 text-cyan-600" />,
      title: 'Electric Vehicle / EV Fast Charge',
      rate: location.vehicleRates['Other / EV'],
      description: 'Designated bays equipped with Type-2 AC & DC fast chargers for electric vehicles.',
      features: ['Dedicated EV charge plug', 'Green lane access', 'Covered basement level'],
      bgAccent: 'from-cyan-50/50 to-blue-50/30',
      borderAccent: 'border-cyan-200 hover:border-cyan-400',
      buttonColor: 'bg-cyan-600 hover:bg-cyan-700',
    },
  ];

  const getAvailableSlotsCount = (type: VehicleType) => {
    return location.slots.filter(
      (s) => s.vehicleType === type && s.status === 'available'
    ).length;
  };

  const handleReserve = (type: VehicleType) => {
    openBookingModal(location, 'reserved', undefined, type);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <CalendarCheck className="w-3.5 h-3.5" /> Advance Guaranteed Booking
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Reserved Parking by Vehicle Category
          </h2>
          <p className="text-xs text-blue-100/90 max-w-2xl mt-1">
            Choose your vehicle type to reserve your guaranteed slot ahead of time. Pricing is calculated per hour with no hidden surge fees.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center shrink-0 self-stretch sm:self-auto">
          <div className="text-xs text-blue-200 font-medium">Pre-Booking Window</div>
          <div className="text-sm font-bold text-white">Up to 7 Days Ahead</div>
        </div>
      </div>

      {/* Grid of Vehicle Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vehicleCategories.map((cat) => {
          const availableCount = getAvailableSlotsCount(cat.type);
          const isSoldOut = availableCount === 0;

          return (
            <div
              key={cat.type}
              id={`reserved-card-${cat.type.toLowerCase().replace(/\s+/g, '-')}`}
              className={`bg-white rounded-2xl p-5 sm:p-6 border ${cat.borderAccent} shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
            >
              {/* Subtle accent background */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.bgAccent} rounded-bl-full pointer-events-none -z-0`} />

              <div className="relative z-10">
                
                {/* Header with icon and pricing */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-xs">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {cat.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          availableCount > 3
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : availableCount > 0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isSoldOut ? 'Sold Out' : `${availableCount} Slots Available`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900 font-sans">
                      ₹{cat.rate}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">
                      per hour
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {cat.description}
                </p>

                {/* Features list */}
                <div className="space-y-1.5 mb-6 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {cat.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-2 border-t border-slate-100">
                <button
                  id={`reserve-now-btn-${cat.type.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleReserve(cat.type)}
                  disabled={isSoldOut}
                  className={`w-full py-3 px-4 rounded-xl ${cat.buttonColor} text-white font-bold text-xs tracking-wide uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSoldOut ? (
                    <span>No Reserved Slots Left</span>
                  ) : (
                    <>
                      <span>Reserve Now (₹{cat.rate}/hr)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
