'use client'

import { useEffect, useState } from 'react'
import { getAvailability } from '@/lib/getAvailability'

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<{ start: Date; end: Date }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true)

      // Hardcoded owner ID for now — replace with your real UUID from Supabase
      const ownerId = '00000000-0000-0000-0000-000000000000'

      const available = await getAvailability(ownerId, [])
      setSlots(available)
      setLoading(false)
    }

    fetchAvailability()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Available Time Slots</h1>

      {loading ? (
        <p>Loading...</p>
      ) : slots.length === 0 ? (
        <p>No available slots found.</p>
      ) : (
        <ul className="space-y-2">
          {slots.map((slot, idx) => (
            <li key={idx} className="border p-3 rounded">
              {slot.start.toLocaleString()} → {slot.end.toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
