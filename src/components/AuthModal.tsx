import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  Lock, 
  Mail, 
  User as UserIcon, 
  AlertCircle,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { User as UserType } from '../types';
import { StorageService } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onUserChanged: (user: UserType | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await StorageService.loginWithGoogle();
      if (result.success && result.user) {
        onUserChanged(result.user);
        onClose();
      } else {
        setErrorMessage(result.error || 'Google Sign-In was cancelled or failed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google Sign-In error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await StorageService.loginUser(email, password);
      if (result.success && result.user) {
        onUserChanged(result.user);
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setErrorMessage(result.error || 'Authentication failed. Check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please provide your name or couple name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await StorageService.registerUser(name, email, password);
      if (result.success && result.user) {
        onUserChanged(result.user);
        onClose();
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setErrorMessage(result.error || 'Could not register account. Email might be in use.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    StorageService.logoutUser();
    onUserChanged(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative overflow-hidden text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header accent strip */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-500 to-stone-900" />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private Creator Account</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              {currentUser 
                ? 'Account Management' 
                : mode === 'login' 
                  ? 'Sign In to Your Account' 
                  : 'Create Your Account'
              }
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              {currentUser 
                ? 'You are securely signed in. Your cards, guests, and RSVPs are strictly private.'
                : 'Your wedding cards and guest responses are encrypted and accessible only to you.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 text-sm font-semibold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* If user is already logged in: Profile & Logout info */}
        {currentUser ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3.5">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/60 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-stone-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-xs text-stone-500 truncate">
                  {currentUser.email}
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Authenticated Session</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold block mb-0.5">🔒 Data Privacy Guarantee:</span>
              Other users or guests cannot view your cards, guest list, or RSVP statistics. Only this email and password can access your portal.
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of This Device</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Continue to Portal
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div>
            {/* Toggle Tabs */}
            <div className="flex bg-stone-100 p-1 rounded-xl mb-4 border border-stone-200">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google Sign-in Provider (Enabled in Firebase Console) */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-stone-300 shadow-xs hover:shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-sm">Firebase Enabled</span>
              </button>
            </div>

            <div className="relative flex py-1.5 items-center mb-3.5">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-3 text-stone-400 text-[10px] font-medium uppercase tracking-wider">or sign in with email</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
                {(errorMessage.includes('disabled') || errorMessage.includes('operation-not-allowed')) && (
                  <div className="text-[11px] text-stone-600 bg-white/80 p-2 rounded-lg border border-rose-200/60">
                    💡 <strong>Tip:</strong> Google Sign-In is already active in your Firebase project! Click the <strong>Continue with Google</strong> button above to authenticate immediately.
                  </div>
                )}
              </div>
            )}

            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    Your Name or Couple Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya & Rahul or Aarav"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting with Firebase...</span>
                  </div>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>Sign In with Firebase</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>Create Firebase Account</span>
                    <ArrowRight className="w-4 h-4 ml-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-amber-800/90 font-medium bg-amber-50/80 py-1.5 px-3 rounded-lg border border-amber-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Direct Firebase Authentication & Firestore Cloud Synced</span>
            </div>

            {/* Demo test helper */}
            <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 text-center leading-relaxed space-y-1.5">
              <div>
                <span>Demo credentials: </span>
                <span className="font-mono text-stone-700 font-medium">priya.rahul@wedding.com</span>
                <span> / </span>
                <span className="font-mono text-stone-700 font-medium">password123</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('priya.rahul@wedding.com');
                    setPassword('password123');
                    setName('Priya & Rahul');
                    setErrorMessage(null);
                  }}
                  className="text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 cursor-pointer"
                >
                  Autofill credentials
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
