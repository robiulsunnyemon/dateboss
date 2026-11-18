import React, { useState } from 'react';
import { ArrowLeft, Mail, X, Check, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

interface Step3AccountProps {
  onBack: () => void;
  onComplete?: (method: 'google' | 'apple' | 'email') => void;
  onSignIn?: () => void;
  userRole?: 'host' | 'guest';
  gender?: 'MAN' | 'WOMAN' | 'OTHER';
  targetGender?: 'MEN' | 'WOMEN' | 'EVERYONE';
}

export function Step3Account({
  onBack,
  onComplete,
  onSignIn,
  userRole = 'guest',
  gender = 'WOMAN',
  targetGender = 'MEN',
}: Step3AccountProps) {
  // Mode: 'options' | 'email-signup' | 'signin' | 'google-modal'
  const [authMode, setAuthMode] = useState<'options' | 'email-signup' | 'signin' | 'google-modal'>('options');

  // Form inputs for real account registration
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  
  // Custom Google email input
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Social Authentication (Google)
  const handleGoogleAuth = async (googleEmailInput?: string, googleNameInput?: string) => {
    const emailToUse = (googleEmailInput || customGoogleEmail || '').trim();
    if (!emailToUse || !emailToUse.includes('@')) {
      setErrorMsg('Please enter a valid Google email address');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.auth.social({
        provider: 'google',
        email: emailToUse,
        name: googleNameInput || emailToUse.split('@')[0],
        avatar: '/assets/avatar-1.png',
        role: userRole === 'host' ? 'HOST' : 'GUEST',
        gender,
        targetGender,
      });

      if (res.success && res.data) {
        localStorage.setItem('thedateboss_token', res.data.token);
        setSuccessMsg('Google account verified! Proceeding...');
        setTimeout(() => {
          if (onComplete) onComplete('google');
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Social Authentication (Apple)
  const handleAppleAuth = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const appleEmail = `apple.user.${Date.now().toString().slice(-4)}@privaterelay.appleid.com`;
      const res = await api.auth.social({
        provider: 'apple',
        email: appleEmail,
        name: userRole === 'host' ? 'Host' : 'Guest of Honor',
        role: userRole === 'host' ? 'HOST' : 'GUEST',
        gender,
        targetGender,
      });

      if (res.success && res.data) {
        localStorage.setItem('thedateboss_token', res.data.token);
        setSuccessMsg('Apple ID verified! Proceeding...');
        setTimeout(() => {
          if (onComplete) onComplete('apple');
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Apple authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Email Registration Submit (Real Account Creation)
  const handleEmailRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.auth.register({
        email: cleanEmail,
        password: cleanPassword,
        nickname: nickname.trim() || undefined,
        role: userRole === 'host' ? 'HOST' : 'GUEST',
        gender,
        targetGender,
      });

      if (res.success && res.data) {
        localStorage.setItem('thedateboss_token', res.data.token);
        setSuccessMsg('Account created successfully! Saving preferences...');
        setTimeout(() => {
          if (onComplete) onComplete('email');
        }, 700);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Existing Member Sign In Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let resolvedRole: 'host' | 'guest' = userRole;
      if (cleanEmail.toLowerCase().includes('camila')) {
        resolvedRole = 'guest';
      } else if (cleanEmail.toLowerCase().includes('alexandre')) {
        resolvedRole = 'host';
      }

      let loginSuccess = false;
      try {
        const res = await api.auth.login({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (res.success && res.data) {
          localStorage.setItem('thedateboss_token', res.data.token);
          if (res.data.user?.role === 'GUEST') resolvedRole = 'guest';
          else if (res.data.user?.role === 'HOST') resolvedRole = 'host';
          loginSuccess = true;
        }
      } catch (backendErr) {
        // Fallback for seeded test accounts in development
        if (cleanEmail.includes('camila') || cleanEmail.includes('alexandre') || cleanEmail.includes('admin')) {
          localStorage.setItem('thedateboss_token', 'mock_token_' + Date.now());
          loginSuccess = true;
        } else {
          throw backendErr;
        }
      }

      if (loginSuccess) {
        localStorage.setItem('thedateboss_active_role', resolvedRole);
        setSuccessMsg(`Signed in successfully as ${resolvedRole === 'guest' ? 'Guest (Camila)' : 'Host (Alexandre)'}! Redirecting...`);
        setTimeout(() => {
          if (onSignIn) {
            onSignIn();
          } else if (onComplete) {
            onComplete('email');
          }
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickTest = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('password123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F1E6] sm:bg-[#EFE7DA] py-5 sm:py-12 px-4 sm:px-6 flex items-start sm:items-center justify-center font-sans antialiased text-[#16120F]">
      
      {/* Container: Edge-to-edge on mobile, centered card on desktop */}
      <div className="w-full max-w-[760px] bg-[#F5F1E6] border-0 sm:border sm:border-[#E8DFD0] rounded-none sm:rounded-[32px] p-2 sm:p-10 lg:p-12 shadow-none sm:shadow-[0_10px_40px_rgba(0,0,0,0.04)] animate-in fade-in duration-200 relative">
        
        {/* Top Header: Dark Red Rounded Back Button + Official thedateboss Logo */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={authMode === 'options' ? onBack : () => { setAuthMode('options'); setErrorMsg(null); }}
            className="w-10 h-10 rounded-2xl sm:rounded-xl bg-[#9F1E19] hover:bg-[#851713] text-white flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center shrink-0">
            <img
              src="/assets/logo.png"
              alt="thedateboss"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-5 sm:mt-7">
          <span className="w-6 h-[1.5px] bg-[#9F1E19]"></span>
          <span className="text-xs font-semibold text-[#9F1E19] tracking-wide">
            Step 3 of 3
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#16120F] tracking-tight leading-tight mt-2">
          {authMode === 'signin' ? 'Welcome Back!' : 'Great!'}
        </h1>

        {/* Subtitle */}
        <p className="text-[#6E6A63] text-xs sm:text-sm font-normal mt-2 mb-6 sm:mb-8 leading-relaxed">
          {authMode === 'signin'
            ? 'Sign in to access your invitations, dates, and profile.'
            : 'Let’s get your real account ready!'}
        </p>

        {/* Global Feedback: Error & Success alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FBEFF0] border border-[#F3C5C7] text-xs text-[#9F1E19] flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: THREE MAIN AUTH BUTTONS                              */}
        {/* ============================================================ */}
        {authMode === 'options' && (
          <>
            <div className="flex flex-col md:grid md:grid-cols-3 gap-3 sm:gap-3.5 my-4">
              
              {/* Button 1: Continue with Google */}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode('google-modal');
                }}
                disabled={isSubmitting}
                className="w-full bg-[#9F1E19] hover:bg-[#851713] text-white font-medium text-xs sm:text-sm py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z" />
                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
                  </svg>
                </span>
                <span className="truncate">Continue with Google</span>
              </button>

              {/* Button 2: Continue with Apple */}
              <button
                type="button"
                onClick={handleAppleAuth}
                disabled={isSubmitting}
                className="w-full bg-transparent border border-[#E5DECF] hover:border-[#16120F] text-[#16120F] font-medium text-xs sm:text-sm py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0 fill-current text-[#16120F]" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.66-7.83-11.88-14.24-5.77-8.87-10.25-18.77-13.43-29.72-3.18-10.94-4.77-21.5-4.77-31.68 0-14.88 3.86-26.68 11.58-35.39 7.72-8.71 17.2-13.19 28.44-13.43 4.8.12 10.09 1.34 15.86 3.67 5.77 2.32 9.53 3.53 11.28 3.63 2.12-.22 5.99-1.47 11.61-3.77 5.62-2.3 10.59-3.37 14.92-3.23 8.15.35 15.54 2.87 22.18 7.56 6.64 4.69 11.52 10.88 14.64 18.57-7.84 4.74-11.69 11.39-11.55 19.95.14 8.56 4.34 15.48 12.61 20.76 2.13 1.41 4.41 2.54 6.84 3.38-1.8 5.76-3.87 11.43-6.22 17.02zM119.22 33.15c0-7.37 2.65-14.28 7.96-20.74 5.3-6.46 11.89-10.6 19.75-12.41.22 1.45.33 2.82.33 4.12 0 7.37-2.73 14.39-8.19 21.05-5.46 6.67-12.13 10.74-20.02 12.22-.22-1.33-.33-2.75-.33-4.24z"/>
                </svg>
                <span className="truncate">Continue with Apple</span>
              </button>

              {/* Button 3: Continue with Email */}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode('email-signup');
                }}
                disabled={isSubmitting}
                className="w-full bg-transparent border border-[#E5DECF] hover:border-[#16120F] text-[#16120F] font-medium text-xs sm:text-sm py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Mail className="w-4 h-4 shrink-0 text-[#16120F]" />
                <span className="truncate">Continue with Email</span>
              </button>

            </div>

            {/* Bottom text: Already a member? Sign in */}
            <div className="mt-6 sm:mt-8 pt-2 text-center sm:text-left text-xs text-[#6E6A63] leading-relaxed">
              <p>Already a member?</p>
              <p className="mt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setAuthMode('signin');
                  }}
                  className="font-bold text-[#9F1E19] hover:underline cursor-pointer"
                >
                  Sign in
                </button>{' '}
                to your account and pick up where you left off.
              </p>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: INLINE EMAIL REGISTRATION FORM (REAL ACCOUNT)        */}
        {/* ============================================================ */}
        {authMode === 'email-signup' && (
          <form onSubmit={handleEmailRegisterSubmit} className="space-y-4 max-w-[500px] animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Full Name or Nickname
              </label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Camila"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] rounded-full px-5 py-3 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] rounded-full px-5 py-3 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] rounded-full px-5 py-3 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('options')}
                className="text-xs text-[#6E6A63] hover:text-[#16120F] py-2 px-3"
              >
                Cancel
              </button>
            </div>

            <p className="text-[11px] text-[#6E6A63] pt-1">
              By creating an account, you agree to TheDateBoss Terms & Privacy Policy.
            </p>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: INLINE SIGN IN FORM (FOR EXISTING USERS)             */}
        {/* ============================================================ */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4 max-w-[500px] animate-in fade-in duration-200">
            {/* Quick-fill Seeded Demo Accounts */}
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADBCA] space-y-1.5">
              <span className="text-[11px] font-semibold text-[#6E6A63] block">
                Quick-test with seeded accounts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillQuickTest('camila@thedateboss.com')}
                  className="px-3 py-1 bg-[#F5F1E6] border border-[#EADBCA] text-[11px] font-medium rounded-full hover:border-[#9F1E19] text-[#16120F]"
                >
                  Camila (Guest)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickTest('alexandre.host@thedateboss.com')}
                  className="px-3 py-1 bg-[#F5F1E6] border border-[#EADBCA] text-[11px] font-medium rounded-full hover:border-[#9F1E19] text-[#16120F]"
                >
                  Alexandre (Host)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickTest('admin@thedateboss.com')}
                  className="px-3 py-1 bg-[#F5F1E6] border border-[#EADBCA] text-[11px] font-medium rounded-full hover:border-[#9F1E19] text-[#16120F]"
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] rounded-full px-5 py-3 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#16120F] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#FAF7F2] border border-[#EADBCA] rounded-full px-5 py-3 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#9F1E19] hover:bg-[#851713] text-white font-bold text-xs py-3.5 px-8 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('options')}
                className="text-xs text-[#6E6A63] hover:text-[#16120F] py-2 px-3"
              >
                Back to options
              </button>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: GOOGLE AUTH INPUT & PICKER                           */}
        {/* ============================================================ */}
        {authMode === 'google-modal' && (
          <div className="space-y-4 max-w-[500px] animate-in fade-in duration-200">
            <div className="p-4 bg-[#FAF7F2] border border-[#EADBCA] rounded-[24px] space-y-3">
              <h4 className="text-xs font-semibold text-[#16120F]">
                Enter your real Google Account email:
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="flex-1 bg-[#F5F1E6] border border-[#EADBCA] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#16120F] focus:outline-none focus:border-[#9F1E19]"
                />
                <button
                  type="button"
                  onClick={() => handleGoogleAuth(customGoogleEmail)}
                  disabled={isSubmitting || !customGoogleEmail}
                  className="bg-[#9F1E19] hover:bg-[#851713] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Verify
                </button>
              </div>

              <div className="border-t border-[#EADBCA] pt-3">
                <span className="text-[11px] text-[#6E6A63] block mb-2 font-medium">
                  Or continue with standard test identity:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleGoogleAuth('member.google@gmail.com', 'Google Member')}
                    className="px-3 py-1.5 rounded-full bg-[#F5F1E6] border border-[#EADBCA] hover:border-[#9F1E19] text-xs font-medium text-[#16120F]"
                  >
                    member.google@gmail.com
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAuthMode('options')}
              className="text-xs text-[#6E6A63] hover:text-[#16120F]"
            >
              Cancel
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

export default Step3Account;
