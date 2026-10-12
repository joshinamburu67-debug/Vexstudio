import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Mail, Database, ExternalLink, ArrowRight, RotateCcw } from 'lucide-react';
import { TARGET_SURVEY_EMAIL } from '../services/gmail';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onViewDashboard: () => void;
  onResetForm: () => void;
  emailStatus: 'sent' | 'pending' | 'failed' | 'draft';
  emailError?: string;
  respondentName: string;
}

export const SubmissionSuccessModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onViewDashboard,
  onResetForm,
  emailStatus,
  emailError,
  respondentName
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden text-center p-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Animated Checkmark Circle */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-50 ring-8 ring-emerald-50">
          <CheckCircle className="w-9 h-9" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Thank you, {respondentName}!
        </h3>
        
        <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
          Your feedback and product suggestions have been received and recorded.
        </p>

        {/* Status Indicators */}
        <div className="my-6 space-y-2.5 text-left bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs">
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700 font-medium">
              <Database className="w-4 h-4 text-amber-500" />
              Firestore Cloud Database
            </span>
            <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Stored Successfully
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 pt-2.5">
            <span className="flex items-center gap-2 text-slate-700 font-medium">
              <Mail className="w-4 h-4 text-indigo-500" />
              Delivered to {TARGET_SURVEY_EMAIL}
            </span>
            {emailStatus === 'sent' ? (
              <span className="bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                Sent via Gmail API
              </span>
            ) : emailStatus === 'failed' ? (
              <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                Saved (Email Failed)
              </span>
            ) : (
              <span className="bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                Saved to DB Only
              </span>
            )}
          </div>

          {emailError && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200/60">
              Note: {emailError}
            </p>
          )}

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <button
            onClick={() => {
              onResetForm();
              onClose();
            }}
            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Submit Another
          </button>

          <button
            onClick={() => {
              onClose();
              onViewDashboard();
            }}
            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-100 transition-colors"
          >
            <span>View Responses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
