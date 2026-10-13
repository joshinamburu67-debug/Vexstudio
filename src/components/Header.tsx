import React from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Mail, Database, CheckCircle2, ClipboardList, BarChart3, Info, LogOut, ShieldCheck, Smartphone } from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/gmail';

interface Props {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  activeTab: 'survey' | 'analytics' | 'about';
  setActiveTab: (tab: 'survey' | 'analytics' | 'about') => void;
  responsesCount: number;
  isAdmin: boolean;
  isMobilePreview?: boolean;
  onToggleMobilePreview?: () => void;
}

export const Header: React.FC<Props> = ({
  user,
  onSignIn,
  onSignOut,
  activeTab,
  setActiveTab,
  responsesCount,
  isAdmin,
  isMobilePreview,
  onToggleMobilePreview
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-2 ring-indigo-50 shrink-0">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-xl tracking-tight">
                  Vexlora
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold border border-indigo-200/60">
                  Survey
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Problem Discovery &amp; Product Suggestions
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('survey')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all ${
                activeTab === 'survey'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Survey Form</span>
              <span className="sm:hidden">Survey</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all relative ${
                activeTab === 'analytics'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Responses</span>
              <span className="sm:hidden">Results</span>
              {responsesCount > 0 && (
                <span className="ml-0.5 sm:ml-1 bg-indigo-100 text-indigo-700 text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 rounded-full">
                  {responsesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all ${
                activeTab === 'about'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">About</span>
            </button>
          </nav>

          {/* Auth State & Integration Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onToggleMobilePreview && (
              <button
                type="button"
                onClick={onToggleMobilePreview}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                title="Toggle Mobile Screen Preview"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isMobilePreview ? 'Exit Mobile' : 'Mobile Preview'}</span>
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 py-1 px-2.5 rounded-full">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full border border-slate-300"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-700 max-w-[110px] truncate hidden md:inline">
                    {user.displayName || user.email}
                  </span>
                  {isAdmin && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <GoogleSignInButton onClick={onSignIn} label="Sign in" />
            )}
          </div>

        </div>

        {/* Integration Status Bar */}
        <div className="py-1.5 px-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Target Recipient: <span className="font-semibold text-slate-700">{TARGET_SURVEY_EMAIL}</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-500">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              Automated Gmail Dispatch
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-500">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              Firestore Real-Time Sync
            </span>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            All responses safely routed to Vexlora India
          </div>
        </div>

      </div>
    </header>
  );
};
