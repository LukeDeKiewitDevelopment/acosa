import type { APIRoute } from "astro";
import { Resend } from "resend";

// This route sends transactional email at request time — it must not be
// prerendered.
export const prerender = false;

type ListPropertyPayload = {
  propertyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  province?: string;
  propertyType?: string;
  message?: string;
  hcaptchaToken?: string;
};

function json(data: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Verify the hCaptcha token with hCaptcha's siteverify endpoint. */
async function verifyHcaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) return false;
  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export const POST: APIRoute = async ({ request }) => {
  let payload: ListPropertyPayload;
  try {
    payload = (await request.json()) as ListPropertyPayload;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const {
    propertyName,
    contactName,
    email,
    phone,
    province,
    propertyType,
    message,
    hcaptchaToken,
  } = payload;

  if (!propertyName || !contactName || !email) {
    return json(
      { error: "Property name, your name and email are required." },
      400,
    );
  }
  if (!hcaptchaToken) {
    return json({ error: "Captcha verification is required." }, 400);
  }

  // Captcha MUST be verified server-side before any email is sent.
  const captchaValid = await verifyHcaptcha(hcaptchaToken);
  if (!captchaValid) {
    return json({ error: "Captcha verification failed. Please try again." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  // The send-to address is read from env directly (not trusted from the client).
  const to = process.env.RESEND_TO_EMAIL;
  if (!apiKey || !to) {
    return json({ error: "Email service is not configured." }, 500);
  }

  const resend = new Resend(apiKey);

  try {
    // TODO: The `from` address must be on a domain you have verified in the
    // Resend dashboard (https://resend.com/domains). Replace the placeholder
    // domain `acosa.co.za` with your verified sending domain before going live.
    const { error } = await resend.emails.send({
      from: "Acosa Enquiries <enquiries@acosa.co.za>",
      to,
      replyTo: email,
      subject: `Property Application: ${propertyName} from ${contactName}`,
      html: `
        <h2>Property Application</h2>
        <p><strong>Property Name:</strong> ${escapeHtml(propertyName)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(contactName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Province:</strong> ${escapeHtml(province || "Not provided")}</p>
        <p><strong>Property Type:</strong> ${escapeHtml(propertyType || "Not provided")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message || "None")}</p>
      `,
    });

    if (error) {
      return json({ error: error.message }, 500);
    }
    return json({ ok: true }, 200);
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Failed to send email." },
      500,
    );
  }
};

// Any non-POST method is not allowed.
export const ALL: APIRoute = () =>
  json({ error: "Method not allowed." }, 405);
