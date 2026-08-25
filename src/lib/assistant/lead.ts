import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import { AUTHOR } from "@/lib/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * The model decides when to call this, so the schema is the model's contract,
 * not a validation boundary. Everything is re-checked in captureLead() before
 * anything is sent.
 */
export const CAPTURE_LEAD_TOOL: Anthropic.Tool = {
  name: "capture_lead",
  description:
    "Forward a visitor's contact details to Fernando. Call this only after the visitor has given you their name and their email address in the conversation. Never fill in an email you were not given.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The visitor's name, as they gave it." },
      email: { type: "string", description: "The visitor's email address, as they typed it." },
      message: {
        type: "string",
        description: "A short summary of what they are looking for, in their own words.",
      },
    },
    required: ["name", "email", "message"],
    additionalProperties: false,
  },
  strict: true,
};

const leadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  message: z.string().trim().min(1).max(2000),
});

export function isLeadCaptureAvailable(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Strips anything that could break out of the plain-text body into a header.
 * The fields are attacker-controlled: whoever is chatting picks the name and
 * the message.
 */
function sanitize(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export interface LeadResult {
  ok: boolean;
  message: string;
}

/**
 * Sends the lead to the inbox.
 *
 * `to` and `from` come from the environment, never from the tool input. That is
 * what stops the assistant from being talked into acting as a mail relay: the
 * worst a crafted conversation can do is put junk in Fernando's own inbox.
 */
export async function captureLead(input: unknown): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message:
        "Those details were not valid: an email address is required. Ask the visitor to confirm it.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      message: "Lead capture is not configured. Offer the email address instead.",
    };
  }

  const { name, email, message } = parsed.data;
  const to = process.env.LEAD_TO_EMAIL || AUTHOR.email;
  const from = process.env.LEAD_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  // Plain text, not HTML: the body is written by whoever is chatting, and a
  // mail client rendering their markup is how a lead notification turns into a
  // phishing page.
  const body = [
    "New lead from the portfolio assistant.",
    "",
    `Name:  ${sanitize(name)}`,
    `Email: ${sanitize(email)}`,
    "",
    "Message:",
    message.replace(/\r/g, ""),
    "",
    "---",
    "Submitted through the site's assistant. The email address is unverified:",
    "it is whatever the visitor typed, not a confirmed address.",
  ].join("\n");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio lead: ${sanitize(name)}`,
        text: body,
      }),
    });

    if (!response.ok) {
      // Status and error code, not the message: Resend echoes addresses back in
      // it, and this lands in the platform logs. The full text is on the
      // Resend dashboard when a delivery needs chasing down.
      const code = await response
        .json()
        .then((body) => body?.name ?? "unknown")
        .catch(() => "unparseable");
      console.error(`[assistant] resend rejected the lead: ${response.status} ${code}`);
      return {
        ok: false,
        message: "The message could not be delivered. Offer the email address on the page instead.",
      };
    }

    return { ok: true, message: "Delivered. Fernando will see it in his inbox." };
  } catch {
    console.error("[assistant] resend request failed");
    return {
      ok: false,
      message: "The message could not be delivered. Offer the email address on the page instead.",
    };
  }
}
