/**
 * Google Apps Script for Vexlora Survey Email Automation
 * 
 * This provides 100% FREE, unlimited email automation directly via Google's infrastructure.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Visit https://script.google.com/home while signed in to vexloraindia@gmail.com
 * 2. Click "New Project" (title it: "Vexlora Email Dispatcher")
 * 3. Replace Code.gs with the code below and save (Ctrl+S).
 * 4. Click the blue "Deploy" button at top-right -> "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set:
 *    - Description: "Vexlora Survey Email Webhook"
 *    - Execute as: "Me (vexloraindia@gmail.com)"
 *    - Who has access: "Anyone"
 * 7. Click "Deploy", grant access permissions to your Google account when prompted.
 * 8. Copy the Web app URL (looks like: https://script.google.com/macros/s/.../exec).
 * 9. Add it to your .env.local file:
 *    VITE_EMAIL_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = data.recipient || "vexloraindia@gmail.com";
    var replyTo = data.replyTo || data.respondentEmail;
    var subject = data.subject || ("New Vexlora Survey Submission from " + data.respondentName);
    var htmlBody = data.htmlBody;

    // 1. Send full submission notification to Vexlora team
    MailApp.sendEmail({
      to: recipient,
      replyTo: replyTo,
      subject: subject,
      htmlBody: htmlBody
    });

    // 2. Automatically send 'Thank you for choosing Vexlora' confirmation back to the respondent
    if (replyTo && replyTo.indexOf('@') > -1) {
      MailApp.sendEmail({
        to: replyTo,
        subject: "Thank you for choosing Vexlora! We will connect with you soon",
        htmlBody: '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">' +
          '<h2 style="color: #4f46e5; margin-top: 0;">Thank you for choosing Vexlora!</h2>' +
          '<p style="color: #334155; font-size: 15px; line-height: 1.6;">Hi <strong>' + (data.respondentName || 'there') + '</strong>,</p>' +
          '<p style="color: #334155; font-size: 15px; line-height: 1.6;">Thank you for submitting your survey feedback and product suggestions. We have successfully received your response, and our team will connect with you soon regarding updates and early beta access!</p>' +
          '<div style="margin: 24px 0; padding: 16px; background: #f8fafc; border-left: 4px solid #6366f1; border-radius: 6px; font-size: 14px; color: #475569;">' +
          '<strong>Your Recorded Feedback:</strong><br>' +
          '<em>&ldquo;' + (data.data?.biggestFrustration || data.subject || 'Recorded feedback') + '&rdquo;</em>' +
          '</div>' +
          '<p style="color: #64748b; font-size: 13px; line-height: 1.5;">If you have any urgent questions or ideas in the meantime, feel free to reply directly to this email.</p>' +
          '<br>' +
          '<p style="color: #0f172a; font-size: 14px; margin-bottom: 0;">Warm regards,<br><strong>The Vexlora Team</strong><br><a href="mailto:vexloraindia@gmail.com" style="color: #4f46e5; text-decoration: none;">vexloraindia@gmail.com</a></p>' +
          '</div>'
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Email sent successfully"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Vexlora Survey Email Automation"
  })).setMimeType(ContentService.MimeType.JSON);
}
