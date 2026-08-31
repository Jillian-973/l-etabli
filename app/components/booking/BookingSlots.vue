<script setup lang="ts">
// Créneaux du jour sélectionné. Reçoit un jour déjà nettoyé.
import type { BookingDay, BookingSlot, BookingType } from '#shared/types/booking'

const props = defineProps<{
  type: BookingType
  day: BookingDay | null
  selectedSlot: BookingSlot | null
  loading?: boolean
}>()

const emit = defineEmits<{ (e: 'select', slot: BookingSlot): void }>()

const hasSlots = computed(() => (props.day?.slots.length ?? 0) > 0)

/** Libellé des places (atelier de groupe uniquement, et seulement si connu). */
function spotsLabel(slot: BookingSlot): string | null {
  if (props.type !== 'workshop' || slot.spotsLeft == null) return null
  if (slot.spotsLeft <= 0) return 'Complet'
  return `${slot.spotsLeft} place${slot.spotsLeft > 1 ? 's' : ''}`
}
</script>

<template>
  <div class="rounded-2xl bg-creme-50 p-5 ring-1 ring-charbon/10 sm:p-6">
    <h3 class="text-base font-bold text-charbon">Créneaux</h3>
    <p v-if="day" class="mt-0.5 text-sm text-charbon/60">{{ day.label }}</p>

    <!-- Aucun jour choisi -->
    <div
      v-if="!day"
      class="mt-4 grid place-items-center rounded-xl border border-dashed border-charbon/20 p-8 text-center"
    >
      <TechIcon name="calendar" :size="26" class="text-charbon/30" />
      <p class="mt-2 text-sm text-charbon/60">
        Choisissez d'abord un jour dans le calendrier.
      </p>
    </div>

    <!-- Jour sans créneau -->
    <div
      v-else-if="!hasSlots"
      class="mt-4 grid place-items-center rounded-xl border border-dashed border-charbon/20 p-8 text-center"
    >
      <TechIcon name="clock" :size="26" class="text-charbon/30" />
      <p class="mt-2 text-sm text-charbon/60">
        Aucun créneau disponible pour cette journée.
      </p>
    </div>

    <!-- Liste des créneaux -->
    <ul v-else class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      <li v-for="slot in day.slots" :key="slot.id">
        <button
          type="button"
          class="flex w-full flex-col items-center rounded-xl border px-2 py-3 text-center transition-colors"
          :class="[
            selectedSlot?.id === slot.id
              ? 'border-terracotta bg-terracotta text-creme'
              : slot.available
                ? 'border-charbon/15 bg-creme text-charbon hover:border-terracotta hover:bg-terracotta/5'
                : 'cursor-not-allowed border-charbon/10 bg-charbon/[0.03] text-charbon/35',
          ]"
          :disabled="!slot.available"
          :aria-pressed="selectedSlot?.id === slot.id"
          :aria-label="`Créneau de ${slot.time}${spotsLabel(slot) ? ', ' + spotsLabel(slot) : ''}`"
          @click="emit('select', slot)"
        >
          <span class="text-base font-semibold tabular-nums">{{ slot.time }}</span>
          <span
            v-if="spotsLabel(slot)"
            class="mt-0.5 text-xs"
            :class="selectedSlot?.id === slot.id ? 'text-creme/80' : 'text-charbon/55'"
          >
            {{ spotsLabel(slot) }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
