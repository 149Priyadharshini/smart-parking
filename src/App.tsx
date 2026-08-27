/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ParkingProvider, useParking } from './context/ParkingContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { ParkingDashboard } from './components/ParkingDashboard';
import { MallsTheatresPage } from './components/MallsTheatresPage';
import { ParkingSlotPage } from './components/ParkingSlotPage';
import { MyBookings } from './components/MyBookings';
import { Profile } from './components/Profile';
import { Footer } from './components/Footer';
import { BookingFormModal } from './components/BookingFormModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentView } = useParking();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {!isAuthenticated || currentView === 'login' ? (
          <Login />
        ) : (
          <>
            {currentView === 'dashboard' && <ParkingDashboard />}
            {currentView === 'malls-theatres' && <MallsTheatresPage />}
            {currentView === 'parking-slot' && <ParkingSlotPage />}
            {currentView === 'my-bookings' && <MyBookings />}
            {currentView === 'profile' && <Profile />}
          </>
        )}
      </main>

      {/* Global Modals */}
      <BookingFormModal />
      <BookingConfirmationModal />

      {/* Footer */}
      {isAuthenticated && currentView !== 'login' && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ParkingProvider>
      <AppContent />
    </ParkingProvider>
  );
}
