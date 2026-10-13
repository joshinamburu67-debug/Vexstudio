import React from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
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
}

export const LoginPage: React.FC<Props> = ({
  onSignIn,
  isSigningIn = false,
  onReplayIntro
}) => {
  const VIDEO_URL =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4';

  const menuItems = [
    { label: 'Problem Statements', hasDropdown: false },
    { label: 'Survey Features', hasDropdown: true },
    { label: 'Feature Wishlist', hasDropdown: false },
    { label: 'Founder Direct', hasDropdown: true }
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 sm:p-3 md:p-5 bg-[#f0f0f0] select-none font-helvetica">
      <section className="relative w-full max-w-[1536px] min-h-[96vh] md:min-h-[92vh] rounded-[1.4rem] sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/10 group justify-between">
        
        {/* The Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0 pointer-events-none"
          src={VIDEO_URL}
        />

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-between flex-1 pb-6 sm:pb-8 md:pb-16 overflow-y-auto">
          
          {/* Navbar */}
          <nav className="flex items-center justify-between py-4 sm:py-6 px-4 sm:px-6 md:px-10 w-full relative z-10">
            {/* Left Side spacer / Brand */}
            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              <span className="font-regular tracking-tighter text-xl sm:text-2xl text-[rgba(30,50,90,0.95)]">
                Vexlora
              </span>
              <span className="text-[10px] sm:text-[11px] text-[rgba(30,50,90,0.7)] px-2 sm:px-2.5 py-0.5 rounded-full bg-white/50 backdrop-blur-md border border-white/20">
                Surveys Hub
              </span>
            </div>

            {/* Center Menu (Desktop only) */}
            <ul className="hidden md:flex items-center gap-8 text-[rgb(45,45,45)] font-normal text-sm">
              {menuItems.map(item => (
                <li
                  key={item.label}
                  onClick={onSignIn}
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
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-2.5">
              {onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 text-[rgba(30,50,90,0.9)] text-[11px] sm:text-xs font-normal border border-white/30 backdrop-blur-md transition-all cursor-pointer"
                  title="Watch cinematic eyes intro"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Eyes Intro</span>
                </button>
              )}



              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSignIn}
                className="flex items-center bg-[rgba(30,50,90,0.85)] text-white rounded-full pl-2 pr-3.5 sm:pr-6 py-1.5 md:py-2 gap-1.5 sm:gap-3 hover:bg-[rgba(30,50,90,1)] transition-colors group cursor-pointer shadow-sm"
              >
                <div className="bg-white/20 p-1 md:p-1.5 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm font-normal">
                  {isSigningIn ? 'Connecting...' : 'Sign In'}
                </span>
              </motion.button>
            </div>
          </nav>

          {/* Hero & Login Card Container */}
          <div className="w-full flex flex-col items-center pt-2 sm:pt-4 md:pt-8 px-4 sm:px-6 text-center max-w-4xl my-auto">
            <HeroBadge text="Tell Us Your Problem • Let Us Solve It" />

            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#5E6470] mb-2 tracking-tight leading-[1.08] sm:leading-[1.05]"
            >
              Vexlora Surveys
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs sm:text-base md:text-lg text-[#5E6470] opacity-80 leading-relaxed max-w-xl font-normal px-2"
            >
              Tell us your problem, let us solve it. Save your time and get big outputs with real solutions.
            </motion.p>

            {/* Sleek Glassmorphism Sign-In Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-5 sm:mt-8 p-4 sm:p-7 rounded-[1.4rem] sm:rounded-[2.2rem] bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl shadow-[rgba(30,50,90,0.06)] max-w-sm sm:max-w-md w-full flex flex-col items-center text-center mx-auto"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70 border border-white/50 flex items-center justify-center text-[rgba(30,50,90,0.9)] mb-2.5 sm:mb-3 shadow-xs">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[rgba(30,50,90,0.85)]" />
              </div>

              <h3 className="text-base sm:text-xl font-normal text-[rgba(30,50,90,0.95)] tracking-tight">
                Sign In to Enter Survey
              </h3>
              <p className="text-xs text-[rgba(30,50,90,0.7)] mt-1 mb-4 sm:mb-5 max-w-xs leading-relaxed">
                Connect your Google account to access the survey portal, share problem statements, and track team responses.
              </p>

              {/* Google Sign In Button */}
              <div className="w-full flex justify-center transform active:scale-98 transition-transform">
                <GoogleSignInButton
                  onClick={onSignIn}
                  isLoading={isSigningIn}
                  label="Sign in with Google to Continue"
                  className="w-full justify-center py-2.5 sm:py-3 rounded-full font-normal shadow-sm hover:shadow-md text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[rgba(30,50,90,0.65)] mt-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified Google Single Sign-On • Zero passwords</span>
              </div>
            </motion.div>

            {/* Mobile Responsive Action Cards (Non-overlapping, below the sign-in box) */}
            <div className="flex md:hidden flex-col xs:flex-row items-stretch justify-center gap-2.5 w-full max-w-sm sm:max-w-md mt-4 sm:mt-5 z-20">
              {/* Problem Statements Card */}
              <div className="flex-1 p-3 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/40 flex items-center justify-between shadow-xs">
                <div className="flex flex-col text-left">
                  <span className="text-base font-normal text-[rgba(30,50,90,0.95)] tracking-tight">Tell Your Problem</span>
                  <span className="text-[10px] font-normal text-[rgba(30,50,90,0.6)] uppercase tracking-wider">Let Us Solve It</span>
                </div>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="flex items-center bg-white rounded-full pl-2 pr-3.5 py-1.5 gap-1.5 hover:bg-white/90 text-xs text-[rgba(30,50,90,0.9)] cursor-pointer shadow-xs active:scale-95 transition-transform"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[rgba(30,50,90,0.9)]" />
                  <span className="font-normal">Solve It</span>
                </button>
              </div>

              {/* Big Outputs Card */}
              <div
                onClick={onSignIn}
                className="flex-1 p-3 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/40 flex items-center justify-between cursor-pointer shadow-xs hover:bg-white/60 active:scale-95 transition-all"
              >
                <div className="flex flex-col text-left">
                  <span className="text-sm font-normal text-[rgba(30,50,90,0.95)]">Big Outputs</span>
                  <div className="flex items-center gap-1 text-[rgba(30,50,90,0.6)]">
                    <span className="text-[11px] font-normal">Save Your Time</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[rgba(30,50,90,0.06)] flex items-center justify-center border border-[rgba(30,50,90,0.1)] shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
                </div>
              </div>
            </div>

          </div>

          {/* Desktop Bottom Left Card (Hidden on mobile to prevent overlapping) */}
          <div className="hidden md:block">
            <BottomLeftCard
              countText="Big Outputs"
              label="Save Time • Tell Us Your Problem"
              buttonText="Solve It"
              onButtonClick={onSignIn}
              className="absolute md:bottom-6 md:left-6 lg:bottom-10 lg:left-10 p-3 md:p-4 lg:p-5 rounded-[1.2rem] md:rounded-[1.5rem] lg:rounded-[2.2rem] bg-white/30 backdrop-blur-xl flex flex-col gap-2 lg:gap-3 min-w-[150px] md:min-w-[160px] lg:min-w-[200px] w-fit z-20"
            />
          </div>

          {/* Desktop Bottom Right Corner Cutout (Hidden on mobile to prevent overlapping) */}
          <div className="hidden md:block">
            <BottomRightCorner
              title="Real Solutions"
              subtitle="Tell Problem • Save Time"
              onClick={onSignIn}
              className="absolute bottom-0 right-0 p-3 pt-5 pl-8 sm:p-4 sm:pt-6 sm:pl-10 md:p-6 md:pt-8 md:pl-14 bg-[#f0f0f0] rounded-tl-[1.5rem] sm:rounded-tl-[2rem] md:rounded-tl-[3.5rem] flex items-center gap-3 sm:gap-4 md:gap-6 z-20 cursor-pointer"
            />
          </div>

        </div>

      </section>
    </div>
  );
};
