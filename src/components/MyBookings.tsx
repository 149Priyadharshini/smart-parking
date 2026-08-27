import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { Booking, BookingStatus } from '../types';
import { 
  Ticket, 
  MapPin, 
  Clock, 
  Calendar, 
  Car, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Trash2, 
  PlusCircle, 
  ChevronRight, 
  ShieldCheck,
  Building2,
  Filter
} from 'lucide-react';

export const MyBookings: React.FC = () => {
  const { 
    bookings, 
    cancelBooking, 
    extendBooking, 
    setViewTicketBooking, 
    setCurrentView 
  } = useParking();

  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [extendingId, setExtendingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.bookingStatus === statusFilter;
  });

  const handleCancelConfirm = (id: string) => {
    cancelBooking(id);
    setCancellingId(null);
  };

  const handleExtendHours = (id: string, hours: number) => {
    extendBooking(id, hours);
    setExtendingId(null);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Confirmed (Upcoming)
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Active (Parked Now)
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Cancelled (Slot Released)
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Ticket className="w-3.5 h-3.5" />
            <span>Reservation History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Parking Bookings
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage your active digital parking passes, extend parking durations, or cancel slots.
          </p>
        </div>

        <button
          id="book-new-parking-btn"
          onClick={() => setCurrentView('malls-theatres')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors self-start flex items-center gap-1.5 cursor-pointer"
        >
          <span>Find & Book New Slot</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        {[
          { key: 'ALL', label: `All Bookings (${bookings.length})` },
          { key: 'Confirmed', label: 'Upcoming Confirmed' },
          { key: 'Active', label: 'Parked / Active' },
          { key: 'Completed', label: 'Completed' },
          { key: 'Cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            id={`filter-booking-${tab.key.toLowerCase()}`}
            onClick={() => setStatusFilter(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const canModify = booking.bookingStatus === 'Confirmed' || booking.bookingStatus === 'Active';

            return (
              <div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                {/* Top Bar: Location & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        {booking.locationName}
                      </h3>
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{booking.bookingNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.locationAddress}</span>
                    </p>
                  </div>

                  <div className="self-start sm:self-auto">
                    {getStatusBadge(booking.bookingStatus)}
                  </div>
                </div>

                {/* Body Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Allocated Slot
                    </span>
                    <span className="font-mono font-black text-slate-900 text-base">
                      {booking.slotNumber}
                    </span>
                    <span className="text-[11px] text-blue-600 block font-medium">
                      {booking.floor}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Vehicle Plate & Type
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {booking.vehicleNumber}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      {booking.vehicleType}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Scheduled Window
                    </span>
                    <span className="font-semibold text-slate-900">
                      {booking.date}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      {booking.time} – {booking.exitTime} ({booking.durationHours}h)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Amount Paid
                    </span>
                    <span className="font-black text-emerald-700 text-base font-sans">
                      ₹{booking.totalAmount}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      via {booking.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Inline Confirmation Dialog for Cancel */}
                {cancellingId === booking.id && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs text-rose-800 font-semibold">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Are you sure you want to cancel slot {booking.slotNumber}? The slot will be freed for other drivers.</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setCancellingId(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700"
                      >
                        Keep Booking
                      </button>
                      <button
                        onClick={() => handleCancelConfirm(booking.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Extension Dialog */}
                {extendingId === booking.id && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs text-blue-900 font-semibold">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Extend parking at ₹{booking.ratePerHour}/hour:</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleExtendHours(booking.id, 1)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                      >
                        + 1 Hour (₹{booking.ratePerHour})
                      </button>
                      <button
                        onClick={() => handleExtendHours(booking.id, 2)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                      >
                        + 2 Hours (₹{booking.ratePerHour * 2})
                      </button>
                      <button
                        onClick={() => setExtendingId(null)}
                        className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      id={`view-pass-btn-${booking.id}`}
                      onClick={() => setViewTicketBooking(booking)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <QrCode className="w-3.5 h-3.5 text-cyan-300" />
                      <span>View Pass / QR</span>
                    </button>

                    {canModify && (
                      <button
                        id={`extend-btn-${booking.id}`}
                        onClick={() => setExtendingId(booking.id)}
                        className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Extend Duration</span>
                      </button>
                    )}
                  </div>

                  {canModify && (
                    <button
                      id={`cancel-btn-${booking.id}`}
                      onClick={() => setCancellingId(booking.id)}
                      className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Reservations Found</h3>
          <p className="text-xs text-slate-500 mb-6">
            You don't have any bookings matching this status filter. Reserve a slot at any shopping mall or theatre.
          </p>
          <button
            onClick={() => setCurrentView('malls-theatres')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
          >
            Explore Malls & Theatres
          </button>
        </div>
      )}

    </div>
  );
};
