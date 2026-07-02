var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.post("/api/send-email", async (req, res) => {
  const { type, name, email, downloadPortalLink } = req.body;
  if (!type || !name || !email) {
    return res.status(400).json({
      success: false,
      error: "Missing required parameters: type, name, and email must be provided."
    });
  }
  if (type !== "approve" && type !== "reject") {
    return res.status(400).json({
      success: false,
      error: "Invalid request type. Must be 'approve' or 'reject'."
    });
  }
  try {
    const host = process.env.SMTP_HOST;
    const portStr = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromAddress = process.env.SMTP_FROM;
    const missingVars = [];
    if (!host) missingVars.push("SMTP_HOST");
    if (!portStr) missingVars.push("SMTP_PORT");
    if (!user) missingVars.push("SMTP_USER");
    if (!pass) missingVars.push("SMTP_PASS");
    if (!fromAddress) missingVars.push("SMTP_FROM");
    if (missingVars.length > 0) {
      console.error(`[Email Config Error] Missing SMTP environment variables: ${missingVars.join(", ")}`);
      return res.status(500).json({
        success: false,
        error: `SMTP configuration is incomplete. Missing environment variable(s): ${missingVars.join(", ")}.`
      });
    }
    const port = parseInt(portStr, 10);
    const transporter = import_nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass
      }
    });
    let subject = "";
    let htmlContent = "";
    if (type === "approve") {
      const portalLink = downloadPortalLink || "https://obsidian-silicon-portfolio.com/downloads";
      subject = "Portfolio Access Approved";
      htmlContent = `
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #6d28d9; margin-top: 0;">Portfolio Access Approved</h2>
          <p>Hello ${name},</p>
          <p>Your request to access the Obsidian Architecture Portfolio has been approved.</p>
          <p>You can now access your personal download portal using the secure link below.</p>
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
      subject = "Portfolio Access Request Update";
      htmlContent = `
        <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #ef4444; margin-top: 0;">Portfolio Access Request Update</h2>
          <p>Hello ${name},</p>
          <p>Thank you for your interest.</p>
          <p>Unfortunately your request has not been approved at this time.</p>
          <p>If you believe this was an error you may submit another request later.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 14px; margin-bottom: 0;">Regards,</p>
          <p style="font-weight: bold; margin-top: 4px; margin-bottom: 0;">Akshay S</p>
        </div>
      `;
    }
    const mailOptions = {
      from: fromAddress,
      to: email,
      subject,
      html: htmlContent,
      // Fallback text body
      text: type === "approve" ? `Hello ${name},

Your request to access the Obsidian Architecture Portfolio has been approved.

You can now access your personal download portal using the secure link below.

${downloadPortalLink || "https://obsidian-silicon-portfolio.com/downloads"}

Regards,

Akshay S
Obsidian Architecture` : `Hello ${name},

Thank you for your interest.

Unfortunately your request has not been approved at this time.

If you believe this was an error you may submit another request later.

Regards,

Akshay S`
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] Successfully sent ${type} email to ${email}. Message ID: ${info.messageId}`);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("[Email Sending Failed]", error);
    return res.status(500).json({
      success: false,
      error: `Failed to send email securely: ${error.message}`
    });
  }
});
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("[Dev Server] Vite middleware integrated successfully.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("[Prod Server] Static files serving from dist/ folder.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack Server] App is listening on port ${PORT} host 0.0.0.0`);
  });
}
bootstrap();
//# sourceMappingURL=server.cjs.map
