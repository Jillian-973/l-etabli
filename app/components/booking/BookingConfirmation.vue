<script setup lang="ts">
// Écran final, aux couleurs du site (pas de redirection automatique, pas d'iframe).
//
// Deux cas :
//  • 'handoff'   → plan Calendly Free : dernière étape sur la page sécurisée
//                  Calendly (créneau + coordonnées déjà pré-remplis).
//  • 'confirmed' → prévu pour un futur plan payant (création via Scheduling API).
import type { BookingResult, BookingType } from '#shared/types/booking'
import { contact as atelier } from '~/utils/content'

defineProps<{
  result: BookingResult
  type: BookingType
  dayLabel: string
  time: string
}>()

const emit = defineEmits<{ (e: 'restart'): void }>()

const TYPE_LABELS: Record<BookingType, string> = {
  repair: 'Réparation confiée',
  workshop: 'Atelier participatif',
}
</script>

<template>
  <div class="rounded-2xl bg-creme-50 p-6 text-center ring-1 ring-charbon/10 sm:p-8">
    <span class="inline-grid size-14 place-items-center rounded-full bg-terracotta text-creme">
      <TechIcon :name="result.status === 'confirmed' ? 'check' : 'calendar'" :size="30" label="Réservation" />
    </span>

    <!-- Cas confirmé (plan payant, futur) -->
    <template v-if="result.status === 'confirmed'">
      <h3 class="mt-4 text-xl font-bold text-charbon">Réservation confirmée&nbsp;!</h3>
      <p class="mx-auto mt-2 max-w-md text-charbon/70">
        Votre rendez-vous est bien enregistré. Un e-mail de confirmation vous a été envoyé.
      </p>
    </template>

    <!-- Cas handoff (plan Free) : dernière étape sur Calendly -->
    <template v-else>
      <h3 class="mt-4 text-xl font-bold text-charbon">Plus qu'une étape&nbsp;!</h3>
      <p class="mx-auto mt-2 max-w-md text-charbon/70">
        Votre créneau et vos informations sont prêts. Validez la réservation sur la
        page sécurisée pour la rendre définitive.
      </p>
    </template>

    <!-- Récapitulatif du rendez-vous -->
    <div class="mx-auto mt-6 max-w-sm rounded-xl bg-creme p-5 text-left ring-1 ring-charbon/10">
      <p class="font-semibold text-charbon">{{ TYPE_LABELS[type] }}</p>
      <p class="mt-1 text-charbon/80">{{ dayLabel }} · {{ time }}</p>
      <p class="mt-3 flex items-center gap-2 text-sm text-charbon/65">
        <TechIcon name="pin" :size="16" class="shrink-0 text-terracotta" />
        {{ atelier.name }}, {{ atelier.address.city }}
      </p>
    </div>

    <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
      <a
        v-if="result.status !== 'confirmed' && result.bookingUrl"
        :href="result.bookingUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-6 py-3 font-semibold text-creme transition-colors hover:bg-terracotta-600"
      >
        Valider ma réservation
        <TechIcon name="arrowUpRight" :size="18" />
      </a>
      <UButton color="neutral" variant="outline" size="lg" @click="emit('restart')">
        Réserver un autre créneau
      </UButton>
    </div>
  </div>
</template>
