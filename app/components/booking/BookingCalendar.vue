<script setup lang="ts">
// Calendrier mensuel maison, aux couleurs de L'Établi.
// Ne contient AUCUNE logique Calendly : il reçoit des jours déjà nettoyés.
import type { BookingDay } from '#shared/types/booking'

const props = defineProps<{
  days: BookingDay[]
  visibleMonth: { year: number; month: number }
  selectedDate: string | null
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'month-change', value: { year: number; month: number }): void
  (e: 'select', date: string): void
}>()

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const monthFmt = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const fullDateFmt = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long',
})

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function keyOf(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`
}

const availableDates = computed(
  () => new Set(props.days.filter((d) => d.available).map((d) => d.date)),
)

const monthLabel = computed(() => {
  const label = monthFmt.format(new Date(props.visibleMonth.year, props.visibleMonth.month, 1))
  return label.charAt(0).toUpperCase() + label.slice(1)
})

// Comparaison au mois courant pour interdire la navigation vers le passé.
const now = new Date()
const currentMonthIndex = now.getFullYear() * 12 + now.getMonth()
const visibleMonthIndex = computed(
  () => props.visibleMonth.year * 12 + props.visibleMonth.month,
)
const canGoPrev = computed(() => visibleMonthIndex.value > currentMonthIndex)

interface Cell {
  key: string
  day: number
  inMonth: boolean
  isPast: boolean
  isToday: boolean
  available: boolean
  selected: boolean
  label: string
}

const cells = computed<Cell[]>(() => {
  const { year, month } = props.visibleMonth
  const first = new Date(year, month, 1)
  // Décalage pour démarrer la grille un lundi (getDay : 0 = dimanche).
  const offset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)
  const todayKey = keyOf(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfToday = new Date(now.toDateString()).getTime()

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const key = keyOf(d.getFullYear(), d.getMonth(), d.getDate())
    const inMonth = d.getMonth() === month
    const isPast = d.getTime() < startOfToday
    const available = inMonth && !isPast && availableDates.value.has(key)
    return {
      key,
      day: d.getDate(),
      inMonth,
      isPast,
      isToday: key === todayKey,
      available,
      selected: key === props.selectedDate,
      label: `${fullDateFmt.format(d)}${available ? ', créneaux disponibles' : ', indisponible'}`,
    }
  })
})

function changeMonth(delta: number) {
  const d = new Date(props.visibleMonth.year, props.visibleMonth.month + delta, 1)
  emit('month-change', { year: d.getFullYear(), month: d.getMonth() })
}
</script>

<template>
  <div class="rounded-2xl bg-creme-50 p-5 ring-1 ring-charbon/10 sm:p-6">
    <!-- En-tête : navigation mois -->
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-charbon">{{ monthLabel }}</h3>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="grid size-9 place-items-center rounded-lg text-charbon transition-colors hover:bg-charbon/5 disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="!canGoPrev"
          aria-label="Mois précédent"
          @click="changeMonth(-1)"
        >
          <TechIcon name="chevronDown" :size="20" class="rotate-90" />
        </button>
        <button
          type="button"
          class="grid size-9 place-items-center rounded-lg text-charbon transition-colors hover:bg-charbon/5"
          aria-label="Mois suivant"
          @click="changeMonth(1)"
        >
          <TechIcon name="chevronDown" :size="20" class="-rotate-90" />
        </button>
      </div>
    </div>

    <!-- En-têtes de jours -->
    <div class="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-charbon/50">
      <span v-for="wd in WEEKDAYS" :key="wd" aria-hidden="true">{{ wd }}</span>
    </div>

    <!-- État d'erreur -->
    <p v-if="error" class="mt-6 rounded-xl bg-terracotta/10 p-4 text-center text-sm text-terracotta-700">
      {{ error }}
    </p>

    <!-- Squelette de chargement -->
    <div v-else-if="loading && !days.length" class="mt-2 grid grid-cols-7 gap-1" aria-hidden="true">
      <div v-for="i in 35" :key="i" class="aspect-square animate-pulse rounded-lg bg-charbon/5" />
    </div>

    <!-- Grille -->
    <div v-else class="mt-2 grid grid-cols-7 gap-1" role="grid" aria-label="Jours disponibles">
      <div v-for="cell in cells" :key="cell.key" role="gridcell" class="aspect-square">
        <button
          v-if="cell.inMonth"
          type="button"
          class="relative grid size-full place-items-center rounded-lg text-sm font-medium transition-colors"
          :class="[
            cell.selected
              ? 'bg-terracotta text-creme'
              : cell.available
                ? 'bg-terracotta/10 text-terracotta-700 hover:bg-terracotta/20'
                : 'text-charbon/25',
            cell.isToday && !cell.selected ? 'ring-1 ring-charbon/25' : '',
          ]"
          :disabled="!cell.available"
          :aria-label="cell.label"
          :aria-pressed="cell.selected"
          @click="emit('select', cell.key)"
        >
          {{ cell.day }}
          <span
            v-if="cell.available && !cell.selected"
            class="absolute bottom-1 size-1 rounded-full bg-terracotta"
            aria-hidden="true"
          />
        </button>
        <span v-else class="grid size-full place-items-center text-sm text-charbon/15">{{ cell.day }}</span>
      </div>
    </div>

    <p class="mt-4 flex items-center gap-2 text-xs text-charbon/55">
      <span class="inline-block size-2.5 rounded-full bg-terracotta/40" aria-hidden="true" />
      Jour avec créneaux disponibles
    </p>
  </div>
</template>
