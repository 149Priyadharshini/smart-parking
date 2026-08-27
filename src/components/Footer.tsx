import React from 'react';
import { useParking } from '../context/ParkingContext';
import { Car, MapPin, ShieldCheck, Zap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedLocationId, setTypeFilter } = useParking();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Park<span className="text-cyan-400">Ease</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Smart Parking System connecting motorists with real-time slot availability, advance reserved bays, and seamless instant digital check-ins across premier shopping malls and cinema multiplexes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Explore Parking
            </div>
            <p 
              onClick={() => { setTypeFilter('Mall'); setCurrentView('malls-theatres'); }} 
              className="text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              Shopping Malls
            </p>
            <p 
              onClick={() => { setTypeFilter('Theatre'); setCurrentView('malls-theatres'); }} 
              className="text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              Cinema Theatres
            </p>
            <p 
              onClick={() => { setCurrentView('my-bookings'); }} 
              className="text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              My Bookings & Passes
            </p>
            <p 
              onClick={() => { setCurrentView('profile'); }} 
              className="text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              Saved Vehicles
            </p>
          </div>

          {/* Supported Locations */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Key Locations
            </div>
            <p className="text-slate-400">Phoenix Marketcity</p>
            <p className="text-slate-400">VR Mall & Central Hub</p>
            <p className="text-slate-400">Express Avenue Mall</p>
            <p className="text-slate-400">PVR Superplex Cinemas</p>
            <p className="text-slate-400">INOX Megaplex & IMAX</p>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            © 2026 ParkEase Smart Mobility System. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Real-time Occupancy API Ready</span>
            <span>•</span>
            <span>Secure QR Clearance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
