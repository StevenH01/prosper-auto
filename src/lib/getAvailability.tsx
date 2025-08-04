import { supabase } from './supabase'

type CalendarEvent = { start: string; end: string }
type Slot = { start: Date; end: Date }

export async function getAvailability(
  ownerId: string,
  calendarEvents: CalendarEvent[] = []
): Promise<Slot[]> {
  const now = new Date()
  const daysToCheck = 7
  const workingHours = { start: 9, end: 17 } // 9 AM to 5 PM
  const availableSlots: Slot[] = []

  for (let day = 0; day < daysToCheck; day++) {
    const date = new Date()
    date.setDate(now.getDate() + day)

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const slotStart = new Date(date)
      slotStart.setHours(hour, 0, 0, 0)

      const slotEnd = new Date(slotStart)
      slotEnd.setHours(slotEnd.getHours() + 1)

      availableSlots.push({ start: slotStart, end: slotEnd })
    }
  }

  // Supabase: appointments
  const { data: appointmentsRaw } = await supabase
    .from('appointments')
    .select('start_time, end_time')
    .eq('owner_id', ownerId)
    .eq('status', 'booked')

  const appointments = appointmentsRaw ?? []

  // Supabase: blocked times
  const { data: blocksRaw } = await supabase
    .from('blocked_times')
    .select('start_time, end_time')
    .eq('owner_id', ownerId)

  const blocks = blocksRaw ?? []

  // Normalize all busy periods to common format
  const busyTimes: Slot[] = [
    ...appointments.map(a => ({
      start: new Date(a.start_time),
      end: new Date(a.end_time)
    })),
    ...blocks.map(b => ({
      start: new Date(b.start_time),
      end: new Date(b.end_time)
    })),
    ...calendarEvents.map(e => ({
      start: new Date(e.start),
      end: new Date(e.end)
    }))
  ]

  // Filter out slots that overlap with any busy time
  const filtered = availableSlots.filter(slot => {
    return !busyTimes.some(busy =>
      slot.start < busy.end && slot.end > busy.start
    )
  })

  return filtered
}
