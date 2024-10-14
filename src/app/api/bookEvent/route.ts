// pages/api/bookEvent.ts
import { getGoogleCalendar, bookEvent } from "@/app/lib/googleCalender";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the session from the request
  const session = await getSession({ req });

  // Check if session exists and if accessToken is available
  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Get the calendar instance using the access token from the session
  const calendar = getGoogleCalendar(session.accessToken);
  const eventDetails = req.body; // Extract event details from the request body

  try {
    // Attempt to book the event
    const event = await bookEvent(calendar, eventDetails);

    // Respond with the booked event details
    res.status(200).json(event);
  } catch (error) {
    // Handle errors during the event booking process
    console.error("Error booking event:", error);
    res.status(500).json({ error: "Failed to book event" });
  }
}
