<script setup lang="ts">
// Récapitulatif avant confirmation. Permet de modifier chaque partie
// sans recommencer tout le parcours.
import type { BookingContact, BookingType } from '#shared/types/booking'

defineProps<{
  type: BookingType
  dayLabel: string
  time: string
  contact: BookingContact
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'edit-slot'): void
  (e: 'edit-info'): void
}>()

const TYPE_LABELS: Record<BookingType, string> = {
  repair: 'Réparation confiée',
  workshop: 'Atelier participatif',
}
</script>

<template>
  <div class="rounded-2xl bg-creme-50 p-5 ring-1 ring-charbon/10 sm:p-7">
    <h3 class="text-base font-bold text-charbon">Vérifiez votre réservation</h3>

    <dl class="mt-5 space-y-4">
      <!-- Créneau -->
      <div class="flex items-start justify-between gap-4 border-b border-charbon/10 pb-4">
        <div class="flex items-start gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <TechIcon name="calendar" :size="22" />
          </span>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-charbon/50">
              {{ TYPE_LABELS[type] }}
            </dt>
            <dd class="mt-0.5 font-semibold text-charbon">{{ dayLabel }}</dd>
            <dd class="text-charbon/70">à {{ time }}</dd>
          </div>
        </div>
        <UButton color="neutral" variant="ghost" size="sm" @click="emit('edit-slot')">
          Modifier
        </UButton>
      </div>

      <!-- Coordonnées -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <TechIcon name="users" :size="22" />
          </span>
          <div class="min-w-0">
            <dt class="text-xs font-medium uppercase tracking-wide text-charbon/50">Coordonnées</dt>
            <dd class="mt-0.5 font-semibold text-charbon">
              {{ contact.firstName }}<template v-if="contact.lastName"> {{ contact.lastName }}</template>
            </dd>
            <dd class="truncate text-charbon/70">{{ contact.email }}</dd>
            <dd v-if="contact.phone" class="text-charbon/70">{{ contact.phone }}</dd>
            <dd v-if="contact.problem" class="mt-1 text-sm text-charbon/60">« {{ contact.problem }} »</dd>
          </div>
        </div>
        <UButton color="neutral" variant="ghost" size="sm" @click="emit('edit-info')">
          Modifier
        </UButton>
      </div>
    </dl>

    <div class="mt-6">
      <UButton
        color="primary"
        size="xl"
        block
        :loading="submitting"
        class="font-semibold"
        @click="emit('confirm')"
      >
        Confirmer ma réservation
      </UButton>
      <p class="mt-3 text-center text-xs text-charbon/55">
        Un e-mail de confirmation vous sera envoyé par l'atelier.
      </p>
    </div>
  </div>
</template>
