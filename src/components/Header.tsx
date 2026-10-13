import React from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  Mail,
  Database,
  CheckCircle2,
  ClipboardList,
  BarChart3,
  Info,
  LogOut,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/65 backdrop-blur-xl border-b border-white/40 shadow-none font-helvetica select-none">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* Main Navigation Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-2.5 md:py-0 md:h-20 gap-2 sm:gap-3">
          
          {/* Top Bar for Mobile / Left Section for Desktop */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Brand Info */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.15)] flex items-center justify-center text-[rgba(30,50,90,0.9)] shadow-xs shrink-0">
                <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-[rgba(30,50,90,0.85)]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-normal text-[rgba(30,50,90,0.95)] text-lg sm:text-xl tracking-tight">
                    Vexlora
                  </span>
                  <span className="bg-white/70 text-[rgba(30,50,90,0.8)] text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-normal border border-white/40">
                    Surveys
                  </span>
                </div>
                <p className="text-[11px] text-[rgba(30,50,90,0.6)] hidden sm:block font-normal">
                  Tell us your problem, let us solve it • Save time &amp; get big outputs
                </p>
              </div>
            </div>

            {/* Mobile Auth & User Profile (Shown on phone headers) */}
            <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
              {user ? (
                <div className="flex items-center gap-1.5 bg-white/60 border border-white/50 py-1 px-2.5 rounded-full shadow-xs">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full border border-white/80"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[rgba(30,50,90,0.85)] text-white text-[10px] flex items-center justify-center font-normal">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-[11px] font-normal text-[rgba(30,50,90,0.9)] max-w-[80px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  {isAdmin && (
                    <span className="text-[9px] font-normal bg-emerald-500/15 text-emerald-800 px-1 py-0.2 rounded-full border border-emerald-500/20">
                      Admin
                    </span>
                  )}
                  <button
                    onClick={onSignOut}
                    title="Sign out"
                    className="p-1 text-[rgba(30,50,90,0.6)] hover:text-[rgba(30,50,90,0.95)] rounded-full transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <GoogleSignInButton onClick={onSignIn} label="Sign in" className="text-xs py-1.5 px-3" />
              )}
            </div>
          </div>

          {/* Navigation Tabs (Full-width segmented pill bar on mobile, centered on desktop) */}
          <nav className="flex items-center justify-between sm:justify-center bg-white/45 p-1 rounded-full border border-white/40 backdrop-blur-md text-xs sm:text-sm w-full md:w-auto shadow-xs">
            <button
              onClick={() => setActiveTab('survey')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-normal transition-all cursor-pointer ${
                activeTab === 'survey'
                  ? 'bg-[rgba(30,50,90,0.85)] text-white shadow-xs'
                  : 'text-[rgba(30,50,90,0.7)] hover:text-[rgba(30,50,90,1)]'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Survey</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-normal transition-all relative cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[rgba(30,50,90,0.85)] text-white shadow-xs'
                  : 'text-[rgba(30,50,90,0.7)] hover:text-[rgba(30,50,90,1)]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Results</span>
              {responsesCount > 0 && (
                <span className="ml-1 bg-white/30 text-white text-[10px] font-normal px-1.5 py-0.2 rounded-full">
                  {responsesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-normal transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-[rgba(30,50,90,0.85)] text-white shadow-xs'
                  : 'text-[rgba(30,50,90,0.7)] hover:text-[rgba(30,50,90,1)]'
              }`}
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>About</span>
            </button>
          </nav>

          {/* Desktop User Controls & Mobile Preview */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            {onToggleMobilePreview && (
              <button
                type="button"
                onClick={onToggleMobilePreview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal bg-white/50 hover:bg-white/80 text-[rgba(30,50,90,0.85)] transition-colors border border-white/40 cursor-pointer shadow-xs"
                title="Toggle Mobile Screen Preview"
              >
                <Smartphone className="w-3.5 h-3.5 text-[rgba(30,50,90,0.8)]" />
                <span>{isMobilePreview ? 'Exit Mobile' : 'Mobile Preview'}</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-white/60 border border-white/50 py-1 px-3 rounded-full shadow-xs">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full border border-white/80"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[rgba(30,50,90,0.85)] text-white text-xs flex items-center justify-center font-normal">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-normal text-[rgba(30,50,90,0.9)] max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                  {isAdmin && (
                    <span className="flex items-center gap-0.5 text-[10px] font-normal bg-emerald-500/15 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="p-2 text-[rgba(30,50,90,0.6)] hover:text-[rgba(30,50,90,0.95)] hover:bg-white/60 rounded-full transition-colors cursor-pointer"
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
        <div className="py-1.5 sm:py-2 px-1 sm:px-2 border-t border-white/30 flex items-center justify-between text-[10px] sm:text-[11px] text-[rgba(30,50,90,0.65)] font-normal">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <span className="flex items-center gap-1 text-[rgba(30,50,90,0.85)] font-normal truncate">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden xs:inline">Target:</span>
              <span className="font-medium text-[rgba(30,50,90,0.95)] truncate">{TARGET_SURVEY_EMAIL}</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-[rgba(30,50,90,0.6)]">
              <Mail className="w-3.5 h-3.5 text-[rgba(30,50,90,0.7)]" />
              Automated Gmail Dispatch
            </span>
            <span className="hidden md:flex items-center gap-1 text-[rgba(30,50,90,0.6)]">
              <Database className="w-3.5 h-3.5 text-amber-600" />
              Firestore Real-Time Sync
            </span>
          </div>

          <div className="text-[10px] text-[rgba(30,50,90,0.5)] shrink-0">
            Vexlora Surveys • User Problem Discovery
          </div>
        </div>

      </div>
    </header>
  );
};
