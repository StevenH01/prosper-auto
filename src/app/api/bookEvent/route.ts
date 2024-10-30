// src/app/api/bookEvent/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const eventDetails = await req.json();
    // Here, add your logic to handle the booking, such as storing event details in a database.
    // For example, you could send this to a calendar API or database:
    console.log("Booking event details:", eventDetails);

    // Assuming the booking was successful, return a success response
    return NextResponse.json(
      { message: "Event booked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error booking the event:", error);
    return NextResponse.json(
      { error: "Failed to book event" },
      { status: 500 }
    );
  }
}
