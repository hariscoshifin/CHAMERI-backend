const nodemailer = require("nodemailer");

// ─── Transporter ──────────────────────────────────────────────────────────────
// Replace EMAIL_USER / EMAIL_PASS in .env with your real Gmail + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Send OTP Email ───────────────────────────────────────────────────────────
const sendOtpEmail = async (toEmail, otp, adminName) => {
  const mailOptions = {
    from: `"CHAMERI Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🔐 Your Password Reset OTP — CHAMERI Admin",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#1a1f35;border-radius:16px;overflow:hidden;border:1px solid #2a3158;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#2952ff,#7c3aed);padding:32px 40px;text-align:center;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:26px;">⚡</span>
              </div>
              <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">CHAMERI Admin</h1>
              <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Password Reset Request</p>
            </div>
            <!-- Body -->
            <div style="padding:36px 40px;">
              <p style="color:#9ca3af;font-size:14px;margin:0 0 8px;">Hi ${adminName || "Admin"},</p>
              <p style="color:#e5e7eb;font-size:14px;line-height:1.6;margin:0 0 28px;">
                We received a password reset request for your CHAMERI Admin account.<br/>
                Use the OTP below — it expires in <strong style="color:#fff;">10 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background:#0f1117;border:1px dashed #2a3158;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="color:#6b7280;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;">Your OTP Code</p>
                <p style="color:#fff;font-size:40px;font-weight:800;letter-spacing:10px;margin:0;font-family:monospace;">${otp}</p>
              </div>
              <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:0;">
                If you didn't request this, you can safely ignore this email.<br/>
                Never share this OTP with anyone.
              </p>
            </div>
            <!-- Footer -->
            <div style="border-top:1px solid #2a3158;padding:20px 40px;text-align:center;">
              <p style="color:#374151;font-size:11px;margin:0;">© ${new Date().getFullYear()} CHAMERI Agency. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
