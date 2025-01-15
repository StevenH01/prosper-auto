// src/app/api/sendNotifications/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { clientName, clientPhone, clientEmail, serviceDetails } =
    await req.json();

  // Validate required fields
  if (!clientName || !clientPhone || !clientEmail || !serviceDetails) {
    console.error("Missing required fields in the request body");
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

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
      to: clientEmail,
      subject: "Booking Confirmation",
      text: `Hello ${clientName},\n\nYour booking is confirmed!\n\n${serviceDetails}\n\nThank you!`,
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
        New booking from ${clientName}.
        Phone: ${clientPhone}
        Vehicle: ${year} ${make} ${model}
        Services: ${abbreviatedServices}
        Additional Info: ${additionalInfo}
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
        text: `New booking received:\n\nClient Name: ${clientName}\nPhone: ${clientPhone}\nEmail: ${clientEmail}\n${serviceDetails}\n\nPlease contact the client to confirm the appointment.`,
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
