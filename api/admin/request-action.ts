import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Load environment variables for local testing
dotenv.config();

// In-memory sliding window rate limiter for security
const rateLimitStore = new Map<string, number[]>();
const LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // Slightly higher limit for administrative updates

/**
 * Decodes a Firebase ID token (JWT) to extract email and UID without verification.
 * This is useful as a fast sanity check.
 */
function decodeFirebaseToken(token: string): { email?: string; uid?: string } {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
      const decoded = JSON.parse(decodedJson);
      return {
        email: decoded.email,
        uid: decoded.user_id || decoded.sub
      };
    }
  } catch (e) {
    console.error("[Token Decode Error]", e);
  }
  return {};
}

// Initialize server-side Firebase instance
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

/**
 * Secure Backend API for Administrator request-action (approval/rejection)
 */
export default async function handler(req: any, res: any) {
  // Ensure only POST requests are allowed
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Please use POST.`
    });
  }

  // --- STEP 1: Verify Administrator Authentication ---
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Missing or malformed Authorization header."
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer "
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid token format."
    });
  }

  // Fast decoded email check
  const decoded = decodeFirebaseToken(token);
  const REQUIRED_ADMIN = "crazyplayz61@gmail.com";
  if (decoded.email && decoded.email.toLowerCase() !== REQUIRED_ADMIN) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Unauthorized administrator email."
    });
  }

  let adminEmail = decoded.email || REQUIRED_ADMIN;

  // Real-time Firebase token lookup validation with Identity Toolkit
  const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
  if (apiKey) {
    try {
      const lookupResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token })
        }
      );

      const lookupData: any = await lookupResponse.json();
      if (!lookupResponse.ok || !lookupData.users || lookupData.users.length === 0) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Invalid or expired administrator session."
        });
      }

      const verifiedEmail = lookupData.users[0].email;
      if (!verifiedEmail || verifiedEmail.toLowerCase() !== REQUIRED_ADMIN) {
        return res.status(403).json({
          success: false,
          error: "Forbidden: You are not authorized as an administrator."
        });
      }
      adminEmail = verifiedEmail;
    } catch (authError: any) {
      console.error("[Backend Auth Validation Error]", authError);
      return res.status(401).json({
        success: false,
        error: `Unauthorized: Failed to verify administrator authentication: ${authError.message}`
      });
    }
  }

  // Apply Rate Limiting
  try {
    const now = Date.now();
    let timestamps = rateLimitStore.get(adminEmail) || [];
    timestamps = timestamps.filter(t => t > now - LIMIT_WINDOW_MS);

    if (timestamps.length >= MAX_REQUESTS) {
      const oldestTimestamp = timestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil(((oldestTimestamp + LIMIT_WINDOW_MS) - now) / 1000));
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: "Too Many Requests: Rate limit exceeded. Please try again later.",
        retryAfter: retryAfterSeconds
      });
    }

    timestamps.push(now);
    rateLimitStore.set(adminEmail, timestamps);
  } catch (limiterErr) {
    console.error("[Limiter Error]", limiterErr);
  }

  // --- STEP 2: Validate Input Parameters ---
  const { requestId, action } = req.body;
  if (!requestId || typeof requestId !== "string") {
    return res.status(400).json({
      success: false,
      error: "Bad Request: Missing or invalid parameter 'requestId'."
    });
  }

  if (action !== "approve" && action !== "reject") {
    return res.status(400).json({
      success: false,
      error: "Bad Request: Parameter 'action' must be 'approve' or 'reject'."
    });
  }

  // Get Client IP Address safely for audit logging
  const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  const ipAddress = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;

  // --- STEP 3: Load the Firestore Document & Verify it exists ---
  let requestData: any = null;
  const docRef = doc(db, "portfolio_access_requests", requestId);

  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({
        success: false,
        error: `Request ID ${requestId} not found.`
      });
    }
    requestData = docSnap.data();
  } catch (firestoreReadError: any) {
    console.error(`[Firestore Load Error] Failed to read request: ${requestId}`, firestoreReadError);
    return res.status(500).json({
      success: false,
      error: `Internal Database Error: Failed to load target request. ${firestoreReadError.message}`
    });
  }

  const { name, email } = requestData;

  // --- STEP 4: Update Firestore Document ---
  let portalToken = "";
  try {
    const { allowedProjects } = req.body;
    const existingPortalToken = requestData.portalToken;
    portalToken = existingPortalToken || require("crypto").randomBytes(24).toString("hex");

    const updatePayload: any = action === "approve" 
      ? {
          status: "approved",
          approvedAt: serverTimestamp(),
          approvedBy: adminEmail,
          allowedProjects: allowedProjects !== undefined ? allowedProjects : (requestData.allowedProjects || []),
          portalToken: portalToken,
          rejectedAt: null,
          rejectedBy: null
        }
      : {
          status: "rejected",
          rejectedAt: serverTimestamp(),
          rejectedBy: adminEmail,
          approvedAt: null,
          approvedBy: null
        };

    await updateDoc(docRef, updatePayload);
    console.log(`[Firestore Success] Updated request ${requestId} to state: ${action}`);
  } catch (firestoreUpdateError: any) {
    console.error(`[Firestore Update Error] Failed to write status for ${requestId}:`, firestoreUpdateError);
    // If Firestore update fails: Do NOT send email. Return HTTP 500.
    return res.status(500).json({
      success: false,
      error: `Firestore update failed: ${firestoreUpdateError.message}`
    });
  }

  // --- STEP 5: Send automatic notification email ---
  let emailSent = false;
  let emailErrorMsg = "";

  if (email) {
    try {
      const host = process.env.SMTP_HOST;
      const portStr = process.env.SMTP_PORT;
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const fromAddress = process.env.SMTP_FROM;

      if (!host || !portStr || !user || !pass || !fromAddress) {
        throw new Error("SMTP server environment variables are incomplete.");
      }

      const port = parseInt(portStr, 10);
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      let subject = "";
      let htmlContent = "";
      const portalLink = `${req.headers.origin || "https://obsidian-silicon-portfolio.com"}/downloads?token=${portalToken}`;

      if (action === "approve") {
        subject = "Portfolio Access Approved";
        htmlContent = `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #6d28d9; margin-top: 0;">Portfolio Access Approved</h2>
            <p>Hello ${name},</p>
            <p>Your request has been approved.</p>
            <p>You may now access your secure download portal.</p>
            <p style="margin: 24px 0;">
              <a href="${portalLink}" style="background-color: #8b5cf6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Access Download Portal
              </a>
            </p>
            <p style="font-size: 13px; color: #64748b;">If the button above does not work, copy and paste this URL into your browser:</p>
            <p style="font-size: 13px; color: #8b5cf6; word-break: break-all;">${portalLink}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 14px; margin-bottom: 0;">Regards,</p>
            <p style="font-weight: bold; margin-top: 4px; margin-bottom: 0;">Akshay S</p>
            <p style="color: #64748b; font-size: 13px; margin-top: 2px;">Obsidian Architecture</p>
          </div>
        `;
      } else {
        subject = "Portfolio Access Update";
        htmlContent = `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #ef4444; margin-top: 0;">Portfolio Access Update</h2>
            <p>Hello ${name},</p>
            <p>Unfortunately your request has not been approved.</p>
            <p>Thank you for your interest.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 14px; margin-bottom: 0;">Regards,</p>
            <p style="font-weight: bold; margin-top: 4px; margin-bottom: 0;">Akshay S</p>
          </div>
        `;
      }

      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject,
        html: htmlContent,
        text: action === "approve"
          ? `Hello ${name},\n\nYour request has been approved.\n\nYou may now access your secure download portal.\n\nRegards,\n\nAkshay S`
          : `Hello ${name},\n\nUnfortunately your request has not been approved.\n\nThank you for your interest.\n\nRegards,\n\nAkshay S`
      });

      emailSent = true;
      console.log(`[Email Sent] Successfully sent ${action} notice to ${email}`);
    } catch (emailError: any) {
      console.error("[Email Sending Failed]", emailError);
      emailErrorMsg = emailError.message || String(emailError);
    }
  }

  // --- STEP 6: Write an Audit Log ---
  try {
    const auditLogCol = collection(db, "admin_audit_logs");
    await addDoc(auditLogCol, {
      timestamp: serverTimestamp(),
      administratorEmail: adminEmail,
      requestId: requestId,
      action: action,
      result: emailSent ? "success" : "email_failed",
      emailFailed: !emailSent,
      emailErrorMessage: emailErrorMsg || null,
      ipAddress: ipAddress
    });
    console.log(`[Audit Logged] Successfully recorded audit log entry for request ${requestId}`);
  } catch (auditError: any) {
    // Audit log write failure shouldn't crash the whole response if DB wrote the main status.
    // However, we log it very loudly.
    console.error("[Audit Logging Failed]", auditError);
  }

  // --- STEP 7: Return final result ---
  if (!emailSent && email) {
    // If email fails: Keep Firestore update. Write audit log emailFailed = true.
    // Return { success: true, emailSent: false }
    return res.status(200).json({
      success: true,
      action,
      emailSent: false,
      error: `Email failed to send: ${emailErrorMsg}`
    });
  }

  return res.status(200).json({
    success: true,
    action,
    emailSent: emailSent || !email // if no email exists, then sending wasn't required, count as complete
  });
}
