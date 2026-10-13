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
  const customWebhookUrl =
    (typeof window !== 'undefined' && localStorage.getItem('vexlora_webhook_url')) ||
    import.meta.env.VITE_EMAIL_WEBHOOK_URL;

  // 1. If user configured a custom webhook (e.g. Google Apps Script Web App for sending directly FROM vexloraindia@gmail.com)
  if (customWebhookUrl && customWebhookUrl.trim().length > 0) {
    const url = customWebhookUrl.trim();
    const payload = JSON.stringify({
      recipient: TARGET_SURVEY_EMAIL,
      replyTo: survey.userEmail,
      respondentName: survey.respondentName,
      respondentEmail: survey.userEmail,
      subject: `[Vexlora Survey Response] Feedback from ${survey.respondentName} (${survey.userEmail})`,
      htmlBody: buildSurveyEmailHtml(survey),
      data: survey
    });

    try {
      // Use text/plain to avoid preflight CORS restrictions on Google Apps Script
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: payload
      });

      if (response.ok || response.type === 'opaque') {
        return {
          success: true,
          provider: 'custom-webhook'
        };
      }
    } catch (err: any) {
      // Fallback with mode: 'no-cors' so Google Apps Script always executes and sends from vexloraindia@gmail.com
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: payload
        });
        return {
          success: true,
          provider: 'custom-webhook'
        };
      } catch (noCorsErr) {
        console.warn('Webhook dispatch failed, falling back to FormSubmit:', noCorsErr);
      }
    }
  }

  // 2. Default: FormSubmit.co AJAX API (100% free, automated, sets reply-to directly to respondent)
  try {
    const formSubmitUrl = `https://formsubmit.co/ajax/${TARGET_SURVEY_EMAIL}`;

    const payload = {
      _subject: `📋 [Vexlora Problem Submission] Real Problem & Solution from ${survey.respondentName} (${survey.userEmail})`,
      _replyto: survey.userEmail,
      _autoresponse: `Thank you for choosing Vexlora!\n\nHi ${survey.respondentName},\n\nThank you for reaching out and sharing your problem with Vexlora. We have received your submission and our team is actively reviewing your problem to design a high-impact solution to save your time.\n\nWe will connect with you soon!\n\nBest regards,\nThe Vexlora Team\nvexloraindia@gmail.com`,
      _template: 'table',
      'Respondent Name': survey.respondentName,
      'Respondent Email': survey.userEmail,
      'Role / Background': survey.respondentRole || 'Not specified',
      'Primary Device': survey.primaryDevice || 'Not specified',
      'Frustration & Severity': `${survey.painLevel} / 5 Stars`,
      'Problems Faced': survey.painPoints?.length ? survey.painPoints.join(', ') : 'None selected',
      'Single Biggest Problem': survey.biggestFrustration,
      'Desired Solution & Time Saver': survey.desiredSolution,
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
