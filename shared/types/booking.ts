// ------------------------------------------------------------------
//  Types de réservation — partagés entre le frontend (app/) et le
//  serveur (server/). Le frontend ne connaît que l'abstraction
//  `repair` / `workshop` ; les URI Calendly réelles restent côté serveur.
// ------------------------------------------------------------------

/** Offre de réservation, indépendante de la configuration Calendly. */
export type BookingType = 'repair' | 'workshop'

/** Un créneau proposé à l'utilisateur (données déjà nettoyées). */
export interface BookingSlot {
  /** Identifiant stable du créneau (= startAt ISO). */
  id: string
  /** Début, ISO 8601 (UTC). */
  startAt: string
  /** Fin calculée (start + durée de l'event type), ISO 8601 (UTC). */
  endAt: string
  /** Date locale (Europe/Paris), format YYYY-MM-DD. */
  date: string
  /** Heure locale (Europe/Paris), format HH:mm. */
  time: string
  /** Créneau réellement réservable. */
  available: boolean
  /**
   * Places restantes (événements de groupe / atelier).
   * `null` = donnée non pertinente (rendez-vous individuel comme la réparation).
   */
  spotsLeft: number | null
}

/** Un jour regroupant ses créneaux disponibles. */
export interface BookingDay {
  /** Date locale, format YYYY-MM-DD. */
  date: string
  /** Libellé lisible, ex. « Mardi 2 septembre ». */
  label: string
  /** Au moins un créneau disponible ce jour-là. */
  available: boolean
  slots: BookingSlot[]
}

/** Réponse de GET /api/calendly/availability. */
export interface AvailabilityResponse {
  type: BookingType
  /** Fuseau des libellés (toujours Europe/Paris ici). */
  timezone: string
  /** Bornes réellement interrogées (utile pour le cache frontend). */
  range: { start: string; end: string }
  /** Jours possédant au moins un créneau, triés chronologiquement. */
  days: BookingDay[]
}

/** Sélection courante de l'utilisateur. */
export interface BookingSelection {
  type: BookingType
  slotId: string
  startAt: string
  endAt: string
}

/** Coordonnées saisies dans le formulaire. */
export interface BookingContact {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  /** Description libre du problème (réparation). */
  problem?: string
}

/** Corps de POST /api/calendly/booking. */
export interface BookingRequest extends BookingContact {
  type: BookingType
  slotId: string
  startAt: string
}

/**
 * Résultat d'une tentative de réservation.
 *
 * NOTE PLAN CALENDLY : sur un compte **Free**, la création directe d'un
 * rendez-vous via API n'est pas possible (Scheduling API réservée aux plans
 * payants + OAuth). Le serveur renvoie donc `status: 'handoff'` avec une URL
 * Calendly pré-remplie sur le créneau exact, pour la confirmation finale.
 * Sur un plan payant, ce même endpoint pourra renvoyer `status: 'confirmed'`.
 */
export interface BookingResult {
  status: 'handoff' | 'confirmed' | 'slot_taken'
  selection?: BookingSelection
  /** URL Calendly pré-remplie du créneau (mode `handoff`). Non secrète. */
  bookingUrl?: string
  message?: string
}
