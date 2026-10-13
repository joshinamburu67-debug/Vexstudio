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
  AlertTriangle,
  Smile,
  Frown,
  Meh
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
        'A clean, ultra-fast web and mobile workspace with offline-first caching, real-time collaboration, and straightforward keyboard navigation without intrusive banner ads.',
      mustHaveFeatures: [
        'Lightning-fast performance & instant load',
        'Minimalist, distraction-free clean design',
        'Reliable offline support & local autosave',
        'No ads, no tracking, strict privacy'
      ],
      killerFeature: 'Instant offline autosave with zero loading lag',
      wantsBetaAccess: true,
      additionalNotes: 'Excited for Vexlora India to launch this! Please reach out as soon as beta invites open.'
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.respondentName.trim()) {
      newErrors.respondentName = 'Please enter your name.';
    }
    if (!formData.biggestFrustration.trim()) {
      newErrors.biggestFrustration = 'Please describe the problem or frustration you are facing.';
    } else if (formData.biggestFrustration.trim().length < 15) {
      newErrors.biggestFrustration = 'Please provide a bit more detail (minimum 15 characters).';
    }
    if (!formData.desiredSolution.trim()) {
      newErrors.desiredSolution = 'Please tell us what kind of app or website would be useful to you.';
    } else if (formData.desiredSolution.trim().length < 15) {
      newErrors.desiredSolution = 'Please provide a bit more detail (minimum 15 characters).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
    onSubmitSurvey(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Top Banner & Header Card (Google Forms Style) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden relative">
        <div className="h-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700" />
        
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2 border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Vexlora India Survey Initiative
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                App &amp; Website Improvement Survey
              </h1>
            </div>

            <button
              type="button"
              onClick={fillSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors shrink-0 self-start sm:self-auto"
              title="Autofill form with realistic testing responses"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Quick Fill Sample Data
            </button>
          </div>

          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            We are designing new digital products and want to build what people actually need. Tell us about the difficulties, bottlenecks, and bugs you encounter in everyday apps or websites, and your ideas for solutions that would truly make your life easier.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                All responses will be submitted directly to{' '}
                <strong className="text-indigo-900 font-semibold">{TARGET_SURVEY_EMAIL}</strong>
              </span>
            </div>

            {user ? (
              <span className="text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Signed in as: {user.email}
              </span>
            ) : (
              <span className="text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-200/50">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Sign in required to submit via Gmail
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Non-authenticated Prompt Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              Sign in with Google to Connect &amp; Submit
            </h3>
            <p className="text-xs text-slate-600 max-w-md">
              Signing in connects your Google account to submit the survey to{' '}
              <strong>{TARGET_SURVEY_EMAIL}</strong> and save your record in Firestore.
            </p>
          </div>
          <GoogleSignInButton onClick={onSignIn} label="Sign in with Google" />
        </div>
      )}

      {/* SECTION 1: ABOUT YOU */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
              1
            </span>
            About You &amp; Your Setup
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Helps us understand your work context and platforms.
          </p>
        </div>

        {/* Q1: Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            What is your Name or Display Name? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.respondentName}
            onChange={e => setFormData({ ...formData, respondentName: e.target.value })}
            placeholder="e.g. Alex Morgan or Priya Patel"
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
              errors.respondentName ? 'border-red-400 bg-red-50/20' : 'border-slate-300 focus:border-indigo-600'
            }`}
          />
          {errors.respondentName && (
            <p className="text-xs text-red-600 mt-1.5">{errors.respondentName}</p>
          )}
        </div>

        {/* Q2: Role */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            What describes you best?
          </label>
          <select
            value={formData.respondentRole}
            onChange={e => setFormData({ ...formData, respondentRole: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
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
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            What device/OS do you use most often for web &amp; apps?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DEVICE_OPTIONS.map(dev => (
              <button
                type="button"
                key={dev}
                onClick={() => setFormData({ ...formData, primaryDevice: dev })}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  formData.primaryDevice === dev
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{dev}</span>
                  {formData.primaryDevice === dev && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: PROBLEMS & PAIN POINTS */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-extrabold flex items-center justify-center">
              2
            </span>
            Problems &amp; Challenges You Are Facing
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tell us about the friction, bugs, or annoyances you endure in daily digital tools.
          </p>
        </div>

        {/* Q4: Common Pain Points */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Which of these problems do you face regularly?{' '}
            <span className="text-xs font-normal text-slate-500">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PAIN_POINT_OPTIONS.map(item => {
              const checked = formData.painPoints.includes(item.label);
              return (
                <label
                  key={item.id}
                  onClick={() => togglePainPoint(item.label)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                    checked
                      ? 'border-red-400 bg-red-50/40 text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}} // handled by parent onClick
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="font-medium">{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Q5: Pain Level Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-800">
              Overall Software Frustration Rating
            </label>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
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
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-500 text-white shadow-sm ring-2 ring-red-200'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                  }`}
                >
                  <span className="font-bold text-base">{rating}</span>
                  <span className="text-[10px] hidden sm:inline opacity-90 text-center">
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

        {/* Q6: Detailed Frustration (Core Question) */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            What is the single biggest problem or bottleneck in apps/websites you use?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Give a specific example of what went wrong, which tool annoyed you, or what takes way too long.
          </p>
          <textarea
            rows={4}
            required
            value={formData.biggestFrustration}
            onChange={e => setFormData({ ...formData, biggestFrustration: e.target.value })}
            placeholder="e.g. When trying to organize customer notes or export reports, the platform is sluggish, reloads unexpectedly, and forces me through 5 nested sub-menus just to find basic data..."
            className={`w-full p-4 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
              errors.biggestFrustration
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-300 focus:border-indigo-600'
            }`}
          />
          {errors.biggestFrustration && (
            <p className="text-xs text-red-600 mt-1.5">{errors.biggestFrustration}</p>
          )}
        </div>
      </div>

      {/* SECTION 3: SUGGESTIONS & WISHES */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
              3
            </span>
            Ideas &amp; What Would Make Software Truly Useful
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Describe what you wish existed or what we should build for you.
          </p>
        </div>

        {/* Q7: Desired Solution */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            What kind of app or website would make your life or work 10x easier?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            How would it work? What problem would it solve immediately?
          </p>
          <textarea
            rows={3}
            required
            value={formData.desiredSolution}
            onChange={e => setFormData({ ...formData, desiredSolution: e.target.value })}
            placeholder="e.g. An ultra-minimalist project manager with zero learning curve, instant hotkeys, reliable offline syncing, and instant export to spreadsheets..."
            className={`w-full p-4 rounded-xl border text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
              errors.desiredSolution
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-300 focus:border-indigo-600'
            }`}
          />
          {errors.desiredSolution && (
            <p className="text-xs text-red-600 mt-1.5">{errors.desiredSolution}</p>
          )}
        </div>

        {/* Q8: Must-Have Features */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Which features are absolute must-haves for you?{' '}
            <span className="text-xs font-normal text-slate-500">(Click to toggle)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {FEATURE_WISHLIST_OPTIONS.map(feat => {
              const active = formData.mustHaveFeatures.includes(feat);
              return (
                <button
                  type="button"
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
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
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            If you could have ONE killer feature, what would it be?
          </label>
          <input
            type="text"
            value={formData.killerFeature}
            onChange={e => setFormData({ ...formData, killerFeature: e.target.value })}
            placeholder="e.g. Natural language voice capture, zero-latency search, offline-first sync"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* SECTION 4: BETA ACCESS & FINAL NOTES */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold flex items-center justify-center">
              4
            </span>
            Connection &amp; Beta Access
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Stay in touch with Vexlora India as we create solutions from this feedback.
          </p>
        </div>

        {/* Q10: Beta Access Toggle */}
        <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div>
            <span className="font-semibold text-slate-900 text-sm block">
              Would you like early beta access when we build this?
            </span>
            <span className="text-xs text-slate-500">
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
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Q11: Additional Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Any other suggestions, questions, or notes for the Vexlora team?
          </label>
          <textarea
            rows={2}
            value={formData.additionalNotes}
            onChange={e => setFormData({ ...formData, additionalNotes: e.target.value })}
            placeholder="Share any additional thoughts, links, or contact preferences..."
            className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* SUBMISSION BAR */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 block">
            Submission Target: <strong className="text-indigo-900 font-semibold">{TARGET_SURVEY_EMAIL}</strong>
          </span>
          <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Direct reply automation enabled
          </span>
        </div>

        {user ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-60"
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
            <span className="text-xs text-slate-500 font-medium">Please sign in to submit:</span>
            <GoogleSignInButton onClick={onSignIn} label="Sign in &amp; Submit" />
          </div>
        )}
      </div>

    </form>
  );
};
