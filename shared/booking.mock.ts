// ------------------------------------------------------------------
//  Données de disponibilités FICTIVES (développement uniquement).
//  Elles imitent la forme brute renvoyée par l'endpoint Calendly
//  `event_type_available_times`, afin que la même transformation
//  serveur s'applique aux données mockées comme aux données réelles.
//
//  Utilisées seulement en dev quand le token Calendly n'est pas
//  configuré (voir server/api/calendly/availability.get.ts).
// ------------------------------------------------------------------

/** Forme (partielle) d'un créneau Calendly, commune au réel et au mock. */
export interface CalendlyAvailableTime {
  status: string
  start_time: string
  invitees_remaining?: number
  scheduling_url: string
}

/**
 * Génère des créneaux fictifs entre deux instants ISO.
 * Ouvre mardi→samedi, aux heures d'atelier, en excluant le passé.
 */
export function mockAvailableTimes(
  startISO: string,
  endISO: string,
  { groupCapacity = null as number | null } = {},
): CalendlyAvailableTime[] {
  const start = new Date(startISO)
  const end = new Date(endISO)
  const now = Date.now()

  // Heures d'ouverture exprimées en UTC (Paris = UTC+2 en été) → 9h/10h30/14h/15h30.
  const hoursUtc = [
    [7, 0],
    [8, 30],
    [12, 0],
    [13, 30],
  ]

  const out: CalendlyAvailableTime[] = []
  const day = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()))

  while (day <= end) {
    const weekday = day.getUTCDay() // 0 = dimanche, 1 = lundi
    const isOpen = weekday >= 2 && weekday <= 6 // mardi → samedi
    if (isOpen) {
      for (const [h, m] of hoursUtc) {
        const slot = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h, m))
        const t = slot.getTime()
        if (t <= now || slot < start || slot > end) continue
        // Quelques créneaux « complets » pour tester l'état indisponible.
        const remaining = groupCapacity == null ? 1 : ((t / 36e5) % 4 === 0 ? 0 : Math.max(1, Math.floor((t / 36e5) % (groupCapacity + 1))))
        out.push({
          status: remaining > 0 ? 'available' : 'unavailable',
          start_time: slot.toISOString(),
          invitees_remaining: remaining,
          scheduling_url: 'https://calendly.com/exemple-mock/reparation-confiee',
        })
      }
    }
    day.setUTCDate(day.getUTCDate() + 1)
  }
  return out
}
