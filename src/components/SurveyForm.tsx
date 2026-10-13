import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  SurveyFormData,
  ROLE_OPTIONS,
  DEVICE_OPTIONS,
  PAIN_POINT_OPTIONS,
  FEATURE_WISHLIST_OPTIONS
} from '../types/survey';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  HelpCircle,
  Smartphone,
  Layout,
  Send,
  Lock,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/gmail';
import { GoogleSignInButton } from './GoogleSignInButton';

interface Props {
  user: User | null;
  onSignIn: () => void;
  onSubmitSurvey: (formData: SurveyFormData) => void;
  isSubmitting: boolean;
}

export const SurveyForm: React.FC<Props> = ({
  user,
  onSignIn,
  onSubmitSurvey,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<SurveyFormData>({
    respondentName: user?.displayName || '',
    respondentRole: 'Software Developer / Engineer',
    primaryDevice: 'Windows PC / Laptop',
    painPoints: ['Slow loading speeds & laggy UI', 'Overly complex, confusing interface'],
    biggestFrustration: '',
    painLevel: 4,
    desiredSolution: '',
    mustHaveFeatures: ['Lightning-fast performance & instant load', 'Minimalist, distraction-free clean design'],
    killerFeature: '',
    wantsBetaAccess: true,
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-fill respondent name if user signs in later
  React.useEffect(() => {
    if (user?.displayName && !formData.respondentName) {
      setFormData(prev => ({ ...prev, respondentName: user.displayName || '' }));
    }
  }, [user]);

  const togglePainPoint = (label: string) => {
    setFormData(prev => {
      const exists = prev.painPoints.includes(label);
      return {
        ...prev,
        painPoints: exists
          ? prev.painPoints.filter(p => p !== label)
          : [...prev.painPoints, label]
      };
    });
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => {
      const exists = prev.mustHaveFeatures.includes(feature);
      return {
        ...prev,
        mustHaveFeatures: exists
          ? prev.mustHaveFeatures.filter(f => f !== feature)
          : [...prev.mustHaveFeatures, feature]
      };
    });
  };

  const fillSampleData = () => {
    setFormData({
      respondentName: user?.displayName || 'Aarav Sharma',
      respondentRole: 'Software Developer / Engineer',
      primaryDevice: 'Windows PC / Laptop',
      painPoints: [
        'Slow loading speeds & laggy UI',
        'Overly complex, confusing interface',
        'Offline unavailable or lost unsaved work',
        'Expensive subscriptions & unexpected paywalls'
      ],
      biggestFrustration:
        'Most productivity tools and developer dashboards are bloated with complex menus and slow cloud sync. When an internet connection fluctuates, half of our work gets lost or stuck on infinite loading wheels.',
      painLevel: 4,
      desiredSolution:
        'An ultra-minimalist, distraction-free dashboard with instant hotkeys, reliable offline local caching, and single-click automated data sharing directly to team emails.',
      mustHaveFeatures: [
        'Lightning-fast performance & instant load',
        'Minimalist, distraction-free clean design',
        'Offline mode with background autosave',
        'Free tier with honest, transparent pricing',
        'Native export options (PDF, CSV, JSON)'
      ],
      killerFeature: 'Instant offline-first sync with zero-latency full-text search',
      wantsBetaAccess: true,
      additionalNotes: 'Excited for the public beta launch! Please notify me at my registered Google account.'
    });
    setErrors({});
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.respondentName.trim()) {
      errs.respondentName = 'Please enter your name or display handle.';
    }
    if (!formData.biggestFrustration.trim()) {
      errs.biggestFrustration = 'Please describe your biggest frustration or problem.';
    }
    if (!formData.desiredSolution.trim()) {
      errs.desiredSolution = 'Please tell us what kind of tool would help you.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
    onSubmitSurvey(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 pb-20 font-helvetica select-none">
      
      {/* Top Banner & Header Card */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[1.8rem] md:rounded-[2.5rem] border border-white/40 shadow-xs overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/30 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-white/70 text-[rgba(30,50,90,0.9)] mb-2 border border-white/40">
              <Sparkles className="w-3.5 h-3.5 text-[rgba(30,50,90,0.85)]" />
              <span>Fluid Feedback Streams</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal text-[rgba(30,50,90,0.95)] tracking-tight">
              App &amp; Website Improvement Survey
            </h1>
          </div>

          <button
            type="button"
            onClick={fillSampleData}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-normal text-[rgba(30,50,90,0.85)] bg-white/70 hover:bg-white border border-white/40 rounded-full transition-all shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
            title="Autofill form with realistic testing responses"
          >
            <Zap className="w-3.5 h-3.5 text-[rgba(30,50,90,0.85)]" />
            <span>Quick Fill Sample Data</span>
          </button>
        </div>

        <p className="text-sm text-[#5E6470] opacity-80 mt-4 leading-relaxed font-normal">
          We are designing new digital products and want to build what people actually need. Tell us about the difficulties, bottlenecks, and bugs you encounter in everyday apps or websites, and your ideas for solutions that would truly make your life easier.
        </p>

        <div className="mt-4 pt-4 border-t border-white/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[rgba(30,50,90,0.7)] font-normal">
            <Mail className="w-4 h-4 text-[rgba(30,50,90,0.8)] shrink-0" />
            <span>
              All responses will be submitted directly to{' '}
              <strong className="text-[rgba(30,50,90,0.95)] font-medium">{TARGET_SURVEY_EMAIL}</strong>
            </span>
          </div>

          {user ? (
            <span className="text-emerald-800 font-normal bg-emerald-500/15 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Signed in as: {user.email}
            </span>
          ) : (
            <span className="text-amber-800 font-normal bg-amber-500/15 px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Sign in required to submit via Gmail
            </span>
          )}
        </div>
      </div>

      {/* Non-authenticated Prompt Banner */}
      {!user && (
        <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-[1.6rem] md:rounded-[2rem] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-normal text-[rgba(30,50,90,0.95)] text-sm sm:text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-[rgba(30,50,90,0.8)]" />
              Sign in with Google to Connect &amp; Submit
            </h3>
            <p className="text-xs text-[rgba(30,50,90,0.7)] max-w-md font-normal">
              Signing in connects your Google account to submit the survey to{' '}
              <strong>{TARGET_SURVEY_EMAIL}</strong> and save your record in Firestore.
            </p>
          </div>
          <GoogleSignInButton onClick={onSignIn} label="Sign in with Google" />
        </div>
      )}

      {/* SECTION 1: ABOUT YOU */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[1.6rem] md:rounded-[2.2rem] p-6 sm:p-7 shadow-xs border border-white/40 space-y-6">
        <div className="border-b border-white/30 pb-3">
          <h2 className="text-lg font-normal text-[rgba(30,50,90,0.95)] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.15)] text-[rgba(30,50,90,0.9)] text-xs font-normal flex items-center justify-center">
              1
            </span>
            About You &amp; Your Setup
          </h2>
          <p className="text-xs text-[rgba(30,50,90,0.6)] mt-1 font-normal">
            Helps us understand your work context and platforms.
          </p>
        </div>

        {/* Q1: Name */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-1.5">
            What is your Name or Display Name? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.respondentName}
            onChange={e => setFormData({ ...formData, respondentName: e.target.value })}
            placeholder="e.g. Alex Morgan or Priya Patel"
            className={`w-full px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border text-sm text-[rgba(30,50,90,0.95)] placeholder:text-slate-400 transition-all focus:outline-hidden focus:border-[rgba(30,50,90,0.8)] focus:ring-2 focus:ring-[rgba(30,50,90,0.1)] ${
              errors.respondentName ? 'border-red-400 bg-red-50/20' : 'border-white/60'
            }`}
          />
          {errors.respondentName && (
            <p className="text-xs text-red-600 mt-1.5">{errors.respondentName}</p>
          )}
        </div>

        {/* Q2: Role */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-1.5">
            What describes you best?
          </label>
          <select
            value={formData.respondentRole}
            onChange={e => setFormData({ ...formData, respondentRole: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-white/60 text-sm text-[rgba(30,50,90,0.95)] focus:border-[rgba(30,50,90,0.8)] focus:outline-hidden focus:ring-2 focus:ring-[rgba(30,50,90,0.1)] bg-white/80 backdrop-blur-md"
          >
            {ROLE_OPTIONS.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Q3: Primary Device */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-2">
            What device/OS do you use most often for web &amp; apps?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DEVICE_OPTIONS.map(dev => {
              const active = formData.primaryDevice === dev;
              return (
                <button
                  type="button"
                  key={dev}
                  onClick={() => setFormData({ ...formData, primaryDevice: dev })}
                  className={`p-3 rounded-2xl border text-left text-xs font-normal transition-all cursor-pointer ${
                    active
                      ? 'border-[rgba(30,50,90,0.8)] bg-[rgba(30,50,90,0.85)] text-white shadow-xs'
                      : 'border-white/50 bg-white/70 hover:bg-white text-[rgba(30,50,90,0.8)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{dev}</span>
                    {active && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: PROBLEMS & PAIN POINTS */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[1.6rem] md:rounded-[2.2rem] p-6 sm:p-7 shadow-xs border border-white/40 space-y-6">
        <div className="border-b border-white/30 pb-3">
          <h2 className="text-lg font-normal text-[rgba(30,50,90,0.95)] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.15)] text-[rgba(30,50,90,0.9)] text-xs font-normal flex items-center justify-center">
              2
            </span>
            Problems &amp; Challenges You Are Facing
          </h2>
          <p className="text-xs text-[rgba(30,50,90,0.6)] mt-1 font-normal">
            Tell us about the friction, bugs, or annoyances you endure in daily digital tools.
          </p>
        </div>

        {/* Q4: Common Pain Points */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-2">
            Which of these problems do you face regularly?{' '}
            <span className="text-xs text-[rgba(30,50,90,0.6)]">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PAIN_POINT_OPTIONS.map(item => {
              const checked = formData.painPoints.includes(item.label);
              return (
                <label
                  key={item.id}
                  onClick={() => togglePainPoint(item.label)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all select-none ${
                    checked
                      ? 'border-[rgba(30,50,90,0.8)] bg-[rgba(30,50,90,0.85)] text-white shadow-xs'
                      : 'border-white/50 bg-white/70 hover:bg-white text-[rgba(30,50,90,0.8)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-[rgba(30,50,90,0.9)] focus:ring-[rgba(30,50,90,0.4)] cursor-pointer"
                  />
                  <span className="font-normal">{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Q5: Pain Level Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)]">
              Overall Software Frustration Rating
            </label>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-white/80 border border-white/50 text-[rgba(30,50,90,0.9)]">
              Level {formData.painLevel} / 5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(rating => {
              const isSelected = formData.painLevel === rating;
              return (
                <button
                  type="button"
                  key={rating}
                  onClick={() => setFormData({ ...formData, painLevel: rating })}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[rgba(30,50,90,0.8)] bg-[rgba(30,50,90,0.85)] text-white shadow-xs'
                      : 'border-white/50 bg-white/70 hover:bg-white text-[rgba(30,50,90,0.8)]'
                  }`}
                >
                  <span className="font-normal text-base">{rating}</span>
                  <span className="text-[10px] hidden sm:inline opacity-90 text-center font-normal">
                    {rating === 1 && 'Mild'}
                    {rating === 2 && 'Slight'}
                    {rating === 3 && 'Noticeable'}
                    {rating === 4 && 'High'}
                    {rating === 5 && 'Severe'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Q6: Detailed Frustration */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-1.5">
            What is the single biggest problem or bottleneck in apps/websites you use?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-[rgba(30,50,90,0.6)] mb-2 font-normal">
            Give a specific example of what went wrong, which tool annoyed you, or what takes way too long.
          </p>
          <textarea
            rows={4}
            required
            value={formData.biggestFrustration}
            onChange={e => setFormData({ ...formData, biggestFrustration: e.target.value })}
            placeholder="e.g. When trying to organize customer notes or export reports, the platform is sluggish, reloads unexpectedly, and forces me through 5 nested sub-menus..."
            className={`w-full p-4 rounded-2xl bg-white/80 backdrop-blur-md border text-sm text-[rgba(30,50,90,0.95)] placeholder:text-slate-400 transition-all focus:outline-hidden focus:border-[rgba(30,50,90,0.8)] focus:ring-2 focus:ring-[rgba(30,50,90,0.1)] ${
              errors.biggestFrustration ? 'border-red-400 bg-red-50/20' : 'border-white/60'
            }`}
          />
          {errors.biggestFrustration && (
            <p className="text-xs text-red-600 mt-1.5">{errors.biggestFrustration}</p>
          )}
        </div>
      </div>

      {/* SECTION 3: SUGGESTIONS & WISHES */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[1.6rem] md:rounded-[2.2rem] p-6 sm:p-7 shadow-xs border border-white/40 space-y-6">
        <div className="border-b border-white/30 pb-3">
          <h2 className="text-lg font-normal text-[rgba(30,50,90,0.95)] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.15)] text-[rgba(30,50,90,0.9)] text-xs font-normal flex items-center justify-center">
              3
            </span>
            Ideas &amp; What Would Make Software Truly Useful
          </h2>
          <p className="text-xs text-[rgba(30,50,90,0.6)] mt-1 font-normal">
            Describe what you wish existed or what we should build for you.
          </p>
        </div>

        {/* Q7: Desired Solution */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-1.5">
            What kind of app or website would make your life or work 10x easier?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-[rgba(30,50,90,0.6)] mb-2 font-normal">
            How would it work? What problem would it solve immediately?
          </p>
          <textarea
            rows={3}
            required
            value={formData.desiredSolution}
            onChange={e => setFormData({ ...formData, desiredSolution: e.target.value })}
            placeholder="e.g. An ultra-minimalist project manager with zero learning curve, instant hotkeys, reliable offline syncing, and instant export..."
            className={`w-full p-4 rounded-2xl bg-white/80 backdrop-blur-md border text-sm text-[rgba(30,50,90,0.95)] placeholder:text-slate-400 transition-all focus:outline-hidden focus:border-[rgba(30,50,90,0.8)] focus:ring-2 focus:ring-[rgba(30,50,90,0.1)] ${
              errors.desiredSolution ? 'border-red-400 bg-red-50/20' : 'border-white/60'
            }`}
          />
          {errors.desiredSolution && (
            <p className="text-xs text-red-600 mt-1.5">{errors.desiredSolution}</p>
          )}
        </div>

        {/* Q8: Must-Have Features */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-2">
            Which features are absolute must-haves for you?{' '}
            <span className="text-xs text-[rgba(30,50,90,0.6)]">(Click to toggle)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {FEATURE_WISHLIST_OPTIONS.map(feat => {
              const active = formData.mustHaveFeatures.includes(feat);
              return (
                <button
                  type="button"
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer ${
                    active
                      ? 'bg-[rgba(30,50,90,0.85)] text-white shadow-xs border border-[rgba(30,50,90,0.9)]'
                      : 'bg-white/70 hover:bg-white text-[rgba(30,50,90,0.8)] border border-white/50'
                  }`}
                >
                  {active ? '✔ ' : '+ '}
                  {feat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Q9: One Killer Feature */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-1.5">
            If you could have ONE killer feature, what would it be?
          </label>
          <input
            type="text"
            value={formData.killerFeature}
            onChange={e => setFormData({ ...formData, killerFeature: e.target.value })}
            placeholder="e.g. Natural language voice capture, zero-latency search, offline-first sync"
            className="w-full px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 text-sm text-[rgba(30,50,90,0.95)] placeholder:text-slate-400 focus:border-[rgba(30,50,90,0.8)] focus:outline-hidden focus:ring-2 focus:ring-[rgba(30,50,90,0.1)]"
          />
        </div>
      </div>

      {/* SECTION 4: BETA ACCESS & FINAL NOTES */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[1.6rem] md:rounded-[2.2rem] p-6 sm:p-7 shadow-xs border border-white/40 space-y-6">
        <div className="border-b border-white/30 pb-3">
          <h2 className="text-lg font-normal text-[rgba(30,50,90,0.95)] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[rgba(30,50,90,0.08)] border border-[rgba(30,50,90,0.15)] text-[rgba(30,50,90,0.9)] text-xs font-normal flex items-center justify-center">
              4
            </span>
            Connection &amp; Beta Access
          </h2>
          <p className="text-xs text-[rgba(30,50,90,0.6)] mt-1 font-normal">
            Stay in touch with Vexlora India as we create solutions from this feedback.
          </p>
        </div>

        {/* Q10: Beta Access Toggle */}
        <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 border border-white/40">
          <div>
            <span className="font-normal text-[rgba(30,50,90,0.95)] text-sm block">
              Would you like early beta access when we build this?
            </span>
            <span className="text-xs text-[rgba(30,50,90,0.6)] font-normal">
              We will invite you for free early testing using your signed-in email ({user?.email || 'Google account'}).
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={formData.wantsBetaAccess}
              onChange={e => setFormData({ ...formData, wantsBetaAccess: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgba(30,50,90,0.85)]"></div>
          </label>
        </div>

        {/* Q11: Additional Notes */}
        <div>
          <label className="block text-sm font-normal text-[rgba(30,50,90,0.9)] mb-1.5">
            Any other suggestions, questions, or notes for the Vexlora team?
          </label>
          <textarea
            rows={2}
            value={formData.additionalNotes}
            onChange={e => setFormData({ ...formData, additionalNotes: e.target.value })}
            placeholder="Share any additional thoughts, links, or contact preferences..."
            className="w-full p-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 text-sm text-[rgba(30,50,90,0.95)] placeholder:text-slate-400 focus:border-[rgba(30,50,90,0.8)] focus:outline-hidden focus:ring-2 focus:ring-[rgba(30,50,90,0.1)]"
          />
        </div>
      </div>

      {/* SUBMISSION BAR */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[1.6rem] md:rounded-[2.2rem] p-6 shadow-xs border border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[rgba(30,50,90,0.65)] block font-normal">
            Submission Target: <strong className="text-[rgba(30,50,90,0.95)] font-medium">{TARGET_SURVEY_EMAIL}</strong>
          </span>
          <span className="text-xs text-emerald-800 flex items-center gap-1 font-normal mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Direct reply automation enabled
          </span>
        </div>

        {user ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[rgba(30,50,90,0.85)] hover:bg-[rgba(30,50,90,1)] active:scale-98 text-white font-normal text-sm rounded-full shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting &amp; Emailing Team...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit &amp; Email to Team Directly</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <span className="text-xs text-[rgba(30,50,90,0.7)] font-normal">Please sign in to submit:</span>
            <GoogleSignInButton onClick={onSignIn} label="Sign in &amp; Submit" />
          </div>
        )}
      </div>

    </form>
  );
};
