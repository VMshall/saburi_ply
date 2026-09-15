import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendNotification, type FormType } from "@/lib/email";

/**
 * Form handler (§8, reworked): the browser POSTs to /api/forms/<endpoint>; this handler
 * writes the submission to Supabase and sends the admin + user email notifications
 * (replacing the old apiv2 backend). Response shape is unchanged for the client:
 * { success, message, data } on 2xx, { error: { message } } on failure.
 *
 * Node runtime (nodemailer + pg driver need Node APIs). Never statically optimised.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EndpointConfig = {
  table: string;
  fields: string[]; // allow-listed columns copied from the payload
  required: string[]; // must be present & non-empty
  notify?: FormType; // send admin+user emails (omit = store only)
  upsertOn?: string; // upsert conflict target (subscribers)
  defaults?: Record<string, unknown>;
};

const CONFIG: Record<string, EndpointConfig> = {
  "contact-us": {
    table: "contact_us",
    fields: ["name", "email", "phone_number", "state", "message"],
    required: ["name", "email", "phone_number", "state", "message"],
    notify: "contact",
  },
  quote: {
    table: "quotes",
    fields: [
      "name",
      "email",
      "phone_number",
      "company_name",
      "inquiry_type",
      "product_type",
      "estimated_qty",
      "additional_requirements",
    ],
    required: ["name", "phone_number", "inquiry_type"],
    notify: "quote",
  },
  enquiry: {
    table: "enquiries",
    fields: ["name", "email", "phone_number", "state", "city", "product", "message"],
    required: ["name", "phone_number", "state", "product"],
    notify: "enquiry",
  },
  "become-partner": {
    table: "become_partner",
    fields: [
      "name",
      "firm_name",
      "city",
      "contact_number",
      "email",
      "project_type",
      "message",
      "partner_type",
    ],
    required: ["name", "firm_name", "city", "contact_number", "project_type", "message", "partner_type"],
    notify: "partner",
  },
  "save-data": {
    table: "save_data",
    fields: ["name", "email", "phone_number"],
    required: ["name"],
  },
  subscribers: {
    table: "subscribers",
    fields: ["email"],
    required: ["email"],
    upsertOn: "email",
    defaults: { status: "active" },
  },
};

function pick(body: Record<string, unknown>, fields: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = body[f];
    if (v !== undefined && v !== null && String(v).trim() !== "") out[f] = v;
  }
  return out;
}

export async function POST(req: NextRequest, { params }: { params: { endpoint: string } }) {
  const cfg = CONFIG[params.endpoint];
  if (!cfg) {
    return NextResponse.json({ error: { message: "Unknown form endpoint" } }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: { message: "Invalid request body" } }, { status: 400 });
  }

  const row = { ...cfg.defaults, ...pick(body, cfg.fields) };

  const missing = cfg.required.filter((f) => !(f in row));
  if (missing.length) {
    return NextResponse.json(
      { error: { message: `Missing required field(s): ${missing.join(", ")}` } },
      { status: 400 },
    );
  }

  // Persist to Supabase
  try {
    const supabase = getSupabase();

    if (cfg.upsertOn) {
      const { error } = await supabase
        .from(cfg.table)
        .upsert(row, { onConflict: cfg.upsertOn, ignoreDuplicates: true });
      if (error) throw error;
    } else {
      const { error } = await supabase.from(cfg.table).insert(row);
      if (error) throw error;
    }
  } catch (err) {
    console.error(`[forms] DB write failed for ${params.endpoint}:`, err);
    return NextResponse.json(
      { error: { message: "Could not save your submission. Please try again." } },
      { status: 500 },
    );
  }

  // Email notifications (awaited so they run before the serverless fn freezes; never throws)
  if (cfg.notify) {
    await sendNotification(cfg.notify, row);
  }

  return NextResponse.json(
    { success: true, message: "Submitted successfully", data: row },
    { status: 201 },
  );
}
