import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@thedateboss.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#EFE7DA] flex items-center justify-center p-4 sm:p-6 font-sans text-[#16120F]">
      <div className="w-full max-w-[460px] bg-[#FAF7F2] border border-[#E5DDD0] rounded-[28px] p-7 sm:p-10 shadow-[0_12px_40px_rgba(22,18,15,0.06)]">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <img
            src="/assets/logo.png"
            alt="thedateboss"
            className="h-9 w-auto object-contain"
          />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F1E6] border border-[#E5DDD0] text-[11px] font-semibold text-[#9F1E19]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </span>
        </div>

        {/* Eyebrow & Heading */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-[1.5px] bg-[#9F1E19]" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9F1E19]">
              Dashboard Access
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#16120F] leading-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A63] mt-1.5 leading-relaxed">
            Sign in to manage member verifications, subscriptions, and platform overview.
          </p>
        </div>

        {/* Demo Seeded Admin Box */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#F5F1E6] border border-[#E5DDD0] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#16120F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9F1E19]" />
              Demo Admin Seed
            </p>
            <p className="text-[11px] text-[#6E6A63] truncate mt-0.5">
              admin@thedateboss.com · password123
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#E5DDD0] hover:border-[#9F1E19] text-[11px] font-semibold text-[#9F1E19] transition-colors cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FBEFF0] border border-[#F3C5C7] text-xs text-[#9F1E19] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6E6A63] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@thedateboss.com"
                className="w-full bg-white border border-[#E5DDD0] rounded-full pl-11 pr-4 py-3 text-sm text-[#16120F] placeholder:text-[#A39E96] focus:outline-none focus:border-[#9F1E19] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6E6A63] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white border border-[#E5DDD0] rounded-full pl-11 pr-11 py-3 text-sm text-[#16120F] placeholder:text-[#A39E96] focus:outline-none focus:border-[#9F1E19] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E6A63] hover:text-[#16120F]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#9F1E19] hover:bg-[#851713] text-white font-semibold text-sm py-3.5 px-6 rounded-full shadow-sm transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-[#6E6A63]">
          Meaningful connections. Thoughtfully managed.
        </p>
      </div>
    </div>
  );
}
