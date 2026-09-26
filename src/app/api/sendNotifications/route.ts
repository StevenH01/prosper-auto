// src/app/api/sendNotifications/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Best-effort per-IP rate limit. State is per server instance, so on
// serverless hosts this slows abuse rather than fully preventing it.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

// Only accept requests sent from this site's own pages
function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,20}$/;

// Collapse newlines so single-line fields can't inject extra lines
const singleLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { clientName, clientPhone, clientEmail, serviceDetails } = body ?? {};

  // Validate required fields
  if (
    typeof clientName !== "string" ||
    typeof clientPhone !== "string" ||
    typeof clientEmail !== "string" ||
    typeof serviceDetails !== "string" ||
    !clientName.trim() ||
    !serviceDetails.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (
    clientName.length > 100 ||
    clientEmail.length > 254 ||
    serviceDetails.length > 2000 ||
    !EMAIL_RE.test(clientEmail) ||
    !PHONE_RE.test(clientPhone)
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const name = singleLine(clientName);
  const phone = singleLine(clientPhone);
  const email = clientEmail.trim();

  // Validate environment variables
  if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    console.error("Missing email configuration in environment variables");
    return NextResponse.json(
      { error: "Missing email configuration" },
      { status: 500 }
    );
  }

  if (!process.env.OWNER_PHONE_SMS_EMAIL || !process.env.OWNER_EMAIL) {
    console.error("Missing owner contact information in environment variables");
    return NextResponse.json(
      { error: "Missing owner contact information" },
      { status: 500 }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // Use an app-specific password if using Gmail with 2FA
      },
    });

    // 1. Send email to the client confirming the booking
    const clientMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Booking Confirmation",
      text: `Hello ${name},\n\nYour booking is confirmed!\n\n${serviceDetails}\n\nThank you!`,
    };
    await transporter.sendMail(clientMailOptions);

    // 2. Send SMS to the owner via email-to-SMS gateway
    if (process.env.OWNER_PHONE_SMS_EMAIL) {
      const serviceAbbreviations: Record<string, string> = {
        "Paint Protection Film": "PPF",
        "Window Tint": "WT",
        "Ceramic Coating": "CC",
        "Vehicle Vinyl Wrap": "VVW",
      };

      // Extract vehicle details
      const year = serviceDetails.match(/Vehicle Year: (.+)/)?.[1]?.trim() || "N/A";
      const make = serviceDetails.match(/Vehicle Make: (.+)/)?.[1]?.trim() || "N/A";
      const model = serviceDetails.match(/Vehicle Model: (.+)/)?.[1]?.trim() || "N/A";

      // Extract additional info
      const additionalInfo = serviceDetails.match(/Additional Info: (.+)/)?.[1]?.trim() || "None";

      // Extract and abbreviate selected services
      const servicesLine = serviceDetails.match(/Selected Services: (.+)/)?.[1];
      const abbreviatedServices = servicesLine
        ? servicesLine
            .split(", ")
            .map((service: string) => serviceAbbreviations[service.trim()] || service)
            .join(", ")
        : "None";

      const smsMessage = `
        New booking from ${name}.
        Phone: ${phone}
        Car: ${year} ${make} ${model}
        Services: ${abbreviatedServices}
        Other Info: ${additionalInfo}
      `.trim();

      // SMS notification
      const smsMailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.OWNER_PHONE_SMS_EMAIL,
        subject: "", // No subject for SMS
        text: smsMessage,
      };
      await transporter.sendMail(smsMailOptions);
    }

    // 3. Send a full email to the owner with booking details
    if (process.env.OWNER_EMAIL) {
      const ownerMailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.OWNER_EMAIL,
        subject: "New Job Inquiry - Booking Details",
        text: `New booking received:\n\nClient Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n${serviceDetails}\n\nPlease contact the client to confirm the appointment.`,
      };
      await transporter.sendMail(ownerMailOptions);
    } else {
      console.warn(
        "OWNER_EMAIL is not defined, skipping owner email notification"
      );
    }

    return NextResponse.json(
      { message: "Notifications sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
