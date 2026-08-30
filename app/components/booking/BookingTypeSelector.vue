<script setup lang="ts">
// Choix de l'offre. Couche d'abstraction : le frontend ne manipule que
// 'repair' / 'workshop', jamais les identifiants Calendly.
// L'atelier participatif est prévu mais pas encore activé (enabled: false).
import type { BookingType } from '#shared/types/booking'

const model = defineModel<BookingType>({ required: true })

interface Offer {
  type: BookingType
  label: string
  hint: string
  icon: string
  enabled: boolean
}

const offers: Offer[] = [
  { type: 'repair', label: 'Réparation confiée', hint: 'Vous déposez, on répare', icon: 'wrench', enabled: true },
  { type: 'workshop', label: 'Atelier participatif', hint: 'Bientôt disponible', icon: 'users', enabled: false },
]

function choose(offer: Offer) {
  if (offer.enabled) model.value = offer.type
}
</script>

<template>
  <div role="radiogroup" aria-label="Type de réservation" class="grid gap-3 sm:grid-cols-2">
    <button
      v-for="offer in offers"
      :key="offer.type"
      type="button"
      role="radio"
      :aria-checked="model === offer.type"
      :disabled="!offer.enabled"
      class="flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors"
      :class="[
        model === offer.type && offer.enabled
          ? 'border-terracotta bg-terracotta/5'
          : offer.enabled
            ? 'border-charbon/15 bg-creme-50 hover:border-terracotta/60'
            : 'cursor-not-allowed border-dashed border-charbon/15 bg-charbon/[0.02] opacity-70',
      ]"
      @click="choose(offer)"
    >
      <span
        class="grid size-11 shrink-0 place-items-center rounded-xl"
        :class="model === offer.type && offer.enabled ? 'bg-terracotta text-creme' : 'bg-terracotta/10 text-terracotta'"
      >
        <TechIcon :name="offer.icon" :size="24" />
      </span>
      <span class="min-w-0">
        <span class="block font-semibold text-charbon">{{ offer.label }}</span>
        <span class="block text-sm text-charbon/60">{{ offer.hint }}</span>
      </span>
    </button>
  </div>
</template>
