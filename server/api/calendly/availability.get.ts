// GET /api/calendly/availability?type=repair&start=YYYY-MM-DD&end=YYYY-MM-DD
//
// Renvoie les disponibilités d'une offre, déjà nettoyées pour le frontend.
// Le token Calendly reste strictement côté serveur (voir server/utils/calendly.ts).
import type { AvailabilityResponse, BookingType } from '#shared/types/booking'
import { mockAvailableTimes } from '#shared/booking.mock'

const VALID_TYPES: BookingType[] = ['repair', 'workshop']
const DEFAULT_HORIZON_DAYS = 21
const CACHE_TTL_MS = 90_000 // 90 s : évite d'interroger Calendly à chaque interaction

// Durées de repli (mock dev) quand l'event type n'est pas interrogeable.
const MOCK_DURATION: Record<BookingType, number> = { repair: 15, workshop: 120 }
const MOCK_CAPACITY: Record<BookingType, number | null> = { repair: null, workshop: 8 }

export default defineEventHandler(async (event): Promise<AvailabilityResponse> => {
  const query = getQuery(event)
  const type = String(query.type ?? '') as BookingType

  if (!VALID_TYPES.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: 'Type de réservation invalide.' })
  }

  // Plage demandée (bornes de jour), avec défauts raisonnables.
  const now = new Date()
  const startDate = parseDate(query.start) ?? now
  const endDate =
    parseDate(query.end) ?? new Date(now.getTime() + DEFAULT_HORIZON_DAYS * 86_400_000)

  const startISO = new Date(Math.max(startDate.getTime(), now.getTime())).toISOString()
  const endISO = new Date(Math.max(endDate.getTime(), startDate.getTime())).toISOString()

  // --- Repli développement : pas de token → données fictives ------------------
  if (!isCalendlyConfigured(event)) {
    if (import.meta.dev) {
      const times = mockAvailableTimes(startISO, endISO, { groupCapacity: MOCK_CAPACITY[type] })
      return {
        type,
        timezone: 'Europe/Paris',
        range: { start: startISO, end: endISO },
        days: buildDays(times, MOCK_DURATION[type]),
      }
    }
    throw createError({ statusCode: 500, statusMessage: 'Service de réservation non configuré.' })
  }

  const uri = resolveEventTypeUri(event, type)

  const cacheKey = `avail:${type}:${startISO}:${endISO}`
  const days = await cached(cacheKey, CACHE_TTL_MS, async () => {
    const eventType = await getEventType(event, uri)
    const times = await getAvailableTimes(event, uri, startISO, endISO)
    return buildDays(times, eventType.duration)
  })

  return {
    type,
    timezone: 'Europe/Paris',
    range: { start: startISO, end: endISO },
    days,
  }
})

/** Parse une date de requête (YYYY-MM-DD ou ISO). Retourne null si invalide. */
function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value) return null
  const d = new Date(value.length <= 10 ? `${value}T00:00:00` : value)
  return Number.isNaN(d.getTime()) ? null : d
}
