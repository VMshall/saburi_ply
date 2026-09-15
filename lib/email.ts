import nodemailer, { type Transporter } from "nodemailer";

/**
 * Email notifications for form submissions — replicates the legacy backend
 * (server/src/services/email.service.js): on each lead we send
 *   - an ADMIN notification (a table of the submission) -> MARKETING_EMAIL
 *   - a THANK-YOU to the submitter (if they gave an email)
 * Gmail SMTP (noreply@saburiply.com) via the same SMTP_* env vars as before.
 * Failures are swallowed (logged) so a mail problem never fails the DB write.
 */

const ADMIN_EMAIL = process.env.MARKETING_EMAIL ?? "marketing@saburiply.com";
const FROM = process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? "noreply@saburiply.com";
const SITE = "https://www.saburiply.com";

let transporter: Transporter | null = null;
function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, STARTTLS otherwise
      auth: { user, pass },
      requireTLS: true,
      tls: { rejectUnauthorized: false },
    });
  }
  return transporter;
}

export type FormType = "contact" | "partner" | "quote" | "enquiry";

const SUBJECTS: Record<FormType, { admin: string; user: string; title: string }> = {
  contact: {
    admin: "New Contact Inquiry - Saburi Ply",
    user: "Thank you for contacting Saburi Ply",
    title: "New Contact Inquiry",
  },
  partner: {
    admin: "New Partner Application - Saburi Ply",
    user: "We've received your partner application - Saburi Ply",
    title: "New Partner Application",
  },
  quote: {
    admin: "New Quote Request - Saburi Ply",
    user: "We've received your quote request - Saburi Ply",
    title: "New Quote Request",
  },
  enquiry: {
    admin: "New Product Enquiry - Saburi Ply",
    user: "We've received your product enquiry - Saburi Ply",
    title: "New Product Enquiry",
  },
};

const LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone_number: "Phone",
  contact_number: "Phone",
  company_name: "Company",
  firm_name: "Firm",
  inquiry_type: "Inquiry Type",
  product_type: "Product Type",
  product: "Product",
  estimated_qty: "Estimated Quantity",
  additional_requirements: "Additional Requirements",
  project_type: "Project Type",
  partner_type: "Partner Type",
  state: "State",
  city: "City",
  message: "Message",
};

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(title: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="text-align:center;padding:16px 0">
      <span style="font-size:22px;font-weight:800;color:#e11d2a;letter-spacing:.5px">SABURI PLYWOOD</span>
    </div>
    <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #eee">
      <h2 style="margin:0 0 16px;font-size:20px;color:#111">${esc(title)}</h2>
      ${inner}
    </div>
    <p style="text-align:center;color:#888;font-size:12px;margin-top:16px">
      Saburi Plywood · <a href="${SITE}" style="color:#e11d2a;text-decoration:none">saburiply.com</a>
    </p>
  </div></body></html>`;
}

function detailsTable(data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:8px 12px;background:#faf7f7;font-weight:600;border:1px solid #eee;white-space:nowrap">${esc(
            LABELS[k] ?? k,
          )}</td>
          <td style="padding:8px 12px;border:1px solid #eee">${esc(v)}</td>
        </tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>`;
}

async function send(to: string, subject: string, html: string): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.error("[email] SMTP not configured; skipping send to", to);
    return;
  }
  try {
    await t.sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    console.error(`[email] failed to send to ${to}:`, err);
  }
}

/**
 * Send admin + user notifications for a submission. Never throws.
 */
export async function sendNotification(
  type: FormType,
  data: Record<string, unknown>,
): Promise<void> {
  const s = SUBJECTS[type];
  if (!s) return;

  const adminHtml = layout(
    s.title,
    `<p style="margin:0 0 16px;color:#444">A new ${type} submission was received from the website:</p>${detailsTable(
      data,
    )}`,
  );
  await send(ADMIN_EMAIL, s.admin, adminHtml);

  const name = data.name ? ` ${esc(data.name)}` : "";
  const email = typeof data.email === "string" ? data.email : "";
  if (email) {
    const userHtml = layout(
      "Thank You",
      `<p style="margin:0 0 12px;font-size:15px">Dear${name},</p>
       <p style="margin:0 0 12px;color:#444;line-height:1.6">
         Thank you for reaching out to <strong>Saburi Plywood</strong>. We've received your ${type} and
         our team will get back to you shortly.
       </p>
       <p style="margin:0 0 12px;color:#444;line-height:1.6">
         For anything urgent, call us at <strong>1800 313 666 000</strong> or reply to this email.
       </p>
       <p style="margin:16px 0 0;color:#444">Warm regards,<br/><strong>Team Saburi Plywood</strong></p>`,
    );
    await send(email, s.user, userHtml);
  }
}
