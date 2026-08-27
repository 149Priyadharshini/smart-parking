import React from 'react';
import { useParking } from '../context/ParkingContext';
import { 
  CheckCircle2, 
  X, 
  QrCode, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Download, 
  Printer, 
  Ticket, 
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const BookingConfirmationModal: React.FC = () => {
  const { 
    confirmedBooking, 
    setConfirmedBooking, 
    viewTicketBooking, 
    setViewTicketBooking,
    setCurrentView 
  } = useParking();

  const booking = confirmedBooking || viewTicketBooking;

  if (!booking) return null;

  const isConfirmedFlow = Boolean(confirmedBooking);

  const handleClose = () => {
    setConfirmedBooking(null);
    setViewTicketBooking(null);
  };

  const handleGoToMyBookings = () => {
    handleClose();
    setCurrentView('my-bookings');
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header with success badge */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 text-center relative overflow-hidden">
          <button
            id="close-confirmation-modal-btn"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-950">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-0.5 rounded-full border border-emerald-800">
            {isConfirmedFlow ? 'Slot Successfully Reserved' : 'Digital Parking Pass'}
          </span>

          <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
            {booking.locationName}
          </h3>

          <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate">{booking.locationAddress}</span>
          </p>
        </div>

        {/* Ticket Body with cutout styling */}
        <div className="p-6 space-y-6">
          
          {/* Main Slot Highlight Box */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Assigned Slot Number
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono mt-0.5">
                {booking.slotNumber}
              </div>
              <div className="text-xs text-blue-700 font-semibold mt-0.5">
                {booking.floor}
              </div>
            </div>

            {/* Generated QR Pass Preview */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-900 rounded-lg p-1 flex items-center justify-center text-white">
                <QrCode className="w-12 h-12 text-cyan-300" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">
                SCAN AT GATE
              </span>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">
                Booking ID
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                #{booking.bookingNumber}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">
                Vehicle Plate
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {booking.vehicleNumber}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">
                Date & Start Time
              </span>
              <span className="font-semibold text-slate-900">
                {booking.date} • {booking.time}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">
                Duration & Exit
              </span>
              <span className="font-semibold text-slate-900">
                {booking.durationHours} hr(s) (Till {booking.exitTime})
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">
                Vehicle Type
              </span>
              <span className="font-semibold text-slate-900">
                {booking.vehicleType}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">
                Total Paid Amount
              </span>
              <span className="font-black text-emerald-700 text-sm font-sans">
                ₹{booking.totalAmount} ({booking.paymentMethod.split(' ')[0]})
              </span>
            </div>

          </div>

          {/* Gate Instructions Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Show this QR code at the entry RFID/Camera boom barrier at {booking.locationName} for automatic entry.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                id="print-parking-pass-btn"
                onClick={handlePrintOrDownload}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save / Print Slip</span>
              </button>

              <button
                id="view-my-bookings-modal-btn"
                onClick={handleGoToMyBookings}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Done & Return
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
