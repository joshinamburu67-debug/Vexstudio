import React from 'react';
import {
  ClipboardList,
  Sparkles,
  ShieldCheck,
  Mail,
  ArrowRight,
  Lock,
  CheckCircle2,
  Users,
  Zap,
  Star,
  MessageSquareHeart
} from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { TARGET_SURVEY_EMAIL } from '../services/emailAutomation';

interface Props {
  onSignIn: () => void;
  isSigningIn?: boolean;
}

export const LoginPage: React.FC<Props> = ({ onSignIn, isSigningIn = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] bg-violet-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation / Brand */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Vexlora
            </span>
            <span className="text-xs text-indigo-400 font-semibold ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Studio Hub
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official Feedback &amp; Survey Gateway</span>
        </div>
      </header>

      {/* Main Hero & Login Card Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 py-8 sm:py-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 my-auto">
        
        {/* Left Column: Value Proposition & Hero Text */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Community Survey &amp; Early Beta Program</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Shape the Future of <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              Modern Web Tools.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            Welcome to the Vexlora Survey Portal. Share your daily software friction points, vote on essential features, and receive early access to upcoming beta releases directly from our team.
          </p>

          {/* Key Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-left">
            
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Direct Founder Attention</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Every response routes directly to engineering team inboxes.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Early Beta Tester Access</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Priority invitations to pre-release testing channels.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
              <div className="p-2 rounded-lg bg-violet-500/20 text-violet-300 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Automated Direct Replies</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Instant confirmation emails from vexloraindia@gmail.com.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
              <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Zero Password Friction</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Instant, secure single sign-on with your Google account.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: High-Impact Sign-In Card */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-white/10 border border-white/15 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-950/50 text-center relative overflow-hidden group">
            
            {/* Top Card Subtle Light Beam */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-600/40 ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-300">
              <MessageSquareHeart className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              Sign In to Enter Survey
            </h3>

            <p className="text-xs text-slate-300 mt-2.5 mb-8 leading-relaxed">
              Please sign in with your Google account to access the survey form, share your suggestions, and track your submission.
            </p>

            {/* Google Sign In Button Wrapper */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full transform active:scale-98 transition-transform">
                <GoogleSignInButton
                  onClick={onSignIn}
                  isLoading={isSigningIn}
                  label="Sign in with Google to Continue"
                  className="w-full justify-center py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/20 text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Google Single Sign-On • Zero passwords needed</span>
              </div>
            </div>

            {/* Trust and Privacy Note */}
            <div className="mt-8 pt-6 border-t border-white/10 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center justify-center gap-4 text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Free Access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-indigo-400" /> 2-Minute Survey
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Direct Follow-up
                </span>
              </div>
              <p className="text-slate-400 text-[10.5px]">
                We respect your privacy. Your email is only used to respond to your product feedback and send beta testing invites.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          © {new Date().getFullYear()} Vexlora Studio. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${TARGET_SURVEY_EMAIL}`}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Support: {TARGET_SURVEY_EMAIL}</span>
          </a>
        </div>
      </footer>

    </div>
  );
};
