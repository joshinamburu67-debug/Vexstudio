import { SurveyResponse } from '../types/survey';

export const TARGET_SURVEY_EMAIL = 'vexloraindia@gmail.com';

/**
 * Builds the HTML content for the survey response notification email.
 */
export function buildSurveyEmailHtml(data: SurveyResponse): string {
  const painPointsList = data.painPoints?.length
    ? data.painPoints.map(p => `<li style="margin-bottom: 4px;">• ${p}</li>`).join('')
    : '<li>None selected</li>';

  const featuresList = data.mustHaveFeatures?.length
    ? data.mustHaveFeatures.map(f => `<li style="margin-bottom: 4px;">✔ ${f}</li>`).join('')
    : '<li>None selected</li>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Survey Response - Vexlora</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px;">
  <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px 32px; color: #ffffff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">📋 New Vexlora Problem Submission</h1>
      <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">User Problem Resolution &amp; Solutions Report</p>
    </div>

    <div style="padding: 32px;">
      
      <!-- Respondent Info Card -->
      <div style="background: #f1f5f9; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">Respondent Profile</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px;"><strong>Name:</strong></td>
            <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${data.respondentName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 4px 0; color: #2563eb;"><a href="mailto:${data.userEmail}" style="color: #2563eb; text-decoration: none;">${data.userEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Role / Background:</strong></td>
            <td style="padding: 4px 0; color: #0f172a;">${data.respondentRole || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Primary Device:</strong></td>
            <td style="padding: 4px 0; color: #0f172a;">${data.primaryDevice || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Beta Tester:</strong></td>
            <td style="padding: 4px 0; color: ${data.wantsBetaAccess ? '#16a34a' : '#64748b'}; font-weight: 600;">
              ${data.wantsBetaAccess ? '✅ Yes, interested in early beta' : '❌ No'}
            </td>
          </tr>
        </table>
      </div>

      <!-- Section: Problems Faced -->
      <div style="margin-bottom: 28px;">
        <h2 style="margin: 0 0 12px 0; font-size: 17px; color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 6px;">
          1. Real-World Problems &amp; Bottlenecks Faced
        </h2>

        <div style="margin-bottom: 14px;">
          <strong style="font-size: 14px; color: #475569;">Frustration Severity Rating:</strong>
          <span style="display: inline-block; background: #fee2e2; color: #991b1b; padding: 2px 10px; border-radius: 9999px; font-weight: 700; margin-left: 8px; font-size: 13px;">
            ${data.painLevel} / 5 Stars
          </span>
        </div>

        <div style="margin-bottom: 14px;">
          <strong style="font-size: 14px; color: #475569;">Selected Common Friction Points:</strong>
          <ul style="margin: 6px 0 0 0; padding-left: 20px; font-size: 14px; color: #334155;">
            ${painPointsList}
          </ul>
        </div>

        <div>
          <strong style="font-size: 14px; color: #475569;">Single Biggest Problem Wasting Time / Causing Frustration:</strong>
          <div style="margin-top: 6px; padding: 14px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; font-size: 14px; color: #1f2937; white-space: pre-wrap;">${data.biggestFrustration}</div>
        </div>
      </div>

      <!-- Section: Solutions & Suggestions -->
      <div style="margin-bottom: 28px;">
        <h2 style="margin: 0 0 12px 0; font-size: 17px; color: #4f46e5; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px;">
          2. Proposed Solutions &amp; Time-Saving Ideas
        </h2>

        <div style="margin-bottom: 14px;">
          <strong style="font-size: 14px; color: #475569;">Solution that would make life/work 10x easier &amp; save time:</strong>
          <div style="margin-top: 6px; padding: 14px; background: #eef2ff; border-left: 4px solid #6366f1; border-radius: 4px; font-size: 14px; color: #1e1b4b; white-space: pre-wrap;">${data.desiredSolution}</div>
        </div>

        <div style="margin-bottom: 14px;">
          <strong style="font-size: 14px; color: #475569;">Must-Have Features Selected:</strong>
          <ul style="margin: 6px 0 0 0; padding-left: 20px; font-size: 14px; color: #334155;">
            ${featuresList}
          </ul>
        </div>

        ${data.killerFeature ? `
        <div style="margin-bottom: 14px;">
          <strong style="font-size: 14px; color: #475569;">Requested ONE Killer Feature:</strong>
          <div style="margin-top: 6px; padding: 12px 14px; background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 4px; font-size: 14px; color: #064e3b; font-weight: 500;">
            ${data.killerFeature}
          </div>
        </div>` : ''}

        ${data.additionalNotes ? `
        <div>
          <strong style="font-size: 14px; color: #475569;">Additional Notes &amp; Suggestions:</strong>
          <div style="margin-top: 6px; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 14px; color: #334155; white-space: pre-wrap;">
            ${data.additionalNotes}
          </div>
        </div>` : ''}
      </div>

      <!-- Footer Info -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Submitted at: ${new Date(data.createdAt).toLocaleString()}</span>
        <span>ID: ${data.id}</span>
      </div>

    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Creates RFC 2822 formatted email message string and encodes it into URL-safe base64
 */
function createRawEmail(data: SurveyResponse, senderEmail: string, recipientEmail: string): string {
  const subject = `[Vexlora Survey Response] Feedback from ${data.respondentName} (${data.userEmail})`;
  const htmlBody = buildSurveyEmailHtml(data);

  const emailLines = [
    `From: ${senderEmail}`,
    `To: ${recipientEmail}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(htmlBody)))
  ];

  const emailText = emailLines.join('\r\n');
  // URL-safe base64 encode RFC 2822 string
  return btoa(unescape(encodeURIComponent(emailText)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends the survey response email via Gmail REST API
 */
export async function sendSurveyEmailViaGmail(
  accessToken: string,
  surveyData: SurveyResponse,
  senderEmail: string,
  recipientEmail = TARGET_SURVEY_EMAIL
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const raw = createRawEmail(surveyData, senderEmail, recipientEmail);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error('Gmail send error:', errMsg);
      return { success: false, error: errMsg };
    }

    const result = await response.json();
    return { success: true, messageId: result.id };
  } catch (error: any) {
    console.error('Failed to send survey email via Gmail:', error);
    return { success: false, error: error.message || 'Network error while contacting Gmail API' };
  }
}
