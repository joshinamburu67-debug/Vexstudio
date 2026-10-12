import React from 'react';
import { SurveyResponse } from '../types/survey';
import { Mail, Send, AlertCircle, X, Shield, Check, Eye } from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/gmail';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSendGmail: () => void;
  onSaveFirestoreOnly: () => void;
  isSending: boolean;
  surveyData: SurveyResponse | null;
  senderEmail: string;
}

export const EmailConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmSendGmail,
  onSaveFirestoreOnly,
  isSending,
  surveyData,
  senderEmail
}) => {
  const [showPreview, setShowPreview] = React.useState(false);

  if (!isOpen || !surveyData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Confirm Survey Submission</h3>
              <p className="text-xs text-indigo-100">Send email notification to {TARGET_SURVEY_EMAIL}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 text-sm text-indigo-950">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Google Workspace Gmail Authorization</p>
              <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                As required by Google Workspace integration security, please confirm that you want to send this survey response from your connected Gmail address to{' '}
                <strong className="underline">{TARGET_SURVEY_EMAIL}</strong>.
              </p>
            </div>
          </div>

          {/* Email Envelope Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">From:</span>
              <span className="font-semibold text-slate-800">{senderEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">To:</span>
              <span className="font-semibold text-indigo-600">{TARGET_SURVEY_EMAIL}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Subject:</span>
              <span className="font-medium text-slate-800 text-right truncate max-w-[320px]">
                [Vexlora Survey] Feedback from {surveyData.respondentName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Storage:</span>
              <span className="font-medium text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Firestore Database Persistence
              </span>
            </div>
          </div>

          {/* Quick Summary Accordion */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="w-full px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 flex items-center justify-between text-xs font-medium text-slate-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                {showPreview ? 'Hide response payload summary' : 'View response payload summary'}
              </span>
              <span className="text-indigo-600">{showPreview ? '▲' : '▼'}</span>
            </button>

            {showPreview && (
              <div className="p-4 bg-white text-xs space-y-3 max-h-56 overflow-y-auto divide-y divide-slate-100">
                <div>
                  <span className="font-semibold text-slate-800 block">Respondent:</span>
                  <p className="text-slate-600">{surveyData.respondentName} ({surveyData.respondentRole})</p>
                </div>
                <div className="pt-2">
                  <span className="font-semibold text-slate-800 block">Pain Rating &amp; Problems:</span>
                  <p className="text-slate-600">Rating: {surveyData.painLevel}/5 | Selected: {surveyData.painPoints.join(', ') || 'None'}</p>
                  <p className="text-slate-700 italic mt-1 bg-slate-50 p-2 rounded border border-slate-100">&ldquo;{surveyData.biggestFrustration}&rdquo;</p>
                </div>
                <div className="pt-2">
                  <span className="font-semibold text-slate-800 block">Desired Solution &amp; Must-Haves:</span>
                  <p className="text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100">&ldquo;{surveyData.desiredSolution}&rdquo;</p>
                  <p className="text-slate-600 mt-1">Features: {surveyData.mustHaveFeatures.join(', ') || 'None'}</p>
                </div>
                {surveyData.killerFeature && (
                  <div className="pt-2">
                    <span className="font-semibold text-slate-800 block">Killer Feature:</span>
                    <p className="text-slate-600">{surveyData.killerFeature}</p>
                  </div>
                )}
                <div className="pt-2 flex justify-between text-slate-500">
                  <span>Beta Tester Interest:</span>
                  <span className="font-medium text-slate-800">{surveyData.wantsBetaAccess ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Cancel / Back to Form
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onSaveFirestoreOnly}
              disabled={isSending}
              className="flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
              title="Save directly to Firestore without sending email"
            >
              Save Firestore Only
            </button>

            <button
              type="button"
              onClick={onConfirmSendGmail}
              disabled={isSending}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-60"
            >
              {isSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending via Gmail...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm &amp; Send to vexloraindia@gmail.com</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
