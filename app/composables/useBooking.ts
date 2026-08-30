// ------------------------------------------------------------------
//  useBooking — logique de réservation côté frontend.
//  Expose un état réactif simple aux composants. Ne connaît jamais
//  Calendly directement : tout passe par /api/calendly/*.
// ------------------------------------------------------------------
import type {
  AvailabilityResponse,
  BookingContact,
  BookingResult,
  BookingSlot,
  BookingType,
} from '#shared/types/booking'

export type BookingStep = 'select' | 'form' | 'summary' | 'done'

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useBooking(initialType: BookingType = 'repair') {
  const toast = useToast()

  const bookingType = ref<BookingType>(initialType)
  const timezone = ref('Europe/Paris')

  // Jours indexés par date (fusion des mois chargés).
  const daysMap = ref(new Map<string, AvailabilityResponse['days'][number]>())
  const days = computed(() =>
    [...daysMap.value.values()].sort((a, b) => a.date.localeCompare(b.date)),
  )
  const availableDates = computed(
    () => new Set(days.value.filter((d) => d.available).map((d) => d.date)),
  )

  const loading = ref(false)
  const error = ref<string | null>(null)
  const loadedRanges = new Set<string>() // cache : évite de recharger un mois déjà chargé

  const now = new Date()
  const visibleMonth = ref({ year: now.getFullYear(), month: now.getMonth() }) // month : 0-11

  const selectedDate = ref<string | null>(null)
  const selectedSlot = ref<BookingSlot | null>(null)
  const selectedDay = computed(() => days.value.find((d) => d.date === selectedDate.value) ?? null)

  const step = ref<BookingStep>('select')
  const contact = reactive<BookingContact>({
    firstName: '', lastName: '', email: '', phone: '', problem: '',
  })

  const submitting = ref(false)
  const result = ref<BookingResult | null>(null)

  function monthRange(year: number, month: number) {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const start = new Date(Math.max(first.getTime(), Date.now()))
    return { start: toDateStr(start), end: toDateStr(last) }
  }

  async function loadRange(start: string, end: string) {
    const key = `${bookingType.value}:${start}:${end}`
    if (loadedRanges.has(key)) return
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<AvailabilityResponse>('/api/calendly/availability', {
        query: { type: bookingType.value, start, end },
      })
      timezone.value = res.timezone
      const next = new Map(daysMap.value)
      for (const d of res.days) next.set(d.date, d)
      daysMap.value = next
      loadedRanges.add(key)
    } catch (e) {
      error.value = readError(e, 'Impossible de récupérer les disponibilités. Veuillez réessayer.')
    } finally {
      loading.value = false
    }
  }

  /** Charge un mois (ignore les mois entièrement passés). */
  async function loadMonth(year: number, month: number) {
    const lastOfMonth = new Date(year, month + 1, 0)
    const startOfToday = new Date(new Date().toDateString())
    if (lastOfMonth < startOfToday) return
    const { start, end } = monthRange(year, month)
    await loadRange(start, end)
  }

  function setMonth(year: number, month: number) {
    visibleMonth.value = { year, month }
  }

  watch(visibleMonth, ({ year, month }) => loadMonth(year, month))
  onMounted(() => loadMonth(visibleMonth.value.year, visibleMonth.value.month))

  function selectDay(date: string) {
    const day = days.value.find((d) => d.date === date)
    if (!day?.available) return
    selectedDate.value = date
    selectedSlot.value = null
  }

  function selectSlot(slot: BookingSlot) {
    if (slot.available) selectedSlot.value = slot
  }

  function goToForm() {
    if (selectedSlot.value) step.value = 'form'
  }
  function goToSummary() {
    step.value = 'summary'
  }
  function backTo(s: BookingStep) {
    step.value = s
  }

  function invalidateAndReload() {
    loadedRanges.clear()
    daysMap.value = new Map()
    loadMonth(visibleMonth.value.year, visibleMonth.value.month)
  }

  function handleSlotTaken() {
    toast.add({
      title: 'Créneau indisponible',
      description: "Ce créneau vient d'être réservé. Choisissez-en un autre.",
      color: 'error',
    })
    selectedSlot.value = null
    step.value = 'select'
    invalidateAndReload()
  }

  async function submit() {
    if (!selectedSlot.value) return
    submitting.value = true
    try {
      const res = await $fetch<BookingResult>('/api/calendly/booking', {
        method: 'POST',
        body: {
          type: bookingType.value,
          slotId: selectedSlot.value.id,
          startAt: selectedSlot.value.startAt,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          problem: contact.problem,
        },
      })
      if (res.status === 'slot_taken') {
        handleSlotTaken()
        return
      }
      result.value = res
      step.value = 'done'
    } catch (e) {
      const status = errStatus(e)
      const data = errData(e)
      if (status === 409 || data?.status === 'slot_taken') {
        handleSlotTaken()
        return
      }
      toast.add({
        title: 'Réservation impossible',
        description: readError(e, 'Veuillez réessayer, ou contactez-nous par téléphone.'),
        color: 'error',
      })
    } finally {
      submitting.value = false
    }
  }

  function reset() {
    selectedDate.value = null
    selectedSlot.value = null
    result.value = null
    step.value = 'select'
    Object.assign(contact, { firstName: '', lastName: '', email: '', phone: '', problem: '' })
  }

  return {
    bookingType,
    timezone,
    days,
    availableDates,
    loading,
    error,
    visibleMonth,
    selectedDate,
    selectedDay,
    selectedSlot,
    step,
    contact,
    submitting,
    result,
    loadMonth,
    setMonth,
    selectDay,
    selectSlot,
    goToForm,
    goToSummary,
    backTo,
    submit,
    reset,
  }
}

// --- Helpers d'erreur $fetch -------------------------------------------------

function errStatus(e: unknown): number | undefined {
  return (e as { status?: number; statusCode?: number })?.status
    ?? (e as { statusCode?: number })?.statusCode
}
function errData(e: unknown): { status?: string; statusMessage?: string; message?: string } | undefined {
  return (e as { data?: { status?: string; statusMessage?: string; message?: string } })?.data
}
function readError(e: unknown, fallback: string): string {
  const d = errData(e)
  return d?.statusMessage || d?.message || (e as { statusMessage?: string })?.statusMessage || fallback
}
