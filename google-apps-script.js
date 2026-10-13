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

    // Send email directly via Gmail MailApp with Reply-To set to the respondent
    MailApp.sendEmail({
      to: recipient,
      replyTo: replyTo,
      subject: subject,
      htmlBody: htmlBody
    });

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
