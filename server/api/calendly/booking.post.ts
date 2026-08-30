// POST /api/calendly/booking
//
// Prépare la réservation d'un créneau. Ne fait JAMAIS confiance au navigateur :
// tout est revalidé ici, et la disponibilité est reconfirmée auprès de Calendly
// juste avant de rendre la main (anti double-réservation).
//
// ⚠️ LIMITE PLAN CALENDLY (Free) : la création directe d'un rendez-vous via API
// (Scheduling API / Create Event Invitee) nécessite un plan PAYANT + une app
// OAuth. Sur le compte Free actuel, on renvoie donc `status: 'handoff'` avec une
// URL Calendly pré-remplie sur le créneau exact, pour la confirmation finale.
// Sur un plan payant, il suffira de remplacer ce bloc par l'appel de création
// et de renvoyer `status: 'confirmed'` — le reste (front + types) est déjà prêt.
import type { BookingRequest, BookingResult, BookingType } from '#shared/types/booking'
import { mockAvailableTimes } from '#shared/booking.mock'

const VALID_TYPES: BookingType[] = ['repair', 'workshop']
const EMAIL_RE = /.+@.+\..+/
const MOCK_DURATION: Record<BookingType, number> = { repair: 15, workshop: 120 }

export default defineEventHandler(async (event): Promise<BookingResult> => {
  const body = await readBody<Partial<BookingRequest>>(event)

  // --- Validation serveur ----------------------------------------------------
  const type = String(body?.type ?? '') as BookingType
  if (!VALID_TYPES.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: 'Type de réservation invalide.' })
  }

  const startAt = String(body?.startAt ?? '')
  const startMs = new Date(startAt).getTime()
  if (!Number.isFinite(startMs)) {
    throw createError({ statusCode: 400, statusMessage: 'Créneau invalide.' })
  }
  if (startMs <= Date.now()) {
    return { status: 'slot_taken', message: "Ce créneau n'est plus disponible." }
  }

  const firstName = clean(body?.firstName, 100)
  const lastName = clean(body?.lastName, 100)
  const email = clean(body?.email, 200)
  const phone = clean(body?.phone, 40)
  const problem = clean(body?.problem, 1000)

  if (!firstName) {
    throw createError({ statusCode: 422, statusMessage: 'Le prénom est requis.' })
  }
  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 422, statusMessage: 'Un e-mail valide est requis pour la confirmation.' })
  }

  const contact = { firstName, lastName, email, phone, problem }
  const durationForEnd = MOCK_DURATION[type]
  const endAt = new Date(startMs + durationForEnd * 60_000).toISOString()

  // --- Repli développement : pas de token → handoff simulé -------------------
  if (!isCalendlyConfigured(event)) {
    if (import.meta.dev) {
      const stillThere = mockAvailableTimes(startAt, endAt).some(
        (s) => new Date(s.start_time).getTime() === startMs,
      )
      if (!stillThere) return { status: 'slot_taken', message: "Ce créneau n'est plus disponible." }
      return {
        status: 'handoff',
        selection: { type, slotId: startAt, startAt, endAt },
        bookingUrl: buildPrefilledUrl('https://calendly.com/exemple-mock/reparation-confiee', contact),
      }
    }
    throw createError({ statusCode: 500, statusMessage: 'Service de réservation non configuré.' })
  }

  const uri = resolveEventTypeUri(event, type)

  // --- Re-vérification de la disponibilité (anti double-réservation) ----------
  const slot = await findAvailableSlot(event, uri, startAt)
  if (!slot) {
    // 409 : le créneau a été pris entre l'affichage et la validation.
    setResponseStatus(event, 409)
    return { status: 'slot_taken', message: "Ce créneau vient d'être réservé. Choisissez-en un autre." }
  }

  // Durée réelle de l'event type pour un endAt exact.
  const eventType = await getEventType(event, uri)
  const realEnd = new Date(startMs + eventType.duration * 60_000).toISOString()

  // URL du créneau exact ; repli sur l'URL de l'event type si absente.
  const schedulingUrl = slot.scheduling_url || eventType.scheduling_url

  // --- Handoff : URL Calendly du créneau exact, pré-remplie ------------------
  return {
    status: 'handoff',
    selection: { type, slotId: startAt, startAt, endAt: realEnd },
    bookingUrl: buildPrefilledUrl(schedulingUrl, contact),
    message: 'Dernière étape : confirmez votre créneau sur la page sécurisée de réservation.',
  }
})

/** Nettoie une entrée texte : trim + coupe à maxLen. */
function clean(value: unknown, maxLen: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLen) : ''
}
