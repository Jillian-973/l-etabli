import type { WorkshopSession } from '~/utils/content'

// Planning récurrent : 2 ateliers par semaine (capacité imposée).
//  - Jeudi 18h–20h  · niveau débutant
//  - Samedi 10h–12h · tous niveaux
const SCHEDULE = [
  { weekday: 4, timeRange: '18h00 – 20h00', level: 'Débutant', theme: 'Atelier participatif' },
  { weekday: 6, timeRange: '10h00 – 12h00', level: 'Tous niveaux', theme: 'Atelier participatif' },
] as const

// Occupation représentative et stable (pas de faux temps réel, pas d'urgence).
const SEATS_LEFT_PATTERN = [6, 4, 7, 3, 8, 5]

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatDateLabel(date: Date): string {
  const label = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  return capitalize(label)
}

function buildSessions(count: number): WorkshopSession[] {
  const sessions: WorkshopSession[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  let guard = 0
  while (sessions.length < count && guard < 60) {
    for (const slot of SCHEDULE) {
      if (cursor.getDay() === slot.weekday) {
        const index = sessions.length
        sessions.push({
          id: `${cursor.toISOString().slice(0, 10)}-${slot.weekday}`,
          dateLabel: formatDateLabel(cursor),
          isoDate: cursor.toISOString().slice(0, 10),
          timeRange: slot.timeRange,
          theme: slot.theme,
          level: slot.level,
          spotsTotal: 8,
          spotsLeft: SEATS_LEFT_PATTERN[index % SEATS_LEFT_PATTERN.length]!,
        })
      }
    }
    cursor.setDate(cursor.getDate() + 1)
    guard++
  }

  return sessions
}

/**
 * Prochaines sessions d'atelier participatif.
 * Calculées une fois côté serveur puis partagées au client (pas de mismatch
 * d'hydratation, dates toujours à venir plutôt que codées en dur).
 */
export function useUpcomingSessions(count = 4) {
  return useState<WorkshopSession[]>('upcoming-sessions', () => buildSessions(count))
}
