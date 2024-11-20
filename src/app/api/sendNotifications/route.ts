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
    console.log("Client confirmation email sent successfully");

    // 2. Send SMS to the owner via email-to-SMS gateway
    if (process.env.OWNER_PHONE_SMS_EMAIL) {
      const smsMailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.OWNER_PHONE_SMS_EMAIL,
        subject: "", // No subject for SMS
        text: `New booking from ${clientName}.\nPhone: ${clientPhone}\n${serviceDetails}`,
      };
      await transporter.sendMail(smsMailOptions);
      console.log("SMS notification sent successfully to the owner");
    } else {
      console.warn(
        "OWNER_PHONE_SMS_EMAIL is not defined, skipping SMS notification"
      );
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
      console.log("Owner notification email sent successfully");
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
