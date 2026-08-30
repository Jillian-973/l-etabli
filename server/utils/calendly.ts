// ------------------------------------------------------------------
//  Client Calendly centralisé (côté serveur uniquement).
//  Seul endroit qui connaît le token et l'authentification Calendly.
//  Les endpoints (availability, booking) s'appuient dessus et ne
//  manipulent jamais directement le token.
// ------------------------------------------------------------------
import type { H3Event } from 'h3'
import type { BookingType, BookingDay, BookingSlot, BookingContact } from '#shared/types/booking'
import type { CalendlyAvailableTime } from '#shared/booking.mock'

const CALENDLY_API = 'https://api.calendly.com'
const TZ = 'Europe/Paris'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const MAX_WINDOWS = 6 // garde-fou : au plus 6 fenêtres de 7 jours par requête

// --- Configuration -----------------------------------------------------------

export interface CalendlyConfig {
  token: string
  eventTypeUris: Record<BookingType, string>
}

export function getCalendlyConfig(event: H3Event): CalendlyConfig {
  const c = useRuntimeConfig(event)
  return {
    token: (c.calendlyAccessToken as string) || '',
    eventTypeUris: {
      repair: (c.calendlyRepairEventTypeUri as string) || '',
      workshop: (c.calendlyWorkshopEventTypeUri as string) || '',
    },
  }
}

export function isCalendlyConfigured(event: H3Event): boolean {
  return Boolean(getCalendlyConfig(event).token)
}

/**
 * Résout l'URI Calendly d'une offre, ou lève une erreur claire.
 * L'atelier non configuré renvoie 501 (prévu, pas encore activé).
 */
export function resolveEventTypeUri(event: H3Event, type: BookingType): string {
  const uri = getCalendlyConfig(event).eventTypeUris[type]
  if (!uri) {
    throw createError({
      statusCode: type === 'workshop' ? 501 : 500,
      statusMessage:
        type === 'workshop'
          ? "La réservation d'atelier participatif n'est pas encore disponible."
          : 'Configuration Calendly manquante pour la réparation.',
    })
  }
  return uri
}

// --- Appels bas niveau -------------------------------------------------------

/** Appel authentifié à l'API Calendly. N'expose jamais le token ni le détail brut au client. */
export async function calendlyFetch<T>(
  event: H3Event,
  path: string,
  opts: Parameters<typeof $fetch>[1] = {},
): Promise<T> {
  const { token } = getCalendlyConfig(event)
  if (!token) throw createError({ statusCode: 500, statusMessage: 'Service de réservation non configuré.' })

  const url = path.startsWith('http') ? path : `${CALENDLY_API}${path}`
  try {
    return await $fetch<T>(url, {
      ...opts,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(opts.headers as Record<string, string> | undefined),
      },
    })
  } catch (err) {
    const status = (err as { response?: { status?: number }; statusCode?: number })?.response?.status
      ?? (err as { statusCode?: number })?.statusCode
      ?? 502
    // Journalisation serveur minimale, sans jamais divulguer le token.
    console.warn(`[calendly] échec ${opts.method ?? 'GET'} ${path} → HTTP ${status}`)
    // 401/403 = problème de token/plan : on renvoie une erreur générique au client.
    throw createError({
      statusCode: status === 401 || status === 403 ? 502 : status,
      statusMessage: 'Le service de réservation est momentanément indisponible.',
    })
  }
}

// --- Event types -------------------------------------------------------------

interface CalendlyEventTypeResource {
  name: string
  duration: number
  scheduling_url: string
  type: string
  pooling_type: string | null
  active: boolean
}

/** Récupère les métadonnées d'un event type (durée, nom, type de groupe…). */
export async function getEventType(event: H3Event, uri: string): Promise<CalendlyEventTypeResource> {
  const uuid = uri.split('/').pop()
  const data = await calendlyFetch<{ resource: CalendlyEventTypeResource }>(event, `/event_types/${uuid}`)
  return data.resource
}

// --- Disponibilités ----------------------------------------------------------

/**
 * Récupère les créneaux disponibles entre deux instants, en découpant
 * automatiquement en fenêtres de 7 jours (limite de l'API Calendly) et
 * en excluant le passé (start_time doit être dans le futur).
 */
