// src/app/api/getAvailableSlots/route.ts
import { NextResponse } from "next/server";
import {
  getGoogleCalendar,
  getAvailableTimeSlots,
} from "../../lib/googleCalender";
import { getServerSession } from "next-auth/next"; // Change this import
import { authOptions } from "../../lib/auth"; // Ensure you have auth options defined

export async function GET(req: Request) {
  const session = await getServerSession(authOptions); // Get session directly

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const timeMin = searchParams.get("timeMin");
  const timeMax = searchParams.get("timeMax");

  // Check if timeMin and timeMax are valid strings
  if (!timeMin || !timeMax) {
    return NextResponse.json(
      { error: "Missing timeMin or timeMax" },
      { status: 400 }
    );
  }

  const calendar = getGoogleCalendar(session.accessToken);
  const slots = await getAvailableTimeSlots(calendar, timeMin, timeMax);
  return NextResponse.json(slots);
}
