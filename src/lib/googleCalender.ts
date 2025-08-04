// lib/googleCalendar.ts
import { google } from "googleapis";

interface FreeSlot {
  start: string;
  end: string;
}

export const getGoogleCalendar = (token: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({ access_token: token });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  return calendar;
};

// Function to get free time slots
export const getAvailableTimeSlots = async (
  calendar: any,
  timeMin: string,
  timeMax: string
) => {
  const events = await calendar.events.list({
    calendarId: "primary", // The client's calendar ID
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  });

  const freeSlots: FreeSlot[] = []; // Parse available time slots based on busy/free data
  events.data.items.forEach((event: any) => {
    freeSlots.push({
      start: event.start.dateTime,
      end: event.end.dateTime,
    });
  });

  return freeSlots;
};

// Function to book an event
export const bookEvent = async (calendar: any, eventDetails: any) => {
  const event = await calendar.events.insert({
    calendarId: "primary",
    resource: eventDetails,
  });
  return event;
};
