import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { 
  Car, 
  MapPin, 
  Ticket, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    isAuthenticated, 
    user, 
    currentView, 
    setCurrentView, 
    setSelectedLocationId,
    logout,
    bookings,
    setSearchQuery
  } = useParking();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const activeBookingsCount = bookings.filter(
    (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Active'
  ).length;

  const handleNavClick = (view: 'dashboard' | 'malls-theatres' | 'my-bookings' | 'profile') => {
    setCurrentView(view);
    setSelectedLocationId(null);
    setMobileMenuOpen(false);
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setSearchQuery(navSearch.trim());
      setCurrentView('malls-theatres');
      setSelectedLocationId(null);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  Park<span className="text-blue-600">Ease</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-sm border border-blue-200">
                  Smart AI
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium hidden sm:block">
                Malls & Theatres Parking
              </p>
            </div>
          </div>

          {/* Search bar in nav for fast access */}
          {isAuthenticated && (
            <form 
              onSubmit={handleNavSearchSubmit}
              className="hidden md:flex items-center relative max-w-xs w-full mx-4"
            >
              <Search className="w-4 h-4 text-slate-600 absolute left-3 pointer-events-none" />
              <input
                id="navbar-search-input"
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search malls, theatres..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </form>
          )}

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <button
                  id="nav-home-btn"
                  onClick={() => handleNavClick('dashboard')}
                  className={`text-sm font-semibold transition-all py-1 cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Home
                </button>

                <button
                  id="nav-malls-theatres-btn"
                  onClick={() => handleNavClick('malls-theatres')}
                  className={`text-sm font-semibold transition-all py-1 flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'malls-theatres' || currentView === 'parking-slot'
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Malls & Theatres</span>
                </button>

                <button
                  id="nav-my-bookings-btn"
                  onClick={() => handleNavClick('my-bookings')}
                  className={`text-sm font-semibold transition-all py-1 relative flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'my-bookings'
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>My Bookings</span>
                  {activeBookingsCount > 0 && (
                    <span className="ml-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-profile-link-btn"
                  onClick={() => handleNavClick('profile')}
                  className={`text-sm font-semibold transition-all py-1 flex items-center gap-1.5 cursor-pointer ${
                    currentView === 'profile'
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </nav>

              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                {/* Location indicator pill */}
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-slate-700">Chennai, TN</span>
                </div>

                {/* User Profile dropdown or button */}
                <button
                  id="nav-profile-btn"
                  onClick={() => handleNavClick('profile')}
                  className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                  title={user?.name || 'User Profile'}
                >
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  title="Log Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                id="nav-login-cta-btn"
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            {isAuthenticated && (
              <button
                id="nav-mobile-profile-btn"
                onClick={() => handleNavClick('profile')}
                className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center"
              >
                {user?.name?.charAt(0) || 'U'}
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {isAuthenticated ? (
            <>
              <form onSubmit={handleNavSearchSubmit} className="relative mb-3">
                <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Search malls & theatres..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Home Dashboard</span>
              </button>

              <button
                onClick={() => handleNavClick('malls-theatres')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentView === 'malls-theatres' || currentView === 'parking-slot' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Malls & Theatres</span>
              </button>

              <button
                onClick={() => handleNavClick('my-bookings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentView === 'my-bookings' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Ticket className="w-4 h-4 text-blue-500" />
                  <span>My Bookings</span>
                </div>
                {activeBookingsCount > 0 && (
                  <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeBookingsCount} Active
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentView === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-blue-500" />
                <span>My Profile & Vehicles</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Logged in as <span className="font-medium text-slate-700">{user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 py-1 px-2 rounded-md hover:bg-rose-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setCurrentView('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center font-semibold text-white bg-blue-600 rounded-lg"
            >
              Sign In to ParkEase
            </button>
          )}
        </div>
      )}
    </header>
  );
};
