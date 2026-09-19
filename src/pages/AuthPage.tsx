import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  RotateCcw,
  Activity,
  Lock,
  Stethoscope
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { 
    sendOtp, 
    verifyOtp, 
    loginStep, 
    otpEmail, 
    otpExpirySeconds, 
    isLoading, 
    error, 
    clearError,
    resendOtp
  } = useAuth();

  const [userIdInput, setUserIdInput] = useState('ADM-8821');
  const [emailInput, setEmailInput] = useState('rithikakannan073@gmail.com');
  
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp(userIdInput, emailInput);
  };

  const handleVerifyOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');
    await verifyOtp(code);
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const char = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (index < 5 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);

    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans select-none">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Layout Container */}
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative z-10">
        
        {/* Left Side: MedTrace Branding & Feature Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-700/50">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6">
            {/* Logo Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-emerald-400">med</span>
                <span className="text-blue-400">trace</span>
              </h1>
            </div>

            <p className="text-base text-slate-300 font-medium leading-relaxed">
              Transforming scattered medical documents into a structured, traceable, chronological patient timeline.
            </p>

            {/* Platform Feature Pills */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-semibold">Chronological Patient Medical Timeline</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                <Stethoscope className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs text-slate-200 font-semibold">Source Document Traceability & Verification</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-semibold">Role-Based Hospital Security Protocol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login & OTP Verification Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center space-y-6 bg-white">
          
          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Welcome to MedTrace
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Secure access to your healthcare workspace
            </p>
          </div>

          {/* Error Alert Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="flex-1 font-medium">{error}</span>
            </div>
          )}

          {/* STEP 1: ID + Email Input */}
          {loginStep === 'ID_INPUT' && (
            <form onSubmit={handleSendOtpSubmit} className="space-y-5">
              
              {/* User ID Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  User ID
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={userIdInput}
                    onChange={e => { setUserIdInput(e.target.value); clearError(); }}
                    placeholder="Enter User ID (e.g. ADM-8871)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={e => { setEmailInput(e.target.value); clearError(); }}
                    placeholder="Enter registered email ID"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Authorization...</span>
                  </>
                ) : (
                  <>
                    <span>CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Dedicated OTP Verification Page */}
          {loginStep === 'OTP_INPUT' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Verify Your Email</h3>
                <p className="text-xs text-slate-600 font-medium">
                  We sent a verification code to <strong className="text-slate-900">{otpEmail}</strong>
                </p>
              </div>

              {/* 6 Separate OTP Boxes with Auto-Focus */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Enter Verification Code
                  </label>
                  <span className={`text-xs font-mono font-bold ${otpExpirySeconds > 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                    {otpExpirySeconds > 0 ? `${otpExpirySeconds}s remaining` : 'OTP Expired'}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3 my-4">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(idx, e.target.value)}
                      onKeyDown={e => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className="w-full h-12 md:h-14 text-center text-xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 focus:bg-white shadow-xs transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otpDigits.join('').length < 6 || otpExpirySeconds <= 0}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>VERIFY & ACCESS DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend OTP Button */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={otpExpirySeconds > 45 || isLoading}
                  className="text-xs text-slate-500 hover:text-blue-600 font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend OTP Code</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
