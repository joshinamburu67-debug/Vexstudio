import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  testConnection
} from './lib/firebase';
import { Header } from './components/Header';
import { SurveyForm } from './components/SurveyForm';
import { ResponsesDashboard } from './components/ResponsesDashboard';
import { AboutSection } from './components/AboutModal';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { LoginPage } from './components/LoginPage';
import { EyesIntro } from './components/EyesIntro';
import { SurveyFormData, SurveyResponse } from './types/survey';
import {
  saveSurveyResponse,
  subscribeToSurveyResponses,
  updateSurveyEmailStatus
} from './services/survey';
import {
  sendAutomatedSurveyEmail,
  TARGET_SURVEY_EMAIL
} from './services/emailAutomation';
import { CheckCircle2, AlertTriangle, X, ClipboardList } from 'lucide-react';

const ADMIN_EMAILS = [
  'joshi.namburu4339@gmail.com',
  'vexloraindia@gmail.com',
  'khushatel3010pvc@gmail.com'
];

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'survey' | 'analytics' | 'about'>('survey');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  
  // Submission state
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastSubmissionName, setLastSubmissionName] = useState('');
  const [lastEmailStatus, setLastEmailStatus] = useState<'sent' | 'pending' | 'failed' | 'draft'>('draft');
  const [lastEmailError, setLastEmailError] = useState<string | undefined>(undefined);

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

  // Test Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        if (token) setAccessToken(token);
        setIsAuthLoading(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setIsAuthLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Subscribe to responses when user is logged in
  useEffect(() => {
    if (!user) {
      setResponses([]);
      return;
    }

    const unsubscribe = subscribeToSurveyResponses(
      user.uid,
      isAdmin,
      (data) => {
        setResponses(data);
      },
      (err) => {
        console.error('Failed to subscribe to responses:', err);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, isAdmin]);

  // Sign In action
  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setToastMessage({
          type: 'success',
          text: `Welcome back, ${result.user.displayName || result.user.email}!`
        });
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      let errorText = error.message || 'Google Sign-in failed. Please try again.';
      if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('unauthorized-domain')) {
        errorText = `Unauthorized Domain: Please access via http://localhost:3000 or add this domain (${window.location.hostname}) to Firebase Console > Authentication > Settings > Authorized domains.`;
      }
      setToastMessage({
        type: 'error',
        text: errorText
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  // Sign Out action
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setToastMessage({
        type: 'success',
        text: 'Signed out successfully.'
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Triggered when user completes the Survey Form
  const handleStartSubmit = async (formData: SurveyFormData) => {
    if (!user) {
      handleSignIn();
      return;
    }

    const surveyId = `survey_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newSurvey: SurveyResponse = {
      id: surveyId,
      userId: user.uid,
      userEmail: user.email || 'unknown@example.com',
      respondentName: formData.respondentName.trim(),
      respondentRole: formData.respondentRole,
      primaryDevice: formData.primaryDevice,
      painPoints: formData.painPoints,
      biggestFrustration: formData.biggestFrustration.trim(),
      painLevel: formData.painLevel,
      desiredSolution: formData.desiredSolution.trim(),
      mustHaveFeatures: formData.mustHaveFeatures,
      killerFeature: formData.killerFeature.trim(),
      wantsBetaAccess: formData.wantsBetaAccess,
      additionalNotes: formData.additionalNotes.trim(),
      emailSentTo: TARGET_SURVEY_EMAIL,
      emailStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIsSendingEmail(true);
    try {
      // 1. Save response to Firestore
      await saveSurveyResponse(newSurvey);
      setLastSubmissionName(newSurvey.respondentName);

      // 2. Automated email dispatch directly to target email
      const emailResult = await sendAutomatedSurveyEmail(newSurvey);

      if (emailResult.success) {
        if (emailResult.isFirstTimeActivationNotice) {
          await updateSurveyEmailStatus(newSurvey.id, 'pending');
          setLastEmailStatus('pending');
          setLastEmailError('First-time activation notice sent to ' + TARGET_SURVEY_EMAIL + '. Please click the one-time link in your inbox.');
          setToastMessage({
            type: 'success',
            text: `Saved to database! Check ${TARGET_SURVEY_EMAIL} for one-time form activation.`
          });
        } else {
          await updateSurveyEmailStatus(newSurvey.id, 'sent');
          setLastEmailStatus('sent');
          setLastEmailError(undefined);
          setToastMessage({
            type: 'success',
            text: `Feedback submitted and automated email sent directly to ${TARGET_SURVEY_EMAIL}!`
          });
        }
      } else {
        await updateSurveyEmailStatus(newSurvey.id, 'failed');
        setLastEmailStatus('failed');
        setLastEmailError(emailResult.error);
        setToastMessage({
          type: 'error',
          text: `Saved to database, but automated email failed: ${emailResult.error || 'Check network connection'}`
        });
      }

      setIsSuccessModalOpen(true);
    } catch (err: any) {
      console.error('Firestore save or automation error:', err);
      setToastMessage({
        type: 'error',
        text: 'Failed to submit response: ' + (err.message || 'Unknown error')
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Resend email action from responses dashboard
  const handleResendEmail = async (survey: SurveyResponse) => {
    try {
      setToastMessage({
        type: 'success',
        text: `Sending automated email to ${TARGET_SURVEY_EMAIL}...`
      });

      const res = await sendAutomatedSurveyEmail(survey);
      if (res.success) {
        await updateSurveyEmailStatus(survey.id, 'sent');
        setToastMessage({
          type: 'success',
          text: `Successfully emailed survey to ${TARGET_SURVEY_EMAIL}!`
        });
      } else {
        await updateSurveyEmailStatus(survey.id, 'failed');
        setToastMessage({
          type: 'error',
          text: `Automated email failed: ${res.error || 'Could not dispatch'}`
        });
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: err.message || 'Resend failed'
      });
    }
  };

  // 1. Initial Auth Loading Splash (only if intro has finished and auth is still pending)
  if (isAuthLoading && !showIntro) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 animate-pulse">
          <ClipboardList className="w-8 h-8" />
        </div>
        <div className="mt-5 flex items-center gap-2.5 text-slate-300 text-xs font-semibold">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span>Entering Vexlora Studio...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated User: Show dedicated LoginPage first before entering survey
  if (!user) {
    return (
      <>
        {showIntro && <EyesIntro onComplete={() => setShowIntro(false)} />}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-800 text-emerald-50 border border-emerald-700'
                  : 'bg-red-800 text-red-50 border border-red-700'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-300" />
              )}
              <span>{toastMessage.text}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="ml-2 hover:opacity-80 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        <LoginPage
          onSignIn={handleSignIn}
          isSigningIn={isSigningIn}
          onReplayIntro={() => setShowIntro(true)}
        />
      </>
    );
  }

  return (
    <>
      {showIntro && <EyesIntro onComplete={() => setShowIntro(false)} />}
      <div className="min-h-screen bg-[#f0f0f0] font-helvetica text-slate-800 antialiased selection:bg-[rgba(30,50,90,0.85)] selection:text-white">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-800 text-emerald-50 border border-emerald-700'
                  : 'bg-red-800 text-red-50 border border-red-700'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-300" />
              )}
              <span>{toastMessage.text}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="ml-2 hover:opacity-80 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Header */}
        <Header
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          responsesCount={responses.length}
          isAdmin={isAdmin}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-3 sm:px-6 pt-5 sm:pt-8">
          {activeTab === 'survey' && (
            <SurveyForm
              user={user}
              onSignIn={handleSignIn}
              onSubmitSurvey={handleStartSubmit}
              isSubmitting={isSendingEmail}
            />
          )}

          {activeTab === 'analytics' && (
            <ResponsesDashboard
              responses={responses}
              isAdmin={isAdmin}
              currentUserEmail={user?.email || undefined}
              onResendEmail={handleResendEmail}
            />
          )}

          {activeTab === 'about' && (
            <AboutSection onStartSurvey={() => setActiveTab('survey')} />
          )}
        </main>

        {/* Submission Success Modal with Confetti */}
        <SubmissionSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          onViewDashboard={() => setActiveTab('analytics')}
          onResetForm={() => setActiveTab('survey')}
          emailStatus={lastEmailStatus}
          emailError={lastEmailError}
          respondentName={lastSubmissionName}
        />

      </div>
    </>
  );
}
