import React from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Eye
} from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { HeroBadge } from './HeroBadge';
import { BottomLeftCard } from './BottomLeftCard';
import { BottomRightCorner } from './BottomRightCorner';

interface Props {
  onSignIn: () => void;
  isSigningIn?: boolean;
  onReplayIntro?: () => void;
  isMobilePreview?: boolean;
  onToggleMobilePreview?: () => void;
}

export const LoginPage: React.FC<Props> = ({
  onSignIn,
  isSigningIn = false,
  onReplayIntro,
  isMobilePreview,
  onToggleMobilePreview
}) => {
  const VIDEO_URL =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4';

  const menuItems = [
    { label: 'Ecosystem', hasDropdown: false },
    { label: 'Economics', hasDropdown: true },
    { label: 'Developers', hasDropdown: false },
    { label: 'Governance', hasDropdown: true }
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-3 md:p-5 bg-[#f0f0f0] select-none font-helvetica">
      <section className="relative w-full max-w-[1536px] min-h-[92vh] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/10 group justify-between">
        
        {/* The Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
          src={VIDEO_URL}
        />

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between flex-1 pb-24 md:pb-16">
          
          {/* Navbar */}
          <nav className="flex items-center justify-between py-6 px-6 md:px-10 w-full relative z-10">
            {/* Left Side spacer / Brand */}
            <div className="flex-1 flex items-center gap-3">
              <span className="font-regular tracking-tighter text-xl text-[rgba(30,50,90,0.9)]">
                RIVR
              </span>
              <span className="text-[11px] text-[rgba(30,50,90,0.7)] px-2.5 py-0.5 rounded-full bg-white/50 backdrop-blur-md border border-white/20 hidden sm:inline-block">
                Survey Gateway
              </span>
            </div>

            {/* Center Menu */}
            <ul className="hidden md:flex items-center gap-8 text-[rgb(45,45,45)] font-normal text-sm">
              {menuItems.map(item => (
                <li
                  key={item.label}
                  className="cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-1 group"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </li>
              ))}
            </ul>

            {/* Right Buttons: Replay Intro, Mobile Preview, and Sign In */}
            <div className="flex-1 flex items-center justify-end gap-2.5">
              {onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 text-[rgba(30,50,90,0.9)] text-xs font-normal border border-white/30 backdrop-blur-md transition-all cursor-pointer"
                  title="Watch cinematic eyes intro"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Eyes Intro</span>
                </button>
              )}

              {onToggleMobilePreview && (
                <button
                  type="button"
                  onClick={onToggleMobilePreview}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 text-[rgba(30,50,90,0.9)] text-xs font-normal border border-white/30 backdrop-blur-md transition-all cursor-pointer"
                  title="Toggle Mobile Screen Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isMobilePreview ? 'Exit Mobile' : 'Mobile Preview'}</span>
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSignIn}
                className="flex items-center bg-[rgba(30,50,90,0.8)] text-white rounded-full pl-2 pr-4 md:pr-6 py-1.5 md:py-2 gap-2 md:gap-3 hover:bg-[rgba(30,50,90,1)] transition-colors group cursor-pointer shadow-sm"
              >
                <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm font-normal">
                  {isSigningIn ? 'Connecting...' : 'Sign In'}
                </span>
              </motion.button>
            </div>
          </nav>

          {/* Hero & Login Card Container */}
          <div className="w-full flex flex-col items-center pt-4 md:pt-8 px-6 text-center max-w-4xl my-auto">
            <HeroBadge text="Fluid Staking &amp; Feedback" />

            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#5E6470] mb-2 tracking-tight leading-[1.05]"
            >
              Fluid Asset Streams
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-[#5E6470] opacity-80 leading-relaxed max-w-xl font-normal"
            >
              Access Smart Vaults, stake RIVR, NFTs, transform rigid holdings into liquid cash instantly.
            </motion.p>

            {/* Sleek Glassmorphism Sign-In Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-6 md:mt-8 p-5 sm:p-7 rounded-[1.6rem] md:rounded-[2.2rem] bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg shadow-[rgba(30,50,90,0.06)] max-w-md w-full flex flex-col items-center text-center"
            >
              <div className="w-11 h-11 rounded-full bg-white/60 border border-white/40 flex items-center justify-center text-[rgba(30,50,90,0.9)] mb-3 shadow-xs">
                <Sparkles className="w-5 h-5 text-[rgba(30,50,90,0.85)]" />
              </div>

              <h3 className="text-lg sm:text-xl font-normal text-[rgba(30,50,90,0.95)] tracking-tight">
                Sign In to Enter Survey
              </h3>
              <p className="text-xs text-[rgba(30,50,90,0.7)] mt-1 mb-5 max-w-xs leading-relaxed">
                Connect your Google account to access the survey portal, vote on features, and track responses.
              </p>

              {/* Google Sign In Button */}
              <div className="w-full flex justify-center transform active:scale-98 transition-transform">
                <GoogleSignInButton
                  onClick={onSignIn}
                  isLoading={isSigningIn}
                  label="Sign in with Google to Continue"
                  className="w-full justify-center py-2.5 rounded-full font-normal shadow-sm hover:shadow-md text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[rgba(30,50,90,0.65)] mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified Google Single Sign-On • Zero passwords needed</span>
              </div>
            </motion.div>

          </div>

          {/* Bottom Left Card */}
          <BottomLeftCard
            countText="5.2K"
            label="Active Yielders"
            buttonText="Join Discord"
            onButtonClick={onSignIn}
          />

          {/* Bottom Right Corner Cutout */}
          <BottomRightCorner
            title="Documentation"
            subtitle="Library"
            onClick={onSignIn}
          />

        </div>

      </section>
    </div>
  );
};
