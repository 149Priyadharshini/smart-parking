import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import { 
  Car, 
  Mail, 
  Phone, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useParking();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('149priyadharshini@gmail.com');
  const [password, setPassword] = useState('password123');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [name, setName] = useState('Priyadharshini');

  const validateInput = () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email ID or 10-digit mobile number.');
      return false;
    }

    const isEmail = identifier.includes('@');
    const isPhone = /^[0-9+ -]{8,15}$/.test(identifier.trim());

    if (!isEmail && !isPhone) {
      setErrorMessage('Please enter a valid email address or phone number.');
      return false;
    }

    if (authMode === 'password' && !password.trim()) {
      setErrorMessage('Please enter your password (minimum 6 characters).');
      return false;
    }

    if (authMode === 'otp' && otpSent && (!otp || otp.length < 4)) {
      setErrorMessage('Please enter the 4-digit verification OTP code.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your phone number or email first.');
      return;
    }
    setErrorMessage('');
    setOtpSent(true);
    setOtp('5821'); // Autofill demo OTP for seamless testing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      login(identifier, authMode === 'otp');
      setIsSubmitting(false);
    }, 600);
  };

  const handleDemoQuickFill = (type: 'email' | 'phone') => {
    if (type === 'email') {
      setIdentifier('149priyadharshini@gmail.com');
      setPassword('smartpark2026');
    } else {
      setIdentifier('+91 98765 43210');
      setPassword('smartpark2026');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900/5 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        
        {/* Left Brand Showcase Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                <Car className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Park<span className="text-cyan-300">Ease</span>
                </span>
                <span className="block text-xs text-blue-200 font-medium tracking-wide">
                  Smart Parking Network
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Find & Reserve Mall & Theatre Parking Slots in Seconds.
            </h1>
            
            <p className="text-sm text-blue-100/90 leading-relaxed mb-8">
              Avoid endless circling and packed basements. Check live availability, pre-reserve dedicated slots, or instantly check in with smart digital parking passes.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 text-xs text-blue-100 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time vacant slot tracking at top malls & theatres</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-100 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Two-wheeler, Car, SUV & EV charging slot pricing</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-100 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Contactless QR clearance & automated slip generation</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isRegisterTab ? 'Create an Account' : 'Welcome to ParkEase'}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {isRegisterTab ? 'New Driver' : 'Driver Sign In'}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {isRegisterTab 
                ? 'Sign up to reserve guaranteed parking at your favourite destinations.' 
                : 'Enter your phone number or email to access live mall and theatre parking.'}
            </p>
          </div>

          {/* Tab Switcher (Sign In vs Register) */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
            <button
              id="login-tab-btn"
              type="button"
              onClick={() => { setIsRegisterTab(false); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegisterTab 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              id="register-tab-btn"
              type="button"
              onClick={() => { setIsRegisterTab(true); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegisterTab 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Authentication Mode Switcher (Password vs OTP) */}
          <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-700">
            <span>Authentication Mode:</span>
            <div className="inline-flex gap-2">
              <button
                type="button"
                onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
                className={`px-3 py-1 rounded-md transition-all ${
                  authMode === 'password'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
                className={`px-3 py-1 rounded-md transition-all ${
                  authMode === 'otp'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                OTP Verification
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterTab && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  id="register-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyadharshini"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number or Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <input
                  id="login-identifier-input"
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter email or 10-digit mobile"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                E.g. <span className="text-slate-600 font-mono">149priyadharshini@gmail.com</span> or <span className="text-slate-600 font-mono">+91 98765 43210</span>
              </p>
            </div>

            {authMode === 'password' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    One-Time Password (OTP)
                  </label>
                  {!otpSent ? (
                    <button
                      id="send-otp-btn"
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Send OTP via SMS/Email
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-medium text-slate-500 hover:text-blue-600"
                    >
                      Resend OTP (demo code auto-filled)
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="login-otp-input"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={otpSent ? "Enter 4-digit code (5821)" : "Click 'Send OTP' above"}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-mono tracking-widest"
                  />
                </div>
                {otpSent && (
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Demo OTP sent & filled (5821)
                  </p>
                )}
              </div>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegisterTab ? 'Create Account & Continue' : 'Sign In & Explore Parking'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Reviewer Convenience */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Test Autofill:
              </span>
            </div>
            <div className="flex gap-2">
              <button
                id="demo-email-btn"
                type="button"
                onClick={() => handleDemoQuickFill('email')}
                className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                Auto-fill Email
              </button>
              <button
                id="demo-phone-btn"
                type="button"
                onClick={() => handleDemoQuickFill('phone')}
                className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                Auto-fill Phone
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
