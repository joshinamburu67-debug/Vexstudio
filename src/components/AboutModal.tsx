import React from 'react';
import { Mail, CheckCircle2, Shield, Heart, ExternalLink, Sparkles, Send } from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/gmail';

interface Props {
  onStartSurvey: () => void;
}

export const AboutSection: React.FC<Props> = ({ onStartSurvey }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Vexlora India Initiative
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Building software that actually solves your daily friction.
          </h1>

          <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed">
            Too many modern apps and websites are cluttered, bloated, and slow. We launched this survey to listen directly to creators, engineers, businesses, and everyday web users so we can build digital tools that feel instantaneous, clean, and genuinely useful.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartSurvey}
              className="px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 active:scale-98 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
            >
              Take the Survey Now →
            </button>
            <a
              href={`mailto:${TARGET_SURVEY_EMAIL}`}
              className="px-4 py-3 bg-indigo-800/60 hover:bg-indigo-800 text-indigo-100 font-semibold text-xs sm:text-sm rounded-xl border border-indigo-700/50 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              Contact: {TARGET_SURVEY_EMAIL}
            </a>
          </div>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-slate-900 text-base">Uncover Hidden Friction</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We analyze the recurring pain points that waste time — clunky workflows, poor mobile responsiveness, broken offline support, and hidden paywalls.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-slate-900 text-base">Crowdsourced Solutions</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your feature wishlists directly steer our engineering roadmap. If multiple people demand instant sync or lightweight offline mode, we build it first.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-slate-900 text-base">Direct Inbox Delivery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every submission is forwarded straight to <span className="font-semibold text-slate-800">{TARGET_SURVEY_EMAIL}</span> using verified Google Workspace Gmail dispatch and persisted in Firestore.
          </p>
        </div>

      </div>

      {/* Integration & Privacy Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-4 text-xs text-slate-600">
        <Shield className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-900 text-sm">Transparency &amp; Data Security</h4>
          <p className="leading-relaxed">
            This survey application uses official Google Sign-in to authenticate respondents. Responses are saved in a protected Firestore database where only authorized administrators and the response author can access raw inputs. We do not sell data or share responses with third parties.
          </p>
        </div>
      </div>

    </div>
  );
};
