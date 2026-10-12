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
import { EmailConfirmModal } from './components/EmailConfirmModal';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { SurveyFormData, SurveyResponse } from './types/survey';
import {
  saveSurveyResponse,
  subscribeToSurveyResponses,
  updateSurveyEmailStatus
} from './services/survey';
import {
  sendSurveyEmailViaGmail,
  TARGET_SURVEY_EMAIL
} from './services/gmail';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const ADMIN_EMAILS = ['joshi.namburu4339@gmail.com', 'vexloraindia@gmail.com'];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'survey' | 'analytics' | 'about'>('survey');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  
  // Modals & submission state
  const [pendingSurvey, setPendingSurvey] = useState<SurveyResponse | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
  const handleStartSubmit = (formData: SurveyFormData) => {
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

    setPendingSurvey(newSurvey);
    setIsConfirmModalOpen(true);
  };

  // User confirmed sending via Gmail in the confirmation modal
  const handleConfirmSendGmail = async () => {
    if (!pendingSurvey || !user) return;

    setIsSendingEmail(true);
    let finalStatus: 'sent' | 'failed' | 'pending' = 'pending';
    let emailErrMsg: string | undefined = undefined;

    try {
      // 1. First save to Firestore
      await saveSurveyResponse(pendingSurvey);

      // 2. Fetch or reuse OAuth Access Token for Gmail API
      let token = accessToken;
      if (!token) {
        token = await getAccessToken();
      }

      // If token still not cached in memory, prompt sign in to refresh token
      if (!token) {
        const signinRes = await googleSignIn();
        token = signinRes?.accessToken || null;
      }

      if (token && user.email) {
        const emailResult = await sendSurveyEmailViaGmail(
          token,
          pendingSurvey,
          user.email,
          TARGET_SURVEY_EMAIL
        );

        if (emailResult.success) {
          finalStatus = 'sent';
          await updateSurveyEmailStatus(pendingSurvey.id, 'sent');
        } else {
          finalStatus = 'failed';
          emailErrMsg = emailResult.error || 'Failed to dispatch email';
          await updateSurveyEmailStatus(pendingSurvey.id, 'failed');
        }
      } else {
        finalStatus = 'pending';
        emailErrMsg = 'Could not acquire Gmail token. Saved to database.';
      }
    } catch (err: any) {
      console.error('Error during survey submission:', err);
      finalStatus = 'failed';
      emailErrMsg = err.message || 'Error occurred';
    } finally {
      setIsSendingEmail(false);
      setIsConfirmModalOpen(false);

      setLastSubmissionName(pendingSurvey.respondentName);
      setLastEmailStatus(finalStatus);
      setLastEmailError(emailErrMsg);
      setIsSuccessModalOpen(true);
      setPendingSurvey(null);
    }
  };

  // User chose to save to database only without sending email
  const handleSaveFirestoreOnly = async () => {
    if (!pendingSurvey) return;
    try {
      await saveSurveyResponse({
        ...pendingSurvey,
        emailStatus: 'draft'
      });
      setIsConfirmModalOpen(false);
      setLastSubmissionName(pendingSurvey.respondentName);
      setLastEmailStatus('draft');
      setLastEmailError(undefined);
      setIsSuccessModalOpen(true);
      setPendingSurvey(null);
    } catch (err: any) {
      console.error('Firestore save error:', err);
      setToastMessage({
        type: 'error',
        text: 'Failed to save to Firestore: ' + (err.message || 'Unknown error')
      });
    }
  };

  // Resend email action from responses dashboard
  const handleResendEmail = async (survey: SurveyResponse) => {
    if (!user?.email) {
      handleSignIn();
      return;
    }

    try {
      let token = accessToken || (await getAccessToken());
      if (!token) {
        const signinRes = await googleSignIn();
        token = signinRes?.accessToken || null;
      }

      if (!token) {
        setToastMessage({
          type: 'error',
          text: 'Google authentication required to send email.'
        });
        return;
      }

      setToastMessage({
        type: 'success',
        text: `Sending email to ${TARGET_SURVEY_EMAIL}...`
      });

      const res = await sendSurveyEmailViaGmail(token, survey, user.email, TARGET_SURVEY_EMAIL);
      if (res.success) {
        await updateSurveyEmailStatus(survey.id, 'sent');
        setToastMessage({
          type: 'success',
          text: `Successfully emailed survey to ${TARGET_SURVEY_EMAIL}!`
        });
      } else {
        setToastMessage({
          type: 'error',
          text: `Gmail send failed: ${res.error}`
        });
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: err.message || 'Resend failed'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'survey' && (
          <SurveyForm
            user={user}
            onSignIn={handleSignIn}
            onSubmitSurvey={handleStartSubmit}
            isSubmitting={isConfirmModalOpen}
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

      {/* Email Confirmation Modal (Google Workspace destructive operation dialog) */}
      <EmailConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirmSendGmail={handleConfirmSendGmail}
        onSaveFirestoreOnly={handleSaveFirestoreOnly}
        isSending={isSendingEmail}
        surveyData={pendingSurvey}
        senderEmail={user?.email || ''}
      />

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
  );
}
