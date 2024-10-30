// src/app/api/sendNotifications/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { clientName, clientPhone, clientEmail, serviceDetails } =
    await req.json();

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
      text: `Hello ${clientName},\n\nYour booking is confirmed!\n\nDetails:\n${serviceDetails}\n\nThank you!`,
    };
    await transporter.sendMail(clientMailOptions);

    // 2. Send SMS to the owner via email-to-SMS gateway
    const smsMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.OWNER_PHONE_SMS_EMAIL, // Replace with your carrier's email-to-SMS gateway
      subject: "", // No subject for SMS
      text: `New booking from ${clientName}.\nPhone: ${clientPhone}\nDetails: ${serviceDetails}`,
    };
    await transporter.sendMail(smsMailOptions);

    // 3. Send a full email to the owner with booking details
    const ownerMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.OWNER_EMAIL, // Owner's actual email address
      subject: "New Job Inquiry - Booking Details",
      text: `New booking received:\n\nClient Name: ${clientName}\nPhone: ${clientPhone}\nEmail: ${clientEmail}\nDetails:\n${serviceDetails}\n\nPlease contact the client to confirm the appointment.`,
    };
    await transporter.sendMail(ownerMailOptions);

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
