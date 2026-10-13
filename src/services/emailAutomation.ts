import { SurveyResponse } from '../types/survey';
import { buildSurveyEmailHtml } from './gmail';

export const TARGET_SURVEY_EMAIL = 'vexloraindia@gmail.com';

export interface EmailSendResult {
  success: boolean;
  provider: 'custom-webhook' | 'formsubmit' | 'fallback';
  messageId?: string;
  error?: string;
  isFirstTimeActivationNotice?: boolean;
}

/**
 * Sends automated email for a newly submitted survey response.
 * - Targets: TARGET_SURVEY_EMAIL (vexloraindia@gmail.com)
 * - Reply-To: respondent's userEmail, allowing direct inbox replies to the respondent.
 * 
 * Supports:
 * 1. Custom webhook (e.g. Google Apps Script Web App) via VITE_EMAIL_WEBHOOK_URL
 * 2. 100% Free FormSubmit.co AJAX automation out-of-the-box
 */
export async function sendAutomatedSurveyEmail(survey: SurveyResponse): Promise<EmailSendResult> {
  const customWebhookUrl = import.meta.env.VITE_EMAIL_WEBHOOK_URL;

  // 1. If user configured a custom webhook (e.g. Google Apps Script Web App)
  if (customWebhookUrl && customWebhookUrl.trim().length > 0) {
    try {
      const response = await fetch(customWebhookUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: TARGET_SURVEY_EMAIL,
          replyTo: survey.userEmail,
          respondentName: survey.respondentName,
          respondentEmail: survey.userEmail,
          subject: `[Vexlora Survey Response] Feedback from ${survey.respondentName} (${survey.userEmail})`,
          htmlBody: buildSurveyEmailHtml(survey),
          data: survey
        })
      });

      if (response.ok) {
        return {
          success: true,
          provider: 'custom-webhook'
        };
      } else {
        const errText = await response.text().catch(() => '');
        console.warn('Custom webhook email dispatch returned non-200:', errText);
        // Fall back to FormSubmit if custom webhook failed
      }
    } catch (webhookErr: any) {
      console.warn('Custom webhook dispatch failed, attempting FormSubmit fallback:', webhookErr);
      // Fall through to FormSubmit fallback
    }
  }

  // 2. Default: FormSubmit.co AJAX API (100% free, automated, sets reply-to directly to respondent)
  try {
    const formSubmitUrl = `https://formsubmit.co/ajax/${TARGET_SURVEY_EMAIL}`;

    const payload = {
      _subject: `📋 [Vexlora Survey Response] Feedback from ${survey.respondentName} (${survey.userEmail})`,
      _replyto: survey.userEmail,
      _template: 'table',
      'Respondent Name': survey.respondentName,
      'Respondent Email': survey.userEmail,
      'Role / Background': survey.respondentRole || 'Not specified',
      'Primary Device': survey.primaryDevice || 'Not specified',
      'Frustration Rating': `${survey.painLevel} / 5 Stars`,
      'Friction Points': survey.painPoints?.length ? survey.painPoints.join(', ') : 'None selected',
      'Biggest Frustration': survey.biggestFrustration,
      'Desired Solution': survey.desiredSolution,
      'Must-Have Features': survey.mustHaveFeatures?.length ? survey.mustHaveFeatures.join(', ') : 'None selected',
      'Killer Feature': survey.killerFeature || 'None specified',
      'Beta Tester Opt-In': survey.wantsBetaAccess ? 'Yes, interested in early beta' : 'No',
      'Additional Notes': survey.additionalNotes || 'None',
      'Submitted At': new Date(survey.createdAt).toLocaleString(),
      'Response ID': survey.id
    };

    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok && (result.success === 'true' || result.success === true)) {
      return {
        success: true,
        provider: 'formsubmit',
        messageId: result.message
      };
    }

    // Check if FormSubmit returned an activation instruction (first-time use requires one-time confirmation)
    const resultMessage = result.message || '';
    const isActivationNotice = resultMessage.toLowerCase().includes('activate') ||
      resultMessage.toLowerCase().includes('confirm') ||
      resultMessage.toLowerCase().includes('check your email');

    if (isActivationNotice) {
      return {
        success: true, // It successfully initiated the confirmation to vexloraindia@gmail.com
        provider: 'formsubmit',
        isFirstTimeActivationNotice: true,
        error: resultMessage
      };
    }

    return {
      success: false,
      provider: 'formsubmit',
      error: result.message || `HTTP ${response.status}: Failed to dispatch automated email`
    };
  } catch (error: any) {
    console.error('Automated email dispatch error:', error);
    return {
      success: false,
      provider: 'formsubmit',
      error: error.message || 'Network error while contacting email automation service'
    };
  }
}
