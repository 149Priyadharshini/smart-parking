import React, { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import { VehicleType, ParkingSlot } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Car, 
  Bike, 
  Truck, 
  Zap, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';

interface BookingModalInnerProps {
  modalData: NonNullable<ReturnType<typeof useParking>['activeBookingModal']>;
}

const BookingFormModalInner: React.FC<BookingModalInnerProps> = ({ modalData }) => {
  const { 
    closeBookingModal, 
    createReservation, 
    createUnreservedCheckIn,
    user 
  } = useParking();

  const { location, type: modalType, preselectedSlot, preselectedVehicleType } = modalData;
  const isReservedFlow = modalType === 'reserved';

  // Form State
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    preselectedVehicleType || preselectedSlot?.vehicleType || 'Car'
  );
  const [vehicleNumber, setVehicleNumber] = useState<string>(
    user?.savedVehicles[0]?.plateNumber || 'TN 09 BX 4289'
  );
  
  // Date & Time
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  
  // Current time rounded to next 30 min
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMin = now.getMinutes() >= 30 ? '30' : '00';
  const defaultTime = `${currentHour}:${currentMin}`;
  const [time, setTime] = useState<string>(defaultTime);
  
  const [durationHours, setDurationHours] = useState<number>(2);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI (Google Pay / PhonePe)');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(preselectedSlot?.id || '');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Available slots for the selected vehicle type
  const availableSlotsForType = location.slots.filter(
    (s) => s.vehicleType === vehicleType && s.status === 'available'
  );

  useEffect(() => {
    if (preselectedSlot) {
      setSelectedSlotId(preselectedSlot.id);
      setVehicleType(preselectedSlot.vehicleType);
    }
  }, [preselectedSlot]);

  // Rate calculation
  const hourlyRate = location.vehicleRates[vehicleType] || 50;
  const baseAmount = hourlyRate * durationHours;
  const taxAmount = Math.round(baseAmount * 0.18 * 10) / 10;
  const totalAmount = Math.round((baseAmount + taxAmount) * 10) / 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      setErrorMessage('Please enter your vehicle registration plate number.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      if (isReservedFlow) {
        createReservation({
          locationId: location.id,
          vehicleType,
          vehicleNumber,
          date,
          time,
          durationHours,
          paymentMethod,
          preferredSlotId: selectedSlotId || undefined,
        });
      } else {
        // Unreserved check-in flow
        const targetSlotId = selectedSlotId || preselectedSlot?.id || availableSlotsForType[0]?.id;
        if (!targetSlotId) {
          setErrorMessage('No empty slot is currently available for this check-in.');
          setIsProcessing(false);
          return;
        }
        createUnreservedCheckIn({
          locationId: location.id,
          slotId: targetSlotId,
          vehicleType,
          vehicleNumber,
          durationHours,
          paymentMethod,
        });
      }
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 text-white flex items-center justify-between ${
          isReservedFlow
            ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900'
            : 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isReservedFlow ? 'bg-blue-500/40 text-cyan-200' : 'bg-emerald-500/40 text-emerald-200'
              }`}>
                {isReservedFlow ? 'Category A: Advance Reserved' : 'Category B: Instant Check-In'}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {location.name}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {isReservedFlow ? 'Reserve Parking Slot' : 'Instant Spot Check-In'}
            </h3>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={closeBookingModal}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Vehicle Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Select Vehicle Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Two Wheeler', 'Car', 'SUV', 'Other / EV'] as VehicleType[]).map((type) => {
                const isSelected = vehicleType === type;
                const rate = location.vehicleRates[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setVehicleType(type);
                      setSelectedSlotId('');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-900'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      {type === 'Two Wheeler' && <Bike className="w-4 h-4 text-blue-600" />}
                      {type === 'Car' && <Car className="w-4 h-4 text-emerald-600" />}
                      {type === 'SUV' && <Truck className="w-4 h-4 text-amber-600" />}
                      {type === 'Other / EV' && <Zap className="w-4 h-4 text-cyan-600" />}
                      <span className="text-xs font-bold font-sans">₹{rate}/h</span>
                    </div>
                    <div className="text-xs font-bold truncate">{type}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vehicle Registration Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Vehicle Registration Plate Number
              </label>
              {user?.savedVehicles && user.savedVehicles.length > 0 && (
                <span className="text-[11px] text-blue-600 font-medium">
                  Autofill from saved profile
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                id="booking-vehicle-number-input"
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. TN 09 BX 4289"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              {user?.savedVehicles && (
                <select
                  onChange={(e) => {
                    if (e.target.value) setVehicleNumber(e.target.value);
                  }}
                  className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="">Saved Vehicles</option>
                  {user.savedVehicles.map((v) => (
                    <option key={v.id} value={v.plateNumber}>
                      {v.plateNumber} ({v.type})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Date
              </label>
              <div className="relative">
                <input
                  id="booking-date-input"
                  type="date"
                  value={date}
                  min={todayStr}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            {/* Arrival Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Arrival Time
              </label>
              <input
                id="booking-time-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                5. Duration (Hours)
              </label>
              <select
                id="booking-duration-select"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
                <option value={4}>4 Hours</option>
                <option value={6}>6 Hours</option>
                <option value={8}>8 Hours (Full Day)</option>
              </select>
            </div>
          </div>

          {/* Slot Selection Preference */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                6. Slot Assignment
              </label>
              <span className="text-xs text-emerald-600 font-semibold">
                {availableSlotsForType.length} available bays
              </span>
            </div>

            {preselectedSlot ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-900 font-mono text-sm">
                    Slot {preselectedSlot.number}
                  </span>
                  <span className="text-emerald-700 ml-2">
                    ({preselectedSlot.floor})
                  </span>
                </div>
                <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  Preselected Bay
                </span>
              </div>
            ) : (
              <select
                id="booking-slot-select"
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
              >
                <option value="">Auto-Assign Optimal Nearest Slot</option>
                {availableSlotsForType.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    Slot {slot.number} – {slot.floor} {slot.hasEVCharging ? '(EV)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              7. Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { name: 'UPI (GPay / PhonePe)', desc: 'Fast Instant QR' },
                { name: 'Credit / Debit Card', desc: 'Visa, Master, RuPay' },
                { name: 'Pay at Parking Gate', desc: 'Cash / Fastag Toll' },
              ].map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setPaymentMethod(m.name)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === m.name
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{m.name}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Calculation Summary Box */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Hourly Rate ({vehicleType}):</span>
              <span>₹{hourlyRate} × {durationHours} hr(s) = ₹{baseAmount}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>GST / Platform Fee (18%):</span>
              <span>₹{taxAmount}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex items-center justify-between">
              <span className="text-sm font-extrabold text-white">Total Payable Amount:</span>
              <span className="text-xl font-black text-cyan-300 font-sans">₹{totalAmount}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeBookingModal}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-reservation-submit-btn"
              type="submit"
              disabled={isProcessing}
              className={`flex-2 py-3 px-4 rounded-xl text-white font-bold text-xs tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isReservedFlow
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isReservedFlow ? 'Confirm & Reserve Slot' : 'Confirm Check-In'} (₹{totalAmount})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export const BookingFormModal: React.FC = () => {
  const { activeBookingModal } = useParking();

  if (!activeBookingModal || !activeBookingModal.isOpen) {
    return null;
  }

  return <BookingFormModalInner modalData={activeBookingModal} />;
};