export async function getAvailableTimes(
  event: H3Event,
  uri: string,
  startISO: string,
  endISO: string,
): Promise<CalendlyAvailableTime[]> {
  let cursor = Math.max(new Date(startISO).getTime(), Date.now() + 60_000)
  const hardEnd = new Date(endISO).getTime()
  const all: CalendlyAvailableTime[] = []
  let windows = 0

  while (cursor < hardEnd && windows < MAX_WINDOWS) {
    const wEnd = Math.min(cursor + WEEK_MS - 60_000, hardEnd)
    const qs = new URLSearchParams({
      event_type: uri,
      start_time: new Date(cursor).toISOString(),
      end_time: new Date(wEnd).toISOString(),
    })
    const res = await calendlyFetch<{ collection: CalendlyAvailableTime[] }>(
      event,
      `/event_type_available_times?${qs.toString()}`,
    )
    all.push(...(res.collection ?? []))
    cursor = wEnd + 60_000
    windows++
  }
  return all
}

/** Vérifie qu'un créneau précis est TOUJOURS disponible (anti double-réservation). */
export async function findAvailableSlot(
  event: H3Event,
  uri: string,
  startAtISO: string,
): Promise<CalendlyAvailableTime | null> {
  const start = new Date(startAtISO).getTime()
  if (!Number.isFinite(start) || start <= Date.now()) return null
  const winStart = Math.max(start - 60_000, Date.now() + 30_000)
  const winEnd = Math.min(start + 24 * 60 * 60 * 1000, start + WEEK_MS - 60_000)
  const qs = new URLSearchParams({
    event_type: uri,
    start_time: new Date(winStart).toISOString(),
    end_time: new Date(winEnd).toISOString(),
  })
  const res = await calendlyFetch<{ collection: CalendlyAvailableTime[] }>(
    event,
    `/event_type_available_times?${qs.toString()}`,
  )
  return (
    (res.collection ?? []).find(
      (s) =>
        new Date(s.start_time).getTime() === start &&
        s.status === 'available' &&
        (s.invitees_remaining ?? 1) > 0,
    ) ?? null
  )
}

// --- Transformation vers nos types -------------------------------------------

const dayKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
})
const dayLabelFmt = new Intl.DateTimeFormat('fr-FR', {
  timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long',
})
const timeFmt = new Intl.DateTimeFormat('fr-FR', {
  timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false,
})

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/** Regroupe des créneaux Calendly bruts en jours prêts pour le frontend. */
export function buildDays(times: CalendlyAvailableTime[], durationMin: number): BookingDay[] {
  const byDate = new Map<string, BookingDay>()

  for (const t of [...times].sort((a, b) => a.start_time.localeCompare(b.start_time))) {
    const start = new Date(t.start_time)
    if (Number.isNaN(start.getTime())) continue
    const date = dayKeyFmt.format(start)
    const remaining = typeof t.invitees_remaining === 'number' ? t.invitees_remaining : null
    const available = t.status === 'available' && (remaining == null || remaining > 0)

    const slot: BookingSlot = {
      id: t.start_time,
      startAt: start.toISOString(),
      endAt: new Date(start.getTime() + durationMin * 60_000).toISOString(),
      date,
      time: timeFmt.format(start),
      available,
      spotsLeft: remaining,
    }

    let day = byDate.get(date)
    if (!day) {
      day = { date, label: capitalize(dayLabelFmt.format(start)), available: false, slots: [] }
      byDate.set(date, day)
    }
    day.slots.push(slot)
    if (available) day.available = true
  }

  return [...byDate.values()]
}

// --- Confirmation (handoff plan Free) ----------------------------------------

/**
 * Construit l'URL Calendly du créneau exact, pré-remplie avec les
 * coordonnées de l'utilisateur. Les URL de scheduling ne sont pas secrètes.
 */
export function buildPrefilledUrl(schedulingUrl: string, contact: BookingContact): string {
  const url = new URL(schedulingUrl)
  const name = [contact.firstName, contact.lastName].filter(Boolean).join(' ').trim()
  if (name) url.searchParams.set('name', name)
  if (contact.email) url.searchParams.set('email', contact.email)
  if (contact.problem) url.searchParams.set('a1', contact.problem)
  return url.toString()
}

// --- Cache mémoire simple (perf : évite d'appeler Calendly à chaque interaction) ---

const cache = new Map<string, { at: number; data: unknown }>()

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < ttlMs) return hit.data as T
  const data = await fn()
  cache.set(key, { at: Date.now(), data })
  if (cache.size > 200) {
    const oldest = cache.keys().next().value
    if (oldest) cache.delete(oldest)
  }
  return data
}
