import React from 'react';
import { Mail, CheckCircle2, Shield, Heart, Sparkles } from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/gmail';

interface Props {
  onStartSurvey: () => void;
}

export const AboutSection: React.FC<Props> = ({ onStartSurvey }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 font-helvetica select-none">
      
      {/* Hero Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[1.8rem] md:rounded-[2.5rem] p-8 sm:p-12 text-[rgba(30,50,90,0.95)] shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-white/80 text-[rgba(30,50,90,0.9)] border border-white/50">
            <Sparkles className="w-3.5 h-3.5 text-[rgba(30,50,90,0.85)]" />
            Vexlora India Initiative
          </span>

          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight leading-tight text-[rgba(30,50,90,0.95)]">
            Building software that actually solves your daily friction.
          </h1>

          <p className="text-sm sm:text-base text-[#5E6470] opacity-80 leading-relaxed font-normal">
            Too many modern apps and websites are cluttered, bloated, and slow. We launched this survey to listen directly to creators, engineers, businesses, and everyday web users so we can build digital tools that feel instantaneous, clean, and genuinely useful.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartSurvey}
              className="px-6 py-3 bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] active:scale-98 text-white font-normal text-xs sm:text-sm rounded-full shadow-sm transition-all cursor-pointer"
            >
              Take the Survey Now →
            </button>
            <a
              href={`mailto:${TARGET_SURVEY_EMAIL}`}
              className="px-5 py-3 bg-white/80 hover:bg-white text-[rgba(30,50,90,0.9)] font-normal text-xs sm:text-sm rounded-full border border-white/50 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Mail className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
              <span>Contact: {TARGET_SURVEY_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[1.6rem] border border-white/40 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.12)] text-[rgba(30,50,90,0.9)] flex items-center justify-center font-normal text-sm">
            01
          </div>
          <h3 className="font-normal text-[rgba(30,50,90,0.95)] text-base">Uncover Hidden Friction</h3>
          <p className="text-xs text-[#5E6470] leading-relaxed font-normal">
            We analyze the recurring pain points that waste time — clunky workflows, poor mobile responsiveness, broken offline support, and hidden paywalls.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[1.6rem] border border-white/40 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.12)] text-[rgba(30,50,90,0.9)] flex items-center justify-center font-normal text-sm">
            02
          </div>
          <h3 className="font-normal text-[rgba(30,50,90,0.95)] text-base">Community Co-Creation</h3>
          <p className="text-xs text-[#5E6470] leading-relaxed font-normal">
            Features are prioritized based on direct community votes, survey demand, and real problem feedback rather than guesswork.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[1.6rem] border border-white/40 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.12)] text-[rgba(30,50,90,0.9)] flex items-center justify-center font-normal text-sm">
            03
          </div>
          <h3 className="font-normal text-[rgba(30,50,90,0.95)] text-base">Zero-Spam Commitment</h3>
          <p className="text-xs text-[#5E6470] leading-relaxed font-normal">
            Your data is stored securely in Firebase and responses route to vexloraindia@gmail.com. We never sell your personal information.
          </p>
        </div>

      </div>

    </div>
  );
};
