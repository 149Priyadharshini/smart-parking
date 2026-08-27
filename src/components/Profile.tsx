import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { VehicleType } from '../types';
import { 
  User, 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  Plus, 
  Trash2, 
  Wallet, 
  Ticket, 
  ShieldCheck, 
  Mail, 
  Phone, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, addSavedVehicle, deleteSavedVehicle, bookings, updateUserProfile } = useParking();

  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newType, setNewType] = useState<VehicleType>('Car');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const totalSpent = bookings.reduce((sum, b) => (b.bookingStatus !== 'Cancelled' ? sum + b.totalAmount : sum), 0);
  const activeCount = bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Active').length;

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim() || !newModel.trim()) return;
    addSavedVehicle({
      type: newType,
      model: newModel.trim(),
      plateNumber: newPlate.trim(),
    });
    setNewModel('');
    setNewPlate('');
    setIsAddingVehicle(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
    });
    setIsEditingProfile(false);
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'Two Wheeler':
        return <Bike className="w-5 h-5 text-blue-600" />;
      case 'SUV':
        return <Truck className="w-5 h-5 text-amber-600" />;
      case 'Other / EV':
        return <Zap className="w-5 h-5 text-cyan-600" />;
      default:
        return <Car className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center overflow-hidden shadow-md">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {user?.name || 'Driver Profile'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Verified Driver
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-600" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  {user?.phone}
                </span>
              </div>
            </div>
          </div>

          <button
            id="edit-profile-btn"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            {isEditingProfile ? 'Cancel Edit' : 'Edit Contact Details'}
          </button>
        </div>

        {/* Inline Edit Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats and Wallet Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Smart Wallet
            </div>
            <div className="text-xl font-black text-slate-900 font-sans mt-0.5">
              ₹{user?.walletBalance || 450}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">Fast Auto-Pay Active</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Active Reservations
            </div>
            <div className="text-xl font-black text-slate-900 font-sans mt-0.5">
              {activeCount} Slots
            </div>
            <div className="text-[11px] text-blue-700 font-medium">Ready for Arrival</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Lifetime Bookings
            </div>
            <div className="text-xl font-black text-slate-900 font-sans mt-0.5">
              {user?.totalBookingsCount || 3}
            </div>
            <div className="text-[11px] text-purple-700 font-medium">Total Spent: ₹{totalSpent}</div>
          </div>
        </div>

      </div>

      {/* Saved Vehicles Management */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My Saved Vehicles
            </h2>
            <p className="text-xs text-slate-600">
              Quickly autofill your vehicle registration number when booking slots.
            </p>
          </div>

          <button
            id="add-vehicle-btn"
            onClick={() => setIsAddingVehicle(!isAddingVehicle)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Add vehicle form */}
        {isAddingVehicle && (
          <form onSubmit={handleAddVehicle} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold uppercase text-slate-700">Add New Vehicle</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as VehicleType)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Car">Car / Sedan</option>
                  <option value="Two Wheeler">Two Wheeler / Bike</option>
                  <option value="SUV">SUV / Luxury</option>
                  <option value="Other / EV">Electric Vehicle / EV</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Vehicle Model / Color</label>
                <input
                  type="text"
                  placeholder="e.g. Honda City White"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. TN 09 BX 4289"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingVehicle(false)}
                className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        )}

        {/* Vehicle list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.savedVehicles.map((veh) => (
            <div
              key={veh.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {getVehicleIcon(veh.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {veh.plateNumber}
                    </span>
                    {veh.isDefault && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded-md">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{veh.model} • {veh.type}</p>
                </div>
              </div>

              {user.savedVehicles.length > 1 && (
                <button
                  onClick={() => deleteSavedVehicle(veh.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
